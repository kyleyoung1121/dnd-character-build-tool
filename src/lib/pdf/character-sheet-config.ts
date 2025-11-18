/**
 * Character Sheet PDF Field Configuration
 * 
 * This file defines the positions and styling for all fields on the D&D character sheet PDF.
 * Coordinates are measured from the bottom-left corner of the page in points (1 point = 1/72 inch).
 * Standard US Letter size: 612 points wide × 792 points tall (8.5" × 11")
 * 
 * Tips for adjusting positions:
 * - Increase X to move right, decrease to move left
 * - Increase Y to move up, decrease to move down
 * - Font sizes are in points (typical range: 8-14)
 * - Use a PDF viewer with coordinate display to fine-tune positions
 */

export interface FieldConfig {
	x: number;        // X coordinate from left edge
	y: number;        // Y coordinate from bottom edge
	fontSize?: number; // Font size in points (default: 10)
	maxWidth?: number; // Maximum width before wrapping
	align?: 'left' | 'center' | 'right'; // Text alignment
}

export interface TextAreaConfig extends FieldConfig {
	width: number;    // Width of text area
	height: number;   // Height of text area
	lineHeight?: number; // Space between lines (default: fontSize * 1.2)
}

/**
 * PAGE 1: Character Information and Stats
 */
export const PAGE_1_FIELDS = {
	// Header Section
	characterName: {
		x: 465,
		y: 730,
		fontSize: 14,
		maxWidth: 400
	} as FieldConfig,
	
	classAndLevel: {
		x: 215,
		y: 730,
		fontSize: 10,
		maxWidth: 150
	} as FieldConfig,
	
	background: {
		x: 340,
		y: 730,
		fontSize: 10,
		maxWidth: 150
	} as FieldConfig,
	
	species: {
		x: 215,
		y: 700,
		fontSize: 10,
		maxWidth: 150
	} as FieldConfig,
	
	alignment: {
		x: 340,
		y: 700,
		fontSize: 10,
		maxWidth: 150
	} as FieldConfig,
	

	
	// Ability Scores (left column)
	abilityScores: {
		strength: {
			score: { x: 40, y: 539, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 32, y: 555, fontSize: 25, align: 'center' } as FieldConfig
		},
		dexterity: {
			score: { x: 40, y: 467, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 32, y: 485, fontSize: 25, align: 'center' } as FieldConfig
		},
		constitution: {
			score: { x: 40, y: 395, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 32, y: 413, fontSize: 25, align: 'center' } as FieldConfig
		},
		intelligence: {
			score: { x: 40, y: 323, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 32, y: 341, fontSize: 25, align: 'center' } as FieldConfig
		},
		wisdom: {
			score: { x: 40, y: 251, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 32, y: 269, fontSize: 25, align: 'center' } as FieldConfig
		},
		charisma: {
			score: { x: 40, y: 179, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 32, y: 197, fontSize: 25, align: 'center' } as FieldConfig
		}
	},
	
	// Saving Throws (left column, below abilities)
	// Note: User requested "left 3/16ths" but that would be off-page from x:70
	// Keeping at reasonable position - may need adjustment after testing
	savingThrows: {
		strength: { x: 100, y: 570, fontSize: 9 } as FieldConfig,
		dexterity: { x: 100, y: 555, fontSize: 9 } as FieldConfig,
		constitution: { x: 100, y: 540, fontSize: 9 } as FieldConfig,
		intelligence: { x: 100, y: 525, fontSize: 9 } as FieldConfig,
		wisdom: { x: 100, y: 510, fontSize: 9 } as FieldConfig,
		charisma: { x: 100, y: 495, fontSize: 9 } as FieldConfig
	},
	
	// Skills (left column)
	skills: {
		acrobatics: { x: 100, y: 450, fontSize: 9 } as FieldConfig,
		animalHandling: { x: 100, y: 435, fontSize: 9 } as FieldConfig,
		arcana: { x: 100, y: 420, fontSize: 9 } as FieldConfig,
		athletics: { x: 100, y: 405, fontSize: 9 } as FieldConfig,
		deception: { x: 100, y: 390, fontSize: 9 } as FieldConfig,
		history: { x: 100, y: 375, fontSize: 9 } as FieldConfig,
		insight: { x: 100, y: 360, fontSize: 9 } as FieldConfig,
		intimidation: { x: 100, y: 345, fontSize: 9 } as FieldConfig,
		investigation: { x: 100, y: 330, fontSize: 9 } as FieldConfig,
		medicine: { x: 100, y: 315, fontSize: 9 } as FieldConfig,
		nature: { x: 100, y: 300, fontSize: 9 } as FieldConfig,
		perception: { x: 100, y: 285, fontSize: 9 } as FieldConfig,
		performance: { x: 100, y: 270, fontSize: 9 } as FieldConfig,
		persuasion: { x: 100, y: 255, fontSize: 9 } as FieldConfig,
		religion: { x: 100, y: 240, fontSize: 9 } as FieldConfig,
		sleightOfHand: { x: 100, y: 225, fontSize: 9 } as FieldConfig,
		stealth: { x: 100, y: 210, fontSize: 9 } as FieldConfig,
		survival: { x: 100, y: 195, fontSize: 9 } as FieldConfig
	},
	
	
	// Combat Stats (middle column)
	armorClass: {
		x: 227,
		y: 635,
		fontSize: 18,
		align: 'center'
	} as FieldConfig,
	
	initiative: {
		x: 290,
		y: 635,
		fontSize: 18,
		align: 'center'
	} as FieldConfig,
	
	speed: {
		x: 350,
		y: 635,
		fontSize: 18,
		align: 'center'
	} as FieldConfig,
	
	hitPointMaximum: {
		x: 245,
		y: 570,
		fontSize: 12,
		align: 'center'
	} as FieldConfig,
	
	currentHitPoints: {
		x: 335,
		y: 530,
		fontSize: 18,
		align: 'center'
	} as FieldConfig,
	
	temporaryHitPoints: {
		x: 245,
		y: 520,
		fontSize: 12,
		align: 'center'
	} as FieldConfig,
	
	
	// Attacks (middle column)
	attacks: [
		{ name: { x: 215, y: 445, fontSize: 9 }, bonus: { x: 275, y: 445, fontSize: 9 }, damage: { x: 300, y: 445, fontSize: 9 } },
		{ name: { x: 215, y: 430, fontSize: 9 }, bonus: { x: 275, y: 430, fontSize: 9 }, damage: { x: 300, y: 430, fontSize: 9 } },
		{ name: { x: 215, y: 415, fontSize: 9 }, bonus: { x: 275, y: 415, fontSize: 9 }, damage: { x: 300, y: 415, fontSize: 9 } },
		{ name: { x: 215, y: 400, fontSize: 9 }, bonus: { x: 275, y: 400, fontSize: 9 }, damage: { x: 300, y: 400, fontSize: 9 } },
		{ name: { x: 215, y: 385, fontSize: 9 }, bonus: { x: 275, y: 385, fontSize: 9 }, damage: { x: 300, y: 385, fontSize: 9 } },
		{ name: { x: 215, y: 370, fontSize: 9 }, bonus: { x: 275, y: 370, fontSize: 9 }, damage: { x: 300, y: 370, fontSize: 9 } },
		{ name: { x: 215, y: 355, fontSize: 9 }, bonus: { x: 275, y: 355, fontSize: 9 }, damage: { x: 300, y: 355, fontSize: 9 } },
	
	],
	
	// Equipment (middle column)
	equipment: {
		x: 215,
		y: 15,
		width: 180,
		height: 200,
		fontSize: 9,
		lineHeight: 12
	} as TextAreaConfig,
	
	// Proficiencies & Languages (right column)
	proficienciesAndLanguages: {
		x: 30,
		y: -10,
		width: 200,
		height: 150,
		fontSize: 8,
		lineHeight: 10
	} as TextAreaConfig,
	
	// Features & Traits (right column)
	featuresAndTraits: {
		x: 420,
		y: 270,
		width: 145,
		height: 380,
		fontSize: 8,
		lineHeight: 10
	} as TextAreaConfig
};

