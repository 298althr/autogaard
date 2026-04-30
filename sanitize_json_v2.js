const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'gemini-code-1777564606732.json');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

let fixedLines = [];
let inBrandArray = false;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // 1. Identify Brand start
    const brandMatch = line.match(/"([^"]+)":\s*,/);
    if (brandMatch && !line.includes('common_issues') && !line.includes('brand_traits')) {
        fixedLines.push(`  "${brandMatch[1]}": [`);
        inBrandArray = true;
        // Check if next line is a property (missing {)
        let nextLine = lines[i+1]?.trim();
        if (nextLine && nextLine.startsWith('"')) {
            fixedLines.push('    {');
        }
        continue;
    }

    // 2. Fix empty properties
    if (line.endsWith(':,') || line.endsWith(': ,')) {
        line = line.replace(/:\s*,$/, ': [],');
    }

    // 3. Fix missing quotes on keys (heuristic)
    if (line.match(/^[a-z_]+:/i)) {
        line = '"' + line.replace(/:/, '":');
    }

    fixedLines.push('    ' + line);
}

const finalContent = fixedLines.join('\n');
fs.writeFileSync(filePath, finalContent);
console.log('Sanitation attempt 2 completed.');
