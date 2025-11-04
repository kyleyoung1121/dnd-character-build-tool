<script lang="ts">
	import type { Beast } from '$lib/data/beasts/types';

	export let beast: Beast;
	export let isSelected: boolean = false;
	export let isDisabled: boolean = false;
	export let onSelect: ((beast: Beast) => void) | undefined = undefined;

	// Calculate ability modifiers
	function getModifier(score: number): string {
		const mod = Math.floor((score - 10) / 2);
		return mod >= 0 ? `+${mod}` : `${mod}`;
	}

	// Convert CR decimal to fraction display
	function crToDisplay(cr: number): string {
		if (cr === 0) return '0';
		if (cr === 0.125) return '1/8';
		if (cr === 0.25) return '1/4';
		if (cr === 0.5) return '1/2';
		return cr.toString(); // For CR 1 and above
	}

	// Format speed for display
	function formatSpeed(): string {
		return Object.entries(beast.speed)
			.map(([type, value]) => {
				const typeLabel = type === 'walk' ? '' : type + ' ';
				return `${typeLabel}${value} ft.`;
			})
			.join(', ');
	}

	function handleSelect() {
		if (onSelect) {
			onSelect(beast);
		}
	}
</script>

<div class="beast-card" class:selected={isSelected}>
	<div class="card-content">
	<!-- Header with CR in top right -->
	<div class="beast-header">
		<div class="header-left">
			<h3 class="beast-name">{beast.name}</h3>
			<div class="beast-meta">
				<span class="beast-size">{beast.size} {beast.type}</span>
			</div>
		</div>
		<div class="header-right">
			<div class="challenge-rating">
				<strong>CR:</strong> {crToDisplay(beast.challenge_rating)}
			</div>
			<div class="speed-info">
				<strong>Speed:</strong> {formatSpeed()}
			</div>
		</div>
	</div>

	<!-- AC and HP stacked -->
	<div class="basic-stats">
		<div class="stat-row">
			<strong>Armor Class:</strong> {beast.armor_class}
		</div>
		<div class="stat-row">
			<strong>Hit Points:</strong> {beast.hit_points.average}
			{#if beast.hit_points.formula}
				<span class="formula">({beast.hit_points.formula})</span>
			{/if}
		</div>
	</div>

	<!-- Ability Scores - compact inline format -->
	<div class="ability-scores">
		<div class="ability">
			<span class="ability-name">STR</span>
			<span class="ability-value">{beast.ability_scores.STR} ({getModifier(beast.ability_scores.STR)})</span>
		</div>
		<div class="ability">
			<span class="ability-name">DEX</span>
			<span class="ability-value">{beast.ability_scores.DEX} ({getModifier(beast.ability_scores.DEX)})</span>
		</div>
		<div class="ability">
			<span class="ability-name">CON</span>
			<span class="ability-value">{beast.ability_scores.CON} ({getModifier(beast.ability_scores.CON)})</span>
		</div>
		<div class="ability">
			<span class="ability-name">INT</span>
			<span class="ability-value">{beast.ability_scores.INT} ({getModifier(beast.ability_scores.INT)})</span>
		</div>
		<div class="ability">
			<span class="ability-name">WIS</span>
			<span class="ability-value">{beast.ability_scores.WIS} ({getModifier(beast.ability_scores.WIS)})</span>
		</div>
		<div class="ability">
			<span class="ability-name">CHA</span>
			<span class="ability-value">{beast.ability_scores.CHA} ({getModifier(beast.ability_scores.CHA)})</span>
		</div>
	</div>

	<!-- Proficiencies -->
	{#if beast.proficiencies.length > 0}
		<div class="proficiencies">
			<h4 class="section-header">Proficiencies</h4>
			{#each beast.proficiencies as prof}
				<div class="proficiency-item">
					<strong>{prof.name}:</strong> {prof.text}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Abilities -->
	{#if beast.abilities.length > 0}
		<div class="abilities-section">
			<h4 class="section-header">Abilities</h4>
			{#each beast.abilities as ability}
				<div class="ability-item">
					<strong>{ability.name}.</strong> {ability.text}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Actions -->
	{#if beast.actions.length > 0}
		<div class="actions-section">
			<h4 class="section-header">Actions</h4>
			{#each beast.actions as action}
				<div class="action-item">
					<strong>{action.name}.</strong> {action.text}
				</div>
			{/each}
		</div>
	{/if}

	</div>

	<!-- Selection Button -->
	{#if onSelect}
		<div class="selection-area">
			<button 
				class="select-button" 
				class:selected={isSelected}
				class:disabled={isDisabled && !isSelected}
				disabled={isDisabled && !isSelected}
				on:click={handleSelect}
			>
				{isSelected ? 'Remove' : 'Select'}
			</button>
		</div>
	{/if}
</div>

<style>
	.beast-card {
		border: 2px solid #8b4513;
		border-radius: 8px;
		padding: 0.875rem;
		background: #faf8f5;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.card-content {
		flex: 1;
	}

	.beast-card.selected {
		border-color: #3b82f6;
		box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
	}

	.beast-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		border-bottom: 2px solid #8b4513;
		padding-bottom: 0.5rem;
		margin-bottom: 0.625rem;
		gap: 1rem;
	}

	.header-left {
		flex: 1;
	}

	.header-right {
		text-align: right;
		font-size: 0.85rem;
		min-width: 150px;
	}

	.beast-name {
		font-size: 1.4rem;
		font-weight: bold;
		color: #5c2e0e;
		margin: 0 0 0.25rem 0;
		line-height: 1.2;
	}

	.beast-meta {
		font-size: 0.85rem;
		color: #666;
		font-style: italic;
	}

	.beast-size {
		text-transform: capitalize;
	}

	.challenge-rating {
		margin-bottom: 0.25rem;
		color: #5c2e0e;
	}

	.speed-info {
		color: #5c2e0e;
	}

	.basic-stats {
		padding: 0.5rem 0;
		border-bottom: 1px solid #d4af37;
		font-size: 0.9rem;
	}

	.stat-row {
		margin: 0.125rem 0;
	}

	.formula {
		color: #666;
		font-size: 0.85rem;
	}

	.ability-scores {
		display: flex;
		justify-content: space-around;
		padding: 0.5rem 0;
		border-bottom: 1px solid #d4af37;
		background: #fff;
		border-radius: 4px;
		margin: 0.5rem 0;
		gap: 0.25rem;
	}

	.ability {
		text-align: center;
		flex: 1;
		font-size: 0.85rem;
	}

	.ability-name {
		font-weight: bold;
		color: #5c2e0e;
		display: block;
		margin-bottom: 0.125rem;
	}

	.ability-value {
		color: #333;
	}

	.proficiencies,
	.abilities-section,
	.actions-section {
		margin: 0.625rem 0;
	}

	.section-header {
		font-size: 0.95rem;
		font-weight: bold;
		color: #d4af37;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin: 0.375rem 0 0.25rem 0;
		border-bottom: 2px solid #d4af37;
		padding-bottom: 0.25rem;
	}

	.proficiency-item,
	.ability-item,
	.action-item {
		margin: 0.375rem 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	strong {
		color: #5c2e0e;
	}

	.selection-area {
		margin-top: auto;
		padding-top: 0.75rem;
		border-top: 1px solid #d4af37;
		text-align: center;
	}

	.select-button {
		padding: 0.5rem 1.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		border: 2px solid #8b4513;
		border-radius: 6px;
		background: #fff;
		color: #5c2e0e;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.select-button:hover {
		background: #f0e6d2;
		border-color: #5c2e0e;
	}

	.select-button.selected {
		background: #10b981;
		color: white;
		border-color: #10b981;
	}

	.select-button.selected:hover {
		background: #059669;
		border-color: #059669;
	}

	.select-button.disabled,
	.select-button:disabled {
		background: #e5e7eb;
		color: #9ca3af;
		border-color: #d1d5db;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.select-button.disabled:hover,
	.select-button:disabled:hover {
		background: #e5e7eb;
		border-color: #d1d5db;
	}
</style>