/**
 * PAGE 2: Character Details, Additional Features, and Notes
 */
export const PAGE_2_FIELDS = {
	characterName: {
		x: 100,
		y: 720,
		fontSize: 14,
		maxWidth: 400
	} as FieldConfig,
	
	// Character Description
	age: { x: 100, y: 680, fontSize: 9 } as FieldConfig,
	height: { x: 180, y: 680, fontSize: 9 } as FieldConfig,
	weight: { x: 260, y: 680, fontSize: 9 } as FieldConfig,
	eyes: { x: 340, y: 680, fontSize: 9 } as FieldConfig,
	skin: { x: 420, y: 680, fontSize: 9 } as FieldConfig,
	hair: { x: 500, y: 680, fontSize: 9 } as FieldConfig,
	
	// Character Portrait Area (placeholder - won't fill with text)
	portraitArea: {
		x: 100,
		y: 500,
		width: 200,
		height: 160
	},
	
	// Backstory Elements
	personalityTraits: {
		x: 320,
		y: 620,
		width: 260,
		height: 60,
		fontSize: 8,
		lineHeight: 10
	} as TextAreaConfig,
	
	ideals: {
		x: 320,
		y: 550,
		width: 260,
		height: 60,
		fontSize: 8,
		lineHeight: 10
	} as TextAreaConfig,
	
	bonds: {
		x: 320,
		y: 480,
		width: 260,
		height: 60,
		fontSize: 8,
		lineHeight: 10
	} as TextAreaConfig,
	
	flaws: {
		x: 320,
		y: 410,
		width: 260,
		height: 60,
		fontSize: 8,
		lineHeight: 10
	} as TextAreaConfig,
	
	// Additional Features & Traits (continued from page 1)
	additionalFeatures: {
		x: 100,
		y: 200,
		width: 480,
		height: 180,
		fontSize: 8,
		lineHeight: 10
	} as TextAreaConfig,
	
	// Treasure & Notes
	treasureAndNotes: {
		x: 100,
		y: 50,
		width: 480,
		height: 140,
		fontSize: 8,
		lineHeight: 10
	} as TextAreaConfig
};

/**
 * PDF Configuration
 */
export const PDF_CONFIG = {
	templatePath: '/pdf-templates/dnd-character-sheet-blank.pdf',
	pageWidth: 612,  // US Letter width in points
	pageHeight: 792, // US Letter height in points
	defaultFontSize: 10,
	defaultFont: 'Helvetica',
	defaultColor: { r: 0, g: 0, b: 0 } // Black
};
