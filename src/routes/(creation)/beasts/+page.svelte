<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { character_store, getBeastTabName, hasBeastAccess } from '$lib/stores/character_store';
	import { applyChoice } from '$lib/stores/character_store_helpers';
	import { beasts } from '$lib/data/beasts/index';
	import BeastCard from '$lib/components/BeastCard.svelte';

	// Track selected beasts (max 3)
	let selectedBeasts = [];
	const MAX_SELECTIONS = 3;

	// Sorting and filtering
	let sortBy = 'cr'; // 'name' or 'cr' - default to CR
	let sortDirection = 'desc'; // 'asc' or 'desc' - default to high-to-low
	let selectedCRs = []; // Will be set based on available CRs

	// Convert CR decimal to fraction display
	function crToDisplay(cr) {
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

	// Available CR options based on character
	$: availableCRs = [0, 0.125, 0.25, 0.5, 1].filter(cr => cr <= maxCR);

	// Auto-select all available CRs when they change
	$: {
		selectedCRs = [...availableCRs];
	}

	// Calculate total beasts available for this character source (before CR filtering)
	$: availableBeasts = beasts.filter(beast => {
		if (!characterSources) return true;
		const hasMatchingSource = characterSources.some(charSource => 
			beast.sources.some(beastSource => beastSource.includes(charSource))
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

	function handleBeastSelect(beast) {
		const index = selectedBeasts.findIndex(b => b.name === beast.name);
		
		if (index >= 0) {
			// Deselect if already selected
			selectedBeasts = selectedBeasts.filter(b => b.name !== beast.name);
		} else if (selectedBeasts.length < MAX_SELECTIONS) {
			// Select if under max limit
			selectedBeasts = [...selectedBeasts, beast];
		}
		// If at max capacity and trying to select a new beast, button will be disabled so this won't be called
	}

	function isBeastSelected(beast) {
		return selectedBeasts.some(b => b.name === beast.name);
	}

	function toggleCR(cr) {
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
					<p class="selection-note">Select up to {MAX_SELECTIONS} stat blocks to print with your character. You can choose which companion to bring each session.</p>
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

			<!-- Filters and Sorting -->
			<div class="controls-section">
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

				<div class="results-count">
					Showing {filteredBeasts.length} of {availableBeasts.length} beasts
				</div>
			</div>

			<!-- Beast List -->
			<div class="beasts-list">
				<div class="beasts-grid">
					{#each filteredBeasts as beast (beast.name)}
						<BeastCard 
							{beast} 
							isSelected={isBeastSelected(beast)}
							isDisabled={!isBeastSelected(beast) && selectedBeasts.length >= MAX_SELECTIONS}
							onSelect={handleBeastSelect}
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
		padding: 6rem 2rem 2rem 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.content {
		background: white;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.info-section {
		margin-bottom: 1.5rem;
		padding: 1rem 1.25rem;
		background: #f8fafc;
		border-radius: 6px;
		border-left: 4px solid #3b82f6;
	}

	.info-section h2 {
		color: #1e293b;
		font-size: 1.125rem;
		margin: 0 0 0.5rem 0;
	}

	.info-section p {
		color: #475569;
		line-height: 1.5;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
	}

	.info-section p:last-of-type {
		margin-bottom: 0;
	}

	.selection-note {
		color: #64748b;
		font-size: 0.85rem;
		font-style: italic;
		margin-top: 0.5rem;
	}

	.selection-summary {
		background: #e0f2fe;
		padding: 0.75rem 1rem;
		border-radius: 4px;
		margin-top: 1rem;
		border: 1px solid #38bdf8;
		color: #0c4a6e;
		font-size: 0.9rem;
	}

	.selection-summary strong {
		color: #0369a1;
	}

	/* Controls Section */
	.controls-section {
		background: #f1f5f9;
		border-radius: 6px;
		padding: 1.25rem;
		margin-bottom: 1.5rem;
		border: 1px solid #cbd5e1;
	}

	.controls-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-bottom: 1rem;
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
		font-weight: 600;
		color: #334155;
		font-size: 0.95rem;
		display: block;
		margin-bottom: 0.5rem;
	}

	.sort-controls {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.sort-buttons,
	.sort-direction {
		display: flex;
		gap: 0.5rem;
	}

	.control-button {
		padding: 0.5rem 1rem;
		border: 2px solid #cbd5e1;
		background: white;
		border-radius: 6px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #475569;
		font-weight: 500;
	}

	.control-button:hover {
		border-color: #94a3b8;
		background: #f8fafc;
	}

	.control-button.active {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	.cr-filters {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.cr-quick-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.link-button {
		background: none;
		border: none;
		color: #3b82f6;
		cursor: pointer;
		font-size: 0.875rem;
		text-decoration: underline;
		padding: 0;
	}

	.link-button:hover {
		color: #2563eb;
	}

	.separator {
		color: #94a3b8;
	}

	.cr-checkboxes {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		cursor: pointer;
		font-size: 0.9rem;
		color: #475569;
	}

	.checkbox-label input[type="checkbox"] {
		cursor: pointer;
		width: 16px;
		height: 16px;
	}

	.cr-label {
		user-select: none;
	}

	.results-count {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #cbd5e1;
		color: #64748b;
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Beast List */
	.beasts-list {
		margin-top: 1.5rem;
	}

	.beasts-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (max-width: 1200px) {
		.beasts-grid {
			grid-template-columns: 1fr;
		}
	}

	.no-results {
		text-align: center;
		padding: 3rem;
		color: #64748b;
		font-size: 1.1rem;
	}

	.placeholder {
		text-align: center;
		padding: 3rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 8px;
		margin-top: 2rem;
	}

	.placeholder p {
		color: white;
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
	}
</style>
