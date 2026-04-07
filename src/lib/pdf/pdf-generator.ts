/**
 * PDF Generator Service
 * 
 * This service loads the blank PDF template and fills it with character data
 * at the positions defined in character-sheet-config.ts
 */

import { PDFDocument, rgb, StandardFonts, PDFForm, PDFFont, numberToString, TextAlignment, newlineChars, componentsToColor, PDFPage } from 'pdf-lib';
import { PAGE_1_FIELDS, PAGE_2_FIELDS, PDF_CONFIG } from './character-sheet-config';
import fontkit from '@pdf-lib/fontkit';
import type { CharacterSheetData } from './character-data-mapper';
import { formatSpells } from './character-data-mapper';
import type { FieldConfig, TextAreaConfig } from './character-sheet-config';
import { spells, type Spell } from '$lib/data/spells';
import { formatFeatureForPDF, formatFeaturesForPDF } from '$lib/data/features/feature-data';
import { druid } from '$lib/data/classes/druid';
import { get } from 'svelte/store';
import { character_store } from '$lib/stores/character_store';
import { detectSpellLimitViolations } from '$lib/stores/conflict_detection';

/**
 * Load the blank PDF template from static folder
 */

async function loadTemplate(templateKey: string): Promise<PDFDocument> {	
	if (!PDF_CONFIG.templatePaths.has(templateKey)) {
		throw new Error(`PDF template not found`);
	}

	let response: any;
	let templatePath = PDF_CONFIG.templatePaths.get(templateKey)
	if (templatePath) {
		response = await fetch(templatePath);
	}
	if (!response.ok) {
		throw new Error(`Failed to load PDF template: ${response.statusText}`);
	}
	const arrayBuffer = await response.arrayBuffer();

	return await PDFDocument.load(arrayBuffer)
}

async function loadFontBuffer(fontNumber: number): Promise<ArrayBuffer> {
	if (fontNumber < 0 || fontNumber > PDF_CONFIG.fontPaths.length - 1) {
		throw new Error(`PDF font number out of range`);
	}
	
	const response = await fetch(PDF_CONFIG.fontPaths[fontNumber]);
	if (!response.ok) {
		throw new Error(`Failed to load PDF font: ${response.statusText}`);
	}
	const arrayBuffer = await response.arrayBuffer();
	return arrayBuffer
}

function fillFormField(form: any, fieldName: string, value: string, fontSize?: number, textAlignment?: TextAlignment) {
	form.getTextField(fieldName).setText(value);
	if (fontSize) {
		form.getTextField(fieldName).setFontSize(fontSize);
	}
	if (textAlignment) {
		form.getTextField(fieldName).setAlignment(textAlignment);
	}
}

