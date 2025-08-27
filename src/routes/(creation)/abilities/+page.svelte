<script lang="ts">
	import { character_store } from '$lib/stores/character_store';
	import { get } from 'svelte/store';

	const standardArray = [15, 14, 13, 12, 10, 8];
	const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

	// Simplified class ability score recommendations
	const classRecommendations: Record<string, { abilities: string[] }> = {
		Barbarian: { abilities: ['strength', 'constitution', 'dexterity'] },
		Bard: { abilities: ['charisma', 'dexterity', 'constitution'] },
		Cleric: { abilities: ['wisdom', 'constitution', 'strength'] },
		Druid: { abilities: ['wisdom', 'constitution', 'dexterity'] },
		Fighter: { abilities: ['strength', 'dexterity', 'constitution'] },
		Monk: { abilities: ['dexterity', 'wisdom', 'constitution'] },
		Paladin: { abilities: ['strength', 'charisma', 'constitution'] },
		Ranger: { abilities: ['dexterity', 'wisdom', 'constitution'] },
		Rogue: { abilities: ['dexterity', 'constitution', 'wisdom'] },
		Sorcerer: { abilities: ['charisma', 'constitution', 'dexterity'] },
		Warlock: { abilities: ['charisma', 'constitution', 'dexterity'] },
		Wizard: { abilities: ['intelligence', 'constitution', 'dexterity'] }
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
		if (className === 'Rogue' && subclass === 'Arcane Trickster') {
			return { abilities: ['dexterity', 'constitution', 'intelligence'] };
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
	$: usedScores = Object.values(selectedScores).filter((s) => s !== null);

	function getModifier(total: number): string {
		const mod = Math.floor((total - 10) / 2);
		return mod >= 0 ? `+${mod}` : `${mod}`;
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
						{#each classRecommendation.abilities as ability}
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

				<!-- Dropdown -->
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
					{selectedScores[stat] !== null ? selectedScores[stat] + (bonuses[stat] ?? 0) : ''}
				</div>

				<!-- Modifier -->
				<div class="text-center font-mono font-bold text-indigo-600">
					{selectedScores[stat] !== null
						? getModifier(selectedScores[stat] + (bonuses[stat] ?? 0))
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
						{#each [['8-9', -1], ['10-11', 0], ['12-13', 1], ['14-15', 2], ['16-17', 3], ['18-19', 4]] as [scoreRange, modifier]}
							<div class="modifier-table-row">
								<span class="modifier-table-score">{scoreRange}</span>
								<span class="modifier-table-mod">{modifier >= 0 ? '+' + modifier : modifier}</span>
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

<style>
	/* Container adjustments for nav bar */
	.container {
		padding-top: 80px; /* space for nav */
		padding-bottom: 400px; /* space for popups */
		max-width: 900px;
		margin: 0 auto;
	}

	/* Card style */
	.card.ability-card {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
	}

	/* Table row hover */
	.grid > div {
		transition: background 0.2s ease;
	}

	select {
		background: #f9fafb;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		padding: 0.4rem 0.6rem;
		font-weight: 500;
		text-align: center;
	}

	/* Class Recommendation Card Styles */
	.class-recommendation-card {
		background: linear-gradient(to right, #eff6ff, #e0e7ff);
		border-left: 4px solid #6366f1;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		padding: 1.25rem;
	}

	.class-rec-header h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: #312e81;
		margin-bottom: 0;
	}

	.class-rec-content {
		margin-top: 0.75rem;
	}

	.priority-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.priority-group:last-child {
		margin-bottom: 0;
	}

	.priority-label {
		font-weight: 600;
		font-size: 0.875rem;
		color: #6366f1;
	}

	.ability-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.ability-tag {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		border: 1px solid #6366f1;
		background-color: #eef2ff;
		color: #4338ca;
	}

	/* Fighter-specific styles */
	.fighter-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.priority-subgroup {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-left: 1rem;
	}

	.priority-sublabel {
		font-weight: 500;
		font-size: 0.8rem;
		color: #6b7280;
	}

	.mb-6 {
		margin-bottom: 1.5rem;
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
		gap: 0.25rem;
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
		background: rgba(0, 0, 0, 0.3);
		z-index: 999;
	}

	/* Popup styles */
	.ability-info-popup {
		position: fixed;
		z-index: 1000;
		max-width: 350px;
		width: 90vw;
		pointer-events: none; /* Let clicks pass through to content */
	}

	.popup-content {
		background: white;
		border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
		border: 1px solid #e2e8f0;
		pointer-events: all; /* Block clicks on actual content */
		overflow: hidden;
	}

	.popup-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.75rem 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.popup-title {
		font-size: 1.125rem;
		font-weight: 700;
		margin: 0;
		text-transform: capitalize;
	}

	.popup-close {
		background: none;
		border: none;
		color: white;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background 0.2s;
	}

	.popup-close:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.popup-body {
		padding: 1rem;
	}

	.popup-description {
		color: #374151;
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0 0 1rem 0;
	}

	.popup-section {
		margin-top: 1rem;
	}

	.popup-section-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: #4b5563;
		margin: 0 0 0.5rem 0;
	}

	.popup-affects-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.popup-affects-list li {
		background: #f3f4f6;
		padding: 0.375rem 0.75rem;
		margin-bottom: 0.25rem;
		border-radius: 6px;
		font-size: 0.8rem;
		color: #374151;
		border-left: 3px solid #6366f1;
	}

	.popup-affects-list li:last-child {
		margin-bottom: 0;
	}

	/* Validation card styles */
	.validation-card {
		border-left: 4px solid #f59e0b;
		background: linear-gradient(to right, #fffbeb, #fef3c7);
	}

	.validation-card.success {
		border-left-color: #10b981;
		background: linear-gradient(to right, #ecfdf5, #d1fae5);
	}

	.validation-header {
		margin-bottom: 0.75rem;
	}

	.validation-title {
		font-size: 1rem;
		font-weight: 700;
		color: #92400e;
		margin: 0;
	}

	.validation-card.success .validation-title {
		color: #065f46;
	}

	.validation-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.validation-section {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}

	.validation-label {
		font-weight: 600;
		font-size: 0.875rem;
	}

	.validation-label.warning {
		color: #d97706;
	}

	.validation-label.info {
		color: #2563eb;
	}

	.validation-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.validation-item {
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		font-weight: 500;
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
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}

	.mb-4 {
		margin-bottom: 1rem;
	}

	/* Modifier header button styles */
	.modifier-header-btn {
		background: none;
		border: none;
		padding: 0;
		font-weight: 700;
		font-size: inherit;
		color: inherit;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		margin: 0 auto;
	}

	.modifier-header-btn:hover {
		text-decoration: underline;
	}

	/* Modifier table styles */
	.modifier-table {
		display: flex;
		flex-direction: column;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		overflow: hidden;
	}

	.modifier-table-header {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		padding: 0.75rem;
		background: #f9fafb;
		border-bottom: 2px solid #e2e8f0;
		font-weight: 600;
		color: #374151;
	}

	.modifier-table-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid #f3f4f6;
	}

	.modifier-table-row:last-child {
		border-bottom: none;
	}

	.modifier-table-row:nth-child(even) {
		background: #f9fafb;
	}

	.modifier-table-label,
	.modifier-table-score {
		text-align: center;
		font-size: 0.875rem;
	}

	.modifier-table-mod {
		text-align: center;
		font-size: 0.875rem;
		font-weight: 600;
		color: #4338ca;
	}
</style>
