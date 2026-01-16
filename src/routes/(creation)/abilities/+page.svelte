<script lang="ts">
	import { character_store } from '$lib/stores/character_store';
	import { get } from 'svelte/store';
	import { getSpellAccessForCharacter, getSpellsByLevel } from '$lib/data/spells';

	const standardArray = [15, 14, 13, 12, 10, 8];
	const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

	// Class ability score recommendations (full ranking based on 2024 PHB)
	// Each class lists all 6 abilities in order of importance
	const classRecommendations: Record<string, { abilities: string[] }> = {
		Barbarian: { abilities: ['strength', 'constitution', 'dexterity', 'wisdom', 'charisma', 'intelligence'] },
		Bard: { abilities: ['charisma', 'dexterity', 'constitution', 'wisdom', 'intelligence', 'strength'] },
		Cleric: { abilities: ['wisdom', 'constitution', 'strength', 'charisma', 'dexterity', 'intelligence'] },
		Druid: { abilities: ['wisdom', 'constitution', 'intelligence', 'dexterity', 'strength', 'charisma'] },
		Fighter: { abilities: ['strength', 'constitution', 'dexterity', 'wisdom', 'intelligence', 'charisma'] },
		Monk: { abilities: ['dexterity', 'wisdom', 'constitution', 'strength', 'intelligence', 'charisma'] },
		Paladin: { abilities: ['strength', 'charisma', 'constitution', 'wisdom', 'dexterity', 'intelligence'] },
		Ranger: { abilities: ['dexterity', 'wisdom', 'constitution', 'strength', 'intelligence', 'charisma'] },
		Rogue: { abilities: ['dexterity', 'intelligence', 'constitution', 'charisma', 'wisdom', 'strength'] },
		Sorcerer: { abilities: ['charisma', 'constitution', 'dexterity', 'wisdom', 'intelligence', 'strength'] },
		Warlock: { abilities: ['charisma', 'constitution', 'dexterity', 'intelligence', 'wisdom', 'strength'] },
		Wizard: { abilities: ['intelligence', 'constitution', 'dexterity', 'wisdom', 'charisma', 'strength'] }
	};

	// Ability score information for popups
	const abilityInfo: Record<string, { title: string; description: string; affects: string[] }> = {
		strength: {
			title: 'Strength',
			description:
				"Measures your character's physical power and raw muscle. Strength determines how much you can carry and influences melee weapon attacks.",
			affects: [
				'Melee weapon attack rolls',
				'Melee weapon damage rolls',
				'Carrying capacity',
				'Athletics skill checks',
				'Jumping distance'
			]
		},
		dexterity: {
			title: 'Dexterity',
			description:
				'Measures agility, reflexes, and balance. Dexterity affects your Armor Class, initiative, and ranged attacks.',
			affects: [
				'Armor Class (when not wearing heavy armor)',
				'Initiative rolls',
				'Ranged weapon attacks',
				'Acrobatics and Stealth skills',
				'Dexterity saving throws'
			]
		},
		constitution: {
			title: 'Constitution',
			description:
				'Measures health, stamina, and vital force. Constitution affects your hit points and resistance to disease and poison.',
			affects: [
				'Hit points per level',
				'Constitution saving throws',
				'Concentration checks',
				'Resistance to disease and poison',
				'Death saving throws'
			]
		},
		intelligence: {
			title: 'Intelligence',
			description:
				'Measures reasoning ability, memory, and analytical thinking. Intelligence determines your ability to learn and recall information.',
			affects: [
				'Number of languages known',
				'Investigation and History skills',
				'Wizard spell preparation',
				'Intelligence saving throws',
				'General knowledge and reasoning'
			]
		},
		wisdom: {
			title: 'Wisdom',
			description:
				'Measures awareness, intuition, and attunement to surroundings. Wisdom affects perception and insight into others.',
			affects: [
				'Perception and Insight skills',
				'Wisdom saving throws',
				'Cleric and Druid spell preparation',
				'Passive Perception',
				'Animal Handling and Survival'
			]
		},
		charisma: {
			title: 'Charisma',
			description:
				'Measures force of personality, leadership ability, and confidence. Charisma affects social interactions and certain spellcasting.',
			affects: [
				'Social skill checks (Persuasion, Deception, Intimidation)',
				'Charisma saving throws',
				'Bard, Sorcerer, Warlock spells',
				'Leadership and performance',
				'Number of followers/hirelings'
			]
		}
	};

	// Popup state management
	let showPopup = false;
	let popupAbility: string | null = null;
	let popupPosition = { x: 0, y: 0 };

	// Modifier popup state management
	let showModifierPopup = false;
	let modifierPopupPosition = { x: 0, y: 0 };

	// Spell limit warning state management
	let showSpellLimitWarning = false;
	let spellLimitWarningInfo = { currentCount: 0, newLimit: 0, excessCount: 0 };

	function showAbilityInfo(ability: string, event: MouseEvent) {
		popupAbility = ability;
		// Position popup relative to viewport, with bounds checking
		const maxWidth = 350;
		const padding = 20;
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		let x = event.clientX + 10;
		let y = event.clientY - 10;

		// Keep popup within viewport bounds
		if (x + maxWidth > viewportWidth - padding) {
			x = event.clientX - maxWidth - 10;
		}
		if (y < padding) {
			y = padding;
		}
		if (y > viewportHeight - 200) {
			y = viewportHeight - 200;
		}

		popupPosition.x = Math.max(padding, x);
		popupPosition.y = Math.max(padding, y);
		showPopup = true;

		// Add keyboard listener for escape key
		document.addEventListener('keydown', handleKeydown);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			hideAbilityInfo();
		}
	}

	function hideAbilityInfo() {
		showPopup = false;
		popupAbility = null;
		// Remove keyboard listener
		document.removeEventListener('keydown', handleKeydown);
	}

	function showModifierInfo(event: MouseEvent) {
		// Position popup relative to viewport, with bounds checking
		const maxWidth = 300;
		const padding = 20;
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		let x = event.clientX + 10;
		let y = event.clientY - 10;

		// Keep popup within viewport bounds
		if (x + maxWidth > viewportWidth - padding) {
			x = event.clientX - maxWidth - 10;
		}
		if (y < padding) {
			y = padding;
		}
		if (y > viewportHeight - 300) {
			y = viewportHeight - 300;
		}

		modifierPopupPosition.x = Math.max(padding, x);
		modifierPopupPosition.y = Math.max(padding, y);
		showModifierPopup = true;

		// Add keyboard listener for escape key
		document.addEventListener('keydown', handleModifierKeydown);
	}

	function handleModifierKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			hideModifierInfo();
		}
	}

	function hideModifierInfo() {
		showModifierPopup = false;
		// Remove keyboard listener
		document.removeEventListener('keydown', handleModifierKeydown);
	}

	// Get current character state
	$: currentCharacter = $character_store;
	$: selectedClass = currentCharacter.class;
	$: selectedSubclass = currentCharacter.subclass;

	// Dynamic class recommendations (handles Rogue Arcane Trickster)
	$: classRecommendation = selectedClass
		? getClassRecommendation(selectedClass, selectedSubclass)
		: null;

	function getClassRecommendation(
		className: string,
		subclass?: string
	): { abilities: string[] } | null {
		// Special case: Arcane Trickster Rogue prioritizes Intelligence over Charisma
		if (className === 'Rogue' && subclass === 'Arcane Trickster') {
			return { abilities: ['dexterity', 'intelligence', 'constitution', 'wisdom', 'charisma', 'strength'] };
		}
		return classRecommendations[className] || null;
	}

	let selectedScores: Record<string, number | null> = {
		strength: null,
		dexterity: null,
		constitution: null,
		intelligence: null,
		wisdom: null,
		charisma: null
	};

	// Track if initial load has completed to prevent re-initialization
	let hasInitialized = false;

	// Track if we've auto-filled based on class
	let hasAutoFilled = false;

	// Initialize selected scores from current character state (only on first load)
	$: {
		if (!hasInitialized) {
			let hasAnyScore = false;
			for (const stat of stats) {
				const statValue = (currentCharacter as any)[stat];
				if (statValue && selectedScores[stat] === null) {
					// Subtract bonuses to get the base score
					const baseScore = statValue - (bonuses[stat] || 0);
					// Only set if the base score is valid (from standard array)
					// If baseScore <= 0, it means only bonuses exist with no real selection
					if (baseScore > 0) {
						selectedScores[stat] = baseScore;
						hasAnyScore = true;
					}
				}
			}
			// Mark as initialized after attempting to load scores
			if (hasAnyScore) {
				hasInitialized = true;
				hasAutoFilled = true; // If we loaded scores, consider it auto-filled
			} else if (Object.values(bonuses).some(b => b !== 0)) {
				// Has bonuses but no scores - mark as initialized but NOT auto-filled
				// This allows auto-fill to run when class is selected
				hasInitialized = true;
			} else {
				// No scores and no bonuses - fresh character, mark as initialized
				// so auto-fill can run when class is selected
				hasInitialized = true;
			}
		}
	}

	// Auto-fill ability scores based on class recommendation (only once)
	$: {
		if (hasInitialized && !hasAutoFilled && selectedClass && classRecommendation) {
			// Check if all scores are empty
			const allEmpty = stats.every(stat => selectedScores[stat] === null || selectedScores[stat] === 0);
			
			if (allEmpty) {
				// Auto-fill based on class recommendations
				const recommendations = classRecommendation.abilities;
				const sortedArray = [...standardArray].sort((a, b) => b - a); // Sort descending: [15, 14, 13, 12, 10, 8]
				
				// Assign scores in order of class recommendations
				// recommendations array now contains all 6 abilities in priority order
				for (let i = 0; i < recommendations.length && i < sortedArray.length; i++) {
					selectedScores[recommendations[i]] = sortedArray[i];
				}
				
				hasAutoFilled = true;
			}
		}
	}

	// Function to clear a specific ability score
	function clearScore(stat: string) {
		selectedScores[stat] = null;
	}

	// Enhanced bonus tracking with source information
	let bonuses: Record<string, number> = {
		strength: 0,
		dexterity: 0,
		constitution: 0,
		intelligence: 0,
		wisdom: 0,
		charisma: 0
	};

	$: {
		const state = get(character_store) as any; // <-- treat as 'any' for TS
		const provenance = state._provenance ?? {};

		// Reset bonuses
		bonuses = {
			strength: 0,
			dexterity: 0,
			constitution: 0,
			intelligence: 0,
			wisdom: 0,
			charisma: 0
		};

		// Sum all _mods
		for (const key in provenance) {
			const mods = provenance[key]?._mods;
			if (mods) {
				for (const stat of stats) {
					if (mods[stat] != null) {
						bonuses[stat] += mods[stat];
					}
				}
			}
		}
	}

	// Used scores for dropdown filtering
	// Filter out null and 0 (0 indicates only bonuses exist, not a real selection)
	$: usedScores = Object.values(selectedScores).filter((s) => s !== null && s > 0);

	// Apply ability scores to character store
	$: {
		const updates = {} as any;
		let hasChanges = false;

		for (const stat of stats) {
			if (selectedScores[stat] !== null && selectedScores[stat] > 0) {
				// User has selected a score - update the character store
				const totalScore = selectedScores[stat] + (bonuses[stat] || 0);
				if ((currentCharacter as any)[stat] !== totalScore) {
					updates[stat] = totalScore;
					hasChanges = true;
				}
			} else if (hasInitialized && (currentCharacter as any)[stat] !== undefined) {
				// User has cleared a score - remove it from character store
				// Only do this after initialization to avoid clearing during initial load
				updates[stat] = undefined;
				hasChanges = true;
			}
		}

		if (hasChanges) {
			character_store.update((char) => ({ ...char, ...updates }));
		}
	}

	// Monitor Charisma changes for Paladin spell limit validation
	$: {
		if (
			currentCharacter.class === 'Paladin' &&
			selectedScores.charisma !== null &&
			selectedScores.charisma > 0
		) {
			validatePaladinSpellLimit();
		}
	}

	// Monitor Wisdom changes for Cleric spell limit validation
	$: {
		if (
			currentCharacter.class === 'Cleric' &&
			selectedScores.wisdom !== null &&
			selectedScores.wisdom > 0
		) {
			validateClericSpellLimit();
		}
	}

	function getModifier(total: number): number {
		return Math.floor((total - 10) / 2);
	}

	function getModifierString(total: number): string {
		const mod = getModifier(total);
		return mod >= 0 ? `+${mod}` : `${mod}`;
	}

	function validatePaladinSpellLimit() {
		// Only validate if character has spells selected
		if (!currentCharacter.spells || currentCharacter.spells.length === 0) {
			return;
		}

		// Calculate new Charisma-based spell limit
		const totalCharisma = (selectedScores.charisma || 10) + (bonuses.charisma || 0);
		const charismaModifier = getModifier(totalCharisma);
		const newSpellLimit = Math.max(1, charismaModifier + 1);

		// Get current paladin spell access to determine chooseable spells
		const tempCharacter = { ...currentCharacter, charisma: totalCharisma };
		const spellAccess = getSpellAccessForCharacter(tempCharacter);
		const paladinAccess = spellAccess.find(
			(access) => access.source === 'class' && access.sourceName === 'Paladin'
		);

		if (!paladinAccess || !paladinAccess.chooseable) {
			return;
		}

		// Count current prepared spells (excluding oath spells which are always prepared)
		const oathSpells = spellAccess
			.filter((access) => access.source === 'subclass' && access.sourceName?.includes('Oath'))
			.flatMap((access) => access.spells || []);

		// Get list of all cantrip names to exclude them from the count
		const allCantrips = getSpellsByLevel(0);
		const cantripNames = new Set(allCantrips.map((spell) => spell.name));

		// Filter to only count leveled spells (exclude cantrips and oath spells)
		// NOTE: currentCharacter.spells may contain strings OR objects with a 'name' property
		const preparedSpells = currentCharacter.spells.filter((spell) => {
			// Extract spell name (handle both string and object formats)
			const spellName = typeof spell === 'string' ? spell : spell.name;
			return !oathSpells.includes(spellName) && !cantripNames.has(spellName);
		});

		// If current prepared spells exceed new limit, show warning
		if (preparedSpells.length > newSpellLimit) {
			const excessCount = preparedSpells.length - newSpellLimit;
			spellLimitWarningInfo = {
				currentCount: preparedSpells.length,
				newLimit: newSpellLimit,
				excessCount: excessCount
			};
			showSpellLimitWarning = true;
		} else {
			// Hide warning if spell count is now within limits
			showSpellLimitWarning = false;
		}
	}

	function validateClericSpellLimit() {
		// Only validate if character has spells selected
		if (!currentCharacter.spells || currentCharacter.spells.length === 0) {
			return;
		}

		// Calculate new Wisdom-based spell limit
		const totalWisdom = (selectedScores.wisdom || 10) + (bonuses.wisdom || 0);
		const wisdomModifier = getModifier(totalWisdom);
		const newSpellLimit = Math.max(1, wisdomModifier + 3);

		// Get current cleric spell access to determine chooseable spells
		const tempCharacter = { ...currentCharacter, wisdom: totalWisdom };
		const spellAccess = getSpellAccessForCharacter(tempCharacter);
		const clericAccess = spellAccess.find(
			(access) => access.source === 'class' && access.sourceName === 'Cleric'
		);

		if (!clericAccess || !clericAccess.chooseable) {
			return;
		}

		// Count current prepared spells (excluding domain spells which are always prepared)
		const domainSpells = spellAccess
			.filter((access) => access.source === 'subclass' && access.sourceName?.includes('Domain'))
			.flatMap((access) => access.spells || []);

		// Get list of all cantrip names to exclude them from the count
		const allCantrips = getSpellsByLevel(0);
		const cantripNames = new Set(allCantrips.map((spell) => spell.name));

		// Filter to only count leveled spells (exclude cantrips and domain spells)
		// NOTE: currentCharacter.spells may contain strings OR objects with a 'name' property
		const preparedSpells = currentCharacter.spells.filter((spell) => {
			// Extract spell name (handle both string and object formats)
			const spellName = typeof spell === 'string' ? spell : spell.name;
			return !domainSpells.includes(spellName) && !cantripNames.has(spellName);
		});

		// If current prepared spells exceed new limit, show warning
		if (preparedSpells.length > newSpellLimit) {
			const excessCount = preparedSpells.length - newSpellLimit;
			spellLimitWarningInfo = {
				currentCount: preparedSpells.length,
				newLimit: newSpellLimit,
				excessCount: excessCount
			};
			showSpellLimitWarning = true;
		} else {
			// Hide warning if spell count is now within limits
			showSpellLimitWarning = false;
		}
	}

	function dismissSpellLimitWarning() {
		showSpellLimitWarning = false;
	}
