import { character_store } from './character_store';
import { applyChoice } from './character_store_helpers';
import { addNotification } from './notification_store';

/**
 * Beast cleanup service that monitors character changes and removes invalid beast selections
 * This runs independently of the beasts UI component, ensuring cleanup happens immediately
 * when class/subclass changes, even if the user never visits the beasts page again
 */

let previousClass: string | null = null;
let previousSubclass: string | null = null;
let previousRace: string | null = null;
let previousSubrace: string | null = null;
let previousSpells: any[] | null = null;
let previousFeatures: string[] | null = null;
let isInitialized = false;

/**
 * Initialize the beast cleanup service
 * This should be called once when the app starts
 */
export function initializeBeastCleanup() {
	if (isInitialized) return;
	isInitialized = true;

	console.log('[Beast Cleanup] Service initialized');

	// Subscribe to character store changes
	character_store.subscribe((character) => {
		const currentClass = character.class || '';
		const currentSubclass = character.subclass || '';
		const currentRace = character.race || '';
		const currentSubrace = character.subrace || '';
		const currentSpells = character.spells || [];
		const currentFeatures = character.features || [];

		// Skip first run - just capture initial state
		if (previousClass === null) {
			console.log('[Beast Cleanup] Capturing initial state:', {
				class: currentClass,
				subclass: currentSubclass,
				race: currentRace,
				subrace: currentSubrace,
				spells: currentSpells.length,
				features: currentFeatures.length
			});
			previousClass = currentClass;
			previousSubclass = currentSubclass;
			previousRace = currentRace;
			previousSubrace = currentSubrace;
			previousSpells = currentSpells;
			previousFeatures = currentFeatures;
			return;
		}

		// Check if any beast-affecting properties changed
		const classChanged = currentClass !== previousClass;
		const subclassChanged = currentSubclass !== previousSubclass;
		const raceChanged = currentRace !== previousRace;
		const subraceChanged = currentSubrace !== previousSubrace;
		const spellsChanged = JSON.stringify(currentSpells) !== JSON.stringify(previousSpells);
		const featuresChanged = JSON.stringify(currentFeatures) !== JSON.stringify(previousFeatures);

		// If nothing changed, no cleanup needed
		if (!classChanged && !subclassChanged && !raceChanged && !subraceChanged && !spellsChanged && !featuresChanged) {
			return;
		}

		console.log('[Beast Cleanup] Change detected:', {
			classChanged,
			subclassChanged,
			raceChanged,
			subraceChanged,
			spellsChanged,
			featuresChanged,
			from: { class: previousClass, subclass: previousSubclass, race: previousRace, subrace: previousSubrace },
			to: { class: currentClass, subclass: currentSubclass, race: currentRace, subrace: currentSubrace }
		});

		// Update tracked values BEFORE cleanup so we have the old values for comparison
		const oldClass = previousClass || '';
		const oldSubclass = previousSubclass || '';
		const oldRace = previousRace || '';
		const oldSubrace = previousSubrace || '';

		previousClass = currentClass;
		previousSubclass = currentSubclass;
		previousRace = currentRace;
		previousSubrace = currentSubrace;
		previousSpells = currentSpells;
		previousFeatures = currentFeatures;

		// Perform cleanup, passing both old and new values
		const removedBeasts = cleanupInvalidBeasts(character, {
			oldClass,
			oldSubclass,
			oldRace,
			oldSubrace,
			newClass: currentClass,
			newSubclass: currentSubclass,
			newRace: currentRace,
			newSubrace: currentSubrace,
			oldSpells: previousSpells || [],
			newSpells: currentSpells,
			oldFeatures: previousFeatures || [],
			newFeatures: currentFeatures
		});

		// Notify user if beasts were removed
		if (removedBeasts.length > 0) {
			const removedBeastNames = removedBeasts.join(', ');
			const changeType = classChanged ? 'class' : 
						   subclassChanged ? 'subclass' : 
						   spellsChanged ? 'spells' : 
						   featuresChanged ? 'features' : 'properties';
			addNotification(
				'info',
				'Beasts Removed',
				`Because your character's source of beasts has changed, your selected beasts have been cleared.`,
				5000
			);
		}
	});
}

/**
 * Clean up beast selections that are no longer valid based on current character state
 * Returns list of removed beast names for notification purposes
 */
