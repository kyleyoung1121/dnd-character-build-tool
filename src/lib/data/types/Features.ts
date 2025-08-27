export interface FeaturePrompt {
	name: string;
	id: string;
	description: string;
	featureOptions?: SelectOptions;
	source: string; // where it comes from (class, subclass, race, etc.)
	effects?: FeatureEffect[]; // describes how it changes the character
}

export interface FeatureEffect {
	target: string; // what part of the character this affects
	action: FeatureAction; // how it affects it
	value: any;
}

export type FeatureAction = 'add' | 'remove' | 'set' | 'modify';

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
