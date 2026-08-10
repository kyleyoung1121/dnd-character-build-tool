<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { applyChoice, revertChanges, applyListAddition } from '$lib/stores/character_store_helpers';
	import { get } from 'svelte/store';
	import { character_store } from '$lib/stores/character_store';

	let playerName = '';
	let characterName = '';
	let library = '';

	function changeCharacterName(event: Event) {
		const target = event.target as HTMLSelectElement;
		applyChoice('characterName:' + target.value,
			{
				characterName: target.value
			}
		);
		characterName = target.value;
		checkTabCompletion();
	}

	function changePlayerName(event: Event) {
		const target = event.target as HTMLSelectElement;
		applyChoice('playerName:' + target.value,
			{
				playerName: target.value
			}
		);
		playerName = target.value;
		checkTabCompletion();
	}

	function changeLibrary(event: Event) {
		const target = event.target as HTMLSelectElement;
		applyChoice('library:' + target.value,
			{
				library: target.value
			}
		);
		library = target.value;
		checkTabCompletion();
	}

	function applyTabCompletion() {
		applyListAddition('tab_check:details', 'completedCreationTabs', 'details');
	}

	export function clearTabCompletion() {
		revertChanges(get(character_store), 'tab_check:details');
	}

	function checkTabCompletion() {
		if (playerName && characterName && library) {
			applyTabCompletion();
		} else {
			clearTabCompletion();
		}
	}

	onMount(async () => {
		const state = get(character_store);

		if (state.playerName) {
			playerName = state.playerName
		}

		if (state.characterName) {
			characterName = state.characterName
		}

		if (state.library) {
			library = state.library
		}

		checkTabCompletion();
		
	})

</script>

<div class="container">
	<div class="details-card">
		<p class="intro-text">
			Welcome to the D&D Character Building Tool!
		</p>
		<br>
		
		<p class="bold-header">Character Name:</p> 
		<input
			placeholder="Enter your character's name" 
			class="characterNameInput input-style" 
			type="text"
			value={characterName ?? ''}
			on:change='{(e) => changeCharacterName(e)}'
		>
		<br><br>

		<p class="bold-header">Player Name:</p> 
		<input 
			placeholder="Enter your name (First L.)" 
			class="playerNameInput input-style" 
			type="text"
			value={playerName ?? ''}
			on:change='{(e) => changePlayerName(e)}'
		>
		<br><br>

		<p class="bold-header">Library:</p> 
		<select 
			class="libraryInput input-style" 
			value={library ?? 'Select Your Library'}
			on:change={(e) => changeLibrary(e)}
		>
			<option class="dropdown-content">Anderson</option>
			<option>Clifton</option>
			<option>Deer Park</option>
			<option>Groesbeck</option>
			<option>Monfort Heights</option>
			<option>Reading</option>
			<option>West End</option>
			<option>Westwood</option>
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
		background: var(--color-background);
		border: 2px solid var(--color-neutral-500);
		border-radius: var(--radius-lg);
		padding: var(--spacing-8);
		text-align: center;
		box-shadow: var(--shadow-lg);
		align-content: center;
	}

    .container {
		padding-top: 80px;
		padding-bottom: 400px;
		max-width: 900px;
		margin: 0 auto;
		align-content: center;
	}
	
	/* From Uiverse.io by JayRamoliya */ 
	.input-style {
		padding: 10px;
		border: 2px solid var(--color-neutral-500);
		border-radius: var(--radius-lg);
		font-size: 16px;
		color: #555;
		outline: none;
		width: 70%;
		align-content: center;
		text-align: center;
	}

	.input-style:focus {
		border-color: var(--color-primary-purple);
		box-shadow: 0 0 0 0.2rem var(--color-primary-purple-light);
	}

	.bold-header {
		margin: 0;
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-lg);
	}

</style>
