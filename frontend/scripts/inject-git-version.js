const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Get the git commit hash
  const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  // Get the git branch name
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  const version = `${branch}-${commitHash}`;

  // Path to the git-version.ts file (now relative to frontend directory)
  const gitVersionPath = path.join(process.cwd(), 'src', 'lib', 'git-version.ts');
  
  // Read the current content
  let content = fs.readFileSync(gitVersionPath, 'utf8');
  
  // Replace the placeholder with the actual version
  content = content.replace('__GIT_VERSION__', version);
  
  // Write the updated content back
  fs.writeFileSync(gitVersionPath, content);
  
  console.log(`Git version ${version} injected into git-version.ts`);
} catch (error) {
  console.error('Error injecting git version:', error);
  process.exit(1);
} 