<script lang="ts">
    import SpellCard from '$lib/components/SpellCard.svelte';
    import { get } from 'svelte/store';
    import { character_store } from '$lib/stores/character_store';

    const state = get(character_store);
</script>

<div class="spells-container" id="spells-container">
    <div class="spells-grid">
        {#each state.spells as spellName}
            <SpellCard 
                spellNameProp={spellName}
            />
        {/each}
    </div>
</div>

<style>
	.spells-container {
		margin-top: var(--spacing-6);
        width: 1106px;
        height: 1360px;
	}

	.spells-grid {
        display: flex;
		flex-direction: column;
        flex-wrap: wrap;
        width: 1106px;
        height: 1360px;
        column-gap: 1106px;
	}
</style>
