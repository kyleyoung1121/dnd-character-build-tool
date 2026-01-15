const fs = require('fs');
let content = fs.readFileSync('src/routes/(creation)/equipment/+page.svelte', 'utf8');

// Remove the problematic {@const} line
content = content.replace(/\{@const subChoicesComplete = areSubChoicesComplete\(choiceIndex\)\}/g, '');

// Replace the variable references
content = content.replace(/class:incomplete=\{!subChoicesComplete\}/g, 'class:incomplete={!subchoiceCompletionStates[choiceIndex]}');
content = content.replace(/class:complete=\{subChoicesComplete\}/g, 'class:complete={subchoiceCompletionStates[choiceIndex]}');

fs.writeFileSync('src/routes/(creation)/equipment/+page.svelte', content);
console.log('Fixed!');