async function fillFrontPage(
	page: any,
	data: CharacterSheetData,
	font: any,
	boldFont: any,
	italicFont: any
) {
	
	const form = page.getForm();
	
	// - - - - -
	// Info Box
	let classTextSize = 12;
	if (data.classAndLevel) {
		// Druid: for brevity, only list the keyword of the circle (ie Druid (Underdark)) 
		if (data.classAndLevel.includes('Circle')) {
			let newClassText = 'Druid ';
			let keyword = '';

			let classSplice = data.classAndLevel.split(' ').filter(text => text);

			// Grab just the last bit of the subclass, ignoring paranthesis.
			keyword = classSplice[classSplice.length - 1];
			keyword = keyword.replace(/\(/g, "");
			keyword = keyword.replace(/\)/g, "");

			fillFormField(form, 'class_info', newClassText + `(${keyword})`, classTextSize);
		} 
		// Wizard: for brevity, only list the keyword of the school (ie Wizard (Transmutation))
		else if (data.classAndLevel.includes('School')) {
			let newClassText = 'Wizard ';
			let keyword = '';

			let classSplice = data.classAndLevel.split(' ').filter(text => text);

			// Grab just the last bit of the subclass, ignoring paranthesis.
			keyword = classSplice[classSplice.length - 1];
			keyword = keyword.replace(/\(/g, "");
			keyword = keyword.replace(/\)/g, "");
			
			fillFormField(form, 'class_info', newClassText + `(${keyword})`, classTextSize);
		} 
		// All other classes: list class & subclass as-is
		else {
			fillFormField(form, 'class_info', data.classAndLevel, classTextSize);
		}

		
	}
	
	fillFormField(form, 'background_info', data.background, 12);
	//fillFormField(form, 'player_info', 'value');
	fillFormField(form, 'species_info', data.species, 12);
	//fillFormField(form, 'alignment_info', 'value');
	//fillFormField(form, 'character_name', 'value');

	// - - - - -
	// Stats
	fillFormField(form, 'str_mod', data.abilityScores.strength.modifier);
	fillFormField(form, 'dex_mod', data.abilityScores.dexterity.modifier);
	fillFormField(form, 'con_mod', data.abilityScores.constitution.modifier);
	fillFormField(form, 'int_mod', data.abilityScores.intelligence.modifier);
	fillFormField(form, 'wis_mod', data.abilityScores.wisdom.modifier);
	fillFormField(form, 'cha_mod', data.abilityScores.charisma.modifier);

	fillFormField(form, 'str_stat', data.abilityScores.strength.score);
	fillFormField(form, 'dex_stat', data.abilityScores.dexterity.score);
	fillFormField(form, 'con_stat', data.abilityScores.constitution.score);
	fillFormField(form, 'int_stat', data.abilityScores.intelligence.score);
	fillFormField(form, 'wis_stat', data.abilityScores.wisdom.score);
	fillFormField(form, 'cha_stat', data.abilityScores.charisma.score);

	// - - - - -
	// Battle Stats
	fillFormField(form, 'armor_class', data.armorClass);
	fillFormField(form, 'initiative', data.initiative);
	fillFormField(form, 'speed', data.speed);
	fillFormField(form, 'health', '/' + data.hitPointMaximum);

	// - - - - -
	// Saving Throws
	fillFormField(form, 'str_save', data.savingThrows.strength, 13, TextAlignment.Right);
	fillFormField(form, 'dex_save', data.savingThrows.dexterity, 13, TextAlignment.Right);
	fillFormField(form, 'con_save', data.savingThrows.constitution, 13, TextAlignment.Right);
	fillFormField(form, 'int_save', data.savingThrows.intelligence, 13, TextAlignment.Right);
	fillFormField(form, 'wis_save', data.savingThrows.wisdom, 13, TextAlignment.Right);
	fillFormField(form, 'cha_save', data.savingThrows.charisma, 13, TextAlignment.Right);

	// - - - - -
	// Skills
	let skills = [
		'acrobatics',
		'animal_handling',
		'arcana',
		'athletics',
		'deception',
		'history',
		'insight',
		'intimidation',
		'investigation',
		'medicine',
		'nature',
		'perception',
		'performance',
		'persuasion',
		'religion',
		'sleight_of_hand',
		'stealth',
		'survival',
	]

	for (let i = 0; i < skills.length; i++) {
		fillFormField(form, skills[i], data.skills[skills[i]], 13, TextAlignment.Right);
	}

	// - - - - -
	// Attacks & Spellcasting
	let attacks_names: string[] = [];
	let attacks_to_hit: string[] = [];
	let attacks_damage: string[] = [];
	let attacks_notes: string[] = [];
	
	data.attacks.forEach((attack, index) => {
		if (index < PAGE_1_FIELDS.attacks.length) {
			attacks_names.push(attack.name);
			attacks_to_hit.push('d20 ' + attack.bonus.substring(0,1) + ' ' + attack.bonus.substring(1));
			attacks_damage.push(attack.damage);
			
			let build_attacks_notes = "";
			let properties_blacklist = ["Ammunition", "Heavy", "Loading"];
			for (let i = 0; i < attack.properties.length; i++) {
				if (!properties_blacklist.includes(attack.properties[i])) {
					build_attacks_notes += attack.properties[i] + ", ";
				}
			}
			// Trim away the final trailing comma and space
			if (build_attacks_notes.length > 2) {
				build_attacks_notes = build_attacks_notes.slice(0, build_attacks_notes.length - 2)
			}
			attacks_notes.push(build_attacks_notes);
		}
	});

	let attacks_names_string: string = "";
	let AttacksToHitString: string = "";
	let attacks_damage_string: string = "";
	let attacks_notes_string: string = "";
	for (let i = 0; i < attacks_names.length; i++) {
		attacks_names_string += attacks_names[i] + '\n';
		AttacksToHitString += attacks_to_hit[i] + '\n';
		attacks_damage_string += attacks_damage[i] + '\n';
		attacks_notes_string += attacks_notes[i] + '\n';
	}

	// TODO: go through all damage cantrips and add to the appropriate array
	if (data.spells) {

		let damageCantrips: Spell[];
		damageCantrips = data.spells.filter(spell => {
			if (spell.level == 0 && spell.tags) {
				return (spell.tags.includes('SpellAttack')) || (spell.tags.includes('SpellSave'))
			}
		})

		if (damageCantrips.length >= 1) {
			attacks_names_string += '\n';
			AttacksToHitString += '\n';
			attacks_damage_string += '\n';
			attacks_notes_string += '\n';
		}

		for (let i = 0; i < damageCantrips.length; i++) {
			// Cantrip name
			attacks_names_string += damageCantrips[i].name + '\n';

			let spellStats = findSpellStats(data);

			let spellAttack = (await spellStats).spellAttack;
			let spellSaveDC = (await spellStats).spellSave;

			if (!spellAttack) {spellAttack = '+0'}
			if (!spellSaveDC) {spellSaveDC = '12'}

			let cantripTags = damageCantrips[i].tags
			// Spell Attack cantrips: format like 'd20 + 5'
			if (cantripTags && cantripTags.includes('SpellAttack')) {
				AttacksToHitString += 'd20 ' + spellAttack.substring(0,1) + ' ' + spellAttack.substring(1) + '\n';
			// Spell Save cantrips: format like 'DC 12'
			} else if (cantripTags && cantripTags.includes('SpellSave')) {
				// TODO: Add spell save type (DC 10 WHAT? DC 10 WIS)
				let saveType = '';
				if (damageCantrips[i].description.toLowerCase().includes('strength')) {
					saveType = ' STR';
				} else if (damageCantrips[i].description.toLowerCase().includes('dexterity')) {
					saveType = ' DEX';
				} else if (damageCantrips[i].description.toLowerCase().includes('constitution')) {
					saveType = ' CON';
				} else if (damageCantrips[i].description.toLowerCase().includes('intelligence')) {
					saveType = ' INT';
				} else if (damageCantrips[i].description.toLowerCase().includes('wisdom')) {
					saveType = ' WIS';
				} else if (damageCantrips[i].description.toLowerCase().includes('charisma')) {
					saveType = ' CHA';
				} 

				AttacksToHitString += 'DC ' + spellSaveDC + saveType + '\n';
			// If something goes wrong, still increment our newline spacing
			} else {
				AttacksToHitString += '\n';
			}

			// Cantrip damage & type
			if (damageCantrips[i].quickReferenceStats && damageCantrips[i].quickReferenceStats?.get('damage')) {
				attacks_damage_string += damageCantrips[i].quickReferenceStats?.get('damage') + '\n';
			} else {
				attacks_damage_string += '\n';
			}

			// Cantrip Notes
			if (damageCantrips[i].quickReferenceStats && damageCantrips[i].quickReferenceStats?.get('properties')) {
				attacks_notes_string += damageCantrips[i].quickReferenceStats?.get('properties') + '\n';
			} else {
				attacks_notes_string += '\n';
			}
		}
	}

	fillFormField(form, 'attacks_names', attacks_names_string, 10.5);
	fillFormField(form, 'attacks_to_hit', AttacksToHitString, 10.5);
	fillFormField(form, 'attacks_damage', attacks_damage_string, 10.5);
	fillFormField(form, 'attacks_notes', attacks_notes_string, 10.5);
	
	// - - - - -
	// Core Actions
	let core_actions: string[] = []
	let core_bonus_actions: string[] = []
	let core_other: string[] = []

	let class_cleaned = data.classAndLevel.trim()
	if (class_cleaned.includes(' ')) {
		class_cleaned = class_cleaned.substring(0, class_cleaned.indexOf(' '));
	}

	switch(class_cleaned.trim()) {
		// Barbarian mostly does Attack & Rage, but has some subclass adds
		case 'Barbarian':
			core_actions.push('Attack');
			core_actions.push('Reckless Attack');
			core_bonus_actions.push('Rage');
			
			if (data.features.includes('Eagle Totem Warrior')) {
				core_bonus_actions.push('Dash');
			}

			if (data.features.includes('Frenzy')) {
				core_bonus_actions.push('Frenzy Attack');
			}
			break;

		// Bard has a BA spell and a subclass feature
		case 'Bard':
			core_actions.push('Spellcasting');
			core_actions.push('Attack');
			core_bonus_actions.push('Bardic Inspiration');

			if (data.spells.filter(spell => {return spell.name == 'Healing Word'}).length) {
				core_bonus_actions.push('Healing Word');
			}

			if (data.features.includes('Cutting Words')) {
				core_other.push('Cutting Words');
			}
			break;
			
		// Cleric has a variety of subclass adds, and BA spells.
		case 'Cleric':
			core_actions.push('Attack');
			core_actions.push('Spellcasting');
			core_actions.push('Channel Divinity');

			if (data.features.includes('Blessing of the Trickster')) {
				core_actions.push('Blessing of the Trickster')
			}

			if (data.features.includes('War Priest')) {
				core_bonus_actions.push('War Priest Attack');
			}

			if (data.features.includes('Warding Flare')) {
				core_other.push('Warding Flare');
			}

			if (data.features.includes('Wrath of the Storm')) {
				core_other.push('Wrath of the Storm');
			}

			if (data.classAndLevel.includes('Life')) {
				core_bonus_actions.push('Spiritual Weapon');
			}

			if (data.classAndLevel.includes('War')) {
				core_bonus_actions.push('Divine Favor');
				core_bonus_actions.push('Shield of Faith');
				core_bonus_actions.push('Magic Weapon');
				core_bonus_actions.push('Spiritual Weapon');
			}

			// Add any of these bonus action spells that the player has but havent been added yet
			let clericBASpells = ['Healing Word', 'Sanctuary', 'Divine Favor', 'Shield of Faith', 'Magic Weapon', 'Spiritual Weapon']

			for (let i = 0; i < clericBASpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == clericBASpells[i]}).length) {
					// Avoid duplicate entries, dont add spell if it already exists
					if (!core_bonus_actions.includes(clericBASpells[i])) {
						core_bonus_actions.push(clericBASpells[i]);
					}	
				}
			}

			break;

		// Druid has several BA spells & their wildshape that might be an action / bonus action
		case 'Druid':
			let isCircleOfMoon = data.classAndLevel.includes('Moon')
			core_actions.push('Spellcasting');
			if (!isCircleOfMoon) {core_actions.push('Wildshape');}
			core_actions.push('Attack');

			if (isCircleOfMoon) {
				core_bonus_actions.push('Wildshape');
				core_bonus_actions.push('Wildshape Heal');
			}

			if (data.classAndLevel.includes('Coast')) {
				core_bonus_actions.push('Misty Step');
			}
			
			// Add any of these bonus action spells that the player has
			let druidBASpells = ['Shillelagh', 'Healing Word', 'Misty Step', 'Flame Blade', 'Expeditious Retreat']

			for (let i = 0; i < druidBASpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == druidBASpells[i]}).length) {
					if (!core_bonus_actions.includes(druidBASpells[i])) {
						core_bonus_actions.push(druidBASpells[i]);
					}
				}
			}
			break;

		case 'Fighter':
			core_actions.push('Attack');
			core_bonus_actions.push('Second Wind');
			core_other.push('Action Surge');

			if (data.classAndLevel.includes('Eldritch Knight')) {
				core_actions.push('Spellcasting');
				core_bonus_actions.push('Summon Weapon');
			}

			// Add any of these feature actions that the player has
			let fighterFeatureActions = ['Disarming Attack', 'Goading Attack', 'Lunging Attack', 'Maneuvering Attack', 'Menacing Attack', 'Precision Attack', 'Pushing Attack', 'Sweeping Attack', 'Trip Attack', 'Distracting Strike', "Commander's Strike"];
			let fighterFeatureBonusActions = ['Feinting Attack', 'Rally'];
			let fighterFeatureOther = ['Protection Fighting Style', 'Parry', 'Evasive Footwork', 'Riposte'];

			for (let i = 0; i < fighterFeatureActions.length; i++) {
				if (data.features.filter(feature => {return feature == fighterFeatureActions[i]}).length) {
					core_actions.push(fighterFeatureActions[i]);
				}
			}
			for (let i = 0; i < fighterFeatureBonusActions.length; i++) {
				if (data.features.filter(feature => {return feature == fighterFeatureBonusActions[i]}).length) {
					core_bonus_actions.push(fighterFeatureBonusActions[i]);
				}
			}
			for (let i = 0; i < fighterFeatureOther.length; i++) {
				if (data.features.filter(feature => {return feature == fighterFeatureOther[i]}).length) {
					core_other.push(fighterFeatureOther[i]);
				}
			}
			break;
			
		case 'Monk':
			core_actions.push('Attack');
			core_bonus_actions.push('Unarmed Strike');
			core_bonus_actions.push('Flurry of Blows');
			core_bonus_actions.push('Patient Defense');
			core_bonus_actions.push('Step of the Wind');
			core_other.push('Deflect Missiles');

			if (data.classAndLevel.includes('Shadow')) {
				core_actions.push('Shadow Arts');
			}

			if (data.classAndLevel.includes('Four Elements')) {
				core_actions.push('Elemental Attunement');
				core_actions.push('Elemental Disciplines');
			}
			break;
		
		case 'Paladin':
			core_actions.push('Attack');
			core_actions.push('Spellcasting');
			core_other.push('Smite');

			// Add any of these feature actions that the player has
			let paladinFeatureActions = ['Sacred Weapon', "Nature's Wrath", 'Abjure Enemy', 'Turn the Unholy', 'Turn the Faithless'];
			let paladinFeatureBonusActions = ['Vow of Enmity'];
			let paladinFeatureOther = ['Protection Fighting Style'];

			for (let i = 0; i < paladinFeatureActions.length; i++) {
				if (data.features.filter(feature => {return feature == paladinFeatureActions[i]}).length) {
					core_actions.push(paladinFeatureActions[i]);
				}
			}
			for (let i = 0; i < paladinFeatureBonusActions.length; i++) {
				if (data.features.filter(feature => {return feature == paladinFeatureBonusActions[i]}).length) {
					core_bonus_actions.push(paladinFeatureBonusActions[i]);
				}
			}
			for (let i = 0; i < paladinFeatureOther.length; i++) {
				if (data.features.filter(feature => {return feature == paladinFeatureOther[i]}).length) {
					core_other.push(paladinFeatureOther[i]);
				}
			}

			if (data.classAndLevel.includes('Devotion')) {
				core_bonus_actions.push('Sanctuary');
			}

			if (data.classAndLevel.includes('Ancients')) {
				core_bonus_actions.push('Ensnaring Strike');
			}

			if (data.classAndLevel.includes('Vengeance')) {
				core_bonus_actions.push("Hunter's Mark");
			}

			// Add any of these bonus action spells that the player has
			let paladinBASpells = ['Shield of Faith', "Hunter's Mark", 'Compelled Duel', 'Divine Favor', 'Searing Smite', 'Thunderous Smite', 'Wrathful Smite'];

			for (let i = 0; i < paladinBASpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == paladinBASpells[i]}).length) {
					if (!core_bonus_actions.includes(paladinBASpells[i])) {
						core_bonus_actions.push(paladinBASpells[i]);
					}
				}
			}
			break;

		case 'Ranger':
			core_actions.push('Attack', 'Spellcasting', 'Primeval Awareness');
			
			if (data.classAndLevel.includes('Beast Master')) {
				core_actions.push('Beast Action');
			}
			
			// Add any of these bonus action spells that the player has
			let rangerBASpells = ['Hail of Thorns', "Hunter's Mark"];

			for (let i = 0; i < rangerBASpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == rangerBASpells[i]}).length) {
					core_bonus_actions.push(rangerBASpells[i]);
				}
			}

			// Add any of these feature actions that the player has
			let rangerFeatureOther = ['Giant Killer', 'Horde Breaker', 'Colossus Slayer'];
			for (let i = 0; i < rangerFeatureOther.length; i++) {
				if (data.features.filter(feature => {return feature == rangerFeatureOther[i]}).length) {
					core_other.push(rangerFeatureOther[i]);
				}
			}
			break;
			
		case 'Rogue':
			core_actions.push('Sneak Attack');
			core_bonus_actions.push('Dash');
			core_bonus_actions.push('Disengage');
			core_bonus_actions.push('Hide');

			if (data.classAndLevel.includes('Thief')) {
				core_bonus_actions.push('Fast Hands');
			}
			if (data.classAndLevel.includes('Arcane Trickster')) {
				core_actions.push('Spellcasting');
			}

			// Add any of these spells that the player has
			let rogueBASpells = ['Expeditious Retreat'];
			let rogueOtherSpells = ['Feather Fall', 'Shield'];
			
			for (let i = 0; i < rogueBASpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == rogueBASpells[i]}).length) {
					core_bonus_actions.push(rogueBASpells[i]);
				}
			}
			for (let i = 0; i < rogueOtherSpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == rogueOtherSpells[i]}).length) {
					core_other.push(rogueOtherSpells[i]);
				}
			}
			break;
		
		case 'Sorcerer':
			core_actions.push('Spellcasting');
			core_actions.push('Attack');

			// Add any of these feature actions that the player has
			let sorcererFeatureBonusActions = ['Quickened Spell'];
			let sorcererFeatureOther = ['Careful Spell', 'Distant Spell', 'Empowered Spell', 'Extended Spell', 'Heightened Spell', 'Subtle Spell', 'Twinned Spell'];

			for (let i = 0; i < sorcererFeatureBonusActions.length; i++) {
				if (data.features.filter(feature => {return feature == sorcererFeatureBonusActions[i]}).length) {
					core_bonus_actions.push(sorcererFeatureBonusActions[i]);
				}
			}
			for (let i = 0; i < sorcererFeatureOther.length; i++) {
				if (data.features.filter(feature => {return feature == sorcererFeatureOther[i]}).length) {
					core_other.push(sorcererFeatureOther[i]);
				}
			}

			if (data.features.includes('Tides of Chaos')) {
				core_other.push('Tides of Chaos');
			}
			
			// Add any of these spells that the player has
			let sorcererBASpells = ['Expeditious Retreat', 'Misty Step'];
			let sorcererOtherSpells = ['Feather Fall', 'Shield'];
			
			for (let i = 0; i < sorcererBASpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == sorcererBASpells[i]}).length) {
					core_bonus_actions.push(sorcererBASpells[i]);
				}
			}
			for (let i = 0; i < sorcererOtherSpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == sorcererOtherSpells[i]}).length) {
					core_other.push(sorcererOtherSpells[i]);
				}
			}

			break;

		case 'Warlock':
			core_actions.push('Spellcasting');
			core_actions.push('Attack');

			if (data.features.includes('Fey Presence')) {
				core_actions.push('Fey Presence');
			}

			if (data.features.includes('Pact of the Chain')) {
				core_actions.push('Familiar Attack');
			}

			if (data.features.includes('Pact of the Blade')) {
				core_actions.push('Create Pact Weapon');
			}

			let warlockInvocationActions = ['Armor of Shadows', 'Beast Speech', 'Detect Magic', 'Fiendish Vigor', 'Gaze of Two Minds', 'Disguise Self', 'Misty Visions', 'Thief of Five Fates']
			for (let i = 0; i < warlockInvocationActions.length; i++) {
				if (data.features.filter(feature => {return feature == warlockInvocationActions[i]}).length) {
					core_actions.push(warlockInvocationActions[i]);
				}
			}

			// Add any of these spells that the player has
			let warlockBASpells = ['Shillelagh', 'Expeditious Retreat', 'Hex', 'Misty Step'];
			let warlockOtherSpells = ['Hellish Rebuke'];
			
			for (let i = 0; i < warlockBASpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == warlockBASpells[i]}).length) {
					core_bonus_actions.push(warlockBASpells[i]);
				}
			}
			for (let i = 0; i < warlockOtherSpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == warlockOtherSpells[i]}).length) {
					core_other.push(warlockOtherSpells[i]);
				}
			}
			break;
			
		case 'Wizard':
			core_actions.push('Spellcasting');
			core_actions.push('Attack');

			if (data.features.includes('Minor Conjuration')) {
				core_actions.push('Minor Conjuration');
			}

			if (data.features.includes('Hypnotic Gaze')) {
				core_actions.push('Hypnotic Gaze');
			}

			if (data.features.includes('Portent')) {
				core_other.push('Portent');
			}

			// Add any of these spells that the player has
			let wizardBASpells = ['Expeditious Retreat', 'Misty Step'];
			let wizardOtherSpells = ['Feather Fall', 'Shield'];
			
			for (let i = 0; i < wizardBASpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == wizardBASpells[i]}).length) {
					core_bonus_actions.push(wizardBASpells[i]);
				}
			}
			for (let i = 0; i < wizardOtherSpells.length; i++) {
				if (data.spells.filter(spell => {return spell.name == wizardOtherSpells[i]}).length) {
					core_other.push(wizardOtherSpells[i]);
				}
			}
			break;
	}

	switch(data.species.trim()) {
		case 'Dragonborn':
			core_actions.push('Breath Weapon')
			break;
		case 'Dark Elf (Elf)':
			core_actions.push('Drow Magic')
			break;
		case 'Rock Gnome (Gnome)':
			core_other.push('Tinker')
			break;
		case 'Tiefling':
			if (!core_other.includes('Hellish Rebuke')) {
				core_other.push('Hellish Rebuke')
			}
			break;
	}

	let core_actions_string = core_actions.join(",\n");
	let core_bonus_actions_string = core_bonus_actions.join(",\n");
	let core_reactions_string = core_other.join(",\n");

	fillFormField(form, 'core_actions', core_actions_string, 10.5);
	fillFormField(form, 'core_bonus_actions', core_bonus_actions_string, 10.5);
	fillFormField(form, 'core_reactions', core_reactions_string, 10.5);

	form.flatten()
}


