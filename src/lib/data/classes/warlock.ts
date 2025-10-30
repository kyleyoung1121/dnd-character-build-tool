import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { simpleWeapons } from '$lib/data/equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	id: 'warlock_proficiencies',
	name: 'Skill Proficiencies',
	description: `
		Armor: Light armor <br>
		Weapons: Simple weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from Arcana, Deception, History, Intimidation, Investigation, Nature, and Religion
	`,
	featureOptions: {
		placeholderText: 'Select skills',
		options: [
			'Arcana',
			'Deception',
			'History',
			'Intimidation',
			'Investigation',
			'Nature',
			'Religion'
		],
		numPicks: 2
	},
	source: 'warlock.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const otherworldlyPatronPrompt: FeaturePrompt = {
	id: 'warlock_patron',
	name: 'Otherworldly Patron',
	description: 'Choose your Otherworldly Patron at 1st level.',
	featureOptions: {
		placeholderText: '-Choose a Patron-',
		options: [
			{
				name: 'The Archfey',
				optionDescription: 'Your patron is a powerful being from the Feywild who grants you enchantment and illusion powers.',
				nestedPrompts: [
					{
						id: 'warlock_archfey_expanded_spell_list',
						name: 'Expanded Spell List',
						description: 'The Archfey lets you choose from an expanded list of spells when you learn a warlock spell. The following spells are added to the warlock spell list for you:<br><br>1st Level: Faerie Fire, Sleep<br>2nd Level: Calm Emotions, Phantasmal Force',
						source: 'warlock.archfey',
						effects: []
					},
					{
						id: 'warlock_archfey_fey_presence',
						name: 'Fey Presence',
						description: 'As an action, you can cause each creature in a 10-foot cube originating from you to make a Wisdom saving throw against your warlock spell save DC. The creatures that fail their saving throws are all charmed or frightened by you (your choice) until the end of your next turn. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
						source: 'warlock.archfey',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Fey Presence'
							}
						]
					}
				]
			},
			{
				name: 'The Fiend',
				optionDescription: 'Your patron is a fiendish entity who grants you destructive fire and survival powers.',
				nestedPrompts: [
					{
						id: 'warlock_fiend_expanded_spell_list',
						name: 'Expanded Spell List',
						description: 'The Fiend lets you choose from an expanded list of spells when you learn a warlock spell. The following spells are added to the warlock spell list for you:<br><br>1st Level: Burning Hands, Command<br>2nd Level: Blindness/Deafness, Scorching Ray',
						source: 'warlock.fiend',
						effects: []
					},
					{
						id: 'warlock_fiend_dark_ones_blessing',
						name: 'Dark One\'s Blessing',
						description: 'When you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).',
						source: 'warlock.fiend',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Dark One\'s Blessing'
							}
						]
					}
				]
			},
			{
				name: 'The Great Old One',
				optionDescription: 'Your patron is a mysterious entity from beyond reality, granting telepathic and madness-related powers.',
				nestedPrompts: [
					{
						id: 'warlock_great_old_one_expanded_spell_list',
						name: 'Expanded Spell List',
						description: 'The Great Old One lets you choose from an expanded list of spells when you learn a warlock spell. The following spells are added to the warlock spell list for you:<br><br>1st Level: Dissonant Whispers, Tasha\'s Hideous Laughter<br>2nd Level: Detect Thoughts, Phantasmal Force',
						source: 'warlock.great_old_one',
						effects: []
					},
					{
						id: 'warlock_great_old_one_awakened_mind',
						name: 'Awakened Mind',
						description: 'You can communicate telepathically with any creature you can see within 30 feet of you. You don\'t need to share a language with the creature for it to understand your telepathic utterances, but the creature must be able to understand at least one language.',
						source: 'warlock.great_old_one',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Awakened Mind'
							}
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'warlock',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const pactMagicPrompt: FeaturePrompt = {
	id: 'warlock_pact_magic',
	name: 'Pact Magic',
	description: `
		You know two cantrips of your choice from the warlock spell list.
		You know two 1st-level spells.
		You regain spell slots on a short or long rest.
		You use Charisma as your spellcasting ability.
	`,
	source: 'warlock',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Pact Magic'
		}
	]
};

