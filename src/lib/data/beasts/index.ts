import type { Beast } from './types';
import { bat } from './bat';
import { black_bear } from './black_bear';
import { boar } from './boar';
import { brown_bear } from './brown_bear';
import { cat } from './cat';
import { crab } from './crab';
import { dire_wolf } from './dire_wolf';
import { frog } from './frog';
import { giant_spider } from './giant_spider';
import { hawk } from './hawk';
import { imp } from './imp';
import { lion } from './lion';
import { lizard } from './lizard';
import { mastiff } from './mastiff';
import { mule } from './mule';
import { owl } from './owl';
import { panther } from './panther';
import { poisonous_snake } from './poisonous_snake';
import { pseudodragon } from './pseudodragon';
import { quasit } from './quasit';
import { rat } from './rat';
import { raven } from './raven';
import { riding_horse } from './riding_horse';
import { spider } from './spider';
import { sprite } from './sprite';
import { tiger } from './tiger';
import { warhorse } from './warhorse';
import { weasel } from './weasel';
import { wolf } from './wolf';

export const beasts: Beast[] = [
	bat,
	black_bear,
	boar,
	brown_bear,
	cat,
	crab,
	dire_wolf,
	frog,
	giant_spider,
	hawk,
	imp,
	lion,
	lizard,
	mastiff,
	mule,
	owl,
	panther,
	poisonous_snake,
	pseudodragon,
	quasit,
	rat,
	raven,
	riding_horse,
	spider,
	sprite,
	tiger,
	warhorse,
	weasel,
	wolf
];

// Optional helpers
export const byCR = (cr: number) => beasts.filter(b => b.challenge_rating <= cr);
export const bySource = (source: string) => beasts.filter(b => b.sources.includes(source));