function chunk(input: string, chunkSize: number) {
	let re = new RegExp(String.raw`([\S\s]{1,${chunkSize}})`, "g");
	return input.match(re)
}

// Get chunks of up to X characters. Each chunk should roll any cut-off words to the next chunk.
function chunkLinesWordBumped(input: string, chunkSizeMax: number) {
	let chunks: string[] = [];
	let startIndex = 0;
	let endIndex = 0;

	function chunksPush(input: string) {
		chunks.push(input.trim());
	}

	// Loop until we are done processing
	while (endIndex != input.length-1) {

		// Progress X characters forward, but do not go out of bounds
		endIndex += chunkSizeMax;

		// Check for our bold tag, since it shouldnt count towards characters per line
		if (input.substring(startIndex, endIndex+1).includes('<bold:>')) {
			endIndex += 7;
		}

		// If we reach the end of this string right away, we can capture the rest in one chunk now
		if (endIndex > input.length-1) {
			endIndex = input.length-1
			chunksPush(input.substring(startIndex, endIndex+1));
			break;
		}

		// If the character after this chunk is a space, we are good. Add this chunk.
		if (input[endIndex] == ' ') {
			chunksPush(input.substring(startIndex, endIndex));
			startIndex = endIndex;
		}

		// Otherwise, we are likely cutting some word in half.
		else {
			// Back track endIndex until we find a space or until we have backtracked all of the way to startIndex
			while (endIndex > startIndex && !(input[endIndex] == ' ')) {
				endIndex--;
			}
			// If we failed to find a space, we are forced to cut this very long word.
			if (endIndex == startIndex) {
				endIndex += chunkSizeMax;
				chunksPush(input.substring(startIndex, endIndex));
				startIndex = endIndex;
			
			// Otherwise, we found a space! We can add everything up to and including that space into this chunk
			} else {
				// in this state, endIndex is pointing at the final character of this chunk, when usually, it is pointing one after.
				endIndex += 1
				if (endIndex > input.length-1) {endIndex = input.length-1}
				chunksPush(input.substring(startIndex, endIndex));
				startIndex = endIndex;
			}
		}
	}

	console.log('chunks: [length, chunkText]');
	for (let i = 0; i < chunks.length; i++) {
		console.log(chunks[i].length, chunks[i]);
	}

	return chunks;
}