const pactBoonPrompt: FeaturePrompt = {
	id: 'warlock_pact_boon',
	name: 'Pact Boon',
	description: 'At 3rd level, your otherworldly patron bestows a gift upon you for your loyal service. You gain one of the following features of your choice.',
	featureOptions: {
		placeholderText: '-Choose a Pact Boon-',
		options: [
			{
				name: 'Pact of the Chain',
				optionDescription: 'Gain a familiar that can attack.',
				nestedPrompts: [
					{
						id: 'warlock_pact_chain_desc',
						name: 'Pact of the Chain',
						description:
							'You learn the Find Familiar spell and can cast it as a ritual. The spell doesn\'t count against your number of spells known. When you cast the spell, you can choose one of the normal forms for your familiar or one of the following special forms: imp, pseudodragon, quasit, or sprite. Additionally, when you take the Attack action, you can forgo one of your own attacks to allow your familiar to make one attack of its own with its reaction.',
						source: 'warlock.pact_boon',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Pact of the Chain'
							}
						]
					},
					{
						id: 'warlock_eldritch_invocations_chain',
						name: 'Eldritch Invocations',
						description: 'At 2nd level, you gain two eldritch invocations of your choice. When you gain certain warlock levels, you gain additional invocations of your choice.',
						source: 'warlock.eldritch_invocations',
						featureOptions: {
							placeholderText: 'Select two Invocations',
							options: [
								{
									name: 'Agonizing Blast',
									optionDescription: 'Add your Charisma modifier to Eldritch Blast damage.',
									nestedPrompts: [
										{
											id: 'warlock_agonizing_blast_desc_chain',
											name: 'Agonizing Blast',
											description:
												'Prerequisite: Eldritch Blast cantrip. When you cast Eldritch Blast, add your Charisma modifier to the damage it deals on a hit.<br><br>Note: Don\'t forget to choose Eldritch Blast for one of your cantrips!',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Armor of Shadows',
									optionDescription: 'Cast Mage Armor on yourself at will.',
									nestedPrompts: [
										{
											id: 'warlock_armor_of_shadows_desc_chain',
											name: 'Armor of Shadows',
											description: 'You can cast Mage Armor on yourself at will, without expending a spell slot or material components.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Beast Speech',
									optionDescription: 'Cast Speak with Animals at will.',
									nestedPrompts: [
										{
											id: 'warlock_beast_speech_desc_chain',
											name: 'Beast Speech',
											description: 'You can cast Speak with Animals at will, without expending a spell slot.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Beguiling Influence',
									optionDescription: 'Gain proficiency in Deception and Persuasion.',
									nestedPrompts: [
										{
											id: 'warlock_beguiling_influence_desc_chain',
											name: 'Beguiling Influence',
											description: 'You gain proficiency in the Deception and Persuasion skills.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Devil\'s Sight',
									optionDescription: 'See normally in darkness, both magical and nonmagical.',
									nestedPrompts: [
										{
											id: 'warlock_devils_sight_desc_chain',
											name: 'Devil\'s Sight',
											description:
												'You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Eldritch Sight',
									optionDescription: 'Cast Detect Magic at will.',
									nestedPrompts: [
										{
											id: 'warlock_eldritch_sight_desc_chain',
											name: 'Eldritch Sight',
											description: 'You can cast Detect Magic at will, without expending a spell slot.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Eldritch Spear',
									optionDescription: 'Increase Eldritch Blast range to 300 feet.',
									nestedPrompts: [
										{
											id: 'warlock_eldritch_spear_desc_chain',
											name: 'Eldritch Spear',
											description: 'Prerequisite: Eldritch Blast cantrip. When you cast Eldritch Blast, its range is 300 feet.<br><br>Note: Don\'t forget to choose Eldritch Blast for one of your cantrips!',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Eyes of the Rune Keeper',
									optionDescription: 'Read all writing.',
									nestedPrompts: [
										{
											id: 'warlock_eyes_rune_keeper_desc_chain',
											name: 'Eyes of the Rune Keeper',
											description: 'You can read all writing.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Fiendish Vigor',
									optionDescription: 'Cast False Life on yourself at will.',
									nestedPrompts: [
										{
											id: 'warlock_fiendish_vigor_desc_chain',
											name: 'Fiendish Vigor',
											description:
												'You can cast False Life on yourself at will as a 1st-level spell, without expending a spell slot or material components.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Gaze of Two Minds',
									optionDescription: 'See through another creature\'s eyes.',
									nestedPrompts: [
										{
											id: 'warlock_gaze_two_minds_desc_chain',
											name: 'Gaze of Two Minds',
											description: 'You can use your action to touch a willing humanoid and perceive through its senses until the end of your next turn. As long as the creature is on the same plane of existence as you, you can use your action on subsequent turns to maintain this connection, extending the duration until the end of your next turn. While perceiving through the other creature\'s senses, you benefit from any special senses possessed by that creature, and you are blinded and deafened to your own surroundings.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Mask of Many Faces',
									optionDescription: 'Cast Disguise Self at will.',
									nestedPrompts: [
										{
											id: 'warlock_mask_many_faces_desc_chain',
											name: 'Mask of Many Faces',
											description: 'You can cast Disguise Self at will, without expending a spell slot.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Misty Visions',
									optionDescription: 'Cast Silent Image at will.',
									nestedPrompts: [
										{
											id: 'warlock_misty_visions_desc_chain',
											name: 'Misty Visions',
											description: 'You can cast Silent Image at will, without expending a spell slot or material components.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Repelling Blast',
									optionDescription: 'Push creatures hit by Eldritch Blast.',
									nestedPrompts: [
										{
											id: 'warlock_repelling_blast_desc_chain',
											name: 'Repelling Blast',
											description: 'Prerequisite: Eldritch Blast cantrip. When you hit a creature with Eldritch Blast, you can push the creature up to 10 feet away from you in a straight line.<br><br>Note: Don\'t forget to choose Eldritch Blast for one of your cantrips!',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Thief of Five Fates',
									optionDescription: 'Cast Bane once per long rest.',
									nestedPrompts: [
										{
											id: 'warlock_thief_five_fates_desc_chain',
											name: 'Thief of Five Fates',
											description: 'You can cast Bane once using a warlock spell slot. You can\'t do so again until you finish a long rest.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Voice of the Chain Master',
									optionDescription: 'Communicate telepathically with your familiar.',
									nestedPrompts: [
										{
											id: 'warlock_voice_chain_master_desc_chain',
											name: 'Voice of the Chain Master',
											description: 'Prerequisite: Pact of the Chain. You can communicate telepathically with your familiar and perceive through your familiar\'s senses as long as you are on the same plane of existence. Additionally, while perceiving through your familiar\'s senses, you can also speak through your familiar in your own voice, even if your familiar is normally incapable of speech.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								}
							],
							numPicks: 2
						},
						effects: [
							{
								target: 'features',
								action: 'add',
								value: '{userChoice}'
							}
						]
					}
				]
			},
			{
				name: 'Pact of the Blade',
				optionDescription: 'Summon a magical melee weapon.',
				nestedPrompts: [
					{
						id: 'warlock_pact_blade_desc',
						name: 'Pact of the Blade',
						description:
							'You can use your action to create a pact weapon in your empty hand. You can choose the form that this melee weapon takes each time you create it. You are proficient with it while you wield it. This weapon counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. Your pact weapon disappears if it is more than 5 feet away from you for 1 minute or more. It also disappears if you use this feature again, if you dismiss the weapon (no action required), or if you die. You can transform one magic weapon into your pact weapon by performing a special ritual while you hold the weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest.',
						source: 'warlock.pact_boon',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Pact of the Blade'
							}
						]
					},
					{
						id: 'warlock_eldritch_invocations_blade',
						name: 'Eldritch Invocations',
						description: 'At 2nd level, you gain two eldritch invocations of your choice. When you gain certain warlock levels, you gain additional invocations of your choice.',
						source: 'warlock.eldritch_invocations',
						featureOptions: {
							placeholderText: 'Select two Invocations',
							options: [
								{
									name: 'Agonizing Blast',
									optionDescription: 'Add your Charisma modifier to Eldritch Blast damage.',
									nestedPrompts: [
										{
											id: 'warlock_agonizing_blast_desc_blade',
											name: 'Agonizing Blast',
											description:
												'Prerequisite: Eldritch Blast cantrip. When you cast Eldritch Blast, add your Charisma modifier to the damage it deals on a hit.<br><br>Note: Don\'t forget to choose Eldritch Blast for one of your cantrips!',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Armor of Shadows',
									optionDescription: 'Cast Mage Armor on yourself at will.',
									nestedPrompts: [
										{
											id: 'warlock_armor_of_shadows_desc_blade',
											name: 'Armor of Shadows',
											description: 'You can cast Mage Armor on yourself at will, without expending a spell slot or material components.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Beast Speech',
									optionDescription: 'Cast Speak with Animals at will.',
									nestedPrompts: [
										{
											id: 'warlock_beast_speech_desc_blade',
											name: 'Beast Speech',
											description: 'You can cast Speak with Animals at will, without expending a spell slot.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Beguiling Influence',
									optionDescription: 'Gain proficiency in Deception and Persuasion.',
									nestedPrompts: [
										{
											id: 'warlock_beguiling_influence_desc_blade',
											name: 'Beguiling Influence',
											description: 'You gain proficiency in the Deception and Persuasion skills.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Devil\'s Sight',
									optionDescription: 'See normally in darkness, both magical and nonmagical.',
									nestedPrompts: [
										{
											id: 'warlock_devils_sight_desc_blade',
											name: 'Devil\'s Sight',
											description:
												'You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Eldritch Sight',
									optionDescription: 'Cast Detect Magic at will.',
									nestedPrompts: [
										{
											id: 'warlock_eldritch_sight_desc_blade',
											name: 'Eldritch Sight',
											description: 'You can cast Detect Magic at will, without expending a spell slot.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Eldritch Spear',
									optionDescription: 'Increase Eldritch Blast range to 300 feet.',
									nestedPrompts: [
										{
											id: 'warlock_eldritch_spear_desc_blade',
											name: 'Eldritch Spear',
											description: 'Prerequisite: Eldritch Blast cantrip. When you cast Eldritch Blast, its range is 300 feet.<br><br>Note: Don\'t forget to choose Eldritch Blast for one of your cantrips!',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Eyes of the Rune Keeper',
									optionDescription: 'Read all writing.',
									nestedPrompts: [
										{
											id: 'warlock_eyes_rune_keeper_desc_blade',
											name: 'Eyes of the Rune Keeper',
											description: 'You can read all writing.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Fiendish Vigor',
									optionDescription: 'Cast False Life on yourself at will.',
									nestedPrompts: [
										{
											id: 'warlock_fiendish_vigor_desc_blade',
											name: 'Fiendish Vigor',
											description:
												'You can cast False Life on yourself at will as a 1st-level spell, without expending a spell slot or material components.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Gaze of Two Minds',
									optionDescription: 'See through another creature\'s eyes.',
									nestedPrompts: [
										{
											id: 'warlock_gaze_two_minds_desc_blade',
											name: 'Gaze of Two Minds',
											description: 'You can use your action to touch a willing humanoid and perceive through its senses until the end of your next turn. As long as the creature is on the same plane of existence as you, you can use your action on subsequent turns to maintain this connection, extending the duration until the end of your next turn. While perceiving through the other creature\'s senses, you benefit from any special senses possessed by that creature, and you are blinded and deafened to your own surroundings.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Mask of Many Faces',
									optionDescription: 'Cast Disguise Self at will.',
									nestedPrompts: [
										{
											id: 'warlock_mask_many_faces_desc_blade',
											name: 'Mask of Many Faces',
											description: 'You can cast Disguise Self at will, without expending a spell slot.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Misty Visions',
									optionDescription: 'Cast Silent Image at will.',
									nestedPrompts: [
										{
											id: 'warlock_misty_visions_desc_blade',
											name: 'Misty Visions',
											description: 'You can cast Silent Image at will, without expending a spell slot or material components.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Repelling Blast',
									optionDescription: 'Push creatures hit by Eldritch Blast.',
									nestedPrompts: [
										{
											id: 'warlock_repelling_blast_desc_blade',
											name: 'Repelling Blast',
											description: 'Prerequisite: Eldritch Blast cantrip. When you hit a creature with Eldritch Blast, you can push the creature up to 10 feet away from you in a straight line.<br><br>Note: Don\'t forget to choose Eldritch Blast for one of your cantrips!',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Thief of Five Fates',
									optionDescription: 'Cast Bane once per long rest.',
									nestedPrompts: [
										{
											id: 'warlock_thief_five_fates_desc_blade',
											name: 'Thief of Five Fates',
											description: 'You can cast Bane once using a warlock spell slot. You can\'t do so again until you finish a long rest.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								}
							],
							numPicks: 2
						},
						effects: [
							{
								target: 'features',
								action: 'add',
								value: '{userChoice}'
							}
						]
					}
				]
			},
			{
				name: 'Pact of the Tome',
				optionDescription: 'Gain a Book of Shadows with additional cantrips.',
				nestedPrompts: [
					{
						id: 'warlock_pact_tome_desc',
						name: 'Pact of the Tome',
						description:
							'Your patron gives you a grimoire called a Book of Shadows. When you gain this feature, choose three cantrips from any class\'s spell list (the three needn\'t be from the same list). While the book is on your person, you can cast those cantrips at will. They don\'t count against your number of cantrips known. If they don\'t appear on the warlock spell list, they are nonetheless warlock spells for you. If you lose your Book of Shadows, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be performed during a short or long rest, and it destroys the previous book. The book turns to ash when you die.',
						source: 'warlock.pact_boon',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Pact of the Tome'
							}
						]
					},
					{
						id: 'warlock_eldritch_invocations_tome',
						name: 'Eldritch Invocations',
						description: 'At 2nd level, you gain two eldritch invocations of your choice. When you gain certain warlock levels, you gain additional invocations of your choice.',
						source: 'warlock.eldritch_invocations',
						featureOptions: {
							placeholderText: 'Select two Invocations',
							options: [
								{
									name: 'Agonizing Blast',
									optionDescription: 'Add your Charisma modifier to Eldritch Blast damage.',
									nestedPrompts: [
										{
											id: 'warlock_agonizing_blast_desc_tome',
											name: 'Agonizing Blast',
											description:
												'Prerequisite: Eldritch Blast cantrip. When you cast Eldritch Blast, add your Charisma modifier to the damage it deals on a hit.<br><br>Note: Don\'t forget to choose Eldritch Blast for one of your cantrips!',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Armor of Shadows',
									optionDescription: 'Cast Mage Armor on yourself at will.',
									nestedPrompts: [
										{
											id: 'warlock_armor_of_shadows_desc_tome',
											name: 'Armor of Shadows',
											description: 'You can cast Mage Armor on yourself at will, without expending a spell slot or material components.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Beast Speech',
									optionDescription: 'Cast Speak with Animals at will.',
									nestedPrompts: [
										{
											id: 'warlock_beast_speech_desc_tome',
											name: 'Beast Speech',
											description: 'You can cast Speak with Animals at will, without expending a spell slot.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Beguiling Influence',
									optionDescription: 'Gain proficiency in Deception and Persuasion.',
									nestedPrompts: [
										{
											id: 'warlock_beguiling_influence_desc_tome',
											name: 'Beguiling Influence',
											description: 'You gain proficiency in the Deception and Persuasion skills.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Book of Ancient Secrets',
									optionDescription: 'Learn ritual spells in your Book of Shadows.',
									nestedPrompts: [
										{
											id: 'warlock_book_ancient_secrets_desc_tome',
											name: 'Book of Ancient Secrets',
											description: 'Prerequisite: Pact of the Tome. You can now inscribe magical rituals in your Book of Shadows. Choose two 1st-level spells that have the ritual tag from any class\'s spell list (the two needn\'t be from the same list). The spells appear in the book and don\'t count against the number of spells you know. With your Book of Shadows in hand, you can cast the chosen spells as rituals. You can\'t cast the spells except as rituals, unless you\'ve learned them by some other means. You can also cast a warlock spell you know as a ritual if it has the ritual tag. On your adventures, you can add other ritual spells to your Book of Shadows. When you find such a spell, you can add it to the book if the spell\'s level is equal to or less than half your warlock level (rounded up) and if you can spare the time to transcribe the spell. For each level of the spell, the transcription process takes 2 hours and costs 50 gp for the rare inks needed to inscribe it.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Devil\'s Sight',
									optionDescription: 'See normally in darkness, both magical and nonmagical.',
									nestedPrompts: [
										{
											id: 'warlock_devils_sight_desc_tome',
											name: 'Devil\'s Sight',
											description:
												'You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Eldritch Sight',
									optionDescription: 'Cast Detect Magic at will.',
									nestedPrompts: [
										{
											id: 'warlock_eldritch_sight_desc_tome',
											name: 'Eldritch Sight',
											description: 'You can cast Detect Magic at will, without expending a spell slot.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Eldritch Spear',
									optionDescription: 'Increase Eldritch Blast range to 300 feet.',
									nestedPrompts: [
										{
											id: 'warlock_eldritch_spear_desc_tome',
											name: 'Eldritch Spear',
											description: 'Prerequisite: Eldritch Blast cantrip. When you cast Eldritch Blast, its range is 300 feet.<br><br>Note: Don\'t forget to choose Eldritch Blast for one of your cantrips!',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Eyes of the Rune Keeper',
									optionDescription: 'Read all writing.',
									nestedPrompts: [
										{
											id: 'warlock_eyes_rune_keeper_desc_tome',
											name: 'Eyes of the Rune Keeper',
											description: 'You can read all writing.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Fiendish Vigor',
									optionDescription: 'Cast False Life on yourself at will.',
									nestedPrompts: [
										{
											id: 'warlock_fiendish_vigor_desc_tome',
											name: 'Fiendish Vigor',
											description:
												'You can cast False Life on yourself at will as a 1st-level spell, without expending a spell slot or material components.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Gaze of Two Minds',
									optionDescription: 'See through another creature\'s eyes.',
									nestedPrompts: [
										{
											id: 'warlock_gaze_two_minds_desc_tome',
											name: 'Gaze of Two Minds',
											description: 'You can use your action to touch a willing humanoid and perceive through its senses until the end of your next turn. As long as the creature is on the same plane of existence as you, you can use your action on subsequent turns to maintain this connection, extending the duration until the end of your next turn. While perceiving through the other creature\'s senses, you benefit from any special senses possessed by that creature, and you are blinded and deafened to your own surroundings.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Mask of Many Faces',
									optionDescription: 'Cast Disguise Self at will.',
									nestedPrompts: [
										{
											id: 'warlock_mask_many_faces_desc_tome',
											name: 'Mask of Many Faces',
											description: 'You can cast Disguise Self at will, without expending a spell slot.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Misty Visions',
									optionDescription: 'Cast Silent Image at will.',
									nestedPrompts: [
										{
											id: 'warlock_misty_visions_desc_tome',
											name: 'Misty Visions',
											description: 'You can cast Silent Image at will, without expending a spell slot or material components.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Repelling Blast',
									optionDescription: 'Push creatures hit by Eldritch Blast.',
									nestedPrompts: [
										{
											id: 'warlock_repelling_blast_desc_tome',
											name: 'Repelling Blast',
											description: 'Prerequisite: Eldritch Blast cantrip. When you hit a creature with Eldritch Blast, you can push the creature up to 10 feet away from you in a straight line.<br><br>Note: Don\'t forget to choose Eldritch Blast for one of your cantrips!',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								},
								{
									name: 'Thief of Five Fates',
									optionDescription: 'Cast Bane once per long rest.',
									nestedPrompts: [
										{
											id: 'warlock_thief_five_fates_desc_tome',
											name: 'Thief of Five Fates',
											description: 'You can cast Bane once using a warlock spell slot. You can\'t do so again until you finish a long rest.',
											source: 'warlock.eldritch_invocations',
											effects: []
										}
									]
								}
							],
							numPicks: 2
						},
						effects: [
							{
								target: 'features',
								action: 'add',
								value: '{userChoice}'
							}
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'warlock',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [pactMagicPrompt, pactBoonPrompt];

export const warlock: ClassData = {
	name: 'Warlock',
	image: base + '/class_icons/warlock.jpg',
	description: 'A wielder of magic granted by a pact with an otherworldly being.',
	hitDie: 'd8',
	primaryAbility: 'Charisma',
	saves: ['Wisdom', 'Charisma'],
	armorProficiencies: ['Light Armor'],
	weaponProficiencies: ['Simple Weapons'],
	startingEquipment: {
		fixed: ['Leather armor', '2 Daggers'],
		choices: [
			{
				name: 'Ranged Weapon',
				description: 'Choose your ranged weapon or primary weapon',
				options: [
					{
						label: 'Light crossbow and 20 bolts',
						items: ['Light crossbow', '20 crossbow bolts']
					},
					{
						label: 'Simple weapon',
						items: [],
						subChoices: [
							{
								name: 'Simple Weapon',
								description: 'Choose a simple weapon',
								type: 'weapon-list',
								category: 'simple',
								options: simpleWeapons,
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Secondary Weapon',
				description: 'Choose your secondary simple weapon',
				options: [
					{
						label: 'Simple weapon',
						items: [],
						subChoices: [
							{
								name: 'Simple Weapon',
								description: 'Choose a simple weapon',
								type: 'weapon-list',
								category: 'simple',
								options: simpleWeapons,
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Spellcasting Focus',
				description: 'Choose your spellcasting focus',
				options: [
					{
						label: 'Component pouch',
						items: ['Component pouch']
					},
					{
						label: 'Arcane focus',
						items: [],
						subChoices: [
							{
								name: 'Arcane Focus Type',
								description: 'Choose your arcane focus',
								type: 'simple-list',
								options: ['Crystal', 'Orb', 'Rod', 'Staff', 'Wand'],
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Equipment Pack',
				description: 'Choose your adventure kit',
				options: [
					{
						label: "Scholar's pack",
						items: [
							"Scholar's pack (includes: backpack, book of lore, ink bottle, ink pen, 10 sheets of parchment, little bag of sand, small knife)"
						]
					},
					{
						label: "Dungeoneer's pack",
						items: [
							"Dungeoneer's pack (includes: backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days of rations, waterskin, 50 feet of hempen rope)"
						]
					}
				]
			} as EquipmentChoice
		]
	},
	classFeatures: [proficienciesPrompt, otherworldlyPatronPrompt, ...classFeaturesPrompt]
};
