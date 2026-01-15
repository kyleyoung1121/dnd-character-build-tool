<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { character_store, getBeastTabName, hasBeastAccess } from '$lib/stores/character_store';
	import { applyChoice, revertChanges } from '$lib/stores/character_store_helpers';
	import { beasts } from '$lib/data/beasts/index';
	import BeastCard from '$lib/components/BeastCard.svelte';
	import type { Beast } from '$lib/data/beasts/types';

	// Track selected beasts (max 3 for most, max 1 for Beast Master)
	let selectedBeasts: Beast[] = [];
	
	// Determine max selections based on character
	$: maxSelections = isBeastMaster ? 1 : 3;
	$: MAX_SELECTIONS = maxSelections; // Keep constant name for template compatibility

	// Sorting and filtering
	let sortBy = 'cr'; // 'name' or 'cr' - default to CR
	let sortDirection = 'desc'; // 'asc' or 'desc' - default to high-to-low
	let selectedCRs: Number[] = []; // Will be set based on available CRs
	let filtersExpanded = false; // Collapsible filter section starts closed

	// Convert CR decimal to fraction display
	function crToDisplay(cr: Number) {
		if (cr === 0) return '0';
		if (cr === 0.125) return '1/8';
		if (cr === 0.25) return '1/4';
		if (cr === 0.5) return '1/2';
		return cr.toString(); // For CR 1 and above
	}

	// Determine the appropriate title based on character class
	$: pageTitle = getBeastTabName($character_store);
	
	// Determine what type of content to show
	$: isDruid = $character_store.class === 'Druid';
	$: isBeastMaster = $character_store.class === 'Ranger' && $character_store.subclass === 'Beast Master';
	$: isWizard = 
		$character_store.class === 'Wizard' && 
		$character_store.spells && 
		$character_store.spells.includes('Find Familiar');
	$: isPactOfChain = 
		$character_store.class === 'Warlock' && 
		$character_store.features && 
		$character_store.features.includes('Pact of the Chain');

	// Show beasts tab - use hasBeastAccess for proper access control
	$: showBeasts = hasBeastAccess($character_store);

	// Determine character's beast source(s) - return array for flexible matching
	$: characterSources = (() => {
		if (isDruid && isCircleOfMoon) return ['Druid', 'Druid (Circle of the Moon)'];
		if (isDruid) return ['Druid'];
		if (isBeastMaster) return ['Ranger'];
		if (isWizard) return ['Wizard'];
		if (isPactOfChain) return ['Warlock'];
		return null;
	})();

	// Check if Circle of the Moon (allows higher CR)
	$: isCircleOfMoon = $character_store.subclass === 'Circle of the Moon';

	// Determine max CR based on class/subclass
	$: maxCR = (() => {
		if (isDruid && isCircleOfMoon) return 1; // Circle of Moon can go up to CR 1
		if (isDruid) return 0.25; // Regular Druid up to CR 1/4
		if (isBeastMaster) return 0.25; // Beast Master up to CR 1/4
		if (isWizard) return 0.125; // Find Familiar limited to tiny creatures (CR 0-1/8)
		if (isPactOfChain) return 1; // Pact of Chain can summon stronger familiars
		return 1; // Default
	})();

	// Available CR options based on character - only show CRs that have beasts
	$: availableCRs = (() => {
		const allPossibleCRs = [0, 0.125, 0.25, 0.5, 1].filter(cr => cr <= maxCR);
		// Filter to only CRs that have at least one beast for this character source
		return allPossibleCRs.filter(cr => {
			return beasts.some(beast => {
				if (beast.challenge_rating !== cr) return false;
				if (!characterSources) return true;
				return characterSources.some(charSource => 
					beast.sources.some(beastSource => beastSource.includes(charSource))
				);
			});
		});
	})();

	// Auto-select default CRs based on character class
	$: {
		if (availableCRs.length > 0) {
			// Special defaults for specific classes
			if (isWizard) {
				// Wizard: Show all options (CR 0 and 1/8)
				selectedCRs = [...availableCRs];
			} else if (isPactOfChain) {
				// Warlock: Show CR 1/4 and CR 1 (fiend options)
				selectedCRs = availableCRs.filter(cr => cr === 0.25 || cr === 1);
			} else {
				// Default: Only highest CR
				const maxAvailableCR = availableCRs[availableCRs.length - 1];
				selectedCRs = [maxAvailableCR];
			}
		} else {
			selectedCRs = [];
		}
	}

	// Calculate total beasts available for this character source (before CR filtering)
	$: availableBeasts = beasts.filter(beast => {
		if (!characterSources) return true;
		const hasMatchingSource = characterSources.some(charSource => 
			beast.sources.some(beastSource => beastSource === charSource)
		);
		return hasMatchingSource;
	});

	// Filter and sort beasts
	$: filteredBeasts = beasts
		.filter(beast => {
			// Filter by CR
			if (!selectedCRs.includes(beast.challenge_rating)) return false;
			// Filter by source - beast must match at least one of character's sources
			if (characterSources) {
				const hasMatchingSource = characterSources.some(charSource => 
					beast.sources.some(beastSource => beastSource.includes(charSource))
				);
				if (!hasMatchingSource) return false;
			}
			return true;
		})
		.sort((a, b) => {
			if (sortBy === 'cr') {
				// Sort by CR first
				if (a.challenge_rating !== b.challenge_rating) {
					const crComparison = a.challenge_rating - b.challenge_rating;
					// Apply sort direction to CR comparison
					return sortDirection === 'desc' ? -crComparison : crComparison;
				} else {
					// For ties, ALWAYS use A→Z alphabetical (regardless of sortDirection)
					return a.name.localeCompare(b.name);
				}
			} else {
				// Sort alphabetically with direction applied
				const nameComparison = a.name.localeCompare(b.name);
				return sortDirection === 'desc' ? -nameComparison : nameComparison;
			}
		});

	function handleBeastSelect(beast: Beast) {
		// Check if this beast is already in our selected beasts list
		const index = selectedBeasts.findIndex(b => b.name === beast.name);

		if (index >= 0) {
			// Deselect if already selected
			selectedBeasts = selectedBeasts.filter(b => b.name !== beast.name);
			let selectedBeastNames = selectedBeasts.map((beast) => beast.name)
			
			// Clear our provenance entry
			const state = get(character_store);
			const provKeys = Object.keys(state._provenance || {});
			for (const key of provKeys) {
				if (key === "beasts") {
					revertChanges(state, key);
				}
			}
			// Resubmit our knewest understanding of selected beasts (should now lack the deselected beast)
			applyChoice(`beasts:`, {
				beasts: selectedBeastNames
			});

		} else if (selectedBeasts.length < maxSelections) {
			// Add the beast if we are able to (under the selection limit)
			selectedBeasts = [...selectedBeasts, beast];
			let selectedBeastNames = selectedBeasts.map((beast) => beast.name)
			
			// Add selection to character store
			applyChoice(`beasts:`, {
				beasts: selectedBeastNames
			});
		}
		// If at max capacity and trying to select a new beast, button will be disabled so this won't be called
	}

	function toggleCR(cr: Number) {
		if (selectedCRs.includes(cr)) {
			selectedCRs = selectedCRs.filter(c => c !== cr);
		} else {
			selectedCRs = [...selectedCRs, cr];
		}
	}

	function selectAllCRs() {
		selectedCRs = [...availableCRs];
	}

	function deselectAllCRs() {
		selectedCRs = [];
	}

	// Persist beast selections to character store
	function persistBeastSelections() {
		const scopeId = 'beast_selections';
		// Store beast names in character.beasts array
		const beastSelections = {
			beasts: selectedBeasts.map(b => b.name)
		};
		applyChoice(scopeId, beastSelections);
	}

	// Restore beast selections from character store
	function restoreBeastSelectionsFromStore() {
		const char = $character_store;
		if (!char._provenance) return;

		const scopeId = 'beast_selections';
		const provenanceData = char._provenance[scopeId];

		if (provenanceData) {
			const actualData = provenanceData._set || provenanceData;
			
			if (actualData.beasts && Array.isArray(actualData.beasts)) {
				// Restore beast selections from names
				selectedBeasts = actualData.beasts
					.map((name) => beasts.find(b => b.name === name))
					.filter((b) => b !== undefined); // Filter out any beasts that no longer exist
			}
		}
	}

	// Persist whenever selectedBeasts changes
	$: {
		if (selectedBeasts) {
			persistBeastSelections();
		}
	}

	// Restore selections when component mounts
	onMount(() => {
		restoreBeastSelectionsFromStore();
	});
