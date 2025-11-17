/**
 * PDF Generator Service
 * 
 * This service loads the blank PDF template and fills it with character data
 * at the positions defined in character-sheet-config.ts
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PAGE_1_FIELDS, PAGE_2_FIELDS, PDF_CONFIG } from './character-sheet-config';
import type { CharacterSheetData } from './character-data-mapper';
import type { FieldConfig, TextAreaConfig } from './character-sheet-config';

/**
 * Load the blank PDF template from static folder
 */
async function loadTemplate(): Promise<PDFDocument> {
	const response = await fetch(PDF_CONFIG.templatePath);
	if (!response.ok) {
		throw new Error(`Failed to load PDF template: ${response.statusText}`);
	}
	const arrayBuffer = await response.arrayBuffer();
	return await PDFDocument.load(arrayBuffer);
}

/**
 * Draw text at specified position on a PDF page
 */
function drawText(
	page: any,
	text: string,
	config: FieldConfig,
	font: any
) {
	const fontSize = config.fontSize || PDF_CONFIG.defaultFontSize;
	const color = rgb(
		PDF_CONFIG.defaultColor.r,
		PDF_CONFIG.defaultColor.g,
		PDF_CONFIG.defaultColor.b
	);
	
	// Handle alignment
	let x = config.x;
	if (config.align === 'center' && config.maxWidth) {
		const textWidth = font.widthOfTextAtSize(text, fontSize);
		x = config.x - textWidth / 2;
	} else if (config.align === 'right' && config.maxWidth) {
		const textWidth = font.widthOfTextAtSize(text, fontSize);
		x = config.x - textWidth;
	}
	
	page.drawText(text, {
		x,
		y: config.y,
		size: fontSize,
		font,
		color,
		maxWidth: config.maxWidth
	});
}

/**
 * Draw multi-line text in a text area
 */
function drawTextArea(
	page: any,
	text: string,
	config: TextAreaConfig,
	font: any
) {
	const fontSize = config.fontSize || PDF_CONFIG.defaultFontSize;
	const lineHeight = config.lineHeight || fontSize * 1.2;
	const color = rgb(
		PDF_CONFIG.defaultColor.r,
		PDF_CONFIG.defaultColor.g,
		PDF_CONFIG.defaultColor.b
	);
	
	// Split text into lines
	const lines = text.split('\n');
	let currentY = config.y + config.height - lineHeight;
	
	for (const line of lines) {
		if (currentY < config.y) break; // Stop if we run out of space
		
		// Word wrap if line is too long
		const words = line.split(' ');
		let currentLine = '';
		
		for (const word of words) {
			const testLine = currentLine ? `${currentLine} ${word}` : word;
			const testWidth = font.widthOfTextAtSize(testLine, fontSize);
			
			if (testWidth > config.width && currentLine) {
				// Draw current line and start new one
				page.drawText(currentLine, {
					x: config.x,
					y: currentY,
					size: fontSize,
					font,
					color
				});
				currentLine = word;
				currentY -= lineHeight;
				
				if (currentY < config.y) break;
			} else {
				currentLine = testLine;
			}
		}
		
		// Draw remaining text
		if (currentLine && currentY >= config.y) {
			page.drawText(currentLine, {
				x: config.x,
				y: currentY,
				size: fontSize,
				font,
				color
			});
			currentY -= lineHeight;
		}
	}
}

/**
 * Fill Page 1 with character data
 */
