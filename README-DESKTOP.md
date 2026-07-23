# NexaScreen Desktop App (.exe)

এই গাইডটি Windows .exe ফাইল তৈরি এবং ব্যবহার করার জন্য।

## প্রয়োজনীয়তা

- **Node.js 18+** - https://nodejs.org/
- **Git** (অপশনাল)
- **Windows 7 বা তার উপরে**

## ডেস্কটপ অ্যাপ তৈরি করুন

### Step 1: Repository ক্লোন করুন

```bash
git clone https://github.com/tanvirjahanshakib/NexaScreen.git
cd NexaScreen
git checkout electron-desktop-app
```

### Step 2: .exe তৈরি করুন

```bash
npm run build-exe
```

অথবা পোর্টেবল সংস্করণ (ইনস্টলেশন ছাড়াই):

```bash
npm run build-portable
```

### Step 3: ফাইল খুঁজুন

.exe ফাইল এখানে থাকবে:
```
NexaScreen/dist/NexaScreen Setup 1.0.0.exe  (Installer)
অথবা
NexaScreen/dist/NexaScreen 1.0.0.exe  (Portable)
```

## .exe রান করুন

### ইনস্টলার সংস্করণ:
1. `NexaScreen Setup 1.0.0.exe` ডাবল-ক্লিক করুন
2. ইনস্টলেশন নির্দেশাবলী অনুসরণ করুন
3. "NexaScreen" শুরু করুন Start Menu থেকে

### পোর্টেবল সংস্করণ:
1. `NexaScreen 1.0.0.exe` ডাবল-ক্লিক করুন
2. অ্যাপ স্বয়ংক্রিয়ভাবে খোলে

## ব্যবহার করুন

### Host Mode (স্ক্রিন শেয়ার করুন):
1. অ্যাপ চালু করুন
2. **Start Share** ক্লিক করুন
3. আপনার স্ক্রিন বা উইন্ডো নির্বাচন করুন

### Viewer Mode (স্ক্রিন দেখুন):
1. একই নেটওয়ার্কে অন্য ডিভাইস থেকে ব্রাউজার খুলুন
2. এই URL ভিজিট করুন:
   ```
   http://<HOST-IP>:3000/viewer
   ```
   (আপনার host এর IP address দিয়ে `<HOST-IP>` প্রতিস্থাপন করুন)

## Troubleshooting

### "Windows ডিফেন্ডার" ব্লক করছে?
- **আরও তথ্য** ক্লিক করুন
- **যাইহোক চালান** ক্লিক করুন

### পোর্ট 3000 ইতিমধ্যে ব্যবহৃত?
```bash
set PORT=4000
NexaScreen.exe
```

### দ্বিতীয় ডিভাইস সংযোগ করতে পারে না?
- উভয় ডিভাইস একই Wi-Fi নেটওয়ার্কে আছে কিনা চেক করুন
- ফায়ারওয়াল অনুমতি দিয়েছে কিনা চেক করুন
- Host এর IP এড্রেস সঠিক কিনা যাচাই করুন:
  ```
  Windows Command Prompt এ: ipconfig
  IPv4 Address দেখুন
  ```

## ডেভেলপমেন্ট (সোর্স থেকে)

```bash
git checkout electron-desktop-app
npm install
npm run electron-dev
```

ডেভেলপার কনসোল খোলা থাকবে স্বয়ংক্রিয়ভাবে।

## ডিস্ট্রিবিউট করুন

`dist/` ফোল্ডার থেকে `.exe` ফাইল শেয়ার করুন। অন্য কাউকে শুধু .exe ডাউনলোড এবং রান করতে হবে - কোনো ইনস্টলেশন প্রয়োজন নেই (পোর্টেবল সংস্করণের জন্য)।