</script>

<div class="page-container">
	<div class="content">
		{#if showBeasts}
			<div class="info-section">
				{#if isDruid}
					<h2>Wild Shape Forms</h2>
					{#if isCircleOfMoon}
						<p>You can magically transform into beasts up to CR 1 (no flying or swimming speed).</p>
					{:else}
						<p>You can magically transform into beasts up to CR 1/4 (no flying or swimming speed).</p>
					{/if}
					<p class="selection-note">Select up to {MAX_SELECTIONS} stat blocks to print with your character for quick reference.</p>
				{/if}
				
				{#if isBeastMaster}
					<h2>Ranger's Companion</h2>
					<p>You gain one loyal beast companion (CR 1/4 or lower, Medium or smaller) that fights alongside you.</p>
					<p class="selection-note">Choose 1 companion with whom you share a magical connection.</p>
				{/if}
				
				{#if isWizard}
					<h2>Find Familiar</h2>
					<p>You can summon one magical familiar (tiny beasts like bat, cat, owl, or raven). They cannot attack, but can use other actions like Help.</p>
					<p class="selection-note">Select up to {MAX_SELECTIONS} stat blocks to print with your character. You have only one familiar at a time, but can choose which to summon each session.</p>
				{/if}
				
				{#if isPactOfChain}
					<h2>Pact of the Chain Familiar</h2>
					<p>You choose a familiar that can attack. Your options for your familiar are expanded, also including: imp, pseudodragon, quasit, or sprite.</p>
					<p class="selection-note">Select up to {MAX_SELECTIONS} stat blocks to print with your character. You have only one familiar at a time, but can choose which to summon each session.</p>
				{/if}

				{#if selectedBeasts.length > 0}
					<div class="selection-summary">
						<strong>Selected ({selectedBeasts.length}/{MAX_SELECTIONS}):</strong>
						{selectedBeasts.map(b => b.name).join(', ')}
					</div>
				{/if}
			</div>

			<!-- Filters and Sorting (Collapsible) -->
			<div class="controls-section">
				<button 
					class="filter-toggle"
					on:click={() => filtersExpanded = !filtersExpanded}
				>
					<span class="toggle-text">Filtering Options</span>
					<!-- <span class="results-count-inline">({filteredBeasts.length} of {availableBeasts.length} shown)</span> -->
					<span class="toggle-icon">{filtersExpanded ? '–' : '+'}</span>
				</button>
				
				{#if filtersExpanded}
					<div class="controls-content">
						<div class="controls-grid">
							<div class="control-group">
								<div class="control-label">Sort by:</div>
								<div class="sort-controls">
									<div class="sort-buttons">
										<button 
											class="control-button"
											class:active={sortBy === 'name'}
											on:click={() => sortBy = 'name'}
										>
											Alphabetical
										</button>
										<button 
											class="control-button"
											class:active={sortBy === 'cr'}
											on:click={() => sortBy = 'cr'}
										>
											Challenge Rating
										</button>
									</div>
									<div class="sort-direction">
										<button 
											class="control-button"
											class:active={sortDirection === 'asc'}
											on:click={() => sortDirection = 'asc'}
										>
											{sortBy === 'name' ? 'A → Z' : 'Low → High'}
										</button>
										<button 
											class="control-button"
											class:active={sortDirection === 'desc'}
											on:click={() => sortDirection = 'desc'}
										>
											{sortBy === 'name' ? 'Z → A' : 'High → Low'}
										</button>
									</div>
								</div>
							</div>

							<div class="control-group">
								<div class="control-label">Filter by CR:</div>
								<div class="cr-filters">
									<div class="cr-quick-actions">
										<button class="link-button" on:click={selectAllCRs}>All</button>
										<span class="separator">|</span>
										<button class="link-button" on:click={deselectAllCRs}>None</button>
									</div>
									<div class="cr-checkboxes">
										{#each availableCRs as cr}
											<label class="checkbox-label">
												<input 
													type="checkbox" 
													checked={selectedCRs.includes(cr)}
													on:change={() => toggleCR(cr)}
												/>
												<span class="cr-label">CR {crToDisplay(cr)}</span>
											</label>
										{/each}
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Beast List -->
			<div class="beasts-list">
				<div class="beasts-grid">
					{#each filteredBeasts as beast (beast.name)}
						<BeastCard 
							{beast} 
							isSelected={selectedBeasts.some(b => b.name === beast.name)}
							isDisabled={!selectedBeasts.some(b => b.name === beast.name) && selectedBeasts.length >= MAX_SELECTIONS}
							onSelect={handleBeastSelect}
							{isBeastMaster}
						/>
					{/each}
				</div>
				{#if filteredBeasts.length === 0}
					<div class="no-results">
						<p>No beasts match your current filters.</p>
					</div>
				{/if}
			</div>
		{:else}
			<div class="placeholder">
				<p>🐾 Beast and familiar selection not available for your current class 🐾</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.page-container {
		padding: 6rem var(--spacing-8) var(--spacing-8) var(--spacing-8);
		max-width: 1400px;
		margin: 0 auto;
	}

	.content {
		background: var(--color-background);
		border-radius: var(--radius-lg);
		padding: var(--spacing-8);
		box-shadow: var(--shadow-md);
	}

	.info-section {
		margin-bottom: var(--spacing-6);
		padding: var(--spacing-4) var(--spacing-5);
		background: var(--color-neutral-50);
		border-radius: var(--radius-md);
		border-left: 4px solid var(--color-primary-blue);
	}

	.info-section h2 {
		color: var(--color-text-primary);
		font-size: var(--font-size-md);
		margin: 0 0 var(--spacing-2) 0;
	}

	.info-section p {
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin-bottom: var(--spacing-2);
		font-size: var(--font-size-sm);
	}

	.info-section p:last-of-type {
		margin-bottom: 0;
	}

	.selection-note {
		color: var(--color-text-muted);
		font-size: var(--font-size-xs);
		font-style: italic;
		margin-top: var(--spacing-2);
	}

	.selection-summary {
		background: #e0f2fe;
		padding: var(--spacing-3) var(--spacing-4);
		border-radius: var(--radius-sm);
		margin-top: var(--spacing-4);
		border: 1px solid #38bdf8;
		color: #0c4a6e;
		font-size: var(--font-size-sm);
	}

	.selection-summary strong {
		color: #0369a1;
	}

	/* Controls Section */
	.controls-section {
		background: var(--color-neutral-50);
		border-radius: var(--radius-md);
		padding: 0;
		margin-bottom: var(--spacing-6);
		border: 1px solid var(--color-border-dark);
		overflow: hidden;
	}

	.filter-toggle {
		width: 100%;
		background: var(--color-neutral-50);
		border: none;
		padding: var(--spacing-4) var(--spacing-5);
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		transition: background var(--transition-base);
		text-align: left;
	}

	.filter-toggle:hover {
		background: var(--color-neutral-100);
	}

	.toggle-icon {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-bold);
		color: var(--color-text-primary);
	}

	.toggle-text {
		color: var(--color-text-primary);
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-sm);
	}

	/* Hidden for now - keeping code in case needed later */
	.results-count-inline {
		display: none;
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-normal);
		margin-left: auto;
	}

	.controls-content {
		padding: var(--spacing-5);
		border-top: 1px solid var(--color-border-dark);
		background: var(--color-neutral-50);
	}

	.controls-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-6);
	}

	@media (max-width: 768px) {
		.controls-grid {
			grid-template-columns: 1fr;
		}
	}

	.control-group {
		margin-bottom: 0;
	}

	.control-label {
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		font-size: var(--font-size-sm);
		display: block;
		margin-bottom: var(--spacing-2);
	}

	.sort-controls {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	.sort-buttons,
	.sort-direction {
		display: flex;
		gap: var(--spacing-2);
	}

	.control-button {
		padding: var(--spacing-2) var(--spacing-4);
		border: 2px solid var(--color-border-dark);
		background: var(--color-background);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		cursor: pointer;
		transition: all var(--transition-base);
		color: var(--color-text-secondary);
		font-weight: var(--font-weight-medium);
	}

	.control-button:hover {
		border-color: var(--color-neutral-400);
		background: var(--color-neutral-50);
	}

	.control-button.active {
		background: var(--color-primary-blue);
		color: white;
		border-color: var(--color-primary-blue);
	}

	.cr-filters {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	.cr-quick-actions {
		display: flex;
		gap: var(--spacing-2);
		align-items: center;
	}

	.link-button {
		background: none;
		border: none;
		color: var(--color-primary-blue);
		cursor: pointer;
		font-size: var(--font-size-sm);
		text-decoration: underline;
		padding: 0;
	}

	.link-button:hover {
		color: #2563eb;
	}

	.separator {
		color: var(--color-neutral-400);
	}

	.cr-checkboxes {
		display: flex;
		gap: var(--spacing-4);
		flex-wrap: wrap;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		cursor: pointer;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.checkbox-label input[type="checkbox"] {
		cursor: pointer;
		width: 16px;
		height: 16px;
	}

	.cr-label {
		user-select: none;
	}

	/* Beast List */
	.beasts-list {
		margin-top: var(--spacing-6);
	}

	.beasts-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-4);
	}

	@media (max-width: 1200px) {
		.beasts-grid {
			grid-template-columns: 1fr;
		}
	}

	.no-results {
		text-align: center;
		padding: var(--spacing-12);
		color: var(--color-text-muted);
		font-size: var(--font-size-md);
	}

	.placeholder {
		text-align: center;
		padding: var(--spacing-12);
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: var(--radius-md);
		margin-top: var(--spacing-8);
	}

	.placeholder p {
		color: white;
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		margin: 0;
	}
</style>
