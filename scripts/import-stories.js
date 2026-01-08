const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const storiesDir = path.join(__dirname, 'stories');
const storyFiles = fs.readdirSync(storiesDir).filter(f => f.endsWith('.json'));

console.log(`📚 Found ${storyFiles.length} story files to import\n`);

storyFiles.forEach((file, index) => {
    const filePath = path.join(storiesDir, file);
    const storyData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    console.log(`${index + 1}. Creating: ${storyData.title}`);

    try {
        // Use npx sanity CLI with piped JSON
        const command = `npx sanity documents create --no-color`;
        const result = execSync(command, {
            input: JSON.stringify(storyData),
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        });

        console.log(`   ✅ Created successfully`);
        console.log(`   ${result.trim()}\n`);
    } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);
    }
});

console.log('✅ Story import complete!');
