const fs = require('fs');
const path = require('path');

function getJsonData(name) {
    const filePath = path.join(__dirname, '..', name);

    const data = fs.readFileSync(filePath, 'utf8');
    console.log('JSON data read successfully:');
    
    return data;
}

module.exports = getJsonData;