</script>

<div class="container">
	<!-- Class Recommendation Card -->
	{#if classRecommendation}
		<div class="card class-recommendation-card mb-6">
			<div class="class-rec-header">
				<h2>{selectedClass} Ability Recommendations</h2>
			</div>
			<div class="class-rec-content">
				<div class="priority-group">
					<span class="priority-label">Most Important:</span>
					<div class="ability-list">
						{#each classRecommendation.abilities.slice(0, 3) as ability}
							<span class="ability-tag capitalize">{ability}</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="card ability-card mt-4">
		<!-- Table Header -->
		<div class="grid grid-cols-5 gap-4 border-b pb-2 font-bold text-gray-700">
			<div class="text-center">Ability</div>
			<div class="text-center">Score</div>
			<div class="text-center">Species Bonus</div>
			<div class="text-center">Total</div>
			<div class="text-center">
				<button
					class="modifier-header-btn cursor-pointer transition-colors hover:text-indigo-600 hover:underline focus:text-indigo-600 focus:outline-none"
					on:click={(e) => showModifierInfo(e)}
					title="Click for more information about modifiers"
				>
					Modifier ℹ️
				</button>
			</div>
		</div>

		<!-- Table Rows -->
		{#each stats as stat}
			<div
				class="grid grid-cols-5 items-center gap-4 border-b py-3 transition-colors hover:bg-gray-50"
			>
				<button
					class="ability-name-btn cursor-pointer text-center font-medium text-gray-800 capitalize transition-colors hover:text-indigo-600 hover:underline focus:text-indigo-600 focus:outline-none"
					on:click={(e) => showAbilityInfo(stat, e)}
					title="Click for more information about {stat}"
				>
					{stat} ℹ️
				</button>

				<!-- Score Selection with Clear Button -->
				<div class="score-input-group">
					<select
						bind:value={selectedScores[stat]}
						class="w-full rounded border px-2 py-1 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
					>
						<option value={null}>--</option>
						{#each standardArray as num}
							{#if !usedScores.includes(num) || selectedScores[stat] === num}
								<option value={num}>{num}</option>
							{/if}
						{/each}
					</select>
					{#if selectedScores[stat] !== null && selectedScores[stat] > 0}
						<button
							class="clear-score-btn"
							on:click={() => clearScore(stat)}
							title="Clear score"
							aria-label="Clear {stat} score"
						>
							✕
						</button>
					{/if}
				</div>

				<!-- Bonus -->
				<div class="text-center font-semibold text-gray-700">
					{#if bonuses[stat] > 0}
						+{bonuses[stat]}
					{:else if bonuses[stat] < 0}
						{bonuses[stat]}
					{:else}
						0
					{/if}
				</div>

				<!-- Total -->
				<div class="text-center font-semibold text-gray-800">
					{selectedScores[stat] !== null && selectedScores[stat] > 0
						? selectedScores[stat] + (bonuses[stat] ?? 0)
						: ''}
				</div>

				<!-- Modifier -->
				<div class="text-center font-mono font-bold text-indigo-600">
					{selectedScores[stat] !== null && selectedScores[stat] > 0
						? getModifierString(selectedScores[stat] + (bonuses[stat] ?? 0))
						: ''}
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Ability Info Popup -->
{#if showPopup && popupAbility && abilityInfo[popupAbility]}
	<div
		class="ability-info-popup"
		style="left: {popupPosition.x}px; top: {popupPosition.y}px;"
		on:click={hideAbilityInfo}
		on:keydown={(e) => e.key === 'Escape' && hideAbilityInfo()}
		role="dialog"
		tabindex="-1"
	>
		<div class="popup-content">
			<div class="popup-header">
				<h3 class="popup-title">{abilityInfo[popupAbility].title}</h3>
				<button class="popup-close" on:click={hideAbilityInfo}>×</button>
			</div>
			<div class="popup-body">
				<p class="popup-description">{abilityInfo[popupAbility].description}</p>
				<div class="popup-section">
					<h4 class="popup-section-title">What {abilityInfo[popupAbility].title} affects:</h4>
					<ul class="popup-affects-list">
						{#each abilityInfo[popupAbility].affects as effect}
							<li>{effect}</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Overlay to close popup when clicking outside -->
{#if showPopup}
	<div class="popup-overlay" on:click={hideAbilityInfo}></div>
{/if}

<!-- Modifier Info Popup -->
{#if showModifierPopup}
	<div
		class="ability-info-popup"
		style="left: {modifierPopupPosition.x}px; top: {modifierPopupPosition.y}px;"
		on:click={hideModifierInfo}
		on:keydown={(e) => e.key === 'Escape' && hideModifierInfo()}
		role="dialog"
		tabindex="-1"
	>
		<div class="popup-content">
			<div class="popup-header">
				<h3 class="popup-title">Ability Score Modifiers</h3>
				<button class="popup-close" on:click={hideModifierInfo}>×</button>
			</div>
			<div class="popup-body">
				<p class="popup-description">
					Modifiers represent the bonus or penalty you add to dice rolls based on your ability
					scores.
				</p>
				<div class="popup-section">
					<div class="modifier-table">
						<div class="modifier-table-header">
							<span class="modifier-table-label">Score</span>
							<span class="modifier-table-label">Modifier</span>
						</div>
						<!-- Show score ranges with their shared modifiers -->
						{#each [['8-9', -1], ['10-11', 0], ['12-13', 1], ['14-15', 2], ['16-17', 3], ['18-19', 4]] as [scoreRange, modifierValue]}
							<div class="modifier-table-row">
								<span class="modifier-table-score">{scoreRange}</span>
								<span class="modifier-table-mod"
									>{(modifierValue as number) >= 0 ? '+' + modifierValue : modifierValue}</span
								>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Modifier Popup Overlay -->
{#if showModifierPopup}
	<div class="popup-overlay" on:click={hideModifierInfo}></div>
{/if}

<!-- Spell Limit Warning Banner -->
{#if showSpellLimitWarning}
	<div class="spell-limit-warning-banner">
		<div class="warning-content">
			<div class="warning-icon">⚠️</div>
			<div class="warning-text">
				<h3>Spell Limit Exceeded</h3>
				<p>
					Your {currentCharacter.class === 'Paladin' ? 'Charisma' : 'Wisdom'} modifier change has reduced
					your prepared spell limit. You currently have
					<strong>{spellLimitWarningInfo.currentCount} prepared spells</strong> but can only prepare
					<strong>{spellLimitWarningInfo.newLimit}</strong>. Please visit the
					<a href="/spells">Spells page</a>
					to remove
					<strong
						>{spellLimitWarningInfo.excessCount} spell{spellLimitWarningInfo.excessCount > 1
							? 's'
							: ''}</strong
					>.
				</p>
			</div>
			<button class="warning-dismiss" on:click={dismissSpellLimitWarning} title="Dismiss warning">
				×
			</button>
		</div>
	</div>
{/if}

<style>
	/* Container adjustments for nav bar */
	.container {
		padding-top: 80px;
		padding-bottom: 400px;
		max-width: 900px;
		margin: 0 auto;
	}

	/* Card style */
	.card.ability-card {
		background: var(--color-background);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		padding: var(--spacing-6);
		box-shadow: var(--shadow-md);
	}

	/* Table row hover */
	.grid > div {
		transition: background var(--transition-base);
	}

	select {
		background: var(--color-neutral-50);
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-md);
		padding: var(--spacing-2) var(--spacing-3);
		font-weight: var(--font-weight-medium);
		text-align: center;
	}

	/* Score input group with clear button */
	.score-input-group {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--spacing-1);
	}

	.clear-score-btn {
		background: none;
		color: var(--color-warning);
		border: none;
		width: 20px;
		height: 20px;
		font-size: 14px;
		font-weight: var(--font-weight-bold);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-base);
		flex-shrink: 0;
	}

	.clear-score-btn:hover {
		background: var(--color-warning);
		color: white;
	}

	.clear-score-btn:active {
		background: var(--color-warning-dark);
		border-color: var(--color-warning-dark);
	}

	/* Class Recommendation Card Styles */
	.class-recommendation-card {
		background: linear-gradient(to right, var(--color-neutral-50), var(--color-neutral-100));
		border-left: 4px solid var(--color-neutral-500);
		box-shadow: var(--shadow-md);
		padding: var(--spacing-5);
	}

	.class-rec-header h2 {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-bold);
		color: var(--color-text-primary);
		margin-bottom: 0;
	}

	.class-rec-content {
		margin-top: var(--spacing-3);
	}

	.priority-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-2);
		margin-bottom: var(--spacing-3);
	}

	.priority-group:last-child {
		margin-bottom: 0;
	}

	.priority-label {
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.ability-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2);
	}

	.ability-tag {
		padding: var(--spacing-1) var(--spacing-3);
		border-radius: var(--radius-pill);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		border: 1px solid var(--color-neutral-500);
		background-color: var(--color-neutral-100);
		color: var(--color-text-secondary);
	}

	/* Fighter-specific styles */
	.fighter-options {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.priority-subgroup {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-2);
		margin-left: var(--spacing-4);
	}

	.priority-sublabel {
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size-sm);
		color: var(--color-neutral-500);
	}

	.mb-6 {
		margin-bottom: var(--spacing-6);
	}

	.capitalize {
		text-transform: capitalize;
	}

	/* Ability name button styles */
	.ability-name-btn {
		background: none;
		border: none;
		padding: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-1);
	}

	.ability-name-btn:hover {
		text-decoration: underline;
	}

	/* Popup overlay */
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--color-overlay);
		z-index: 999;
	}

	/* Popup styles */
	.ability-info-popup {
		position: fixed;
		z-index: 1000;
		max-width: 350px;
		width: 90vw;
		pointer-events: none;
	}

	.popup-content {
		background: var(--color-background);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-2xl);
		border: 1px solid var(--color-border-light);
		pointer-events: all;
		overflow: hidden;
	}

	.popup-header {
		background: linear-gradient(135deg, var(--color-neutral-600) 0%, var(--color-neutral-400) 100%);
		color: white;
		padding: var(--spacing-3) var(--spacing-4);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.popup-title {
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-bold);
		margin: 0;
		text-transform: capitalize;
	}

	.popup-close {
		background: none;
		border: none;
		color: white;
		font-size: var(--font-size-xl);
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-circle);
		transition: background var(--transition-base);
	}

	.popup-close:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.popup-body {
		padding: var(--spacing-4);
	}

	.popup-description {
		color: var(--color-text-primary);
		font-size: var(--font-size-sm);
		line-height: 1.5;
		margin: 0 0 var(--spacing-4) 0;
	}

	.popup-section {
		margin-top: var(--spacing-4);
	}

	.popup-section-title {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-neutral-600);
		margin: 0 0 var(--spacing-2) 0;
	}

	.popup-affects-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.popup-affects-list li {
		background: var(--color-neutral-100);
		padding: var(--spacing-2) var(--spacing-3);
		margin-bottom: var(--spacing-1);
		border-radius: var(--radius-md);
		font-size: var(--font-size-xs);
		color: var(--color-text-primary);
		border-left: 3px solid var(--color-neutral-500);
	}

	.popup-affects-list li:last-child {
		margin-bottom: 0;
	}

	/* Validation card styles */
	.validation-card {
		border-left: 4px solid var(--color-accent-orange);
		background: linear-gradient(to right, #fffbeb, #fde68a);
	}

	.validation-card.success {
		border-left-color: var(--color-success-bright);
		background: linear-gradient(to right, #ecfdf5, #d1fae5);
	}

	.validation-header {
		margin-bottom: var(--spacing-3);
	}

	.validation-title {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-bold);
		color: #92400e;
		margin: 0;
	}

	.validation-card.success .validation-title {
		color: #065f46;
	}

	.validation-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.validation-section {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-2);
	}

	.validation-label {
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-sm);
	}

	.validation-label.warning {
		color: #d97706;
	}

	.validation-label.info {
		color: var(--color-primary-blue);
	}

	.validation-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2);
	}

	.validation-item {
		padding: var(--spacing-1) var(--spacing-2);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		border: 1px solid;
	}

	.validation-item.warning {
		background-color: #fed7aa;
		color: #9a3412;
		border-color: #fb923c;
	}

	.validation-item.info {
		background-color: #dbeafe;
		color: #1e40af;
		border-color: #60a5fa;
	}

	.success-message {
		color: #065f46;
		font-size: var(--font-size-sm);
		line-height: 1.5;
		margin: 0;
	}

	.mb-4 {
		margin-bottom: var(--spacing-4);
	}

	/* Modifier header button styles */
	.modifier-header-btn {
		background: none;
		border: none;
		padding: 0;
		font-weight: var(--font-weight-bold);
		font-size: inherit;
		color: inherit;
		display: flex;
		align-items: center;
		gap: var(--spacing-1);
		margin: 0 auto;
	}

	.modifier-header-btn:hover {
		text-decoration: underline;
	}

	/* Modifier table styles */
	.modifier-table {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.modifier-table-header {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-2);
		padding: var(--spacing-3);
		background: var(--color-neutral-50);
		border-bottom: 2px solid var(--color-border-light);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.modifier-table-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-2);
		padding: var(--spacing-2) var(--spacing-3);
		border-bottom: 1px solid var(--color-neutral-100);
	}

	.modifier-table-row:last-child {
		border-bottom: none;
	}

	.modifier-table-row:nth-child(even) {
		background: var(--color-neutral-50);
	}

	.modifier-table-label,
	.modifier-table-score {
		text-align: center;
		font-size: var(--font-size-sm);
	}

	.modifier-table-mod {
		text-align: center;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: #4338ca;
	}

	/* Spell Limit Warning Banner Styles */
	.spell-limit-warning-banner {
		position: fixed;
		top: 70px;
		left: 0;
		right: 0;
		z-index: 1000;
		background: linear-gradient(135deg, #fef3c7, #fde68a);
		border: 2px solid var(--color-accent-orange);
		border-radius: var(--radius-md);
		margin: 0 var(--spacing-4);
		box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
		animation: slideDown 0.3s ease-out;
	}

	.warning-content {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-3);
		padding: var(--spacing-4) var(--spacing-5);
	}

	.warning-icon {
		font-size: 24px;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.warning-text {
		flex: 1;
	}

	.warning-text h3 {
		margin: 0 0 var(--spacing-2) 0;
		color: #92400e;
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
	}

	.warning-text p {
		margin: 0;
		color: #78350f;
		font-size: var(--font-size-sm);
		line-height: 1.4;
	}

	.warning-text a {
		color: #1d4ed8;
		text-decoration: underline;
		font-weight: var(--font-weight-medium);
	}

	.warning-text a:hover {
		color: #1e40af;
	}

	.warning-dismiss {
		background: none;
		border: none;
		color: #92400e;
		font-size: 24px;
		font-weight: var(--font-weight-bold);
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		transition: background-color var(--transition-base);
		flex-shrink: 0;
	}

	.warning-dismiss:hover {
		background-color: rgba(146, 64, 14, 0.1);
	}

	@keyframes slideDown {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
