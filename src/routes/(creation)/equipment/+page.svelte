<script lang="ts">
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { character_store } from '$lib/stores/character_store';
	import { applyChoice } from '$lib/stores/character_store_helpers';
	import { base } from '$app/paths';
	import { getProficiencyGrantedEquipment } from '$lib/stores/proficiency_equipment_sync';
	import { shouldHideEquipmentChoice, getEquipmentFromProficienciesBySource } from '$lib/data/proficiency-equipment-mapping';

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

	// Import weapon utilities
	import { extractWeaponsFromInventory, normalizeWeaponName } from '$lib/data/equipment/weapon-data';

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

	// Proficiency-granted equipment (reactive, filtered by source)
	let classProficiencyEquipment: string[] = [];
	let backgroundProficiencyEquipment: string[] = [];
	let speciesProficiencyEquipment: string[] = [];
	
	$: {
		const char = $character_store;
		const proficiencies = char.proficiencies || [];
		const characterClass = char.class;
		const characterSubclass = char.subclass;
		const characterBackground = char.background;
		const characterSpecies = char.race; // Character store uses 'race' field
		
		classProficiencyEquipment = getEquipmentFromProficienciesBySource(proficiencies, characterClass, characterSubclass, characterBackground, characterSpecies, 'class');
		backgroundProficiencyEquipment = getEquipmentFromProficienciesBySource(proficiencies, characterClass, characterSubclass, characterBackground, characterSpecies, 'background');
		speciesProficiencyEquipment = getEquipmentFromProficienciesBySource(proficiencies, characterClass, characterSubclass, characterBackground, characterSpecies, 'species');
	}

	// Helper function to check if a background equipment option should be hidden
	function shouldHideBackgroundOption(option: string[]): boolean {
		const char = get(character_store);
		const proficiencies = char.proficiencies || [];
		
		// Hide if ALL items in the option are proficiency-granted
		// This ensures we only hide complete duplicates
		return option.every(item => shouldHideEquipmentChoice(item, proficiencies));
	}

	// Helper function to check if an entire background choice should be hidden
	// This handles categories like "artisan's tools" or "musical instruments"
	function shouldHideEntireBackgroundChoice(choice: { name: string; description: string; options: string[][] }): boolean {
		const char = get(character_store);
		const proficiencies = char.proficiencies || [];
		
		// Define category keywords that indicate this is a category-based choice
		const categoryKeywords = [
			"artisan's tool",
			"artisan tool",
			"musical instrument",
			"gaming set",
			"game set"
		];
		
		// Check if the choice name or description contains a category keyword
		const choiceText = (choice.name + ' ' + choice.description).toLowerCase();
		const isCategoryChoice = categoryKeywords.some(keyword => choiceText.includes(keyword));
		
		if (!isCategoryChoice) return false;
		
		// If this is a category choice, check if user has ANY proficiency from this category
		// Flatten all options to get all possible items in this category
		const allItemsInCategory = choice.options.flat();
		
		// If user has proficiency in ANY item from this category, hide the entire choice
		return allItemsInCategory.some(item => {
			// Check if this item would be granted by proficiencies
			return shouldHideEquipmentChoice(item, proficiencies);
		});
	}

	// Helper function to check if a class equipment choice should be completely hidden
	function shouldHideClassEquipmentChoice(choice: EquipmentChoice | SimpleEquipmentChoice): boolean {
		const char = get(character_store);
		const proficiencies = char.proficiencies || [];
		
		if (!isEquipmentChoice(choice)) return false;
		
		// Check if ALL options in this choice would grant items that are proficiency-granted
		const enhancedChoice = choice as EquipmentChoice;
		return enhancedChoice.options.every(option => {
			// Check direct items
			if (option.items) {
				const allItemsGranted = option.items.every(item => 
					shouldHideEquipmentChoice(item, proficiencies)
				);
				if (allItemsGranted) return true;
			}
			
			// Check subchoice options
			if (option.subChoices) {
				const allSubchoicesGranted = option.subChoices.every(subChoice => 
					subChoice.options.every(item => shouldHideEquipmentChoice(item, proficiencies))
				);
				if (allSubchoicesGranted) return true;
			}
			
			return false;
		});
	}

	// Reactive statements to get current selections
	$: {
		const className = $character_store.class;
		currentClass = className ? classLookup[className] : null;

		// Restore equipment choices from character store when class changes
		if (currentClass) {
			restoreEquipmentChoicesFromStore();
		}
	}
	
	// Apply fixed equipment on mount or when class changes
	onMount(() => {
		applyFixedEquipment();
	});
	
	$: if (currentClass) {
		applyFixedEquipment();
	}
	
	$: if (currentBackground) {
		applyFixedBackgroundEquipment();
	}
	
	// Apply fixed class equipment to inventory and attacks
	function applyFixedEquipment() {
		if (!currentClass?.startingEquipment?.fixed) {
			// If no fixed equipment, clean up any previously applied fixed equipment
			const char = get(character_store);
			const scopeId = 'class_fixed_equipment';
			if (char._provenance?.[scopeId]) {
				// Apply with empty arrays to clear
				applyChoice(scopeId, {
					inventory: [],
					attacks: []
				});
			}
			return;
		}
		
		const fixedItems = currentClass.startingEquipment.fixed;
		const scopeId = 'class_fixed_equipment';
		
		// Extract weapons from fixed equipment
		const weaponNames = extractWeaponsFromInventory(fixedItems);
		const normalizedWeapons = weaponNames.map(normalizeWeaponName);
		
		// applyChoice will automatically revert previous values if scope exists
		applyChoice(scopeId, {
			inventory: fixedItems,
			attacks: normalizedWeapons
		});
	}
	
	// Apply fixed background equipment to inventory and attacks
	function applyFixedBackgroundEquipment() {
		if (!currentBackground?.startingEquipment?.fixed) {
			// If no fixed equipment, clean up any previously applied fixed equipment
			const char = get(character_store);
			const scopeId = 'background_fixed_equipment';
			if (char._provenance?.[scopeId]) {
				// Apply with empty arrays to clear
				applyChoice(scopeId, {
					inventory: [],
					attacks: []
				});
			}
			return;
		}
		
		const fixedItems = currentBackground.startingEquipment.fixed;
		const scopeId = 'background_fixed_equipment';
		
		// Extract weapons from fixed equipment
		const weaponNames = extractWeaponsFromInventory(fixedItems);
		const normalizedWeapons = weaponNames.map(normalizeWeaponName);
		
		// applyChoice will automatically revert previous values if scope exists
		applyChoice(scopeId, {
			inventory: fixedItems,
			attacks: normalizedWeapons
		});
	}

	$: {
		const backgroundName = $character_store.background;
		currentBackground = backgroundName
			? backgrounds.find((bg) => bg.name === backgroundName) || null
			: null;
		
		// Restore background equipment choices when background changes
		if (currentBackground) {
			restoreBackgroundEquipmentChoicesFromStore();
		}
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
			const  provenanceData = char._provenance![scopeId];

			if (provenanceData) {
				if (isEquipmentChoice(choice)) {
					// Access data from _set property (character store wraps our data)
					// This next line of code gives the following error.
					// Property '_set' does not exist on type 'Partial<Character>'.ts(2339)
					const actualData = provenanceData._set || provenanceData;

					// Check if we have the new selection state format
					if (actualData.selectedOption !== undefined) {
						// Restore from stored selection state (new format)
						newEquipmentChoices[choiceIndex] = {
							// If I remove the option to try '._set', then the following lines of code enter error. saying selectedOption is not in actualData.
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

	// Restore background equipment choices from character store
	function restoreBackgroundEquipmentChoicesFromStore() {
		if (!currentBackground?.startingEquipment?.choices) return;

		// Look for existing background equipment choices in the character store's provenance
		const char = get(character_store);
		if (!char._provenance) return;

		const newBackgroundEquipmentChoices: Record<string, number> = {};

		// Restore each background equipment choice
		currentBackground.startingEquipment.choices.forEach((choice, choiceIndex) => {
			const scopeId = `background_equipment_${choiceIndex}`;
			const provenanceData = char._provenance![scopeId];

			if (provenanceData) {
				// Access data from _set property (character store wraps our data)
				const actualData = provenanceData._set || provenanceData;

				// Background equipment choices are simple arrays, so look for inventory
				if (actualData.inventory) {
					const inventory = actualData.inventory as string[];

					// Find which option matches the current inventory
					for (let optionIndex = 0; optionIndex < choice.options.length; optionIndex++) {
						const option = choice.options[optionIndex];

						// Check if inventory matches this option (simple array comparison)
						if (arraysEqual(inventory, option)) {
							newBackgroundEquipmentChoices[choiceIndex] = optionIndex;
							break;
						}
					}
				}
			}
		});

		// Only update if we found any choices to restore
		if (Object.keys(newBackgroundEquipmentChoices).length > 0) {
			backgroundEquipmentChoices = { ...backgroundEquipmentChoices, ...newBackgroundEquipmentChoices };
		}
	}

	// Helper function to check if two arrays are equal
	function arraysEqual(arr1: string[], arr2: string[]): boolean {
		if (arr1.length !== arr2.length) return false;
		return arr1.every((item, index) => item === arr2[index]);
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
		
		// Extract weapons and add to attacks array
		const weaponNames = extractWeaponsFromInventory(selectedOption);
		const normalizedWeapons = weaponNames.map(normalizeWeaponName);
		
		applyChoice(scopeId, { 
			inventory: selectedOption,
			attacks: normalizedWeapons
		});
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
		const selectionState: {
			selectedOption: unknown,
			subChoiceSelections: unknown,
			inventory: string[]
		} = {
			selectedOption: optionIndex,
			subChoiceSelections: {},
			inventory: []
		};

		applyChoice(scopeId, selectionState);

		// If this option has direct items (no subchoices), apply immediately
		if (selectedOption.items && !selectedOption.subChoices) {
			selectionState.inventory = selectedOption.items;
			
			// Extract weapons and add to attacks array
			const weaponNames = extractWeaponsFromInventory(selectedOption.items);
			const normalizedWeapons = weaponNames.map(normalizeWeaponName);
			
			applyChoice(scopeId, {
				...selectionState,
				attacks: normalizedWeapons
			});
		} else {
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
			
			// Extract weapons and add to attacks array
			const weaponNames = extractWeaponsFromInventory(allItems);
			const normalizedWeapons = weaponNames.map(normalizeWeaponName);
			
			// Store in selection state
			(selectionState as any).attacks = normalizedWeapons;
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
		
		// Extract weapons and add to attacks array
		const weaponNames = extractWeaponsFromInventory(selectedOption);
		const normalizedWeapons = weaponNames.map(normalizeWeaponName);
		
		applyChoice(scopeId, { 
			inventory: selectedOption,
			attacks: normalizedWeapons
		});
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

	// Check if all subchoices for a choice are complete
	function areSubChoicesComplete(choiceIndex: number): boolean {
		if (equipmentChoices[choiceIndex]?.selectedOption === undefined) return false;

		const choice = currentClass?.startingEquipment.choices[choiceIndex] as EquipmentChoice;
		if (!choice || !isEquipmentChoice(choice)) return false;

		const selectedOption = choice.options[equipmentChoices[choiceIndex].selectedOption!];
		if (!selectedOption.subChoices || selectedOption.subChoices.length === 0) return true;

		return selectedOption.subChoices.every(
			(subChoice) =>
				equipmentChoices[choiceIndex].subChoiceSelections?.[subChoice.name]?.length > 0
		);
	}

	// Reactive statement to track subchoice completion states
	let subchoiceCompletionStates: Record<number, boolean> = {};
	$: {
		if (currentClass?.startingEquipment?.choices) {
			const newStates: Record<number, boolean> = {};
			currentClass.startingEquipment.choices.forEach((choice, choiceIndex) => {
				if (subchoiceResolution[choiceIndex]) {
					newStates[choiceIndex] = areSubChoicesComplete(choiceIndex);
				}
			});
			subchoiceCompletionStates = newStates;
		}
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
				{#if !shouldHideClassEquipmentChoice(choice)}
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
								<div 
									class="subchoices-container"
									class:incomplete={!subchoiceCompletionStates[choiceIndex]}
									class:complete={subchoiceCompletionStates[choiceIndex]}
								>
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
				{/if}
			{/each}

			<!-- Equipment from Proficiencies (Class) -->
			{#if classProficiencyEquipment.length > 0}
				<div class="equipment-group">
					<h3>Equipment from Proficiencies</h3>
					<p class="proficiency-note">
						Automatically granted based on your class/subclass proficiency selections.
					</p>

					<div class="equipment-list">
						{#each classProficiencyEquipment as item}
							<div class="equipment-item proficiency-granted">
								<span class="item-name">{item}</span>
								<span class="item-type">From Proficiency</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Species Equipment Section (Conditional) -->
	{#if speciesProficiencyEquipment.length > 0}
		<div class="equipment-section">
			<div class="section-header species-section">
				<h2>{$character_store.race || 'Species'} Equipment</h2>
			</div>

			<div class="equipment-group">
				<h3>Equipment from Proficiencies</h3>
				<p class="proficiency-note">
					Automatically granted based on your species proficiency selections.
				</p>

				<div class="equipment-list">
					{#each speciesProficiencyEquipment as item}
						<div class="equipment-item proficiency-granted">
							<span class="item-name">{item}</span>
							<span class="item-type">From Proficiency</span>
						</div>
					{/each}
				</div>
			</div>
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
					{#if !shouldHideEntireBackgroundChoice(choice)}
						{@const filteredOptions = choice.options.filter((option) => !shouldHideBackgroundOption(option))}
						{#if filteredOptions.length > 0}
						<div class="equipment-group">
							<h3>{choice.name}</h3>
							<p class="choice-description">{choice.description}</p>

							{#if filteredOptions.length > 3}
								<!-- Use dropdown for many options -->
								<div class="dropdown-container">
									<select
										class="equipment-dropdown"
										value={backgroundEquipmentChoices[choiceIndex] ?? ''}
										on:change={(e) => {
											const target = e.target as HTMLSelectElement;
											if (target.value) {
												// Find original index in unfiltered array
												const selectedOption = filteredOptions[parseInt(target.value)];
												const originalIndex = choice.options.indexOf(selectedOption);
												handleBackgroundEquipmentChoice(choiceIndex, originalIndex);
											}
										}}
									>
										<option value="" disabled>Choose an option...</option>
										{#each filteredOptions as option, optionIndex}
											<option value={optionIndex}>
												{option.join(', ')}
											</option>
										{/each}
									</select>
								</div>
							{:else}
								<!-- Use buttons for few options -->
								<div class="choice-options">
									{#each filteredOptions as option, optionIndex}
										{@const originalIndex = choice.options.indexOf(option)}
										<button
											class="choice-option"
											class:selected={backgroundEquipmentChoices[choiceIndex] === originalIndex}
											on:click={() => handleBackgroundEquipmentChoice(choiceIndex, originalIndex)}
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
						{/if}
					{/if}
				{/each}

				<!-- Equipment from Proficiencies (Background) -->
				{#if backgroundProficiencyEquipment.length > 0}
					<div class="equipment-group">
						<h3>Equipment from Proficiencies</h3>
						<p class="proficiency-note">
							Automatically granted based on your background proficiency selections.
						</p>

						<div class="equipment-list">
							{#each backgroundProficiencyEquipment as item}
								<div class="equipment-item proficiency-granted">
									<span class="item-name">{item}</span>
									<span class="item-type">From Proficiency</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
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
		padding: var(--spacing-8) var(--spacing-4);
		padding-top: 80px;
		max-width: 50vw;
		margin: 0 auto;
	}

	.intro-text {
		text-align: center;
		margin-bottom: var(--spacing-8);
	}

	.intro-text h1 {
		font-size: var(--font-size-3xl);
		font-weight: var(--font-weight-bold);
		margin-bottom: var(--spacing-4);
		color: var(--color-text-primary);
	}

	.intro-text p {
		font-size: var(--font-size-md);
		color: var(--color-text-muted);
		max-width: 600px;
		margin: 0 auto;
	}

	.equipment-section {
		background: var(--color-background);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		margin-bottom: var(--spacing-8);
		overflow: hidden;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-4);
		padding: var(--spacing-6);
		background: linear-gradient(135deg, var(--color-neutral-50) 0%, var(--color-neutral-100) 100%);
		border-bottom: 1px solid var(--color-border);
	}

	.class-icon,
	.background-icon {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-md);
		object-fit: cover;
	}

	.section-header h2 {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.equipment-group {
		padding: var(--spacing-6);
		border-bottom: 1px solid var(--color-neutral-100);
	}

	.equipment-group:last-child {
		border-bottom: none;
	}

	.equipment-group h3 {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-2);
	}

	.choice-description,
	.fixed-equipment-note,
	.background-note,
	.proficiency-note {
		color: var(--color-text-muted);
		margin-bottom: var(--spacing-4);
		font-size: var(--font-size-sm);
	}

	.section-header.proficiency-section h2 {
		color: var(--color-accent-purple);
	}

	.equipment-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.equipment-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-3);
		background: var(--color-neutral-50);
		border-radius: var(--radius-md);
		border-left: 4px solid var(--color-neutral-300);
	}

	.equipment-item.class-equipment {
		border-left-color: var(--color-primary-blue);
	}

	.equipment-item.background {
		border-left-color: var(--color-success);
	}

	.equipment-item.proficiency-granted {
		border-left-color: var(--color-accent-purple);
		background: var(--color-purple-50, #f5f3ff);
	}

	.equipment-item-pack {
		padding: var(--spacing-3);
		background: var(--color-neutral-50);
		border-radius: var(--radius-md);
		border-left: 4px solid var(--color-neutral-300);
		margin-bottom: var(--spacing-2);
	}

	.equipment-item-pack.class-equipment {
		border-left-color: var(--color-primary-blue);
	}

	.equipment-item-pack.background {
		border-left-color: var(--color-success);
	}

	.pack-name {
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-base);
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-1);
	}

	.pack-description {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.item-name {
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}

	.item-type {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		background: var(--color-border);
		padding: var(--spacing-1) var(--spacing-2);
		border-radius: var(--radius-sm);
	}

	.enhanced-choice {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.main-options {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	.choice-options {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	.choice-option {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: var(--spacing-4);
		background: var(--color-background);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-base);
		text-align: left;
		width: 100%;
	}

	.choice-option:hover {
		border-color: var(--color-primary-blue);
		box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
	}

	.choice-option.selected {
		border-color: var(--color-primary-blue);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.choice-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--color-neutral-100);
	}

	.choice-option.disabled:hover {
		border-color: var(--color-border);
		box-shadow: none;
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
		width: 100%;
	}

	.option-label {
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-base);
		color: var(--color-text-primary);
	}

	.option-description {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.item-detail {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.requirement-warning {
		font-size: var(--font-size-xs);
		color: var(--color-warning);
		margin-top: var(--spacing-1);
		font-weight: var(--font-weight-medium);
	}

	.subchoices-container {
		background: var(--color-background);
		border-radius: var(--radius-md);
		padding: var(--spacing-6);
		border: 2px solid var(--color-border);
		margin-top: var(--spacing-4);
		box-shadow: var(--shadow-sm);
		animation: slideIn 0.3s ease-out;
		transition: border-color var(--transition-base);
	}

	.subchoices-container.incomplete {
		border-color: var(--color-warning);
	}

	.subchoices-container.complete {
		border-color: var(--color-primary-blue);
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
		margin-bottom: var(--spacing-4);
	}

	.subchoice-group:last-child {
		margin-bottom: 0;
	}

	.subchoice-group h4 {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-1);
	}

	.subchoice-description {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		margin-bottom: var(--spacing-3);
	}

	.subchoice-select {
		width: 100%;
		padding: var(--spacing-3);
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-md);
		background: var(--color-background);
		font-size: var(--font-size-sm);
		cursor: pointer;
	}

	.subchoice-select:focus {
		outline: none;
		border-color: var(--color-primary-blue);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.dropdown-container {
		margin-top: var(--spacing-2);
	}

	.equipment-dropdown {
		width: 100%;
		padding: var(--spacing-3);
		border: 1px solid var(--color-neutral-300);
		border-radius: var(--radius-md);
		background: var(--color-background);
		font-size: var(--font-size-sm);
		cursor: pointer;
	}

	.equipment-dropdown:focus {
		outline: none;
		border-color: var(--color-primary-blue);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.option-items {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2);
	}

	.option-item {
		background: var(--color-neutral-100);
		padding: var(--spacing-1) var(--spacing-2);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.no-selection,
	.no-equipment {
		text-align: center;
		padding: var(--spacing-12) var(--spacing-4);
		background: var(--color-background);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
	}

	.no-selection h2,
	.no-equipment h2 {
		font-size: var(--font-size-xl);
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-4);
	}

	.no-selection p,
	.no-equipment p {
		color: var(--color-text-muted);
		margin-bottom: var(--spacing-6);
	}

	.nav-link {
		display: inline-block;
		padding: var(--spacing-3) var(--spacing-6);
		background: var(--color-primary-blue);
		color: white;
		text-decoration: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-weight-medium);
		transition: background-color var(--transition-base);
	}

	.nav-link:hover {
		background: #2563eb;
	}

	@media (min-width: 768px) {
		.main-options,
		.choice-options {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: var(--spacing-4);
		}
	}
</style>