async function fillPage1(
	page: any,
	data: CharacterSheetData,
	font: any
) {
	// Header
	drawText(page, data.characterName, PAGE_1_FIELDS.characterName, font);
	drawText(page, data.classAndLevel, PAGE_1_FIELDS.classAndLevel, font);
	drawText(page, data.background, PAGE_1_FIELDS.background, font);
	drawText(page, data.species, PAGE_1_FIELDS.species, font);
	drawText(page, data.alignment, PAGE_1_FIELDS.alignment, font);
	drawText(page, data.experiencePoints, PAGE_1_FIELDS.experiencePoints, font);
	drawText(page, data.proficiencyBonus, PAGE_1_FIELDS.proficiencyBonus, font);
	
	// Ability Scores
	const abilities = PAGE_1_FIELDS.abilityScores;
	drawText(page, data.abilityScores.strength.score, abilities.strength.score, font);
	drawText(page, data.abilityScores.strength.modifier, abilities.strength.modifier, font);
	drawText(page, data.abilityScores.dexterity.score, abilities.dexterity.score, font);
	drawText(page, data.abilityScores.dexterity.modifier, abilities.dexterity.modifier, font);
	drawText(page, data.abilityScores.constitution.score, abilities.constitution.score, font);
	drawText(page, data.abilityScores.constitution.modifier, abilities.constitution.modifier, font);
	drawText(page, data.abilityScores.intelligence.score, abilities.intelligence.score, font);
	drawText(page, data.abilityScores.intelligence.modifier, abilities.intelligence.modifier, font);
	drawText(page, data.abilityScores.wisdom.score, abilities.wisdom.score, font);
	drawText(page, data.abilityScores.wisdom.modifier, abilities.wisdom.modifier, font);
	drawText(page, data.abilityScores.charisma.score, abilities.charisma.score, font);
	drawText(page, data.abilityScores.charisma.modifier, abilities.charisma.modifier, font);
	
	// Saving Throws
	const saves = PAGE_1_FIELDS.savingThrows;
	drawText(page, data.savingThrows.strength, saves.strength, font);
	drawText(page, data.savingThrows.dexterity, saves.dexterity, font);
	drawText(page, data.savingThrows.constitution, saves.constitution, font);
	drawText(page, data.savingThrows.intelligence, saves.intelligence, font);
	drawText(page, data.savingThrows.wisdom, saves.wisdom, font);
	drawText(page, data.savingThrows.charisma, saves.charisma, font);
	
	// Skills
	const skillsConfig = PAGE_1_FIELDS.skills;
	Object.keys(skillsConfig).forEach(skillKey => {
		const skillValue = data.skills[skillKey];
		if (skillValue) {
			drawText(page, skillValue, skillsConfig[skillKey], font);
		}
	});
	
	drawText(page, data.passivePerception, PAGE_1_FIELDS.passivePerception, font);
	
	// Combat Stats
	drawText(page, data.armorClass, PAGE_1_FIELDS.armorClass, font);
	drawText(page, data.initiative, PAGE_1_FIELDS.initiative, font);
	drawText(page, data.speed, PAGE_1_FIELDS.speed, font);
	drawText(page, data.hitPointMaximum, PAGE_1_FIELDS.hitPointMaximum, font);
	drawText(page, data.currentHitPoints, PAGE_1_FIELDS.currentHitPoints, font);
	drawText(page, data.temporaryHitPoints, PAGE_1_FIELDS.temporaryHitPoints, font);
	drawText(page, data.hitDice, PAGE_1_FIELDS.hitDice, font);
	
	// Attacks
	data.attacks.forEach((attack, index) => {
		if (index < PAGE_1_FIELDS.attacks.length) {
			const attackConfig = PAGE_1_FIELDS.attacks[index];
			drawText(page, attack.name, attackConfig.name, font);
			drawText(page, attack.bonus, attackConfig.bonus, font);
			drawText(page, attack.damage, attackConfig.damage, font);
		}
	});
	
	// Equipment & Features
	drawTextArea(page, data.equipment, PAGE_1_FIELDS.equipment, font);
	drawTextArea(page, data.proficienciesAndLanguages, PAGE_1_FIELDS.proficienciesAndLanguages, font);
	drawTextArea(page, data.featuresAndTraits, PAGE_1_FIELDS.featuresAndTraits, font);
}

/**
 * Fill Page 2 with character data
 */
async function fillPage2(
	page: any,
	data: CharacterSheetData,
	font: any
) {
	// Character Name
	drawText(page, data.characterName, PAGE_2_FIELDS.characterName, font);
	
	// Character Description
	if (data.age) drawText(page, data.age, PAGE_2_FIELDS.age, font);
	if (data.height) drawText(page, data.height, PAGE_2_FIELDS.height, font);
	if (data.weight) drawText(page, data.weight, PAGE_2_FIELDS.weight, font);
	if (data.eyes) drawText(page, data.eyes, PAGE_2_FIELDS.eyes, font);
	if (data.skin) drawText(page, data.skin, PAGE_2_FIELDS.skin, font);
	if (data.hair) drawText(page, data.hair, PAGE_2_FIELDS.hair, font);
	
	// Backstory
	if (data.personalityTraits) {
		drawTextArea(page, data.personalityTraits, PAGE_2_FIELDS.personalityTraits, font);
	}
	if (data.ideals) {
		drawTextArea(page, data.ideals, PAGE_2_FIELDS.ideals, font);
	}
	if (data.bonds) {
		drawTextArea(page, data.bonds, PAGE_2_FIELDS.bonds, font);
	}
	if (data.flaws) {
		drawTextArea(page, data.flaws, PAGE_2_FIELDS.flaws, font);
	}
	
	// Additional Content
	if (data.additionalFeatures) {
		drawTextArea(page, data.additionalFeatures, PAGE_2_FIELDS.additionalFeatures, font);
	}
	if (data.treasureAndNotes) {
		drawTextArea(page, data.treasureAndNotes, PAGE_2_FIELDS.treasureAndNotes, font);
	}
}

/**
 * Generate filled PDF from character data
 * Returns a data URL that can be used in iframe/embed or downloaded
 */
export async function generateCharacterSheet(data: CharacterSheetData): Promise<string> {
	try {
		// Load template
		const pdfDoc = await loadTemplate();
		
		// Get pages
		const pages = pdfDoc.getPages();
		if (pages.length < 2) {
			throw new Error('PDF template must have at least 2 pages');
		}
		
		const page1 = pages[0];
		const page2 = pages[1];
		
		// Embed font
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
		
		// Fill pages with data
		await fillPage1(page1, data, font);
		await fillPage2(page2, data, font);
		
		// Save and return as data URL
		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: 'application/pdf' });
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
