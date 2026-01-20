<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initializeProficiencyEquipmentSync } from '$lib/stores/proficiency_equipment_sync';

	// Initialize proficiency-to-equipment auto-sync
	onMount(() => {
		initializeProficiencyEquipmentSync();
	});
</script>

<svelte:head>
	<title>Ethics and Dragons Character Builder</title>
</svelte:head>

<slot />
