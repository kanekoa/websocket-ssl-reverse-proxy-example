const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');

// 証明書ファイルを読み込む
const ca = fs.readFileSync('../certs/server.crt');

const backends = [
  'http://nodejs1:3000',
  'http://nodejs2:3000'
];

const parallel = process.argv[2] ?? 1024;
console.log(`parallel ${parallel}`);

console.log('==========')

for (let index = 0; index < parallel; index++) {

  const backend = backends[index % backends.length];

  // オプション設定
  const ws = new WebSocket(
    `wss://localhost/?backend=${backend}`,
    {
      rejectUnauthorized: false,
      ca: ca
    }
  );
  
  ws.on('open', () => {
    // console.log(`${index} Connected to server`);
  
    setInterval(() => {
      ws.send(`${index} Hello Server!`);
    }, 1000);
  
  });
  
  ws.on('message', (message) => {
    // console.log(`${index} Received from server: ${message}`);
  });
  
  ws.on('close', () => {
    console.log(`${index} Disconnected from server`);
  });
  
  ws.on('error', (error) => {
    console.error(`${index} Error:`, error.message);
  });
  
}

