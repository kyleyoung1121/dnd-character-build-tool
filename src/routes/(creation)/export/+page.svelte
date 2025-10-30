<script lang="ts">
	import { character_store } from '$lib/stores/character_store';
	import type { Character } from '$lib/stores/character_store';
	import { detectConflicts } from '$lib/stores/conflict_detection';

	import { debugProvenance } from '$lib/debug/provenance_debug';
	import { spells, spellAccess, getSpellAccessForCharacter } from '$lib/data/spells';

	let character: Character;

	// Subscribe to store
	const unsubscribe = character_store.subscribe((value) => {
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

	function analyzeDataIntegrity() {
		console.log('=== DATA INTEGRITY ANALYSIS ===');

		// Spell database analysis
		const totalSpells = spells.length;
		const spellsByLevel = spells.reduce(
			(acc, spell) => {
				acc[spell.level] = (acc[spell.level] || 0) + 1;
				return acc;
			},
			{} as Record<number, number>
		);

		// Check for specific Drow spells (level 3 character only gets Dancing Lights and Faerie Fire)
		const drowSpells = ['Dancing Lights', 'Faerie Fire'];
		const drowSpellsFound = drowSpells.map((spellName) => {
			const found = spells.find((s) => s.name === spellName);
			return {
				name: spellName,
				found: !!found,
				level: found?.level ?? 'N/A',
				classes: found?.classes ?? []
			};
		});

		// Spell access configuration analysis
		const totalSpellAccess = spellAccess.length;
		const accessBySource = spellAccess.reduce(
			(acc, access) => {
				acc[access.source] = (acc[access.source] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		// Character spell access analysis
		let characterSpellAccess = [];
		if (character.race || character.subrace) {
			characterSpellAccess = getSpellAccessForCharacter(character);
		}

		const integrity = {
			spellDatabase: {
				totalSpells,
				spellsByLevel,
				drowSpellsAnalysis: drowSpellsFound
			},
			spellAccessConfig: {
				totalAccessEntries: totalSpellAccess,
				accessBySource
			},
			currentCharacter: {
				race: character.race,
				subrace: character.subrace,
				class: character.class,
				spellAccessEntries: characterSpellAccess.length,
				spellAccessDetails: characterSpellAccess.map((sa) => ({
					source: sa.source,
					sourceName: sa.sourceName,
					spellCount: sa.spells?.length || 0,
					cantripCount: sa.cantrips?.length || 0,
					chooseable: sa.chooseable
				}))
			}
		};

		console.log('Data Integrity Analysis:', integrity);
		return integrity;
	}

	// Reactive data integrity analysis
	$: dataIntegrity = analyzeDataIntegrity();

	// Equipment proficiency debug
	function debugEquipmentProficiencies() {
		console.log('=== EQUIPMENT PROFICIENCY DEBUG ===');
		console.log('Current proficiencies:', character.proficiencies);
		console.log('Class:', character.class);
		console.log('Subclass:', character.subclass);
		
		// Check equipment selections
		if (character._provenance) {
			const equipmentScopes = Object.keys(character._provenance).filter(k => k.startsWith('class_equipment_'));
			console.log('Equipment scopes:', equipmentScopes);
			
			equipmentScopes.forEach(scopeId => {
				const data = character._provenance![scopeId];
				const actualData = data._set || data;
				console.log(`${scopeId}:`, {
					selectedOption: actualData.selectedOption,
					inventory: actualData.inventory,
					subChoiceSelections: actualData.subChoiceSelections
				});
			});
		}
	}

	$: equipmentDebugInfo = {
		proficiencies: character.proficiencies || [],
		class: character.class || 'None',
		subclass: character.subclass || 'None',
		equipmentSelections: character._provenance ? Object.keys(character._provenance)
			.filter(k => k.startsWith('class_equipment_'))
			.map(scopeId => {
				const data = character._provenance![scopeId];
				const actualData = data._set || data;
				return {
					scopeId,
					selectedOption: actualData.selectedOption,
					inventory: actualData.inventory || []
				};
			}) : []
	};
</script>

<div class="main-content">
	<h1>Debug & Export Page</h1>
	<p>This page provides debugging information and data integrity checks.</p>

	<div class="debug-buttons">
		<button
			on:click={runDebug}
			style="background: blue; color: white; padding: 10px; margin: 10px;"
		>
			Debug Conflicts
		</button>
		<button
			on:click={debugEquipmentProficiencies}
			style="background: green; color: white; padding: 10px; margin: 10px;"
		>
			Debug Equipment Proficiencies
		</button>
	</div>

	<div class="equipment-debug-section" style="margin: 20px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
		<h2>⚔️ Equipment Proficiency Debug</h2>
		<div style="margin: 10px 0;">
			<strong>Class:</strong> {equipmentDebugInfo.class}
		</div>
		<div style="margin: 10px 0;">
			<strong>Subclass:</strong> {equipmentDebugInfo.subclass}
		</div>
		<div style="margin: 10px 0;">
			<strong>Proficiencies:</strong> {JSON.stringify(equipmentDebugInfo.proficiencies)}
		</div>
		<div style="margin: 10px 0;">
			<strong>Equipment Selections:</strong>
			{#if equipmentDebugInfo.equipmentSelections.length > 0}
				<ul>
					{#each equipmentDebugInfo.equipmentSelections as selection}
						<li>
							<strong>{selection.scopeId}:</strong>
							Option #{selection.selectedOption !== undefined ? selection.selectedOption : 'None'},
							Inventory: {JSON.stringify(selection.inventory)}
						</li>
					{/each}
				</ul>
			{:else}
				<em>No equipment selected</em>
			{/if}
		</div>
	</div>

	<div class="integrity-section">
		<h2>📊 Data Integrity Report</h2>

		<div class="integrity-grid">
			<div class="integrity-card">
				<h3>🪄 Spell Database</h3>
				<p><strong>Total Spells:</strong> {dataIntegrity.spellDatabase.totalSpells}</p>
				<p><strong>By Level:</strong></p>
				<ul>
					{#each Object.entries(dataIntegrity.spellDatabase.spellsByLevel) as [level, count]}
						<li>Level {level}: {count} spells</li>
					{/each}
				</ul>
			</div>

			<div class="integrity-card">
				<h3>🧙‍♀️ Drow Spells Check</h3>
				{#each dataIntegrity.spellDatabase.drowSpellsAnalysis as drowSpell}
					<div class="spell-check {drowSpell.found ? 'found' : 'missing'}">
						<strong>{drowSpell.name}:</strong>
						{#if drowSpell.found}
							✅ Found (Level {drowSpell.level})
							<br /><small>Classes: {drowSpell.classes.join(', ')}</small>
						{:else}
							❌ Missing
						{/if}
					</div>
				{/each}
			</div>

			<div class="integrity-card">
				<h3>⚙️ Spell Access Config</h3>
				<p>
					<strong>Total Access Entries:</strong>
					{dataIntegrity.spellAccessConfig.totalAccessEntries}
				</p>
				<p><strong>By Source:</strong></p>
				<ul>
					{#each Object.entries(dataIntegrity.spellAccessConfig.accessBySource) as [source, count]}
						<li>{source}: {count} entries</li>
					{/each}
				</ul>
			</div>

			<div class="integrity-card">
				<h3>👤 Current Character</h3>
				<p><strong>Race:</strong> {character.race || 'None'}</p>
				<p><strong>Subrace:</strong> {character.subrace || 'None'}</p>
				<p><strong>Class:</strong> {character.class || 'None'}</p>
				<p>
					<strong>Spell Access Entries:</strong>
					{dataIntegrity.currentCharacter.spellAccessEntries}
				</p>
				{#if dataIntegrity.currentCharacter.spellAccessDetails.length > 0}
					<details>
						<summary>Spell Access Details</summary>
						{#each dataIntegrity.currentCharacter.spellAccessDetails as detail}
							<div class="access-detail">
								<strong>{detail.sourceName}</strong> ({detail.source})
								<br />Spells: {detail.spellCount}, Cantrips: {detail.cantripCount}
								<br />Chooseable: {detail.chooseable ? 'Yes' : 'No'}
							</div>
						{/each}
					</details>
				{/if}
			</div>
		</div>
	</div>

	<div class="debug-section">
		<h2>🔧 Dynamic Options Debug</h2>
		<div class="debug-info">
			<p><strong>Character Skills:</strong> {JSON.stringify(character.skills || [])}</p>
			<p><strong>Character Expertise:</strong> {JSON.stringify(character.expertise || [])}</p>
			<p><strong>Character Class:</strong> {character.class || 'None'}</p>
			<p><strong>Character Features:</strong> {JSON.stringify(character.features || [])}</p>
			{#if typeof window !== 'undefined' && window.dynamicOptionsDebug}
				<hr />
				<p><strong>Last Dynamic Options Call:</strong></p>
				<p>
					<strong>Generator Type:</strong>
					{window.dynamicOptionsDebug.lastCall?.generatorType || 'None'}
				</p>
				<p>
					<strong>Additional Options:</strong>
					{JSON.stringify(window.dynamicOptionsDebug.lastCall?.additionalOptions || [])}
				</p>
				<p>
					<strong>Skills from Store:</strong>
					{JSON.stringify(window.dynamicOptionsDebug.lastCall?.skillsArray || [])}
				</p>
				<p>
					<strong>Final Options Generated:</strong>
					{JSON.stringify(window.dynamicOptionsDebug.lastCall?.finalOptions || [])}
				</p>
				<p>
					<strong>Timestamp:</strong>
					{window.dynamicOptionsDebug.lastCall?.timestamp || 'Never'}
				</p>
				{#if window.dynamicOptionsDebug.filtering}
					<hr />
					<p><strong>Filtering Debug:</strong></p>
					<p>
						<strong>Feature:</strong>
						{window.dynamicOptionsDebug.filtering.featureName} (index {window.dynamicOptionsDebug
							.filtering.index})
					</p>
					<p>
						<strong>Is Expertise Feature:</strong>
						{window.dynamicOptionsDebug.filtering.isExpertiseFeature ? 'Yes' : 'No'}
					</p>
					<p>
						<strong>Raw Options:</strong>
						{JSON.stringify(window.dynamicOptionsDebug.filtering.rawOptions || [])}
					</p>
					<p>
						<strong>Already Chosen Here:</strong>
						{JSON.stringify(window.dynamicOptionsDebug.filtering.chosenHere || [])}
					</p>
					<p>
						<strong>Current Value:</strong>
						{window.dynamicOptionsDebug.filtering.currentValue || 'null'}
					</p>
					<p>
						<strong>Taken (blocked):</strong>
						{JSON.stringify(window.dynamicOptionsDebug.filtering.taken || [])}
					</p>
					{#if window.dynamicOptionsDebug.filtering.isExpertiseFeature}
						<p>
							<strong>Expertise Already Chosen:</strong>
							{JSON.stringify(window.dynamicOptionsDebug.filtering.expertiseAlreadyChosen || [])}
						</p>
					{/if}
					<p>
						<strong>Final Filtered Options:</strong>
						{JSON.stringify(window.dynamicOptionsDebug.filtering.finalFiltered || [])}
					</p>
				{/if}
			{:else}
				<hr />
				<p>
					<em
						>No dynamic options calls detected yet. Try clicking on a Rogue or Bard Expertise
						dropdown.</em
					>
				</p>
			{/if}
		</div>
	</div>

	{#if typeof window !== 'undefined' && window.classRemovalDebug}
		<div class="debug-section">
			<h2>🗑️ Class Removal Debug</h2>
			<div class="debug-info">
				<p><strong>Attempted Class:</strong> {window.classRemovalDebug.attemptedClass}</p>
				<p><strong>Completed:</strong> {window.classRemovalDebug.completed ? 'Yes' : 'No'}</p>
				<p><strong>Timestamp:</strong> {window.classRemovalDebug.timestamp}</p>
				<p><strong>Steps:</strong></p>
				<ul>
					{#each window.classRemovalDebug.steps || [] as step}
						<li>{step}</li>
					{/each}
				</ul>
				{#if window.classRemovalDebug.revertErrors && window.classRemovalDebug.revertErrors.length > 0}
					<p><strong>Errors:</strong></p>
					<ul>
						{#each window.classRemovalDebug.revertErrors as error}
							<li style="color: red;">{error.key}: {error.error}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	{/if}

	<details class="character-dump">
		<summary>Raw Character Data</summary>
		<pre>{JSON.stringify(character, null, 2)}</pre>
	</details>
</div>

<style>
	.main-content {
		padding: 2rem 1rem;
		padding-top: 80px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.debug-buttons {
		margin-bottom: 2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.integrity-section {
		margin-bottom: 2rem;
	}

	.integrity-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-top: 1rem;
	}

	.integrity-card {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.integrity-card h3 {
		margin: 0 0 1rem 0;
		color: #1e293b;
		font-size: 1.1rem;
	}

	.integrity-card ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	.integrity-card li {
		margin: 0.25rem 0;
	}

	.spell-check {
		padding: 0.75rem;
		margin: 0.5rem 0;
		border-radius: 6px;
		border-left: 4px solid;
	}

	.spell-check.found {
		background: #f0fdf4;
		border-color: #22c55e;
		color: #166534;
	}

	.spell-check.missing {
		background: #fef2f2;
		border-color: #ef4444;
		color: #dc2626;
	}

	.access-detail {
		padding: 0.75rem;
		margin: 0.5rem 0;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.character-dump {
		margin-top: 2rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		padding: 1rem;
		background: #f9fafb;
	}

	.character-dump summary {
		cursor: pointer;
		font-weight: 600;
		color: #374151;
		margin-bottom: 1rem;
	}

	.character-dump pre {
		background: #1f2937;
		color: #f9fafb;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	details summary {
		cursor: pointer;
		user-select: none;
	}

	details[open] summary {
		margin-bottom: 0.5rem;
	}

	.debug-section {
		margin: 2rem 0;
		padding: 1.5rem;
		border: 2px solid #ff6b6b;
		border-radius: 8px;
		background: #fff5f5;
	}

	.debug-section h2 {
		margin: 0 0 1rem 0;
		color: #d63031;
	}

	.debug-info {
		font-family: monospace;
		background: #f8f8f8;
		padding: 1rem;
		border-radius: 4px;
		border: 1px solid #ddd;
	}

	.debug-info p {
		margin: 0.5rem 0;
		word-break: break-all;
	}
</style>
