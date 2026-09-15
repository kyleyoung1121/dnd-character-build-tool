<script lang="ts">
    import {
		spells,
		type Spell,
		type SpellTag
	} from '$lib/data/spells';

    const props = $props();
    const spellName: String = props.spellNameProp;
    const spell: Spell | undefined = spells.find((spell) => spell.name == spellName)

    let spellLevel: string;
    switch (spell?.level) {
        case 0: 
            spellLevel = "(Cantrip)";
            break;
        case 1: 
            spellLevel = "(1st Level)";
            break;
        case 2: 
            spellLevel = "(2nd Level)";
            break;
        default:
            spellLevel = "";
            break;
    }

    // Get tag icon path
	function getTagIconPath(tag: SpellTag): string {
		return `/spell_tag_icons/${tag}.png`;
	}
</script>

<div class="spell-card-wrapper">
    <div class="spell-card" id="spell-card">
        <div class="card-content">
            <!-- Header with room for icons in top right -->
            <div class="spell-header">
                <div class="header-left">
                    <p class="spell-name">{spellName}</p>
                    <span class="spell-level">{spellLevel}</span>
                </div>
                
                <div class="spell-icon-wrapper">
                    {#each spell?.tags as spellTag}
                        {#if spellTag}
                            <img src={getTagIconPath(spellTag)} alt="Spell Icon" class="spell-icon"/>
                        {/if}
                    {/each}
                </div>
            </div>

            <!-- AC and HP stacked -->
            <div class="basic-stats">
                <div class="stat-row">
                    {spell?.castingTime} | {spell?.range} | {spell?.duration}
                </div>
            </div>

            <p class="description">{spell?.description}</p>
        </div>
    </div>
</div>

<style>
	.spell-card-wrapper {
        width: 50%;
    }

    .spell-card {
		border: 2px solid var(--color-neutral-500);
		border-radius: var(--radius-lg);
		padding: 0.8rem;
        margin: 0.8rem;
	}

	.card-content {
		flex: 1;
	}

	.spell-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(0, 0, 0, 0.5);
		padding-bottom: 0.75rem;
		margin-bottom: 0.1rem;
		gap: 2rem;
	}

    .header-left {
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    .spell-icon-wrapper {
        display: flex;
    }

	.spell-icon {
        margin: -1.5rem -0.5rem -1.5rem -0.5rem;
        width: 55px;
        height: 55px;
        min-width: 55px;
        min-height: 55px;
    }

	.spell-name {
		font-size: 1.4rem;
		font-weight: bold;
		color: var(--color-neutral-800);
		line-height: 1;
	}

	.spell-level {
		text-transform: capitalize;
		font-size: 1.2rem;
		color: #666;
		font-style: italic;
	}

	.basic-stats {
		border-bottom: 1px solid rgba(0, 0, 0, 0.5);
        padding-bottom: 0.75rem;
		font-size: 1.2rem;
	}

	.stat-row {
		margin: 0rem 0rem 0.25rem 0rem;
	}

    .description {
		margin: 0.25rem 0rem;
        font-size: 1.2rem;
    }

	strong {
		color: var(--color-neutral-800);
	}
</style>
