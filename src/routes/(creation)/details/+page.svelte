<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { applyChoice, revertChanges } from '$lib/stores/character_store_helpers';
	import { get } from 'svelte/store';
	import { character_store } from '$lib/stores/character_store';

	function changeCharacterName(event: Event) {
		const target = event.target as HTMLSelectElement;
		applyChoice('characterName:' + target.value,
			{
				characterName: target.value
			}
		);
	}

	function changePlayerName(event: Event) {
		const target = event.target as HTMLSelectElement;
 		console.log(target.value);
		applyChoice('playerName:' + target.value,
			{
				playerName: target.value
			}
		);
	}

	function changeLibrary(event: Event) {
		const target = event.target as HTMLSelectElement;
 		console.log(target.value);
		applyChoice('library:' + target.value,
			{
				library: target.value
			}
		);
	}
</script>

<div class="container">
	<div class="details-card">
		<p class="intro-text">
			Welcome to the D&D Character Building Tool!
		</p>
		<br><br>
		
		<p>Character Name:</p> 
		<input 
			placeholder="Enter your character's name" 
			class="characterNameInput input-style" 
			type="text"
			on:change='{(e) => changeCharacterName(e)}'
		>
		<br><br>

		<p>Player Name:</p> 
		<input 
			placeholder="Enter your name (First L.)" 
			class="playerNameInput input-style" 
			type="text"
			on:change='{(e) => changePlayerName(e)}'
		>
		<br><br>

		<p>Library:</p> 
		<select 
			class="libraryInput input-style" 
			on:change={(e) => changeLibrary(e)}
		>
			<option>Anderson</option>
			<option>Reading</option>
			<option>Avondale</option>
			<option>Monfort Heights</option>
		</select>
	</div>
</div>

<style>
	

	.intro-text {
		max-width: 50vw;
		margin: 0 auto;
		text-align: center;
		font-size: var(--font-size-md);
		color: var(--color-text-secondary);
	}

	.details-card {
		width: 100%;
		max-width: 800px;
		background: var(--color-background);
		border-radius: var(--radius-lg);
		padding: var(--spacing-8);
		text-align: center;
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--color-border);
	}

    .container {
		padding-top: 80px;
		padding-bottom: 400px;
		max-width: 900px;
		margin: 0 auto;
	}
	
	/* From Uiverse.io by JayRamoliya */ 
	.input-style {
		padding: 10px;
		border: 2px solid #ccc;
		border-radius: 5px;
		font-size: 16px;
		color: #555;
		outline: none;
		width: 60%;
		align-content: center;
		text-align: center;
	}

	.input-style:focus {
		border-color: #007bff;
		box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
	}

	.librarySelect {
		padding: 10px;
		border: 2px solid #ccc;
		border-radius: 5px;
		font-size: 16px;
		color: #555;
		outline: none;
		width: 60%;
		align-content: center;
		text-align: center;
	}

	.save {
		display: inline-block;
		padding: var(--spacing-3) var(--spacing-6);
		background: var(--color-primary-blue);
		color: white;
		text-decoration: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-weight-medium);
		transition: background-color var(--transition-base);
	}

	.save:hover {
		background: #2563eb;
	}

	h1 {
		margin-bottom: var(--spacing-8);
		font-size: var(--font-size-3xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-text-primary);
		font-family: var(--font-family-base);
	}

</style>
