<script lang="ts">
	import { get } from 'svelte/store';
	import { writable } from 'svelte/store';
	import ConflictWarning from '$lib/components/ConflictWarning.svelte';
	import { character_store, hasSpellAccess } from '$lib/stores/character_store';
	import { applyChoice } from '$lib/stores/character_store_helpers';
	import {
		spells,
		getSpellsByLevel,
		getSpellAccessForCharacter,
		type SpellAccess,
		type Spell,
		type SpellTag
	} from '$lib/data/spells';

	// Store for toggling rare use spell filtering
	const showRareUseSpells = writable(false);

	// Helper function to format spell level for display
	function getSpellLevelText(spell: any): string {
		if (spell.level === 0) {
			return `${spell.school} Cantrip`;
		} else {
			const levelText = spell.level === 1 ? '1st' : spell.level === 2 ? '2nd' : `${spell.level}th`;
			return `${levelText}-level ${spell.school}`;
		}
	}

	// Helper function to format components for display
	function formatComponents(components: string[]): string {
		return components.join(', ');
	}

	// Helper function to preserve line breaks in descriptions
	function formatDescription(description: string): string {
		return description.replace(/\n/g, '<br>');
	}

	// Get spells available to character based on their spell access
	function getAvailableSpells(spellLevel: number, character: any) {
		const spellAccess = getSpellAccessForCharacter(character);
		const availableSpells: Array<
			Spell & { source: string; sourceName: string; chooseable: boolean }
		> = [];

		// Get all spells of the requested level
		const levelSpells = getSpellsByLevel(spellLevel);

		spellAccess.forEach((access) => {
			if (access.chooseFrom && access.chooseFrom.length > 0) {
				// Check if this spell level is allowed by maxSpellLevel restriction
				if (access.maxSpellLevel !== undefined && spellLevel > access.maxSpellLevel) {
					return; // Skip this access if spell level exceeds maximum
				}
				
				// Check if this spell level is allowed by minSpellLevel restriction
				if (access.minSpellLevel !== undefined && spellLevel < access.minSpellLevel) {
					return; // Skip this access if spell level is below minimum
				}

				// This access allows choosing from specific class lists
				access.chooseFrom.forEach((className) => {
					let classSpells = levelSpells.filter((spell) => spell.classes.includes(className));
					
					// Apply school restriction if present
					if (access.restrictToSchools && access.restrictToSchools.length > 0) {
						classSpells = classSpells.filter((spell) => 
							access.restrictToSchools!.includes(spell.school)
						);
					}
					
					// Apply ritual restriction if present (for Book of Ancient Secrets)
					if (access.restrictToRituals) {
						classSpells = classSpells.filter((spell) => spell.ritual === true);
					}
					
					classSpells.forEach((spell) => {
						// Check for duplicates by both name and sourceName to allow same spell in different tabs
						// (e.g., Charm Person in both "Enchantment/Illusion" and "Any School" Arcane Trickster tabs)
						if (!availableSpells.find((s) => s.name === spell.name && s.sourceName === access.sourceName)) {
							availableSpells.push({
								...spell,
								source: access.source,
								sourceName: access.sourceName,
								chooseable: access.chooseable !== false
							});
						}
					});
				});
			}

			// Add specific spells granted by this access
			if (access.spells && spellLevel > 0) {
				access.spells.forEach((spellName) => {
					const spell = spells.find((s) => s.name === spellName && s.level === spellLevel);
					if (spell) {
						const existingSpell = availableSpells.find((s) => s.name === spell.name && s.sourceName === access.sourceName);

						// Special handling for warlock patron expanded spell lists
						// Instead of creating separate tabs, merge them into the class spell list
						const isWarlockPatron = access.source === 'subclass' && 
							(access.sourceName === 'The Archfey' || 
							 access.sourceName === 'The Fiend' || 
							 access.sourceName === 'The Great Old One');

						// Special handling for Cleric domain spells
						// These spells are auto-granted (chooseable: false) and also in the class list
						// To avoid duplicates, replace the class spell entry with the subclass version
						const isClericDomain = access.source === 'subclass' && 
							!access.chooseable && 
							access.sourceName.includes('Domain');
						// Note: Circle of Land is NOT included here - we want the class spell to remain visible

						if (isClericDomain) {
							// For Cleric domains, replace existing class spell entry with subclass version
							const existingClassSpell = availableSpells.find(
								(s) => s.name === spell.name && s.source === 'class' && s.sourceName === 'Cleric'
							);
							if (existingClassSpell) {
								// Replace the class spell with the subclass spell (making it auto-granted)
								existingClassSpell.source = access.source;
								existingClassSpell.sourceName = access.sourceName;
								existingClassSpell.chooseable = false;
							} else {
								// Spell wasn't in class list, add it as subclass spell
								availableSpells.push({
									...spell,
									source: access.source,
									sourceName: access.sourceName,
									chooseable: false
								});
							}
						} else if (!existingSpell) {
							// Add new spell
							// If it's a warlock patron spell, add it as a class spell to avoid creating separate tabs
							availableSpells.push({
								...spell,
								source: isWarlockPatron ? 'class' : access.source,
								sourceName: isWarlockPatron ? 'Warlock' : access.sourceName,
								chooseable: access.chooseable !== false
							});
						}
						// NOTE: Removed the else-if block that was replacing class source with subclass source
						// This was causing duplicates because Circle of Land/Oath/Domain spells would appear
						// in both standard tabs and special tabs. Now they appear as separate entries:
						// - One with class source (for standard tabs)
						// - One with subclass source (for special tabs) - added above
					}
				});
			}

			// Add cantrips
			if (access.cantrips && spellLevel === 0) {
				access.cantrips.forEach((spellName) => {
					const spell = spells.find((s) => s.name === spellName && s.level === 0);
					if (spell) {
						const existingSpell = availableSpells.find((s) => s.name === spell.name && s.sourceName === access.sourceName);

						// Special handling for warlock patron expanded spell lists
						const isWarlockPatron = access.source === 'subclass' && 
							(access.sourceName === 'The Archfey' || 
							 access.sourceName === 'The Fiend' || 
							 access.sourceName === 'The Great Old One');

						// Special handling for Cleric domain cantrips
						// These cantrips are auto-granted (chooseable: false) and may also be in the class list
						// To avoid duplicates, replace the class cantrip entry with the subclass version
						const isClericDomain = access.source === 'subclass' && 
							!access.chooseable && 
							access.sourceName.includes('Domain');

						if (isClericDomain) {
							// For Cleric domains, replace existing class cantrip entry with subclass version
							const existingClassCantrip = availableSpells.find(
								(s) => s.name === spell.name && s.source === 'class' && s.sourceName === 'Cleric'
							);
							if (existingClassCantrip) {
								// Replace the class cantrip with the subclass cantrip (making it auto-granted)
								existingClassCantrip.source = access.source;
								existingClassCantrip.sourceName = access.sourceName;
								existingClassCantrip.chooseable = false;
							} else {
								// Cantrip wasn't in class list, add it as subclass cantrip
								availableSpells.push({
									...spell,
									source: access.source,
									sourceName: access.sourceName,
									chooseable: false
								});
							}
						} else if (!existingSpell) {
							// Add new cantrip
							// If it's a warlock patron cantrip, add it as a class cantrip to avoid creating separate tabs
							availableSpells.push({
								...spell,
								source: isWarlockPatron ? 'class' : access.source,
								sourceName: isWarlockPatron ? 'Warlock' : access.sourceName,
								chooseable: access.chooseable !== false
							});
						}
					}
				});
			}
		});

		// Sort spells so that patron expanded spells appear first for warlocks
		availableSpells.sort((a, b) => {
			// Check if these are warlock spells
			const aIsWarlock = a.classes.includes('Warlock');
			const bIsWarlock = b.classes.includes('Warlock');
			
			if (aIsWarlock && bIsWarlock) {
				// Both are warlock spells - check if they're from patron expanded lists
				// Patron spells are marked with sourceName 'Warlock' but came from patron lists
				// We can identify them by checking if they're NOT in the base warlock spell list
				// Actually, we need a different approach - let's check the original spell's classes
				// If a spell is in the warlock list but originally from patron, it won't have been
				// in the base warlock class list. But we've already processed that...
				// Better approach: patron spells will have specific spell names we know
				const patronSpells = [
					// The Archfey
					'Faerie Fire', 'Sleep', 'Calm Emotions', 'Phantasmal Force',
					// The Fiend  
					'Burning Hands', 'Command', 'Blindness/Deafness', 'Scorching Ray',
					// The Great Old One
					'Dissonant Whispers', "Tasha's Hideous Laughter", 'Detect Thoughts'
					// Note: Phantasmal Force appears in both Archfey and GOO
				];
				
				const aIsPatron = patronSpells.includes(a.name);
				const bIsPatron = patronSpells.includes(b.name);
				
				if (aIsPatron && !bIsPatron) return -1; // Patron spells first
				if (!aIsPatron && bIsPatron) return 1;  // Base warlock spells after
			}
			
			// Otherwise maintain alphabetical order
			return a.name.localeCompare(b.name);
		});

		return availableSpells;
	}

	// Get spell selection limits for character
	function getSpellLimits(character: any) {
		const spellAccess = getSpellAccessForCharacter(character);
		const limits = {
			cantrips: 0,
			level1: 0,
			level2: 0,
			sharedLeveled: 0, // For classes that share spell slots across levels
			isSharedLimits: false // Whether leveled spells share limits
		};

		spellAccess.forEach((access) => {
			if (access.chooseable !== false) {
				// Only count class and subclass access toward limits, not race/feat bonuses or feature sources
				// Exclude subclass entries with extended names (like "Nature Domain - Druid Cantrip")
				// Exclude Circle of Land bonus cantrips (they have their own separate tab)
				// as they are handled in separate tabs
				// Exclude feature sources (like Pact of the Tome) as they have their own separate tabs and limits
				const countsTowardLimits =
					access.source === 'class' ||
					(access.source === 'subclass' && 
						!access.sourceName.includes(' - ') &&
						!access.sourceName.includes('Circle of the Land'));

				// Handle new format with separate cantrip and spell counts
				if (access.chooseCantripCount !== undefined || access.chooseSpellCount !== undefined) {
					if (access.chooseFrom && access.chooseFrom.length > 0) {
						// Determine what spells this access can choose (respecting maxSpellLevel and minSpellLevel)
						const canChooseCantrips = getSpellsByLevel(0).some((spell) =>
							access.chooseFrom!.some((className) => spell.classes.includes(className))
						);
						const canChooseLevel1 =
							(access.minSpellLevel === undefined || access.minSpellLevel <= 1) &&
							(access.maxSpellLevel === undefined || access.maxSpellLevel >= 1) &&
							getSpellsByLevel(1).some((spell) =>
								access.chooseFrom!.some((className) => spell.classes.includes(className))
							);
						const canChooseLevel2 =
							(access.minSpellLevel === undefined || access.minSpellLevel <= 2) &&
							(access.maxSpellLevel === undefined || access.maxSpellLevel >= 2) &&
							getSpellsByLevel(2).some((spell) =>
								access.chooseFrom!.some((className) => spell.classes.includes(className))
							);

						// Handle cantrip limits (only class/subclass count toward limits)
						if (
							canChooseCantrips &&
							access.chooseCantripCount !== undefined &&
							countsTowardLimits
						) {
							limits.cantrips += access.chooseCantripCount;
						}

						// Handle leveled spell limits (only class/subclass count toward limits)
						if (access.chooseSpellCount !== undefined && countsTowardLimits) {
							// If this access can choose both level1 and level2 spells, it's shared
							if (canChooseLevel1 && canChooseLevel2) {
								limits.isSharedLimits = true;
								limits.sharedLeveled += access.chooseSpellCount;
							} else {
								// Separate limits per level
								if (canChooseLevel1) limits.level1 += access.chooseSpellCount;
								if (canChooseLevel2) limits.level2 += access.chooseSpellCount;
							}
						}
					}
				}
				// Legacy format support (for backwards compatibility)
				else if (access.chooseCount && countsTowardLimits) {
					if (access.chooseFrom && access.chooseFrom.length > 0) {
						// Determine what spells this access can choose (respecting maxSpellLevel and minSpellLevel)
						const canChooseCantrips = getSpellsByLevel(0).some((spell) =>
							access.chooseFrom!.some((className) => spell.classes.includes(className))
						);
						const canChooseLevel1 =
							(access.minSpellLevel === undefined || access.minSpellLevel <= 1) &&
							(access.maxSpellLevel === undefined || access.maxSpellLevel >= 1) &&
							getSpellsByLevel(1).some((spell) =>
								access.chooseFrom!.some((className) => spell.classes.includes(className))
							);
						const canChooseLevel2 =
							(access.minSpellLevel === undefined || access.minSpellLevel <= 2) &&
							(access.maxSpellLevel === undefined || access.maxSpellLevel >= 2) &&
							getSpellsByLevel(2).some((spell) =>
								access.chooseFrom!.some((className) => spell.classes.includes(className))
							);

						// Legacy support - treat as shared limits
						if (canChooseCantrips) limits.cantrips += access.chooseCount;

						// If this access can choose both level1 and level2 spells, it's shared
						if (canChooseLevel1 && canChooseLevel2) {
							limits.isSharedLimits = true;
							limits.sharedLeveled += access.chooseCount;
						} else {
							// Separate limits per level
							if (canChooseLevel1) limits.level1 += access.chooseCount;
							if (canChooseLevel2) limits.level2 += access.chooseCount;
						}
					}
				}
			}
		});

		return limits;
	}

	// State for selected spells, expanded spell cards, and filters
	// Store selections with full metadata to enable cleanup when sources change
	type SpellSelection = {
		tabSource: string; // The tab ID where it was selected (e.g., 'cantrips', 'level1', 'Arcane Trickster - Cantrips')
		charClass: string; // The class at time of selection
		charSubclass: string; // The subclass at time of selection
		charRace: string; // The race at time of selection
		charSubrace: string; // The subrace at time of selection
	};
	let selectedSpells = new Map<string, SpellSelection>(); // spellName -> selection metadata
	let expandedSpells = new Set();
	let activeTab = ''; // Current active tab ID

	function toggleSpell(spellName: string, chooseable: boolean, spell?: any) {
		if (!chooseable) return; // Can't toggle non-chooseable spells

		// Check if we can add more spells before allowing selection
		if (!selectedSpells.has(spellName) && !canSelectMoreSpells(activeTab, spell)) {
			return; // Can't select more spells
		}

		// Get the source name for tracking
		const sourceId = activeTab;
		const sourceName = sourceId.startsWith('subclass-')
			? sourceId.replace('subclass-', '')
			: sourceId.startsWith('race-')
				? sourceId.replace('race-', '')
				: sourceId.startsWith('feature-')
					? sourceId.replace('feature-', '')
					: sourceId;

		if (selectedSpells.has(spellName)) {
			selectedSpells.delete(spellName);
		} else {
			// Store comprehensive metadata about the selection
			const char = $character_store;
			selectedSpells.set(spellName, {
				tabSource: sourceName,
				charClass: char.class || '',
				charSubclass: char.subclass || '',
				charRace: char.race || '',
				charSubrace: char.subrace || ''
			});
		}
		selectedSpells = selectedSpells; // Trigger reactivity

		// Persist spell selections to character store
		persistSpellSelections();
	}

	// Toggle spell card expansion
	function toggleSpellExpansion(spellName: string) {
		if (expandedSpells.has(spellName)) {
			expandedSpells.delete(spellName);
		} else {
			expandedSpells.add(spellName);
		}
		expandedSpells = expandedSpells; // Trigger reactivity
	}

	// Persist spell selections to character store
	function persistSpellSelections() {
		const scopeId = 'spell_selections';
		// Store detailed spell selections with metadata in provenance
		const spellSelections = {
			spells: Array.from(selectedSpells.keys()) // Just spell names for character.spells array
		};
		// Store full metadata separately for restoration
		const spellMetadata = Array.from(selectedSpells.entries()).map(([name, metadata]) => ({
			name,
			...metadata
		}));
		
		// Apply the spell names to character.spells
		applyChoice(scopeId, spellSelections);
		
		// Also store metadata in provenance for restoration
		// Update the provenance to include metadata
		const char = get(character_store);
		if (char._provenance && char._provenance[scopeId]) {
			(char._provenance[scopeId] as any)._metadata = spellMetadata;
		}
	}

	// Restore spell selections from character store
	function restoreSpellSelectionsFromStore() {
		const char = $character_store;
		if (!char._provenance) return;

		const scopeId = 'spell_selections';
		const provenanceData = char._provenance[scopeId];

		if (provenanceData) {
			// Try to get metadata first (new format)
			const metadata = (provenanceData as any)._metadata;
			
			if (metadata && Array.isArray(metadata)) {
				// New format: use stored metadata
				selectedSpells = new Map();
				metadata.forEach((item: any) => {
					if (item && item.name) {
						selectedSpells.set(item.name, {
							tabSource: item.tabSource || '',
							charClass: item.charClass || '',
							charSubclass: item.charSubclass || '',
							charRace: item.charRace || '',
							charSubrace: item.charSubrace || ''
						});
					}
				});
				return;
			}
			
			// Fallback to old format
			const actualData = (provenanceData as any)._set || provenanceData;

			if (actualData.spells && Array.isArray(actualData.spells)) {
				// Handle multiple formats for backward compatibility
				selectedSpells = new Map();
				actualData.spells.forEach((item: any) => {
					if (typeof item === 'string') {
						// Legacy format: just spell name
						// Create minimal metadata (will be cleaned up on next character change)
						selectedSpells.set(item, {
							tabSource: '',
							charClass: char.class || '',
							charSubclass: char.subclass || '',
							charRace: char.race || '',
							charSubrace: char.subrace || ''
						});
					} else if (item && item.name) {
						// Check if this is the old {name, source} format or new format with full metadata
						if (item.tabSource !== undefined) {
							// New format with full metadata
							selectedSpells.set(item.name, {
								tabSource: item.tabSource || '',
								charClass: item.charClass || '',
								charSubclass: item.charSubclass || '',
								charRace: item.charRace || '',
								charSubrace: item.charSubrace || ''
							});
						} else {
							// Old format: {name, source} where source is just the tab name
							selectedSpells.set(item.name, {
								tabSource: item.source || '',
								charClass: char.class || '',
								charSubclass: char.subclass || '',
								charRace: char.race || '',
								charSubrace: char.subrace || ''
							});
						}
					}
				});
			}
		}
	}

	// Check if we've reached the selection limit for a spell level
	function canSelectMore(spellLevel: number, character: any): boolean {
		const limits = getSpellLimits(character);

		if (spellLevel === 0) {
			// Cantrips are always separate
			const availableCantrips = getAvailableSpells(0, character);
			// Only count spells from sources that contribute to main limits
			// Exclude feature sources as they have their own separate tabs
			const selectedCount = availableCantrips.filter(
				(spell) =>
					spell.chooseable &&
					selectedSpells.has(spell.name) &&
					(spell.source === 'class' ||
						(spell.source === 'subclass' && !spell.sourceName.includes(' - '))) &&
					spell.source !== 'feature'
			).length;
			return selectedCount < limits.cantrips;
		} else if (limits.isSharedLimits && (spellLevel === 1 || spellLevel === 2)) {
			// For shared limits, count all leveled spells together
			const availableLevel1 = getAvailableSpells(1, character);
			const availableLevel2 = getAvailableSpells(2, character);
			// Only count spells from sources that contribute to main limits
			// Exclude feature sources as they have their own separate tabs
			const selectedLevel1Count = availableLevel1.filter(
				(spell) =>
					spell.chooseable &&
					selectedSpells.has(spell.name) &&
					(spell.source === 'class' ||
						(spell.source === 'subclass' && !spell.sourceName.includes(' - '))) &&
					spell.source !== 'feature'
			).length;
			const selectedLevel2Count = availableLevel2.filter(
				(spell) =>
					spell.chooseable &&
					selectedSpells.has(spell.name) &&
					(spell.source === 'class' ||
						(spell.source === 'subclass' && !spell.sourceName.includes(' - '))) &&
					spell.source !== 'feature'
			).length;
			const totalSelectedLeveled = selectedLevel1Count + selectedLevel2Count;
			return totalSelectedLeveled < limits.sharedLeveled;
		} else {
			// Separate limits per level
			const availableSpells = getAvailableSpells(spellLevel, character);
			// Only count spells from sources that contribute to main limits
			// Exclude feature sources as they have their own separate tabs
			const selectedCount = availableSpells.filter(
				(spell) =>
					spell.chooseable &&
					selectedSpells.has(spell.name) &&
					(spell.source === 'class' ||
						(spell.source === 'subclass' && !spell.sourceName.includes(' - '))) &&
					spell.source !== 'feature'
			).length;

			switch (spellLevel) {
				case 1:
					return selectedCount < limits.level1;
				case 2:
					return selectedCount < limits.level2;
				default:
					return false;
			}
		}
	}

	// Determine if a spell should show "Learn" or "Prepare" based on class type
	function getSpellButtonText(spellLevel: number, character: any): string {
		// Cantrips are always "learned"
		if (spellLevel === 0) return 'Learn';

		// For leveled spells, check class type
		const className = character.class;
		if (!className) return 'Learn';

		// Classes that prepare spells
		const preparedSpellClasses = ['Cleric', 'Druid', 'Paladin'];
		if (preparedSpellClasses.includes(className)) {
			return 'Prepare';
		}

		// All other classes learn spells
		return 'Learn';
	}

	// Get unique spell sources for character
	function getSpellSources(character: any) {
		const spellAccess = getSpellAccessForCharacter(character);
		const sources = [];

		// Add race-based sources (both chooseable and auto-granted)
		spellAccess.forEach((access) => {
			if (access.source === 'race') {
				// Check if this race source has any spells or cantrips
				const hasSpells =
					(access.spells && access.spells.length > 0) ||
					(access.cantrips && access.cantrips.length > 0) ||
					(access.chooseFrom && access.chooseFrom.length > 0);

				if (hasSpells) {
					sources.push({
						id: `${access.source}-${access.sourceName}`,
						name: access.sourceName,
						type: 'race',
						sourceName: access.sourceName,
						requiresChoices: access.chooseable === true
					});
				}
			}
		});

		// Add subclass-based sources (group by sourceName to combine auto and chooseable entries)
		const subclassSources = new Map();
		spellAccess.forEach((access) => {
			if (access.source === 'subclass') {
				// Check if this subclass source has any spells or cantrips
				const hasSpells =
					(access.spells && access.spells.length > 0) ||
					(access.cantrips && access.cantrips.length > 0) ||
					(access.chooseFrom && access.chooseFrom.length > 0);

				if (hasSpells) {
					const existing = subclassSources.get(access.sourceName);
					if (existing) {
						// Combine with existing entry - mark as requiring choices if any entry is chooseable
						existing.requiresChoices = existing.requiresChoices || access.chooseable === true;
					} else {
						// Create new entry
						subclassSources.set(access.sourceName, {
							id: `${access.source}-${access.sourceName}`,
							name: access.sourceName,
							type: 'subclass',
							sourceName: access.sourceName,
							requiresChoices: access.chooseable === true
						});
					}
				}
			}
		});
		// Add all grouped subclass sources to the sources array
		subclassSources.forEach((source) => {
			sources.push(source);
		});

		// Add feature-based sources
		spellAccess.forEach((access) => {
			if (access.source === 'feature') {
				// Check if this feature source has any spells or cantrips
				const hasSpells =
					(access.spells && access.spells.length > 0) ||
					(access.cantrips && access.cantrips.length > 0) ||
					(access.chooseFrom && access.chooseFrom.length > 0);

				if (hasSpells) {
					sources.push({
						id: `${access.source}-${access.sourceName}`,
						name: access.sourceName,
						type: 'feature',
						sourceName: access.sourceName,
						requiresChoices: access.chooseable === true
					});
				}
			}
		});

		// Get subclasses that have both cantrips and spells (should be unified tabs)
		const unifiedSubclasses = spellAccess
			.filter(
				(access) =>
					access.source === 'subclass' &&
					access.chooseable &&
					(access.chooseCantripCount ?? 0) > 0 &&
					(access.chooseSpellCount ?? 0) > 0
			)
			.map((access) => access.sourceName);

		// Add level-based sources for class/subclass spells that require choices
		// Exclude unified subclasses from level-based tabs
		const hasClassCantrips = spellAccess.some(
			(access) =>
				(access.source === 'class' ||
					(access.source === 'subclass' && !unifiedSubclasses.includes(access.sourceName)) ||
					access.source === 'feature') &&
				access.chooseable &&
				((access.chooseCantripCount ?? 0) > 0 ||
					(access.chooseFrom &&
						getSpellsByLevel(0).some((spell) =>
							access.chooseFrom!.some((className) => spell.classes.includes(className))
						)))
		);

		const hasClassLevel1 = spellAccess.some(
			(access) =>
				(access.source === 'class' ||
					(access.source === 'subclass' && !unifiedSubclasses.includes(access.sourceName)) ||
					access.source === 'feature') &&
				access.chooseable &&
				((access.chooseSpellCount ?? 0) > 0 ||
					(access.chooseFrom &&
						getSpellsByLevel(1).some((spell) =>
							access.chooseFrom!.some((className) => spell.classes.includes(className))
						)))
		);

		const hasClassLevel2 = spellAccess.some(
			(access) =>
				(access.source === 'class' ||
					(access.source === 'subclass' && !unifiedSubclasses.includes(access.sourceName)) ||
					access.source === 'feature') &&
				access.chooseable &&
				((access.chooseSpellCount ?? 0) > 0 ||
					(access.chooseFrom &&
						getSpellsByLevel(2).some((spell) =>
							access.chooseFrom!.some((className) => spell.classes.includes(className))
						)))
		);

		// Check if this is a non-caster with only subclass spell access (like Arcane Trickster Rogue)
		// In this case, don't show standard cantrips/level tabs since they use dedicated subclass tabs
		const hasClassSpellAccess = spellAccess.some(
			(access) => access.source === 'class' && access.chooseable
		);
		const onlySubclassSpellAccess = !hasClassSpellAccess && spellAccess.some(
			(access) => access.source === 'subclass' && access.chooseable
		);

		if (hasClassCantrips && !onlySubclassSpellAccess) {
			sources.push({
				id: 'cantrips',
				name: 'Cantrips',
				type: 'level',
				level: 0,
				requiresChoices: true
			});
		}

		if (hasClassLevel1 && !onlySubclassSpellAccess) {
			sources.push({
				id: 'level1',
				name: '1st Level',
				type: 'level',
				level: 1,
				requiresChoices: true
			});
		}

		if (hasClassLevel2) {
			sources.push({
				id: 'level2',
				name: '2nd Level',
				type: 'level',
				level: 2,
				requiresChoices: true
			});
		}

		// Filter out any sources that would result in completely empty tabs
		// This prevents tabs like "Circle of the Moon" from appearing when the character
		// doesn't have access to the spell levels that subclass provides
		const nonEmptySources = sources.filter((source) => {
			const spells = getSpellsForSource(character, source.id);
			return spells.length > 0;
		});

		return nonEmptySources;
	}

	// Get spells for a specific source tab
	function getSpellsForSource(character: any, sourceId: string) {
		// Helper function to add racial spells as crossed-out duplicates
		function addRacialDuplicates(classSpells: any[], level: number) {
			const racialSpells = getAvailableSpells(level, character).filter(
				(spell) => spell.source === 'race' && !spell.chooseable
			);

			// Start with class spells and mark any that are racial duplicates
			const markedClassSpells = classSpells.map((spell) => {
				const isRacialDuplicate = racialSpells.some(
					(racialSpell) => racialSpell.name === spell.name
				);
				return {
					...spell,
					isRacialDuplicate,
					racialSource: isRacialDuplicate
						? racialSpells.find((rs) => rs.name === spell.name)?.sourceName
						: null
				};
			});

			// Add any racial spells that aren't already in the class spell list
			const additionalRacialSpells = racialSpells
				.filter(
					(racialSpell) => !classSpells.some((classSpell) => classSpell.name === racialSpell.name)
				)
				.map((racialSpell) => ({
					...racialSpell,
					isRacialDuplicate: true,
					racialSource: racialSpell.sourceName,
					// Keep the racial spell as chooseable: false since it's auto-granted
					chooseable: false
				}));

			return [...markedClassSpells, ...additionalRacialSpells];
		}

		if (sourceId === 'cantrips') {
			const classSpells = getAvailableSpells(0, character).filter(
				(spell) => {
					// Exclude feature sources from base cantrips tab
					if (spell.source === 'feature') return false;
					// Apply rare use filter
					if (shouldFilterSpell(spell)) return false;
					// Include class spells
					if (spell.source === 'class') return true;
					// Exclude Circle of Land subclass spells (they have a separate tab)
					// But keep the class versions of those spells
					if (spell.source === 'subclass' && spell.sourceName.includes('Circle of the Land')) return false;
					// Include other subclass spells without ' - ' in their name
					if (spell.source === 'subclass' && !spell.sourceName.includes(' - ')) return true;
					return false;
				}
			);
			return addRacialDuplicates(classSpells, 0);
		} else if (sourceId === 'level1') {
			const classSpells = getAvailableSpells(1, character).filter(
				(spell) => {
					// Exclude feature sources from base level1 tab
					if (spell.source === 'feature') return false;
					// Apply rare use filter
					if (shouldFilterSpell(spell)) return false;
					// Include class spells
					if (spell.source === 'class') return true;
					// Exclude Circle of Land subclass spells (they have a separate tab)
					// But keep the class versions of those spells
					if (spell.source === 'subclass' && spell.sourceName.includes('Circle of the Land')) return false;
					// Include other subclass spells without ' - ' in their name
					if (spell.source === 'subclass' && !spell.sourceName.includes(' - ')) return true;
					return false;
				}
			);
			return addRacialDuplicates(classSpells, 1);
		} else if (sourceId === 'level2') {
			const classSpells = getAvailableSpells(2, character).filter(
				(spell) => {
					// Exclude feature sources from base level2 tab
					if (spell.source === 'feature') return false;
					// Apply rare use filter
					if (shouldFilterSpell(spell)) return false;
					// Include class spells
					if (spell.source === 'class') return true;
					// Exclude Circle of Land subclass spells (they have a separate tab)
					// But keep the class versions of those spells
					if (spell.source === 'subclass' && spell.sourceName.includes('Circle of the Land')) return false;
					// Include other subclass spells without ' - ' in their name
					if (spell.source === 'subclass' && !spell.sourceName.includes(' - ')) return true;
					return false;
				}
			);
			return addRacialDuplicates(classSpells, 2);
		} else if (sourceId.startsWith('race-')) {
			// Race-based source
			const sourceName = sourceId.replace('race-', '');

			// Get the spell access configuration for this race
			const spellAccess = getSpellAccessForCharacter(character);
			const access = spellAccess.find((sa) => sa.source === 'race' && sa.sourceName === sourceName);

			if (!access) return [];

			// For chooseable race sources (like High Elf), only return spells of the appropriate level
			if (access.chooseable && access.chooseFrom) {
				const spells: Array<Spell & { source: string; sourceName: string; chooseable: boolean }> =
					[];

				// Only add cantrips if this access allows choosing cantrips
				if ((access.chooseCantripCount ?? 0) > 0) {
					const cantrips = getAvailableSpells(0, character).filter(
						(spell) => spell.source === 'race' && spell.sourceName === sourceName
					);
					spells.push(...cantrips);
				}

				// Only add leveled spells if this access allows choosing leveled spells
				if ((access.chooseSpellCount ?? 0) > 0) {
					const level1 = getAvailableSpells(1, character).filter(
						(spell) => spell.source === 'race' && spell.sourceName === sourceName
					);
					const level2 = getAvailableSpells(2, character).filter(
						(spell) => spell.source === 'race' && spell.sourceName === sourceName
					);
					spells.push(...level1, ...level2);
				}

				return spells;
			} else {
				// For auto-granted race sources, return all spells
				const cantrips = getAvailableSpells(0, character).filter(
					(spell) => spell.source === 'race' && spell.sourceName === sourceName
				);
				const level1 = getAvailableSpells(1, character).filter(
					(spell) => spell.source === 'race' && spell.sourceName === sourceName
				);
				const level2 = getAvailableSpells(2, character).filter(
					(spell) => spell.source === 'race' && spell.sourceName === sourceName
				);
				return [...cantrips, ...level1, ...level2];
			}
		} else if (sourceId.startsWith('subclass-')) {
			// Subclass-based source (like domain spells, totem warrior spells, Eldritch Knight, etc.)
			const sourceName = sourceId.replace('subclass-', '');

			// Get the spell access configuration for this subclass
			const spellAccess = getSpellAccessForCharacter(character);
			// Find ALL access entries for this subclass (there may be multiple)
			const allAccess = spellAccess.filter(
				(sa) => sa.source === 'subclass' && sa.sourceName === sourceName
			);

			if (allAccess.length === 0) return [];

			// Separate chooseable and auto-granted access
			const chooseableAccess = allAccess.filter((access) => access.chooseable);
			const autoGrantedAccess = allAccess.filter((access) => !access.chooseable);

			// Count chooseable cantrips (user can select these)
			const chooseableCantripCount = chooseableAccess.reduce((sum, access) => {
				return sum + (access.chooseCantripCount ?? 0);
			}, 0);

			// Count chooseable spells (user can select these)
			const chooseableSpellCount = chooseableAccess.reduce((sum, access) => {
				return sum + (access.chooseSpellCount ?? 0);
			}, 0);

			// Check if there are auto-granted spells (purple, already selected)
			const hasAutoGrantedSpells = autoGrantedAccess.some(
				(access) => (access.spells && access.spells.length > 0) || (access.cantrips && access.cantrips.length > 0)
			);

			const results: any[] = [];

			// Check if there are auto-granted cantrips (purple, already selected)
			const hasAutoGrantedCantrips = autoGrantedAccess.some(
				(access) => access.cantrips && access.cantrips.length > 0
			);

			// Include cantrips if user can choose them OR if there are auto-granted cantrips
			if (chooseableCantripCount > 0 || hasAutoGrantedCantrips) {
				const cantrips = getAvailableSpells(0, character)
					.filter((spell) => {
						if (spell.source !== 'subclass' || spell.sourceName !== sourceName) return false;
						// Include if chooseable and we're allowing choices, OR if auto-granted
						return (spell.chooseable && chooseableCantripCount > 0) || (!spell.chooseable && hasAutoGrantedCantrips);
					})
					.map((spell) => ({ ...spell, spellSection: 'cantrips' }));
				results.push(...cantrips);
			}

			// Include leveled spells:
			// - If chooseableSpellCount > 0: show chooseable spells (user can select)
			// - If hasAutoGrantedSpells: show auto-granted spells (purple, already selected)
			if (chooseableSpellCount > 0 || hasAutoGrantedSpells) {
				const level1 = getAvailableSpells(1, character)
					.filter((spell) => {
						if (spell.source !== 'subclass' || spell.sourceName !== sourceName) return false;
						// Include if chooseable and we're allowing choices, OR if auto-granted
						return (spell.chooseable && chooseableSpellCount > 0) || (!spell.chooseable && hasAutoGrantedSpells);
					})
					.map((spell) => ({ ...spell, spellSection: 'level1' }));

				const level2 = getAvailableSpells(2, character)
					.filter((spell) => {
						if (spell.source !== 'subclass' || spell.sourceName !== sourceName) return false;
						// Include if chooseable and we're allowing choices, OR if auto-granted
						return (spell.chooseable && chooseableSpellCount > 0) || (!spell.chooseable && hasAutoGrantedSpells);
					})
					.map((spell) => ({ ...spell, spellSection: 'level2' }));

				results.push(...level1, ...level2);
			}

			return results;
		} else if (sourceId.startsWith('feature-')) {
			// Feature-based source (like Warlock invocations, Pact of the Tome, etc.)
			const sourceName = sourceId.replace('feature-', '');

			// Get the spell access configuration for this feature
			const spellAccess = getSpellAccessForCharacter(character);
			const access = spellAccess.find(
				(sa) => sa.source === 'feature' && sa.sourceName === sourceName
			);

			if (!access) return [];

			// Only include spell levels that this feature actually grants access to
			const results: any[] = [];

			// Include cantrips only if this feature allows choosing cantrips OR has cantrips in its list
			if ((access.chooseCantripCount ?? 0) > 0 || (access.cantrips && access.cantrips.length > 0)) {
				const cantrips = getAvailableSpells(0, character).filter(
					(spell) => spell.source === 'feature' && spell.sourceName === sourceName
				);
				results.push(...cantrips);
			}

			// Include leveled spells only if this feature allows choosing spells OR has spells in its list
			if ((access.chooseSpellCount ?? 0) > 0 || (access.spells && access.spells.length > 0)) {
				const level1 = getAvailableSpells(1, character).filter(
					(spell) => spell.source === 'feature' && spell.sourceName === sourceName
				);

				results.push(...level1);

				// Only include level 2 spells if maxSpellLevel allows it (undefined or >= 2)
				if (access.maxSpellLevel === undefined || access.maxSpellLevel >= 2) {
					const level2 = getAvailableSpells(2, character).filter(
						(spell) => spell.source === 'feature' && spell.sourceName === sourceName
					);
					results.push(...level2);
				}
			}

			return results;
		}
		return [];
	}

	// Tab management functions
	function setActiveTab(tabId: string) {
		activeTab = tabId;
	}

	// Check if a tab is completed (all required selections made)
	function isTabCompleted(character: any, sourceId: string): boolean {
		const spells = getSpellsForSource(character, sourceId);
		if (spells.length === 0) return true;

		// Check if there are any chooseable spells that haven't been selected
		const chooseableSpells = spells.filter((spell) => spell.chooseable);
		if (chooseableSpells.length === 0) return true; // All auto-granted

		// For race-based sources, check if the required number is selected
		if (sourceId.startsWith('race-')) {
			const sourceName = sourceId.replace('race-', '');
			const spellAccess = getSpellAccessForCharacter(character);
			const access = spellAccess.find((sa) => sa.source === 'race' && sa.sourceName === sourceName);
			if (!access) return true;

			// If this source doesn't require choices (auto-granted), it's always complete
			if (!access.chooseable) return true;

			// Only count spells that were selected FROM THIS tab
			const selectedCount = chooseableSpells.filter((spell) => {
				if (!selectedSpells.has(spell.name)) return false;
				const selectedFrom = selectedSpells.get(spell.name)?.tabSource;
				return selectedFrom === sourceName;
			}).length;
			const requiredCantrips = access.chooseCantripCount ?? 0;
			const requiredSpells = access.chooseSpellCount ?? 0;
			const totalRequired = requiredCantrips + requiredSpells;

			return selectedCount >= totalRequired;
		}

		// For subclass-based sources, check if the required number is selected
		if (sourceId.startsWith('subclass-')) {
			const sourceName = sourceId.replace('subclass-', '');
			const spellAccess = getSpellAccessForCharacter(character);
			const allAccess = spellAccess.filter(
				(sa) => sa.source === 'subclass' && sa.sourceName === sourceName
			);
			const chooseableAccess = allAccess.filter((sa) => sa.chooseable);
			if (chooseableAccess.length === 0) return true; // All auto-granted

			// Only count spells that were selected FROM THIS tab
			const selectedCount = chooseableSpells.filter((spell) => {
				if (!selectedSpells.has(spell.name)) return false;
				const selectedFrom = selectedSpells.get(spell.name)?.tabSource;
				return selectedFrom === sourceName;
			}).length;
			const requiredCantrips = chooseableAccess.reduce((sum, access) => sum + (access.chooseCantripCount ?? 0), 0);
			const requiredSpells = chooseableAccess.reduce((sum, access) => sum + (access.chooseSpellCount ?? 0), 0);
			const totalRequired = requiredCantrips + requiredSpells;

			return selectedCount >= totalRequired;
		}

		// For feature-based sources, check if the required number is selected
		if (sourceId.startsWith('feature-')) {
			const sourceName = sourceId.replace('feature-', '');
			const spellAccess = getSpellAccessForCharacter(character);
			const access = spellAccess.find(
				(sa) => sa.source === 'feature' && sa.sourceName === sourceName
			);
			if (!access) return true;

			// If this source doesn't require choices (auto-granted), it's always complete
			if (!access.chooseable) return true;

			// Only count spells that were selected FROM THIS tab
			const selectedCount = chooseableSpells.filter((spell) => {
				if (!selectedSpells.has(spell.name)) return false;
				const selectedFrom = selectedSpells.get(spell.name)?.tabSource;
				return selectedFrom === sourceName;
			}).length;
			const requiredCantrips = access.chooseCantripCount ?? 0;
			const requiredSpells = access.chooseSpellCount ?? 0;
			const totalRequired = requiredCantrips + requiredSpells;

			return selectedCount >= totalRequired;
		}

		// For level-based sources, check against spell limits
		if (sourceId === 'cantrips') {
			// Only count spells that were selected FROM THIS tab (not from feature sources)
			const selectedCount = chooseableSpells.filter((spell) => {
				if (!selectedSpells.has(spell.name)) return false;
				const selectedFrom = selectedSpells.get(spell.name)?.tabSource;
				// Count if selected from 'cantrips' tab, or if no tabSource (legacy format)
				return !selectedFrom || selectedFrom === 'cantrips';
			}).length;
			return selectedCount >= spellLimits.cantrips;
		} else if (sourceId === 'level1') {
			if (spellLimits.isSharedLimits) {
				return selectedLeveledCount >= spellLimits.sharedLeveled;
			} else {
				// Only count spells that were selected FROM THIS tab (not from feature sources)
				const selectedCount = chooseableSpells.filter((spell) => {
					if (!selectedSpells.has(spell.name)) return false;
					const selectedFrom = selectedSpells.get(spell.name)?.tabSource;
					// Count if selected from 'level1' tab, or if no tabSource (legacy format)
					return !selectedFrom || selectedFrom === 'level1';
				}).length;
				return selectedCount >= spellLimits.level1;
			}
		} else if (sourceId === 'level2') {
			if (spellLimits.isSharedLimits) {
				return selectedLeveledCount >= spellLimits.sharedLeveled;
			} else {
				// Only count spells that were selected FROM THIS tab (not from feature sources)
				const selectedCount = chooseableSpells.filter((spell) => {
					if (!selectedSpells.has(spell.name)) return false;
					const selectedFrom = selectedSpells.get(spell.name)?.tabSource;
					// Count if selected from 'level2' tab, or if no tabSource (legacy format)
					return !selectedFrom || selectedFrom === 'level2';
				}).length;
				return selectedCount >= spellLimits.level2;
			}
		}

		return false;
	}

	// Get selection count info for current tab
	function getSelectionCountInfo(character: any, sourceId: string) {
		const spells = getSpellsForSource(character, sourceId);
		const chooseableSpells = spells.filter((spell) => spell.chooseable);
		const selectedCount = chooseableSpells.filter((spell) => selectedSpells.has(spell.name)).length;

		if (sourceId.startsWith('race-')) {
			const sourceName = sourceId.replace('race-', '');
			const spellAccess = getSpellAccessForCharacter(character);
			const access = spellAccess.find((sa) => sa.source === 'race' && sa.sourceName === sourceName);
			if (!access || !access.chooseable) return null;

			const requiredCantrips = access.chooseCantripCount || 0;
			const requiredSpells = access.chooseSpellCount || 0;
			const totalRequired = requiredCantrips + requiredSpells;

			return { selected: selectedCount, total: totalRequired };
		} else if (sourceId.startsWith('subclass-')) {
			const sourceName = sourceId.replace('subclass-', '');
			const spellAccess = getSpellAccessForCharacter(character);
			const allAccess = spellAccess.filter(
				(sa) => sa.source === 'subclass' && sa.sourceName === sourceName
			);
			const chooseableAccess = allAccess.filter((sa) => sa.chooseable);
			if (chooseableAccess.length === 0) return null;

			const requiredCantrips = chooseableAccess.reduce((sum, access) => sum + (access.chooseCantripCount || 0), 0);
			const requiredSpells = chooseableAccess.reduce((sum, access) => sum + (access.chooseSpellCount || 0), 0);
			const totalRequired = requiredCantrips + requiredSpells;

			return { selected: selectedCount, total: totalRequired };
		} else if (sourceId.startsWith('feature-')) {
			const sourceName = sourceId.replace('feature-', '');
			const spellAccess = getSpellAccessForCharacter(character);
			const access = spellAccess.find(
				(sa) => sa.source === 'feature' && sa.sourceName === sourceName
			);
			if (!access || !access.chooseable) return null;

			const requiredCantrips = access.chooseCantripCount || 0;
			const requiredSpells = access.chooseSpellCount || 0;
			const totalRequired = requiredCantrips + requiredSpells;

			// Only count spells that were actually selected FROM THIS tab (not from base tabs)
			const actualSelectedCount = chooseableSpells.filter((spell) => {
				if (!selectedSpells.has(spell.name)) return false;
				// Check if this spell was selected from the current tab
				const selectedFrom = selectedSpells.get(spell.name)?.tabSource;
				return selectedFrom === sourceName;
			}).length;

			return { selected: actualSelectedCount, total: totalRequired };
		} else if (sourceId === 'cantrips') {
			return { selected: selectedCantripCount, total: spellLimits.cantrips };
		} else if (sourceId === 'level1') {
			if (spellLimits.isSharedLimits) {
				return { selected: selectedLeveledCount, total: spellLimits.sharedLeveled, shared: true };
			} else {
				return { selected: selectedLevel1Count, total: spellLimits.level1 };
			}
		} else if (sourceId === 'level2') {
			if (spellLimits.isSharedLimits) {
				return { selected: selectedLeveledCount, total: spellLimits.sharedLeveled, shared: true };
			} else {
				return { selected: selectedLevel2Count, total: spellLimits.level2 };
			}
		}

		return null;
	}

	// Get section description for current tab
	function getSectionDescription(sourceId: string): string {
		if (sourceId === 'cantrips') {
			return 'Cantrips are simple spells that you can cast at will, without expending spell slots.';
		} else if (sourceId === 'level1') {
			return 'First-level spells require spell slots to cast. You regain all spell slots on a long rest.';
		} else if (sourceId === 'level2') {
			return 'Second-level spells require spell slots to cast. You regain all spell slots on a long rest.';
		} else if (sourceId.startsWith('race-')) {
			const sourceName = sourceId.replace('race-', '');
			return `Spells granted by your ${sourceName} heritage.`;
		} else if (sourceId.startsWith('subclass-')) {
			const sourceName = sourceId.replace('subclass-', '');
			return `Spells granted by your ${sourceName} features.`;
		} else if (sourceId.startsWith('feature-')) {
			const sourceName = sourceId.replace('feature-', '');
			return `Spells granted by your ${sourceName} feature.`;
		}
		return '';
	}

	// Helper function to check if a spell should be filtered out (rare use)
	function shouldFilterSpell(spell: Spell): boolean {
		// Never filter if toggle is off (showing rare use spells)
		if ($showRareUseSpells) return false;
		
		// Never filter if spell is already selected (user chose it)
		if (selectedSpells.has(spell.name)) return false;
		
		// Filter if marked as rare use
		return spell.isRareUse === true;
	}

	// Get tag icon path
	function getTagIconPath(tag: SpellTag): string {
		return `/spell_tag_icons/${tag}.png`;
	}

	// Get all spells that are already granted or selected from other sources
	function getUnavailableSpells(character: any, currentSourceId: string): Set<string> {
		const unavailable = new Set<string>();
		const spellAccess = getSpellAccessForCharacter(character);

		// Get current source details for comparison
		const currentSourceType = currentSourceId.startsWith('race-')
			? 'race'
			: currentSourceId.startsWith('subclass-')
				? 'subclass'
				: currentSourceId.startsWith('feature-')
					? 'feature'
					: 'class';
		// For basic level tabs (cantrips, level1, level2), use the tab ID as the source name
		// This matches what's stored in selectedSpells by toggleSpell
		const currentSourceName = currentSourceId.startsWith('race-')
			? currentSourceId.replace('race-', '')
			: currentSourceId.startsWith('subclass-')
				? currentSourceId.replace('subclass-', '')
				: currentSourceId.startsWith('feature-')
					? currentSourceId.replace('feature-', '')
					: currentSourceId; // Use the full tab ID for basic level tabs

		// Get all auto-granted spells from OTHER sources (not current source)
		spellAccess.forEach((access) => {
			if (!access.chooseable) {
				// For main level tabs (cantrips, level1, level2), show all auto-granted spells as unavailable
				// including domain/circle/oath spells to create the dual display effect
				const isMainLevelTab = currentSourceType === 'class';

				// Only add spells if they're from a different source than current
				// OR if we're viewing main level tabs and this is a subclass auto-granted spell
				const isDifferentSource =
					access.source !== currentSourceType ||
					(currentSourceName && access.sourceName !== currentSourceName);
				const isSubclassAutoGranted = isMainLevelTab && access.source === 'subclass';

				if (isDifferentSource || isSubclassAutoGranted) {
					// Add auto-granted spells from other sources
					if (access.spells) {
						access.spells.forEach((spellName) => unavailable.add(spellName));
					}
					if (access.cantrips) {
						access.cantrips.forEach((spellName) => unavailable.add(spellName));
					}
				}
			}
		});

		// Get all currently selected spells from other sources
		for (let level = 0; level <= 2; level++) {
			const availableSpells = getAvailableSpells(level, character);
			// Group spells by name to check if ANY version matches current source
			const spellsByName = new Map<string, any[]>();
			availableSpells.forEach((spell) => {
				if (!spellsByName.has(spell.name)) {
					spellsByName.set(spell.name, []);
				}
				spellsByName.get(spell.name)!.push(spell);
			});

			spellsByName.forEach((spellVersions, spellName) => {
				if (selectedSpells.has(spellName)) {
					// Check WHERE this spell was selected from
					const selectedFromSource = selectedSpells.get(spellName)?.tabSource;

					// If spell was selected from current tab, don't mark as unavailable
					if (selectedFromSource === currentSourceName) {
						return; // Skip - this spell belongs to current tab
					}

					// Check if ANY version of this spell matches the current source
					const matchingVersions = spellVersions.filter((spell) => {
						return (
							spell.source === currentSourceType &&
							(!currentSourceName || spell.sourceName === currentSourceName)
						);
					});

					// If spell exists in current tab's spell list, mark it as unavailable
					// (it was selected from a different tab but is available here too)
					if (matchingVersions.length > 0) {
						unavailable.add(spellName);
					}
				}
			});
		}

		return unavailable;
	}

	// Check if more spells can be selected for the current tab
	// For unified subclasses, this needs to consider the specific spell being selected
	function canSelectMoreSpells(sourceId: string, spell?: any): boolean {
		if (sourceId === 'cantrips') {
			return canSelectMoreCantrips;
		} else if (sourceId === 'level1') {
			return canSelectMoreLevel1;
		} else if (sourceId === 'level2') {
			return canSelectMoreLevel2;
		} else if (
			sourceId.startsWith('race-') ||
			sourceId.startsWith('subclass-') ||
			sourceId.startsWith('feature-')
		) {
			// For race and subclass sources, use the reactive currentTabSelectionInfo if it's the active tab
			if (sourceId === activeTab && currentTabSelectionInfo) {
				// For unified subclasses with separate cantrip/spell limits
				if (currentTabSelectionInfo.cantrips && currentTabSelectionInfo.spells && spell) {
					if ((spell as any).spellSection === 'cantrips') {
						return (
							currentTabSelectionInfo.cantrips.selected < currentTabSelectionInfo.cantrips.total
						);
					} else if (
						(spell as any).spellSection === 'level1' ||
						(spell as any).spellSection === 'level2'
					) {
						return currentTabSelectionInfo.spells.selected < currentTabSelectionInfo.spells.total;
					}
				}
				// Default case
				return currentTabSelectionInfo.selected < currentTabSelectionInfo.total;
			}
			// Fallback to function call for non-active tabs (shouldn't happen in practice)
			const info = getSelectionCountInfo(character, sourceId);
			return info ? info.selected < info.total : false;
		}
		return false;
	}

	// Get appropriate text for unavailable spells based on their source
	function getUnavailableText(spellName: string, character: any): string {
		const spellAccess = getSpellAccessForCharacter(character);

		// Find which source grants this spell as auto-granted
		for (const access of spellAccess) {
			if (!access.chooseable) {
				const hasSpell =
					(access.spells && access.spells.includes(spellName)) ||
					(access.cantrips && access.cantrips.includes(spellName));

				if (hasSpell) {
					// Oath spells show specific oath name with (auto)
					if (access.source === 'subclass' && access.sourceName.includes('Oath')) {
						return 'Duplicate';
					}
					// Domain/Circle spells are "always prepared"
					else if (
						access.source === 'subclass' &&
						(access.sourceName.includes('Domain') || access.sourceName.includes('Circle'))
					) {
						// Check if it's a domain spell to show specific domain name
						if (access.sourceName.includes('Domain')) {
							return 'Duplicate';
						}
						// Other circle spells
						return 'Duplicate';
					}
					// Other auto-granted spells are "already known"
					return 'Already Known';
				}
			}
		}

		// Default fallback
		return 'Already Known';
	}

	$: character = $character_store;
	$: spellAccess = getSpellAccessForCharacter(character);
	$: availableCantrips = character.class ? getAvailableSpells(0, character) : [];
	$: availableLevel1 = character.class ? getAvailableSpells(1, character) : [];
	$: availableLevel2 = character.class ? getAvailableSpells(2, character) : [];
	$: spellLimits = getSpellLimits(character);

	// Restore spell selections when character changes
	// Note: Cleanup of invalid spells is now handled globally by the spell_cleanup service
	// which runs independently of this component
	$: {
		if (character) {
			restoreSpellSelectionsFromStore();
			// IMPORTANT: After restoring, persist to character.spells so conflict detection can see them
			persistSpellSelections();
		}
	}

	// Get unified subclasses for reactive calculations
	$: unifiedSubclassNames = character.class
		? spellAccess
				.filter(
					(access) =>
						access.source === 'subclass' &&
						access.chooseable &&
						(access.chooseCantripCount ?? 0) > 0 &&
						(access.chooseSpellCount ?? 0) > 0
				)
				.map((access) => access.sourceName)
		: [];

	// Reactive variables for spell limits (ensures UI updates when selections change)
	// Only count class/subclass spells toward limits, not race-based bonus spells, extended subclass entries, or feature sources
	// Feature sources have their own separate tabs and shouldn't count toward base class tabs
	// Also exclude spells that were selected from feature tabs (like Pact of the Tome)
	$: selectedCantripCount = availableCantrips.filter(
		(s) => {
			if (!s.chooseable || !selectedSpells.has(s.name)) return false;
			if (s.source === 'feature') return false;
			// Exclude Circle of Land spells from standard tab counts
			if (s.source === 'subclass' && s.sourceName.includes('Circle of the Land')) return false;
			if (!(s.source === 'class' || (s.source === 'subclass' && !s.sourceName.includes(' - ')))) return false;
			
			// Check if this spell was selected from a feature tab or special subclass tab - if so, don't count it
			const meta = selectedSpells.get(s.name);
			if (meta && meta.tabSource) {
				// Exclude spells selected from feature tabs
				if (meta.tabSource.includes('Pact of the') || meta.tabSource.includes('Book of Ancient')) {
					return false;
				}
				// Exclude spells selected from special subclass tabs (Circle of Land, etc.)
				if (meta.tabSource.includes('Circle of the Land')) {
					return false;
				}
			}
			
			return true;
		}
	).length;
	$: selectedLevel1Count = availableLevel1.filter(
		(s) => {
			if (!s.chooseable || !selectedSpells.has(s.name)) return false;
			if (s.source === 'feature') return false;
			// Exclude Circle of Land spells from standard tab counts
			if (s.source === 'subclass' && s.sourceName.includes('Circle of the Land')) return false;
			if (!(s.source === 'class' || (s.source === 'subclass' && !s.sourceName.includes(' - ')))) return false;
			
			// Check if this spell was selected from a feature tab or special subclass tab - if so, don't count it
			const meta = selectedSpells.get(s.name);
			if (meta && meta.tabSource) {
				// Exclude spells selected from feature tabs
				if (meta.tabSource.includes('Pact of the') || meta.tabSource.includes('Book of Ancient')) {
					return false;
				}
				// Exclude spells selected from special subclass tabs (Circle of Land, etc.)
				if (meta.tabSource.includes('Circle of the Land')) {
					return false;
				}
			}
			
			return true;
		}
	).length;
	$: selectedLevel2Count = availableLevel2.filter(
		(s) => {
			if (!s.chooseable || !selectedSpells.has(s.name)) return false;
			if (s.source === 'feature') return false;
			// Exclude Circle of Land spells from standard tab counts
			if (s.source === 'subclass' && s.sourceName.includes('Circle of the Land')) return false;
			if (!(s.source === 'class' || (s.source === 'subclass' && !s.sourceName.includes(' - ')))) return false;
			
			// Check if this spell was selected from a feature tab or special subclass tab - if so, don't count it
			const meta = selectedSpells.get(s.name);
			if (meta && meta.tabSource) {
				// Exclude spells selected from feature tabs
				if (meta.tabSource.includes('Pact of the') || meta.tabSource.includes('Book of Ancient')) {
					return false;
				}
				// Exclude spells selected from special subclass tabs (Circle of Land, etc.)
				if (meta.tabSource.includes('Circle of the Land')) {
					return false;
				}
			}
			
			return true;
		}
	).length;
	$: selectedLeveledCount = selectedLevel1Count + selectedLevel2Count;

	// Reactive variables for remaining spell slots
	$: canSelectMoreCantrips = selectedCantripCount < spellLimits.cantrips;
	$: canSelectMoreLevel1 = spellLimits.isSharedLimits
		? selectedLeveledCount < spellLimits.sharedLeveled
		: selectedLevel1Count < spellLimits.level1;
	$: canSelectMoreLevel2 = spellLimits.isSharedLimits
		? selectedLeveledCount < spellLimits.sharedLeveled
		: selectedLevel2Count < spellLimits.level2;

	// Reactive tab system
	$: spellSources = hasSpellAccess(character) ? getSpellSources(character) : [];
	$: {
		// Auto-select first available tab if none selected or current tab doesn't exist
		if (spellSources.length > 0 && (!activeTab || !spellSources.find((s) => s.id === activeTab))) {
			activeTab = spellSources[0].id;
		}
	}
	$: currentTabSpells = activeTab ? getSpellsForSource(character, activeTab) : [];
	// Force recalculation when toggle changes
	$: if ($showRareUseSpells !== undefined && activeTab) {
		currentTabSpells = getSpellsForSource(character, activeTab);
	}
	$: currentTabUnavailableSpells = activeTab
		? getUnavailableSpells(character, activeTab)
		: new Set();

	// Reactive selection counts for current tab
	$: currentTabSelectionInfo = (() => {
		if (!activeTab) return null;

		const spells = currentTabSpells;
		const chooseableSpells = spells.filter((spell) => spell.chooseable);
		// Only count spells that are actually in THIS tab's spell list
		// This prevents spells from other tabs (like other Arcane Trickster tabs) from being counted
		const selectedCount = chooseableSpells.filter((spell) => selectedSpells.has(spell.name)).length;

		if (activeTab.startsWith('race-')) {
			const sourceName = activeTab.replace('race-', '');
			const spellAccess = getSpellAccessForCharacter(character);
			const access = spellAccess.find((sa) => sa.source === 'race' && sa.sourceName === sourceName);
			if (!access || !access.chooseable) return null;

			const requiredCantrips = access.chooseCantripCount ?? 0;
			const requiredSpells = access.chooseSpellCount ?? 0;
			const totalRequired = requiredCantrips + requiredSpells;

			return { selected: selectedCount, total: totalRequired };
		} else if (activeTab.startsWith('subclass-')) {
			const sourceName = activeTab.replace('subclass-', '');
			const spellAccess = getSpellAccessForCharacter(character);
			// Find ALL access entries for this subclass (there may be multiple with different restrictions)
			const allAccess = spellAccess.filter(
				(sa) => sa.source === 'subclass' && sa.sourceName === sourceName
			);
			const chooseableAccess = allAccess.filter((sa) => sa.chooseable);
			if (chooseableAccess.length === 0) return null;

			// Count auto-granted spells for this tab (like Mage Hand for Arcane Trickster)
			const autoGrantedSpells = spells.filter((spell) => !spell.chooseable).length;

			// Aggregate cantrip and spell requirements from all entries
			const requiredCantrips = chooseableAccess.reduce((sum, access) => sum + (access.chooseCantripCount ?? 0), 0);
			const requiredSpells = chooseableAccess.reduce((sum, access) => sum + (access.chooseSpellCount ?? 0), 0);

			// For tabs with school restrictions, only count spells that match the restriction
			// This prevents double-counting between restricted and unrestricted tabs
			// Only count spells that were actually selected FROM THIS TAB
			// Check the stored source for each selected spell
			const actualSelectedCount = chooseableSpells.filter((spell) => {
				if (!selectedSpells.has(spell.name)) return false;
				// Check if this spell was selected from the current tab
				const selectedFrom = selectedSpells.get(spell.name)?.tabSource;
				return selectedFrom === sourceName;
			}).length;

			// For unified subclasses with both cantrips and spells, show separate counts
			if (requiredCantrips > 0 && requiredSpells > 0) {
				const cantripSpells = spells.filter((spell) => (spell as any).spellSection === 'cantrips');
				const leveledSpells = spells.filter(
					(spell) =>
						(spell as any).spellSection === 'level1' || (spell as any).spellSection === 'level2'
				);
				const selectedCantrips = cantripSpells.filter((spell) =>
					selectedSpells.has(spell.name)
				).length;
				const selectedLeveled = leveledSpells.filter((spell) =>
					selectedSpells.has(spell.name)
				).length;

				return {
					selected: selectedCantrips + selectedLeveled,
					total: requiredCantrips + requiredSpells,
					cantrips: { selected: selectedCantrips, total: requiredCantrips },
					spells: { selected: selectedLeveled, total: requiredSpells }
				};
			} else {
				// Simple case: only cantrips or only spells
				// Include auto-granted spells in both selected and total counts
				const totalRequired = requiredCantrips + requiredSpells;
				return { 
					selected: actualSelectedCount + autoGrantedSpells, 
					total: totalRequired + autoGrantedSpells 
				};
			}
		} else if (activeTab.startsWith('feature-')) {
			const sourceName = activeTab.replace('feature-', '');
			const spellAccess = getSpellAccessForCharacter(character);
			const access = spellAccess.find(
				(sa) => sa.source === 'feature' && sa.sourceName === sourceName
			);
			if (!access || !access.chooseable) return null;

			const requiredCantrips = access.chooseCantripCount ?? 0;
			const requiredSpells = access.chooseSpellCount ?? 0;
			const totalRequired = requiredCantrips + requiredSpells;

			// Only count spells that were actually selected FROM THIS tab (not from base tabs)
			const actualSelectedCount = chooseableSpells.filter((spell) => {
				if (!selectedSpells.has(spell.name)) return false;
				// Check if this spell was selected from the current tab
				const selectedFrom = selectedSpells.get(spell.name)?.tabSource;
				return selectedFrom === sourceName;
			}).length;

			return { selected: actualSelectedCount, total: totalRequired };
		} else if (activeTab === 'cantrips') {
			return { selected: selectedCantripCount, total: spellLimits.cantrips };
		} else if (activeTab === 'level1') {
			if (spellLimits.isSharedLimits) {
				return { selected: selectedLeveledCount, total: spellLimits.sharedLeveled, shared: true };
			} else {
				return { selected: selectedLevel1Count, total: spellLimits.level1 };
			}
		} else if (activeTab === 'level2') {
			if (spellLimits.isSharedLimits) {
				return { selected: selectedLeveledCount, total: spellLimits.sharedLeveled, shared: true };
			} else {
				return { selected: selectedLevel2Count, total: spellLimits.level2 };
			}
		}

		return null;
	})();
