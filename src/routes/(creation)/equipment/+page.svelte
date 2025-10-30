<script lang="ts">
	import { get } from 'svelte/store';
	import { character_store } from '$lib/stores/character_store';
	import { applyChoice } from '$lib/stores/character_store_helpers';
	import { base } from '$app/paths';

	// Import class data
	import { fighter } from '$lib/data/classes/fighter';
	import { barbarian } from '$lib/data/classes/barbarian';
	import { bard } from '$lib/data/classes/bard';
	import { cleric } from '$lib/data/classes/cleric';
	import { druid } from '$lib/data/classes/druid';
	import { monk } from '$lib/data/classes/monk';
	import { paladin } from '$lib/data/classes/paladin';
	import { ranger } from '$lib/data/classes/ranger';
	import { rogue } from '$lib/data/classes/rogue';
	import { sorcerer } from '$lib/data/classes/sorcerer';
	import { warlock } from '$lib/data/classes/warlock';
	import { wizard } from '$lib/data/classes/wizard';

	// Import background data
	import { backgrounds } from '$lib/data/backgrounds';

	import type {
		ClassData,
		EquipmentChoice,
		SimpleEquipmentChoice,
		EquipmentOption,
		EquipmentSubChoice
	} from '$lib/data/types/ClassData';
	import type { BackgroundData } from '$lib/data/types/BackgroundData';

	// Create class lookup
	const classLookup: Record<string, ClassData> = {
		Fighter: fighter,
		Barbarian: barbarian,
		Bard: bard,
		Cleric: cleric,
		Druid: druid,
		Monk: monk,
		Paladin: paladin,
		Ranger: ranger,
		Rogue: rogue,
		Sorcerer: sorcerer,
		Warlock: warlock,
		Wizard: wizard
	};

	// Equipment choice state management
	interface EquipmentChoiceState {
		selectedOption?: number;
		subChoiceSelections?: Record<string, string[]>; // subchoice name -> selected items
	}

	let currentClass: ClassData | null = null;
	let currentBackground: BackgroundData | null = null;
	let equipmentChoices: Record<number, EquipmentChoiceState> = {};
	let backgroundEquipmentChoices: Record<string, number> = {};

	// Reactive variables for subchoice resolution
	let subchoiceResolution: Record<number, boolean> = {};
	let availableSubchoices: Record<number, EquipmentSubChoice[]> = {};

	// Reactive statements to get current selections
	$: {
		const className = $character_store.class;
		currentClass = className ? classLookup[className] : null;

		// Restore equipment choices from character store when class changes
		if (currentClass) {
			restoreEquipmentChoicesFromStore();
		}
	}

	$: {
		const backgroundName = $character_store.background;
		currentBackground = backgroundName
			? backgrounds.find((bg) => bg.name === backgroundName) || null
			: null;
	}

	// Reactive statements for subchoice resolution
	$: {
		if (currentClass?.startingEquipment?.choices) {
			subchoiceResolution = {};
			availableSubchoices = {};

			currentClass.startingEquipment.choices.forEach((choice, choiceIndex) => {
				if (
					isEquipmentChoice(choice) &&
					equipmentChoices[choiceIndex]?.selectedOption !== undefined
				) {
					const selectedOption = choice.options[equipmentChoices[choiceIndex].selectedOption!];
					subchoiceResolution[choiceIndex] = Boolean(
						selectedOption.subChoices && selectedOption.subChoices.length > 0
					);
					availableSubchoices[choiceIndex] = selectedOption.subChoices || [];
				} else {
					subchoiceResolution[choiceIndex] = false;
					availableSubchoices[choiceIndex] = [];
				}
			});
		}
	}

	// Restore equipment choices from character store
	function restoreEquipmentChoicesFromStore() {
		if (!currentClass?.startingEquipment?.choices) return;

		// Look for existing equipment choices in the character store's provenance
		const char = get(character_store);
		if (!char._provenance) return;

		const newEquipmentChoices: Record<number, EquipmentChoiceState> = {};

		// Restore each equipment choice
		currentClass.startingEquipment.choices.forEach((choice, choiceIndex) => {
			const scopeId = `class_equipment_${choiceIndex}`;
			const provenanceData = char._provenance![scopeId];

			if (provenanceData) {
				if (isEquipmentChoice(choice)) {
					// Access data from _set property (character store wraps our data)
					const actualData = provenanceData._set || provenanceData;

					// Check if we have the new selection state format
					if (actualData.selectedOption !== undefined) {
						// Restore from stored selection state (new format)
						newEquipmentChoices[choiceIndex] = {
							selectedOption: actualData.selectedOption,
							subChoiceSelections: actualData.subChoiceSelections || {}
						};
					} else if (actualData.inventory) {
						// Fallback to reverse-engineering from inventory (legacy format)
						const inventory = actualData.inventory as string[];

						// Find which option matches the current inventory
						for (let optionIndex = 0; optionIndex < choice.options.length; optionIndex++) {
							const option = choice.options[optionIndex];

							// Check if this option could produce the current inventory
							if (doesOptionMatchInventory(option, inventory)) {
								// Restore the main selection
								newEquipmentChoices[choiceIndex] = {
									selectedOption: optionIndex,
									subChoiceSelections: extractSubChoiceSelections(option, inventory)
								};
								break;
							}
						}
					}
				} else {
				}
			} else {
			}
		});

		// Only update if we found any choices to restore
		if (Object.keys(newEquipmentChoices).length > 0) {
			equipmentChoices = { ...equipmentChoices, ...newEquipmentChoices };
		} else {
		}
	}

	// Check if an option could produce the given inventory
	function doesOptionMatchInventory(option: EquipmentOption, inventory: string[]): boolean {
		// Get all possible items from this option
		const possibleItems: string[] = [];

		// Add direct items
		if (option.items) {
			possibleItems.push(...option.items);
		}

		// Add all possible subchoice items
		if (option.subChoices) {
			for (const subChoice of option.subChoices) {
				possibleItems.push(...subChoice.options);
			}
		}

		// Check if all inventory items could come from this option
		return inventory.every((item) => possibleItems.includes(item));
	}

	// Extract subchoice selections from inventory
	function extractSubChoiceSelections(
		option: EquipmentOption,
		inventory: string[]
	): Record<string, string[]> {
		const subChoiceSelections: Record<string, string[]> = {};

		if (!option.subChoices) return subChoiceSelections;

		// For each subchoice, find which items from inventory belong to it
		for (const subChoice of option.subChoices) {
			const matchingItems = inventory.filter((item) => subChoice.options.includes(item));
			if (matchingItems.length > 0) {
				subChoiceSelections[subChoice.name] = matchingItems;
			}
		}

		return subChoiceSelections;
	}

	// Parse equipment pack to extract name and description
	function parseEquipmentPack(item: string): { name: string; description: string } | null {
		if (item.includes('(includes:')) {
			const match = item.match(/^(.+?)\s*\(includes:\s*(.+)\)$/);
			if (match) {
				return {
					name: match[1].trim(),
					description: match[2].trim()
				};
			}
		}
		return null;
	}

	// Check if character meets proficiency requirements for an equipment option
	function meetsRequirements(option: EquipmentOption): boolean {
		if (!option.requires || option.requires.length === 0) {
			return true; // No requirements
		}

		const char = get(character_store);
		if (!char.proficiencies) {
			return false;
		}

		// Check if character has all required proficiencies
		return option.requires.every((req) => char.proficiencies.includes(req));
	}

	// Type guard functions
	function isEquipmentChoice(
		choice: EquipmentChoice | SimpleEquipmentChoice
	): choice is EquipmentChoice {
		return (
			'options' in choice &&
			choice.options.length > 0 &&
			typeof choice.options[0] === 'object' &&
			'label' in choice.options[0]
		);
	}

	function isSimpleEquipmentChoice(
		choice: EquipmentChoice | SimpleEquipmentChoice
	): choice is SimpleEquipmentChoice {
		return 'options' in choice && choice.options.length > 0 && Array.isArray(choice.options[0]);
	}

	// Handle simple equipment choices (legacy format)
	function handleSimpleEquipmentChoice(choiceIndex: number, optionIndex: number) {
		if (!currentClass) return;

		const choice = currentClass.startingEquipment.choices[choiceIndex] as SimpleEquipmentChoice;
		const selectedOption = choice.options[optionIndex];

		const scopeId = `class_equipment_${choiceIndex}`;
		applyChoice(scopeId, { inventory: selectedOption });
	}

	// Handle main option selection for enhanced equipment choices
	function handleMainOptionSelection(choiceIndex: number, optionIndex: number) {
		if (!currentClass) return;

		const choice = currentClass.startingEquipment.choices[choiceIndex] as EquipmentChoice;
		const selectedOption = choice.options[optionIndex];

		// Clear any previous selections for this choice first
		const scopeId = `class_equipment_${choiceIndex}`;
		applyChoice(scopeId, { inventory: [] });

		// Create a completely new object to force reactivity
		const newEquipmentChoices = { ...equipmentChoices };
		newEquipmentChoices[choiceIndex] = {
			selectedOption: optionIndex,
			subChoiceSelections: {}
		};
		equipmentChoices = newEquipmentChoices;

		// Store the selection state in provenance for persistence
		const selectionState = {
			selectedOption: optionIndex,
			subChoiceSelections: {},
			inventory: []
		};

		applyChoice(scopeId, selectionState);

		// If this option has direct items (no subchoices), apply immediately
		if (selectedOption.items && !selectedOption.subChoices) {
			selectionState.inventory = selectedOption.items;
			applyChoice(scopeId, selectionState);
		}
		// If it has subchoices, wait for user to select those
	}

	// Handle sub-choice selection
	function handleSubChoiceSelection(
		choiceIndex: number,
		subChoiceName: string,
		selectedItems: string[]
	) {
		if (!currentClass || !equipmentChoices[choiceIndex]) return;

		const choice = currentClass.startingEquipment.choices[choiceIndex] as EquipmentChoice;
		const selectedOptionIndex = equipmentChoices[choiceIndex].selectedOption;

		if (selectedOptionIndex === undefined) return;

		const selectedOption = choice.options[selectedOptionIndex];

		// Create completely new object to force reactivity
		const newEquipmentChoices = { ...equipmentChoices };
		newEquipmentChoices[choiceIndex] = {
			...equipmentChoices[choiceIndex],
			subChoiceSelections: {
				...equipmentChoices[choiceIndex].subChoiceSelections,
				[subChoiceName]: selectedItems
			}
		};
		equipmentChoices = newEquipmentChoices;

		// Always store the current selection state (even if incomplete)
		const scopeId = `class_equipment_${choiceIndex}`;
		const selectionState = {
			selectedOption: selectedOptionIndex,
			subChoiceSelections: newEquipmentChoices[choiceIndex].subChoiceSelections!,
			inventory: [] as string[]
		};

		// Check if all subchoices are resolved
		const allSubChoicesResolved =
			selectedOption.subChoices?.every(
				(subChoice) =>
					newEquipmentChoices[choiceIndex].subChoiceSelections![subChoice.name]?.length > 0
			) ?? true;

		if (allSubChoicesResolved) {
			// Collect all selected items
			let allItems: string[] = [];

			// Add direct items if any
			if (selectedOption.items) {
				allItems.push(...selectedOption.items);
			}

			// Add subchoice selections
			if (selectedOption.subChoices && newEquipmentChoices[choiceIndex].subChoiceSelections) {
				for (const subChoice of selectedOption.subChoices) {
					const selections = newEquipmentChoices[choiceIndex].subChoiceSelections![subChoice.name];
					if (selections) {
						allItems.push(...selections);
					}
				}
			}

			selectionState.inventory = allItems;
		}

		// Store the selection state in provenance

		applyChoice(scopeId, selectionState);
	}

	// Handle background equipment choice (legacy support)
	function handleBackgroundEquipmentChoice(choiceIndex: number, optionIndex: number) {
		if (!currentBackground?.startingEquipment) return;

		backgroundEquipmentChoices[choiceIndex] = optionIndex;

		// Apply the background equipment choice to character store
		const choice = currentBackground.startingEquipment.choices[choiceIndex];
		const selectedOption = choice.options[optionIndex];

		const scopeId = `background_equipment_${choiceIndex}`;
		applyChoice(scopeId, { inventory: selectedOption });
	}

	// Check if a subchoice needs resolution
	function needsSubChoiceResolution(choiceIndex: number): boolean {
		if (equipmentChoices[choiceIndex]?.selectedOption === undefined) return false;

		const choice = currentClass?.startingEquipment.choices[choiceIndex] as EquipmentChoice;
		if (!choice || !isEquipmentChoice(choice)) return false;

		const selectedOption = choice.options[equipmentChoices[choiceIndex].selectedOption!];
		return Boolean(selectedOption.subChoices && selectedOption.subChoices.length > 0);
	}

	// Get subchoices for the currently selected option
	function getSubChoicesForSelection(choiceIndex: number): EquipmentSubChoice[] {
		if (equipmentChoices[choiceIndex]?.selectedOption === undefined) return [];

		const choice = currentClass?.startingEquipment.choices[choiceIndex] as EquipmentChoice;
		if (!choice || !isEquipmentChoice(choice)) return [];

		const selectedOption = choice.options[equipmentChoices[choiceIndex].selectedOption!];
		return selectedOption.subChoices || [];
	}
