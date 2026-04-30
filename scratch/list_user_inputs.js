const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\Sav-Dev\\.gemini\\antigravity\\brain\\905b45b0-2461-4798-aa69-d08e05c8f734\\.system_generated\\logs\\overview.txt');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT') {
      console.log(`[${data.step_index}] ${data.content.substring(0, 100).replace(/\n/g, ' ')}...`);
    }
  } catch (e) {}
});
