<script lang="ts">
	import type { Beast } from '$lib/data/beasts/types';
	import { beasts } from '$lib/data/beasts/index';
    import BeastCardExport from '$lib/components/BeastCardExport.svelte';
    
    import { get } from 'svelte/store';
    import { character_store, hasBeastAccess, getBeastTabName } from '$lib/stores/character_store';
	import Page from '../../routes/+page.svelte';


    const state = get(character_store);

    const selectedBeasts = state.beasts;

    const filteredBeasts = beasts.filter((beast) => {
        if (selectedBeasts?.some((selectedBeast) => {
            return selectedBeast.name == beast.name;
        })) {
            return true;
        } else {
            return false;
        }
    });

    const isBeastMaster = state.subclass?.toLowerCase().includes('beast');

</script>

<div class="beasts-list">
    <div class="beasts-grid">
        {#each filteredBeasts as beast (beast.name)}
            <BeastCardExport 
                {beast}
                {isBeastMaster}
            />
        {/each}
    </div>
</div>

<style>
	.beasts-list {
		margin-top: var(--spacing-6);
	}

	.beasts-grid {
        display: flex;
		flex-direction: column;
        flex-wrap: wrap;
        width: 2212px;
        height: 2856px;
	}
</style>
