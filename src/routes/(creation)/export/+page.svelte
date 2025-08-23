<script lang="ts">
	import { character_store } from '$lib/stores/character_store';
	import type { Character } from '$lib/stores/character_store';
	import { detectConflicts } from '$lib/stores/conflict_detection';
	import { testBardHighElfConflict } from '$lib/stores/conflict_test';
	import { debugProvenance } from '$lib/debug/provenance_debug';

	let character: Character;

	// Subscribe to store
	const unsubscribe = character_store.subscribe(value => {
		character = value;
	});

	// Cleanup subscription on destroy
	import { onDestroy } from 'svelte';
	onDestroy(unsubscribe);
	
	function runDebug() {
		console.log('=== MANUAL DEBUG START ===');
		
		// Use the detailed provenance debug utility
		const analysis = debugProvenance();
		
		// Also run conflict detection
		const conflicts = detectConflicts();
		console.log('\n=== CONFLICT DETECTION ===');
		console.log('Conflicts:', conflicts);
		
		return analysis;
	}
</script>

<div class="main-content">
	<h1>Race Page (Debug View)</h1>
	<p>This is just a test to see what's in <code>character_store</code>.</p>
	
	<button on:click={runDebug} style="background: blue; color: white; padding: 10px; margin: 10px;">🔍 Debug Conflicts</button>
	<button on:click={() => testBardHighElfConflict()} style="background: green; color: white; padding: 10px; margin: 10px;">🧪 Test Bard+Elf Conflict</button>

	<pre>{JSON.stringify(character, null, 2)}</pre>
</div>
