<script>
	import { activeConflicts } from '$lib/stores/conflict_store';
	import { getPrimaryResolutionTab } from '$lib/stores/conflict_detection';

	export let tabName = '';

	// Collapsible state - start collapsed for cleaner UX
	let isExpanded = false;

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	$: tabConflicts = $activeConflicts.conflicts.filter(
		(conflict) => conflict.affectedTabs?.includes(tabName) ?? false
	);

	// Track conflicts for this specific tab
	$: if (tabConflicts.length > 0) {
		// Conflicts detected for this tab
	}

	function getConflictDescription(conflict) {
		const typeMap = {
			skill: 'Skill',
			proficiency: 'Proficiency',
			language: 'Language',
			feature: 'Feature'
		};

		const typeLabel = typeMap[conflict.type] || conflict.type;
		const sourceDescriptions = conflict.sources.map((source) => {
			// Convert source IDs to human-readable descriptions

			// Class sources
			if (source.startsWith('class:')) {
				const className = source.split(':')[1];
				return `${className} class`;
			}
			if (source.startsWith('bard.')) return 'Bard class';
			if (source.startsWith('fighter.')) return 'Fighter class';
			if (source.startsWith('cleric.')) return 'Cleric class';
			if (source.startsWith('rogue.')) return 'Rogue class';
			if (source.startsWith('ranger.')) return 'Ranger class';
			if (source.startsWith('wizard.')) return 'Wizard class';
			if (source.startsWith('sorcerer.')) return 'Sorcerer class';
			if (source.startsWith('warlock.')) return 'Warlock class';
			if (source.startsWith('paladin.')) return 'Paladin class';
			if (source.startsWith('barbarian.')) return 'Barbarian class';
			if (source.startsWith('monk.')) return 'Monk class';
			if (source.startsWith('druid.')) return 'Druid class';

			// Species sources
			if (source.startsWith('race:') || source.startsWith('species:')) {
				const speciesName = source.split(':')[1];
				return `${speciesName} species`;
			}
			if (source.startsWith('high_elf.')) return 'High Elf species';
			if (source.startsWith('hill_dwarf.')) return 'Hill Dwarf species';
			if (source.startsWith('wood_elf.')) return 'Wood Elf species';
			if (source.startsWith('dark_elf.')) return 'Dark Elf species';
			if (source.startsWith('mountain_dwarf.')) return 'Mountain Dwarf species';
			if (source.startsWith('lightfoot_halfling.')) return 'Lightfoot Halfling species';
			if (source.startsWith('stout_halfling.')) return 'Stout Halfling species';
			if (source.startsWith('rock_gnome.')) return 'Rock Gnome species';
			if (source.startsWith('forest_gnome.')) return 'Forest Gnome species';
			if (source.startsWith('half_elf.')) return 'Half-Elf species';
			if (source.startsWith('half_orc.')) return 'Half-Orc species';
			if (source.startsWith('dragonborn.')) return 'Dragonborn species';
			if (source.startsWith('tiefling.')) return 'Tiefling species';
			if (source.startsWith('human.')) return 'Human species';
			if (source.startsWith('variant_human.')) return 'Variant Human species';

			// Background sources
			if (source.startsWith('background:')) {
				const backgroundName = source.split(':')[1];
				return `${backgroundName} background`;
			}

			// Feature sources - need to distinguish between class, background, and species features
			if (source.startsWith('feature:')) {
				const featureName = source.split(':')[1];

				// Check if this is a background feature by examining the feature name and pattern
				if (featureName === 'Skill Proficiencies') {
					// Heuristic: if it's exactly 'feature:Skill Proficiencies' (no index),
					// it's likely from background. Class skills usually have indices.
					if (source === 'feature:Skill Proficiencies') {
						return 'Background skill selection';
					} else {
						return 'Class skill selection';
					}
				}

				// Background-specific features
				if (
					[
						'Tool Proficiencies',
						'Equipment',
						'Languages',
						'Criminal Contact',
						'Shelter of the Faithful',
						'False Identity',
						'By Popular Demand',
						'Rustic Hospitality',
						'Position of Privilege'
					].includes(featureName)
				) {
					return 'Background feature';
				}

				// Species-specific features
				if (source.includes('Keen Senses')) return 'Elf keen senses';
				if (source.includes('Lucky')) return 'Halfling lucky';
				if (source.includes('Brave')) return 'Halfling brave';
				if (source.includes('Draconic Ancestry')) return 'Dragonborn ancestry';
				if (source.includes('Fey Ancestry')) return 'Elf fey ancestry';

				// Class features - remaining skill proficiencies with indices
				if (source.includes('Skill Proficiencies')) return 'Class skill selection';

				return `${featureName} feature`;
			}

			// Default fallback
			return source;
		});

		return `${typeLabel} "${conflict.value}" is granted by multiple sources: ${sourceDescriptions.join(', ')}`;
	}

	function getResolutionSuggestion(conflict) {
		const primaryTab = getPrimaryResolutionTab(conflict);

		if (primaryTab) {
			const tabName = primaryTab.charAt(0).toUpperCase() + primaryTab.slice(1);
			return `Go to the ${tabName} tab and select a different ${conflict.type} to resolve this conflict.`;
		}

		// If no user-changeable source, provide different guidance
		return 'This conflict involves automatic grants. Consider changing your other selections.';
	}

	// Removed resolution functions - now using simple guidance approach
