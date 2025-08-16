<script lang="ts">
	import { character_store } from '$lib/stores/character_store';
	import type { Character } from '$lib/stores/character_store';

	let character: Character;

	// Subscribe to store
	const unsubscribe = character_store.subscribe(value => {
		character = value;
	});

	// Cleanup subscription on destroy
	import { onDestroy } from 'svelte';
	onDestroy(unsubscribe);
</script>

<div class="main-content">
	<h1>Race Page (Debug View)</h1>
	<p>This is just a test to see what's in <code>character_store</code>.</p>

	<pre>{JSON.stringify(character, null, 2)}</pre>
</div>
