import fs from 'fs';
import path from 'path';

/**
 * Function: createDirectory
 * Purpose: Creates a directory if it doesn't already exist.
 * @param {string} dirPath - The path of the directory to create.
 */
function createDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    } else {
        console.log(`Directory already exists: ${dirPath}`);
    }
}

/**
 * Function: createFile
 * Purpose: Creates a file with optional content.
 * @param {string} filePath - The path of the file to create.
 * @param {string} content - The content to write into the file (optional).
 */
function createFile(filePath, content = '') {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Created file: ${filePath}`);
    } else {
        console.log(`File already exists: ${filePath}`);
    }
}

/**
 * Function: generateProject
 * Purpose: Generates the project structure and integrates user-defined code.
 * @param {Object} userConfig - The user-defined configuration for project components.
 */
function generateProject(userConfig) {
    console.log(`Generating project structure based on user configuration...`);

    const baseDir = process.cwd();

    // Create directories
    const directories = [
        path.join(baseDir, 'Project'),
        path.join(baseDir, 'Libs'),
        path.join(baseDir, 'Modules'),
        path.join(baseDir, 'Logs'),
    ];
    directories.forEach(createDirectory);

    // Create essential files
    const files = [
        { path: path.join(baseDir, 'project.mek'), content: '// MekScript Project File' },
        { path: path.join(baseDir, 'config.mson'), content: `{ "name": "${userConfig.projectName}", "version": "${userConfig.version}" }` },
        { path: path.join(baseDir, 'Logs', 'project.log'), content: '' }, // Empty log file
    ];
    files.forEach(file => createFile(file.path, file.content));

    // Add user-defined modules
    userConfig.modules.forEach(module => {
        const moduleFilePath = path.join(baseDir, 'Modules', `${module.name}.js`);
        createFile(moduleFilePath, module.code);
    });

    console.log(`Project structure generated successfully for '${userConfig.projectName}'.`);
}

/**
 * Function: readUserCode
 * Purpose: Reads user-defined code from a JSON file.
 * @param {string} filePath - The path of the JSON file containing user code configuration.
 * @returns {Object} - The parsed user code configuration.
 */
function readUserCode(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Configuration file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
}

/**
 * Main entry point for the builder.
 * Parses arguments and executes commands.
 */
function executeBuilder() {
    const args = process.argv.slice(2);
    const configArg = args.find(arg => arg.startsWith('--config='));

    if (!configArg) {
        console.log('Usage: node project-setup.js --config=<path_to_config.json>');
        return;
    }

    const configPath = configArg.split('=')[1];

    try {
        const userConfig = readUserCode(configPath);
        generateProject(userConfig);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Execute the builder
executeBuilder();
