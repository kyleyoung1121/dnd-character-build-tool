export interface Spell {
	name: string;
	level: number;
	school: string;
	castingTime: string;
	range: string;
	components: string[];
	duration: string;
	description: string;
	higherLevel?: string;
	classes: string[];
	ritual?: boolean;
	isRareUse?: boolean;
	tags?: SpellTag[];
}

export interface SpellAccess {
	source: 'class' | 'subclass' | 'race' | 'feat' | 'feature';
	sourceName: string;
	spells: string[];
	cantrips?: string[];
	chooseable?: boolean; // false means automatically granted
	chooseFrom?: string[]; // specific spell list to choose from
	chooseCount?: number; // how many leveled spells to choose (legacy, will be deprecated)
	chooseCantripCount?: number; // how many cantrips to choose
	chooseSpellCount?: number; // how many leveled spells to choose
	maxSpellLevel?: number; // maximum spell level that can be chosen (for limited casters like EK/AT)
	restrictToSchools?: string[]; // restrict chooseable spells to specific schools (e.g., ['Enchantment', 'Illusion'] for Arcane Trickster)
}

export const SPELL_TAGS = [
	'SpellAttack',
	'SpellSave',
	'HalfOnSave',
	'Buff',
	'Debuff',
	'Utility',
	'AreaOfEffect'
] as const;

export type SpellTag = typeof SPELL_TAGS[number];

