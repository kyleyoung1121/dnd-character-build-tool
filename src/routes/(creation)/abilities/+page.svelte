<script lang="ts">
	import { character_store } from '$lib/stores/character_store';
	import { get } from 'svelte/store';

	const standardArray = [15, 14, 13, 12, 10, 8];
	const stats = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

	let selectedScores: Record<string, number | null> = {
		strength: null,
		dexterity: null,
		constitution: null,
		intelligence: null,
		wisdom: null,
		charisma: null
	};

	// Aggregate bonuses from _provenance
	let bonuses: Record<string, number> = {
		strength: 0,
		dexterity: 0,
		constitution: 0,
		intelligence: 0,
		wisdom: 0,
		charisma: 0
	};

    $: {
        const state = get(character_store) as any; // <-- treat as 'any' for TS
        const provenance = state._provenance ?? {};

        // Reset bonuses
        bonuses = {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
        };

        // Sum all _mods
        for (const key in provenance) {
            const mods = provenance[key]?._mods;
            if (mods) {
                for (const stat of stats) {
                    if (mods[stat] != null) {
                        bonuses[stat] += mods[stat];
                    }
                }
            }
        }
    }


	// Used scores for dropdown filtering
	$: usedScores = Object.values(selectedScores).filter((s) => s !== null);

	function getModifier(total: number): string {
		const mod = Math.floor((total - 10) / 2);
		return mod >= 0 ? `+${mod}` : `${mod}`;
	}
</script>


<div class="container">
	<div class="card ability-card mt-4">
		<!-- Table Header -->
		<div class="grid grid-cols-5 gap-4 font-bold border-b pb-2 text-gray-700">
			<div>Ability</div>
			<div>Score</div>
			<div>Bonus</div>
			<div>Total</div>
			<div>Modifier</div>
		</div>

		<!-- Table Rows -->
		{#each stats as stat}
			<div class="grid grid-cols-5 gap-4 items-center py-3 border-b hover:bg-gray-50 transition-colors">
				<div class="capitalize font-medium text-gray-800">{stat}</div>

				<!-- Dropdown -->
				<select
					bind:value={selectedScores[stat]}
					class="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200"
				>
					<option value={null}>--</option>
					{#each standardArray as num}
						{#if !usedScores.includes(num) || selectedScores[stat] === num}
							<option value={num}>{num}</option>
						{/if}
					{/each}
				</select>

				<!-- Bonus -->
				<div class="text-center text-gray-700 font-semibold">{bonuses[stat] ?? 0}</div>

				<!-- Total -->
				<div class="text-center text-gray-800 font-semibold">
					{selectedScores[stat] !== null ? selectedScores[stat] + (bonuses[stat] ?? 0) : ""}
				</div>

				<!-- Modifier -->
				<div class="text-center font-mono text-indigo-600 font-bold">
					{selectedScores[stat] !== null ? getModifier(selectedScores[stat] + (bonuses[stat] ?? 0)) : ""}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	/* Container adjustments for nav bar */
	.container {
		padding-top: 80px; /* space for nav */
		max-width: 900px;
		margin: 0 auto;
	}

	/* Card style */
	.card.ability-card {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
	}

	/* Table row hover */
	.grid > div {
		transition: background 0.2s ease;
	}

	select {
		background: #f9fafb;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		padding: 0.4rem 0.6rem;
		font-weight: 500;
		text-align: center;
	}
</style>
