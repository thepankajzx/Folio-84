const fs = require('fs');
const path = require('path');

const genPath = path.join(__dirname, '../generate_terminal.js');
let genContent = fs.readFileSync(genPath, 'utf8');

// 1. Remove Settings Button from Navbar
const settingsBtnRegex = /<!-- Sheet Settings Drawer Toggle -->\s*<button onclick="toggleSettingsModal\(\)"[\s\S]*?<\/button>/;
if (!settingsBtnRegex.test(genContent)) {
    console.warn('Could not find settings button regex in generate_terminal.js');
} else {
    genContent = genContent.replace(settingsBtnRegex, '');
    console.log('Removed Settings Button from Navbar');
}

// 2. Remove Settings Modal
const settingsModalRegex = /<!-- GOOGLE SHEET SETTINGS MODAL -->\s*<div id="settingsModal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
if (!settingsModalRegex.test(genContent)) {
    console.warn('Could not find settings modal regex in generate_terminal.js');
} else {
    genContent = genContent.replace(settingsModalRegex, '');
    console.log('Removed Google Sheet Settings Modal');
}

// 3. Remove window.APPS_SCRIPT_URL exposure
genContent = genContent.replace(/window\.APPS_SCRIPT_URL\s*=\s*APPS_SCRIPT_URL;\r?\n/, '');

// 4. Remove toggleSettingsModal and saveAndTestEndpoint functions
const settingsFnsRegex = /\/\/ Settings Modal\s*function toggleSettingsModal\(\)[\s\S]*?toggleSettingsModal\(\);\s*\}/;
if (settingsFnsRegex.test(genContent)) {
    genContent = genContent.replace(settingsFnsRegex, '');
    console.log('Removed toggleSettingsModal and saveAndTestEndpoint functions');
}

// 5. Update toggleTheme to trigger renderTimeMachine
const oldToggleTheme = `function toggleTheme() {
            const html = document.documentElement;
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            renderSingleChart();
            
        }`;

const newToggleTheme = `function toggleTheme() {
            const html = document.documentElement;
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            renderSingleChart();
            if (typeof renderTimeMachine === 'function' && window.IS_TM_EXPANDED) {
                renderTimeMachine();
            }
        }`;

if (genContent.includes(oldToggleTheme)) {
    genContent = genContent.replace(oldToggleTheme, newToggleTheme);
    console.log('Updated toggleTheme with renderTimeMachine hook');
} else {
    // Try normalized LF
    const oldToggleThemeLF = oldToggleTheme.replace(/\r\n/g, '\n');
    const newToggleThemeLF = newToggleTheme.replace(/\r\n/g, '\n');
    const normGen = genContent.replace(/\r\n/g, '\n');
    if (normGen.includes(oldToggleThemeLF)) {
        genContent = normGen.replace(oldToggleThemeLF, newToggleThemeLF);
        console.log('Updated toggleTheme (LF mode)');
    }
}

fs.writeFileSync(genPath, genContent, 'utf8');
console.log('generate_terminal.js cleaned successfully!');
