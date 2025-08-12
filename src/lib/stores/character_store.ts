import { writable } from 'svelte/store';

export type ModHistoryEntry = {
	bonus: number;
	origin: string;
}

export type Stat = {
	base_score: number | null;
	bonuses: ModHistoryEntry[];
}

export type AbilityScores = {
	STR: Stat;
	DEX: Stat;
	CON: Stat;
	INT: Stat;
	WIS: Stat;
	CHA: Stat;
};

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

	abilityScores: AbilityScores;
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
	abilityScores: {
		STR: { base_score: null, bonuses: [] },
		DEX: { base_score: null, bonuses: [] },
		CON: { base_score: null, bonuses: [] },
		INT: { base_score: null, bonuses: [] },
		WIS: { base_score: null, bonuses: [] },
		CHA: { base_score: null, bonuses: [] },
	},
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
