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
 * Draw skill text with ability abbreviation in gray
 * Example: "+5 Acrobatics" in black, then "(DEX)" in gray
 */
function drawSkillWithAbility(
	page: any,
	skillText: string,
	abilityAbbr: string,
	config: FieldConfig,
	font: any
) {
	const fontSize = config.fontSize || PDF_CONFIG.defaultFontSize;
	const blackColor = rgb(
		PDF_CONFIG.defaultColor.r,
		PDF_CONFIG.defaultColor.g,
		PDF_CONFIG.defaultColor.b
	);
	const grayColor = rgb(0.5, 0.5, 0.5); // Medium gray
	
	// Draw main skill text in black
	page.drawText(skillText, {
		x: config.x,
		y: config.y,
		size: fontSize,
		font,
		color: blackColor
	});
	
	// Calculate position for ability abbreviation
	const skillWidth = font.widthOfTextAtSize(skillText, fontSize);
	const spaceWidth = font.widthOfTextAtSize(' ', fontSize);
	
	// Draw ability abbreviation in gray, slightly smaller
	const abilityFontSize = fontSize * 0.85; // 85% of normal size
	page.drawText(`(${abilityAbbr})`, {
		x: config.x + skillWidth + spaceWidth,
		y: config.y,
		size: abilityFontSize,
		font,
		color: grayColor
	});
}

/**
 * Parse text with bold and italic markers and return segments with font info
 * <<BOLD:text>> becomes [{text: 'text', bold: true, italic: false}]
 * <<ITALIC:text>> becomes [{text: 'text', bold: false, italic: true}]
 */
function parseTextWithStyle(text: string): Array<{text: string; bold: boolean; italic: boolean}> {
	const segments: Array<{text: string; bold: boolean; italic: boolean}> = [];
	const regex = /<<(BOLD|ITALIC):([^>]+)>>/g;
	let lastIndex = 0;
	let match;
	
	while ((match = regex.exec(text)) !== null) {
		// Add text before the marker
		if (match.index > lastIndex) {
			segments.push({
				text: text.substring(lastIndex, match.index),
				bold: false,
				italic: false
			});
		}
		// Add the styled text
		const styleType = match[1];
		const styleText = match[2];
		segments.push({
			text: styleText,
			bold: styleType === 'BOLD',
			italic: styleType === 'ITALIC'
		});
		lastIndex = regex.lastIndex;
	}
	
	// Add remaining text
	if (lastIndex < text.length) {
		segments.push({
			text: text.substring(lastIndex),
			bold: false,
			italic: false
		});
	}
	
	return segments;
}

/**
 * Draw multi-line text in a text area with support for bold and italic text
 */
function drawTextArea(
	page: any,
	text: string,
	config: TextAreaConfig,
	font: any,
	boldFont: any,
	italicFont: any
) {
	const fontSize = config.fontSize || PDF_CONFIG.defaultFontSize;
	const lineHeight = config.lineHeight || fontSize * 1.2;
	const color = rgb(
		PDF_CONFIG.defaultColor.r,
		PDF_CONFIG.defaultColor.g,
		PDF_CONFIG.defaultColor.b
	);
	
	// Convert <br> tags to newlines and split text into lines
	const processedText = text.replace(/<br>/gi, '\n');
	const lines = processedText.split('\n');
	let currentY = config.y + config.height - lineHeight;
	
	for (const line of lines) {
		if (currentY < config.y) break; // Stop if we run out of space
		
		// Parse line for style markers
		const segments = parseTextWithStyle(line);
		
		// Process each segment and wrap words
		let currentX = config.x;
		
		for (const segment of segments) {
			// Choose the appropriate font
			let segmentFont = font;
			if (segment.bold) {
				segmentFont = boldFont;
			} else if (segment.italic) {
				segmentFont = italicFont;
			}
			
			const words = segment.text.split(' ');
			
			for (let i = 0; i < words.length; i++) {
				const word = words[i];
				const wordWidth = segmentFont.widthOfTextAtSize(word, fontSize);
				const spaceWidth = segmentFont.widthOfTextAtSize(' ', fontSize);
				
				// Check if word fits on current line
				if (currentX + wordWidth > config.x + config.width && currentX > config.x) {
					// Move to next line
					currentY -= lineHeight;
					currentX = config.x;
					if (currentY < config.y) return; // Out of space
				}
				
				// Draw the word
				page.drawText(word, {
					x: currentX,
					y: currentY,
					size: fontSize,
					font: segmentFont,
					color
				});
				
				// Move x position for next word
				currentX += wordWidth;
				if (i < words.length - 1) {
					currentX += spaceWidth; // Add space between words
				}
			}
		}
		
		// Move to next line after processing all segments
		currentY -= lineHeight;
	}
}

