<div class="main-content">
	<h2>Class Selection</h2>
	<p>In Dungeons & Dragons, your character's class defines their role in the party, abilities, and how they interact with the world. Each class offers unique strengths, weaknesses, and ways to play.</p>

	<div class="class-cards">
		{#each classes as classInfo}
			<button class="class-card" on:click={() => selectedClass = classInfo}>
				<div class="card-left">
					<img src={classInfo.image} alt={`${classInfo.name} icon`} />
					<span>{classInfo.name}</span>
				</div>
				<img class="card-arrow" src="{base}/basic_icons/blue_next.png" alt="next arrow" />
			</button>
		{/each}
	</div>



	{#if selectedClass}
		<div class="popup">
			<div class="popup-content">
				<div class="popup-header">
					<span>CONFIRM ADD CLASS</span>
					<button class="close-button" on:click={() => selectedClass = null}>×</button>
				</div>

				<div class="popup-body">
					<h2>{selectedClass.name}</h2>
					<p class="description">{selectedClass.description}</p>
					<p><strong>Primary Ability:</strong> {selectedClass.primaryAbility}</p>

					{#each selectedClass.features as feature}
						<div class="feature-card">
							<h4>{feature.title}</h4>
							<p>{feature.description}</p>
						</div>
					{/each}
				</div>

				<div class="popup-footer">
					<button class="cancel-button" on:click={() => selectedClass = null}>Cancel</button>
					<button class="add-button">Add Class</button>
				</div>
			</div>
		</div>
	{/if}

</div>

<script lang="ts">
	import { base } from '$app/paths';

	let selectedClass: ClassInfo | null = null;

	type Feature = {
		title: string;
		description: string;
	};

	type ClassInfo = {
		name: string;
		image: string;
		description: string;
		primaryAbility: string;
		features: Feature[];
	};

	const example_feature: Feature = {
		title: "Example Feature",
		description: "This is a placeholder description for a non-existent feature. Very cool!",
	};

	const classes: ClassInfo[] = [
		{ name: 'Barbarian', image: base + '/class_icons/barbarian.jpg', description: "Frenzied warriors fueled by primal rage.", primaryAbility: "Strength", features: [example_feature] },
		{ name: 'Bard', image: base + '/class_icons/bard.jpg', description: "Musical magic users who inspire allies.", primaryAbility: "Charisma", features: [example_feature] },
		{ name: 'Cleric', image: base + '/class_icons/cleric.jpg', description: "Holy warriors wielding divine magic.", primaryAbility: "Wisdom", features: [example_feature] },
		{ name: 'Druid', image: base + '/class_icons/druid.jpg', description: "Nature-focused shapeshifters and spellcasters.", primaryAbility: "Wisdom", features: [example_feature] },
		{ name: 'Fighter', image: base + '/class_icons/fighter.jpg', description: "Versatile combatants skilled with weapons.", primaryAbility: "Strength or Dexterity", features: [example_feature] },
		{ name: 'Monk', image: base + '/class_icons/monk.jpg', description: "Martial artists channeling inner energy.", primaryAbility: "Dexterity", features: [example_feature] },
		{ name: 'Paladin', image: base + '/class_icons/paladin.jpg', description: "Holy knights bound by sacred oaths.", primaryAbility: "Strength and Charisma", features: [example_feature] },
		{ name: 'Ranger', image: base + '/class_icons/ranger.jpg', description: "Wilderness scouts and magical hunters.", primaryAbility: "Dexterity and Wisdom", features: [example_feature] },
		{ name: 'Rogue', image: base + '/class_icons/rogue.jpg', description: "Sneaky tricksters and agile assassins.", primaryAbility: "Dexterity", features: [example_feature] },
		{ name: 'Sorcerer', image: base + '/class_icons/sorcerer.jpg', description: "Innate spellcasters powered by bloodlines.", primaryAbility: "Charisma", features: [example_feature] },
		{ name: 'Warlock', image: base + '/class_icons/warlock.jpg', description: "Deal-makers granted magic by patrons.", primaryAbility: "Charisma", features: [example_feature] },
		{ name: 'Wizard', image: base + '/class_icons/wizard.jpg', description: "Scholarly spellcasters mastering arcane secrets.", primaryAbility: "Intelligence", features: [example_feature] }
	];
</script>


<style>
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
		justify-content: space-between; /* space between left and right sides */
		gap: 1rem;
		padding: 1rem 2rem;
		font-size: 1.2rem;
		cursor: pointer;
		border: 2px solid #ccc;
		border-radius: 0.5rem;
		background-color: #f8f8f8;
		transition: background-color 0.2s ease;
		text-align: left; /* allow text to align to left */
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

	/* Optional: specific styling for the arrow if needed */
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

	.feature-card {
		border: 1px solid #ccc;
		border-radius: 6px;
		padding: 10px 12px;
		margin: 10px 0;
		background: #f9f9f9;
	}

	.feature-card h4 {
		margin: 0 0 4px 0;
	}

	.popup-footer {
		padding: 12px 16px;
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		border-top: 1px solid #ddd;
		background: #f0f0f0;
	}

</style>
