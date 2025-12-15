import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const charlatan: BackgroundData = {
	name: 'Charlatan',
	image: base + '/background_icons/charlatan.jpg',
	description: 'You have always had a way with people and know what makes them tick.',
	flavorDescription:
		"A master of manipulation, you can draw out their deepest secrets and use their fears and vulnerabilities against them. You know how to make friends quickly, how to play on their sympathies, and how to play off their suspicions. But your talents weren't always used for ill.",
	skillProficiencies: ['Deception', 'Sleight of Hand'],
	toolProficiencies: ['Forgery kit', 'One type of gaming set'],
	equipment: [
		'Forgery kit',
		'Gaming set',
		'Fine clothes',
		'Signet ring of imaginary person',
		'Belt pouch with 15 gp'
	],
	feature: 'False Identity',
	featureDescription:
		'You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'charlatan_skills',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency in Deception and Sleight of Hand.' },
				]
			},
			source: 'background:Charlatan',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Deception', 'Sleight of Hand']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'charlatan_tools',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency with forgery kit and one type of gaming set.' },
				]
			},
			source: 'background:Charlatan',
			featureOptions: {
				placeholderText: 'Select 1 gaming set',
				options: ['Dice set', 'Dragonchess set', 'Playing card set', 'Three-Dragon Ante set'],
				numPicks: 1
			},
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: ['Forgery kit', '{userChoice}']
				}
			]
		},
		{
			name: 'Equipment',
			id: 'charlatan_equipment',
			description: {
				blocks: [
					{ type: 'text', text: 'You start with forgery kit, gaming set, fine clothes, signet ring, and 15 gp.' },
				]
			},
			source: 'background:Charlatan',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Forgery kit',
						'Gaming set',
						'Fine clothes',
						'Signet ring of imaginary person',
						'Belt pouch with 15 gp'
					]
				}
			]
		},
		{
			name: 'False Identity',
			id: 'charlatan_feature',
			description: {
				blocks: [
					{ type: 'text', text: 'You have created a second identity with documentation and disguises. You can also forge documents when you\'ve seen examples.' },
				]
			},
			source: 'background:Charlatan',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'False Identity'
				}
			]
		}
	]
};