function processLayeredColumns(input: string, charactersPerRow: number) {
	//console.log(JSON.stringify(input));
	
	let linesUsed = 0;
	let newLineSplit = input.split('\n');

	let boldLayer = "";
	let plainLayer = "";
	
	for (let i = 0; i < newLineSplit.length; i++) {
		console.log('-------------\nStep 2:');
		console.log('newLineSplit[i], charactersPerRow: ' + newLineSplit[i] + ' ' + charactersPerRow);
		let charLimitSplit = chunkLinesWordBumped(newLineSplit[i], charactersPerRow);``
		if (!charLimitSplit) {continue;}
		for (let j = 0; j < charLimitSplit.length; j++) {
			if (charLimitSplit[j].includes('<bold:>')) {
				boldLayer += charLimitSplit[j].substring(7) + '\n';
				plainLayer += '\n';
				linesUsed++;
				// console.log('----------');
				// console.log('boldLayer += ' + charLimitSplit[j].substring(7) + ' + newline');
				// console.log('plainLayer += ' + 'newline');
				
			} else {
				boldLayer += '\n';
				plainLayer += charLimitSplit[j] + '\n';
				linesUsed++;
				// console.log('----------');
				// console.log('boldLayer += ' + 'newline');
				// console.log('plainLayer += ' + charLimitSplit[j] + ' + newline');
			}
		}
	}

	return {
		'plainLayer': plainLayer, 'boldLayer': boldLayer, 'linesUsed': linesUsed,
	};
}


