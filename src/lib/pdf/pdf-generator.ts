/**
 * PDF Generator Service
 * 
 * This service loads the blank PDF template and fills it with character data
 * at the positions defined in character-sheet-config.ts
 */

import { PDFDocument, rgb, StandardFonts, PDFForm, PDFFont, numberToString, TextAlignment } from 'pdf-lib';
import { PAGE_1_FIELDS, PAGE_2_FIELDS, PDF_CONFIG } from './character-sheet-config';
import fontkit from '@pdf-lib/fontkit';
import type { CharacterSheetData } from './character-data-mapper';
import { formatSpells } from './character-data-mapper';
import type { FieldConfig, TextAreaConfig } from './character-sheet-config';
import type { Spell } from '$lib/data/spells';
import { formatFeatureForPDF, formatFeaturesForPDF } from '$lib/data/features/feature-data';
import { druid } from '$lib/data/classes/druid';

/**
 * Load the blank PDF template from static folder
 */

async function loadTemplate(templateNumber: number): Promise<PDFDocument> {	
	if (templateNumber < 0 || templateNumber > PDF_CONFIG.templatePaths.length - 1) {
		throw new Error(`PDF template number out of range`);
	}

	const response = await fetch(PDF_CONFIG.templatePaths[templateNumber]);
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
	fillFormField(form, 'acrobatics', data.skills['acrobatics'], 13, TextAlignment.Right);
	fillFormField(form, 'animal_handling', data.skills['animalHandling'], 13, TextAlignment.Right);
	fillFormField(form, 'arcana', data.skills['arcana'], 13, TextAlignment.Right);
	fillFormField(form, 'athletics', data.skills['athletics'], 13, TextAlignment.Right);
	fillFormField(form, 'deception', data.skills['deception'], 13, TextAlignment.Right);
	fillFormField(form, 'history', data.skills['history'], 13, TextAlignment.Right);
	fillFormField(form, 'insight', data.skills['insight'], 13, TextAlignment.Right);
	fillFormField(form, 'intimidation', data.skills['intimidation'], 13, TextAlignment.Right);
	fillFormField(form, 'investigation', data.skills['investigation'], 13, TextAlignment.Right);
	fillFormField(form, 'medicine', data.skills['medicine'], 13, TextAlignment.Right);
	fillFormField(form, 'nature', data.skills['nature'], 13, TextAlignment.Right);
	fillFormField(form, 'perception', data.skills['perception'], 13, TextAlignment.Right);
	fillFormField(form, 'performance', data.skills['performance'], 13, TextAlignment.Right);
	fillFormField(form, 'persuasion', data.skills['persuasion'], 13, TextAlignment.Right);
	fillFormField(form, 'religion', data.skills['religion'], 13, TextAlignment.Right);
	fillFormField(form, 'sleight_of_hand', data.skills['sleightOfHand'], 13, TextAlignment.Right);
	fillFormField(form, 'stealth', data.skills['stealth'], 13, TextAlignment.Right);
	fillFormField(form, 'survival', data.skills['survival'], 13, TextAlignment.Right);

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
	let attacks_to_hit_string: string = "";
	let attacks_damage_string: string = "";
	let attacks_notes_string: string = "";
	for (let i = 0; i < attacks_names.length; i++) {
		attacks_names_string += attacks_names[i] + '\n';
		attacks_to_hit_string += attacks_to_hit[i] + '\n';
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
			attacks_to_hit_string += '\n';
			attacks_damage_string += '\n';
			attacks_notes_string += '\n';
		}

		for (let i = 0; i < damageCantrips.length; i++) {
			// Cantrip name
			attacks_names_string += damageCantrips[i].name + '\n';

			// TODO: To Hit / DC 
			// First, figure out what class we are and what ability score we are looking for
			const castingAbilities = new Map([
				// barbarian is included just for completeness. If they have spells that use a casting modifier, they probably got it from a species. 
				//			 I set the default to be intelligence, since most species that give magic use that. The only significant exception is Drow, but this is a quick solution.
				["Barbarian", "intelligence"],
				["Bard", "charisma"],
				["Cleric", "wisdom"],
				["Druid", "wisdom"],
				// Eld Knight
				["Fighter", "intelligence"],
				// Ki-based disciplines
				["Monk", "wisdom"],
				["Paladin", "charisma"],
				["Ranger", "wisdom"],
				// Trickster
				["Rogue", "intelligence"],
				["Sorcerer", "charisma"],
				["Warlock", "charisma"],
				["Wizard", "intelligence"],
			]);

			let relevantCastingAbility = castingAbilities.get(data.classAndLevel.trim())
			let castingAbilityScore: string

			switch(relevantCastingAbility) {
				case 'intelligence':
					castingAbilityScore = data.abilityScores.intelligence.score;
					break;
				case 'wisdom':
					castingAbilityScore = data.abilityScores.wisdom.score;
					break;
				case 'charisma':
					castingAbilityScore = data.abilityScores.charisma.score;
					break;
				default:
					castingAbilityScore = data.abilityScores.intelligence.score;
					break;
				}

			// Once a score is fetched, find the modifier (doing it this way so we dont have to deal with the already signed mod value)
			let castingAbilityMod = Math.floor((Number(castingAbilityScore) - 10) / 2);
			
			// Compute Spell Save & Spell Attack
			let spellSaveDC = 10 + castingAbilityMod;
			let spellAttackBonus = 2 + castingAbilityMod;

			// After the math is complete, we can finally add a '+' if needed. 
			let spellAttackBonusSigned: string;
			if (spellAttackBonus > 0) {
				spellAttackBonusSigned = '+' + spellAttackBonus;
			} else {
				spellAttackBonusSigned = '' + spellAttackBonus;
			}

			let cantripTags = damageCantrips[i].tags
			// Spell Attack cantrips: format like 'd20 + 5'
			if (cantripTags && cantripTags.includes('SpellAttack')) {
				attacks_to_hit_string += 'd20 ' + spellAttackBonusSigned.substring(0,1) + ' ' + spellAttackBonusSigned.substring(1) + '\n';
			// Spell Save cantrips: format like 'DC 12'
			} else if (cantripTags && cantripTags.includes('SpellSave')) {
				attacks_to_hit_string += 'DC ' + spellSaveDC + '\n';
			// If something goes wrong, still increment our newline spacing
			} else {
				attacks_to_hit_string += '\n';
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
	fillFormField(form, 'attacks_to_hit', attacks_to_hit_string, 10.5);
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


async function fillFeaturesPage(
	page: any,
	data: CharacterSheetData,
	font: any,
	boldFont: any,
	italicFont: any
) {
	const form = page.getForm()

	const charactersPerRow = 64;
	const maxLinesPerColumn = 65;

	let featureContent = formatFeaturesForPDF(data.features, data.characterReference, 'all');

	let columnOneContent = '';
	let columnTwoContent = '';

	let lineCount = 0;
	// Track to see when column one is used up. This helps avoid parsing each feature chunk after, since they must go in column two.
	let outOfSpace = false;

	// Iterate through feature chunks (entire features separated by a blank line)
	let featureChunks = featureContent.split('\n\n');
	for (let i = 0; i < featureChunks.length; i++) {
		// If we have already filled column one, we can just assume everything else goes in column two.
		if (outOfSpace) {
			columnTwoContent += featureChunks[i] + '\n\n';
			continue;
		}
		
		// Otherwise, lets track how many lines of text this next feature will use up in column one.
		let featureLineUsage = 0;

		// Iterate through each text run within this feature.
		// a text run is any length of text that ends in a newline.
		// if there are no newlines (or considering the final run before the next feature), .split still captures this as the only (or final) element
		let textRuns = featureChunks[i].split('\n');
		for (let j = 0; j < textRuns.length; j++) {
			// Consider if this run of text takes up more than just the one line we know the newline eats
			// we subtract one from the length because the ending \n symbol counts against us.
			featureLineUsage += Math.floor((textRuns[j].length - 1) / charactersPerRow) + 1;
		}

		// If there is room enough, add this feature chunk to the column. (+1 to account for the blank space we want to add after)
		if (lineCount + featureLineUsage + 1 <= maxLinesPerColumn) {
			lineCount += featureLineUsage + 1;
			columnOneContent += featureChunks[i] + '\n\n';
		} 
		// Otherwise, column one is filled and we need to move this feature to column two.
		else {
			outOfSpace = true;
			columnTwoContent += featureChunks[i] + '\n\n';
		}
	}

	fillFormField(form, 'page_title', 'Features', 12, TextAlignment.Center);
	fillFormField(form, 'column_one', columnOneContent);
	fillFormField(form, 'column_two', columnTwoContent);

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

	console.log(data.equipment);
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
		fillFormField(form, 'page_title_top', 'Equipment', 12, TextAlignment.Center);
		fillFormField(form, 'column_one_top', data.equipment, 12);
		fillFormField(form, 'column_two_top', '', 12);
	}

	// Character Notes is left blank for the player to fill in after printing
	fillFormField(form, 'page_title_bottom', 'Character Notes', 12, TextAlignment.Center);
	fillFormField(form, 'column_one_bottom', '');
	fillFormField(form, 'column_two_bottom', '');

	form.flatten()
}


async function fillSpellsPage(
	page: any,
	data: CharacterSheetData,
	font: any,
	boldFont: any,
	italicFont: any
) {
	const form = page.getForm()

	const charactersPerRow = 64;
	let maxLinesPerColumn = 65;
	// For spells, we want to leave room for Spell Save, Spell Attack, and Spell Slots. So, both columns should have a couple leading lines of whitespace
	const whitespaceLines = 4;
	maxLinesPerColumn -= whitespaceLines;

	let spellsContent = formatSpells(data.characterReference);

	let columnOneContent = '\n'.repeat(whitespaceLines);
	let columnTwoContent = '\n'.repeat(whitespaceLines);

	let lineCount = 0;
	// Track to see when column one is used up. This helps avoid parsing each spell chunk after, since they must go in column two.
	let outOfSpace = false;

	// Iterate through feature chunks (entire spells separated by a blank line)
	let spellChunks = spellsContent.split('\n\n');
	for (let i = 0; i < spellChunks.length; i++) {
		// If we have already filled column one, we can just assume everything else goes in column two.
		if (outOfSpace) {
			columnTwoContent += spellChunks[i] + '\n\n';
			continue;
		}
		
		// Otherwise, lets track how many lines of text this next spell will use up in column one.
		let spellLineUsage = 0;

		// Iterate through each text run within this feature.
		// a text run is any length of text that ends in a newline.
		// if there are no newlines (or considering the final run before the next feature), .split still captures this as the only (or final) element
		let textRuns = spellChunks[i].split('\n');
		for (let j = 0; j < textRuns.length; j++) {
			// Consider if this run of text takes up more than just the one line we know the newline eats
			// we subtract one from the length because the ending \n symbol counts against us.
			spellLineUsage += Math.floor((textRuns[j].length - 1) / charactersPerRow) + 1;
		}

		// If there is room enough, add this spell chunk to the column. (+1 to account for the blank space we want to add after)
		if (lineCount + spellLineUsage + 1 <= maxLinesPerColumn) {
			lineCount += spellLineUsage + 1;
			columnOneContent += spellChunks[i] + '\n\n';
		} 
		// Otherwise, column one is filled and we need to move this spell to column two.
		else {
			outOfSpace = true;
			columnTwoContent += spellChunks[i] + '\n\n';
		}
	}

	fillFormField(form, 'page_title', 'Spells', 12, TextAlignment.Center);
	fillFormField(form, 'column_one', columnOneContent);
	fillFormField(form, 'column_two', columnTwoContent);

	form.flatten()
}


/**
 * Generate filled PDF from character data
 * Returns a data URL that can be used in iframe/embed or downloaded
 */
export async function generateCharacterSheet(data: CharacterSheetData): Promise<string> {
	try {
		// Load templates
		const frontPageDoc = await loadTemplate(0);
		const featuresPageDoc = await loadTemplate(1);
		const equipmentPageDoc = await loadTemplate(2);
		const spellsPageDoc = await loadTemplate(1);

		const fontOneBuffer = await loadFontBuffer(0);
		//const fontTwoBuffer = await loadFontBuffer(1);

		frontPageDoc.registerFontkit(fontkit);
		let frontPageFonts: PDFFont[] = [
			await frontPageDoc.embedFont(StandardFonts.Helvetica),
			await frontPageDoc.embedFont(StandardFonts.HelveticaBold),
			await frontPageDoc.embedFont(StandardFonts.HelveticaOblique),
			await frontPageDoc.embedFont(fontOneBuffer),
			// Consider adding other custom font (#2 and onwards)
		]

		featuresPageDoc.registerFontkit(fontkit);
		let featuresPageFonts: PDFFont[] = [
			await featuresPageDoc.embedFont(StandardFonts.Helvetica),
			await featuresPageDoc.embedFont(StandardFonts.HelveticaBold),
			await featuresPageDoc.embedFont(StandardFonts.HelveticaOblique),
			await featuresPageDoc.embedFont(fontOneBuffer),
			// Consider adding other custom font (#2 and onwards)
		]

		equipmentPageDoc.registerFontkit(fontkit);
		let equipmentPageFonts: PDFFont[] = [
			await equipmentPageDoc.embedFont(StandardFonts.Helvetica),
			await equipmentPageDoc.embedFont(StandardFonts.HelveticaBold),
			await equipmentPageDoc.embedFont(StandardFonts.HelveticaOblique),
			await equipmentPageDoc.embedFont(fontOneBuffer),
			// Consider adding other custom font (#2 and onwards)
		]

		spellsPageDoc.registerFontkit(fontkit);
		let spellsPageFonts: PDFFont[] = [
			await spellsPageDoc.embedFont(StandardFonts.Helvetica),
			await spellsPageDoc.embedFont(StandardFonts.HelveticaBold),
			await spellsPageDoc.embedFont(StandardFonts.HelveticaOblique),
			await spellsPageDoc.embedFont(fontOneBuffer),
			// Consider adding other custom font (#2 and onwards)
		]
			
		// Check that we have the expected template docs
		if (!frontPageDoc || !featuresPageDoc || !equipmentPageDoc || !spellsPageDoc) {
			throw new Error('Missing PDF Template');
		}
		
		const frontPage = frontPageDoc.getPages()[0];
		const featuresPage = featuresPageDoc.getPages()[0];
		const equipmentPage = equipmentPageDoc.getPages()[0];
		const spellsPage = spellsPageDoc.getPages()[0];
		
		// Fill pages with data
		await fillFrontPage(frontPageDoc, data, frontPageFonts[3], frontPageFonts[1], frontPageFonts[2]);
		await fillFeaturesPage(featuresPageDoc, data, featuresPageFonts[3], featuresPageFonts[1], featuresPageFonts[2]);
		await fillEquipmentPage(equipmentPageDoc, data, featuresPageFonts[3], featuresPageFonts[1], featuresPageFonts[2]);
		await fillSpellsPage(spellsPageDoc, data, spellsPageFonts[3], spellsPageFonts[1], spellsPageFonts[2]);
		
		let freshPdfDoc = await PDFDocument.create()

		const [frontPageCopy] = await freshPdfDoc.copyPages(frontPageDoc, [0])
		const [featuresPageCopy] = await freshPdfDoc.copyPages(featuresPageDoc, [0])
		const [equipmentPageCopy] = await freshPdfDoc.copyPages(equipmentPageDoc, [0])
		const [spellsPageCopy] = await freshPdfDoc.copyPages(spellsPageDoc, [0])

		freshPdfDoc.addPage(frontPageCopy)
		freshPdfDoc.addPage(featuresPageCopy)
		freshPdfDoc.addPage(equipmentPageCopy)
		freshPdfDoc.addPage(spellsPageCopy)

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
