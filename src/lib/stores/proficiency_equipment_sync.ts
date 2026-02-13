/**
 * Proficiency Equipment Sync Store
 * 
 * Automatically grants equipment items when proficiencies are selected.
 * This simplifies the user experience by eliminating duplicate selections.
 * 
 * Example: When Bard selects "Lute" as a proficiency, they automatically
 * receive a Lute in their inventory without needing to select it again
 * on the equipment tab.
 */

import { get } from 'svelte/store';
import { character_store } from './character_store';
import { applyChoice } from './character_store_helpers';
import { getEquipmentFromProficiencies } from '$lib/data/proficiency-equipment-mapping';

const SCOPE_ID = 'proficiency_granted_equipment';

// Track previous proficiencies to detect changes
let previousProficiencies: string[] = [];

/**
 * Initialize the proficiency equipment sync system
 * Call this once when the app loads
 */
export function initializeProficiencyEquipmentSync() {
	character_store.subscribe((character) => {
		const currentProficiencies = character.proficiencies || [];
		
		// Skip if proficiencies haven't changed
		if (arraysEqual(currentProficiencies, previousProficiencies)) {
			return;
		}

		// Update equipment based on new proficiencies
		syncEquipmentFromProficiencies(currentProficiencies, character.class);
		
		// Update tracking
		previousProficiencies = [...currentProficiencies];
	});
}

/**
 * Sync equipment items based on current proficiencies
 */
function syncEquipmentFromProficiencies(proficiencies: string[], characterClass?: string) {
	// Get all equipment that should be granted
	const equipmentItems = getEquipmentFromProficiencies(proficiencies, characterClass);
	
	// Apply to character (this will auto-revert previous values)
	applyChoice(SCOPE_ID, {
		inventory: equipmentItems
	});
}

/**
 * Get current proficiency-granted equipment
 * Useful for displaying in the equipment tab
 */
export function getProficiencyGrantedEquipment(): string[] {
	const character = get(character_store);
	const proficiencies = character.proficiencies || [];
	return getEquipmentFromProficiencies(proficiencies, character.class);
}

/**
 * Helper: Check if two arrays are equal
 */
function arraysEqual(arr1: string[], arr2: string[]): boolean {
	if (arr1.length !== arr2.length) return false;
	return arr1.every((item, index) => item === arr2[index]);
}
