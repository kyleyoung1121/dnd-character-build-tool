// ==============================
// Feature Prompt & Description
// ==============================

export interface FeaturePrompt {
	name: string;
	id: string;
	description: FeatureDescription;
	featureOptions?: SelectOptions;
	source: string; // class, subclass, race, background, etc.
	effects?: FeatureEffect[];
}

// ==============================
// Description System
// ==============================

export interface FeatureDescription {
	blocks: DescriptionBlock[];
}

export type DescriptionBlock =
	| TextBlock
	| ComputedInlineBlock
	| ComputedReplacementBlock;

// ------------------------------
// Plain Text
// ------------------------------

export interface TextBlock {
	type: 'text';
	text: string;
}

// ------------------------------
// Computed Inline Hint
// ------------------------------

export interface ComputedInlineBlock {
	type: 'computed-inline';

	/**
	 * Original rules text that should remain readable
	 * even if the computed value is unavailable.
	 *
	 * Example:
	 * "You can add half your proficiency bonus to any ability check
	 * you make that doesn't already include your proficiency bonus."
	 *
	 * Or for multiple inline hints:
	 * "While not wearing armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier."
	 */
	text: string;

	/**
	 * Array of inline hints to insert at specific positions in the text.
	 * Each hint identifies where to insert the computed value.
	 *
	 * Example for single hint (backward compatible):
	 * [
	 *   {
	 *     afterText: "half your proficiency bonus",
	 *     computed: { source: 'derived', formula: 'floor(PROF / 2)' },
	 *     hintFormat: "(+{value})"
	 *   }
	 * ]
	 *
	 * Example for multiple hints:
	 * [
	 *   {
	 *     afterText: "your Dexterity modifier",
	 *     computed: { source: 'abilityMod', ability: 'DEX' },
	 *     hintFormat: "({value})"
	 *   },
	 *   {
	 *     afterText: "your Constitution modifier",
	 *     computed: { source: 'abilityMod', ability: 'CON' },
	 *     hintFormat: "({value})"
	 *   }
	 * ]
	 */
	hints: InlineHint[];
}

export interface InlineHint {
	/**
	 * Text fragment after which to insert the hint.
	 * The renderer will search for this exact string and insert the hint after it.
	 */
	afterText: string;

	/**
	 * What value to compute (ability mod, proficiency, derived, etc.)
	 */
	computed: ComputedValue;

	/**
	 * How the computed value is displayed inline.
	 * Example:
	 * "(+{value})"
	 * "(+{value} ft)"
	 * "({value})"
	 */
	hintFormat: string;
}

// ------------------------------
// Computed Replacement
// ------------------------------

export interface ComputedReplacementBlock {
	type: 'computed-replacement';

	/**
	 * Which computed values must be available
	 * before this replacement activates.
	 */
	whenAvailable: ComputedValue[];

	/**
	 * Used when required values are missing.
	 * This should still be understandable rules text.
	 */
	fallbackText: string;

	/**
	 * Final rendered text once values are known.
	 *
	 * Example:
	 * "You can use this ability {value} times."
	 */
	replacementTemplate: string;

	/**
	 * Optional template used when the computed value equals exactly 1.
	 * This helps avoid grammar issues like "1 times" vs "once".
	 * No value substitution occurs - this is a hardcoded string.
	 *
	 * Example:
	 * "You can use this ability once per long rest."
	 */
	singularTemplate?: string;
}

// ==============================
// Computed Values
// ==============================

export type ComputedValue =
	| AbilityModifierValue
	| AbilityScoreValue
	| ProficiencyValue
	| DerivedValue;

export interface AbilityModifierValue {
	source: 'abilityMod';
	ability: Ability;
}

export interface AbilityScoreValue {
	source: 'abilityScore';
	ability: Ability;
}

export interface ProficiencyValue {
	source: 'proficiency';
}

export interface DerivedValue {
	source: 'derived';

	/**
	 * Expression evaluated by your renderer.
	 * You control the grammar here.
	 *
	 * Examples:
	 * "max(1, CHA_MOD)"
	 * "floor(PROF / 2)"
	 */
	formula: string;
}

// ==============================
// Feature Effects
// ==============================

export interface FeatureEffect {
	target: string;
	action: FeatureAction;
	value: any;
}

export type FeatureAction = 'add' | 'remove' | 'set' | 'modify';

// ==============================
// Selection / Options
// ==============================

export type SelectOptions = {
	placeholderText: string;
	options?: (string | ComplexOption)[];
	dynamicOptionsGenerator?: DynamicOptionsGenerator;
	numPicks: number;
};

export type DynamicOptionsGenerator = {
	type: 'proficient-skills-plus-tools';
	additionalOptions: string[];
};

export type ComplexOption = {
	name: string;
	optionDescription: string;
	nestedPrompts?: FeaturePrompt[];
};

// ==============================
// Supporting Types
// ==============================

export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
