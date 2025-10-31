export interface Beast {
	name: string;
	sources: string[];
	type: string;
	size: string;
	speed: Record<string, number>;
	armor_class: number;
	hit_points: { average: number; formula?: string };
	ability_scores: Record<'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA', number>;
	proficiencies: { name: string; text: string }[];
	challenge_rating: number;
	xp: number;
	abilities: { name: string; text: string }[];
	actions: { name: string; text: string }[];
}
