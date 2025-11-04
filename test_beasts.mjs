import { beasts, byCR, bySource } from './src/lib/data/beasts/index.ts';

console.log('✅ Successfully imported beasts module');
console.log(`📊 Total beasts: ${beasts.length}`);
console.log(`🐺 First beast: ${beasts[0].name}`);
console.log(`🔍 Beasts with CR <= 0.25: ${byCR(0.25).length}`);
console.log(`🧙 Wizard beasts: ${bySource('Wizard').length}`);
console.log(`🐉 Druid beasts: ${bySource('Druid').length}`);
console.log(`🏹 Ranger beasts: ${bySource('Ranger').length}`);
console.log(`👹 Warlock beasts: ${bySource('Warlock').length}`);