function cleanupInvalidBeasts(
	character: any,
	changes: {
		oldClass: string;
		oldSubclass: string;
		oldRace: string;
		oldSubrace: string;
		newClass: string;
		newSubclass: string;
		newRace: string;
		newSubrace: string;
		oldSpells: any[];
		newSpells: any[];
		oldFeatures: string[];
		newFeatures: string[];
	}
): string[] {
	// Get current beast selections from provenance
	const scopeId = 'beast_selections';
	const provenanceData = character._provenance?.[scopeId];

	if (!provenanceData) {
		console.log('[Beast Cleanup] No beast selections found');
		return []; // No beasts selected
	}

	const actualData = (provenanceData as any)._set || provenanceData;
	if (!actualData.beasts || !Array.isArray(actualData.beasts)) {
		console.log('[Beast Cleanup] No beasts array found');
		return [];
	}

	console.log('[Beast Cleanup] Found', actualData.beasts.length, 'beasts to check');
	console.log('[Beast Cleanup] Current changes:', changes);
	console.log('[Beast Cleanup] Beasts before filter:', JSON.stringify(actualData.beasts, null, 2));

	// Track removed beasts
	const removedBeasts: string[] = [];

	// Filter out beasts that are no longer valid
	const validBeasts = actualData.beasts.filter((item: any) => {
		// Handle different formats
		if (typeof item === 'string') {
			// Legacy format - can't determine validity, remove it to be safe
			console.log('[Beast Cleanup] Removing legacy format beast:', item);
			removedBeasts.push(item);
			return false;
		}

		if (!item || !item.name) {
			console.log('[Beast Cleanup] Removing invalid beast item:', item);
			if (item?.name) removedBeasts.push(item.name);
			return false;
		}

		// Check if this beast is still valid for the current character
		const isStillValid = isBeastStillValid(item, changes);
		
		if (!isStillValid) {
			console.log(`[Beast Cleanup] Removing ${item.name} - no longer valid for current character`);
			removedBeasts.push(item.name);
			return false;
		}

		console.log(`[Beast Cleanup] Keeping ${item.name} - still valid`);
		return true; // Keep - still valid
	});

	// If any beasts were removed, update the store
	if (validBeasts.length !== actualData.beasts.length) {
		console.log(
			`[Beast Cleanup] Updating beasts: ${actualData.beasts.length} -> ${validBeasts.length} (removed ${actualData.beasts.length - validBeasts.length})`
		);
		const updatedSelections = {
			beasts: validBeasts
		};
		applyChoice(scopeId, updatedSelections);
	} else {
		console.log('[Beast Cleanup] No beasts removed');
	}

	return removedBeasts;
}

/**
 * Check if a specific beast is still valid for the current character state
 */
