import { base } from '$app/paths';
import type { RaceData } from '$lib/data/types/RaceData';
import type { FeaturePrompt } from '$lib/data/types/Features';

const abilityScoreChoicePrompt: FeaturePrompt = {
	name: "Ability Score Increase",
	id: "hill_dwarf_ability_score",
	description: `
		Your Constitution score increases by 2, and your Wisdom score increases by 1.
	`,
	source: "hill_dwarf",
	effects: [
		{
			target: "constitution",
			action: "modify",
			value: 2
		},
		{
			target: "wisdom",
			action: "modify",
			value: 1
		}
	]
};


const darkvision: FeaturePrompt = {
	name: 'Darkvision',
	id: 'hill_dwarf_darkvision',
	description: 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.',
	source: 'hill_dwarf',
	effects: [
		{ target: 'features', action: 'add', value: 'Darkvision' }
	]
};

const dwarvenResilience: FeaturePrompt = {
	name: 'Dwarven Resilience',
	id: 'hill_dwarf_resilience',
	description: 'You have advantage on saving throws against poison, and you have resistance to poison damage.',
	source: 'hill_dwarf',
	effects: [
		{ target: 'features', action: 'add', value: 'Dwarven Resilience' }
	]
};

const combatTraining: FeaturePrompt = {
	name: 'Dwarven Combat Training',
	id: 'hill_dwarf_combat_training',
	description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.',
	source: 'hill_dwarf',
	effects: [
		{ target: 'proficiencies', action: 'add', value: ['Battleaxe', 'Handaxe', 'Light Hammer', 'Warhammer'] }
	]
};

const toolProficiencyPrompt: FeaturePrompt = {
	name: "Tool Proficiency",
	id: 'hill_dwarf_tool_prof',
	description: `You gain proficiency with one type of artisan's tools of your choice.`,
	featureOptions: {
		placeholderText: 'Choose one tool proficiency',
		options: ["Smith's tools", "Brewer's supplies", "Mason's tools"],
		numPicks: 1
	},
	source: 'hill_dwarf',
	effects: [
		{ target: 'proficiencies', action: 'add', value: '{userChoice}' }
	]
};

const stonecunning: FeaturePrompt = {
	name: 'Stonecunning',
	id: 'hill_dwarf_stonecunning',
	description: 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient and add double your proficiency bonus on the check.',
	source: 'hill_dwarf',
	effects: [
		{ target: 'features', action: 'add', value: 'Stonecunning' }
	]
};

const dwarvenToughness: FeaturePrompt = {
	name: 'Dwarven Toughness',
	id: 'hill_dwarf_toughness',
	description: 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.',
	source: 'hill_dwarf',
	effects: [
		{ target: 'features', action: 'add', value: 'Dwarven Toughness' }
	]
};

export const hillDwarf: RaceData = {
	name: 'Hill Dwarf',
	image: base + '/race_icons/hill_dwarf.jpg',
	description: `Hardy folk who dwell in the hills and mountains. Hill dwarves are known for their hardiness, deep sense of tradition, and strong ties to stone and earth.`,
	abilityScoreIncrease: '+2 Constitution, +1 Wisdom',
	speed: '25 ft.',
	size: 'Medium',
	knownLanguages: ['Common', 'Dwarvish'],
	raceFeatures: [
		abilityScoreChoicePrompt,
		darkvision,
		dwarvenResilience,
		combatTraining,
		toolProficiencyPrompt,
		stonecunning,
		dwarvenToughness
	]
};
