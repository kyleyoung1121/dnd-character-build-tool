import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

const abilityScoreChoicePrompt: FeaturePrompt = {
	name: "Ability Score Increase",
	id: "mountain_dwarf_ability_score",
	description: `
		Your Constitution score increases by 2, and your Strength score increases by 2.
	`,
	source: "mountain_dwarf",
	effects: [
		{
			target: "constitution",
			action: "modify",
			value: 2
		},
		{
			target: "strength",
			action: "modify",
			value: 2
		}
	]
};


const darkvision: FeaturePrompt = {
	name: 'Darkvision',
	id: 'mountain_dwarf_darkvision',
	description: 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.',
	source: 'mountain_dwarf',
	effects: [
		{ target: 'features', action: 'add', value: 'Darkvision' }
	]
};

const dwarvenResilience: FeaturePrompt = {
	name: 'Dwarven Resilience',
	id: 'mountain_dwarf_resilience',
	description: 'You have advantage on saving throws against poison, and you have resistance to poison damage.',
	source: 'mountain_dwarf',
	effects: [
		{ target: 'features', action: 'add', value: 'Dwarven Resilience' }
	]
};

const combatTraining: FeaturePrompt = {
	name: 'Dwarven Combat Training',
	id: 'mountain_dwarf_combat_training',
	description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.',
	source: 'mountain_dwarf',
	effects: [
		{ target: 'proficiencies', action: 'add', value: ['Battleaxe', 'Handaxe', 'Light Hammer', 'Warhammer'] }
	]
};

const armorTraining: FeaturePrompt = {
	name: 'Dwarven Armor Training',
	id: 'mountain_dwarf_armor_training',
	description: 'You have proficiency with light and medium armor.',
	source: 'mountain_dwarf',
	effects: [
		{ target: 'proficiencies', action: 'add', value: ['Light Armor', 'Medium Armor'] }
	]
};

const toolProficiencyPrompt: FeaturePrompt = {
	name: "Tool Proficiency",
	id: 'mountain_dwarf_tool_prof',
	description: `You gain proficiency with one type of artisan's tools of your choice.`,
	featureOptions: {
		placeholderText: 'Choose one tool proficiency',
		options: ["Smith's tools", "Brewer's supplies", "Mason's tools"],
		numPicks: 1
	},
	source: 'mountain_dwarf',
	effects: [
		{ target: 'proficiencies', action: 'add', value: '{userChoice}' }
	]
};

const stonecunning: FeaturePrompt = {
	name: 'Stonecunning',
	id: 'mountain_dwarf_stonecunning',
	description: 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient and add double your proficiency bonus on the check.',
	source: 'mountain_dwarf',
	effects: [
		{ target: 'features', action: 'add', value: 'Stonecunning' }
	]
};

export const mountainDwarf: SpeciesData = {
	name: 'Mountain Dwarf',
	image: base + '/species_icons/mountain_dwarf.jpg',
	description: `Dwarves of the mountains are hardy warriors and craftsmen accustomed to harsh terrain and heavy mail.`,
	abilityScoreIncrease: '+2 Constitution, +2 Strength',
	speed: '25 ft.',
	size: 'Medium',
	knownLanguages: ['Common', 'Dwarvish'],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		darkvision,
		dwarvenResilience,
		combatTraining,
		armorTraining,
		toolProficiencyPrompt,
		stonecunning
	]
};
