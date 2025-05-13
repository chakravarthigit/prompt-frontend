const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create src directory if it doesn't exist
if (!fs.existsSync('src')) {
  fs.mkdirSync('src', { recursive: true });
}

console.log('Setting up the project structure...');

// Copy files from frontend to src
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Copy all JS files directly in the frontend folder to src
const frontendFiles = fs.readdirSync('frontend');
frontendFiles.forEach(file => {
  const filePath = path.join('frontend', file);
  
  if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
    const destPath = path.join('src', file);
    fs.copyFileSync(filePath, destPath);
    console.log(`Copied: ${filePath} -> ${destPath}`);
  }
});

// Copy components folder
copyDir('frontend/components', 'src/components');

// Copy pages folder
copyDir('frontend/pages', 'src/pages');

// Copy CSS file
if (fs.existsSync('frontend/index.css')) {
  fs.copyFileSync('frontend/index.css', 'src/index.css');
  console.log('Copied: frontend/index.css -> src/index.css');
}

console.log('Project setup complete! You can now run "npm start" to start the development server.'); 