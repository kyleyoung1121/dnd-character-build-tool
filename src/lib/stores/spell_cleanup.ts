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
		return { patronSpells: [], pactBoonSpells: [], featureSpells: [], otherSpells: [] }; // No spells selected
	}

	const actualData = (provenanceData as any)._set || provenanceData;
	if (!actualData.spells || !Array.isArray(actualData.spells)) {
		return { patronSpells: [], pactBoonSpells: [], featureSpells: [], otherSpells: [] };
	}

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
			removedOtherSpells.push(item);
			return false;
		}

		if (!item || !item.name) {
			if (item?.name) removedOtherSpells.push(item.name);
			return false;
		}

		// Check if this spell's source is still valid
		const metadata = item;

		// Check if this is a patron spell that's no longer valid due to patron change
		if (changes.oldClass === 'Warlock' && changes.newClass === 'Warlock' && changes.oldSubclass !== changes.newSubclass) {
			if (oldPatronSpells.includes(item.name)) {
				removedPatronSpells.push(item.name);
				return false;
			}
		}
		
		// Check if this is a pact boon spell that's no longer valid due to pact boon change
		if (changes.oldClass === 'Warlock' && changes.newClass === 'Warlock' && changes.oldPactBoon !== changes.newPactBoon && changes.oldPactBoon) {
			const selectedFrom = metadata.tabSource;
			// Check if this spell was selected from the old pact boon tab
			if (selectedFrom && selectedFrom.includes(changes.oldPactBoon)) {
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
				removedOtherSpells.push(item.name);
				return false;
			}
		}
		
		// For subclass spells: check both class and subclass
		else if (isSubclassSpell) {
			if (metadata.charClass && metadata.charClass !== changes.newClass) {
				removedOtherSpells.push(item.name);
				return false;
			}
			if (metadata.charSubclass && metadata.charSubclass !== changes.newSubclass) {
				removedOtherSpells.push(item.name);
				return false;
			}
		}
		
		// For race spells: check race and subrace
		else if (isRaceSpell) {
			if (metadata.charRace && metadata.charRace !== changes.newRace) {
				removedOtherSpells.push(item.name);
				return false;
			}
			if (metadata.charSubrace && metadata.charSubrace !== changes.newSubrace) {
				removedOtherSpells.push(item.name);
				return false;
			}
		}
		
		// For unknown/legacy sources, be conservative and only remove if class changed
		else {
			if (metadata.charClass && metadata.charClass !== changes.newClass) {
				removedOtherSpells.push(item.name);
				return false;
			}
		}

		return true; // Keep - still valid
	});

	// If any spells were removed, update the store
	if (validSpells.length !== actualData.spells.length) {
		const updatedSelections = {
			spells: validSpells
		};
		applyChoice(scopeId, updatedSelections);
	}

	return { patronSpells: removedPatronSpells, pactBoonSpells: removedPactBoonSpells, featureSpells: removedFeatureSpells, otherSpells: removedOtherSpells };
}
