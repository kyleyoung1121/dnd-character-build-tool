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
	background: string;
	alignment: string;

	strength: number | null
	dexterity: number | null
	constitution: number | null
	intelligence: number | null
	wisdom: number | null
	charisma: number | null

	proficiencies: string[];
	languages: string[];
	skills: string[];
	features: string[];
	inventory: string[];
	attacks: Attack[];
	spells?: string[];
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
	
	strength: null,
	dexterity: null,
	constitution: null,
	intelligence: null,
	wisdom: null,
	charisma: null,

	proficiencies: [],
	languages: [],
	skills: [],
	features: [],
	inventory: [],
	attacks: [],
	spells: [],
	hp: null,
	ac: null,
	speed: null,
	size: null,
});
