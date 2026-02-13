import { character_store } from './character_store';
import { applyChoice } from './character_store_helpers';
import { addNotification } from './notification_store';

/**
 * Spell cleanup service that monitors character changes and removes invalid spell selections
 * This runs independently of the spells UI component, ensuring cleanup happens immediately
 * when class/race/subclass changes, even if the user never visits the spells page again
 */

let previousClass: string | null = null;
let previousSubclass: string | null = null;
let previousRace: string | null = null;
let previousSubrace: string | null = null;
let previousPactBoon: string | null = null;
let previousFeatures: string[] | null = null;
let isInitialized = false;

/**
 * Initialize the spell cleanup service
 * This should be called once when the app starts
 */
export function initializeSpellCleanup() {
	if (isInitialized) return;
	isInitialized = true;

	console.log('[Spell Cleanup] Service initialized');

	// Subscribe to character store changes
	character_store.subscribe((character) => {
		const currentClass = character.class || '';
		const currentSubclass = character.subclass || '';
		const currentRace = character.race || '';
		const currentSubrace = character.subrace || '';
		const currentFeatures = character.features || [];
		
		// Track pact boon for warlocks
		let currentPactBoon = '';
		if (currentClass === 'Warlock' && character._provenance) {
			const pactBoonData = character._provenance['warlock_pact_boon'];
			if (pactBoonData) {
				const actualData = (pactBoonData as any)._set || pactBoonData;
				if (actualData && actualData.choice) {
					currentPactBoon = actualData.choice;
				}
			}
		}

		// Skip first run - just capture initial state
		if (previousClass === null) {
			console.log('[Spell Cleanup] Capturing initial state:', {
				class: currentClass,
				subclass: currentSubclass,
				race: currentRace,
				subrace: currentSubrace,
				pactBoon: currentPactBoon,
				features: currentFeatures.length
			});
			previousClass = currentClass;
			previousSubclass = currentSubclass;
			previousRace = currentRace;
			previousSubrace = currentSubrace;
			previousPactBoon = currentPactBoon;
			previousFeatures = currentFeatures;
			return;
		}

		// Check if any spell-affecting properties changed
		const classChanged = currentClass !== previousClass;
		const subclassChanged = currentSubclass !== previousSubclass;
		const raceChanged = currentRace !== previousRace;
		const subraceChanged = currentSubrace !== previousSubrace;
		const pactBoonChanged = currentPactBoon !== previousPactBoon;
		const featuresChanged = JSON.stringify(currentFeatures) !== JSON.stringify(previousFeatures);

		// If nothing changed, no cleanup needed
		if (!classChanged && !subclassChanged && !raceChanged && !subraceChanged && !pactBoonChanged && !featuresChanged) {
			return;
		}

		console.log('[Spell Cleanup] Change detected:', {
			classChanged,
			subclassChanged,
			raceChanged,
			subraceChanged,
			pactBoonChanged,
			featuresChanged,
			from: { class: previousClass, subclass: previousSubclass, race: previousRace, subrace: previousSubrace, pactBoon: previousPactBoon },
			to: { class: currentClass, subclass: currentSubclass, race: currentRace, subrace: currentSubrace, pactBoon: currentPactBoon }
		});

		// Update tracked values BEFORE cleanup so we have the old values for comparison
		const oldClass = previousClass || '';
		const oldSubclass = previousSubclass || '';
		const oldRace = previousRace || '';
		const oldSubrace = previousSubrace || '';
		const oldPactBoon = previousPactBoon || '';

		previousClass = currentClass;
		previousSubclass = currentSubclass;
		previousRace = currentRace;
		previousSubrace = currentSubrace;
		previousPactBoon = currentPactBoon;
		previousFeatures = currentFeatures;

		// Perform cleanup, passing both old and new values
		const removedSpells = cleanupInvalidSpells(character, {
			oldClass,
			oldSubclass,
			oldRace,
			oldSubrace,
			oldPactBoon,
			newClass: currentClass,
			newSubclass: currentSubclass,
			newRace: currentRace,
			newSubrace: currentSubrace,
			newPactBoon: currentPactBoon,
			oldFeatures: previousFeatures || [],
			newFeatures: currentFeatures
		});

		// Check if this was a warlock patron change and if patron spells were removed
		if (currentClass === 'Warlock' && subclassChanged && removedSpells.patronSpells.length > 0) {
			const patronSpellNames = removedSpells.patronSpells.join(', ');
			addNotification(
				'info',
				'Patron Changed',
				`Changing your Otherworldly Patron removed ${removedSpells.patronSpells.length} expanded spell(s) that are no longer available: ${patronSpellNames}. Please visit the Spells tab to select replacement spells.`,
				10000
			);
		}
		
		// Check if this was a pact boon change and if pact boon spells were removed
		if (currentClass === 'Warlock' && pactBoonChanged && removedSpells.pactBoonSpells.length > 0) {
			const pactBoonSpellNames = removedSpells.pactBoonSpells.join(', ');
			addNotification(
				'info',
				'Pact Boon Changed',
				`Changing your Pact Boon removed ${removedSpells.pactBoonSpells.length} spell(s) from your previous pact: ${pactBoonSpellNames}. Please visit the Spells tab to select replacement spells if needed.`,
				10000
			);
		}

		// Check if features changed and if feature-granted spells were removed
		if (featuresChanged && removedSpells.featureSpells.length > 0) {
			const featureSpellNames = removedSpells.featureSpells.join(', ');
			addNotification(
				'info',
				'Features Changed',
				`Changing your features removed ${removedSpells.featureSpells.length} auto-granted spell(s): ${featureSpellNames}.`,
				8000
			);
		}
	});
}

