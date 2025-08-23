import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: "Ability Score Increase",
	id: "rock_gnome_ability_score",
	description: `
		Your Constitution score increases by 1, and your Intelligence score increases by 2.
	`,
	source: "rock_gnome",
	effects: [
		{
			target: "constitution",
			action: "modify",
			value: 1
		},
		{
			target: "intelligence",
			action: "modify",
			value: 2
		}
	]
};

export const rockGnome: SpeciesData = {
	name: "Rock Gnome",
	image: base + "/species_icons/rock_gnome.jpg",
	description: `
		Rock gnomes are known for their inventiveness and keen intellect. 
		They are practical, cheerful, and curious, often tinkering with mechanical devices.
	`,
	abilityScoreIncrease: "+2 Intelligence, +1 Constitution",
	speed: "25 ft.",
	size: "Small",
	knownLanguages: ["Common", "Gnomish"],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		{
			name: "Darkvision",
			id: "rock_gnome_darkvision",
			description: `
				Accustomed to life underground, you have superior vision in dark and dim conditions. 
				You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.
			`,
			source: "rock_gnome",
			effects: [{ target: "features", action: "add", value: "Darkvision" }]
		},
		{
			name: "Gnome Cunning",
			id: "rock_gnome_gnome_cunning",
			description: `
				You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.
			`,
			source: "rock_gnome",
			effects: [{ target: "features", action: "add", value: "Gnome Cunning" }]
		}
	]
};
