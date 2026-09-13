const QRCode = require('qrcode');

const localIpUrl = 'exp://10.62.192.223:8081';
const localhostUrl = 'exp://localhost:8081';
const outputPath = 'C:\\Users\\ISHAAN\\.gemini\\antigravity-ide\\brain\\98aaa555-2e5c-4bc0-8a67-94ae1b4db8e9\\expo_qr.png';

// Terminal QR Code for LAN IP
QRCode.toString(localIpUrl, { type: 'terminal', small: true }, function (err, qrText) {
  console.log('\n======================================================');
  console.log('📱 EXPO GO LIVE LAN QR CODE (SCAN WITH SMARTPHONE):');
  console.log('======================================================\n');
  console.log(qrText);
  console.log('======================================================');
  console.log('LAN URL:       ' + localIpUrl);
  console.log('Local URL:     ' + localhostUrl);
  console.log('======================================================\n');
});

// PNG File QR Code
QRCode.toFile(outputPath, localIpUrl, {
  color: {
    dark: '#FF5A00',
    light: '#FFFFFF',
  },
  width: 450,
}, function (err) {
  if (err) console.error(err);
  console.log('Saved PNG QR Code to ' + outputPath);
});
