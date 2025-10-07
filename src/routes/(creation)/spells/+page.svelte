<script lang="ts">
	import ConflictWarning from '$lib/components/ConflictWarning.svelte';
	import { character_store, hasSpellAccess } from '$lib/stores/character_store';
	import { applyChoice } from '$lib/stores/character_store_helpers';
	import {
		spells,
		getSpellsByLevel,
		getSpellAccessForCharacter,
		type SpellAccess,
		type Spell
	} from '$lib/data/spells';

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

				// This access allows choosing from specific class lists
				access.chooseFrom.forEach((className) => {
					const classSpells = levelSpells.filter((spell) => spell.classes.includes(className));
					classSpells.forEach((spell) => {
						if (!availableSpells.find((s) => s.name === spell.name)) {
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
						const existingSpell = availableSpells.find((s) => s.name === spell.name);

						if (!existingSpell) {
							// Add new spell
							availableSpells.push({
								...spell,
								source: access.source,
								sourceName: access.sourceName,
								chooseable: access.chooseable !== false
							});
						} else if (
							access.source === 'subclass' &&
							access.sourceName.includes('Oath') &&
							existingSpell.source === 'class'
						) {
							// Replace class source with oath source for oath spells to show proper tags
							existingSpell.source = access.source;
							existingSpell.sourceName = access.sourceName;
							existingSpell.chooseable = access.chooseable !== false;
						}
					}
				});
			}

			// Add cantrips
			if (access.cantrips && spellLevel === 0) {
				access.cantrips.forEach((spellName) => {
					const spell = spells.find((s) => s.name === spellName && s.level === 0);
					if (spell) {
						const existingSpell = availableSpells.find((s) => s.name === spell.name);

						if (!existingSpell) {
							// Add new spell
							availableSpells.push({
								...spell,
								source: access.source,
								sourceName: access.sourceName,
								chooseable: access.chooseable !== false
							});
						} else if (
							access.source === 'subclass' &&
							access.sourceName.includes('Oath') &&
							existingSpell.source === 'class'
						) {
							// Replace class source with oath source for oath spells to show proper tags
							existingSpell.source = access.source;
							existingSpell.sourceName = access.sourceName;
							existingSpell.chooseable = access.chooseable !== false;
						}
					}
				});
			}
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
				// Only count class and subclass access toward limits, not race/feat bonuses
				const countsTowardLimits =
					access.source === 'class' || access.source === 'subclass' || access.source === 'feature';

				// Handle new format with separate cantrip and spell counts
				if (access.chooseCantripCount !== undefined || access.chooseSpellCount !== undefined) {
					if (access.chooseFrom && access.chooseFrom.length > 0) {
						// Determine what spells this access can choose (respecting maxSpellLevel)
						const canChooseCantrips = getSpellsByLevel(0).some((spell) =>
							access.chooseFrom!.some((className) => spell.classes.includes(className))
						);
						const canChooseLevel1 =
							(access.maxSpellLevel === undefined || access.maxSpellLevel >= 1) &&
							getSpellsByLevel(1).some((spell) =>
								access.chooseFrom!.some((className) => spell.classes.includes(className))
							);
						const canChooseLevel2 =
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
						// Determine what spells this access can choose (respecting maxSpellLevel)
						const canChooseCantrips = getSpellsByLevel(0).some((spell) =>
							access.chooseFrom!.some((className) => spell.classes.includes(className))
						);
						const canChooseLevel1 =
							(access.maxSpellLevel === undefined || access.maxSpellLevel >= 1) &&
							getSpellsByLevel(1).some((spell) =>
								access.chooseFrom!.some((className) => spell.classes.includes(className))
							);
						const canChooseLevel2 =
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
	let selectedSpells = new Set();
	let expandedSpells = new Set();
	let activeTab = ''; // Current active tab ID

	function toggleSpell(spellName: string, chooseable: boolean, spell?: any) {
		if (!chooseable) return; // Can't toggle non-chooseable spells

		// Check if we can add more spells before allowing selection
		if (!selectedSpells.has(spellName) && !canSelectMoreSpells(activeTab, spell)) {
			return; // Can't select more spells
		}

		if (selectedSpells.has(spellName)) {
			selectedSpells.delete(spellName);
		} else {
			selectedSpells.add(spellName);
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
		const spellSelections = {
			spells: Array.from(selectedSpells) as string[]
		};

		applyChoice(scopeId, spellSelections);
	}

	// Restore spell selections from character store
	function restoreSpellSelectionsFromStore() {
		const char = $character_store;
		if (!char._provenance) return;

		const scopeId = 'spell_selections';
		const provenanceData = char._provenance[scopeId];

		if (provenanceData) {
			// Access data from _set property (character store wraps our data)
			const actualData = (provenanceData as any)._set || provenanceData;

			if (actualData.spells && Array.isArray(actualData.spells)) {
				selectedSpells = new Set(actualData.spells);
			}
		}
	}

	// Check if we've reached the selection limit for a spell level
	function canSelectMore(spellLevel: number, character: any): boolean {
		const limits = getSpellLimits(character);

		if (spellLevel === 0) {
			// Cantrips are always separate
			const availableCantrips = getAvailableSpells(0, character);
			const selectedCount = availableCantrips.filter(
				(spell) => spell.chooseable && selectedSpells.has(spell.name)
			).length;
			return selectedCount < limits.cantrips;
		} else if (limits.isSharedLimits && (spellLevel === 1 || spellLevel === 2)) {
			// For shared limits, count all leveled spells together
			const availableLevel1 = getAvailableSpells(1, character);
			const availableLevel2 = getAvailableSpells(2, character);
			const selectedLevel1Count = availableLevel1.filter(
				(spell) => spell.chooseable && selectedSpells.has(spell.name)
			).length;
			const selectedLevel2Count = availableLevel2.filter(
				(spell) => spell.chooseable && selectedSpells.has(spell.name)
			).length;
			const totalSelectedLeveled = selectedLevel1Count + selectedLevel2Count;
			return totalSelectedLeveled < limits.sharedLeveled;
		} else {
			// Separate limits per level
			const availableSpells = getAvailableSpells(spellLevel, character);
			const selectedCount = availableSpells.filter(
				(spell) => spell.chooseable && selectedSpells.has(spell.name)
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

		// Add subclass-based sources (both chooseable and auto-granted)
		spellAccess.forEach((access) => {
			if (access.source === 'subclass') {
				// Check if this subclass source has any spells or cantrips
				const hasSpells =
					(access.spells && access.spells.length > 0) ||
					(access.cantrips && access.cantrips.length > 0) ||
					(access.chooseFrom && access.chooseFrom.length > 0);

				if (hasSpells) {
					sources.push({
						id: `${access.source}-${access.sourceName}`,
						name: access.sourceName,
						type: 'subclass',
						sourceName: access.sourceName,
						requiresChoices: access.chooseable === true
					});
				}
			}
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

		if (hasClassCantrips) {
			sources.push({
				id: 'cantrips',
				name: 'Cantrips',
				type: 'level',
				level: 0,
				requiresChoices: true
			});
		}

		if (hasClassLevel1) {
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
		if (sourceId === 'cantrips') {
			return getAvailableSpells(0, character).filter(
				(spell) =>
					spell.source === 'class' || spell.source === 'subclass' || spell.source === 'feature'
			);
		} else if (sourceId === 'level1') {
			return getAvailableSpells(1, character).filter(
				(spell) =>
					spell.source === 'class' || spell.source === 'subclass' || spell.source === 'feature'
			);
		} else if (sourceId === 'level2') {
			return getAvailableSpells(2, character).filter(
				(spell) =>
					spell.source === 'class' || spell.source === 'subclass' || spell.source === 'feature'
			);
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
			const access = spellAccess.find(
				(sa) => sa.source === 'subclass' && sa.sourceName === sourceName
			);

			if (!access) return [];

			// For unified subclasses (like Eldritch Knight), return both cantrips and spells
			// but mark them with section info for proper rendering
			const cantrips = getAvailableSpells(0, character)
				.filter((spell) => spell.source === 'subclass' && spell.sourceName === sourceName)
				.map((spell) => ({ ...spell, spellSection: 'cantrips' }));

			const level1 = getAvailableSpells(1, character)
				.filter((spell) => spell.source === 'subclass' && spell.sourceName === sourceName)
				.map((spell) => ({ ...spell, spellSection: 'level1' }));

			const level2 = getAvailableSpells(2, character)
				.filter((spell) => spell.source === 'subclass' && spell.sourceName === sourceName)
				.map((spell) => ({ ...spell, spellSection: 'level2' }));

			return [...cantrips, ...level1, ...level2];
		} else if (sourceId.startsWith('feature-')) {
			// Feature-based source (like Warlock invocations, Pact of the Tome, etc.)
			const sourceName = sourceId.replace('feature-', '');

			// Get the spell access configuration for this feature
			const spellAccess = getSpellAccessForCharacter(character);
			const access = spellAccess.find(
				(sa) => sa.source === 'feature' && sa.sourceName === sourceName
			);

			if (!access) return [];

			// Return cantrips and spells from this feature
			const cantrips = getAvailableSpells(0, character).filter(
				(spell) => spell.source === 'feature' && spell.sourceName === sourceName
			);

			const level1 = getAvailableSpells(1, character).filter(
				(spell) => spell.source === 'feature' && spell.sourceName === sourceName
			);

			const level2 = getAvailableSpells(2, character).filter(
				(spell) => spell.source === 'feature' && spell.sourceName === sourceName
			);

			return [...cantrips, ...level1, ...level2];
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

			const selectedCount = chooseableSpells.filter((spell) =>
				selectedSpells.has(spell.name)
			).length;
			const requiredCantrips = access.chooseCantripCount ?? 0;
			const requiredSpells = access.chooseSpellCount ?? 0;
			const totalRequired = requiredCantrips + requiredSpells;

			return selectedCount >= totalRequired;
		}

		// For subclass-based sources, check if the required number is selected
		if (sourceId.startsWith('subclass-')) {
			const sourceName = sourceId.replace('subclass-', '');
			const spellAccess = getSpellAccessForCharacter(character);
			const access = spellAccess.find(
				(sa) => sa.source === 'subclass' && sa.sourceName === sourceName
			);
			if (!access) return true;

			// If this source doesn't require choices (auto-granted), it's always complete
			if (!access.chooseable) return true;

			const selectedCount = chooseableSpells.filter((spell) =>
				selectedSpells.has(spell.name)
			).length;
			const requiredCantrips = access.chooseCantripCount ?? 0;
			const requiredSpells = access.chooseSpellCount ?? 0;
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

			const selectedCount = chooseableSpells.filter((spell) =>
				selectedSpells.has(spell.name)
			).length;
			const requiredCantrips = access.chooseCantripCount ?? 0;
			const requiredSpells = access.chooseSpellCount ?? 0;
			const totalRequired = requiredCantrips + requiredSpells;

			return selectedCount >= totalRequired;
		}

		// For level-based sources, check against spell limits
		if (sourceId === 'cantrips') {
			const selectedCount = chooseableSpells.filter((spell) =>
				selectedSpells.has(spell.name)
			).length;
			return selectedCount >= spellLimits.cantrips;
		} else if (sourceId === 'level1') {
			if (spellLimits.isSharedLimits) {
				return selectedLeveledCount >= spellLimits.sharedLeveled;
			} else {
				const selectedCount = chooseableSpells.filter((spell) =>
					selectedSpells.has(spell.name)
				).length;
				return selectedCount >= spellLimits.level1;
			}
		} else if (sourceId === 'level2') {
			if (spellLimits.isSharedLimits) {
				return selectedLeveledCount >= spellLimits.sharedLeveled;
			} else {
				const selectedCount = chooseableSpells.filter((spell) =>
					selectedSpells.has(spell.name)
				).length;
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
			const access = spellAccess.find(
				(sa) => sa.source === 'subclass' && sa.sourceName === sourceName
			);
			if (!access || !access.chooseable) return null;

			const requiredCantrips = access.chooseCantripCount || 0;
			const requiredSpells = access.chooseSpellCount || 0;
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

			return { selected: selectedCount, total: totalRequired };
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
		const currentSourceName = currentSourceId.startsWith('race-')
			? currentSourceId.replace('race-', '')
			: currentSourceId.startsWith('subclass-')
				? currentSourceId.replace('subclass-', '')
				: currentSourceId.startsWith('feature-')
					? currentSourceId.replace('feature-', '')
					: null;

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
			availableSpells.forEach((spell) => {
				if (selectedSpells.has(spell.name)) {
					// Only add to unavailable if it's from a different source
					const isDifferentSource =
						spell.source !== currentSourceType ||
						(currentSourceName && spell.sourceName !== currentSourceName);

					if (isDifferentSource) {
						unavailable.add(spell.name);
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
						return `${access.sourceName} (auto)`;
					}
					// Domain/Circle spells are "always prepared"
					else if (
						access.source === 'subclass' &&
						(access.sourceName.includes('Domain') || access.sourceName.includes('Circle'))
					) {
						return 'Always Prepared';
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
	$: {
		if (character) {
			restoreSpellSelectionsFromStore();
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
	// Only count class/subclass spells toward limits, not race-based bonus spells or unified subclasses
	$: selectedCantripCount = availableCantrips.filter(
		(s) =>
			s.chooseable &&
			selectedSpells.has(s.name) &&
			(s.source === 'class' ||
				(s.source === 'subclass' && !unifiedSubclassNames.includes(s.sourceName)) ||
				s.source === 'feature')
	).length;
	$: selectedLevel1Count = availableLevel1.filter(
		(s) =>
			s.chooseable &&
			selectedSpells.has(s.name) &&
			(s.source === 'class' ||
				(s.source === 'subclass' && !unifiedSubclassNames.includes(s.sourceName)) ||
				s.source === 'feature')
	).length;
	$: selectedLevel2Count = availableLevel2.filter(
		(s) =>
			s.chooseable &&
			selectedSpells.has(s.name) &&
			(s.source === 'class' ||
				(s.source === 'subclass' && !unifiedSubclassNames.includes(s.sourceName)) ||
				s.source === 'feature')
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
	$: spellSources = character.class ? getSpellSources(character) : [];
	$: {
		// Auto-select first available tab if none selected or current tab doesn't exist
		if (spellSources.length > 0 && (!activeTab || !spellSources.find((s) => s.id === activeTab))) {
			activeTab = spellSources[0].id;
		}
	}
	$: currentTabSpells = activeTab ? getSpellsForSource(character, activeTab) : [];
	$: currentTabUnavailableSpells = activeTab
		? getUnavailableSpells(character, activeTab)
		: new Set();

	// Reactive selection counts for current tab
	$: currentTabSelectionInfo = (() => {
		if (!activeTab) return null;

		const spells = currentTabSpells;
		const chooseableSpells = spells.filter((spell) => spell.chooseable);
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
			const access = spellAccess.find(
				(sa) => sa.source === 'subclass' && sa.sourceName === sourceName
			);
			if (!access || !access.chooseable) return null;

			const requiredCantrips = access.chooseCantripCount ?? 0;
			const requiredSpells = access.chooseSpellCount ?? 0;

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
				const totalRequired = requiredCantrips + requiredSpells;
				return { selected: selectedCount, total: totalRequired };
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

			return { selected: selectedCount, total: totalRequired };
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
										<span class="spell-name">{spell.name}</span>
										{#if spell.source !== 'class'}
											<span class="spell-tag {spell.source}">
												{spell.sourceName}
												{#if !spell.chooseable}(auto){/if}
											</span>
										{/if}
									</div>
									{#if spell.chooseable}
										{#if isUnavailable}
											<span class="spell-status unavailable-status"
												>{getUnavailableText(spell.name, character)}</span
											>
										{:else if selectedSpells.has(spell.name)}
											<button
												class="spell-button delete-button"
												on:click|stopPropagation={() =>
													toggleSpell(spell.name, spell.chooseable, spell)}
											>
												Delete
											</button>
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
</style>