async function fillFeaturesPage(
	page: any,
	data: CharacterSheetData,
	font: any,
	boldFont: any,
	italicFont: any
) {
	const form = page.getForm()

	const charactersPerRow = 56;
	const maxLinesPerColumn = 65;

	let featureContent = formatFeaturesForPDF(data.features, data.characterReference, 'all');

	let columnOneContent = '';
	let columnOneBoldContent = '';
	let columnTwoContent = '';
	let columnTwoBoldContent = '';

	let lineCount = 0;

	// Iterate through feature chunks (entire features separated by a blank line)
	let featureChunks = featureContent.split('\n\n');
	for (let i = 0; i < featureChunks.length; i++) {	
		console.log('--------------\nStep 1:');
		console.log(JSON.stringify(featureChunks[i] + '\n\n'));
		const layeredColumnsProcessed = processLayeredColumns(featureChunks[i] + '\n\n', charactersPerRow);

		if (lineCount + layeredColumnsProcessed.linesUsed <= maxLinesPerColumn) {
			lineCount += layeredColumnsProcessed.linesUsed;
			columnOneContent += layeredColumnsProcessed.plainLayer;
			columnOneBoldContent += layeredColumnsProcessed.boldLayer;
		}

		else {
			lineCount += layeredColumnsProcessed.linesUsed;
			columnTwoContent += layeredColumnsProcessed.plainLayer;
			columnTwoBoldContent += layeredColumnsProcessed.boldLayer;
		}
	}

	let fontSize = 10;

	fillFormField(form, 'page_title', 'Features', 12, TextAlignment.Center);
	fillFormField(form, 'column_one', columnOneContent, fontSize);
	fillFormField(form, 'column_two', columnTwoContent, fontSize);

	
	fillFormField(form, 'column_one_back', columnOneBoldContent, fontSize);
	form.getTextField('column_one_back').updateAppearances(boldFont);
	fillFormField(form, 'column_two_back', columnTwoBoldContent, fontSize);
	form.getTextField('column_two_back').updateAppearances(boldFont);

	form.flatten()
}


