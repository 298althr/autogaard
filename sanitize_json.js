const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'gemini-code-1777564606732.json');
let content = fs.readFileSync(filePath, 'utf8');

// Fix "key":, to "key": [], or "key": [
// This is a heuristic fix for the specific corruption pattern
content = content.replace(/"(Toyota|Lexus|Honda|Mercedes-Benz|BMW|Land Rover|Nissan|Kia|Hyundai|Acura|Infiniti|Chevrolet|Ford|GMC|Ram|Audi|Volvo)":,/g, '"$1": [');
content = content.replace(/"(brand_traits|common_issues)":,/g, '"$1": [],');
content = content.replace(/ reliability: ([\d.]+),/g, '"reliability": $1,'); // Fixing potential missing quotes

// Additional cleanup for trailing commas in objects
content = content.replace(/,(\s*[}\]])/g, '$1');

try {
    JSON.parse(content);
    console.log('✅ JSON successfully sanitized and validated.');
    fs.writeFileSync(filePath, content);
} catch (err) {
    console.error('❌ Sanitation failed. Still has errors:', err.message);
    // Let's try a more aggressive fix if it failed
    content = content.replace(/:,/g, ': [],');
    try {
        JSON.parse(content);
        console.log('✅ Aggressive sanitation worked.');
        fs.writeFileSync(filePath, content);
    } catch (err2) {
        console.error('❌ Aggressive sanitation also failed:', err2.message);
    }
}