/**
 * Fill Page 1 with character data
 */
async function fillPage1(
	page: any,
	data: CharacterSheetData,
	font: any,
	boldFont: any,
	italicFont: any
) {
	// Header
	drawText(page, data.characterName, PAGE_1_FIELDS.characterName, font);
	drawText(page, data.classAndLevel, PAGE_1_FIELDS.classAndLevel, font);
	drawText(page, data.background, PAGE_1_FIELDS.background, font);
	drawText(page, data.species, PAGE_1_FIELDS.species, font);
	drawText(page, data.alignment, PAGE_1_FIELDS.alignment, font);
	// Removed: experiencePoints and proficiencyBonus
	// drawText(page, data.experiencePoints, PAGE_1_FIELDS.experiencePoints, font);
	// drawText(page, data.proficiencyBonus, PAGE_1_FIELDS.proficiencyBonus, font);
	
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
	
	// Skills with ability abbreviations
	const skillsConfig = PAGE_1_FIELDS.skills;
	const skillAbilities: Record<string, string> = {
		acrobatics: 'DEX',
		animalHandling: 'WIS',
		arcana: 'INT',
		athletics: 'STR',
		deception: 'CHA',
		history: 'INT',
		insight: 'WIS',
		intimidation: 'CHA',
		investigation: 'INT',
		medicine: 'WIS',
		nature: 'INT',
		perception: 'WIS',
		performance: 'CHA',
		persuasion: 'CHA',
		religion: 'INT',
		sleightOfHand: 'DEX',
		stealth: 'DEX',
		survival: 'WIS'
	};

	(Object.keys(skillsConfig) as Array<keyof typeof skillsConfig>).forEach(key => {
		const skillValue = data.skills[key];
		if (skillValue) {
			drawSkillWithAbility(page, skillValue, skillAbilities[key], skillsConfig[key], font);
		}
	});
	
	// Removed: passivePerception
	// drawText(page, data.passivePerception, PAGE_1_FIELDS.passivePerception, font);
	
	// Combat Stats
	drawText(page, data.armorClass, PAGE_1_FIELDS.armorClass, font);
	drawText(page, data.initiative, PAGE_1_FIELDS.initiative, font);
	drawText(page, data.speed, PAGE_1_FIELDS.speed, font);
	drawText(page, data.hitPointMaximum, PAGE_1_FIELDS.hitPointMaximum, font);
	drawText(page, data.currentHitPoints, PAGE_1_FIELDS.currentHitPoints, font);
	drawText(page, data.temporaryHitPoints, PAGE_1_FIELDS.temporaryHitPoints, font);
	// Removed: hitDice
	// drawText(page, data.hitDice, PAGE_1_FIELDS.hitDice, font);
	
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
	drawTextArea(page, data.equipment, PAGE_1_FIELDS.equipment, font, boldFont, italicFont);
	drawTextArea(page, data.proficienciesAndLanguages, PAGE_1_FIELDS.proficienciesAndLanguages, font, boldFont, italicFont);
	drawTextArea(page, data.featuresAndTraits, PAGE_1_FIELDS.featuresAndTraits, font, boldFont, italicFont);
}

/**
 * Fill Page 2 with character data
 */
async function fillPage2(
	page: any,
	data: CharacterSheetData,
	font: any,
	boldFont: any,
	italicFont: any
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
		drawTextArea(page, data.personalityTraits, PAGE_2_FIELDS.personalityTraits, font, boldFont, italicFont);
	}
	if (data.ideals) {
		drawTextArea(page, data.ideals, PAGE_2_FIELDS.ideals, font, boldFont, italicFont);
	}
	if (data.bonds) {
		drawTextArea(page, data.bonds, PAGE_2_FIELDS.bonds, font, boldFont, italicFont);
	}
	if (data.flaws) {
		drawTextArea(page, data.flaws, PAGE_2_FIELDS.flaws, font, boldFont, italicFont);
	}
	
	// Additional Content
	if (data.additionalFeatures) {
		drawTextArea(page, data.additionalFeatures, PAGE_2_FIELDS.additionalFeatures, font, boldFont, italicFont);
	}
	if (data.treasureAndNotes) {
		drawTextArea(page, data.treasureAndNotes, PAGE_2_FIELDS.treasureAndNotes, font, boldFont, italicFont);
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
		
		// Embed fonts
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
		const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
		
		// Fill pages with data
		await fillPage1(page1, data, font, boldFont, italicFont);
		await fillPage2(page2, data, font, boldFont, italicFont);
		
		const pdfBytes = await pdfDoc.save();
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
