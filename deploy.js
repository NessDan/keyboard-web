const ghpages = require('gh-pages');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/* 
  Deploy Script
  1. Clean _site.
  2. Copy 'public' folder contents to _site root.
  3. Iterate 'apps' folder:
     - Build each app.
     - Copy dist to _site/<app_name>.
  4. Push _site to gh-pages.
*/

const DIST_DIR = path.join(__dirname, '_site');
const PUBLIC_DIR = path.join(__dirname, 'public');
const APPS_DIR = path.join(__dirname, 'apps');

console.log('🚀 Starting deployment...');

// 0. Update Submodules
try {
    console.log('🔄 Updating submodules...');
    execSync('git submodule update --init --remote --recursive --merge', { stdio: 'inherit' });
} catch (err) {
    console.error('❌ Failed to update submodules:', err);
    // Proceeding anyway might be risky, but we'll let it try to build what's there
    // or you could process.exit(1) here if strict sync is required.
    console.log('⚠️  Continuing deployment with existing submodule states...');
}

// 1. Clean & Create _site
if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR);

// 2. Copy Public Static Files
if (fs.existsSync(PUBLIC_DIR)) {
    console.log('📂 Copying public static files...');
    fs.cpSync(PUBLIC_DIR, DIST_DIR, { recursive: true });
} else {
    console.log('⚠️  No public directory found. Proceeding with empty root.');
}

// 3. Build & Copy Apps
if (fs.existsSync(APPS_DIR)) {
    const apps = fs.readdirSync(APPS_DIR);
    apps.forEach(appName => {
        const appPath = path.join(APPS_DIR, appName);
        // Ensure it's a directory
        if (!fs.statSync(appPath).isDirectory()) return;

        console.log(`🔨 Processing app: ${appName}...`);

        // Check for package.json
        if (fs.existsSync(path.join(appPath, 'package.json'))) {
            try {
                console.log(`   📦 Installing & Building ${appName}...`);
                execSync('npm install', { cwd: appPath, stdio: 'inherit' });
                execSync('npm run build', { cwd: appPath, stdio: 'inherit' });

                // Assume output is 'dist', check for it
                const buildOutput = path.join(appPath, 'dist');
                if (fs.existsSync(buildOutput)) {
                    const dest = path.join(DIST_DIR, appName);
                    console.log(`   📂 Copying artifacts to ${dest}...`);
                    fs.cpSync(buildOutput, dest, { recursive: true });
                } else {
                    console.error(`   ❌ Build successful but 'dist' folder not found in ${appName}`);
                    // Optional: Fail or continue? We'll log error.
                }
            } catch (err) {
                console.error(`   ❌ Failed to build ${appName}`, err);
                process.exit(1);
            }
        } else {
            console.log(`   ⚠️  No package.json in ${appName}. Skipping build/deployment.`);
        }
    });
}

// 4. Deploy to gh-pages
console.log('gh-pages deployment starting...');
ghpages.publish(DIST_DIR, {
    branch: 'gh-pages',
}, (err) => {
    if (err) {
        console.error('❌ Deployment failed:', err);
    } else {
        console.log('✅ Deployment complete! Check https://nessdan.github.io/keyboard-web');
    }
});
