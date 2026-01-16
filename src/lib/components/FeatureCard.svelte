<script lang="ts">
	import type { FeaturePrompt, ComplexOption } from '$lib/data/types/Features';
	import FeatureDescription from '$lib/components/FeatureDescription.svelte';
	import {
		isFeatureIncomplete,
		getNestedPrompts,
		getGloballyAvailableOptions
	} from './feature-card-utils';
	import { activeConflicts } from '$lib/stores/conflict_store';
	import { onMount } from 'svelte';

	// Props
	export let feature: FeaturePrompt;
	export let featureSelections: Record<string, (string | null)[]>;
	export let expandedFeatures: Set<string>;
	export let selectionVersion: number;
	export let characterStore: any;
	export let nested: boolean = false;
	export let parentFeatureName: string | null = null; // Track parent feature for nested scope IDs
	export let parentIndex: number | null = null; // Track parent feature index for nested scope IDs

	// Event handlers - passed down from parent
	export let onSelectOption: (feature: FeaturePrompt, index: number, value: string, parentFeatureName?: string | null, parentIndex?: number | null) => void;
	export let onToggleExpand: (featureName: string) => void;

	// Auto-expand nested features on mount
	onMount(() => {
		if (nested && !expandedFeatures.has(feature.name)) {
			onToggleExpand(feature.name);
		}
	});

	// Computed properties
	$: isExpanded = expandedFeatures.has(feature.name);
	$: isIncomplete = isFeatureIncomplete(feature, featureSelections);
	$: isComplete = !isIncomplete && feature.featureOptions;
	$: nestedPrompts = getNestedPrompts(feature, featureSelections[feature.name] || []);
	// Make conflict detection reactive to both activeConflicts and selectionVersion
	$: hasConflicts = checkFeatureHasConflicts(feature.name, selectionVersion);

	function checkFeatureHasConflicts(featureName: string, _version: number): boolean {
		if (!$activeConflicts.hasConflicts) return false;

		// Check if any conflicts involve scopes related to this feature
		return $activeConflicts.conflicts.some((conflict) =>
			conflict.sources.some((source) => source.includes(featureName))
		);
	}

	function getConflictType(featureName: string): 'user-changeable' | 'automatic' | 'none' {
		if (!hasConflicts) return 'none';

		// Determine if this feature represents a user choice or automatic grant
		if (feature.featureOptions) {
			return 'user-changeable'; // Has dropdown options = user can change
		} else {
			return 'automatic'; // No options = automatic racial/class grant
		}
	}

	// Get available options for a specific dropdown index - reactive to character store changes
	$: getAvailableOptions = (index: number): (string | ComplexOption)[] => {
		return getGloballyAvailableOptions(feature, index, featureSelections, characterStore);
	};

	// Handle select change
	function handleSelectChange(event: Event, index: number) {
		const target = event.target as HTMLSelectElement;
		onSelectOption(feature, index, target.value, parentFeatureName, parentIndex);
	}
</script>

<div
	class="feature-card {isIncomplete ? 'incomplete' : isComplete ? 'complete' : ''} {nested
		? 'nested'
		: ''}"
