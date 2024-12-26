const path = require('path');
const { execSync } = require('child_process');

module.exports = async (context) => {
    const scriptPath = path.resolve(__dirname, 'postinstall.js');

    try {
        console.log('Running postinstall.js...');
        execSync(`node ${scriptPath}`, { stdio: 'inherit' });
        console.log('postinstall.js executed successfully.');
    } catch (error) {
        console.error('Failed to execute postinstall.js:', error);
    }
};
