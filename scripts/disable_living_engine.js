const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const startToken = '<!-- =========================================================================\n             THE LIVING ENGINE // TECH STACK & PRODUCTION ECOSYSTEM';
const endToken = '<section id="design" class="py-16 md:py-24 relative overflow-hidden">';

const startIdx = content.indexOf(startToken);
const endIdx = content.indexOf(endToken);

if (startIdx === -1 || endIdx === -1) {
    console.error('Tokens not found:', { startIdx, endIdx });
    process.exit(1);
}

const replacement = `<!-- =========================================================================
             SECTION 01.5: THE LIVING ENGINE & ECOSYSTEM
             (Temporarily removed from live site per user request - full markup & scripts preserved in vault/components/living_engine_ecosystem.html)
             ========================================================================= -->

        <!-- =========================================================================
             SECTION 02: GRAPHIC DESIGN & CREATIVE DIRECTION
             ========================================================================= -->
        `;

content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully disabled Section 01.5 (The Living Engine & Ecosystem) from index.html!');
