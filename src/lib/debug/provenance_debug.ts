import { get } from 'svelte/store';
import { character_store } from '../stores/character_store';

/**
 * Debug utility to analyze character store provenance and identify data integrity issues
 */
export function debugProvenance() {
	const char = get(character_store);
	
	console.log('=== CHARACTER STORE DEBUG ===');
	console.log('Skills array:', char.skills);
	console.log('Provenance data:', char._provenance);
	
	if (char._provenance) {
		console.log('\n=== PROVENANCE ANALYSIS ===');
		for (const [scopeId, prov] of Object.entries(char._provenance)) {
			console.log(`\nScope: ${scopeId}`);
			
			// Handle both old and new provenance formats
			if ('_set' in prov && prov._set) {
				console.log('  _set:', prov._set);
				if (prov._set.skills) {
					console.log(`  → Added skills: [${prov._set.skills.join(', ')}]`);
				}
			} else {
				// Old flat format
				console.log('  Flat format:', prov);
				if (prov.skills) {
					console.log(`  → Added skills: [${prov.skills.join(', ')}]`);
				}
			}
		}
	}
	
	// Analyze skill sources with detailed instance counting
	console.log('\n=== SKILL SOURCE ANALYSIS ===');
	const skillContributions: Record<string, Record<string, number>> = {}; // skill -> {scopeId -> count}
	
	if (char._provenance) {
		for (const [scopeId, prov] of Object.entries(char._provenance)) {
			const changes = ('_set' in prov && prov._set) ? prov._set : prov;
			if (changes && Array.isArray(changes.skills)) {
				for (const skill of changes.skills) {
					if (!skillContributions[skill]) {
						skillContributions[skill] = {};
					}
					skillContributions[skill][scopeId] = (skillContributions[skill][scopeId] || 0) + 1;
				}
			}
		}
	}
	
	for (const [skill, contributions] of Object.entries(skillContributions)) {
		const sources = Object.keys(contributions);
		const totalExpected = Object.values(contributions).reduce((sum, count) => sum + count, 0);
		
		console.log(`${skill}:`);
		for (const [scopeId, count] of Object.entries(contributions)) {
			console.log(`  → ${scopeId}: ${count} instance(s)`);
		}
		
		// Count occurrences in actual skills array
		const actualCount = char.skills.filter(s => s === skill).length;
		
		console.log(`  📊 Expected: ${totalExpected}, Actual: ${actualCount}`);
		if (actualCount !== totalExpected) {
			console.log(`  ⚠️  MISMATCH: Expected ${totalExpected}, found ${actualCount} in skills array`);
		} else {
			console.log(`  ✅ CORRECT: Instance count matches expectations`);
		}
	}
	
	// Check for duplicates
	const skillCounts: Record<string, number> = {};
	for (const skill of char.skills) {
		skillCounts[skill] = (skillCounts[skill] || 0) + 1;
	}
	
	console.log('\n=== DUPLICATE DETECTION ===');
	for (const [skill, count] of Object.entries(skillCounts)) {
		if (count > 1) {
			console.log(`🔴 DUPLICATE: ${skill} appears ${count} times`);
		}
	}
	
	return {
		skills: char.skills,
		provenance: char._provenance,
		skillSources,
		duplicates: Object.entries(skillCounts).filter(([_, count]) => count > 1)
	};
}

/**
 * Monitor character store changes and automatically debug when duplicates are detected
 */
export function startProvenanceMonitoring() {
	let previousSkills: string[] = [];
	
	character_store.subscribe((char) => {
		const currentSkills = [...char.skills];
		
		// Check for duplicates
		const skillCounts: Record<string, number> = {};
		for (const skill of currentSkills) {
			skillCounts[skill] = (skillCounts[skill] || 0) + 1;
		}
		
		const duplicates = Object.entries(skillCounts).filter(([_, count]) => count > 1);
		
		if (duplicates.length > 0) {
			console.log('🚨 DUPLICATES DETECTED - Running debug analysis...');
			debugProvenance();
		}
		
		previousSkills = currentSkills;
	});
}