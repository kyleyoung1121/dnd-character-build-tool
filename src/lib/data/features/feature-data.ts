/**
 * D&D 5e Feature & Trait Data
 * Complete feature descriptions for PDF export
 * 
 * ARCHITECTURE:
 * - Features are stored by name in the character store as strings
 * - This file maps feature names to their full descriptions
 * - When generating PDF, we look up the description by feature name
 * - Multiple features can fit on page 1, overflow goes to page 2's additionalFeatures
 */

export interface FeatureData {
	name: string;
	description: string;
	source: 'class' | 'race' | 'background' | 'feat' | 'subclass';
	level?: number; // At what level this feature is gained (for class features)
}

/**
 * Complete feature database
 * 
 * TO ADD MORE FEATURES:
 * 1. Find the feature name in your class/race data files (e.g., barbarian.ts)
 * 2. Copy the description from the D&D 5e SRD or Player's Handbook
 * 3. Add an entry here with the exact same name as in the class/race files
 * 4. Format: Keep line breaks as <br>, use bullet points with •
 * 5. Source should match where the feature comes from
 * 
 * CURRENT COVERAGE:
 * - Barbarian: Complete (all class features + subclass features)
 * - Other classes: TODO (to be added by user)
 */
export const featureData: Record<string, FeatureData> = {
	// ==============================================
	// BARBARIAN CLASS FEATURES
	// ==============================================
	
	'Rage': {
		name: 'Rage',
		description: "In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.<br><br>While raging, you gain the following benefits if you aren't wearing heavy armor:<br>• You have advantage on Strength checks and Strength saving throws.<br>• When you make a melee weapon attack using Strength, you gain a +2 bonus to the damage roll.<br>• You have resistance to bludgeoning, piercing, and slashing damage.<br><br>Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.<br><br>You can rage 2 times per day. You regain all expended uses when you finish a long rest.",
		source: 'class',
		level: 1
	},
	
	'Unarmored Defense': {
		name: 'Unarmored Defense',
		description: 'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.',
		source: 'class',
		level: 1
	},
	
	'Reckless Attack': {
		name: 'Reckless Attack',
		description: 'Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation.<br><br>When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.',
		source: 'class',
		level: 2
	},
	
	'Danger Sense': {
		name: 'Danger Sense',
		description: "At 2nd level, you gain an uncanny sense of when things nearby aren't as they should be, giving you an edge when you dodge away from danger.<br><br>You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated.",
		source: 'class',
		level: 2
	},
	
	// Primal Path: Berserker
	'Frenzy': {
		name: 'Frenzy',
		description: 'Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.',
		source: 'subclass',
		level: 3
	},
	
	// Primal Path: Totem Warrior
	'Spirit Seeker': {
		name: 'Spirit Seeker',
		description: 'Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts. At 3rd level when you adopt this path, you gain the ability to cast the beast sense and speak with animals spells, but only as rituals.',
		source: 'subclass',
		level: 3
	},
	
	'Bear Totem Spirit': {
		name: 'Bear Totem Spirit',
		description: 'While raging, you have resistance to all damage except psychic damage. The spirit of the bear makes you tough enough to stand up to any punishment.',
		source: 'subclass',
		level: 3
	},
	
	'Eagle Totem Spirit': {
		name: 'Eagle Totem Spirit',
		description: "While you're raging and aren't wearing heavy armor, other creatures have disadvantage on opportunity attack rolls against you, and you can use the Dash action as a bonus action on your turn. The spirit of the eagle makes you into a predator who can weave through the fray with ease.",
		source: 'subclass',
		level: 3
	},
	
	'Wolf Totem Spirit': {
		name: 'Wolf Totem Spirit',
		description: "While you're raging, your friends have advantage on melee attack rolls against any creature within 5 feet of you that is hostile to you. The spirit of the wolf makes you a leader of hunters.",
		source: 'subclass',
		level: 3
	},
	
	// ==============================================
	// OTHER CLASSES (TO BE ADDED)
	// ==============================================
	// TODO: Fighter features
	// TODO: Rogue features
	// TODO: Wizard features
	// TODO: Cleric features
	// TODO: etc.
	
	// ==============================================
	// RACIAL FEATURES (TO BE ADDED)
	// ==============================================
	// TODO: Darkvision
	// TODO: Dwarven Resilience
	// TODO: etc.
	
	// ==============================================
	// BACKGROUND FEATURES (TO BE ADDED)
	// ==============================================
	// TODO: Background features
};

/**
 * Get feature data by name (case-insensitive)
 */
export function getFeatureData(featureName: string): FeatureData | null {
	// Try exact match first
	if (featureData[featureName]) {
		return featureData[featureName];
	}
	
	// Try case-insensitive match
	const lowerName = featureName.toLowerCase();
	const match = Object.keys(featureData).find(
		key => key.toLowerCase() === lowerName
	);
	
	return match ? featureData[match] : null;
}

/**
 * Check if a feature has data available
 */
export function hasFeatureData(featureName: string): boolean {
	return getFeatureData(featureName) !== null;
}

/**
 * Format feature for PDF display
 * Returns formatted string with name and description
 * Uses special marker <<BOLD:text>> to indicate bold text
 */
export function formatFeatureForPDF(featureName: string): string {
	const featureData = getFeatureData(featureName);
	
	if (!featureData) {
		// If feature not found in database, just show the name with bullet
		return `• ${featureName}`;
	}
	
	// Format: <<BOLD:Name>>. Description
	// Name is marked for bold rendering, followed by period and description on same line
	return `<<BOLD:${featureData.name}>>. ${featureData.description}`;
}

/**
 * Format multiple features for PDF display
 * Separates each feature with double newline for spacing
 */
export function formatFeaturesForPDF(featureNames: string[]): string {
	return featureNames
		.map(name => formatFeatureForPDF(name))
		.join('\n\n'); // Double newline creates space between features
}

/**
 * Get list of features that have data available
 * Useful for testing/debugging
 */
export function getAvailableFeatures(): string[] {
	return Object.keys(featureData);
}

/**
 * Get features by source (class, race, background, etc.)
 */
export function getFeaturesBySource(source: FeatureData['source']): FeatureData[] {
	return Object.values(featureData).filter(f => f.source === source);
}