function isBeastStillValid(beastItem: any, changes: {
	oldClass: string;
	oldSubclass: string;
	oldRace: string;
	oldSubrace: string;
	newClass: string;
	newSubclass: string;
	newRace: string;
	newSubrace: string;
	oldSpells: any[];
	newSpells: any[];
	oldFeatures: string[];
	newFeatures: string[];
}): boolean {
	const beastName = beastItem.name;
	
	// Get current character state to check spell access
	// const char = get(character_store); // No longer needed since we pass the data directly
	
	// If class changed, we need to check if the new class has beast access
	if (changes.oldClass !== changes.newClass) {
		console.log(`[Beast Cleanup] Class changed from ${changes.oldClass} to ${changes.newClass}`);
		
		// Check if new class has beast access
		const hasNewClassBeastAccess = checkBeastAccessForClass(changes.newClass, changes.newSubclass, changes.newSpells, changes.newFeatures);
		
		if (!hasNewClassBeastAccess) {
			console.log(`[Beast Cleanup] New class ${changes.newClass} has no beast access, removing ${beastName}`);
			return false;
		}
		
		// Class changed but new class does have beast access
		// Remove old beasts to prevent cross-contamination
		console.log(`[Beast Cleanup] Class changed from ${changes.oldClass} to ${changes.newClass}, removing ${beastName} for cleanliness`);
		return false;
	}

	// For Wizard: Check if Find Familiar spell is still present
	if (changes.newClass === 'Wizard') {
		const hasFindFamiliar = changes.newSpells.some((spell: any) => {
			const spellName = typeof spell === 'string' ? spell : spell.name;
			return spellName === 'Find Familiar' || 
				   spellName === 'find familiar' ||
				   spellName === 'Find Familiar (ritual only)' ||
				   spellName === 'find familiar';
		});
		
		if (!hasFindFamiliar) {
			console.log(`[Beast Cleanup] Wizard no longer has Find Familiar spell, removing ${beastName}`);
			return false;
		}
	}

	// For Warlock: Check if Pact of Chain is still present
	if (changes.newClass === 'Warlock') {
		const hasPactChain = changes.newFeatures.includes('Pact of the Chain');
		
		if (!hasPactChain) {
			console.log(`[Beast Cleanup] Warlock no longer has Pact of the Chain, removing ${beastName}`);
			return false;
		}
	}

	// Handle Warlock to non-Warlock transition
	if (changes.oldClass === 'Warlock' && changes.newClass !== 'Warlock') {
		console.log(`[Beast Cleanup] Transitioning from Warlock to ${changes.newClass}, removing ${beastName}`);
		return false;
	}

	// Handle Wizard Find Familiar removal (still Wizard but spell removed)
	if (changes.oldClass === 'Wizard' && changes.newClass === 'Wizard') {
		const hadFindFamiliar = changes.oldSpells.some((spell: any) => {
			const spellName = typeof spell === 'string' ? spell : spell.name;
			return spellName === 'Find Familiar' || 
				   spellName === 'find familiar' ||
				   spellName === 'Find Familiar (ritual only)' ||
				   spellName === 'find familiar';
		});
		
		const hasFindFamiliar = changes.newSpells.some((spell: any) => {
			const spellName = typeof spell === 'string' ? spell : spell.name;
			return spellName === 'Find Familiar' || 
				   spellName === 'find familiar' ||
				   spellName === 'Find Familiar (ritual only)' ||
				   spellName === 'find familiar';
		});
		
		if (hadFindFamiliar && !hasFindFamiliar) {
			console.log(`[Beast Cleanup] Wizard removed Find Familiar spell, removing ${beastName}`);
			return false;
		}
	}

	// Handle Warlock Pact of Chain removal (still Warlock but feature removed)
	if (changes.oldClass === 'Warlock' && changes.newClass === 'Warlock') {
		const hadPactChain = changes.oldFeatures.includes('Pact of the Chain');
		const hasPactChain = changes.newFeatures.includes('Pact of the Chain');
		
		if (hadPactChain && !hasPactChain) {
			console.log(`[Beast Cleanup] Warlock removed Pact of the Chain feature, removing ${beastName}`);
			return false;
		}
	}

	// For Druid circle changes (Circle of Moon -> Circle of Land), remove CR 1 beasts
	if (changes.oldClass === 'Druid' && changes.newClass === 'Druid') {
		const oldWasMoon = changes.oldSubclass === 'Circle of the Moon';
		const newIsMoon = changes.newSubclass === 'Circle of the Moon';
		
		// If changing from Circle of Moon to non-Moon, remove beasts
		if (oldWasMoon && !newIsMoon) {
			console.log(`[Beast Cleanup] Druid changed from Circle of Moon to ${changes.newSubclass}, removing ${beastName}`);
			return false;
		}
	}

	// For other subclass changes within the same class, be conservative and remove all beasts
	if (changes.oldSubclass !== changes.newSubclass && changes.oldClass === changes.newClass) {
		console.log(`[Beast Cleanup] Subclass changed from ${changes.oldSubclass} to ${changes.newSubclass}, removing ${beastName}`);
		return false;
	}

	// Beast is still valid
	return true;
}

/**
 * Check if a class has beast access based on character state
 */
function checkBeastAccessForClass(className: string, subclass: string, spells: any[], features: string[]): boolean {
	// Druids always have access (for Wild Shape beast forms)
	if (className === 'Druid') {
		return true;
	}

	// Beast Master Rangers get a beast companion
	if (className === 'Ranger' && subclass === 'Beast Master') {
		return true;
	}

	// Pact of Chain Warlocks get Find Familiar
	if (
		className === 'Warlock' &&
		features.includes('Pact of the Chain')
	) {
		return true;
	}

	// Wizards can learn Find Familiar - only show tab if they've selected it
	if (
		className === 'Wizard' &&
		spells.some((spell: any) => {
			// Handle both object format (new) and string format (old)
			const spellName = typeof spell === 'string' ? spell : spell.name;
			return spellName === 'Find Familiar' || 
				   spellName === 'find familiar' ||
				   spellName === 'Find Familiar (ritual only)' ||
				   spellName === 'find familiar';
		})
	) {
		return true;
	}

	return false;
}