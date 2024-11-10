const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');

// 証明書ファイルを読み込む
const ca = fs.readFileSync('../certs/server.crt');

const backend = process.argv[2] ?? 'http://nodejs1:3000';
console.log(`backend: ${backend}`);

// オプション設定
const ws = new WebSocket(
  `wss://localhost/?backend=${backend}`,
  {
    rejectUnauthorized: false,
    ca: ca
  }
);

ws.on('open', () => {
  console.log('Connected to server');
  ws.send('Hello Server!');
});

ws.on('message', (message) => {
  console.log(`Received from server: ${message}`);
});

ws.on('close', () => {
  console.log('Disconnected from server');
});

ws.on('error', (error) => {
  console.error('Error:', error.message);
});
