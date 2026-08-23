import http from 'http';
import jwt from 'jsonwebtoken';

const payload = {
  id: '00000000-0000-0000-0000-000000000000',
  rol: 'superAdmin'
};
// Use the secret from env or a fallback if you know it, but actually we can just read the env file
import fs from 'fs';
import path from 'path';

let secret = 'jwt_secret_dev';
try {
  const envFile = fs.readFileSync('.env', 'utf8');
  const match = envFile.match(/JWT_SECRET_ACCESS_TOKEN=(.*)/);
  if (match) secret = match[1].trim();
} catch(e) {}

const token = jwt.sign(payload, secret, { expiresIn: '1m' });

const req = http.request('http://localhost:3000/api/firmware/logs?limit=5', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json.data.map(d => ({
        id: d.id,
        userName: d.tarjeta?.usuario?.nombre,
        foto: d.tarjeta?.usuario?.foto
      })), null, 2));
    } catch (e) {
      console.log("Error parsing:", data);
    }
  });
});
req.end();
