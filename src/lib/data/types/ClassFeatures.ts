export interface FeaturePrompt {
	name: string;
	description: string;
	featureOptions?: SelectOptions;
	source: string; // where it comes from (class, subclass, race, etc.)
	effects?: FeatureEffect[]; // describes how it changes the character
}

export interface FeatureEffect {
	target: FeatureTarget; // what part of the character this affects
	action: FeatureAction; // how it affects it
	value?: any; // can be string, number, or structured object
}

export type FeatureTarget =
	| "skills"
	| "savingThrows"
	| "subclass"
	| "hitPoints"
	| "features"
	| "equipment"
	| "resistances"
	| "conditions"
	| "notes";

export type FeatureAction =
	| "add"
	| "remove"
	| "set"
	| "modify";

export type SelectOptions = {
	placeholderText: string;
	options: (string | ComplexOption)[];
	numPicks: number;
};

export type ComplexOption = {
	name: string;
	optionDescription: string;
	nestedPrompts?: FeaturePrompt[];
};
