<script lang="ts">

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
	
	import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
	import type { BackgroundData } from '$lib/data/types/BackgroundData';

	// Create class lookup
	const classLookup: Record<string, ClassData> = {
		'Fighter': fighter,
		'Barbarian': barbarian,
		'Bard': bard,
		'Cleric': cleric,
		'Druid': druid,
		'Monk': monk,
		'Paladin': paladin,
		'Ranger': ranger,
		'Rogue': rogue,
		'Sorcerer': sorcerer,
		'Warlock': warlock,
		'Wizard': wizard
	};

	let currentClass: ClassData | null = null;
	let currentBackground: BackgroundData | null = null;
	let equipmentChoices: Record<string, number> = {};
	let backgroundEquipmentChoices: Record<string, number> = {};

	// Reactive statements to get current selections
	$: {
		const className = $character_store.class;
		currentClass = className ? classLookup[className] : null;
	}

	$: {
		const backgroundName = $character_store.background;
		currentBackground = backgroundName ? backgrounds.find(bg => bg.name === backgroundName) || null : null;
	}

	function handleEquipmentChoice(choiceIndex: number, optionIndex: number) {
		if (!currentClass) return;
		
		equipmentChoices[choiceIndex] = optionIndex;
		
		// Apply the equipment choice to character store
		const choice = currentClass.startingEquipment.choices[choiceIndex];
		const selectedOption = choice.options[optionIndex];
		
		const scopeId = `class_equipment_${choiceIndex}`;
		applyChoice(scopeId, { inventory: selectedOption });
	}

	function handleBackgroundEquipmentChoice(choiceIndex: number, optionIndex: number) {
		if (!currentBackground?.startingEquipment) return;
		
		backgroundEquipmentChoices[choiceIndex] = optionIndex;
		
		// Apply the background equipment choice to character store
		const choice = currentBackground.startingEquipment.choices[choiceIndex];
		const selectedOption = choice.options[optionIndex];
		
		const scopeId = `background_equipment_${choiceIndex}`;
		applyChoice(scopeId, { inventory: selectedOption });
	}

	// Note: Fixed class equipment should be added when class is selected, not here
	// This page only handles equipment choices that require user input
</script>

