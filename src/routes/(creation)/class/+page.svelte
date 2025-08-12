<script lang="ts">
	import { base } from '$app/paths';
	import { barbarian } from '$lib/data/classes/barbarian';

	import type { ClassData } from '$lib/data/types/ClassData';
	import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

	const classes: ClassData[] = [barbarian];

	let selectedClass: ClassData | null = null;
	let selectedClassData: ClassData | null = null;

	let featureSelections: Record<string, (string | null)[]> = {};

	// Top-level features
	$: mergedFeatures = selectedClassData
		? [...(selectedClassData.classFeatures || [])]
		: [];

	function onSelectFeatureOption(feature: FeaturePrompt, index: number, selectedOption: string) {
		if (!featureSelections[feature.name]) {
			featureSelections[feature.name] = Array(feature.featureOptions?.numPicks || 1).fill(null);
		}
		const prev = featureSelections[feature.name][index];
		featureSelections[feature.name][index] = selectedOption;

		if (prev !== selectedOption) {
			clearNestedFeatureSelections(feature, featureSelections);
		}
	}

	function clearNestedFeatureSelections(feature: FeaturePrompt, selections: Record<string, (string | null)[]>) {
		if (!feature.featureOptions) return;
		for (const option of feature.featureOptions.options) {
			if (typeof option !== 'string' && option.nestedPrompts) {
				for (const nested of option.nestedPrompts) {
					delete selections[nested.name];
				}
			}
		}
	}

	function getAvailableOptions(feature: FeaturePrompt, index: number): (string | { name: string })[] {
		const allOptions = feature.featureOptions?.options || [];
		const chosen = featureSelections[feature.name] || [];

		return allOptions.filter(opt => {
			const optName = typeof opt === 'string' ? opt : opt.name;
			return !chosen.some((choice, idx) => choice === optName && idx !== index);
		});
	}

	// Get nested prompts only one level deep, from current selections of a feature
	function getNestedPrompts(feature: FeaturePrompt, selectedOptions: (string | null)[]) {
		if (!feature.featureOptions) return [];
		const nested: FeaturePrompt[] = [];
		for (const option of feature.featureOptions.options) {
			const optionName = typeof option === 'string' ? option : option.name;
			if (
				selectedOptions.includes(optionName) &&
				typeof option !== 'string' &&
				option.nestedPrompts
			) {
				nested.push(...option.nestedPrompts);
			}
		}
		return nested;
	}

	function removeSelectedClass() {
		selectedClassData = null;
		selectedClass = null;
		featureSelections = {};
	}

	function confirmAddClass() {
		if (selectedClass) {
			selectedClassData = selectedClass;
			selectedClass = null;
			featureSelections = {};
		}
	}
</script>

