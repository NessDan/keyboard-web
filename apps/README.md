# Applications

This directory should contain sub-projects (like your React Wizard).
Each sub-folder should be a standalone project with a `package.json` that has a `build` script.

The deployment script will:
1. Enter each folder here.
2. Run `npm install` and `npm run build`.
3. Copy the `dist` folder to the website root under the same name.

Example:
`apps/wizard` -> `https://your-site.com/wizard`