>
	<button
		class="feature-header"
		class:has-conflicts={hasConflicts}
		type="button"
		on:click={() => onToggleExpand(feature.name)}
	>
		<span class="feature-name">
			{feature.name}
			{#if hasConflicts}
				<span
					class="conflict-badge"
					class:user-changeable={getConflictType(feature.name) === 'user-changeable'}
					class:automatic={getConflictType(feature.name) === 'automatic'}
					title={getConflictType(feature.name) === 'user-changeable'
						? 'You can change this selection to resolve conflicts'
						: 'This feature conflicts with your other selections, but has no alternative options'}
				>
					{#if getConflictType(feature.name) === 'user-changeable'}
						⚠️
					{:else}
						🔒
					{/if}
				</span>
			{/if}
		</span>
		<span class="expand-indicator">
			{isExpanded ? '–' : '+'}
		</span>
	</button>

	{#if isExpanded}
	<FeatureDescription description={feature.description} />

		{#if feature.featureOptions}
			{#each Array(feature.featureOptions.numPicks) as _, idx}
				<select
					value={featureSelections[feature.name]?.[idx] || ''}
					on:change={(e) => handleSelectChange(e, idx)}
				>
					<option value="" disabled>
						{feature.featureOptions.placeholderText || 'Select an option'}
					</option>

					{#each getAvailableOptions(idx) as option (typeof option === 'string' ? option : option.name)}
						<option value={typeof option === 'string' ? option : option.name}>
							{typeof option === 'string' ? option : option.name}
						</option>
					{/each}
				</select>
			{/each}

			<!-- Render nested prompts for each selection with correct parent index -->
			{#each Array(feature.featureOptions.numPicks) as _, selectionIdx}
				{@const selectedOption = featureSelections[feature.name]?.[selectionIdx]}
				{#if selectedOption}
					{@const nestedForThisSelection = getNestedPrompts(feature, [selectedOption])}
					{#each nestedForThisSelection as nestedFeature (nestedFeature.name + '_' + selectionIdx)}
						<svelte:self
							feature={nestedFeature}
							{featureSelections}
							{expandedFeatures}
							{selectionVersion}
							{characterStore}
							{onSelectOption}
							{onToggleExpand}
							parentFeatureName={feature.name}
							parentIndex={selectionIdx}
							nested={true}
						/>
					{/each}
				{/if}
			{/each}
		{/if}
	{/if}
</div>

<style>
	.feature-card {
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--spacing-3) var(--spacing-4);
		margin: var(--spacing-3) 0;
		background: var(--color-background-alt);
		width: 100%;
		max-width: 50vw;
		box-sizing: border-box;
		transition: border-color var(--transition-base);
	}

	.feature-card select {
		margin-top: var(--spacing-2);
		width: 100%;
		padding: var(--spacing-2) var(--spacing-3);
		font-size: var(--font-size-base);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-neutral-300);
	}

	.feature-card.nested {
		margin-top: var(--spacing-4);
		margin-left: var(--spacing-6);
		width: calc(100% - var(--spacing-8));
		background-color: var(--color-neutral-100);
		border-color: var(--color-neutral-400);
		border-width: 1px;
		padding: var(--spacing-2) var(--spacing-3);
	}

	/* Enhanced nesting: each level gets progressively more indented and lighter */
	.feature-card.nested .feature-card.nested {
		margin-left: var(--spacing-4);
		background-color: var(--color-neutral-50);
		border-color: var(--color-neutral-300);
		padding: var(--spacing-2);
	}

	.feature-card.nested .feature-card.nested .feature-card.nested {
		margin-left: var(--spacing-3);
		background-color: var(--color-background);
		border-color: var(--color-border);
		padding: var(--spacing-1) var(--spacing-2);
		font-size: var(--font-size-sm);
	}

	.feature-card.incomplete {
		border-color: var(--color-warning);
	}

	.feature-card.complete {
		border-color: var(--color-primary-blue);
	}

	.feature-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		background: none;
		border: none;
		padding: var(--spacing-2) 0;
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-bold);
		cursor: pointer;
		text-align: left;
	}

	.feature-name {
		flex: 1;
	}

	.expand-indicator {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-bold);
		padding-left: var(--spacing-4);
	}

	/* Conflict indicators */
	.feature-header.has-conflicts {
		background-color: var(--color-warning-bg);
		border-left: 4px solid var(--color-warning);
		padding-left: var(--spacing-3);
	}

	.conflict-badge {
		margin-left: var(--spacing-2);
		font-size: var(--font-size-base);
	}

	.conflict-badge.user-changeable {
		animation: pulse-warning 2s infinite;
		cursor: help;
	}

	.conflict-badge.automatic {
		opacity: 0.7;
		cursor: default;
	}

	@keyframes pulse-warning {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}
</style>
