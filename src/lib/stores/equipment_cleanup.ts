import { character_store } from './character_store';
import { applyChoice } from './character_store_helpers';
import { addNotification } from './notification_store';

// Import all class data
import { fighter } from '$lib/data/classes/fighter';
import { barbarian } from '$lib/data/classes/barbarian';
import { bard } from '$lib/data/classes/bard';
import { cleric } from '$lib/data/classes/cleric';
import { druid } from '$lib/data/classes/druid';
import { monk } from '$lib/data/classes/monk';
import { paladin } from '$lib/data/classes/paladin';
import { ranger } from '$lib/data/classes/ranger';
import { rogue } from '$lib/data/classes/rogue';
import { sorcerer } from '$lib/data/classes/sorcerer';
import { warlock } from '$lib/data/classes/warlock';
import { wizard } from '$lib/data/classes/wizard';

import type { ClassData } from '$lib/data/types/ClassData';

// Create class lookup
const classLookup: Record<string, ClassData> = {
	Fighter: fighter,
	Barbarian: barbarian,
	Bard: bard,
	Cleric: cleric,
	Druid: druid,
	Monk: monk,
	Paladin: paladin,
	Ranger: ranger,
	Rogue: rogue,
	Sorcerer: sorcerer,
	Warlock: warlock,
	Wizard: wizard
};

/**
 * Equipment cleanup service that monitors character proficiency changes and removes
 * invalid equipment selections when a character LOSES proficiencies that are REQUIRED
 * by currently selected equipment.
 * 
 * Uses debouncing to handle temporary proficiency removal during subclass changes.
 */

let previousProficiencies: string[] = [];
let isInitialized = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Debounce delay in milliseconds (wait for proficiencies to stabilize after changes)
// Increased to 250ms to allow subclass changes to fully complete before checking
const DEBOUNCE_DELAY = 250;

/**
 * Initialize the equipment cleanup service
 * This should be called once when the app starts
 */
export function initializeEquipmentCleanup() {
	if (isInitialized) return;
	isInitialized = true;

	console.log('[Equipment Cleanup] Service initialized');

	// Subscribe to character store changes
	character_store.subscribe((character) => {
		const currentProficiencies = character.proficiencies || [];
		console.log('[Equipment Cleanup] Store update, proficiencies:', currentProficiencies);

		// Skip first run - just capture initial state
		if (previousProficiencies.length === 0 && currentProficiencies.length > 0) {
			console.log('[Equipment Cleanup] Capturing initial proficiencies:', currentProficiencies);
			previousProficiencies = [...currentProficiencies];
			return;
		}

		// Also skip if both are empty (initial load)
		if (previousProficiencies.length === 0 && currentProficiencies.length === 0) {
			return;
		}

		// Clear any pending debounce timer
		if (debounceTimer) {
			console.log('[Equipment Cleanup] Clearing previous debounce timer');
			clearTimeout(debounceTimer);
		}

		// Debounce the cleanup check to handle temporary proficiency removal
		// during subclass changes (e.g., Tempest -> War both have same proficiencies,
		// but they're removed then re-added during the swap)
		console.log(`[Equipment Cleanup] Starting ${DEBOUNCE_DELAY}ms debounce timer`);
		debounceTimer = setTimeout(() => {
			console.log('[Equipment Cleanup] Debounce timer fired');
			// Get the latest proficiencies after debounce period
			const latestProficiencies = character.proficiencies || [];

			console.log('[Equipment Cleanup] Debounce complete, checking proficiencies:', {
				previous: previousProficiencies,
				latest: latestProficiencies
			});

			// Calculate which proficiencies were LOST (comparing to previous stable state)
			const lostProficiencies = previousProficiencies.filter(
				(prof) => !latestProficiencies.includes(prof)
			);

			// If no proficiencies were lost, no cleanup needed
			// (Gaining proficiencies or keeping same proficiencies doesn't invalidate equipment)
			if (lostProficiencies.length === 0) {
				console.log('[Equipment Cleanup] No proficiencies lost after debounce, no cleanup needed');
				previousProficiencies = [...latestProficiencies];
				return;
			}

			console.log('[Equipment Cleanup] Proficiencies LOST after debounce:', lostProficiencies);

			// Only remove equipment that REQUIRES the lost proficiencies
			const removedEquipment = cleanupEquipmentRequiringLostProficiencies(
				character,
				lostProficiencies
			);

			// Update tracked values
			previousProficiencies = [...latestProficiencies];

			// Show notification if any equipment was removed
			if (removedEquipment.length > 0) {
				const equipmentList = removedEquipment.join(', ');
				addNotification(
					'info',
					'Equipment Adjusted',
					`Some equipment was unselected because you lost required proficiencies: ${equipmentList}. Please visit the Equipment tab to make new selections.`,
					10000
				);
			}
		}, DEBOUNCE_DELAY);
	});
}

