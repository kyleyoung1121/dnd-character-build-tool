import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'human_ability_score',
	description: {
		blocks: [
			{ type: 'text', text: 'Your Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma scores each increase by 1.' },
		]
	},
	source: 'human',
	effects: [
		{ target: 'strength', action: 'modify', value: 1 },
		{ target: 'dexterity', action: 'modify', value: 1 },
		{ target: 'constitution', action: 'modify', value: 1 },
		{ target: 'intelligence', action: 'modify', value: 1 },
		{ target: 'wisdom', action: 'modify', value: 1 },
		{ target: 'charisma', action: 'modify', value: 1 }
	]
};

export const human: SpeciesData = {
	name: 'Human',
	image: base + '/species_icons/human.jpg',
	description: `
		Humans are the most adaptable and ambitious people among the common races. 
		They are diverse in talents, motivations, and appearance.
	`,
	// Enhanced popup content for narrative preview
	enhancedFlavor: "Where others see limitations, humans see possibilities. Their brief lives burn bright with ambition, driving them to achieve more in their short time than most races dare attempt in centuries.",
	cultureNotes: "Humans are found everywhere and excel in every profession. They form the backbone of most kingdoms, with diverse cultures ranging from nomadic tribes to great empires. Common names reflect their varied heritage: simple and direct like 'John' and 'Sarah', or elaborate and exotic depending on regional influences.",
	popupImage: "/species-popup-art/human-scholar-explorer.jpg", // Placeholder for professional artwork
	abilityScoreIncrease: '+1 to all ability scores',
	speed: '30 ft.',
	size: 'Medium',
	knownLanguages: ['Common', 'One extra language of your choice'],
	speciesFeatures: [abilityScoreChoicePrompt]
};