export const cantrips: Spell[] = [
	{
		name: 'Acid Splash',
		level: 0,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'You hurl a bubble of acid. Choose one or two creatures you can see within range. If you choose two, they must be within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.',
		classes: ['Druid', 'Sorcerer', 'Wizard'],
		tags: ['SpellSave']
	},
	{
		name: 'Blade Ward',
		level: 0,
		school: 'Abjuration',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S'],
		duration: '1 round',
		description:
			'You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.',
		classes: ['Bard', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Buff'],
		isRareUse: true
	},
	{
		name: 'Chill Touch',
		level: 0,
		school: 'Necromancy',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S'],
		duration: '1 round',
		description:
			"You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack against the creature to assail it with the chill of the grave. On a hit, the target takes 1d8 necrotic damage, and it can't regain hit points until the start of your next turn. Until then, the hand clings to the target. \nIf you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn.",
		classes: ['Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['SpellAttack', 'Debuff']
	},
	{
		name: 'Dancing Lights',
		level: 0,
		school: 'Evocation',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			"You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size. Whichever form you choose, each light sheds dim light in a 10-foot radius. \nAs a bonus action on your turn, you can move the lights up to 60 feet to a new spot within range. A light must be within 20 feet of another light created by this spell, and a light winks out if it exceeds the spell's range.",
		classes: ['Bard', 'Sorcerer', 'Wizard'],
		tags: ['Utility']
	},
	{
		name: 'Druidcraft',
		level: 0,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'Whispering to the spirits of nature, you create one of the following effects within range:\n-You create a tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours. The effect might manifest as a golden orb for clear skies, a cloud for rain, falling snowflakes for snow, and so on. This effect persists for 1 round.\n-You instantly make a flower blossom, a seed pod open, or a leaf bud bloom.\n-You create an instantaneous, harmless sensory effect, such as falling leaves, a puff of wind, the sound of a small animal, or the faint odor of skunk. The effect must fit in a 5-foot cube.\n-You instantly light or snuff out a candle, a torch, or a small campfire.',
		classes: ['Druid'],
		tags: ['Utility']
	},
	{
		name: 'Eldritch Blast',
		level: 0,
		school: 'Evocation',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.',
		classes: ['Warlock'],
		tags: ['SpellAttack']
	},
	{
		name: 'Fire Bolt',
		level: 0,
		school: 'Evocation',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			"You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.",
		classes: ['Sorcerer', 'Wizard'],
		tags: ['SpellAttack']
	},
	{
		name: 'Friends',
		level: 0,
		school: 'Enchantment',
		castingTime: '1 action',
		range: 'Self',
		components: ['S', 'M'],
		duration: '1 minute',
		description:
			'For the duration, you have advantage on all Charisma checks directed at one creature of your choice that isn’t hostile toward you. When the spell ends, the creature realizes that you used magic to influence its mood and becomes hostile toward you. A creature prone to violence might attack you. Another creature might seek retribution in other ways (at the DM’s discretion), depending on the nature of your interaction with it.',
		classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Buff'],
		isRareUse: true
	},
	{
		name: 'Guidance',
		level: 0,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 minute',
		description:
			'You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.',
		classes: ['Cleric', 'Druid'],
		tags: ['Buff']
	},
	{
		name: 'Light',
		level: 0,
		school: 'Evocation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'M'],
		duration: '1 hour',
		description:
			'You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the object with something opaque blocks the light. The spell ends if you cast it again or dismiss it as an action. \nIf you target an object held or worn by a hostile creature, that creature must succeed on a Dexterity saving throw to avoid the spell.',
		classes: ['Bard', 'Cleric', 'Sorcerer', 'Wizard'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Mage Hand',
		level: 0,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S'],
		duration: '1 minute',
		description:
			"A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. \nYou can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. You can move the hand up to 30 feet each time you use it. \nThe hand can't attack, activate magic items, or carry more than 10 pounds.",
		classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Utility']
	},
	{
		name: 'Mending',
		level: 0,
		school: 'Transmutation',
		castingTime: '1 minute',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Instantaneous',
		description:
			"This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage. This spell can physically repair a magic item or construct, but the spell can't restore magic to such an object.",
		classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Message',
		level: 0,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S', 'M'],
		duration: '1 round',
		description:
			"You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear. \nYou can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence, 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood blocks the spell. The spell doesn't have to follow a straight line and can travel freely around corners or through openings.",
		classes: ['Bard', 'Sorcerer', 'Wizard'],
		tags: ['Utility']
	},
	{
		name: 'Minor Illusion',
		level: 0,
		school: 'Illusion',
		castingTime: '1 action',
		range: '30 feet',
		components: ['S', 'M'],
		duration: '1 minute',
		description:
			"You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again. \nIf you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else's voice, a lion's roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends. \nIf you create an image of an object--such as a chair, muddy footprints, or a small chest--it must be no larger than a 5-foot cube. The image can't create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it. \nIf a creature uses its action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.",
		classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Utility']
	},
	{
		name: 'Poison Spray',
		level: 0,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '10 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage.',
		classes: ['Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['SpellSave']
	},
	{
		name: 'Prestidigitation',
		level: 0,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '10 feet',
		components: ['V', 'S'],
		duration: 'Up to 1 hour',
		description:
			'This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range:\n-You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.\n-You instantaneously light or snuff out a candle, a torch, or a small campfire.\n-You instantaneously clean or soil an object no larger than 1 cubic foot.\n-You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.\n-You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.\n-You create a nonmagical trinket or an illusory image that can fit in your hand and that lasts until the end of your next turn.\nIf you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.',
		classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Utility']
	},
	{
		name: 'Produce Flame',
		level: 0,
		school: 'Conjuration',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S'],
		duration: '10 minutes',
		description:
			'A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again.\nYou can also attack with the flame, although doing so ends the spell. When you cast this spell, or as an action on a later turn, you can hurl the flame at a creature within 30 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 fire damage.',
		classes: ['Druid'],
		tags: ['SpellAttack', 'Utility']
	},
	{
		name: 'Ray of Frost',
		level: 0,
		school: 'Evocation',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.',
		classes: ['Sorcerer', 'Wizard'],
		tags: ['SpellAttack', 'Debuff']
	},
	{
		name: 'Resistance',
		level: 0,
		school: 'Abjuration',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after making the saving throw. The spell then ends.',
		classes: ['Cleric', 'Druid'],
		tags: ['Buff'],
		isRareUse: true
	},
	{
		name: 'Sacred Flame',
		level: 0,
		school: 'Evocation',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.',
		classes: ['Cleric'],
		tags: ['SpellSave']
	},
	{
		name: 'Shillelagh',
		level: 0,
		school: 'Transmutation',
		castingTime: '1 bonus action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: '1 minute',
		description:
			"The wood of a club or quarterstaff you are holding is imbued with nature's power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon's damage die becomes a d8. The weapon also becomes magical, if it isn't already. The spell ends if you cast it again or if you let go of the weapon.",
		classes: ['Druid'],
		tags: ['Buff']
	},
	{
		name: 'Shocking Grasp',
		level: 0,
		school: 'Evocation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			"Lightning springs from your hand to deliver a shock to a creature you try to touch. Make a melee spell attack against the target. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d8 lightning damage, and it can't take reactions until the start of its next turn.",
		classes: ['Sorcerer', 'Wizard'],
		tags: ['SpellAttack', 'Debuff']
	},
	{
		name: 'Spare the Dying',
		level: 0,
		school: 'Necromancy',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs.',
		classes: ['Cleric'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Thaumaturgy',
		level: 0,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V'],
		duration: 'Up to 1 minute',
		description:
			'You manifest a minor wonder, a sign of supernatural power, within range. You create one of the following magical effects within range:\n-Your voice booms up to three times as loud as normal for 1 minute.\n-You cause flames to flicker, brighten, dim, or change color for 1 minute.\n-You cause harmless tremors in the ground for 1 minute.\n-You create an instantaneous sound that originates from a point of your choice within range, such as a rumble of thunder, the cry of a raven, or ominous whispers.\n-You instantaneously cause an unlocked door or window to fly open or slam shut.\n-You alter the appearance of your eyes for 1 minute.\nIf you cast this spell multiple times, you can have up to three of its 1-minute effects active at a time, and you can dismiss such an effect as an action.',
		classes: ['Cleric'],
		tags: ['Utility']
	},
	{
		name: 'Thorn Whip',
		level: 0,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: 'Instantaneous',
		description:
			'You create a long, vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target. If the attack hits, the creature takes 1d6 piercing damage, and if the creature is Large or smaller, you pull the creature up to 10 feet closer to you.',
		classes: ['Druid'],
		tags: ['SpellAttack']
	},
	{
		name: 'True Strike',
		level: 0,
		school: 'Divination',
		castingTime: '1 action',
		range: '30 feet',
		components: ['S'],
		duration: 'Concentration, up to 1 round',
		description:
			"You point a finger at a target in range. Your magic grants you a brief insight into the target's defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn't ended.",
		classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Buff'],
		isRareUse: true
	},
	{
		name: 'Vicious Mockery',
		level: 0,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V'],
		duration: 'Instantaneous',
		description:
			'You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.',
		classes: ['Bard'],
		tags: ['SpellSave', 'Debuff']
	}
];

export const firstLevel: Spell[] = [
	{
		name: 'Alarm',
		level: 1,
		school: 'Abjuration',
		castingTime: '1 minute',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: '8 hours',
		description:
			"You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is mental or audible.\nA mental alarm alerts you with a ping in your mind if you are within 1 mile of the warded area. This ping awakens you if you are sleeping.\nAn audible alarm produces the sound of a hand bell for 10 seconds within 60 feet.",
		classes: ['Ranger', 'Wizard'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Animal Friendship',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: '24 hours',
		description:
			"This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast's Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell's duration. If you or one of your companions harms the target, the spell ends.",
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, you can affect one additional beast.',
		classes: ['Bard', 'Druid', 'Ranger'],
		tags: ['SpellSave', 'Debuff'],
		isRareUse: true
	},
	{
		name: 'Armor of Agathys',
		level: 1,
		school: 'Abjuration',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: '1 hour',
		description:
			'A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, both the temporary hit points and the damage increase by 5.',
		classes: ['Warlock'],
		tags: ['Buff']
	},
	{
		name: 'Arms of Hadar',
		level: 1,
		school: 'Conjuration',
		castingTime: '1 action',
		range: 'Self (10-foot radius)',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'You invoke the power of Hadar, the Dark Hunger. Tendrils of dark energy erupt from you and batter all creatures within 10 feet of you. Each creature in that area must make a Strength saving throw. On a failed save, a target takes 2d6 necrotic damage and can’t take reactions until its next turn. On a successful save, the creature takes half damage, but suffers no other effect. ',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d6.',
		classes: ['Warlock'],
		tags: ['SpellSave', 'HalfOnSave', 'AreaOfEffect']
	},
	{
		name: 'Bane',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, you can target one additional creature.',
		classes: ['Bard', 'Cleric'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Bless',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, you can target one additional creature.',
		classes: ['Cleric', 'Paladin'],
		tags: ['Buff']
	},
	{
		name: 'Burning Hands',
		level: 1,
		school: 'Evocation',
		castingTime: '1 action',
		range: 'Self (15-foot cone)',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			"As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one.\nThe fire ignites any flammable objects in the area that aren't being worn or carried.",
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d6.',
		classes: ['Sorcerer', 'Wizard'],
		tags: ['SpellSave', 'HalfOnSave', 'AreaOfEffect']
	},
	{
		name: 'Charm Person',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S'],
		duration: '1 hour',
		description:
			'You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature regards you as a friendly acquaintance. When the spell ends, the creature knows it was charmed by you.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, you can target one additional creature, as long as they are within 30 feet of each other.',
		classes: ['Bard', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Chromatic Orb',
		level: 1,
		school: 'Evocation',
		castingTime: '1 action',
		range: '90 feet',
		components: ['V', 'S', 'M'],
		duration: 'Instantaneous',
		description:
			'You hurl a 4-inch-diameter sphere of energy at a creature that you can see within range. You choose acid, cold, fire, lightning, poison, or thunder for the type of orb you create, and then make a ranged spell attack against the target. If the attack hits, the creature takes 3d8 damage of the type you chose.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d8.',
		classes: ['Sorcerer', 'Wizard'],
		tags: ['SpellAttack']
	},
	{
		name: 'Color Spray',
		level: 1,
		school: 'Illusion',
		castingTime: '1 action',
		range: 'Self (15-foot cone)',
		components: ['V', 'S', 'M'],
		duration: '1 round',
		description:
			'A dazzling array of flashing, colored light springs from your hand. Roll 6d10; the total is how many hit points of creatures this spell can affect. Creatures in a 15-foot cone originating from you are affected in ascending order of their current hit points (ignoring unconscious creatures and creatures that can’t see).\nStarting with the creature that has the lowest current hit points, each creature affected by this spell is blinded until the end of your next turn. Subtract each creature’s hit points from the total before moving on to the creature with the next lowest hit points. A creature’s hit points must be equal to or less than the remaining total for that creature to be affected.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, roll an additional 2d10 blind-points.',
		classes: ['Sorcerer', 'Wizard'],
		tags: ['AreaOfEffect', 'Debuff']
	},
	{
		name: 'Command',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V'],
		duration: '1 round',
		description:
			"You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it.\nSome typical commands and their effects follow. You might issue a command other than one described here. If you do so, the DM determines how the target behaves. If the target can't follow your command, the spell ends.\nApproach. The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you.\nDrop. The target drops whatever it is holding and then ends its turn.\nFlee. The target spends its turn moving away from you by the fastest available means.\nGrovel. The target falls prone and then ends its turn.\nHalt. The target doesn't move and takes no actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air.",
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, you can target one additional creature within range.',
		classes: ['Cleric', 'Paladin'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Compelled Duel',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 bonus action',
		range: '30 feet',
		components: ['V'],
		duration: 'Concentration, up to 1 minute',
		description:
			'You attempt to compel a creature into a duel. One creature that you can see within range must make a Wisdom saving throw. On a failed save, the creature is drawn to you, compelled by your divine demand. For the duration, it has disadvantage on attack rolls against creatures other than you, and must make a Wisdom saving throw each time it attempts to move to a space that is more than 30 feet away from you; if it succeeds on this saving throw, this spell doesn’t restrict the target’s movement for that turn.\nThe spell ends if you attack any other creature, if you cast a spell that targets a hostile creature other than the target, if a creature friendly to you damages the target or casts a harmful spell on it, or if you end your turn more than 30 feet away from the target.',
		classes: ['Paladin'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Comprehend Languages',
		level: 1,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: '1 hour',
		description:
			"For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text.\nThis spell doesn't decode secret messages in a text or a glyph, such as an arcane sigil, that isn't part of a written language.",
		classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Create or Destroy Water',
		level: 1,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: 'Instantaneous',
		description:
			'You either create or destroy water.\nCreate Water. You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot cube within range, extinguishing exposed flames in the area.\nDestroy Water. You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot cube within range.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, you create or destroy 10 additional gallons of water, or the size of the cube increases by 5 feet.',
		classes: ['Cleric', 'Druid'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Cure Wounds',
		level: 1,
		school: 'Evocation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the healing increases by 1d8.',
		classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger'],
		tags: ['Buff']
	},
	{
		name: 'Detect Evil and Good',
		level: 1,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S'],
		duration: 'Concentration, up to 10 minutes',
		description:
			'For the duration, you know if there is an aberration, celestial, elemental, fey, fiend, or undead within 30 feet of you, as well as where the creature is located. Similarly, you know if there is a place or object within 30 feet of you that has been magically consecrated or desecrated.\nThe spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.',
		classes: ['Cleric', 'Paladin'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Detect Magic',
		level: 1,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S'],
		duration: 'Concentration, up to 10 minutes',
		description:
			'For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.\nThe spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.',
		classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Wizard'],
		ritual: true,
		tags: ['Utility']
	},
	{
		name: 'Detect Poison and Disease',
		level: 1,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 10 minutes',
		description:
			'For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case.\nThe spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.',
		classes: ['Cleric', 'Paladin', 'Ranger', 'Druid'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Disguise Self',
		level: 1,
		school: 'Illusion',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S'],
		duration: '1 hour',
		description:
			"You make yourself--including your clothing, armor, weapons, and other belongings on your person--look different until the spell ends or until you use your action to dismiss it. You can seem 1 foot shorter or taller and can appear thin, fat, or in between. You can't change your body type, so you must adopt a form that has the same basic arrangement of limbs. Otherwise, the extent of the illusion is up to you.\nThe changes wrought by this spell fail to hold up to physical inspection. For example, if you use this spell to add a hat to your outfit, objects pass through the hat, and anyone who touches it would feel nothing or would feel your head and hair. If you use this spell to appear thinner than you are, the hand of someone who reaches out to touch you would bump into you while it was seemingly still in midair.\nTo discern that you are disguised, a creature can use its action to inspect your appearance and must succeed on an Intelligence (Investigation) check against your spell save DC.",
		classes: ['Bard', 'Sorcerer', 'Wizard'],
		tags: ['Utility']
	},
	{
		name: 'Dissonant Whispers',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V'],
		duration: 'Instantaneous',
		description:
			'You whisper a discordant melody that only one creature of your choice within range can hear, wracking it with terrible pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you. The creature doesn’t move into obviously dangerous ground, such as a fire or a pit. On a successful save, the target takes half as much damage and doesn’t have to move away. A deafened creature automatically succeeds on the save.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d6.',
		classes: ['Bard'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Divine Favor',
		level: 1,
		school: 'Evocation',
		castingTime: '1 bonus action',
		range: 'Self',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 minute',
		description:
			'Your prayer empowers you with divine radiance. Until the spell ends, your weapon attacks deal an extra 1d4 radiant damage on a hit.',
		classes: ['Paladin'],
		tags: ['Buff']
	},
	{
		name: 'Ensnaring Strike',
		level: 1,
		school: 'Conjuration',
		castingTime: '1 bonus action',
		range: 'Self',
		components: ['V'],
		duration: 'Concentration, up to 1 minute',
		description:
			'The next time you hit a creature with a weapon attack before this spell ends, a writhing mass of thorny vines appears at the point of impact, and the target must succeed on a Strength saving throw or be restrained by the magical vines until the spell ends. A Large or larger creature has advantage on this saving throw. If the target succeeds on the save, the vines shrivel away.\nWhile restrained by this spell, the target takes 1d6 piercing damage at the start of each of its turns. A creature restrained by the vines or one that can touch the creature can use its action to make a Strength check against your spell save DC. On a success, the target is freed. ',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d6.',
		classes: ['Ranger'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Entangle',
		level: 1,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '90 feet',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 minute',
		description:
			'Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain.\nA creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself.\nWhen the spell ends, the conjured plants wilt away.',
		classes: ['Druid'],
		tags: ['SpellSave', 'AreaOfEffect', 'Debuff']
	},
	{
		name: 'Expeditious Retreat',
		level: 1,
		school: 'Transmutation',
		castingTime: '1 bonus action',
		range: 'Self',
		components: ['V', 'S'],
		duration: 'Concentration, up to 10 minutes',
		description:
			'This spell allows you to move at an incredible pace. When you cast this spell, and then as a bonus action on each of your turns until the spell ends, you can take the Dash action.',
		classes: ['Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Buff']
	},
	{
		name: 'Faerie Fire',
		level: 1,
		school: 'Evocation',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V'],
		duration: 'Concentration, up to 1 minute',
		description:
			"Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.\nAny attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can't benefit from being invisible.",
		classes: ['Bard', 'Druid'],
		tags: ['SpellSave', 'AreaOfEffect', 'Debuff']
	},
	{
		name: 'False Life',
		level: 1,
		school: 'Necromancy',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: '1 hour',
		description:
			'Bolstering yourself with a necromantic facsimile of life, you gain 1d4 + 4 temporary hit points for the duration.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, you gain an additional 5 temporary hit points.',
		classes: ['Sorcerer', 'Wizard'],
		tags: ['Buff'],
		isRareUse: true
	},
	{
		name: 'Feather Fall',
		level: 1,
		school: 'Transmutation',
		castingTime: '1 reaction',
		range: '60 feet',
		components: ['V', 'M'],
		duration: '1 minute',
		description:
			"Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature.",
		classes: ['Bard', 'Sorcerer', 'Wizard'],
		tags: ['Utility']
	},
	{
		name: 'Find Familiar',
		level: 1,
		school: 'Conjuration',
		castingTime: '1 hour',
		range: '10 feet',
		components: ['V', 'S', 'M'],
		duration: 'Instantaneous',
		description:
			"You gain the service of a familiar, a spirit that takes an animal form you choose: bat, cat, crab, frog (toad), hawk, lizard, octopus, owl, poisonous snake, fish (quipper), rat, raven, sea horse, spider, or weasel. Appearing in an unoccupied space within range, the familiar has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of a beast.\nYour familiar acts independently of you, but it always obeys your commands. In combat, it rolls its own initiative and acts on its own turn. A familiar can't attack, but it can take other actions as normal.\nWhen the familiar drops to 0 hit points, it disappears, leaving behind no physical form. It reappears after you cast this spell again. As an action, you can temporarily dismiss the familiar to a pocket dimension. Alternatively, you can dismiss it forever. As an action while it is temporarily dismissed, you can cause it to reappear in any unoccupied space within 30 feet of you. Whenever the familiar drops to 0 hit points or disappears into the pocket dimension, it leaves behind in its space anything it was wearing or carrying.\nWhile your familiar is within 100 feet of you, you can communicate with it telepathically. Additionally, as an action, you can see through your familiar's eyes and hear what it hears until the start of your next turn, gaining the benefits of any special senses that the familiar has. During this time, you are deaf and blind with regard to your own senses.\nYou can't have more than one familiar at a time. If you cast this spell while you already have a familiar, you instead cause it to adopt a new form. Choose one of the forms from the above list. Your familiar transforms into the chosen creature.\nFinally, when you cast a spell with a range of touch, your familiar can deliver the spell as if it had cast the spell. Your familiar must be within 100 feet of you, and it must use its reaction to deliver the spell when you cast it. If the spell requires an attack roll, you use your attack modifier for the roll.",
		classes: ['Druid', 'Wizard'],
		ritual: true,
		tags: ['Utility']
	},
	{
		name: 'Fog Cloud',
		level: 1,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 hour',
		description:
			'You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the radius of the fog increases by 20 feet.',
		classes: ['Druid', 'Ranger', 'Sorcerer', 'Wizard'],
		tags: ['AreaOfEffect', 'Debuff', 'Utility']
	},
	{
		name: 'Goodberry',
		level: 1,
		school: 'Transmutation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Instantaneous',
		description:
			'Up to ten berries appear in your hand and are infused with magic for the duration. A creature can use its action to eat one berry. Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day.\nThe berries lose their potency if they have not been consumed within 24 hours of the casting of this spell.',
		classes: ['Druid', 'Ranger'],
		tags: ['Buff', 'Utility']
	},
	{
		name: 'Grease',
		level: 1,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: '1 minute',
		description:
			'Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into difficult terrain for the duration.\nWhen the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or fall prone. A creature that enters the area or ends its turn there must also succeed on a Dexterity saving throw or fall prone.',
		classes: ['Druid', 'Wizard'],
		tags: ['SpellSave', 'AreaOfEffect', 'Debuff']
	},
	{
		name: 'Guiding Bolt',
		level: 1,
		school: 'Evocation',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S'],
		duration: '1 round',
		description:
			'A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d6.',
		classes: ['Cleric'],
		tags: ['SpellAttack', 'Debuff']
	},
	{
		name: 'Hail of Thorns',
		level: 1,
		school: 'Conjuration',
		castingTime: '1 bonus action',
		range: 'Self',
		components: ['V'],
		duration: 'Concentration, up to 1 minute',
		description:
			'The next time you hit a creature with a ranged weapon attack before the spell ends, this spell creates a rain of thorns that sprouts from your ranged weapon or ammunition. In addition to the normal effect of the attack, the target of the attack and each creature within 5 feet of it must make a Dexterity saving throw. A creature takes 1d10 piercing damage on a failed save, or half as much damage on a successful one.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d10.',
		classes: ['Ranger'],
		tags: ['SpellSave', 'HalfOnSave', 'AreaOfEffect']
	},
	{
		name: 'Healing Word',
		level: 1,
		school: 'Evocation',
		castingTime: '1 bonus action',
		range: '60 feet',
		components: ['V'],
		duration: 'Instantaneous',
		description:
			'A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the healing increases by 1d4.',
		classes: ['Bard', 'Cleric', 'Druid'],
		tags: ['Buff']
	},
	{
		name: 'Hellish Rebuke',
		level: 1,
		school: 'Evocation',
		castingTime: '1 reaction',
		range: '60 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d10.',
		classes: ['Warlock'],
		tags: ['SpellSave']
	},
	{
		name: 'Heroism',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 minute',
		description:
			'A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to being frightened and gains temporary hit points equal to your spellcasting ability modifier at the start of each of its turns. When the spell ends, the target loses any remaining temporary hit points from this spell.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, you can target one additional creature.',
		classes: ['Bard', 'Paladin'],
		tags: ['Buff']
	},
	{
		name: 'Hex',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 bonus action',
		range: '90 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 hour',
		description:
			'You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also, choose one ability when you cast the spell. The target has disadvantage on ability checks made with the chosen ability.\nIf the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to curse a new creature.\nA remove curse cast on the target ends this spell early.',
		classes: ['Warlock'],
		tags: ['Debuff']
	},
	{
		name: "Hunter's Mark",
		level: 1,
		school: 'Divination',
		castingTime: '1 bonus action',
		range: '90 feet',
		components: ['V'],
		duration: 'Concentration, up to 1 hour',
		description:
			'You choose a creature you can see within range and mystically mark it as your quarry. Until the spell ends, you deal an extra 1d6 damage to the target whenever you hit it with a weapon attack, and you have advantage on any Wisdom (Perception) or Wisdom (Survival) check you make to find it. If the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to mark a new creature.',
		classes: ['Ranger'],
		tags: ['Debuff']
	},
	{
		name: 'Identify',
		level: 1,
		school: 'Divination',
		castingTime: '1 minute',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Instantaneous',
		description:
			'You choose one object that you must touch throughout the casting of the spell. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any. You learn whether any spells are affecting the item and what they are. If the item was created by a spell, you learn which spell created it.\nIf you instead touch a creature throughout the casting, you learn what spells, if any, are currently affecting it.',
		classes: ['Bard', 'Wizard'],
		ritual: true,
		tags: ['Utility']
	},
	{
		name: 'Illusory Script',
		level: 1,
		school: 'Illusion',
		castingTime: '1 minute',
		range: 'Touch',
		components: ['S', 'M'],
		duration: '10 days',
		description:
			'You write on parchment, paper, or some other suitable writing material and imbue it with a potent illusion that lasts for the duration.\nTo you and any creatures you designate when you cast the spell, the writing appears normal, written in your hand, and conveys whatever meaning you intended when you wrote the text. To all others, the writing appears as if it were written in an unknown or magical script that is unintelligible. Alternatively, you can cause the writing to appear to be an entirely different message, written in a different hand and language, though the language must be one you know.\nShould the spell be dispelled, the original script and the illusion both disappear.\nA creature with truesight can read the hidden message.',
		classes: ['Bard', 'Warlock', 'Wizard'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Inflict Wounds',
		level: 1,
		school: 'Necromancy',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d10.',
		classes: ['Cleric'],
		tags: ['SpellAttack']
	},
	{
		name: 'Jump',
		level: 1,
		school: 'Transmutation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: '1 minute',
		description:
			"You touch a creature. The creature's jump distance is tripled until the spell ends.",
		classes: ['Druid', 'Ranger', 'Sorcerer', 'Wizard'],
		tags: ['Buff', 'Utility'],
		isRareUse: true
	},
	{
		name: 'Longstrider',
		level: 1,
		school: 'Transmutation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: '1 hour',
		description:
			'You touch a creature. The target’s speed increases by 10 feet until the spell ends.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, you can target one additional creature.',
		classes: ['Bard', 'Druid', 'Ranger', 'Wizard'],
		tags: ['Buff', 'Utility'],
		isRareUse: true
	},
	{
		name: 'Mage Armor',
		level: 1,
		school: 'Abjuration',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: '8 hours',
		description:
			"You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends. The target's base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.",
		classes: ['Sorcerer', 'Wizard'],
		tags: ['Buff']
	},
	{
		name: 'Magic Missile',
		level: 1,
		school: 'Evocation',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the spell creates one more dart.',
		classes: ['Sorcerer', 'Wizard'],
		tags: ['SpellAttack']
	},
	{
		name: 'Protection from Evil and Good',
		level: 1,
		school: 'Abjuration',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 10 minutes',
		description:
			"Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead.\nThe protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can't be charmed, frightened, or possessed by them. If the target is already charmed, frightened, or possessed by such a creature, the target has advantage on any new saving throw against the relevant effect.",
		classes: ['Cleric', 'Paladin', 'Warlock', 'Wizard'],
		tags: ['Buff']
	},
	{
		name: 'Purify Food and Drink',
		level: 1,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '10 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'All nonmagical food and drink within a 5-foot-radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease.',
		classes: ['Cleric', 'Druid', 'Paladin'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Ray of Sickness',
		level: 1,
		school: 'Necromancy',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'A ray of sickening greenish energy lashes out toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 2d8 poison damage and must make a Constitution saving throw. On a failed save, it is also poisoned until the end of your next turn.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d8.',
		classes: ['Sorcerer', 'Wizard'],
		tags: ['SpellAttack', 'SpellSave', 'Debuff']
	},
	{
		name: 'Sanctuary',
		level: 1,
		school: 'Abjuration',
		castingTime: '1 bonus action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: '1 minute',
		description:
			"You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from area effects, such as the explosion of a fireball.\nIf the warded creature makes an attack, casts a spell that affects an enemy, or deals damage to another creature, this spell ends.",
		classes: ['Cleric'],
		tags: ['Buff']
	},
	{
		name: 'Searing Smite',
		level: 1,
		school: 'Evocation',
		castingTime: '1 bonus action',
		range: 'Self',
		components: ['V'],
		duration: 'Concentration, up to 1 minute',
		description:
			'The next time you hit a creature with a melee weapon attack during the spell’s duration, your weapon flares with white-hot intensity, and the attack deals an extra 1d6 fire damage to the target and causes the target to ignite in flames. At the start of each of its turns until the spell ends, the target must make a Constitution saving throw. On a failed save, it takes 1d6 fire damage. On a successful save, the spell ends. If the target or a creature within 5 feet of it uses an action to put out the flames, or if some other effect douses the flames (such as the target being submerged in water), the spell ends.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the initial damage increases by 1d6.',
		classes: ['Paladin'],
		tags: ['SpellSave']
	},
	{
		name: 'Shield',
		level: 1,
		school: 'Abjuration',
		castingTime: '1 reaction',
		range: 'Self',
		components: ['V', 'S'],
		duration: '1 round',
		description:
			'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.',
		classes: ['Sorcerer', 'Wizard'],
		tags: ['Buff']
	},
	{
		name: 'Shield of Faith',
		level: 1,
		school: 'Abjuration',
		castingTime: '1 bonus action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 10 minutes',
		description:
			'A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.',
		classes: ['Cleric', 'Paladin'],
		tags: ['Buff']
	},
	{
		name: 'Silent Image',
		level: 1,
		school: 'Illusion',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 10 minutes',
		description:
			"You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot cube. The image appears at a spot within range and lasts for the duration. The image is purely visual; it isn't accompanied by sound, smell, or other sensory effects.\nYou can use your action to cause the image to move to any spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image of a creature and move it, you can alter the image so that it appears to be walking.\nPhysical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image.",
		classes: ['Bard', 'Sorcerer', 'Wizard'],
		tags: ['Utility']
	},
	{
		name: 'Sleep',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '90 feet',
		components: ['V', 'S', 'M'],
		duration: '1 minute',
		description:
			'This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points (ignoring unconscious creatures).\nStarting with the creature that has the lowest current hit points, each creature affected by this spell falls unconscious until the spell ends, the sleeper takes damage, or someone uses an action to shake or slap the sleeper awake. Subtract each creature’s hit points from the total before moving on to the creature with the next lowest hit points. A creature’s hit points must be equal to or less than the remaining total for that creature to be affected.\nUndead and creatures immune to being charmed aren’t affected by this spell.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, roll an additional 2d8 for the total hit points of creatures affected.',
		classes: ['Bard', 'Sorcerer', 'Wizard'],
		tags: ['Debuff', 'AreaOfEffect'],
		isRareUse: true
	},
	{
		name: 'Speak with Animals',
		level: 1,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S'],
		duration: '10 minutes',
		description:
			"You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day. You might be able to persuade a beast to perform a small favor for you, at the GM's discretion.",
		classes: ['Bard', 'Druid', 'Ranger'],
		ritual: true,
		tags: ['Utility']
	},
	{
		name: 'Tasha’s Hideous Laughter',
		level: 1,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn’t affected.\nAt the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it’s triggered by damage. On a success, the spell ends.',
		classes: ['Bard', 'Wizard'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Tenser’s Floating Disk',
		level: 1,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: '1 hour',
		description:
			'This spell creates a circular, horizontal plane of force, 3 feet in diameter and 1 inch thick, that floats 3 feet above the ground in an unoccupied space of your choice that you can see within range. The disk remains for the duration, and can hold up to 500 pounds. If more weight is placed on it, the spell ends, and everything on the disk falls to the ground.\nThe disk is immobile while you are within 20 feet of it. If you move more than 20 feet away from it, the disk follows you so that it remains within 20 feet of you. It can move across uneven terrain, up or down stairs, slopes and the like, but it can’t cross an elevation change of 10 feet or more. For example, the disk can’t move across a 10-foot-deep pit, nor could it leave such a pit if it was created at the bottom.\nIf you move more than 100 feet from the disk (typically because it can’t move around an obstacle to follow you), the spell ends.',
		classes: ['Wizard'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Thunderous Smite',
		level: 1,
		school: 'Evocation',
		castingTime: '1 bonus action',
		range: 'Self',
		components: ['V'],
		duration: 'Concentration, up to 1 minute',
		description:
			'The first time you hit with a melee weapon attack during this spell’s duration, your weapon rings with thunder that is audible within 300 feet of you, and the attack deals an extra 2d6 thunder damage to the target. Additionally, if the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and knocked prone.',
		classes: ['Paladin'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Thunderwave',
		level: 1,
		school: 'Evocation',
		castingTime: '1 action',
		range: 'Self (15-foot cube)',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			"A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed.\nIn addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet.",
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the damage increases by 1d8.',
		classes: ['Bard', 'Druid', 'Sorcerer', 'Wizard'],
		tags: ['SpellSave', 'HalfOnSave', 'AreaOfEffect']
	},
	{
		name: 'Unseen Servant',
		level: 1,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: '1 hour',
		description:
			"This spell creates an invisible, mindless, shapeless, Medium force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 hit point, and a Strength of 2, and it can't attack. If it drops to 0 hit points, the spell ends.\nOnce on each of your turns as a bonus action, you can mentally command the servant to move up to 15 feet and interact with an object. The servant can perform simple tasks that a human servant could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, and pouring wine. Once you give the command, the servant performs the task to the best of its ability until it completes the task, then waits for your next command.\nIf you command the servant to perform a task that would move it more than 60 feet away from you, the spell ends.",
		classes: ['Bard', 'Warlock', 'Wizard'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Witch Bolt',
		level: 1,
		school: 'Evocation',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you.',
		higherLevel:
			'When you cast this spell using a 2nd level spell slot, the initial damage increases by 1d12.',
		classes: ['Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['SpellAttack']
	},
	{
		name: 'Wrathful Smite',
		level: 1,
		school: 'Evocation',
		castingTime: '1 bonus action',
		range: 'Self',
		components: ['V'],
		duration: 'Concentration, up to 1 minute',
		description:
			'The next time you hit with a melee weapon attack during this spell’s duration, your attack deals an extra 1d6 psychic damage. Additionally, if the target is a creature, it must succeed on a Wisdom saving throw or be frightened of you until the spell ends. As an action, the creature can make a Wisdom check against your spell save DC to steel its resolve and end this spell.',
		classes: ['Paladin'],
		tags: ['SpellSave', 'Debuff']
	}
];

export const secondLevel: Spell[] = [
	{
		name: 'Aid',
		level: 2,
		school: 'Abjuration',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: '8 hours',
		description:
			"Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration.",
		classes: ['Cleric', 'Paladin'],
		tags: ['Buff']
	},
	{
		name: 'Alter Self',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 hour',
		description:
			"You assume a different form. When you cast the spell, choose one of the following options, the effects of which last for the duration of the spell. While the spell lasts, you can end one option as an action to gain the benefits of a different one.\nAquatic Adaptation. You adapt your body to an aquatic environment, sprouting gills and growing webbing between your fingers. You can breathe underwater and gain a swimming speed equal to your walking speed.\nChange Appearance. You transform your appearance. You decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and distinguishing characteristics, if any. You can make yourself appear as a member of another race, though none of your statistics change. You also can't appear as a creature of a different size than you, and your basic shape stays the same; if you're bipedal, you can't use this spell to become quadrupedal, for instance. At any time for the duration of the spell, you can use your action to change your appearance in this way again.\nNatural Weapons. You grow claws, fangs, spines, horns, or a different natural weapon of your choice. Your unarmed strikes deal 1d6 bludgeoning, piercing, or slashing damage, as appropriate to the natural weapon you chose, and you are proficient with your unarmed strikes. Finally, the natural weapon is magic and you have a +1 bonus to the attack and damage rolls you make using it.",
		classes: ['Sorcerer', 'Wizard'],
		tags: ['Buff', 'Utility']
	},
	{
		name: 'Animal Messenger',
		level: 2,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: '24 hours',
		description:
			"By means of this spell, you use an animal to deliver a message. Choose a Tiny beast you can see within range, such as a squirrel, a blue jay, or a bat. You specify a location, which you must have visited, and a recipient who matches a general description, such as 'a man or woman dressed in the uniform of the town guard' or 'a red-haired dwarf wearing a pointed hat.' You also speak a message of up to twenty-five words. The target beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours for a flying messenger, or 25 miles for other animals.\nWhen the messenger arrives, it delivers your message to the creature that you described, replicating the sound of your voice. The messenger speaks only to a creature matching the description you gave. If the messenger doesn't reach its destination before the spell ends, the message is lost, and the beast makes its way back to where you cast this spell.",
		classes: ['Bard', 'Druid', 'Ranger'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Arcane Lock',
		level: 2,
		school: 'Abjuration',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Until dispelled',
		description:
			'You touch a closed door, window, gate, chest, or other entryway, and it becomes locked for the duration. You and the creatures you designate when you cast this spell can open the object normally. You can also set a password that, when spoken within 5 feet of the object, suppresses this spell for 1 minute. Otherwise, it is impassable until it is broken or the spell is dispelled or suppressed. Casting knock on the object suppresses arcane lock for 10 minutes.\nWhile affected by this spell, the object is more difficult to break or force open; the DC to break it or pick any locks on it increases by 10.',
		classes: ['Wizard'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Augury',
		level: 2,
		school: 'Divination',
		castingTime: '1 minute',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: 'Instantaneous',
		description:
			"By casting gem-inlaid sticks, rolling dragon bones, laying out ornate cards, or employing some other divining tool, you receive an omen from an otherworldly entity about the results of a specific course of action that you plan to take within the next 30 minutes. The DM chooses from the following possible omens:\nWeal, for good results\nWoe, for bad results\nWeal and woe, for both good and bad results\nNothing, for results that aren't especially good or bad\nThe spell doesn't take into account any possible circumstances that might change the outcome, such as the casting of additional spells or the loss or gain of a companion.\nIf you cast the spell two or more times before completing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get a random reading. The DM makes this roll in secret.",
		classes: ['Cleric'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Barkskin',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 hour',
		description:
			"You touch a willing creature. Until the spell ends, the target's skin has a rough, bark-like appearance, and the target's AC can't be less than 16, regardless of what kind of armor it is wearing.",
		classes: ['Druid', 'Ranger'],
		tags: ['Buff']
	},
	{
		name: 'Beast Sense',
		level: 2,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Touch',
		components: ['S'],
		duration: 'Concentration, up to 1 hour',
		description:
			'You touch a willing beast. For the duration of the spell, you can use your action to see through the beast’s eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses. While perceiving through the beast’s senses, you gain the benefits of any special senses possessed by that creature, though you are blinded and deafened to your own surroundings.',
		classes: ['Druid', 'Ranger'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Blindness/Deafness',
		level: 2,
		school: 'Necromancy',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V'],
		duration: '1 minute',
		description:
			'You can blind or deafen a foe. Choose one creature that you can see within range to make a Constitution saving throw. If it fails, the target is either blinded or deafened (your choice) for the duration. At the end of each of its turns, the target can make a Constitution saving throw. On a success, the spell ends.',
		classes: ['Bard', 'Cleric', 'Sorcerer', 'Wizard'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Blur',
		level: 2,
		school: 'Illusion',
		castingTime: '1 action',
		range: 'Self',
		components: ['V'],
		duration: 'Concentration, up to 1 minute',
		description:
			"Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight.",
		classes: ['Druid', 'Sorcerer', 'Wizard'],
		tags: ['Buff']
	},
	{
		name: 'Branding Smite',
		level: 2,
		school: 'Evocation',
		castingTime: '1 bonus action',
		range: 'Self',
		components: ['V'],
		duration: 'Concentration, up to 1 minute',
		description:
			'The next time you hit a creature with a weapon attack before this spell ends, the weapon gleams with astral radiance as you strike. The attack deals an extra 2d6 radiant damage to the target, which becomes visible if it is invisible, and the target sheds dim light in a 5-foot radius and can’t become invisible until the spell ends. ',
		classes: ['Paladin'],
		tags: ['Debuff']
	},
	{
		name: 'Calm Emotions',
		level: 2,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 minute',
		description:
			'You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw; a creature can choose to fail this saving throw if it wishes. If a creature fails its saving throw, choose one of the following two effects.\nYou can suppress any effect causing a target to be charmed or frightened. When this spell ends, any suppressed effect resumes, provided that its duration has not expired in the meantime.\nAlternatively, you can make a target indifferent about creatures of your choice that it is hostile toward. This indifference ends if the target is attacked or harmed by a spell or if it witnesses any of its friends being harmed. When the spell ends, the creature becomes hostile again, unless the DM rules otherwise.',
		classes: ['Bard', 'Cleric'],
		tags: ['SpellSave', 'AreaOfEffect', 'Debuff', 'Utility']
	},
	{
		name: 'Cloud of Daggers',
		level: 2,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell’s area for the first time on a turn or starts its turn there. ',
		classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['AreaOfEffect']
	},
	{
		name: 'Continual Flame',
		level: 2,
		school: 'Evocation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Until dispelled',
		description:
			"A flame, equivalent in brightness to a torch, springs forth from an object that you touch. The effect looks like a regular flame, but it creates no heat and doesn't use oxygen. A continual flame can be covered or hidden but not smothered or quenched.",
		classes: ['Cleric', 'Wizard'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Cordon of Arrows',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '5 feet',
		components: ['V', 'S', 'M'],
		duration: '8 hours',
		description:
			'You plant four pieces of nonmagical ammunition – arrows or crossbow bolts – in the ground within range and lay magic upon them to protect an area. Until the spell ends, whenever a creature other than you comes within 30 feet of the ammunition for the first time on a turn or ends its turn there, one piece of ammunition flies up to strike it. The creature must succeed on a Dexterity saving throw or take 1d6 piercing damage. The piece of ammunition is then destroyed. The spell ends when no ammunition remains.\nWhen you cast this spell, you can designate any creatures you choose, and the spell ignores them. ',
		classes: ['Ranger'],
		tags: ['SpellSave', 'AreaOfEffect']
	},
	{
		name: 'Crown of Madness',
		level: 2,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 minute',
		description:
			'One humanoid of your choice that you can see within range must succeed on a Wisdom saving throw or become charmed by you for the duration.\nWhile the target is charmed in this way, a twisted crown of jagged iron appears on its head, and a madness glows in its eyes.\nThe charmed target must use its action before moving on each of its turns to make a melee attack against a creature other than itself that you mentally choose. The target can act normally on its turn if you choose no creature or if none are within its reach.\nOn your subsequent turns, you must use your action to maintain control over the target, or the spell ends. Also, the target can make a Wisdom saving throw at the end of each of its turns. On a success, the spell ends.',
		classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Darkness',
		level: 2,
		school: 'Evocation',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'M'],
		duration: 'Concentration, up to 10 minutes',
		description:
			"Magical darkness spreads from a point you choose within range to fill a 15-foot-radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can't see through this darkness, and nonmagical light can't illuminate it.\nIf the point you choose is on an object you are holding or one that isn't being worn or carried, the darkness emanates from the object and moves with it. Completely covering the source of the darkness with an opaque object, such as a bowl or a helm, blocks the darkness.\nIf any of this spell's area overlaps with an area of light created by a spell of 2nd level or lower, the spell that created the light is dispelled.",
		classes: ['Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['AreaOfEffect', 'Debuff', 'Utility']
	},
	{
		name: 'Darkvision',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: '8 hours',
		description:
			'You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has darkvision out to a range of 60 feet.',
		classes: ['Druid', 'Ranger', 'Sorcerer', 'Wizard'],
		tags: ['Buff', 'Utility'],
		isRareUse: true
	},
	{
		name: 'Detect Thoughts',
		level: 2,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'For the duration, you can read the thoughts of certain creatures. When you cast the spell and as your action on each turn until the spell ends, you can focus your mind on any one creature that you can see within 30 feet of you. If the creature you choose has an Intelligence of 3 or lower or doesn’t speak any language, the creature is unaffected.\nYou initially learn the surface thoughts of the creature—what is most on its mind in that moment. As an action, you can either shift your attention to another creature’s thoughts or attempt to probe deeper into the same creature’s mind. If you probe deeper, the target must make a Wisdom saving throw. If it fails, you gain insight into its reasoning (if any), its emotional state, and something that looms large in its mind (such as something it worries over, loves, or hates). If it succeeds, the spell ends. Either way, the target knows that you are probing into its mind, and unless you shift your attention to another creature’s thoughts, the creature can use its action on its turn to make an Intelligence check contested by your Intelligence check; if it succeeds, the spell ends.\nQuestions verbally directed at the target creature naturally shape the course of its thoughts, so this spell is particularly effective as part of an interrogation.\nYou can also use this spell to detect the presence of thinking creatures you can’t see. When you cast the spell or as your action during the duration, you can search for thoughts within 30 feet of you. The spell can penetrate barriers, but 2 feet of rock, 2 inches of any metal other than lead, or a thin sheet of lead blocks you. You can’t detect a creature with an Intelligence of 3 or lower or one that doesn’t speak any language.\nOnce you detect the presence of a creature in this way, you can read its thoughts for the rest of the duration as described above, even if you can’t see it, but it must still be within range.',
		classes: ['Bard', 'Sorcerer', 'Wizard'],
		tags: ['SpellSave', 'Utility', 'Debuff']
	},
	{
		name: 'Enhance Ability',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 hour',
		description:
			"You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains that effect until the spell ends.\nBear's Endurance. The target has advantage on Constitution checks. It also gains 2d6 temporary hit points, which are lost when the spell ends.\nBull's Strength. The target has advantage on Strength checks, and his or her carrying capacity doubles.\nCat's Grace. The target has advantage on Dexterity checks. It also doesn't take damage from falling 20 feet or less if it isn't incapacitated.\nEagle's Splendor. The target has advantage on Charisma checks.\nFox's Cunning. The target has advantage on Intelligence checks.\nOwl's Wisdom. The target has advantage on Wisdom checks.",
		classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer'],
		tags: ['Buff']
	},
	{
		name: 'Enlarge/Reduce',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			"You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect.\nIf the target is a creature, everything it is wearing and carrying changes size with it. Any item dropped by an affected creature returns to normal size at once.\nEnlarge. The target's size doubles in all dimensions, and its weight is multiplied by eight. This growth increases its size by one category-- from Medium to Large, for example. If there isn't enough room for the target to double its size, the creature or object attains the maximum possible size in the space available. Until the spell ends, the target also has advantage on Strength checks and Strength saving throws. The target's weapons also grow to match its new size. While these weapons are enlarged, the target's attacks with them deal 1d4 extra damage.\nReduce. The target's size is halved in all dimensions, and its weight is reduced to one-eighth of normal. This reduction decreases its size by one category--from Medium to Small, for example. Until the spell ends, the target also has disadvantage on Strength checks and Strength saving throws. The target's weapons also shrink to match its new size. While these weapons are reduced, the target's attacks with them deal 1d4 less damage (this can't reduce the damage below 1).",
		classes: ['Sorcerer', 'Wizard'],
		tags: ['Buff', 'SpellSave', 'Debuff']
	},
	{
		name: 'Enthrall',
		level: 2,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 minute',
		description:
			"You weave a distracting string of words, causing creatures of your choice that you can see within range and that can hear you to make a Wisdom saving throw. Any creature that can't be charmed succeeds on this saving throw automatically, and if you or your companions are fighting a creature, it has advantage on the save. On a failed save, the target has disadvantage on Wisdom (Perception) checks made to perceive any creature other than you until the spell ends or until the target can no longer hear you. The spell ends if you are incapacitated or can no longer speak.",
		classes: ['Bard', 'Warlock'],
		tags: ['SpellSave', 'Debuff'],
		isRareUse: true
	},
	{
		name: 'Find Steed',
		level: 2,
		school: 'Conjuration',
		castingTime: '10 minutes',
		range: '30 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			"You summon a spirit that assumes the form of an unusually intelligent, strong, and loyal steed, creating a long-lasting bond with it. Appearing in an unoccupied space within range, the steed takes on a form that you choose: a warhorse, a pony, a camel, an elk, or a mastiff. (Your GM might allow other animals to be summoned as steeds.) The steed has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of its normal type. Additionally, if your steed has an Intelligence of 5 or less, its Intelligence becomes 6, and it gains the ability to understand one language of your choice that you speak.\nYour steed serves you as a mount, both in combat and out, and you have an instinctive bond with it that allows you to fight as a seamless unit. While mounted on your steed, you can make any spell you cast that targets only you also target your steed.\nWhen the steed drops to 0 hit points, it disappears, leaving behind no physical form. You can also dismiss your steed at any time as an action, causing it to disappear. In either case, casting this spell again summons the same steed, restored to its hit point maximum.\nWhile your steed is within 1 mile of you, you can communicate with each other telepathically.\nYou can't have more than one steed bonded by this spell at a time. As an action, you can release the steed from its bond at any time, causing it to disappear.",
		classes: ['Paladin'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Find Traps',
		level: 2,
		school: 'Divination',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S'],
		duration: 'Concentration, up to 10 minutes',
		description:
			"You sense the presence of any trap within range that is within line of sight. A trap, for the purpose of this spell, includes anything that would inflict a sudden or unexpected effect you consider harmful or undesirable, which was specifically intended as such by its creator. Thus, the spell would sense an area affected by the alarm spell, a glyph of warding, or a mechanical pit trap, but it would not reveal a natural weakness in the floor, an unstable ceiling, or a hidden sinkhole.\nThis spell merely reveals that a trap is present. You don't learn the location of each trap, but you do learn the general nature of the danger posed by a trap you sense.",
		classes: ['Cleric', 'Druid', 'Ranger'],
		tags: ['Utility']
	},
	{
		name: 'Flame Blade',
		level: 2,
		school: 'Evocation',
		castingTime: '1 bonus action',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 10 minutes',
		description:
			'You evoke a fiery blade in your free hand. The blade is similar in size and shape to a scimitar, and it lasts for the duration. If you let go of the blade, it disappears, but you can evoke the blade again as a bonus action.\nYou can use your action to make a melee spell attack with the fiery blade. On a hit, the target takes 3d6 fire damage.\nThe flaming blade sheds bright light in a 10-foot radius and dim light for an additional 10 feet.',
		classes: ['Druid'],
		tags: ['SpellAttack']
	},
	{
		name: 'Flaming Sphere',
		level: 2,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			"A 5-foot-diameter sphere of fire appears in an unoccupied space of your choice within range and lasts for the duration. Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw. The creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.\nAs a bonus action, you can move the sphere up to 30 feet. If you ram the sphere into a creature, that creature must make the saving throw against the sphere's damage, and the sphere stops moving this turn.\nWhen you move the sphere, you can direct it over barriers up to 5 feet tall and jump it across pits up to 10 feet wide. The sphere ignites flammable objects not being worn or carried, and it sheds bright light in a 20-foot radius and dim light for an additional 20 feet.",
		classes: ['Druid', 'Wizard'],
		tags: ['SpellSave']
	},
	{
		name: 'Gentle Repose',
		level: 2,
		school: 'Necromancy',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: '10 days',
		description:
			"You touch a corpse or other remains. For the duration, the target is protected from decay and can't become undead.\nThe spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don't count against the time limit of spells such as raise dead.",
		classes: ['Cleric'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Gust of Wind',
		level: 2,
		school: 'Evocation',
		castingTime: '1 action',
		range: 'Self (60-foot line)',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			"A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the spell's duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line.\nAny creature in the line must spend 2 feet of movement for every 1 foot it moves when moving closer to you.\nThe gust disperses gas or vapor, and it extinguishes candles, torches, and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them.\nAs a bonus action on each of your turns before the spell ends, you can change the direction in which the line blasts from you.",
		classes: ['Druid', 'Sorcerer', 'Wizard'],
		tags: ['SpellSave', 'AreaOfEffect']
	},
	{
		name: 'Heat Metal',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'Choose a manufactured metal object, such as a metal weapon or a suit of heavy or medium metal armor, that you can see within range. You cause the object to glow red-hot. Any creature in physical contact with the object takes 2d8 fire damage when you cast the spell. Until the spell ends, you can use a bonus action on each of your subsequent turns to cause this damage again.\nIf a creature is holding or wearing the object and takes the damage from it, the creature must succeed on a Constitution saving throw or drop the object if it can. If it doesn’t drop the object, it has disadvantage on attack rolls and ability checks until the start of your next turn.',
		classes: ['Bard', 'Druid'],
		tags: ['SpellSave']
	},
	{
		name: 'Hold Person',
		level: 2,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.',
		classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['SpellSave','Debuff']
	},
	{
		name: 'Invisibility',
		level: 2,
		school: 'Illusion',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 hour',
		description:
			"A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person. The spell ends for a target that attacks or casts a spell.",
		classes: ['Bard', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Buff', 'Utility']
	},
	{
		name: 'Knock',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V'],
		duration: 'Instantaneous',
		description:
			'Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access.\nA target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked.\nIf you choose a target that is held shut with arcane lock, that spell is suppressed for 10 minutes, during which time the target can be opened and shut normally.\nWhen you cast the spell, a loud knock, audible from as far away as 300 feet, emanates from the target object.',
		classes: ['Bard', 'Sorcerer', 'Wizard'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Lesser Restoration',
		level: 2,
		school: 'Abjuration',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.',
		classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Levitate',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 10 minutes',
		description:
			"One creature or loose object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected.\nThe target can move only by pushing or pulling against a fixed object or surface within reach (such as a wall or a ceiling), which allows it to move as if it were climbing. You can change the target's altitude by up to 20 feet in either direction on your turn. If you are the target, you can move up or down as part of your move. Otherwise, you can use your action to move the target, which must remain within the spell's range.\nWhen the spell ends, the target floats gently to the ground if it is still aloft.",
		classes: ['Sorcerer', 'Wizard'],
		tags: ['SpellSave', 'Debuff', 'Utility']
	},
	{
		name: 'Locate Animals or Plants',
		level: 2,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 10 minutes',
		description:
			'Describe or name a specific kind of beast or plant. Concentrating on the voice of nature in your surroundings, you learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present.',
		classes: ['Bard', 'Druid', 'Ranger'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Locate Object',
		level: 2,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 10 minutes',
		description:
			"Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement.\nThe spell can locate a specific object known to you, as long as you have seen it up close--within 30 feet--at least once. Alternatively, the spell can locate the nearest object of a particular kind, such as a certain kind of apparel, jewelry, furniture, tool, or weapon.\nThis spell can't locate an object if any thickness of lead, even a thin sheet, blocks a direct path between you and the object.",
		classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Wizard'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Magic Mouth',
		level: 2,
		school: 'Illusion',
		castingTime: '1 minute',
		range: '30 feet',
		components: ['V', 'S', 'M'],
		duration: 'Until dispelled',
		description:
			"You implant a message within an object in range, a message that is uttered when a trigger condition is met. Choose an object that you can see and that isn't being worn or carried by another creature. Then speak the message, which must be 25 words or less, though it can be delivered over as long as 10 minutes. Finally, determine the circumstance that will trigger the spell to deliver your message.\nWhen that circumstance occurs, a magical mouth appears on the object and recites the message in your voice and at the same volume you spoke. If the object you chose has a mouth or something that looks like a mouth (for example, the mouth of a statue), the magical mouth appears there so that the words appear to come from the object's mouth. When you cast this spell, you can have the spell end after it delivers its message, or it can remain and repeat its message whenever the trigger occurs.\nThe triggering circumstance can be as general or as detailed as you like, though it must be based on visual or audible conditions that occur within 30 feet of the object. For example, you could instruct the mouth to speak when any creature moves within 30 feet of the object or when a silver bell rings within 30 feet of it.",
		classes: ['Bard', 'Wizard'],
		ritual: true,
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Magic Weapon',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 bonus action',
		range: 'Touch',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 hour',
		description:
			'You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls.',
		classes: ['Paladin', 'Wizard'],
		tags: ['Buff'],
		isRareUse: true
	},
	{
		name: 'Melf’s Acid Arrow',
		level: 2,
		school: 'Evocation',
		castingTime: '1 action',
		range: '90 feet',
		components: ['V', 'S', 'M'],
		duration: 'Instantaneous',
		description:
			'A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.',
		classes: ['Druid', 'Wizard'],
		tags: ['SpellAttack']
	},
	{
		name: 'Mirror Image',
		level: 2,
		school: 'Illusion',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S'],
		duration: '1 minute',
		description:
			"Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real. You can use your action to dismiss the illusory duplicates.\nEach time a creature targets you with an attack during the spell's duration, roll a d20 to determine whether the attack instead targets one of your duplicates.\nIf you have three duplicates, you must roll a 6 or higher to change the attack's target to a duplicate. With two duplicates, you must roll an 8 or higher. With one duplicate, you must roll an 11 or higher.\nA duplicate's AC equals 10 + your Dexterity modifier. If an attack hits a duplicate, the duplicate is destroyed. A duplicate can be destroyed only by an attack that hits it. It ignores all other damage and effects. The spell ends when all three duplicates are destroyed.\nA creature is unaffected by this spell if it can't see, if it relies on senses other than sight, such as blindsight, or if it can perceive illusions as false, as with truesight.",
		classes: ['Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Buff']
	},
	{
		name: 'Misty Step',
		level: 2,
		school: 'Conjuration',
		castingTime: '1 bonus action',
		range: 'Self',
		components: ['V'],
		duration: 'Instantaneous',
		description:
			'Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.',
		classes: ['Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Utility']
	},
	{
		name: 'Moonbeam',
		level: 2,
		school: 'Evocation',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder.\nWhen a creature enters the spell’s area for the first time on a turn or starts its turn there, it is engulfed in ghostly flames that cause searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one.\nA shapechanger makes its saving throw with disadvantage. If it fails, it also instantly reverts to its original form and can’t assume a different form until it leaves the spell’s light.\nOn each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.',
		classes: ['Druid'],
		tags: ['SpellSave', 'HalfOnSave', 'AreaOfEffect']
	},
	{
		name: 'Nystul’s Magic Aura',
		level: 2,
		school: 'Illusion',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: '24 hours',
		description:
			'You place an illusion on a creature or an object you touch so that divination spells reveal false information about it. The target can be a willing creature or an object that isn’t being carried or worn by another creature.\nWhen you cast the spell, choose one or both of the following effects. The effect lasts for the duration. If you cast this spell on the same creature or object every day for 30 days, placing the same effect on it each time, the illusion lasts until it is dispelled.\nFalse Aura. You change the way the target appears to spells and magical effects, such as detect magic, that detect magical auras. You can make a nonmagical object appear magical, a magical object appear nonmagical, or change the object’s magical aura so that it appears to belong to a specific school of magic that you choose. When you use this effect on an object, you can make the false magic apparent to any creature that handles the item.\nMask. You change the way the target appears to spells and magical effects that detect creature types, such as a paladin’s Divine Sense or the trigger of a symbol spell. You choose a creature type and other spells and magical effects treat the target as if it were a creature of that type or of that alignment.',
		classes: ['Wizard'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Pass without Trace',
		level: 2,
		school: 'Abjuration',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 hour',
		description:
			"A veil of shadows and silence radiates from you, masking you and your companions from detection. For the duration, each creature you choose within 30 feet of you (including you) has a +10 bonus to Dexterity (Stealth) checks and can't be tracked except by magical means. A creature that receives this bonus leaves behind no tracks or other traces of its passage.",
		classes: ['Druid', 'Ranger'],
		tags: ['Buff', 'Utility']
	},
	{
		name: 'Phantasmal Force',
		level: 2,
		school: 'Illusion',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 minute',
		description:
			'You craft an illusion that takes root in the mind of a creature that you can see within range. The target must make an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other visible phenomenon of your choice that is no larger than a 10-foot cube and that is perceivable only to the target for the duration. This spell has no effect on undead or constructs.\nThe phantasm includes sound, temperature, and other stimuli, also evident only to the creature.\nThe target can use its action to examine the phantasm with an Intelligence (Investigation) check against your spell save DC. If the check succeeds, the target realizes that the phantasm is an illusion, and the spell ends.\nWhile a target is affected by the spell, the target treats the phantasm as if it were real. The target rationalizes any illogical outcomes from interacting with the phantasm. For example, a target attempting to walk across a phantasmal bridge that spans a chasm falls once it steps onto the bridge. If the target survives the fall, it still believes that the bridge exists and comes up with some other explanation for its fall - it was pushed, it slipped, or a strong wind might have knocked it off.\nAn affected target is so convinced of the phantasm’s reality that it can even take damage from the illusion. A phantasm created to appear as a creature can attack the target. Similarly, a phantasm created to appear as fire, a pool of acid, or lava can burn the target. Each round on your turn, the phantasm can deal 1d6 psychic damage to the target if it is in the phantasm’s area or within 5 feet of the phantasm, provided that the illusion is of a creature or hazard that could logically deal damage, such as by attacking. The target perceives the damage as a type appropriate to the illusion.',
		classes: ['Bard', 'Sorcerer', 'Wizard'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Prayer of Healing',
		level: 2,
		school: 'Evocation',
		castingTime: '10 minutes',
		range: '30 feet',
		components: ['V'],
		duration: 'Instantaneous',
		description:
			'Up to six creatures of your choice that you can see within range each regain hit points equal to 2d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.',
		classes: ['Cleric'],
		tags: ['Buff'],
		isRareUse: true
	},
	{
		name: 'Protection from Poison',
		level: 2,
		school: 'Abjuration',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 hour',
		description:
			'You touch a creature. If it is poisoned, you neutralize the poison. If more than one poison afflicts the target, you neutralize one poison that you know is present, or you neutralize one at random.\nFor the duration, the target has advantage on saving throws against being poisoned, and it has resistance to poison damage.',
		classes: ['Cleric', 'Druid', 'Paladin', 'Ranger'],
		tags: ['Buff', 'Utility'],
		isRareUse: true
	},
	{
		name: 'Ray of Enfeeblement',
		level: 2,
		school: 'Necromancy',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S'],
		duration: 'Concentration, up to 1 minute',
		description:
			"A black beam of enervating energy springs from your finger toward a creature within range. Make a ranged spell attack against the target. On a hit, the target deals only half damage with weapon attacks that use Strength until the spell ends.\nAt the end of each of the target's turns, it can make a Constitution saving throw against the spell. On a success, the spell ends.",
		classes: ['Warlock', 'Wizard'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Rope Trick',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: '1 hour',
		description:
			"You touch a length of rope that is up to 60 feet long. One end of the rope then rises into the air until the whole rope hangs perpendicular to the ground. At the upper end of the rope, an invisible entrance opens to an extradimensional space that lasts until the spell ends.\nThe extradimensional space can be reached by climbing to the top of the rope. The space can hold as many as eight Medium or smaller creatures. The rope can be pulled into the space, making the rope disappear from view outside the space.\nAttacks and spells can't cross through the entrance into or out of the extradimensional space, but those inside can see out of it as if through a 3-foot-by-5- foot window centered on the rope.\nAnything inside the extradimensional space drops out when the spell ends.",
		classes: ['Wizard'],
		tags: ['Utility']
	},
	{
		name: 'Scorching Ray',
		level: 2,
		school: 'Evocation',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S'],
		duration: 'Instantaneous',
		description:
			'You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several.\nMake a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.',
		classes: ['Sorcerer', 'Wizard'],
		tags: ['SpellAttack']
	},
	{
		name: 'See Invisibility',
		level: 2,
		school: 'Divination',
		castingTime: '1 action',
		range: 'Self',
		components: ['V', 'S', 'M'],
		duration: '1 hour',
		description:
			'For the duration, you see invisible creatures and objects as if they were visible, and you can see into the Ethereal Plane. Ethereal creatures and objects appear ghostly and translucent.',
		classes: ['Bard', 'Sorcerer', 'Wizard'],
		tags: ['Utility'],
		isRareUse: true
	},
	{
		name: 'Shatter',
		level: 2,
		school: 'Evocation',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: 'Instantaneous',
		description:
			"A sudden loud ringing noise, painfully intense, erupts from a point of your choice within range. Each creature in a 10-foot-radius sphere centered on that point must make a Constitution saving throw. A creature takes 3d8 thunder damage on a failed save, or half as much damage on a successful one. A creature made of inorganic material such as stone, crystal, or metal has disadvantage on this saving throw.\nA nonmagical object that isn't being worn or carried also takes the damage if it's in the spell's area.",
		classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['SpellSave', 'HalfOnSave', 'AreaOfEffect']
	},
	{
		name: 'Silence',
		level: 2,
		school: 'Illusion',
		castingTime: '1 action',
		range: '120 feet',
		components: ['V', 'S'],
		duration: 'Concentration, up to 10 minutes',
		description:
			'For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there.',
		classes: ['Bard', 'Cleric', 'Druid', 'Ranger'],
		ritual: true,
		tags: ['Utility', 'Debuff']
	},
	{
		name: 'Spider Climb',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 hour',
		description:
			'Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a climbing speed equal to its walking speed.',
		classes: ['Druid', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['Buff', 'Utility'],
		isRareUse: true
	},
	{
		name: 'Spike Growth',
		level: 2,
		school: 'Transmutation',
		castingTime: '1 action',
		range: '150 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 10 minutes',
		description:
			"The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels.\nThe transformation of the ground is camouflaged to look natural. Any creature that can't see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it.",
		classes: ['Druid', 'Ranger'],
		tags: ['AreaOfEffect']
	},
	{
		name: 'Spiritual Weapon',
		level: 2,
		school: 'Evocation',
		castingTime: '1 bonus action',
		range: '60 feet',
		components: ['V', 'S'],
		duration: '1 minute',
		description:
			"You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier.\nAs a bonus action on your turn, you can move the weapon up to 20 feet and repeat the attack against a creature within 5 feet of it.\nThe weapon can take whatever form you choose. Clerics of deities who are associated with a particular weapon (as St. Cuthbert is known for his mace and Thor for his hammer) make this spell's effect resemble that weapon.",
		classes: ['Cleric'],
		tags: ['SpellAttack']
	},
	{
		name: 'Suggestion',
		level: 2,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '30 feet',
		components: ['V', 'M'],
		duration: 'Concentration, up to 8 hours',
		description:
			"You suggest a course of activity (limited to a sentence or two) and magically influence a creature you can see within range that can hear and understand you. Creatures that can't be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of action sound reasonable. Asking the creature to stab itself, throw itself onto a spear, immolate itself, or do some other obviously harmful act ends the spell.\nThe target must make a Wisdom saving throw. On a failed save, it pursues the course of action you described to the best of its ability. The suggested course of action can continue for the entire duration. If the suggested activity can be completed in a shorter time, the spell ends when the subject finishes what it was asked to do.\nYou can also specify conditions that will trigger a special activity during the duration. For example, you might suggest that a knight give her warhorse to the first beggar she meets. If the condition isn't met before the spell expires, the activity isn't performed.\nIf you or any of your companions damage the target, the spell ends.",
		classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
		tags: ['SpellSave', 'Debuff']
	},
	{
		name: 'Warding Bond',
		level: 2,
		school: 'Abjuration',
		castingTime: '1 action',
		range: 'Touch',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 hour',
		description:
			'This spell wards a willing creature you touch and creates a mystic connection between you and the target until the spell ends. While the target is within 60 feet of you, it gains a +1 bonus to AC and saving throws, and it has resistance to all damage. Also, each time it takes damage, you take the same amount of damage.\nThe spell ends if you drop to 0 hit points or if you and the target become separated by more than 60 feet. It also ends if the spell is cast again on either of the connected creatures. You can also dismiss the spell as an action.',
		classes: ['Cleric'],
		tags: ['Buff']
	},
	{
		name: 'Web',
		level: 2,
		school: 'Conjuration',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S', 'M'],
		duration: 'Concentration, up to 1 hour',
		description:
			"You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area.\nIf the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the conjured web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet.\nEach creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free.\nA creature restrained by the webs can use its action to make a Strength check against your spell save DC. If it succeeds, it is no longer restrained.\nThe webs are flammable. Any 5-foot cube of webs exposed to fire burns away in 1 round, dealing 2d4 fire damage to any creature that starts its turn in the fire.",
		classes: ['Druid', 'Sorcerer', 'Wizard'],
		tags: ['SpellSave', 'AreaOfEffect', 'Debuff']
	},
	{
		name: 'Zone of Truth',
		level: 2,
		school: 'Enchantment',
		castingTime: '1 action',
		range: '60 feet',
		components: ['V', 'S'],
		duration: '10 minutes',
		description:
			"You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell's area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius. You know whether each creature succeeds or fails on its saving throw.\nAn affected creature is aware of the spell and can thus avoid answering questions to which it would normally respond with a lie. Such a creature can be evasive in its answers as long as it remains within the boundaries of the truth.",
		classes: ['Bard', 'Cleric', 'Paladin'],
		tags: ['SpellSave', 'AreaOfEffect', 'Debuff']
	}
];

export const spells: Spell[] = [...cantrips, ...firstLevel, ...secondLevel];

// Define spell access by race, class, and subclass
export const spellAccess: SpellAccess[] = [
	// Race-based spell access
	{
		source: 'race',
		sourceName: 'Forest Gnome',
		spells: [],
		cantrips: ['Minor Illusion'],
		chooseable: false
	},
	{
		source: 'race',
		sourceName: 'High Elf',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Wizard'],
		chooseCantripCount: 1, // Bonus wizard cantrip - doesn't count against class limits
		chooseSpellCount: 0 // No bonus spells
	},
	{
		source: 'race',
		sourceName: 'Tiefling',
		spells: ['Hellish Rebuke'],
		cantrips: ['Thaumaturgy'],
		chooseable: false
	},
	{
		source: 'race',
		sourceName: 'Dark Elf',
		spells: ['Faerie Fire'], // Darkness is only available at 5th level, not 3rd
		cantrips: ['Dancing Lights'],
		chooseable: false // Drow Magic racial feature - auto-granted spells
	},

	// Full caster classes
	{
		source: 'class',
		sourceName: 'Wizard',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Wizard'],
		chooseCantripCount: 3, // 3 cantrips known at level 3
		chooseSpellCount: 6 // 6 spells known at level 3 (from spellbook)
	},
	{
		source: 'class',
		sourceName: 'Sorcerer',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Sorcerer'],
		chooseCantripCount: 4, // 4 cantrips known at level 3
		chooseSpellCount: 4 // 4 spells known at level 3
	},
	{
		source: 'class',
		sourceName: 'Bard',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Bard'],
		chooseCantripCount: 2, // 2 cantrips known at level 3
		chooseSpellCount: 6 // 6 spells known at level 3
	},
	{
		source: 'class',
		sourceName: 'Cleric',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Cleric'],
		chooseCantripCount: 3, // 3 cantrips known at level 3
		chooseSpellCount: 6 // Typical prepared spells for level 3 (WIS mod 3 + level 3)
	},
	{
		source: 'class',
		sourceName: 'Druid',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Druid'],
		chooseCantripCount: 2, // 2 cantrips known at level 3
		chooseSpellCount: 6 // Placeholder - dynamically calculated as WIS modifier + level (3) in getSpellAccessForCharacter
	},
	{
		source: 'class',
		sourceName: 'Warlock',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Warlock'],
		chooseCantripCount: 2, // 2 cantrips known at level 3
		chooseSpellCount: 4 // 4 spells known at level 3
	},

	// Half-caster classes
	{
		source: 'class',
		sourceName: 'Paladin',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Paladin'],
		chooseCantripCount: 0, // Paladins get no cantrips
		chooseSpellCount: 4, // Typical prepared spells for level 3 (CHA mod 3 + half level 1)
		maxSpellLevel: 1 // 3rd level Paladins only have access to 1st level spells
	},
	{
		source: 'class',
		sourceName: 'Ranger',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Ranger'],
		chooseCantripCount: 0, // Rangers get no cantrips
		chooseSpellCount: 3 // 3 spells known at level 3
	},

	// Subclass-based spell access for non-casters
	// Eldritch Knight - Tab 1: Cantrips (2 chooseable)
	{
		source: 'subclass',
		sourceName: 'Eldritch Knight - Cantrips',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Wizard'],
		chooseCantripCount: 2, // 2 wizard cantrips
		chooseSpellCount: 0,
		maxSpellLevel: 0 // Only cantrips for this entry
	},
	// Eldritch Knight - Tab 2: 1st Level Abjuration/Evocation (2 restricted spells)
	{
		source: 'subclass',
		sourceName: 'Eldritch Knight - 1st Level (Abjuration/Evocation)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Wizard'],
		chooseCantripCount: 0,
		chooseSpellCount: 2, // 2 wizard spells from Abjuration or Evocation schools
		maxSpellLevel: 1,
		restrictToSchools: ['Abjuration', 'Evocation'] // School restriction
	},
	// Eldritch Knight - Tab 3: 1st Level Any School (1 unrestricted spell)
	{
		source: 'subclass',
		sourceName: 'Eldritch Knight - 1st Level (Any School)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Wizard'],
		chooseCantripCount: 0,
		chooseSpellCount: 1, // 1 wizard spell from any school
		maxSpellLevel: 1
	},
	// Arcane Trickster - Tab 1: Cantrips (Mage Hand auto-granted + 2 chooseable)
	{
		source: 'subclass',
		sourceName: 'Arcane Trickster - Cantrips',
		spells: [],
		cantrips: ['Mage Hand'],
		chooseable: false // Mage Hand is automatically granted
	},
	{
		source: 'subclass',
		sourceName: 'Arcane Trickster - Cantrips',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Wizard'],
		chooseCantripCount: 2, // 2 additional wizard cantrips
		chooseSpellCount: 0,
		maxSpellLevel: 0 // Only cantrips for this entry
	},
	// Arcane Trickster - Tab 2: 1st Level Enchantment/Illusion (2 restricted spells)
	{
		source: 'subclass',
		sourceName: 'Arcane Trickster - 1st Level (Enchantment/Illusion)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Wizard'],
		chooseCantripCount: 0,
		chooseSpellCount: 2, // 2 wizard spells from Enchantment or Illusion schools
		maxSpellLevel: 1,
		restrictToSchools: ['Enchantment', 'Illusion'] // School restriction
	},
	// Arcane Trickster - Tab 3: 1st Level Any School (1 unrestricted spell as a bonus)
	{
		source: 'subclass',
		sourceName: 'Arcane Trickster - 1st Level (Any School)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Wizard'],
		chooseCantripCount: 0,
		chooseSpellCount: 1, // 1 wizard spell from any school
		maxSpellLevel: 1
	},
	{
		source: 'subclass',
		sourceName: 'Totem Warrior',
		spells: ['Beast Sense', 'Speak with Animals'],
		cantrips: [],
		chooseable: false // Auto-granted ritual spells from Spirit Seeker feature
	},
	{
		source: 'subclass',
		sourceName: 'Way of Shadow',
		spells: ['Darkness', 'Darkvision', 'Pass without Trace', 'Silence'],
		cantrips: ['Minor Illusion'], // Shadow Arts also grants minor illusion as a cantrip
		chooseable: false // Ki-based spells from Shadow Arts feature
	},

	// Cleric Domain spells (always prepared, don't count against limits)
	{
		source: 'subclass',
		sourceName: 'Life Domain',
		spells: ['Bless', 'Cure Wounds', 'Lesser Restoration', 'Spiritual Weapon'], // 1st and 2nd level domain spells
		cantrips: [],
		chooseable: false // Domain spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Light Domain',
		spells: ['Burning Hands', 'Faerie Fire', 'Flaming Sphere', 'Scorching Ray'], // 1st and 2nd level domain spells
		cantrips: [],
		chooseable: false // Domain spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Trickery Domain',
		spells: ['Charm Person', 'Disguise Self', 'Mirror Image', 'Pass without Trace'], // 1st and 2nd level domain spells
		cantrips: [],
		chooseable: false // Domain spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Knowledge Domain',
		spells: ['Command', 'Identify', 'Augury', 'Suggestion'], // 1st and 2nd level domain spells
		cantrips: [],
		chooseable: false // Domain spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Nature Domain',
		spells: ['Animal Friendship', 'Speak with Animals', 'Barkskin', 'Spike Growth'], // 1st and 2nd level domain spells
		cantrips: [],
		chooseable: false // Domain spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Nature Domain - Druid Cantrip',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Druid'],
		chooseCantripCount: 1, // Bonus druid cantrip from Acolyte of Nature
		maxSpellLevel: 0 // Only cantrips allowed
	},
	{
		source: 'subclass',
		sourceName: 'Tempest Domain',
		spells: ['Fog Cloud', 'Thunderwave', 'Gust of Wind', 'Shatter'], // 1st and 2nd level domain spells
		cantrips: [],
		chooseable: false // Domain spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'War Domain',
		spells: ['Divine Favor', 'Shield of Faith', 'Magic Weapon', 'Spiritual Weapon'], // 1st and 2nd level domain spells
		cantrips: [],
		chooseable: false // Domain spells are always prepared
	},

	// Druid Circle spells (always prepared, don't count against limits)
	// Note: Circle of the Moon doesn't grant spells, only improves Wild Shape
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Arctic)',
		spells: ['Hold Person', 'Spike Growth'], // 2nd level Arctic circle spells
		cantrips: [],
		chooseable: false // Circle spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Coast)',
		spells: ['Mirror Image', 'Misty Step'], // 2nd level Coast circle spells
		cantrips: [],
		chooseable: false // Circle spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Desert)',
		spells: ['Blur', 'Silence'], // 2nd level Desert circle spells
		cantrips: [],
		chooseable: false // Circle spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Forest)',
		spells: ['Barkskin', 'Spider Climb'], // 2nd level Forest circle spells
		cantrips: [],
		chooseable: false // Circle spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Grassland)',
		spells: ['Invisibility', 'Pass without Trace'], // 2nd level Grassland circle spells
		cantrips: [],
		chooseable: false // Circle spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Mountain)',
		spells: ['Spider Climb', 'Spike Growth'], // 2nd level Mountain circle spells
		cantrips: [],
		chooseable: false // Circle spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Swamp)',
		spells: ['Darkness', "Melf's Acid Arrow"], // 2nd level Swamp circle spells
		cantrips: [],
		chooseable: false // Circle spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Underdark)',
		spells: ['Spider Climb', 'Web'], // 2nd level Underdark circle spells
		cantrips: [],
		chooseable: false // Circle spells are always prepared
	},

	// Circle of the Land Bonus Cantrips (chooseable)
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Arctic)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Druid'],
		chooseCantripCount: 1 // Bonus cantrip from Circle of the Land
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Coast)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Druid'],
		chooseCantripCount: 1 // Bonus cantrip from Circle of the Land
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Desert)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Druid'],
		chooseCantripCount: 1 // Bonus cantrip from Circle of the Land
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Forest)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Druid'],
		chooseCantripCount: 1 // Bonus cantrip from Circle of the Land
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Grassland)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Druid'],
		chooseCantripCount: 1 // Bonus cantrip from Circle of the Land
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Mountain)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Druid'],
		chooseCantripCount: 1 // Bonus cantrip from Circle of the Land
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Swamp)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Druid'],
		chooseCantripCount: 1 // Bonus cantrip from Circle of the Land
	},
	{
		source: 'subclass',
		sourceName: 'Circle of the Land (Underdark)',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Druid'],
		chooseCantripCount: 1 // Bonus cantrip from Circle of the Land
	},

	// Paladin Oath spells (always prepared, don't count against limits)
	{
		source: 'subclass',
		sourceName: 'Oath of Devotion',
		spells: ['Protection from Evil and Good', 'Sanctuary'], // 1st level oath spells only
		cantrips: [],
		chooseable: false // Oath spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Oath of Vengeance',
		spells: ['Bane', "Hunter's Mark"], // 1st level oath spells only
		cantrips: [],
		chooseable: false // Oath spells are always prepared
	},
	{
		source: 'subclass',
		sourceName: 'Oath of the Ancients',
		spells: ['Ensnaring Strike', 'Speak with Animals'], // 1st level oath spells only
		cantrips: [],
		chooseable: false // Oath spells are always prepared
	},

	// Monk Elemental Disciples (Way of Four Elements)
	{
		source: 'subclass',
		sourceName: 'Way of the Four Elements',
		spells: ['Burning Hands', 'Thunderwave'], // Example elemental disciplines that cast spells
		cantrips: [],
		chooseable: false // Ki-based elemental disciplines
	},

	// Warlock Patron Expanded Spell Lists
	// These add specific spells as options to the warlock spell list, not auto-granted
	// Note: We DON'T use chooseFrom because that would duplicate the entire warlock spell list
	// Instead, we just list the new spells that the patron adds as options
	{
		source: 'subclass',
		sourceName: 'The Fiend',
		spells: ['Burning Hands', 'Command', 'Blindness/Deafness', 'Scorching Ray'], // Fiend expanded spells
		cantrips: [],
		chooseable: true, // These are options, not auto-granted
		chooseCantripCount: 0,
		chooseSpellCount: 0 // Doesn't grant extra picks, just expands the spell pool
	},
	{
		source: 'subclass',
		sourceName: 'The Great Old One',
		spells: ['Dissonant Whispers', "Tasha's Hideous Laughter", 'Detect Thoughts', 'Phantasmal Force'], // GOO expanded spells
		cantrips: [],
		chooseable: true, // These are options, not auto-granted
		chooseCantripCount: 0,
		chooseSpellCount: 0 // Doesn't grant extra picks, just expands the spell pool
	},
	{
		source: 'subclass',
		sourceName: 'The Archfey',
		spells: ['Faerie Fire', 'Sleep', 'Calm Emotions', 'Phantasmal Force'], // Archfey expanded spells
		cantrips: [],
		chooseable: true, // These are options, not auto-granted
		chooseCantripCount: 0,
		chooseSpellCount: 0 // Doesn't grant extra picks, just expands the spell pool
	},

	// Warlock Pact of the Chain - Find Familiar
	{
		source: 'feature',
		sourceName: 'Pact of the Chain',
		spells: ['Find Familiar'],
		cantrips: [],
		chooseable: false // Automatically granted by Pact of the Chain
	},
	// Warlock Invocations that grant spells
	{
		source: 'feature',
		sourceName: 'Armor of Shadows',
		spells: ['Mage Armor'],
		cantrips: [],
		chooseable: false // Automatically granted by invocation choice
	},
	{
		source: 'feature',
		sourceName: 'Beast Speech',
		spells: ['Speak with Animals'],
		cantrips: [],
		chooseable: false // Automatically granted by invocation choice
	},
	{
		source: 'feature',
		sourceName: 'Eldritch Sight',
		spells: ['Detect Magic'],
		cantrips: [],
		chooseable: false // Automatically granted by invocation choice
	},
	{
		source: 'feature',
		sourceName: 'Fiendish Vigor',
		spells: ['False Life'],
		cantrips: [],
		chooseable: false // Automatically granted by invocation choice
	},
	{
		source: 'feature',
		sourceName: 'Mask of Many Faces',
		spells: ['Disguise Self'],
		cantrips: [],
		chooseable: false // Automatically granted by invocation choice
	},
	{
		source: 'feature',
		sourceName: 'Misty Visions',
		spells: ['Silent Image'],
		cantrips: [],
		chooseable: false // Automatically granted by invocation choice
	},
	{
		source: 'feature',
		sourceName: 'Thief of Five Fates',
		spells: ['Bane'],
		cantrips: [],
		chooseable: false // Automatically granted by invocation choice
	},

	// Warlock Pact of the Tome - Book of Shadows cantrips
	{
		source: 'feature',
		sourceName: 'Pact of the Tome',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'], // Any class cantrips
		chooseCantripCount: 3, // Book of Shadows grants 3 cantrips from any class
		chooseSpellCount: 0
	},
	// Warlock Invocation: Book of Ancient Secrets (requires Pact of the Tome)
	{
		source: 'feature',
		sourceName: 'Book of Ancient Secrets',
		spells: [],
		cantrips: [],
		chooseable: true,
		chooseFrom: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'], // Any class ritual spells
		chooseCantripCount: 0,
		chooseSpellCount: 2 // Choose 2 ritual spells
	},

	// Wizard School Features
	{
		source: 'subclass',
		sourceName: 'School of Illusion',
		spells: [],
		cantrips: ['Minor Illusion'], // Improved Minor Illusion feature
		chooseable: false // School feature enhancement
	}
];

// Helper functions
export function getSpellsByClass(className: string): Spell[] {
	return spells.filter((spell) => spell.classes.includes(className));
}

export function getSpellsByLevel(level: number, className?: string): Spell[] {
	let filteredSpells = spells.filter((spell) => spell.level === level);
	if (className) {
		filteredSpells = filteredSpells.filter((spell) => spell.classes.includes(className));
	}
	return filteredSpells;
}

// Calculate ability modifier from ability score
function getAbilityModifier(abilityScore: number): number {
	return Math.floor((abilityScore - 10) / 2);
}

export function getSpellAccessForCharacter(character: any): SpellAccess[] {
	const access: SpellAccess[] = [];

	// Check race-based access (both race and subrace)
	if (character.race) {
		const raceAccess = spellAccess.filter(
			(sa) =>
				sa.source === 'race' &&
				(sa.sourceName === character.race || sa.sourceName === character.subrace)
		);
		access.push(...raceAccess);
	}

	// Check class-based access
	if (character.class) {
		const classAccess = spellAccess.filter(
			(sa) => sa.source === 'class' && sa.sourceName === character.class
		);

		// Special handling for dynamic prepared spell counts
		const processedClassAccess = classAccess.map((access) => {
			if (access.sourceName === 'Paladin') {
				// Calculate dynamic spell count: CHA modifier + 1 (minimum 1)
				// If charisma is very low (1-7), it's likely just racial bonuses without a base score selected
				// In that case, assume +0 modifier (score of 10) for spell limits
				const rawCharisma = character.charisma || 10;
				const charismaScore = rawCharisma < 8 ? 10 : rawCharisma;
				const charismaModifier = getAbilityModifier(charismaScore);
				const preparedSpellCount = Math.max(1, charismaModifier + 1);

				return {
					...access,
					chooseSpellCount: preparedSpellCount
				};
			} else if (access.sourceName === 'Cleric') {
				// Calculate dynamic spell count: WIS modifier + 3 (minimum 1)
				// If wisdom is very low (1-7), it's likely just racial bonuses without a base score selected
				// In that case, assume +0 modifier (score of 10) for spell limits
				const rawWisdom = character.wisdom || 10;
				const wisdomScore = rawWisdom < 8 ? 10 : rawWisdom;
				const wisdomModifier = getAbilityModifier(wisdomScore);
				const preparedSpellCount = Math.max(1, wisdomModifier + 3);

				return {
					...access,
					chooseSpellCount: preparedSpellCount
				};
			} else if (access.sourceName === 'Druid') {
				// Calculate dynamic spell count: WIS modifier + 3 (minimum 1)
				// If wisdom is very low (1-7), it's likely just racial bonuses without a base score selected
				// In that case, assume +0 modifier (score of 10) for spell limits
				const rawWisdom = character.wisdom || 10;
				const wisdomScore = rawWisdom < 8 ? 10 : rawWisdom;
				const wisdomModifier = getAbilityModifier(wisdomScore);
				const preparedSpellCount = Math.max(1, wisdomModifier + 3);

				return {
					...access,
					chooseSpellCount: preparedSpellCount
				};
			}
			return access;
		});

		access.push(...processedClassAccess);
	}

	// Check subclass-based access
	if (character.subclass) {
		const subclassAccess = spellAccess.filter(
			(sa) =>
				sa.source === 'subclass' &&
				(sa.sourceName === character.subclass ||
					sa.sourceName.startsWith(character.subclass + ' - '))
		);
		access.push(...subclassAccess);
	}

	// Check feature-based access (for pact boons, invocations, etc.)
	if (character.features && Array.isArray(character.features)) {
		const featureAccess = spellAccess.filter(
			(sa) => sa.source === 'feature' && character.features.includes(sa.sourceName)
		);
		access.push(...featureAccess);
	}

	return access;
}
