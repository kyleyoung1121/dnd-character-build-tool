import { base } from '$app/paths';
import type { RaceData } from '$lib/data/types/RaceData';
import type { FeaturePrompt } from '$lib/data/types/Features';

const draconicAncestryPrompt: FeaturePrompt = {
	name: 'Draconic Ancestry',
	id: 'dragonborn_draconic_ancestry',
	description: `
		You have a draconic ancestry. Choose one type of dragon from the table. 
		Your breath weapon and damage resistance are determined by the dragon type.
	`,
	featureOptions: {
		placeholderText: "-Choose a Dragon Type-",
		options: [
			"Black (Acid)",
			"Blue (Lightning)",
			"Brass (Fire)",
			"Bronze (Lightning)",
			"Copper (Acid)",
			"Gold (Fire)",
			"Green (Poison)",
			"Red (Fire)",
			"Silver (Cold)",
			"White (Cold)"
		],
		numPicks: 1,
	},
	source: "dragonborn",
	effects: [
		{
			target: "features",
			action: "add",
			value: "{userChoice} Ancestry"
		},
		{
			target: "resistances",
			action: "add",
			value: "{userChoice} Damage Resistance"
		}
	]
};

const raceFeatures: FeaturePrompt[] = [
	{
		name: "Breath Weapon",
		id: "dragonborn_breath_weapon",
		description: `
			You can use your action to exhale destructive energy. 
			Your draconic ancestry determines the size, shape, and damage type of the exhalation.
		`,
		source: "dragonborn",
		effects: [
			{
				target: "features",
				action: "add",
				value: "Breath Weapon"
			}
		]
	},
	{
		name: "Damage Resistance",
		id: "dragonborn_damage_resistance",
		description: `
			You have resistance to the damage type associated with your draconic ancestry.
		`,
		source: "dragonborn",
		effects: [
			{
				target: "features",
				action: "add",
				value: "Damage Resistance"
			}
		]
	}
];

export const dragonborn: RaceData = {
	name: 'Dragonborn',
	image: base + '/race_icons/dragonborn.jpg',
	description: `
		Born of dragons, as their name proclaims, the dragonborn walk proudly through a world 
		that greets them with fearful incomprehension. Shaped by draconic gods or the dragons 
		themselves, dragonborn originally hatched from dragon eggs as a unique race, combining 
		the best attributes of dragons and humanoids.
	`,
	abilityScoreIncrease: "+2 Strength, +1 Charisma",
	speed: "30 ft.",
	size: "Medium",
	knownLanguages: ["Common", "Draconic"],
	raceFeatures: [
		draconicAncestryPrompt,
		...raceFeatures
	]
};