</script>

{#if tabConflicts.length > 0}
	<div class="conflict-warning-container">
		<div class="conflict-warning">
			<button class="warning-header" on:click={toggleExpanded}>
				<div class="header-content">
					<span class="warning-icon">⚠️</span>
					<h3>Conflicts Detected</h3>
				</div>
				<span class="expand-indicator">{isExpanded ? '−' : '+'}</span>
			</button>

			{#if isExpanded}
				<div class="conflicts-list">
					{#each tabConflicts as conflict}
						<div class="conflict-item">
							<div class="conflict-description">
								{getConflictDescription(conflict)}
							</div>
							<div class="conflict-resolution">
								<strong>Resolution:</strong>
								{getResolutionSuggestion(conflict)}
							</div>
						</div>
					{/each}
				</div>

				<!-- Simple guidance section -->
				<div class="guidance-section">
					<p>Go to the highlighted tabs and make different selections to avoid duplicates.</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.conflict-warning-container {
		display: flex;
		justify-content: center;
		width: 100%;
		margin: 1rem 0;
	}

	.conflict-warning {
		background-color: #fef2f2; /* light red background */
		border: 2px solid #dc2626; /* red border */
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		/* Match feature card width constraints */
		width: 100%;
		max-width: 50vw;
		box-sizing: border-box;
	}

	.warning-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		background: none;
		border: none;
		padding: 0;
		font-size: inherit;
		cursor: pointer;
		margin-bottom: 0.75rem;
		transition: opacity 0.2s ease;
	}

	.warning-header:hover {
		opacity: 0.8;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.expand-indicator {
		font-size: 1.2rem;
		font-weight: bold;
		color: #dc2626;
		padding-left: 1rem;
	}

	.warning-icon {
		font-size: 1.5rem;
	}

	.warning-header h3 {
		margin: 0;
		color: #dc2626;
		font-size: 1.2rem;
	}

	.conflicts-list {
		margin-bottom: 1rem;
	}

	.conflict-item {
		background-color: white;
		border-radius: 6px;
		padding: 0.75rem;
		margin-bottom: 0.5rem;
		border-left: 4px solid #dc2626;
	}

	.conflict-item:last-child {
		margin-bottom: 0;
	}

	.conflict-description {
		font-weight: 500;
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.conflict-resolution {
		font-size: 0.9rem;
		color: #6b7280;
		font-style: italic;
	}

	/* Guidance section */
	.guidance-section {
		background-color: #f0f9ff;
		border: 1px solid #0ea5e9;
		border-radius: 6px;
		padding: 0.75rem;
		margin: 1rem 0;
	}

	.guidance-section p {
		margin: 0;
		color: #075985;
		font-size: 0.9rem;
	}

	/* Collapsible animation */
	.conflicts-list,
	.guidance-section {
		transition: all 0.3s ease;
	}
</style>
