// All 16 Player's Handbook backgrounds
import { acolyte } from './acolyte';
import { charlatan } from './charlatan';
import { criminal } from './criminal';
import { folkHero } from './folk_hero';
import { noble } from './noble';
import { soldier } from './soldier';

// Import remaining backgrounds
import { entertainer } from './entertainer';
import { guildArtisan } from './guild_artisan';
import { hermit } from './hermit';
import { outlander } from './outlander';
import { sage } from './sage';
import { sailor } from './sailor';
import { urchin } from './urchin';

// Variants
import { gladiator } from './gladiator'; // variant of Entertainer
// import { guildMerchant } from './guild_merchant'; // variant of Guild Artisan  
import { knight } from './knight'; // variant of Noble
import { pirate } from './pirate'; // variant of Sailor
// import { spy } from './spy'; // variant of Criminal

export const allBackgrounds = [
	acolyte,
	charlatan,
	criminal,
	entertainer,
	folkHero,
	gladiator,
	guildArtisan,
	hermit,
	knight,
	noble,
	outlander,
	pirate,
	sage,
	sailor,
	soldier,
	urchin,
	
	// Additional variants can be added later
	// guildMerchant,
	// spy
];

// Export alias for consistency
export const backgrounds = allBackgrounds;