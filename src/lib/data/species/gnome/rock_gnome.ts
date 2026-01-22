import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'rock_gnome_ability_score',
	description: {
		blocks: [
			{ type: 'text', text: 'Your Constitution score increases by 1, and your Intelligence score increases by 2.' },
		]
	},
	source: 'rock_gnome',
	effects: [
		{
			target: 'constitution',
			action: 'modify',
			value: 1
		},
		{
			target: 'intelligence',
			action: 'modify',
			value: 2
		}
	]
};

export const rockGnome: SpeciesData = {
	name: 'Rock Gnome',
	image: base + '/species_icons/rock_gnome.jpg',
	description: `
		Rock gnomes are known for their inventiveness and keen intellect. 
		They are practical, cheerful, and curious, often tinkering with mechanical devices.
	`,
	abilityScoreIncrease: '+2 Intelligence, +1 Constitution',
	speed: '25 ft.',
	size: 'Small',
	knownLanguages: ['Common', 'Gnomish'],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		{
			name: 'Speed',
			id: 'rock_gnome_speed',
			description: {
				blocks: [
					{ type: 'text', text: 'Your base walking speed is 25 feet.' },
				]
			},
			source: 'rock_gnome',
			effects: [{ target: 'speed', action: 'set', value: '25 ft.' }]
		},
		{
			name: 'Darkvision',
			id: 'rock_gnome_darkvision',
			description: {
				blocks: [
					{ type: 'text', text: 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
				]
			},
			source: 'rock_gnome',
			effects: [{ target: 'features', action: 'add', value: 'Darkvision' }]
		},
		{
			name: 'Gnome Cunning',
			id: 'rock_gnome_gnome_cunning',
			description: {
				blocks: [
					{ type: 'text', text: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.' },
				]
			},
			source: 'rock_gnome',
			effects: [{ target: 'features', action: 'add', value: 'Gnome Cunning' }]
		},
		{
			name: "Artificer's Lore",
			id: 'rock_gnome_artificers_lore',
			description: {
				blocks: [
					{ type: 'text', text: "Whenever you make an Intelligence (History) check related to magical, alchemical, or technological items, you can add twice your proficiency bonus instead of any other proficiency bonus that may apply." },
				]
			},
			source: 'rock_gnome',
			effects: [{ target: 'features', action: 'add', value: "Artificer's Lore" }]
		},
		{
			name: 'Tinker',
			id: 'rock_gnome_tinker',
				description: {
					blocks: [
						{ type: 'text', text: "You have proficiency with artisan tools (tinker's tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device (AC 5, 1 hp). The device ceases to function after 24 hours (unless you spend 1 hour repairing it to keep the device functioning), or when you use your action to dismantle it; at that time, you can reclaim the materials used to create it. You can have up to three such devices active at a time." },
						{ type: 'text', text: 'When you create a device, choose one of the following options:' },
				{ type: 'text', text: '• <strong>Clockwork Toy:</strong> This toy is a clockwork animal, monster, or person, such as a frog, mouse, bird, dragon, or soldier. When placed on the ground, the toy moves 5 feet across the ground on each of your turns in a random direction. It makes noises as appropriate to the creature it represents.' },
				{ type: 'text', text: '• <strong>Fire Starter:</strong> The device produces a miniature flame, which you can use to light a candle, torch, or campfire. Using the device requires your action.' },
				{ type: 'text', text: "• <strong>Music Box:</strong> When opened, this music box plays a single song at a moderate volume. The box stops playing when it reaches the song's end or when it is closed." },
						{ type: 'text', text: "At your DM's discretion, you may make other objects with effects similar in power to these. The Prestidigitation cantrip is a good baseline for such effects." }
					]
				},
			source: 'rock_gnome',
			effects: [
				{ target: 'features', action: 'add', value: 'Tinker' },
				{ target: 'proficiencies', action: 'add', value: "Tinker's tools" }
			]
		}
	]
};
