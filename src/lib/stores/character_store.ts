import { prefersReducedMotion } from 'svelte/motion';
import { writable } from 'svelte/store';

// Attacks now store just weapon names - weapon data is looked up from weapon-data.ts
export type Attack = string;

export type Character = {
	characterName: string;
	playerName: string;
	library: string;
	race: string;
	class: string;
	characterClass?: string; // Alias for backwards compatibility
	background: string;
	alignment: string;

	strength: number | null;
	dexterity: number | null;
	constitution: number | null;
	intelligence: number | null;
	wisdom: number | null;
	charisma: number | null;

	proficiencies: string[];
	languages: string[];
	skills: string[];
	expertise: string[];
	features: string[];
	inventory: string[];
	attacks: Attack[];
	spells?: string[];
	beasts?: any[];
	hp: number | null;
	ac: number | null;
	speed: number | null;
	size: string | null;

	feats?: string[];
	elementalAdeptElement?: string;
	
	// Optional fields that appear later in flow
	subclass?: string;
	subrace?: string;

	// Species-specific properties for dynamic feature enhancement
	dragonbornElement?: string; // Stores the chosen element (Acid, Cold, Fire, Lightning, Poison)
	dragonbornBreathShape?: string; // Stores the chosen breath shape (15 ft. Cone, 5 ft. by 30 ft. Line)

	completedCreationTabs?: string[];

	// INTERNAL metadata for tracking changes
	_provenance?: {
		[scopeId: string]: Partial<Character>;
	};
};

export const character_store = writable<Character>({
	characterName: '',
	playerName: '',
	library: '',
	race: '',
	class: '',
	subclass: '',
	background: '',
	alignment: '',

	strength: 0,
	dexterity: 0,
	constitution: 0,
	intelligence: 0,
	wisdom: 0,
	charisma: 0,

	proficiencies: [],
	languages: [],
	skills: [],
	expertise: [],
	features: [],
	inventory: [],
	attacks: [],
	spells: [],
	beasts: [],
	hp: null,
	ac: null,
	speed: null,
	size: null,

	completedCreationTabs: ['export'],
});

/**
 * Determines if the character has access to spells based on class/subclass/features
 * Used for conditional display of the Spells tab
 */
export function hasSpellAccess(character: Character): boolean {
	// Import the spell access function here to avoid circular imports
	try {
		// Dynamic import to avoid circular dependency
		// We'll use a simple check based on known spell access patterns

		// Full spellcasters (have spells from level 1)
		const fullCasters = ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'];
		if (fullCasters.includes(character.class)) {
			return true;
		}

		// Half casters (get spells at level 2, so level 3 characters have spells)
		const halfCasters = ['Paladin', 'Ranger'];
		if (halfCasters.includes(character.class)) {
			return true;
		}

		// Subclass casters
		if (
			character.subclass === 'Eldritch Knight' ||
			character.subclass === 'Arcane Trickster' ||
			character.subclass === 'Way of Shadow'
		) {
			return true;
		}

		// Magic Feats
		if (character.feats && character.feats.includes('Magic Initiate')) {
			return true;
		}

		// Racial spell access
		if (
			character.race === 'Tiefling' ||
			(character.race === 'Elf' && character.subrace === 'High Elf') ||
			(character.race === 'Elf' && character.subrace === 'Dark Elf') ||
			(character.race === 'Gnome' && character.subrace === 'Forest Gnome') ||
			// Legacy fallback for old format
			character.race === 'High Elf' ||
			character.race === 'Dark Elf' ||
			character.race === 'Forest Gnome'
		) {
			return true;
		}

		// Check for spellcasting features
		const spellcastingFeatures = [
			'Spellcasting',
			'Eldritch Knight Spellcasting',
			'Arcane Trickster Spellcasting',
			'Spirit Seeker', // Totem Warrior Barbarian ritual spells
			'Shadow Arts', // Way of Shadow Monk ki-based spells
			'Pact Magic' // Warlock
		];

		if (
			character.features &&
			character.features.some((feature) =>
				spellcastingFeatures.some((spellFeature) =>
					feature.toLowerCase().includes(spellFeature.toLowerCase())
				)
			)
		) {
			return true;
		}

		return false;
	} catch (error) {
		// Fallback in case of import issues
		return (
			['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard', 'Paladin', 'Ranger'].includes(
				character.class
			) ||
			character.race === 'Tiefling' ||
			(character.race === 'Elf' &&
				(character.subrace === 'High Elf' || character.subrace === 'Dark Elf')) ||
			(character.race === 'Gnome' && character.subrace === 'Forest Gnome') ||
			// Legacy fallback
			character.race === 'High Elf' ||
			character.race === 'Dark Elf' ||
			character.race === 'Forest Gnome'
		);
	}
}

/**
 * Determines if the character has access to beasts or familiars
 * Used for conditional display of the Beasts/Familiars tab
 */
export function hasBeastAccess(character: Character): boolean {
	// Druids always have access (for Wild Shape beast forms)
	if (character.class === 'Druid') {
		return true;
	}

	// Beast Master Rangers get a beast companion
	if (character.class === 'Ranger' && character.subclass === 'Beast Master') {
		return true;
	}

	// Pact of Chain Warlocks get Find Familiar
	if (
		character.class === 'Warlock' &&
		character.features &&
		character.features.includes('Pact of the Chain')
	) {
		return true;
	}

	// Wizards can learn Find Familiar - only show tab if they've selected it
	if (
		character.class === 'Wizard' &&
		character.spells &&
		character.spells.some((spell: any) => {
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

/**
 * Returns the appropriate tab name based on character's beast/familiar access type
 */
export function getBeastTabName(character: Character): string {
	// Wizards and Pact of Chain Warlocks use "Familiars"
	if (
		character.class === 'Wizard' ||
		(character.class === 'Warlock' &&
			character.features &&
			character.features.includes('Pact of the Chain'))
	) {
		return 'Familiars';
	}

	// Druids and Beast Master Rangers use "Beasts"
	if (
		character.class === 'Druid' ||
		(character.class === 'Ranger' && character.subclass === 'Beast Master')
	) {
		return 'Beasts';
	}

	// Default fallback
	return 'Beasts';
}


export function isEmpty(character: Character): boolean {

	// Loop through every property in the character store
	for (const property in character) {
		if (!(property == '_provenance' || property == 'completedCreationTabs')) {
			let val = property as keyof typeof character;
			
			// If this property is null, we can move on
			if (character[val] == null) {
				continue;
			}

			// If this property is not an object, but is falsy, we can move on
			if (!(typeof character[val] == 'object')) {
				if (Boolean(character[val]) == false) {
					continue;
				}
			
			// If this property is an object, we need to check if its an empty array
			} else if (Object.keys(character[val]).length == 0) {
				continue;
			}
			
			// If we haven't hit a continue yet, we have found a property with a stored value
			// Return false, the store is not empty
			return false;
		}
	}

	// If we have gone through all properties, we never found any with a value
	// Return true, the store has no stored values
	return true;
}

// 
export function testEmptiness(character: Character) {
	const isStoreEmpty = isEmpty(character);

	if (isStoreEmpty) {
		window.removeEventListener("beforeunload", beforeUnloadHandler);
	} else {
		window.addEventListener("beforeunload", beforeUnloadHandler);
	}
}

const beforeUnloadHandler = (event: any) => {
	// Recommended
	event.preventDefault();

	// Included for legacy support, e.g. Chrome/Edge < 119
	event.returnValue = true;
};