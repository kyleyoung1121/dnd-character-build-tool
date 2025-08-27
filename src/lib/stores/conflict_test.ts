import { get } from 'svelte/store';
import { character_store } from './character_store';
import { applyChoice } from './character_store_helpers';
import { detectConflicts } from './conflict_detection';

/**
 * Test function to simulate the Bard + High Elf Perception conflict scenario
 */
export function testBardHighElfConflict() {
	console.log('🧪 Testing Bard + High Elf Perception conflict scenario');

	// Clear character store first
	const initialChar = get(character_store);
	if (initialChar._provenance) {
		for (const scopeId of Object.keys(initialChar._provenance)) {
			// Don't actually revert, just clear the store manually for testing
		}
	}

	// Step 1: Simulate selecting Bard class
	console.log('1️⃣ Selecting Bard class...');
	applyChoice('class:Bard', { class: 'Bard' });

	// Step 2: Simulate selecting Perception as a Bard skill (index 0)
	console.log('2️⃣ Selecting Perception as Bard skill...');
	applyChoice('feature:Skill Proficiencies:0', { skills: ['Perception'] });

	let char1 = get(character_store);
	console.log('After Bard selection:');
	console.log('- Skills:', char1.skills);
	console.log('- Provenance keys:', Object.keys(char1._provenance || {}));

	// Step 3: Simulate selecting High Elf race
	console.log('3️⃣ Selecting High Elf race...');
	applyChoice('race:High Elf', { race: 'High Elf' });

	// Step 4: Simulate High Elf Keen Senses (automatic)
	console.log('4️⃣ Applying High Elf Keen Senses...');
	applyChoice('feature:Keen Senses', { skills: ['Perception'] });

	let char2 = get(character_store);
	console.log('After High Elf selection:');
	console.log('- Skills:', char2.skills);
	console.log('- Provenance keys:', Object.keys(char2._provenance || {}));

	// Step 5: Test conflict detection
	console.log('5️⃣ Running conflict detection...');
	const conflicts = detectConflicts();
	console.log('Conflicts detected:', conflicts);

	if (conflicts.hasConflicts) {
		console.log('✅ SUCCESS: Conflict detected!');
		for (const conflict of conflicts.conflicts) {
			console.log(
				`- ${conflict.type}: ${conflict.value} (sources: ${conflict.sources.join(', ')})`
			);
			console.log(`- Affected tabs: ${conflict.affectedTabs?.join(', ') || 'none'}`);
		}
	} else {
		console.log('❌ FAILURE: No conflicts detected');
	}

	return conflicts;
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
	(window as any).testBardHighElfConflict = testBardHighElfConflict;
}
