import { get } from 'svelte/store';
import { character_store } from './character_store';
import { detectConflicts } from './conflict_detection';

/**
 * Debug function to analyze character store and provenance
 * This helps us understand why conflicts aren't being detected
 */
export function debugCharacterState() {
	const character = get(character_store);
	
	console.log('=== CHARACTER STORE DEBUG ===');
	console.log('Skills array:', character.skills);
	console.log('Proficiencies array:', character.proficiencies);
	
	if (character._provenance) {
		console.log('\n=== PROVENANCE ANALYSIS ===');
		for (const [scopeId, prov] of Object.entries(character._provenance)) {
			console.log(`\nScope: ${scopeId}`);
			
			// Handle both old and new provenance formats
			const changes = ('_set' in prov && prov._set) ? prov._set : prov;
			if (changes) {
				console.log('  Changes:', changes);
				
				// Specifically look for skills
				if (changes.skills) {
					console.log(`  -> Added skills: ${JSON.stringify(changes.skills)}`);
				}
				if (changes.proficiencies) {
					console.log(`  -> Added proficiencies: ${JSON.stringify(changes.proficiencies)}`);
				}
			}
		}
	} else {
		console.log('No provenance data found');
	}
	
	console.log('\n=== CONFLICT DETECTION TEST ===');
	const conflicts = detectConflicts();
	console.log('Conflicts detected:', conflicts);
	
	return {
		character,
		conflicts
	};
}

/**
 * Function to be called from browser console for debugging
 */
if (typeof window !== 'undefined') {
	(window as any).debugConflicts = debugCharacterState;
	
	// Auto-run on import for immediate debugging
	// Add a small delay to ensure stores are initialized
	setTimeout(() => {
		console.log('🚀 AUTO-RUNNING CONFLICT DEBUG');
		debugCharacterState();
	}, 1000);
}