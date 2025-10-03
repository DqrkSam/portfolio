const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

// Read the source file
const sourceCode = fs.readFileSync('scripts.js', 'utf8');

// Obfuscate the code with advanced options
const obfuscationResult = JavaScriptObfuscator.obfuscate(sourceCode, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    numbersToExpressions: true,
    simplify: true,
    stringArrayShuffle: true,
    splitStrings: true,
    stringArrayThreshold: 1,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    debugProtection: true,
    debugProtectionInterval: true,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    rotateStringArray: true,
    selfDefending: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    renameGlobals: true,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 1
});

// Write the obfuscated code to a new file
fs.writeFileSync('scripts.min.js', obfuscationResult.getObfuscatedCode()); 