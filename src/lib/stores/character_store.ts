import { writable } from 'svelte/store';

export type Attack = {
	weapon: string;
	attack_type: number;
	damage_die: string;
	damage_type: string;
};

export type Character = {
	name: string;
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
	beasts?: string[]; // Selected beast/familiar names for printing
	hp: number | null;
	ac: number | null;
	speed: number | null;
	size: string | null;

	// Optional fields that appear later in flow
	subclass?: string;
	subrace?: string;

	// INTERNAL metadata for tracking changes
	_provenance?: {
		[scopeId: string]: Partial<Character>;
	};
};

export const character_store = writable<Character>({
	name: '',
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
	hp: null,
	ac: null,
	speed: null,
	size: null
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
		character.spells.includes('Find Familiar')
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
