<script lang="ts">
	import { character_store } from '$lib/stores/character_store';
    import type { Character } from '$lib/stores/character_store';
	import type {
		FeatureDescription,
		DescriptionBlock,
		ComputedValue,
        Ability
	} from '$lib/data/types/Features';
	import { derived } from 'svelte/store';

	export let description: FeatureDescription;

    type AbilityKey =
        | 'strength'
        | 'dexterity'
        | 'constitution'
        | 'intelligence'
        | 'wisdom'
        | 'charisma';
    
    const ABILITY_KEY_MAP: Record<Ability, AbilityKey> = {
        STR: 'strength',
        DEX: 'dexterity',
        CON: 'constitution',
        INT: 'intelligence',
        WIS: 'wisdom',
        CHA: 'charisma'
    };


	// --- Character snapshot ---
	let character: Character | null = null;
	const unsubscribe = character_store.subscribe((c) => {
		console.log('[complex_desc] Character updated in FeatureDescription:', c.charisma);
        character = c;
	});

    

	// --- Helpers ---

	function abilityMod(score: number | null): number | null {
		if (score === null || score === 0) return null;
		return Math.floor((score - 10) / 2);
	}

	function resolveComputedValue(value: ComputedValue): number | null {
        console.log('[complex_desc] Resolving:', value);

        if (!character) {
            console.log('[complex_desc] No character');
            return null;
        }

		switch (value.source) {

            case 'abilityScore': {
                const key = ABILITY_KEY_MAP[value.ability];
                return character[key];
            }

            case 'abilityMod': {
                const key = ABILITY_KEY_MAP[value.ability];
                return abilityMod(character[key]);
            }

			case 'derived': {
                let result = evaluateFormula(value.formula);
				console.log('[complex_desc] Derived result:', result);
                return result
			}

			default:
				return null;
		}
	}

	function evaluateFormula(formula: string): number | null {
        if (!character) return null;

        // --- Ability scores ---
        const STR = character.strength;
        const DEX = character.dexterity;
        const CON = character.constitution;
        const INT = character.intelligence;
        const WIS = character.wisdom;
        const CHA = character.charisma;

        // If any referenced score is missing, bail
        if (formula.includes('STR') && STR === null) return null;
        if (formula.includes('DEX') && DEX === null) return null;
        if (formula.includes('CON') && CON === null) return null;
        if (formula.includes('INT') && INT === null) return null;
        if (formula.includes('WIS') && WIS === null) return null;
        if (formula.includes('CHA') && CHA === null) return null;

        // --- Ability modifiers ---
        const STR_MOD = abilityMod(STR);
        const DEX_MOD = abilityMod(DEX);
        const CON_MOD = abilityMod(CON);
        const INT_MOD = abilityMod(INT);
        const WIS_MOD = abilityMod(WIS);
        const CHA_MOD = abilityMod(CHA);

        if (formula.includes('STR_MOD') && STR_MOD === null) return null;
        if (formula.includes('DEX_MOD') && DEX_MOD === null) return null;
        if (formula.includes('CON_MOD') && CON_MOD === null) return null;
        if (formula.includes('INT_MOD') && INT_MOD === null) return null;
        if (formula.includes('WIS_MOD') && WIS_MOD === null) return null;
        if (formula.includes('CHA_MOD') && CHA_MOD === null) return null;

        // Known Constants
        const PROF = 2;
        const LEVEL = 3;

        try {
            // Controlled evaluation: formulas come from your data files only
            return Function(
                'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA',
                'STR_MOD', 'DEX_MOD', 'CON_MOD', 'INT_MOD', 'WIS_MOD', 'CHA_MOD',
                'PROF',
                'LEVEL',
                `return ${formula};`
            )(
                STR, DEX, CON, INT, WIS, CHA,
                STR_MOD, DEX_MOD, CON_MOD, INT_MOD, WIS_MOD, CHA_MOD,
                PROF,
                LEVEL
            );
        } catch (e) {
            console.error('[complex_desc] Formula eval failed:', formula, e);
            return null;
        }
    }

	function allValuesAvailable(values: ComputedValue[]): number | null {
        const resolved = values.map(resolveComputedValue);

        if (
            resolved.some(
                (v) => v === null || Number.isNaN(v)
            )
        ) {
            return null;
        }

        return resolved[0];
    }

</script>

{#each description.blocks as block}
	{#if block.type === 'text'}
		<p>{block.text}</p>

	{:else if block.type === 'computed-inline'}
        {@const value = resolveComputedValue(block.computed)}
        <p>
            {block.text}
            <span class="computed-hint">
                {value !== null
                    ? block.hintFormat.replace('{value}', String(value))
                    : block.hintFormat.replace('{value}', '?')}
            </span>
        </p>


	{:else if block.type === 'computed-replacement'}
		{@const value = allValuesAvailable(block.whenAvailable)}
		{console.log('[complex_desc] Computed replacement value:', value)}
        <p>
			{value !== null
				? block.replacementTemplate.replace('{value}', String(value))
				: block.fallbackText}
		</p>
	{/if}
{/each}
