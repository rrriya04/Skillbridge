const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Spawning SkillBridge server for test suite...');

const serverProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe'],
  env: process.env,
});

let serverReady = false;

serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  // console.log('[Server Output]:', output);
  if (output.includes('SkillBridge Server running') || output.includes('Base URL: http://localhost:5000')) {
    if (!serverReady) {
      serverReady = true;
      console.log('✅ Server is ready. Running test suite...\n');
      runSuite();
    }
  }
});

serverProcess.stderr.on('data', (data) => {
  // console.error('[Server Err]:', data.toString());
});

const runSuite = () => {
  const testProcess = spawn('node', ['test-suite.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: process.env,
  });

  testProcess.on('exit', (code) => {
    console.log(`\n🛑 Shutting down test server (exit code: ${code})...`);
    serverProcess.kill();
    process.exit(code);
  });
};

setTimeout(() => {
  if (!serverReady) {
    console.error('Timed out waiting for server to start.');
    serverProcess.kill();
    process.exit(1);
  }
}, 15000);