<div class="main-content">
	<h2>Class Selection</h2>
	<p>
		In Dungeons & Dragons, your character's class defines their role in the party,
		abilities, and how they interact with the world. Each class offers unique strengths,
		weaknesses, and ways to play.
	</p>

	{#if !selectedClassData}
		<div class="class-cards">
			{#each classes as classInfo}
				<button class="class-card" on:click={() => (selectedClass = classInfo)}>
					<div class="card-left">
						<img src={classInfo.image} alt={`${classInfo.name} icon`} />
						<span>{classInfo.name}</span>
					</div>
					<img
						class="card-arrow"
						src="{base}/basic_icons/blue_next.png"
						alt="next arrow"
					/>
				</button>
			{/each}
		</div>
	{/if}

	{#if selectedClass}
		<!-- Popup Preview -->
		<div class="popup">
			<div class="popup-content">
				<div class="popup-header">
					<span>CONFIRM ADD CLASS</span>
					<button class="close-button" on:click={() => (selectedClass = null)}>×</button>
				</div>

				<div class="popup-body">
					<h2>{selectedClass.name}</h2>
					<p class="description">{selectedClass.description}</p>
					<p><strong>Primary Ability:</strong> {selectedClass.primaryAbility}</p>

					{#each selectedClass.classFeatures as feature}
						<div class="feature-card">
							<h4>{feature.name}</h4>
							<p>{@html feature.description}</p>
						</div>
					{/each}
				</div>

				<div class="popup-footer">
					<button class="cancel-button" on:click={() => (selectedClass = null)}>Cancel</button>
					<button class="add-button" on:click={confirmAddClass}>Add Class</button>
				</div>
			</div>
		</div>
	{/if}

	{#if selectedClassData}
		<!-- Selected class view -->
		<div class="selected-class-section">
			<h2>
				{selectedClassData.name}
				<button on:click={removeSelectedClass} aria-label="Remove selected class">✕</button>
			</h2>

			<!-- Render top-level features -->
			{#each mergedFeatures as feature (feature.name)}
				<div class="feature-card">
					<h4>{feature.name}</h4>
					<p>{@html feature.description}</p>

					{#if feature.featureOptions}
						{#each Array(feature.featureOptions.numPicks) as _, idx}
							<select
								value={featureSelections[feature.name]?.[idx] || ''}
								on:change={(e: Event) => {
									const target = e.target as HTMLSelectElement;
									onSelectFeatureOption(feature, idx, target.value);
								}}
							>
								<option value="" disabled selected>
									{feature.featureOptions.placeholderText || 'Select an option'}
								</option>
								{#each getAvailableOptions(feature, idx) as option}
									<option value={typeof option === 'string' ? option : option.name}>
										{typeof option === 'string' ? option : option.name}
									</option>
								{/each}
							</select>
						{/each}

						<!-- Render one-level nested prompts -->
						{#each getNestedPrompts(feature, featureSelections[feature.name] || []) as nestedFeature (nestedFeature.name)}
							<div class="feature-card nested">
								<h4>{nestedFeature.name}</h4>
								<p>{nestedFeature.description}</p>
								<!-- No further nesting here -->
							</div>
						{/each}
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Your styles here, same as before */
	.main-content {
		padding: 1.5rem;
	}
	.class-cards {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
	}
	.class-card {
		width: 30%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 2rem;
		font-size: 1.2rem;
		cursor: pointer;
		border: 2px solid #ccc;
		border-radius: 0.5rem;
		background-color: #f8f8f8;
		transition: background-color 0.2s ease;
		text-align: left;
	}
	.card-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.class-card img {
		width: 40px;
		height: 40px;
		object-fit: contain;
	}
	.card-arrow {
		width: 24px;
		height: 24px;
		object-fit: contain;
		margin-left: auto;
	}
	.class-card:hover,
	.class-card:focus {
		background-color: #e0e0e0;
		outline: none;
	}
	.class-card:focus {
		box-shadow: 0 0 0 3px rgba(100, 149, 237, 0.5);
	}
	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
	.popup-content {
		background: #fff;
		width: 50vw;
		height: 80vh;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
	}
	.popup-header {
		background: #222;
		color: white;
		padding: 12px 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
		position: sticky;
		top: 0;
		z-index: 10;
	}
	.close-button {
		background: none;
		border: none;
		color: white;
		font-size: 1.2rem;
		cursor: pointer;
	}
	.popup-body {
		padding: 16px;
		overflow-y: auto;
		flex: 1;
	}
	.description {
		font-size: 0.95rem;
		color: #555;
		margin-bottom: 1rem;
	}
	.selected-class-section {
		display: flex;
		flex-direction: column;
		align-items: center; /* center cards horizontally */
		gap: 0.25rem;
	}
	.feature-card {
		border: 1px solid #ccc;
		border-radius: 6px;
		padding: 10px 12px;
		margin: 10px 0;
		background: #f9f9f9;

		width: 100%;
		max-width: 50vw; /* limit card width to half viewport */
		box-sizing: border-box;
	}
	.feature-card h4 {
		margin: 0 0 4px 0;
		font-weight: bold; /* bold feature title */
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
		margin-left: 1rem;
		border-color: #888;
		background-color: #eee;
	}
	.popup-footer {
		padding: 12px 16px;
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		border-top: 1px solid #ddd;
		background: #f0f0f0;
	}
	.selected-class-section h2 {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.selected-class-section h2 button {
		font-size: 1.5rem;
		cursor: pointer;
		background: none;
		border: none;
		color: #c00;
	}
</style>
