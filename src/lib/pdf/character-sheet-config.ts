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
		x: 100,
		y: 720,
		fontSize: 14,
		maxWidth: 400
	} as FieldConfig,
	
	classAndLevel: {
		x: 100,
		y: 690,
		fontSize: 10,
		maxWidth: 150
	} as FieldConfig,
	
	background: {
		x: 260,
		y: 690,
		fontSize: 10,
		maxWidth: 150
	} as FieldConfig,
	
	species: {
		x: 420,
		y: 690,
		fontSize: 10,
		maxWidth: 150
	} as FieldConfig,
	
	alignment: {
		x: 100,
		y: 665,
		fontSize: 10,
		maxWidth: 150
	} as FieldConfig,
	
	experiencePoints: {
		x: 260,
		y: 665,
		fontSize: 10,
		maxWidth: 150
	} as FieldConfig,
	
	proficiencyBonus: {
		x: 420,
		y: 665,
		fontSize: 10,
		maxWidth: 150,
		align: 'center'
	} as FieldConfig,
	
	// Ability Scores (left column)
	abilityScores: {
		strength: {
			score: { x: 60, y: 600, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 60, y: 625, fontSize: 16, align: 'center' } as FieldConfig
		},
		dexterity: {
			score: { x: 60, y: 540, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 60, y: 565, fontSize: 16, align: 'center' } as FieldConfig
		},
		constitution: {
			score: { x: 60, y: 480, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 60, y: 505, fontSize: 16, align: 'center' } as FieldConfig
		},
		intelligence: {
			score: { x: 60, y: 420, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 60, y: 445, fontSize: 16, align: 'center' } as FieldConfig
		},
		wisdom: {
			score: { x: 60, y: 360, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 60, y: 385, fontSize: 16, align: 'center' } as FieldConfig
		},
		charisma: {
			score: { x: 60, y: 300, fontSize: 12, align: 'center' } as FieldConfig,
			modifier: { x: 60, y: 325, fontSize: 16, align: 'center' } as FieldConfig
		}
	},
	
	// Saving Throws (left column, below abilities)
	savingThrows: {
		strength: { x: 70, y: 250, fontSize: 9 } as FieldConfig,
		dexterity: { x: 70, y: 235, fontSize: 9 } as FieldConfig,
		constitution: { x: 70, y: 220, fontSize: 9 } as FieldConfig,
		intelligence: { x: 70, y: 205, fontSize: 9 } as FieldConfig,
		wisdom: { x: 70, y: 190, fontSize: 9 } as FieldConfig,
		charisma: { x: 70, y: 175, fontSize: 9 } as FieldConfig
	},
	
	// Skills (left column)
	skills: {
		acrobatics: { x: 70, y: 145, fontSize: 8 } as FieldConfig,
		animalHandling: { x: 70, y: 133, fontSize: 8 } as FieldConfig,
		arcana: { x: 70, y: 121, fontSize: 8 } as FieldConfig,
		athletics: { x: 70, y: 109, fontSize: 8 } as FieldConfig,
		deception: { x: 70, y: 97, fontSize: 8 } as FieldConfig,
		history: { x: 70, y: 85, fontSize: 8 } as FieldConfig,
		insight: { x: 70, y: 73, fontSize: 8 } as FieldConfig,
		intimidation: { x: 70, y: 61, fontSize: 8 } as FieldConfig,
		investigation: { x: 70, y: 49, fontSize: 8 } as FieldConfig,
		medicine: { x: 70, y: 37, fontSize: 8 } as FieldConfig,
		nature: { x: 70, y: 25, fontSize: 8 } as FieldConfig,
		perception: { x: 70, y: 13, fontSize: 8 } as FieldConfig,
		performance: { x: 70, y: 1, fontSize: 8 } as FieldConfig,
		persuasion: { x: 200, y: 145, fontSize: 8 } as FieldConfig,
		religion: { x: 200, y: 133, fontSize: 8 } as FieldConfig,
		sleightOfHand: { x: 200, y: 121, fontSize: 8 } as FieldConfig,
		stealth: { x: 200, y: 109, fontSize: 8 } as FieldConfig,
		survival: { x: 200, y: 97, fontSize: 8 } as FieldConfig
	},
	
	passivePerception: {
		x: 60,
		y: 50,
		fontSize: 12,
		align: 'center'
	} as FieldConfig,
	
	// Combat Stats (middle column)
	armorClass: {
		x: 300,
		y: 625,
		fontSize: 18,
		align: 'center'
	} as FieldConfig,
	
	initiative: {
		x: 380,
		y: 625,
		fontSize: 18,
		align: 'center'
	} as FieldConfig,
	
	speed: {
		x: 460,
		y: 625,
		fontSize: 18,
		align: 'center'
	} as FieldConfig,
	
	hitPointMaximum: {
		x: 380,
		y: 590,
		fontSize: 12,
		align: 'center'
	} as FieldConfig,
	
	currentHitPoints: {
		x: 380,
		y: 550,
		fontSize: 16,
		align: 'center'
	} as FieldConfig,
	
	temporaryHitPoints: {
		x: 380,
		y: 510,
		fontSize: 12,
		align: 'center'
	} as FieldConfig,
	
	hitDice: {
		x: 300,
		y: 470,
		fontSize: 10
	} as FieldConfig,
	
	// Attacks (middle column)
	attacks: [
		{ name: { x: 250, y: 400, fontSize: 9 }, bonus: { x: 370, y: 400, fontSize: 9 }, damage: { x: 420, y: 400, fontSize: 9 } },
		{ name: { x: 250, y: 385, fontSize: 9 }, bonus: { x: 370, y: 385, fontSize: 9 }, damage: { x: 420, y: 385, fontSize: 9 } },
		{ name: { x: 250, y: 370, fontSize: 9 }, bonus: { x: 370, y: 370, fontSize: 9 }, damage: { x: 420, y: 370, fontSize: 9 } },
		{ name: { x: 250, y: 355, fontSize: 9 }, bonus: { x: 370, y: 355, fontSize: 9 }, damage: { x: 420, y: 355, fontSize: 9 } },
		{ name: { x: 250, y: 340, fontSize: 9 }, bonus: { x: 370, y: 340, fontSize: 9 }, damage: { x: 420, y: 340, fontSize: 9 } }
	],
	
	// Equipment (middle column)
	equipment: {
		x: 250,
		y: 300,
		width: 300,
		height: 200,
		fontSize: 9,
		lineHeight: 12
	} as TextAreaConfig,
	
	// Proficiencies & Languages (right column)
	proficienciesAndLanguages: {
		x: 580,
		y: 500,
		width: 200,
		height: 150,
		fontSize: 8,
		lineHeight: 10
	} as TextAreaConfig,
	
	// Features & Traits (right column)
	featuresAndTraits: {
		x: 580,
		y: 100,
		width: 200,
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
