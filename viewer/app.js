const socket = io();
const statusEl = document.getElementById('status');
const videoEl = document.getElementById('remoteVideo');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let peer;

socket.emit('join-role', 'viewer');

socket.on('offer', async (offer) => {
  try {
    await createPeer();
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    socket.emit('answer', answer);
    setStatus('Receiving stream...');
  } catch (error) {
    console.error('Failed to process offer', error);
    setStatus('Could not connect to host stream.');
  }
});

socket.on('ice-candidate', async (candidate) => {
  if (!peer || !candidate) return;
  try {
    await peer.addIceCandidate(candidate);
  } catch (error) {
    console.error('Failed to add ICE candidate', error);
  }
});

socket.on('host-disconnected', () => {
  closePeer();
  videoEl.srcObject = null;
  setStatus('Host disconnected. Waiting for host...');
});

fullscreenBtn.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) {
      await videoEl.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error('Fullscreen failed', error);
  }
});

async function createPeer() {
  closePeer();
  peer = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    iceCandidatePoolSize: 2
  });

  peer.ontrack = (event) => {
    const [stream] = event.streams;
    if (stream) {
      videoEl.srcObject = stream;
      setStatus('Live stream connected.');
    }
  };

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', { role: 'viewer', candidate: event.candidate });
    }
  };

  peer.onconnectionstatechange = () => {
    if (!peer) return;
    if (['failed', 'disconnected', 'closed'].includes(peer.connectionState)) {
      setStatus('Connection lost. Waiting for host to restart share...');
    }
  };
}

function closePeer() {
  if (peer) {
    peer.ontrack = null;
    peer.onicecandidate = null;
    peer.close();
    peer = null;
  }
}

function setStatus(message) {
  statusEl.textContent = message;
}
