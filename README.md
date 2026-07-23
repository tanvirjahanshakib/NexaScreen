# NexaScreen (LAN Second Screen MVP)

NexaScreen is a practical MVP that streams your host laptop screen to another device on the same local network.

## What this MVP does

- Host page starts from a local Node.js server
- Host can click **Start Share** / **Stop Share**
- Viewer opens `/viewer` on another device and receives a low-latency WebRTC stream
- Signaling is done with Socket.IO (offer/answer/ICE)
- Works for at least one viewer on the same Wi-Fi/LAN

## Important limitation

This is **NOT** a true OS-level "Extend these displays" virtual monitor.

It mirrors/streams the shared screen into a viewer page. True extended desktop support requires virtual display driver integration and deeper OS-level handling.

## Project structure

- `host/` → Node.js + Express + Socket.IO signaling server + host share UI
- `viewer/` → web viewer UI (fullscreen-capable receiver)

## Run locally

Requirements: Node.js 18+

```bash
npm install
npm run dev
```

Default port is `3000`. You can change it:

```bash
PORT=4000 npm run dev
```

## Open from devices

After start, logs show URLs like:

- `http://localhost:3000/` (host page)
- `http://localhost:3000/viewer` (viewer page)
- `http://<LAN-IP>:3000/` and `http://<LAN-IP>:3000/viewer`

Use the LAN viewer URL on the second device in the same network.

## Usage

1. On main laptop, open host URL (`/`)
2. On second device, open viewer URL (`/viewer`)
3. On host page, click **Start Share** and pick screen/window
4. To stop, click **Stop Share**
5. If viewer disconnects, reconnect viewer and restart sharing from host

## Troubleshooting

- Ensure both devices are on the same subnet/Wi-Fi
- Allow Node.js/app through firewall on the host machine
- If second device cannot connect, verify LAN IP with:
  - Windows: `ipconfig`
  - Linux/macOS: `ip addr` or `ifconfig`
- Screen capture may require secure context in some browsers; `localhost` generally works for host machine testing
- If LAN browser blocks capture flow, try Chrome/Edge and re-grant screen capture permissions

## Tech stack

- Node.js
- Express
- Socket.IO
- WebRTC
- Plain HTML/CSS/JS

## Download

You can download the latest release from GitHub:

- **Release page:** https://github.com/tanvirjahanshakib/NexaScreen/releases/tag/v1.0.0

### Install

1. Open the release page.
2. Download the correct file for your operating system from **Assets**:
   - Windows: `.exe` or `.msi`
   - macOS: `.dmg`
   - Linux: `.AppImage` or `.deb`
3. Install and run the app.

### If no installer is available

If you don’t see installer files in Assets, run from source:

```bash
git clone https://github.com/tanvirjahanshakib/NexaScreen.git
cd NexaScreen
npm install
npm run dev
```