async function fillEquipmentPage(
	page: any,
	data: CharacterSheetData,
	font: any,
	boldFont: any,
	italicFont: any
) {
	const form = page.getForm()

	let packTextRaw = '';
	let packTextFormatted = '';
	let remainingText = '';

	// Check for any packs, which we will display separately. Assume packs always come first.
	if (data.equipment.includes('pack') && data.equipment.includes('(includes:') && data.equipment.includes(')')) {
		packTextRaw = data.equipment.substring(0, data.equipment.indexOf(')')+1);
		remainingText = data.equipment.substring(data.equipment.indexOf(')')+1);

		// Pack Name: all text, up to the string 'pack'
		packTextFormatted += packTextRaw.substring(0, packTextRaw.indexOf('pack')+4) + ':\n';
		
		// Pack Contents: starts after 'includes:' and ends before the final ')'
		let packContents = packTextRaw.substring(packTextRaw.indexOf('includes: ')+10, packTextRaw.length-1).split(', ');

		// Format each pack item, adding bullet point, and capitalizing the first character
		for (let i = 0; i < packContents.length; i++) {
			packTextFormatted += '•  ' + packContents[i].charAt(0).toUpperCase() + packContents[i].slice(1) + '\n';
		}
		
		// For all other equipement add a bullet point and new line to each item
		if (remainingText[0] == '\n') {
			remainingText = remainingText.substring(1);
			remainingText = '•  ' + remainingText.replace(/\n/g, '\n•  ');
		}
	}

	if (packTextFormatted) {
		fillFormField(form, 'page_title_top', 'Equipment', 12, TextAlignment.Center);
		fillFormField(form, 'column_one_top', packTextFormatted, 12);
		fillFormField(form, 'column_two_top', remainingText, 12);
	} else {

		let equipmentSplit = data.equipment.split('\n')
		let equipmentSplitBulleted: string[] = []
		for (let i = 0; i < equipmentSplit.length; i++) {
			equipmentSplitBulleted.push('•  ' + equipmentSplit[i]);
		}

		fillFormField(form, 'page_title_top', 'Equipment', 12, TextAlignment.Center);
		fillFormField(form, 'column_one_top', equipmentSplitBulleted.join('\n'), 12);
		fillFormField(form, 'column_two_top', '', 12);
	}

	// Character Notes is left blank for the player to fill in after printing
	fillFormField(form, 'page_title_bottom', 'Character Notes', 12, TextAlignment.Center);
	fillFormField(form, 'column_one_bottom', '');
	fillFormField(form, 'column_two_bottom', '');

	form.flatten()
}


async function findSpellStats(data: CharacterSheetData): Promise<{
	spellAttack: string | undefined; 
	spellSave: string | undefined;
}> {
	const characterReference = data.characterReference
	let spellAbilityMod = undefined;

	switch (characterReference.class) {
		// CHARISMA based
		case 'Bard':
		case 'Paladin':
		case 'Sorcerer':
		case 'Warlock':
			if (characterReference.charisma) {
				spellAbilityMod = Math.floor(((characterReference.charisma - 10) / 2))
			}
			break;
		
		// WISDOM based
		case 'Cleric':
		case 'Druid':
		case 'Ranger':
			if (characterReference.wisdom) {
				spellAbilityMod = Math.floor(((characterReference.wisdom - 10) / 2))
			}
			break;
		
		// WISDOM based (must be Way of Shadow or Four Elements)
		case 'Monk':
			if (characterReference.subclass && ['Way of Shadow', 'Way of the Four Elements'].includes(characterReference.subclass)) {
				if (characterReference.wisdom) {
					spellAbilityMod = Math.floor(((characterReference.wisdom - 10) / 2))
				}
			}
			break;
		
		// WISDOM based (must be Totem Warrior)
		// TODO: Consider having totem warrior have no casting ability
		case 'Barbarian':
			if (characterReference.subclass == 'Totem Warrior') {
				if (characterReference.wisdom) {
					spellAbilityMod = Math.floor(((characterReference.wisdom - 10) / 2))
				}
			}
			break;

		// INTELLIGENCE based
		case 'Wizard':
			if (characterReference.intelligence) {
				spellAbilityMod = Math.floor(((characterReference.intelligence - 10) / 2))
			}
			break;
		
		// INTELLIGENCE based (Must be Eldritch Knight)
		case 'Fighter':
			if (characterReference.subclass == 'Eldritch Knight') {
				if (characterReference.intelligence) {
					spellAbilityMod = Math.floor(((characterReference.intelligence - 10) / 2))
				}
			}
			break;
		
		// INTELLIGENCE based (Must be Arcane Trickster)
		case 'Rogue':
			if (characterReference.subclass == 'Arcane Trickster') {
				if (characterReference.intelligence) {
					spellAbilityMod = Math.floor(((characterReference.intelligence - 10) / 2))
				}
			}
			break;
	}

	// If no primary source for spellcasting is found, also check the character's species
	if (!spellAbilityMod) {
		switch (characterReference.race) {
			case 'High Elf':
				if (characterReference.intelligence) {
					spellAbilityMod = Math.floor(((characterReference.intelligence - 10) / 2))
				}
				break;

			case 'Dark Elf':
				if (characterReference.charisma) {
					spellAbilityMod = Math.floor(((characterReference.charisma - 10) / 2))
				}
				break;

			case 'Forest Gnome':
				if (characterReference.intelligence) {
					spellAbilityMod = Math.floor(((characterReference.intelligence - 10) / 2))
				}
				break;

			case 'Tiefling':
				if (characterReference.charisma) {
					spellAbilityMod = Math.floor(((characterReference.charisma - 10) / 2))
				}
				break;


		}
	}

	if (!spellAbilityMod) {
		return {
			spellAttack: undefined,
			spellSave: undefined,
		}
	}

	// If the mod is positive, we need to manually add a plus
	let spellAttackString = spellAbilityMod >= 0 ? '+' : '';
	spellAttackString += String(spellAbilityMod + 2)

	let spellSaveString = String(10 + spellAbilityMod)
	
	return {
		spellAttack: spellAttackString,
		spellSave: spellSaveString,
	}
}


