const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const pagesDir = path.join(__dirname, 'src', 'pages');

walkDir(pagesDir, (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove specific margin and padding top classes that were used to clear the header
    content = content.replace(/\b(pt-24|pt-20|pt-16|pt-12|mt-24|mt-20|mt-16|mt-14|mt-12)\b/g, '');
    
    // Clean up multiple spaces that might result
    content = content.replace(/className=(["']|\{`)(.*?)(\1|\`\})/g, (match, quote1, classes, quote2) => {
      let cleanClasses = classes.replace(/\s+/g, ' ').trim();
      return `className=${quote1}${cleanClasses}${quote2}`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Cleaned spacing in: ' + filePath);
    }
  }
});
