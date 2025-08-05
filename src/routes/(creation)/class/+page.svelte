<div class="main-content">
	<h2>Class Selection</h2>
	<p>In Dungeons & Dragons, your character's class defines their role in the party, abilities, and how they interact with the world. Each class offers unique strengths, weaknesses, and ways to play.</p>

	<div class="class-cards">
		<button class="class-card" on:click={() => selectedClass = 'Fighter'}>Fighter</button>
		<button class="class-card" on:click={() => selectedClass = 'Wizard'}>Wizard</button>
		<button class="class-card" on:click={() => selectedClass = 'Rogue'}>Rogue</button>
		<!-- Add more classes as needed -->
	</div>

	{#if selectedClass}
		<div class="popup">
			<div class="popup-content">
				<h3>{selectedClass}</h3>
				<p>Preview of {selectedClass} abilities and flavor text.</p>
				<button on:click={() => selectedClass = null}>Close</button>
			</div>
		</div>
	{/if}
</div>

<script lang="ts">
	let selectedClass: string | null = null;
</script>

<style>
	.main-content {
		padding: 1.5rem;
	}

	.class-cards {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-top: 2rem;
	}

	.class-card {
		padding: 1rem 2rem;
		font-size: 1.2rem;
		cursor: pointer;
		border: 2px solid #ccc;
		border-radius: 0.5rem;
		background-color: #f8f8f8;
		transition: background-color 0.2s ease;
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
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.popup-content {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		max-width: 400px;
		text-align: center;
	}
</style>