async function fillSpellsPage(
	data: CharacterSheetData,
	pagesData: {
		page: any,
		font: any,
		boldFont: any,
		italicFont: any
	}[]
): Promise<boolean> {
	
	let form1;
	let form2;
	
	if (pagesData[0] && pagesData[0].page) {
		form1 = pagesData[0].page.getForm()
	}
	if (pagesData[1] && pagesData[1].page) {
		form2 = pagesData[1].page.getForm()
	}

	const charactersPerRow = 50;
	let maxLinesPerColumn = 60;
	// For spells, we want to leave room for Spell Save, Spell Attack, and Spell Slots. So, both columns should have a couple leading lines of whitespace
	const whitespaceLines = 1;
	maxLinesPerColumn -= whitespaceLines;

	let spellsContent = formatSpells(data.characterReference);

	let columnOneContent = '\n'.repeat(whitespaceLines);
	let columnOneBoldContent = '\n'.repeat(whitespaceLines);

	let columnTwoContent = '\n'.repeat(whitespaceLines);
	let columnTwoBoldContent = '\n'.repeat(whitespaceLines);
	
	let columnThreeContent = '\n'.repeat(whitespaceLines);
	let columnThreeBoldContent = '\n'.repeat(whitespaceLines);
	
	let columnFourContent = '\n'.repeat(whitespaceLines);
	let columnFourBoldContent = '\n'.repeat(whitespaceLines);
	
	let lineCount = 0;
	let pageTwoUsed = false;
	
	// Iterate through feature chunks (entire features separated by a blank line)
	let spellsChunks = spellsContent.split('\n\n');
	for (let i = 0; i < spellsChunks.length; i++) {	
		let spellChunk: string;
		if (i != spellsChunks.length - 1) {
			spellChunk = spellsChunks[i] + '\n\n';
		} else {
			spellChunk = spellsChunks[i];
		}
		
		const layeredColumnsProcessed = processLayeredColumns(spellChunk, charactersPerRow);

		// TODO: figure out which column we are adding to
		// 	 	 divide by length
		console.log('layeredColumnsProcessed: ', layeredColumnsProcessed);
		console.log('lineCount: ', lineCount);
		console.log('layeredColumnsProcessed.linesUsed: ', layeredColumnsProcessed.linesUsed);
		console.log('maxLinesPerColumn: ', maxLinesPerColumn);
		
		let column_destination = Math.floor((lineCount + layeredColumnsProcessed.linesUsed) / maxLinesPerColumn) + 1;
		console.log('column_destination: ', column_destination);

		// Handle overflow, pushing content to next column when there isnt any more room.
		switch (column_destination) {
			case 1:
				lineCount += layeredColumnsProcessed.linesUsed;
				columnOneContent += layeredColumnsProcessed.plainLayer;
				columnOneBoldContent += layeredColumnsProcessed.boldLayer;
				break;
			case 2:
				lineCount += layeredColumnsProcessed.linesUsed;
				columnTwoContent += layeredColumnsProcessed.plainLayer;
				columnTwoBoldContent += layeredColumnsProcessed.boldLayer;
				break;
			case 3:
				lineCount += layeredColumnsProcessed.linesUsed;
				columnThreeContent += layeredColumnsProcessed.plainLayer;
				columnThreeBoldContent += layeredColumnsProcessed.boldLayer;
				pageTwoUsed = true;
				break;
			case 4:
				lineCount += layeredColumnsProcessed.linesUsed;
				columnFourContent += layeredColumnsProcessed.plainLayer;
				columnFourBoldContent += layeredColumnsProcessed.boldLayer;
				pageTwoUsed = true;
				break;		
		}
	}

	let spellStats = findSpellStats(data);

	let spellAttack = (await spellStats).spellAttack;
	let spellSave = (await spellStats).spellSave;

	let fontSize = 4;

	// Format page 1
	if (form1) {
		if (spellAttack && spellSave) {
			fillFormField(form1, 'spell_attack', spellAttack);
			fillFormField(form1, 'spell_save_dc', spellSave);
		}
		
		fillFormField(form1, 'column_one_top', columnOneContent, fontSize);
		fillFormField(form1, 'column_two_top', columnTwoContent, fontSize);

		fillFormField(form1, 'column_one_bottom', columnOneBoldContent, fontSize);
		form1.getTextField('column_one_bottom').updateAppearances(pagesData[0].boldFont);
		fillFormField(form1, 'column_two_bottom', columnTwoBoldContent, fontSize);
		form1.getTextField('column_two_bottom').updateAppearances(pagesData[0].boldFont);

		form1.flatten()
	}
	

	// Format page 2
	if (form2) {
		if (spellAttack && spellSave) {
			fillFormField(form2, 'spell_attack', spellAttack);
			fillFormField(form2, 'spell_save_dc', spellSave);
		}
		
		fillFormField(form2, 'column_one_top', columnThreeContent, fontSize);
		fillFormField(form2, 'column_two_top', columnFourContent, fontSize);

		fillFormField(form2, 'column_one_bottom', columnThreeBoldContent, fontSize);
		form2.getTextField('column_one_bottom').updateAppearances(pagesData[1].boldFont);
		fillFormField(form2, 'column_two_bottom', columnFourBoldContent, fontSize);
		form2.getTextField('column_two_bottom').updateAppearances(pagesData[1].boldFont);

		form2.flatten()
	}

	return pageTwoUsed;
}


/**
 * Generate filled PDF from character data
 * Returns a data URL that can be used in iframe/embed or downloaded
 */
