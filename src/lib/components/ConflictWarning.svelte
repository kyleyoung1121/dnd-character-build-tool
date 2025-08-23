<script>
	import { activeConflicts } from '$lib/stores/conflict_store';
	import { getPrimaryResolutionTab } from '$lib/stores/conflict_detection';
	
	export let tabName = '';
	
	// Collapsible state - start collapsed for cleaner UX
	let isExpanded = false;
	
	function toggleExpanded() {
		isExpanded = !isExpanded;
	}
	
	$: tabConflicts = $activeConflicts.conflicts.filter(conflict => 
		conflict.affectedTabs?.includes(tabName) ?? false
	);
	
	function getConflictDescription(conflict) {
		const typeMap = {
			skill: 'Skill',
			proficiency: 'Proficiency', 
			language: 'Language',
			feature: 'Feature'
		};
		
		const typeLabel = typeMap[conflict.type] || conflict.type;
		const sourceDescriptions = conflict.sources.map(source => {
			// Convert source IDs to human-readable descriptions
			if (source.startsWith('bard.')) return 'Bard class';
			if (source.startsWith('high_elf.')) return 'High Elf race';
			if (source.startsWith('hill_dwarf.')) return 'Hill Dwarf race';
			if (source.startsWith('fighter.')) return 'Fighter class';
			// Add more mappings as needed
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
								<strong>Resolution:</strong> {getResolutionSuggestion(conflict)}
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
	.conflicts-list, .guidance-section {
		transition: all 0.3s ease;
	}
</style>