/**
 * Clean up equipment selections that require proficiencies that were just lost
 * Only removes equipment if it REQUIRES a proficiency that is in lostProficiencies
 * Returns list of removed equipment items for notification purposes
 */
function cleanupEquipmentRequiringLostProficiencies(
	character: any,
	lostProficiencies: string[]
): string[] {
	const removedEquipment: string[] = [];

	if (!character._provenance) {
		console.log('[Equipment Cleanup] No provenance data found');
		return removedEquipment;
	}

	const className = character.class;
	if (!className) {
		console.log('[Equipment Cleanup] No class found');
		return removedEquipment;
	}

	const classData = classLookup[className];
	if (!classData?.startingEquipment?.choices) {
		console.log('[Equipment Cleanup] No equipment data for class:', className);
		return removedEquipment;
	}

	// Check all equipment choice scopes
	Object.keys(character._provenance).forEach((scopeId) => {
		// Only check class equipment scopes
		if (!scopeId.startsWith('class_equipment_')) {
			return;
		}

		const provenanceData = character._provenance[scopeId];
		if (!provenanceData) return;

		const actualData = provenanceData._set || provenanceData;

		// Check if this equipment choice has a selection
		if (actualData.selectedOption === undefined) return;

		// Extract choice index from scopeId (e.g., "class_equipment_0" -> 0)
		const choiceIndex = parseInt(scopeId.replace('class_equipment_', ''), 10);
		const choice = classData.startingEquipment.choices[choiceIndex];

		if (!choice || !choice.options) return;

		const selectedOptionIndex = actualData.selectedOption;
		const selectedOption = choice.options[selectedOptionIndex];

		if (!selectedOption) return;

		// Check if this is a SimpleEquipmentChoice (array of strings) or EquipmentChoice (objects)
		if (Array.isArray(selectedOption)) {
			// SimpleEquipmentChoice - no requirements to check
			return;
		}

		// Check if this option has requirements
		if (!selectedOption.requires || selectedOption.requires.length === 0) {
			return; // No requirements, keep the selection
		}

		// Check if this equipment REQUIRES any of the LOST proficiencies
		const requiresLostProficiency = selectedOption.requires.some((req: string) =>
			lostProficiencies.includes(req)
		);

		if (requiresLostProficiency) {
			// Equipment requires a proficiency we just lost, clear the selection
			console.log(
				`[Equipment Cleanup] Removing equipment choice ${choiceIndex}: ${selectedOption.label} - requires lost proficiency from: ${selectedOption.requires.join(', ')}`
			);

			// Add to removed list
			removedEquipment.push(selectedOption.label);

			// Clear the selection completely
			const clearedState = {
				inventory: [],
				selectedOption: undefined,
				subChoiceSelections: {}
			};
			applyChoice(scopeId, clearedState);
		} else {
			console.log(
				`[Equipment Cleanup] Keeping equipment choice ${choiceIndex}: ${selectedOption.label} - still have all required proficiencies`
			);
		}
	});

	return removedEquipment;
}