export async function generateCharacterSheet(data: CharacterSheetData): Promise<string> {
	try {
		// Load templates
		const frontPageDoc = await loadTemplate('Front Page');
		const featuresPageDoc = await loadTemplate('Two Column Page');
		const equipmentPageDoc = await loadTemplate('Equipment Page');

		const beastsPageDoc = await loadTemplate('Two Column Page');

		const spellsBasicPageDoc = await loadTemplate('Spells Basic');
		const spellsPageTwoDoc = await loadTemplate('Spells Basic');
		const spellsFullCasterPageDoc = await loadTemplate('Spells Full Caster');
		const spellsHalfCasterPageDoc = await loadTemplate('Spells Half Caster');
		const spellsThirdCasterPageDoc = await loadTemplate('Spells Third Caster');
		const spellsSorcererPageDoc = await loadTemplate('Spells Sorcerer');
		const spellsWarlockPageDoc = await loadTemplate('Spells Warlock');
		const spellsMonkPageDoc = await loadTemplate('Spells Monk');

		// Custom Fonts
		const fontOneBuffer = await loadFontBuffer(0);
		//const fontTwoBuffer = await loadFontBuffer(1);

		const templates = [
			frontPageDoc,
			featuresPageDoc,
			equipmentPageDoc,
			beastsPageDoc,
			spellsBasicPageDoc,
			spellsPageTwoDoc,
			spellsFullCasterPageDoc,
			spellsHalfCasterPageDoc,
			spellsThirdCasterPageDoc,
			spellsSorcererPageDoc,
			spellsWarlockPageDoc,
			spellsMonkPageDoc,
		]

		// Register and store fonts for each page
		let templateFonts = new Map
		for (let i = 0; i < templates.length; i++) {
			if (!templates[i]) {
				throw new Error('Missing PDF Template: ' + i);
			}
			
			templates[i].registerFontkit(fontkit);
			// We may need this information later, but currently the returned fonts are unused
			let pageFonts: PDFFont[] = [
				await templates[i].embedFont(StandardFonts.Helvetica),
				await templates[i].embedFont(StandardFonts.HelveticaBold),
				await templates[i].embedFont(StandardFonts.HelveticaOblique),
				await templates[i].embedFont(fontOneBuffer),
				// Consider adding other custom font (#2 and onwards)
			]
			// Save the fonts to a Map, where the key is the pageDoc (PDFDocument)
			templateFonts.set(templates[i], pageFonts)
		}
		
		// Grab a reference to each first page (each array only has one page anyways)
		// TODO: Consider removing. Currently unused
		const frontPage = frontPageDoc.getPages()[0];
		const featuresPage = featuresPageDoc.getPages()[0];
		const equipmentPage = equipmentPageDoc.getPages()[0];

		const beastsPage = beastsPageDoc.getPages()[0];
		
		const spellsBasicPage = spellsBasicPageDoc.getPages()[0];
		const spellsFullCasterPage = spellsFullCasterPageDoc.getPages()[0];
		const spellsHalfCasterPage = spellsHalfCasterPageDoc.getPages()[0];
		const spellsThirdCasterPage = spellsThirdCasterPageDoc.getPages()[0];
		const spellsSorcererPage = spellsSorcererPageDoc.getPages()[0];
		const spellsWarlockPage = spellsWarlockPageDoc.getPages()[0];
		const spellsMonkPage = spellsMonkPageDoc.getPages()[0];

		
		// Start filling pages with data
		let freshPdfDoc = await PDFDocument.create()

		// The first three pages will be the same across all characters
		await fillFrontPage(frontPageDoc, data, templateFonts.get(frontPageDoc)[3], templateFonts.get(frontPageDoc)[1], templateFonts.get(frontPageDoc)[2]);
		await fillFeaturesPage(featuresPageDoc, data, templateFonts.get(featuresPageDoc)[3], templateFonts.get(featuresPageDoc)[1], templateFonts.get(featuresPageDoc)[2]);
		await fillEquipmentPage(equipmentPageDoc, data, templateFonts.get(equipmentPageDoc)[3], templateFonts.get(equipmentPageDoc)[1], templateFonts.get(equipmentPageDoc)[2]);
		
		const [frontPageCopy] = await freshPdfDoc.copyPages(frontPageDoc, [0])
		const [featuresPageCopy] = await freshPdfDoc.copyPages(featuresPageDoc, [0])
		const [equipmentPageCopy] = await freshPdfDoc.copyPages(equipmentPageDoc, [0])

		freshPdfDoc.addPage(frontPageCopy)
		freshPdfDoc.addPage(featuresPageCopy)
		freshPdfDoc.addPage(equipmentPageCopy)


		// For other export pages, we may need to check the character's details to see what pages will be added
		const char = data.characterReference;
		let selectedClass = char.class;
		let selectedSubClass = char.subclass;
		let selectedSpecies = char.race;
		let selectedSubSpecies = char.subrace;


		// Check beast usage



		// Check spell usage, and ID which spell page one to use for this character
		let spellsPageOneDoc: PDFDocument | undefined;
		switch (selectedClass) {
			case 'Bard':
			case 'Cleric':
			case 'Druid':
			case 'Wizard':
				spellsPageOneDoc = spellsFullCasterPageDoc;
				break;

			case 'Paladin':
			case 'Ranger':
				spellsPageOneDoc = spellsHalfCasterPageDoc;
				break;

			case 'Fighter':
			case 'Rogue':
				// Go deeper and see if the right subclass is there
				if (selectedSubClass == 'Eldritch Knight' || selectedSubClass == 'Arcane Trickster') {
					spellsPageOneDoc = spellsThirdCasterPageDoc;
				} else {
					spellsPageOneDoc = undefined;
				}
				break;

			case 'Warlock':
				spellsPageOneDoc = spellsWarlockPageDoc;
				break;

			case 'Sorcerer':
				spellsPageOneDoc = spellsSorcererPageDoc;
				break;

			case 'Monk':
				spellsPageOneDoc = spellsMonkPageDoc;
				break;

			default: 
				if ((selectedSubClass == 'Totem Warrior') || 
				['High Elf', 'Dark Elf', 'Forest Gnome', 'Tiefling'].includes(selectedSpecies) ||
				(selectedSubSpecies && ['High Elf', 'Dark Elf', 'Forest Gnome', 'Tiefling'].includes(selectedSubSpecies))
			) {
					spellsPageOneDoc = spellsBasicPageDoc;
				} else {
					console.log('Flag! spellsPageOneDoc: ', spellsPageOneDoc);
					console.log('selectedSpecies: ', selectedSpecies);
					console.log('char.subrace: ', char.subrace);
				}
				break;
		}

		// If spells are indeed used, also attach the spell page(s)
		if (spellsPageOneDoc) {

			// fill out the spell page(s)
			// fillSpellsPage() returns a boolean, telling us if two pages were used
			let needsTwoSpellPages = await fillSpellsPage(data, [
				{
					page: spellsPageOneDoc,
					font: templateFonts.get(spellsPageOneDoc)[3],
					boldFont: templateFonts.get(spellsPageOneDoc)[1],
					italicFont: templateFonts.get(spellsPageOneDoc)[2]
				},
				{
					page: spellsPageTwoDoc,
					font: templateFonts.get(spellsPageTwoDoc)[3],
					boldFont: templateFonts.get(spellsPageTwoDoc)[1],
					italicFont: templateFonts.get(spellsPageTwoDoc)[2]
				},
			]);

			// Add page 1
			const [spellsPageOneCopy] = await freshPdfDoc.copyPages(spellsPageOneDoc, [0])
			freshPdfDoc.addPage(spellsPageOneCopy)

			// Add page 2, if two pages were needed
			if (needsTwoSpellPages) {
				const [spellsPageTwoCopy] = await freshPdfDoc.copyPages(spellsPageTwoDoc, [0])
				freshPdfDoc.addPage(spellsPageTwoCopy)
			}
			
		}

		const pdfBytes = await freshPdfDoc.save();

		const byteArray = new Uint8Array(pdfBytes);
		const blob = new Blob([byteArray], { type: 'application/pdf' });
		return URL.createObjectURL(blob);

	} catch (error) {
		console.error('Error generating PDF:', error);
		throw new Error(`Failed to generate character sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

/**
 * Download the generated PDF
 */
export async function downloadCharacterSheet(data: CharacterSheetData, filename?: string): Promise<void> {
	const pdfUrl = await generateCharacterSheet(data);
	const link = document.createElement('a');
	link.href = pdfUrl;
	link.download = filename || `${data.characterName || 'character'}-sheet.pdf`;
	link.click();
	URL.revokeObjectURL(pdfUrl);
}
