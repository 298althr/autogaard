const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Sav-Dev\\Documents\\Autogaard\\Autogaard\\docx_temp\\word\\document.xml', 'utf8');
const regex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(match[1]);
}