<div class="main-content">
	<div class="intro-text">
		<h1>Equipment</h1>
		<p>Select your starting equipment based on your class and background. Equipment choices will automatically update your character sheet.</p>
	</div>

	{#if !$character_store.class}
		<div class="no-selection">
			<h2>No Class Selected</h2>
			<p>Please select a class first to see starting equipment options.</p>
			<a href="{base}/class" class="nav-link">Go to Class Selection</a>
		</div>
	{:else if !currentClass?.startingEquipment}
		<div class="no-equipment">
			<h2>Equipment Not Available</h2>
			<p>Starting equipment data is not yet available for {$character_store.class}. This will be added soon!</p>
		</div>
	{:else}
		<!-- Class Equipment Section -->
		<div class="equipment-section">
			<div class="section-header">
				<img src="{currentClass.image}" alt="{currentClass.name}" class="class-icon">
				<h2>{currentClass.name} Starting Equipment</h2>
			</div>

			<!-- Fixed Equipment -->
			{#if currentClass.startingEquipment.fixed.length > 0}
				<div class="equipment-group">
					<h3>Standard Equipment</h3>
					<p class="fixed-equipment-note">This equipment is automatically added when you select your class.</p>
					<div class="equipment-list">
						{#each currentClass.startingEquipment.fixed as item}
							<div class="equipment-item class-equipment">
								<span class="item-name">{item}</span>
								<span class="item-type">Auto-added</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Equipment Choices -->
			{#each currentClass.startingEquipment.choices as choice, choiceIndex}
				<div class="equipment-group">
					<h3>{choice.name}</h3>
					<p class="choice-description">{choice.description}</p>
					
					{#if choice.options.length > 3}
						<!-- Use dropdown for many options -->
						<div class="dropdown-container">
							<select 
								class="equipment-dropdown"
								value={equipmentChoices[choiceIndex] ?? ''}
								on:change={(e) => handleEquipmentChoice(choiceIndex, parseInt(e.target.value))}
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
									class:selected={equipmentChoices[choiceIndex] === optionIndex}
									on:click={() => handleEquipmentChoice(choiceIndex, optionIndex)}
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
		</div>
	{/if}

	<!-- Background Equipment Section -->
	{#if currentBackground}
		<div class="equipment-section">
			<div class="section-header">
				<img src="{currentBackground.image}" alt="{currentBackground.name}" class="background-icon">
				<h2>{currentBackground.name} Equipment</h2>
			</div>

			<!-- Check if using new startingEquipment format -->
			{#if currentBackground.startingEquipment}
				<!-- Fixed Background Equipment -->
				{#if currentBackground.startingEquipment.fixed.length > 0}
					<div class="equipment-group">
						<h3>Fixed Equipment</h3>
						<p class="background-note">This equipment is automatically added when you select your background.</p>
						<div class="equipment-list">
							{#each currentBackground.startingEquipment.fixed as item}
								<div class="equipment-item background">
									<span class="item-name">{item}</span>
									<span class="item-type">Auto-added</span>
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
									on:change={(e) => handleBackgroundEquipmentChoice(choiceIndex, parseInt(e.target.value))}
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
					<p class="background-note">This equipment is automatically added when you select your background.</p>
					<div class="equipment-list">
						{#each currentBackground.equipment as item}
							<div class="equipment-item background">
								<span class="item-name">{item}</span>
								<span class="item-type">From Background</span>
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
		max-width: 1200px;
		margin: 0 auto;
	}

	.intro-text {
		text-align: center;
		margin-bottom: 2rem;
	}

	.intro-text h1 {
		font-size: 2.5rem;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.intro-text p {
		font-size: 1.1rem;
		color: #666;
		max-width: 600px;
		margin: 0 auto;
	}

	.no-selection, .no-equipment {
		text-align: center;
		padding: 2rem;
		background-color: #f8f9fa;
		border-radius: 8px;
		margin: 2rem 0;
	}

	.no-selection h2, .no-equipment h2 {
		color: #6c757d;
		margin-bottom: 1rem;
	}

	.nav-link {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background-color: #007bff;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		margin-top: 1rem;
		transition: background-color 0.2s;
	}

	.nav-link:hover {
		background-color: #0056b3;
	}

	.equipment-section {
		background-color: #fff;
		border: 2px solid #ddd;
		border-radius: 8px;
		padding: 1.5rem;
		margin: 2rem 0;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid #eee;
	}

	.class-icon, .background-icon {
		width: 48px;
		height: 48px;
		object-fit: cover;
		border-radius: 4px;
	}

	.section-header h2 {
		color: #333;
		margin: 0;
		font-size: 1.8rem;
	}

	.equipment-group {
		margin-bottom: 2rem;
	}

	.equipment-group h3 {
		color: #555;
		margin-bottom: 0.5rem;
		font-size: 1.3rem;
	}

	.choice-description {
		color: #666;
		font-style: italic;
		margin-bottom: 1rem;
	}

	.background-note, .fixed-equipment-note {
		color: #666;
		font-size: 0.9rem;
		margin-bottom: 1rem;
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
		padding: 0.75rem 1rem;
		background-color: #f8f9fa;
		border-radius: 4px;
		border-left: 4px solid #28a745;
	}

	.equipment-item.background {
		border-left-color: #6f42c1;
	}

	.equipment-item.class-equipment {
		border-left-color: #28a745;
		position: relative;
	}

	.item-name {
		font-weight: 500;
		color: #333;
	}

	.item-type {
		font-size: 0.85rem;
		color: #666;
		background-color: #e9ecef;
		padding: 0.25rem 0.5rem;
		border-radius: 12px;
	}

	.choice-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.choice-option {
		display: block;
		width: 100%;
		padding: 1rem;
		border: 2px solid #ddd;
		border-radius: 8px;
		background-color: #fff;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.choice-option:hover {
		border-color: #007bff;
		background-color: #f8f9ff;
	}

	.choice-option.selected {
		border-color: #007bff;
		background-color: #e3f2fd;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
	}

	.option-items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.option-item {
		background-color: #e9ecef;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.9rem;
		color: #495057;
	}

	.choice-option.selected .option-item {
		background-color: #bbdefb;
		color: #1565c0;
	}

	/* Dropdown Styles */
	.dropdown-container {
		margin-top: 1rem;
	}

	.equipment-dropdown {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #ddd;
		border-radius: 8px;
		background-color: #fff;
		font-size: 1rem;
		color: #333;
		cursor: pointer;
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.equipment-dropdown:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
	}

	.equipment-dropdown:hover {
		border-color: #aaa;
	}

	.equipment-dropdown option {
		padding: 0.5rem;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.main-content {
			padding: 1rem 0.5rem;
			padding-top: 80px;
		}

		.section-header {
			flex-direction: column;
			text-align: center;
			gap: 0.5rem;
		}

		.choice-options {
			gap: 0.5rem;
		}

		.choice-option {
			padding: 0.75rem;
		}
	}
</style>