</script>

<div class="main-content">
	{#if !$character_store.class}
		<div class="no-selection">
			<h2>No Class Selected</h2>
			<p>Please select a class first to see starting equipment options.</p>
			<a href="{base}/class" class="nav-link">Go to Class Selection</a>
		</div>
	{:else if !currentClass?.startingEquipment}
		<div class="no-equipment">
			<h2>Equipment Not Available</h2>
			<p>
				Starting equipment data is not yet available for {$character_store.class}. This will be
				added soon!
			</p>
		</div>
	{:else}
		<!-- Class Equipment Section -->
		<div class="equipment-section">
			<div class="section-header">
				<img src={currentClass.image} alt={currentClass.name} class="class-icon" />
				<h2>{currentClass.name} Starting Equipment</h2>
			</div>

			<!-- Fixed Equipment -->
			{#if currentClass.startingEquipment.fixed.length > 0}
				<div class="equipment-group">
					<h3>Standard Equipment</h3>

					<div class="equipment-list">
						{#each currentClass.startingEquipment.fixed as item}
							{@const packInfo = parseEquipmentPack(item)}
							{#if packInfo}
								<div class="equipment-item-pack class-equipment">
									<div class="pack-name">{packInfo.name}</div>
									<div class="pack-description">{packInfo.description}</div>
								</div>
							{:else}
								<div class="equipment-item class-equipment">
									<span class="item-name">{item}</span>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/if}

			<!-- Equipment Choices -->
			{#each currentClass.startingEquipment.choices as choice, choiceIndex}
				<div class="equipment-group">
					<h3>{choice.name}</h3>
					<p class="choice-description">{choice.description}</p>

					{#if isEquipmentChoice(choice)}
						<!-- Enhanced Equipment Choice -->
						<div class="enhanced-choice">
							<!-- Main Option Selection -->
							<div class="main-options">
								{#each choice.options as option, optionIndex}
									{@const hasRequirements = meetsRequirements(option)}
									<button
										class="choice-option"
										class:selected={equipmentChoices[choiceIndex]?.selectedOption === optionIndex}
										class:disabled={!hasRequirements}
										disabled={!hasRequirements}
										on:click={() => hasRequirements && handleMainOptionSelection(choiceIndex, optionIndex)}
									>
										<div class="option-content">
											<div class="option-label">{option.label}</div>
											{#if !hasRequirements}
												<div class="requirement-warning">Requires: {option.requires?.join(', ')}</div>
											{/if}
											{#if option.items && option.items.length > 0 && option.items.some((item) => item.includes('(includes:'))}
												<div class="option-description">
													{#each option.items as item}
														{#if item.includes('(includes:')}
															<div class="item-detail">{item}</div>
														{/if}
													{/each}
												</div>
											{/if}
										</div>
									</button>
								{/each}
							</div>

							<!-- Sub-choice Resolution -->
							{#if subchoiceResolution[choiceIndex]}
								<div class="subchoices-container">
									{#each availableSubchoices[choiceIndex] as subChoice}
										<div class="subchoice-group">
											<h4>{subChoice.name}</h4>
											<p class="subchoice-description">{subChoice.description}</p>

											{#if subChoice.type === 'weapon-list'}
												<div class="weapon-selection">
													<select
														value={equipmentChoices[choiceIndex]?.subChoiceSelections?.[
															subChoice.name
														]?.[0] || ''}
														class="subchoice-select"
														on:change={(e) => {
															const target = e.target as HTMLSelectElement;
															if (target.value) {
																handleSubChoiceSelection(choiceIndex, subChoice.name, [
																	target.value
																]);
															}
														}}
													>
														<option value="">Choose {subChoice.name.toLowerCase()}...</option>
														{#each subChoice.options as weapon}
															<option value={weapon}>{weapon}</option>
														{/each}
													</select>
												</div>
											{:else if subChoice.type === 'simple-list'}
												<div class="simple-selection">
													<select
														class="subchoice-select"
														value={equipmentChoices[choiceIndex]?.subChoiceSelections?.[
															subChoice.name
														]?.[0] || ''}
														on:change={(e) => {
															const target = e.target as HTMLSelectElement;
															if (target.value) {
																handleSubChoiceSelection(choiceIndex, subChoice.name, [
																	target.value
																]);
															}
														}}
													>
														<option value="">Choose {subChoice.name.toLowerCase()}...</option>
														{#each subChoice.options as item}
															<option value={item}>{item}</option>
														{/each}
													</select>
												</div>
											{/if}
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{:else if isSimpleEquipmentChoice(choice)}
						<!-- Legacy Simple Equipment Choice -->
						{#if choice.options.length > 3}
							<!-- Use dropdown for many options -->
							<div class="dropdown-container">
								<select
									class="equipment-dropdown"
									value=""
									on:change={(e) => {
										const target = e.target as HTMLSelectElement;
										if (target.value) {
											handleSimpleEquipmentChoice(choiceIndex, parseInt(target.value));
										}
									}}
								>
									<option value="" disabled>Choose an option...</option>
									{#each choice.options as option, optionIndex}
										<option value={optionIndex}>
											{option.join(', ')}
										</option>
									{/each}
								</select>
							</div>
						{:else}
							<!-- Use buttons for few options -->
							<div class="choice-options">
								{#each choice.options as option, optionIndex}
									<button
										class="choice-option"
										on:click={() => handleSimpleEquipmentChoice(choiceIndex, optionIndex)}
									>
										<div class="option-items">
											{#each option as item}
												<span class="option-item">{item}</span>
											{/each}
										</div>
									</button>
								{/each}
							</div>
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Background Equipment Section -->
	{#if currentBackground}
		<div class="equipment-section">
			<div class="section-header">
				<img src={currentBackground.image} alt={currentBackground.name} class="background-icon" />
				<h2>{currentBackground.name} Equipment</h2>
			</div>

			<!-- Check if using new startingEquipment format -->
			{#if currentBackground.startingEquipment}
				<!-- Fixed Background Equipment -->
				{#if currentBackground.startingEquipment.fixed.length > 0}
					<div class="equipment-group">
						<h3>Fixed Equipment</h3>

						<div class="equipment-list">
							{#each currentBackground.startingEquipment.fixed as item}
								<div class="equipment-item background">
									<span class="item-name">{item}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Background Equipment Choices -->
				{#each currentBackground.startingEquipment.choices as choice, choiceIndex}
					<div class="equipment-group">
						<h3>{choice.name}</h3>
						<p class="choice-description">{choice.description}</p>

						{#if choice.options.length > 3}
							<!-- Use dropdown for many options -->
							<div class="dropdown-container">
								<select
									class="equipment-dropdown"
									value={backgroundEquipmentChoices[choiceIndex] ?? ''}
									on:change={(e) => {
										const target = e.target as HTMLSelectElement;
										if (target.value) {
											handleBackgroundEquipmentChoice(choiceIndex, parseInt(target.value));
										}
									}}
								>
									<option value="" disabled>Choose an option...</option>
									{#each choice.options as option, optionIndex}
										<option value={optionIndex}>
											{option.join(', ')}
										</option>
									{/each}
								</select>
							</div>
						{:else}
							<!-- Use buttons for few options -->
							<div class="choice-options">
								{#each choice.options as option, optionIndex}
									<button
										class="choice-option"
										class:selected={backgroundEquipmentChoices[choiceIndex] === optionIndex}
										on:click={() => handleBackgroundEquipmentChoice(choiceIndex, optionIndex)}
									>
										<div class="option-items">
											{#each option as item}
												<span class="option-item">{item}</span>
											{/each}
										</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<!-- Fallback to old equipment format -->
				<div class="equipment-group">
					<h3>Background Equipment</h3>

					<div class="equipment-list">
						{#each currentBackground.equipment as item}
							<div class="equipment-item background">
								<span class="item-name">{item}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{:else if $character_store.background}
		<div class="equipment-section">
			<h2>Background Equipment</h2>
			<p>Background equipment data is loading...</p>
		</div>
	{:else}
		<div class="no-selection">
			<h2>No Background Selected</h2>
			<p>Select a background to see additional starting equipment.</p>
			<a href="{base}/background" class="nav-link">Go to Background Selection</a>
		</div>
	{/if}
</div>

<style>
	.main-content {
		padding: 2rem 1rem;
		padding-top: 80px;
		max-width: 50vw;
		margin: 0 auto;
	}

	.intro-text {
		text-align: center;
		margin-bottom: 2rem;
	}

	.intro-text h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.intro-text p {
		font-size: 1.1rem;
		color: #6b7280;
		max-width: 600px;
		margin: 0 auto;
	}

	.equipment-section {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
		overflow: hidden;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
		border-bottom: 1px solid #e5e7eb;
	}

	.class-icon,
	.background-icon {
		width: 48px;
		height: 48px;
		border-radius: 8px;
		object-fit: cover;
	}

	.section-header h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}

	.equipment-group {
		padding: 1.5rem;
		border-bottom: 1px solid #f3f4f6;
	}

	.equipment-group:last-child {
		border-bottom: none;
	}

	.equipment-group h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.choice-description,
	.fixed-equipment-note,
	.background-note {
		color: #6b7280;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	.equipment-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.equipment-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: #f9fafb;
		border-radius: 6px;
		border-left: 4px solid #d1d5db;
	}

	.equipment-item.class-equipment {
		border-left-color: #3b82f6;
	}

	.equipment-item.background {
		border-left-color: #10b981;
	}

	.equipment-item-pack {
		padding: 0.75rem;
		background: #f9fafb;
		border-radius: 6px;
		border-left: 4px solid #d1d5db;
		margin-bottom: 0.5rem;
	}

	.equipment-item-pack.class-equipment {
		border-left-color: #3b82f6;
	}

	.equipment-item-pack.background {
		border-left-color: #10b981;
	}

	.pack-name {
		font-weight: 600;
		font-size: 1rem;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.pack-description {
		font-size: 0.875rem;
		color: #6b7280;
		line-height: 1.5;
	}

	.item-name {
		font-weight: 500;
		color: #1f2937;
	}

	.item-type {
		font-size: 0.875rem;
		color: #6b7280;
		background: #e5e7eb;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.enhanced-choice {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.main-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.choice-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.choice-option {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 1rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
		width: 100%;
	}

	.choice-option:hover {
		border-color: #3b82f6;
		box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
	}

	.choice-option.selected {
		border-color: #3b82f6;
		background: #eff6ff;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.choice-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: #f3f4f6;
	}

	.choice-option.disabled:hover {
		border-color: #e5e7eb;
		box-shadow: none;
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	.option-label {
		font-weight: 600;
		font-size: 1rem;
		color: #1f2937;
	}

	.option-description {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.item-detail {
		font-size: 0.875rem;
		color: #6b7280;
		line-height: 1.5;
	}

	.requirement-warning {
		font-size: 0.75rem;
		color: #dc2626;
		margin-top: 0.25rem;
		font-weight: 500;
	}

	.subchoices-container {
		background: #f0f9ff;
		border-radius: 8px;
		padding: 1.5rem;
		border: 2px solid #3b82f6;
		margin-top: 1rem;
		box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.subchoice-group {
		margin-bottom: 1rem;
	}

	.subchoice-group:last-child {
		margin-bottom: 0;
	}

	.subchoice-group h4 {
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.subchoice-description {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.75rem;
	}

	.subchoice-select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background: white;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.subchoice-select:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.dropdown-container {
		margin-top: 0.5rem;
	}

	.equipment-dropdown {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background: white;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.equipment-dropdown:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.option-items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.option-item {
		background: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		color: #374151;
	}

	.no-selection,
	.no-equipment {
		text-align: center;
		padding: 3rem 1rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.no-selection h2,
	.no-equipment h2 {
		font-size: 1.5rem;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.no-selection p,
	.no-equipment p {
		color: #6b7280;
		margin-bottom: 1.5rem;
	}

	.nav-link {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: #3b82f6;
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.nav-link:hover {
		background: #2563eb;
	}

	@media (min-width: 768px) {
		.main-options,
		.choice-options {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 1rem;
		}
	}
</style>
