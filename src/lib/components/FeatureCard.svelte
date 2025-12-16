<script lang="ts">
	import type { FeaturePrompt, ComplexOption } from '$lib/data/types/Features';
	import FeatureDescription from '$lib/components/FeatureDescription.svelte';
	import {
		isFeatureIncomplete,
		getNestedPrompts,
		getGloballyAvailableOptions
	} from './feature-card-utils';
	import { activeConflicts } from '$lib/stores/conflict_store';

	// Props
	export let feature: FeaturePrompt;
	export let featureSelections: Record<string, (string | null)[]>;
	export let expandedFeatures: Set<string>;
	export let selectionVersion: number;
	export let characterStore: any;
	export let nested: boolean = false;

	// Event handlers - passed down from parent
	export let onSelectOption: (feature: FeaturePrompt, index: number, value: string) => void;
	export let onToggleExpand: (featureName: string) => void;

	// Computed properties
	$: isExpanded = expandedFeatures.has(feature.name);
	$: isIncomplete = isFeatureIncomplete(feature, featureSelections);
	$: isComplete = !isIncomplete && feature.featureOptions;
	$: nestedPrompts = getNestedPrompts(feature, featureSelections[feature.name] || []);
	$: hasConflicts = checkFeatureHasConflicts(feature.name);

	function checkFeatureHasConflicts(featureName: string): boolean {
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
		onSelectOption(feature, index, target.value);
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
				{#key `${feature.name}:${idx}:${selectionVersion}`}
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
				{/key}
			{/each}

			<!-- Render nested prompts -->
			{#each nestedPrompts as nestedFeature (nestedFeature.name)}
				<svelte:self
					feature={nestedFeature}
					{featureSelections}
					{expandedFeatures}
					{selectionVersion}
					{characterStore}
					{onSelectOption}
					{onToggleExpand}
					nested={true}
				/>
			{/each}
		{/if}
	{/if}
</div>

<style>
	.feature-card {
		border: 2px solid #ccc;
		border-radius: 6px;
		padding: 10px 12px;
		margin: 10px 0;
		background: #f9f9f9;
		width: 100%;
		max-width: 50vw;
		box-sizing: border-box;
		transition: border-color 0.2s ease;
	}

	.feature-card select {
		margin-top: 0.5rem;
		width: 100%;
		padding: 0.3rem 0.5rem;
		font-size: 1rem;
		border-radius: 4px;
		border: 1px solid #aaa;
	}

	.feature-card.nested {
		margin-top: 1rem;
		margin-left: 1.5rem;
		width: calc(100% - 2rem);
		background-color: #eee;
		border-color: #888;
		border-width: 1px;
		padding: 8px 10px;
	}

	/* Enhanced nesting: each level gets progressively more indented and lighter */
	.feature-card.nested .feature-card.nested {
		margin-left: 1rem;
		background-color: #f5f5f5;
		border-color: #999;
		padding: 6px 8px;
	}

	.feature-card.nested .feature-card.nested .feature-card.nested {
		margin-left: 0.75rem;
		background-color: #fafafa;
		border-color: #aaa;
		padding: 4px 6px;
		font-size: 0.95rem;
	}

	.feature-card.incomplete {
		border-color: red;
	}

	.feature-card.complete {
		border-color: #4a90e2;
	}

	.feature-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		background: none;
		border: none;
		padding: 0.5rem 0;
		font-size: 1.1rem;
		font-weight: bold;
		cursor: pointer;
		text-align: left;
	}

	.feature-name {
		flex: 1;
	}

	.expand-indicator {
		font-size: 1.2rem;
		font-weight: bold;
		padding-left: 1rem;
	}

	/* Conflict indicators */
	.feature-header.has-conflicts {
		background-color: #fef2f2;
		border-left: 4px solid #dc2626;
		padding-left: 0.75rem;
	}

	.conflict-badge {
		margin-left: 0.5rem;
		font-size: 1rem;
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