</script>

<div class="main-content">
	<!-- Show conflict warnings for this tab -->
	<ConflictWarning tabName="spells" />

	{#if !hasSpellAccess(character)}
		<div class="no-spells">
			<h2>🚫 No Spell Access</h2>
			<p>
				Your current class and race combination doesn't grant access to spells. Choose a
				spellcasting class or subclass to unlock the Spells tab!
			</p>
		</div>
	{:else}
		<!-- Spell Source Tabs -->
		<div class="spell-tabs">
			{#each spellSources as source}
				<button
					class="tab-btn"
					class:active={activeTab === source.id}
					class:completed={isTabCompleted(character, source.id)}
					on:click={() => setActiveTab(source.id)}
				>
					{source.name}
				</button>
			{/each}
		</div>

		<!-- Current Tab Content -->
		{#if activeTab && currentTabSpells.length > 0}
			{@const currentSource = spellSources.find((s) => s.id === activeTab)}
			{@const isUnifiedSubclass =
				activeTab.startsWith('subclass-') && currentTabSpells.some((s) => (s as any).spellSection)}
			{@const spellSections = isUnifiedSubclass
				? [
						{
							id: 'cantrips',
							name: 'Cantrips',
							spells: currentTabSpells.filter((s) => (s as any).spellSection === 'cantrips')
						},
						{
							id: 'level1',
							name: '1st Level Spells',
							spells: currentTabSpells.filter((s) => (s as any).spellSection === 'level1')
						},
						{
							id: 'level2',
							name: '2nd Level Spells',
							spells: currentTabSpells.filter((s) => (s as any).spellSection === 'level2')
						}
					].filter((section) => section.spells.length > 0)
				: [{ id: 'all', name: '', spells: currentTabSpells }]}

			<div class="spell-section">
				<h3>
					{currentSource?.name || 'Spells'}
					{#if currentTabSelectionInfo && currentTabSelectionInfo.total > 0}
						<span class="selection-count">
							{#if currentTabSelectionInfo.cantrips && currentTabSelectionInfo.spells}
								(Cantrips: {currentTabSelectionInfo.cantrips.selected}/{currentTabSelectionInfo
									.cantrips.total}, Spells: {currentTabSelectionInfo.spells
									.selected}/{currentTabSelectionInfo.spells.total})
							{:else}
								({currentTabSelectionInfo.selected}/{currentTabSelectionInfo.total}
								{currentTabSelectionInfo.shared ? 'total leveled spells' : ''} selected)
							{/if}
						</span>
					{/if}
				</h3>
				{#if !isUnifiedSubclass}
					<p class="section-description">
						{getSectionDescription(activeTab)}
					</p>
				{/if}

				{#each spellSections as section}
					{#if isUnifiedSubclass && section.name}
						<h4 class="spell-subsection-header">{section.name}</h4>
						{#if section.id === 'cantrips'}
							<p class="section-description">
								Cantrips are simple spells that you can cast at will, without expending spell slots.
							</p>
						{:else if section.id === 'level1'}
							<p class="section-description">
								First-level spells require spell slots to cast. You regain all spell slots on a long
								rest.
							</p>
						{:else if section.id === 'level2'}
							<p class="section-description">
								Second-level spells require spell slots to cast. You regain all spell slots on a
								long rest.
							</p>
						{/if}
					{/if}

					<div class="spell-list">
						{#each section.spells as spell}
							{@const isUnavailable = currentTabUnavailableSpells.has(spell.name)}
							<div
								class="spell-card"
								class:special={spell.source !== 'class'}
								class:auto-granted={!spell.chooseable}
								class:unavailable={isUnavailable}
								class:expanded={expandedSpells.has(spell.name)}
							>
								<div
									class="spell-header"
									on:click={() => toggleSpellExpansion(spell.name)}
									on:keydown={(e) => e.key === 'Enter' && toggleSpellExpansion(spell.name)}
									role="button"
									tabindex="0"
								>
									<div class="spell-title-section">
										{#if !spell.chooseable}
											<span class="auto-granted-indicator">✓</span>
										{/if}
										<span class="spell-name" class:racial-duplicate={spell.isRacialDuplicate}
											>{spell.name}</span
										>
										{#if spell.tags && spell.tags.length > 0}
											<span class="spell-tag-icons">
												{#each spell.tags as tag}
													<img 
														src={getTagIconPath(tag)} 
														alt={tag} 
														title={tag}
														class="tag-icon"
														on:error={(e) => e.currentTarget.style.display = 'none'}
													/>
												{/each}
											</span>
										{/if}
										{#if spell.isRacialDuplicate && spell.racialSource}
											<span class="spell-tag racial-tag">
												{spell.racialSource.toUpperCase()} (AUTO)
											</span>
										{:else if spell.source !== 'class'}
											<span class="spell-tag {spell.source}">
												{spell.sourceName.toUpperCase()}
												{#if !spell.chooseable}(AUTO){/if}
											</span>
										{/if}
										<!-- Show PATRON tag for warlock expanded spell list spells -->
										{#if spell.sourceName === 'Warlock'}
											{@const patronSpells = [
												'Faerie Fire', 'Sleep', 'Calm Emotions', 'Phantasmal Force',
												'Burning Hands', 'Command', 'Blindness/Deafness', 'Scorching Ray',
												'Dissonant Whispers', "Tasha's Hideous Laughter", 'Detect Thoughts'
											]}
											{#if patronSpells.includes(spell.name)}
												<span class="spell-tag patron-tag">
													PATRON
												</span>
											{/if}
										{/if}
									</div>
									{#if spell.chooseable}
										{#if spell.isRacialDuplicate}
											<button class="spell-button duplicate-button" disabled> Duplicate </button>
										{:else if isUnavailable}
											<span class="spell-status unavailable-status"
												>{getUnavailableText(spell.name, character)}</span
											>
										{:else if selectedSpells.has(spell.name)}
											{@const isBaseTab = activeTab === 'cantrips' || activeTab === 'level1' || activeTab === 'level2'}
											{@const isFeatureTab = activeTab.startsWith('feature-')}
											{@const selectedMeta = selectedSpells.get(spell.name)}
											{@const selectedFromFeature = selectedMeta && selectedMeta.tabSource && (selectedMeta.tabSource.includes('Pact of the') || selectedMeta.tabSource.includes('Book of Ancient') || selectedMeta.tabSource.includes('Circle of the Land'))}
											{@const selectedFromBase = selectedMeta && selectedMeta.tabSource && (selectedMeta.tabSource === 'cantrips' || selectedMeta.tabSource === 'level1' || selectedMeta.tabSource === 'level2')}
											{@const showAlreadyKnown = (isBaseTab && selectedFromFeature) || (isFeatureTab && selectedFromBase)}
											{#if showAlreadyKnown}
												<span class="spell-status unavailable-status">Already Known</span>
											{:else}
												<button
													class="spell-button delete-button"
													on:click|stopPropagation={() =>
														toggleSpell(spell.name, spell.chooseable, spell)}
												>
													Delete
												</button>
											{/if}
										{:else}
											<button
												class="spell-button learn-button"
												disabled={!canSelectMoreSpells(activeTab, spell)}
												on:click|stopPropagation={() =>
													toggleSpell(spell.name, spell.chooseable, spell)}
											>
												{getSpellButtonText(spell.level, character)}
											</button>
										{/if}
									{:else if isUnavailable}
										<span class="spell-status unavailable-status">Duplicate</span>
									{/if}
									<span class="expand-icon">{expandedSpells.has(spell.name) ? '−' : '+'}</span>
								</div>
								{#if expandedSpells.has(spell.name)}
									<div class="spell-details">
										<div class="spell-level-school">{getSpellLevelText(spell)}</div>
										<div class="spell-meta">
											<div><strong>Casting Time:</strong> {spell.castingTime}</div>
											<div><strong>Range/Area:</strong> {spell.range}</div>
											<div><strong>Components:</strong> {formatComponents(spell.components)}</div>
											<div><strong>Duration:</strong> {spell.duration}</div>
										</div>
										<div class="spell-description">
											{@html formatDescription(spell.description)}
										</div>
										{#if spell.higherLevel}
											<div class="spell-higher-level">
												<strong>At Higher Levels:</strong>
												{@html formatDescription(spell.higherLevel)}
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
		
		<!-- Floating toggle for rare use spell filtering -->
		{#if hasSpellAccess(character)}
			<div class="floating-toggle">
				<div class="toggle-label">{$showRareUseSpells ? 'All Spells' : 'Recommended'}</div>
				<label class="toggle-switch">
					<input 
						type="checkbox" 
						checked={$showRareUseSpells}
						on:change={() => showRareUseSpells.set(!$showRareUseSpells)}
					/>
					<span class="toggle-slider"></span>
				</label>
			</div>
		{/if}
	{/if}
</div>

<style>
	.main-content {
		padding: 2rem 1rem;
		padding-top: 80px;
		max-width: 50vw;
		margin: 0 auto;
	}

	.no-spells {
		background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
		border: 2px solid #d1d5db;
		border-radius: 12px;
		padding: 3rem 2rem;
		text-align: center;
		margin: 2rem auto;
		max-width: 600px;
	}

	.no-spells h2 {
		font-size: 2rem;
		color: #6b7280;
		margin-bottom: 1rem;
	}

	/* Tab styling */
	.spell-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.tab-btn {
		padding: 0.5rem 1rem;
		border: 2px solid #d1d5db;
		border-radius: 8px;
		background: #ffffff;
		color: #374151;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab-btn:hover {
		border-color: #3b82f6;
		background: #f0f9ff;
		color: #1e40af;
	}

	.tab-btn.active {
		border-color: #3b82f6;
		background: #3b82f6;
		color: #ffffff;
		font-weight: 600;
	}

	.tab-btn.active:hover {
		background: #2563eb;
		border-color: #2563eb;
	}

	.tab-btn.completed {
		border-color: #10b981;
		background: #10b981;
		color: #ffffff;
		font-weight: 600;
	}

	.tab-btn.completed:hover {
		background: #059669;
		border-color: #059669;
	}

	.tab-btn.completed.active {
		background: #3b82f6;
		border-color: #3b82f6;
	}

	.spell-section {
		margin-bottom: 2rem;
	}

	.spell-section h3 {
		font-size: 1.5rem;
		color: #1f2937;
		margin-bottom: 0.5rem;
		border-bottom: 2px solid #e5e7eb;
		padding-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.selection-count {
		font-size: 0.9rem;
		color: #6b7280;
		font-weight: normal;
	}

	.section-description {
		color: #6b7280;
		font-size: 0.95rem;
		margin-bottom: 1rem;
		font-style: italic;
	}

	.spell-subsection-header {
		font-size: 1.25rem;
		color: #374151;
		margin: 2rem 0 1rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #e5e7eb;
		font-weight: 600;
	}

	.spell-subsection-header:first-of-type {
		margin-top: 1rem;
	}

	.spell-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.spell-card {
		border: 1px solid #d1d5db;
		border-radius: 8px;
		background: #f9fafb;
		transition: all 0.2s ease;
		overflow: hidden;
	}

	.spell-card:hover {
		border-color: #3b82f6;
		background: #f0f9ff;
	}

	.spell-card.special {
		border-left: 4px solid #10b981;
		background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
	}

	.spell-card.auto-granted {
		border-left: 4px solid #8b5cf6;
		background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
	}

	.spell-card.unavailable {
		border-left: 4px solid #9ca3af;
		background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
		opacity: 0.6;
		pointer-events: none;
	}

	.spell-card.unavailable .spell-name {
		color: #6b7280;
		text-decoration: line-through;
	}

	.spell-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.spell-header:hover {
		background-color: rgba(59, 130, 246, 0.05);
	}

	.spell-title-section {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
	}

	.spell-button {
		padding: 0.25rem 0.75rem;
		border: 1px solid transparent;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		margin-right: 0.5rem;
	}

	.learn-button {
		background: #10b981;
		color: white;
		border-color: #10b981;
	}

	.learn-button:hover:not(:disabled) {
		background: #059669;
		border-color: #059669;
	}

	.learn-button:disabled {
		background: #d1d5db;
		color: #9ca3af;
		border-color: #d1d5db;
		cursor: not-allowed;
	}

	.delete-button {
		background: #ef4444;
		color: white;
		border-color: #ef4444;
	}

	.delete-button:hover {
		background: #dc2626;
		border-color: #dc2626;
	}

	.expand-icon {
		color: #6b7280;
		font-size: 0.9rem;
		transition: transform 0.2s ease;
	}

	.spell-status {
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 500;
		margin-right: 0.5rem;
	}

	.unavailable-status {
		background: #f3f4f6;
		color: #6b7280;
		border: 1px solid #d1d5db;
	}

	.spell-card.expanded .expand-icon {
		transform: rotate(0deg);
	}

	.spell-details {
		padding: 0 1rem 1rem 1rem;
		border-top: 1px solid #e5e7eb;
		background: rgba(255, 255, 255, 0.5);
	}

	.spell-level-school {
		font-size: 0.9rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.75rem;
		padding-top: 0.75rem;
		text-transform: capitalize;
	}

	.spell-meta {
		display: grid;
		gap: 0.25rem;
		margin-bottom: 0.75rem;
		font-size: 0.85rem;
	}

	.spell-meta strong {
		color: #374151;
	}

	.auto-granted-indicator {
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #8b5cf6;
		color: white;
		border-radius: 3px;
		font-size: 0.7rem;
		font-weight: bold;
	}

	.spell-name {
		font-weight: 600;
		color: #1f2937;
		font-size: 1.05rem;
	}

	.spell-name.racial-duplicate {
		text-decoration: line-through;
		color: #6b7280;
	}

	.spell-tag {
		font-size: 0.7rem;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-weight: 500;
		text-transform: uppercase;
		margin-left: 0.5rem;
	}

	.spell-tag.race {
		background: #ddd6fe;
		color: #5b21b6;
	}

	.spell-tag.subclass {
		background: #fef3c7;
		color: #92400e;
	}

	.spell-tag.feature {
		background: #e0e7ff;
		color: #3730a3;
	}

	.spell-tag.patron-tag {
		background: #fce7f3;
		color: #9f1239;
	}

	.spell-tag.racial-tag {
		background: #fde2e7;
		color: #be185d;
	}

	.spell-description {
		color: #4b5563;
		font-size: 0.9rem;
		line-height: 1.5;
		margin-bottom: 0.5rem;
	}

	.spell-higher-level {
		color: #6b7280;
		font-size: 0.85rem;
		line-height: 1.5;
		font-style: italic;
		padding-top: 0.5rem;
		border-top: 1px solid #f3f4f6;
	}

	.duplicate-button {
		background: #f3f4f6;
		color: #6b7280;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: not-allowed;
		opacity: 0.6;
	}

	/* Spell tag icons */
	.spell-tag-icons {
		display: inline-flex;
		gap: 0.25rem;
		align-items: center;
		margin-left: 0.5rem;
	}

	.tag-icon {
		height: 60px;
		width: auto;
		display: inline-block;
		vertical-align: middle;
	}

	/* Floating toggle slider styling (similar to background tab) */
	.floating-toggle {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background-color: white;
		border: 2px solid #ccc;
		border-radius: 50px;
		padding: 0.75rem 1.25rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		z-index: 100;
		transition: box-shadow 0.3s ease;
	}

	.floating-toggle:hover {
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
	}

	.toggle-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #374151;
		white-space: nowrap;
	}

	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 48px;
		height: 24px;
	}

	.toggle-switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #2563eb;
		transition: 0.3s;
		border-radius: 24px;
	}

	.toggle-slider:before {
		position: absolute;
		content: '';
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: 0.3s;
		border-radius: 50%;
	}

	input:checked + .toggle-slider {
		background-color: #10b981;
	}

	input:checked + .toggle-slider:before {
		transform: translateX(24px);
	}

	/* Mobile responsive adjustments */
	@media (max-width: 768px) {
		.floating-toggle {
			bottom: 1rem;
			right: 1rem;
			padding: 0.5rem 1rem;
			gap: 0.5rem;
		}

		.toggle-label {
			font-size: 0.8rem;
		}

		.toggle-switch {
			width: 40px;
			height: 20px;
		}

		.toggle-slider:before {
			height: 14px;
			width: 14px;
		}

		input:checked + .toggle-slider:before {
			transform: translateX(20px);
		}
	}
</style>
