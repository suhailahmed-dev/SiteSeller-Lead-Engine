const axios = require('axios');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const configFile = path.join(__dirname, '..', 'data', 'config.json');

async function startTunnel() {
  console.log('🔄 Requesting quick tunnel from Cloudflare with 30s timeout...');
  try {
    const res = await axios.post('https://api.trycloudflare.com/tunnel', {}, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!res.data || !res.data.result) {
      throw new Error('Invalid tunnel response: ' + JSON.stringify(res.data));
    }

    const { id, account_tag, secret, hostname } = res.data.result;
    console.log(`✅ Tunnel Created! Hostname: https://${hostname}`);

    // Update config.json with public_url
    if (fs.existsSync(configFile)) {
      try {
        const cfg = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        cfg.public_url = `https://${hostname}`;
        fs.writeFileSync(configFile, JSON.stringify(cfg, null, 2));
        console.log(`📝 Updated public_url in config.json to https://${hostname}`);
      } catch (e) {
        console.error('Error updating config:', e.message);
      }
    }

    // Generate token
    const tokenPayload = {
      a: account_tag,
      t: id,
      s: secret
    };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    // Run cloudflared
    const cloudflaredBin = path.join(__dirname, '..', 'cloudflared.exe');
    console.log('🚀 Spawning cloudflared tunnel daemon...');

    const proc = spawn(cloudflaredBin, [
      'tunnel',
      'run',
      '--token',
      token,
      '--url',
      'http://localhost:3000'
    ], {
      stdio: 'inherit'
    });

    proc.on('exit', (code) => {
      console.log(`⚠️ cloudflared exited with code ${code}. Reconnecting in 5s...`);
      setTimeout(startTunnel, 5000);
    });

    proc.on('error', (err) => {
      console.error('Error running cloudflared:', err);
    });

  } catch (err) {
    console.error('❌ Failed to request tunnel:', err.message);
    console.log('Retrying in 5s...');
    setTimeout(startTunnel, 5000);
  }
}

startTunnel();