/**
 * Warlock patron expanded spell lists
 */
const PATRON_SPELLS: Record<string, string[]> = {
	'The Archfey': ['Faerie Fire', 'Sleep', 'Calm Emotions', 'Phantasmal Force'],
	'The Fiend': ['Burning Hands', 'Command', 'Blindness/Deafness', 'Scorching Ray'],
	'The Great Old One': ['Dissonant Whispers', "Tasha's Hideous Laughter", 'Detect Thoughts', 'Phantasmal Force']
};

/**
 * Clean up spell selections that are no longer valid based on current character state
 * Returns information about removed spells for notification purposes
 */
function cleanupInvalidSpells(
	character: any,
	changes: {
		oldClass: string;
		oldSubclass: string;
		oldRace: string;
		oldSubrace: string;
		oldPactBoon: string;
		newClass: string;
		newSubclass: string;
		newRace: string;
		newSubrace: string;
		newPactBoon: string;
		oldFeatures: string[];
		newFeatures: string[];
	}
): { patronSpells: string[], pactBoonSpells: string[], featureSpells: string[], otherSpells: string[] } {
	// Get current spell selections from provenance
	const scopeId = 'spell_selections';
	const provenanceData = character._provenance?.[scopeId];

	if (!provenanceData) {
		console.log('[Spell Cleanup] No spell selections found');
		return { patronSpells: [], pactBoonSpells: [], featureSpells: [], otherSpells: [] }; // No spells selected
	}

	const actualData = (provenanceData as any)._set || provenanceData;
	if (!actualData.spells || !Array.isArray(actualData.spells)) {
		console.log('[Spell Cleanup] No spells array found');
		return { patronSpells: [], pactBoonSpells: [], featureSpells: [], otherSpells: [] };
	}

	console.log('[Spell Cleanup] Found', actualData.spells.length, 'spells to check');
	console.log('[Spell Cleanup] Current changes:', changes);
	console.log('[Spell Cleanup] Spells before filter:', JSON.stringify(actualData.spells, null, 2));

	// Track removed spells by type
	const removedPatronSpells: string[] = [];
	const removedPactBoonSpells: string[] = [];
	const removedFeatureSpells: string[] = [];
	const removedOtherSpells: string[] = [];

	// Get old patron's expanded spells
	const oldPatronSpells = changes.oldClass === 'Warlock' && changes.oldSubclass ? PATRON_SPELLS[changes.oldSubclass] || [] : [];

	// Filter out spells that are no longer valid
	const validSpells = actualData.spells.filter((item: any) => {
		// Handle different formats
		if (typeof item === 'string') {
			// Legacy format - can't determine validity, remove it to be safe
			console.log('[Spell Cleanup] Removing legacy format spell:', item);
			removedOtherSpells.push(item);
			return false;
		}

		if (!item || !item.name) {
			console.log('[Spell Cleanup] Removing invalid spell item:', item);
			if (item?.name) removedOtherSpells.push(item.name);
			return false;
		}

		// Check if this spell's source is still valid
		const metadata = item;

		// Check if this is a patron spell that's no longer valid due to patron change
		if (changes.oldClass === 'Warlock' && changes.newClass === 'Warlock' && changes.oldSubclass !== changes.newSubclass) {
			if (oldPatronSpells.includes(item.name)) {
				console.log(
					`[Spell Cleanup] Removing ${item.name} - patron changed: needed "${changes.oldSubclass}", have "${changes.newSubclass}"`
				);
				removedPatronSpells.push(item.name);
				return false;
			}
		}
		
		// Check if this is a pact boon spell that's no longer valid due to pact boon change
		if (changes.oldClass === 'Warlock' && changes.newClass === 'Warlock' && changes.oldPactBoon !== changes.newPactBoon && changes.oldPactBoon) {
			const selectedFrom = metadata.tabSource;
			// Check if this spell was selected from the old pact boon tab
			if (selectedFrom && selectedFrom.includes(changes.oldPactBoon)) {
				console.log(
					`[Spell Cleanup] Removing ${item.name} - pact boon changed: needed "${changes.oldPactBoon}", have "${changes.newPactBoon}"`
				);
				removedPactBoonSpells.push(item.name);
				return false;
			}
		}

		// Check if this is a feature-granted spell that's no longer valid due to feature change
		if (changes.oldFeatures && changes.newFeatures) {
			const wasGrantedByFeature = changes.oldFeatures.some(feature => {
				// Check if this spell was granted by the old feature
				if (metadata.tabSource && metadata.tabSource.includes(feature)) {
					return true;
				}
				// Special case for Pact of the Chain Find Familiar
				if (feature === 'Pact of the Chain' && item.name === 'Find Familiar') {
					return true;
				}
				return false;
			});

			const isStillGrantedByFeature = changes.newFeatures.some(feature => {
				// Check if this spell is still granted by current features
				if (metadata.tabSource && metadata.tabSource.includes(feature)) {
					return true;
				}
				// Special case for Pact of the Chain Find Familiar
				if (feature === 'Pact of the Chain' && item.name === 'Find Familiar') {
					return true;
				}
				return false;
			});

			if (wasGrantedByFeature && !isStillGrantedByFeature) {
				console.log(
					`[Spell Cleanup] Removing ${item.name} - feature granting spell was removed`
				);
				removedFeatureSpells.push(item.name);
				return false;
			}
		}

		// Determine the PRIMARY source of this spell based on tabSource
		// This tells us what actually granted access to the spell
		const tabSource = metadata.tabSource || '';
		
		// Determine if this is a class spell, subclass spell, or race spell
		const isClassSpell = !tabSource.includes('-') && (tabSource === 'cantrips' || tabSource.startsWith('level'));
		const isSubclassSpell = tabSource.includes(' - ') || tabSource.includes('Domain') || tabSource.includes('Oath') || tabSource.includes('Circle');
		const isRaceSpell = tabSource.includes('Elf') || tabSource.includes('Tiefling') || tabSource.includes('Gnome') || tabSource.includes('Drow');
		
		// Only check the requirements that are RELEVANT to this spell's source
		// Don't remove class spells just because race changed!
		
		// For class spells: only check class
		if (isClassSpell) {
				if (metadata.charClass && metadata.charClass !== changes.newClass) {
				console.log(
					`[Spell Cleanup] Removing ${item.name} - class changed: needed "${metadata.charClass}", have "${changes.newClass}"`
				);
				removedOtherSpells.push(item.name);
				return false;
			}
		}
		
		// For subclass spells: check both class and subclass
		else if (isSubclassSpell) {
			if (metadata.charClass && metadata.charClass !== changes.newClass) {
				console.log(
					`[Spell Cleanup] Removing ${item.name} - class changed (subclass spell): needed "${metadata.charClass}", have "${changes.newClass}"`
				);
				removedOtherSpells.push(item.name);
				return false;
			}
			if (metadata.charSubclass && metadata.charSubclass !== changes.newSubclass) {
				console.log(
					`[Spell Cleanup] Removing ${item.name} - subclass changed: needed "${metadata.charSubclass}", have "${changes.newSubclass}"`
				);
				removedOtherSpells.push(item.name);
				return false;
			}
		}
		
		// For race spells: check race and subrace
		else if (isRaceSpell) {
			if (metadata.charRace && metadata.charRace !== changes.newRace) {
				console.log(
					`[Spell Cleanup] Removing ${item.name} - race changed: needed "${metadata.charRace}", have "${changes.newRace}"`
				);
				removedOtherSpells.push(item.name);
				return false;
			}
			if (metadata.charSubrace && metadata.charSubrace !== changes.newSubrace) {
				console.log(
					`[Spell Cleanup] Removing ${item.name} - subrace changed: needed "${metadata.charSubrace}", have "${changes.newSubrace}"`
				);
				removedOtherSpells.push(item.name);
				return false;
			}
		}
		
		// For unknown/legacy sources, be conservative and only remove if class changed
		else {
			if (metadata.charClass && metadata.charClass !== changes.newClass) {
				console.log(
					`[Spell Cleanup] Removing ${item.name} - class changed (unknown source): needed "${metadata.charClass}", have "${changes.newClass}"`
				);
				removedOtherSpells.push(item.name);
				return false;
			}
		}

		console.log(`[Spell Cleanup] Keeping ${item.name} - still valid`);
		return true; // Keep - still valid
	});

	// If any spells were removed, update the store
	if (validSpells.length !== actualData.spells.length) {
		console.log(
			`[Spell Cleanup] Updating spells: ${actualData.spells.length} -> ${validSpells.length} (removed ${actualData.spells.length - validSpells.length})`
		);
		const updatedSelections = {
			spells: validSpells
		};
		applyChoice(scopeId, updatedSelections);
	} else {
		console.log('[Spell Cleanup] No spells removed');
	}

	return { patronSpells: removedPatronSpells, pactBoonSpells: removedPactBoonSpells, featureSpells: removedFeatureSpells, otherSpells: removedOtherSpells };
}
