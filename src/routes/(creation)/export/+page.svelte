<script lang="ts">
	import { character_store } from '$lib/stores/character_store';
	import type { Character } from '$lib/stores/character_store';
	import { onMount } from 'svelte';

	let showDialog = false;
	let pageStackRef: HTMLDivElement;
	let html2pdf: any = null;

	// Character data
	let character: Character;
	const unsubscribe = character_store.subscribe((value) => {
		character = value;
	});

	// Load html2pdf only in browser
	onMount(async () => {
		if (typeof window !== 'undefined') {
			const mod = await import('html2pdf.js');
			html2pdf = mod.default;
		}
		return () => {
			unsubscribe();
		};
	});

	function toggleDialog() {
		showDialog = !showDialog;
	}

	async function downloadPDF() {
		if (!html2pdf) {
			console.error('html2pdf not yet loaded');
			return;
		}
		showDialog = false;

		const element = pageStackRef;
		if (!element) return;

		const opt = {
			margin: 0.25,
			filename: `${character.name || 'character'}_sheet.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true },
			jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
			pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
		};

		await html2pdf().from(element).set(opt).save();
	}

	function handleDummy(action: string) {
		alert(`${action} clicked`);
	}

	// Helper function to calculate ability modifier
	function getModifier(score: number | null): string {
		if (score === null) return '+0';
		const mod = Math.floor((score - 10) / 2);
		return mod >= 0 ? `+${mod}` : `${mod}`;
	}
</script>

<div class="export-container">
	<!-- Printable region -->
	<div bind:this={pageStackRef} class="page-stack">
		<!-- PAGE 1 -->
		<div class="sheet-page">
			<!-- Header Section -->
			<div class="sheet-header">
				<div class="header-row">
					<div class="field char-name">
						<label>Character Name</label>
						<div class="field-value"></div>
					</div>
				</div>
				<div class="header-row three-col">
					<div class="field">
						<label>Class & Level</label>
						<div class="field-value"></div>
					</div>
					<div class="field">
						<label>Background</label>
						<div class="field-value"></div>
					</div>
					<div class="field">
						<label>Species</label>
						<div class="field-value"></div>
					</div>
				</div>
				<div class="header-row three-col">
					<div class="field">
						<label>Alignment</label>
						<div class="field-value"></div>
					</div>
					<div class="field">
						<label>Experience Points</label>
						<div class="field-value"></div>
					</div>
					<div class="field">
						<label>Proficiency Bonus</label>
						<div class="field-value"></div>
					</div>
				</div>
			</div>

			<!-- Main Content: 3 columns -->
			<div class="sheet-main">
				<!-- LEFT COLUMN: Ability Scores -->
				<div class="column left-column">
					<div class="ability-scores-section">
						<h3 class="section-title">Ability Scores</h3>
						
						{#each ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'] as ability}
							<div class="ability-box">
								<div class="ability-name">{ability}</div>
								<div class="ability-modifier"></div>
								<div class="ability-score"></div>
							</div>
						{/each}
					</div>

					<!-- Inspiration -->
					<div class="inspiration-box">
						<label>Inspiration</label>
						<div class="checkbox"></div>
					</div>

					<!-- Proficiency Bonus (larger display) -->
					<div class="proficiency-display">
						<label>Proficiency Bonus</label>
						<div class="prof-value"></div>
					</div>

					<!-- Saving Throws -->
					<div class="saves-section">
						<h3 class="section-title">Saving Throws</h3>
						{#each ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'] as ability}
							<div class="save-row">
								<div class="checkbox"></div>
								<div class="save-value"></div>
								<label>{ability}</label>
							</div>
						{/each}
					</div>

					<!-- Skills -->
					<div class="skills-section">
						<h3 class="section-title">Skills</h3>
						{#each [
							{ name: 'Acrobatics', ability: 'Dex' },
							{ name: 'Animal Handling', ability: 'Wis' },
							{ name: 'Arcana', ability: 'Int' },
							{ name: 'Athletics', ability: 'Str' },
							{ name: 'Deception', ability: 'Cha' },
							{ name: 'History', ability: 'Int' },
							{ name: 'Insight', ability: 'Wis' },
							{ name: 'Intimidation', ability: 'Cha' },
							{ name: 'Investigation', ability: 'Int' },
							{ name: 'Medicine', ability: 'Wis' },
							{ name: 'Nature', ability: 'Int' },
							{ name: 'Perception', ability: 'Wis' },
							{ name: 'Performance', ability: 'Cha' },
							{ name: 'Persuasion', ability: 'Cha' },
							{ name: 'Religion', ability: 'Int' },
							{ name: 'Sleight of Hand', ability: 'Dex' },
							{ name: 'Stealth', ability: 'Dex' },
							{ name: 'Survival', ability: 'Wis' }
						] as skill}
							<div class="skill-row">
								<div class="checkbox"></div>
								<div class="skill-value"></div>
								<label>{skill.name} <span class="ability-abbr">({skill.ability})</span></label>
							</div>
						{/each}
					</div>

					<!-- Passive Perception -->
					<div class="passive-perception">
						<label>Passive Wisdom (Perception)</label>
						<div class="passive-value"></div>
					</div>
				</div>

				<!-- MIDDLE COLUMN: Combat Stats -->
				<div class="column middle-column">
					<!-- Combat Stats -->
					<div class="combat-stats">
						<div class="stat-box ac-box">
							<div class="stat-value"></div>
							<label>Armor Class</label>
						</div>
						<div class="stat-box initiative-box">
							<div class="stat-value"></div>
							<label>Initiative</label>
						</div>
						<div class="stat-box speed-box">
							<div class="stat-value"></div>
							<label>Speed</label>
						</div>
					</div>

					<!-- HP Box -->
					<div class="hp-section">
						<div class="hp-max">
							<label>Hit Point Maximum</label>
							<div class="field-value"></div>
						</div>
						<div class="hp-current">
							<label>Current Hit Points</label>
							<div class="large-field"></div>
						</div>
						<div class="hp-temp">
							<label>Temporary Hit Points</label>
							<div class="field-value"></div>
						</div>
					</div>

					<!-- Hit Dice & Death Saves -->
					<div class="hit-dice-death">
						<div class="hit-dice-box">
							<label>Hit Dice</label>
							<div class="field-value"></div>
							<label class="sublabel">Total</label>
						</div>
						<div class="death-saves">
							<h4>Death Saves</h4>
							<div class="save-group">
								<label>Successes</label>
								<div class="bubbles">
									<div class="bubble"></div>
									<div class="bubble"></div>
									<div class="bubble"></div>
								</div>
							</div>
							<div class="save-group">
								<label>Failures</label>
								<div class="bubbles">
									<div class="bubble"></div>
									<div class="bubble"></div>
									<div class="bubble"></div>
								</div>
							</div>
						</div>
					</div>

					<!-- Attacks & Spellcasting -->
					<div class="attacks-section">
						<h3 class="section-title">Attacks & Spellcasting</h3>
						<div class="attacks-header">
							<span class="col-name">Name</span>
							<span class="col-bonus">Atk Bonus</span>
							<span class="col-damage">Damage/Type</span>
						</div>
						<div class="attack-rows">
							<div class="attack-row">
								<div class="attack-name"></div>
								<div class="attack-bonus"></div>
								<div class="attack-damage"></div>
							</div>
							<div class="attack-row">
								<div class="attack-name"></div>
								<div class="attack-bonus"></div>
								<div class="attack-damage"></div>
							</div>
							<div class="attack-row">
								<div class="attack-name"></div>
								<div class="attack-bonus"></div>
								<div class="attack-damage"></div>
							</div>
							<div class="attack-row">
								<div class="attack-name"></div>
								<div class="attack-bonus"></div>
								<div class="attack-damage"></div>
							</div>
							<div class="attack-row">
								<div class="attack-name"></div>
								<div class="attack-bonus"></div>
								<div class="attack-damage"></div>
							</div>
						</div>
					</div>

					<!-- Equipment -->
					<div class="equipment-section">
						<h3 class="section-title">Equipment</h3>
						<div class="equipment-list">
							<div class="equipment-line"></div>
							<div class="equipment-line"></div>
							<div class="equipment-line"></div>
							<div class="equipment-line"></div>
							<div class="equipment-line"></div>
							<div class="equipment-line"></div>
							<div class="equipment-line"></div>
							<div class="equipment-line"></div>
						</div>
					</div>
				</div>

				<!-- RIGHT COLUMN: Features & Traits -->
				<div class="column right-column">
					<!-- Proficiencies & Languages -->
					<div class="proficiencies-section">
						<h3 class="section-title">Other Proficiencies & Languages</h3>
						<div class="text-area"></div>
					</div>

					<!-- Features & Traits -->
					<div class="features-section">
						<h3 class="section-title">Features & Traits</h3>
						<div class="text-area large"></div>
					</div>
				</div>
			</div>
		</div>

		<!-- PAGE 2 -->
		<div class="sheet-page">
			<div class="page2-header">
				<div class="field char-name-p2">
					<label>Character Name</label>
					<div class="field-value"></div>
				</div>
			</div>

			<!-- Character Appearance & Backstory -->
			<div class="character-description">
				<div class="desc-grid">
					<div class="field">
						<label>Age</label>
						<div class="field-value"></div>
					</div>
					<div class="field">
						<label>Height</label>
						<div class="field-value"></div>
					</div>
					<div class="field">
						<label>Weight</label>
						<div class="field-value"></div>
					</div>
					<div class="field">
						<label>Eyes</label>
						<div class="field-value"></div>
					</div>
					<div class="field">
						<label>Skin</label>
						<div class="field-value"></div>
					</div>
					<div class="field">
						<label>Hair</label>
						<div class="field-value"></div>
					</div>
				</div>
			</div>

			<!-- Character Portrait/Sketch Area -->
			<div class="character-portrait">
				<label>Character Appearance</label>
				<div class="portrait-box"></div>
			</div>

			<!-- Backstory & Traits -->
			<div class="backstory-section">
				<div class="backstory-field">
					<label>Personality Traits</label>
					<div class="text-area small"></div>
				</div>
				<div class="backstory-field">
					<label>Ideals</label>
					<div class="text-area small"></div>
				</div>
				<div class="backstory-field">
					<label>Bonds</label>
					<div class="text-area small"></div>
				</div>
				<div class="backstory-field">
					<label>Flaws</label>
					<div class="text-area small"></div>
				</div>
			</div>

			<!-- Additional Features & Traits (continued from page 1) -->
			<div class="additional-features">
				<h3 class="section-title">Additional Features & Traits</h3>
				<div class="text-area large"></div>
			</div>

			<!-- Treasure & Notes -->
			<div class="treasure-section">
				<h3 class="section-title">Treasure & Notes</h3>
				<div class="text-area medium"></div>
			</div>
		</div>
	</div>

	<!-- Floating download button -->
	<button class="export-fab" on:click={toggleDialog}>Finish Export</button>

	<!-- Modal -->
	{#if showDialog}
		<div class="dialog-backdrop" on:click={toggleDialog} role="button" tabindex="-1"></div>
		<div class="dialog" role="dialog">
			<h2>Export Options</h2>
			<button on:click={downloadPDF}>Download as PDF</button>
			<button on:click={() => handleDummy('Send to E&D Team')}>Send to E&D Team</button>
			<button on:click={() => handleDummy('Save Character')}>Save Character</button>
			<button class="close-btn" on:click={toggleDialog}>Close</button>
		</div>
	{/if}
</div>

<style>
	.export-container {
		margin-top: 4rem;
		padding-bottom: 5rem;
		display: flex;
		justify-content: center;
		background: #e5e7eb;
	}

	.page-stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding: 2rem 0;
	}

	/* Page styling */
	.sheet-page {
		width: 8.5in;
		min-height: 11in;
		background: white;
		color: #000;
		border: 1px solid #999;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
		padding: 0.5in;
		margin-bottom: 2rem;
		box-sizing: border-box;
		font-family: 'Arial', sans-serif;
		font-size: 9pt;
		page-break-after: always;
	}

	/* Header Section */
	.sheet-header {
		margin-bottom: 0.5rem;
	}

	.header-row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.3rem;
	}

	.header-row.three-col {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 0.5rem;
	}

	.field {
		display: flex;
		flex-direction: column;
	}

	.field label {
		font-size: 7pt;
		font-weight: bold;
		text-transform: uppercase;
		margin-bottom: 2px;
		color: #555;
	}

	.field-value {
		border-bottom: 1px solid #000;
		min-height: 18px;
		padding: 2px 4px;
	}

	.char-name {
		flex: 1;
	}

	.char-name .field-value {
		font-size: 12pt;
		font-weight: bold;
	}

	/* Main Content - 3 column layout */
	.sheet-main {
		display: grid;
		grid-template-columns: 1.8in 2.5in 3in;
		gap: 0.2in;
		margin-top: 0.2in;
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 0.15in;
	}

	.section-title {
		font-size: 9pt;
		font-weight: bold;
		text-transform: uppercase;
		margin: 0 0 0.1in 0;
		padding: 3px 6px;
		background: #f3f4f6;
		border: 1px solid #999;
		text-align: center;
	}

	/* Ability Scores */
	.ability-scores-section {
		display: flex;
		flex-direction: column;
		gap: 0.08in;
	}

	.ability-box {
		border: 1px solid #999;
		text-align: center;
		padding: 4px;
		background: #f9f9f9;
	}

	.ability-name {
		font-size: 7pt;
		font-weight: bold;
		text-transform: uppercase;
		color: #555;
	}

	.ability-modifier {
		font-size: 16pt;
		font-weight: bold;
		min-height: 24px;
		border-bottom: 1px solid #ccc;
		margin: 2px 0;
	}

	.ability-score {
		border: 1px solid #999;
		width: 30px;
		height: 30px;
		margin: 4px auto 0;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: white;
	}

	/* Inspiration */
	.inspiration-box {
		border: 1px solid #999;
		padding: 6px;
		text-align: center;
	}

	.inspiration-box label {
		font-size: 7pt;
		font-weight: bold;
		text-transform: uppercase;
		display: block;
		margin-bottom: 4px;
	}

	.checkbox {
		width: 16px;
		height: 16px;
		border: 2px solid #000;
		margin: 0 auto;
		border-radius: 3px;
	}

	/* Proficiency Bonus */
	.proficiency-display {
		border: 1px solid #999;
		padding: 6px;
		text-align: center;
	}

	.proficiency-display label {
		font-size: 7pt;
		font-weight: bold;
		text-transform: uppercase;
		display: block;
		margin-bottom: 4px;
	}

	.prof-value {
		font-size: 14pt;
		font-weight: bold;
		min-height: 24px;
		border: 1px solid #999;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Saving Throws */
	.saves-section {
		border: 1px solid #999;
		padding: 6px;
	}

	.save-row,
	.skill-row {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 3px;
		font-size: 8pt;
	}

	.save-row .checkbox,
	.skill-row .checkbox {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
	}

	.save-value,
	.skill-value {
		border-bottom: 1px solid #999;
		width: 32px;
		min-height: 14px;
		text-align: center;
		flex-shrink: 0;
	}

	.save-row label,
	.skill-row label {
		font-size: 8pt;
		flex: 1;
	}

	/* Skills */
	.skills-section {
		border: 1px solid #999;
		padding: 6px;
	}

	.ability-abbr {
		color: #666;
		font-size: 7pt;
	}

	/* Passive Perception */
	.passive-perception {
		border: 1px solid #999;
		padding: 6px;
		text-align: center;
	}

	.passive-perception label {
		font-size: 7pt;
		font-weight: bold;
		text-transform: uppercase;
		display: block;
		margin-bottom: 4px;
	}

	.passive-value {
		border: 1px solid #999;
		width: 36px;
		height: 36px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12pt;
		font-weight: bold;
		border-radius: 4px;
	}

	/* Combat Stats */
	.combat-stats {
		display: flex;
		justify-content: space-between;
		gap: 0.1in;
	}

	.stat-box {
		flex: 1;
		border: 1px solid #999;
		text-align: center;
		padding: 8px 4px;
		background: #f9f9f9;
	}

	.stat-value {
		font-size: 18pt;
		font-weight: bold;
		min-height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid #ccc;
		margin-bottom: 4px;
	}

	.stat-box label {
		font-size: 7pt;
		font-weight: bold;
		text-transform: uppercase;
		color: #555;
	}

	/* HP Section */
	.hp-section {
		border: 1px solid #999;
		padding: 8px;
	}

	.hp-max,
	.hp-temp {
		margin-bottom: 6px;
	}

	.hp-max label,
	.hp-temp label {
		font-size: 7pt;
		font-weight: bold;
		text-transform: uppercase;
		display: block;
		margin-bottom: 2px;
		color: #555;
	}

	.large-field {
		border: 1px solid #999;
		min-height: 50px;
		background: #fff;
	}

	/* Hit Dice & Death Saves */
	.hit-dice-death {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.1in;
	}

	.hit-dice-box {
		border: 1px solid #999;
		padding: 8px;
		text-align: center;
	}

	.hit-dice-box label {
		font-size: 7pt;
		font-weight: bold;
		text-transform: uppercase;
		display: block;
		margin-bottom: 4px;
	}

	.hit-dice-box .field-value {
		min-height: 24px;
		margin-bottom: 4px;
	}

	.sublabel {
		font-size: 6pt !important;
		color: #666;
	}

	.death-saves {
		border: 1px solid #999;
		padding: 8px;
	}

	.death-saves h4 {
		font-size: 8pt;
		font-weight: bold;
		text-transform: uppercase;
		margin: 0 0 6px 0;
		text-align: center;
	}

	.save-group {
		margin-bottom: 4px;
	}

	.save-group label {
		font-size: 7pt;
		font-weight: bold;
		display: block;
		margin-bottom: 2px;
	}

	.bubbles {
		display: flex;
		gap: 6px;
	}

	.bubble {
		width: 14px;
		height: 14px;
		border: 2px solid #000;
		border-radius: 50%;
	}

	/* Attacks */
	.attacks-section {
		border: 1px solid #999;
		padding: 8px;
	}

	.attacks-header {
		display: grid;
		grid-template-columns: 2fr 1fr 2fr;
		gap: 4px;
		font-size: 7pt;
		font-weight: bold;
		text-transform: uppercase;
		padding-bottom: 4px;
		border-bottom: 1px solid #999;
		margin-bottom: 4px;
	}

	.attack-row {
		display: grid;
		grid-template-columns: 2fr 1fr 2fr;
		gap: 4px;
		margin-bottom: 3px;
	}

	.attack-name,
	.attack-bonus,
	.attack-damage {
		border-bottom: 1px solid #999;
		min-height: 14px;
		font-size: 8pt;
	}

	/* Equipment */
	.equipment-section {
		border: 1px solid #999;
		padding: 8px;
	}

	.equipment-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.equipment-line {
		border-bottom: 1px solid #999;
		min-height: 14px;
	}

	/* Proficiencies & Languages */
	.proficiencies-section {
		border: 1px solid #999;
		padding: 8px;
	}

	.text-area {
		border: 1px solid #ccc;
		min-height: 80px;
		background: #fff;
		padding: 4px;
	}

	.text-area.small {
		min-height: 50px;
	}

	.text-area.medium {
		min-height: 120px;
	}

	.text-area.large {
		min-height: 200px;
	}

	/* Features & Traits */
	.features-section {
		border: 1px solid #999;
		padding: 8px;
		flex: 1;
	}

	/* PAGE 2 */
	.page2-header {
		margin-bottom: 0.3in;
	}

	.char-name-p2 {
		width: 100%;
	}

	.character-description {
		margin-bottom: 0.2in;
	}

	.desc-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.1in;
	}

	.character-portrait {
		border: 1px solid #999;
		padding: 8px;
		margin-bottom: 0.2in;
	}

	.character-portrait label {
		font-size: 8pt;
		font-weight: bold;
		text-transform: uppercase;
		display: block;
		margin-bottom: 6px;
		text-align: center;
	}

	.portrait-box {
		border: 1px solid #ccc;
		min-height: 2in;
		background: #fafafa;
	}

	.backstory-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.15in;
		margin-bottom: 0.2in;
	}

	.backstory-field {
		border: 1px solid #999;
		padding: 8px;
	}

	.backstory-field label {
		font-size: 8pt;
		font-weight: bold;
		text-transform: uppercase;
		display: block;
		margin-bottom: 4px;
	}

	.additional-features {
		border: 1px solid #999;
		padding: 8px;
		margin-bottom: 0.2in;
	}

	.treasure-section {
		border: 1px solid #999;
		padding: 8px;
	}

	/* Floating Button */
	.export-fab {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		background: #2563eb;
		color: #fff;
		font-weight: 600;
		padding: 0.75rem 1.25rem;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
		transition: background 0.2s;
		z-index: 100;
	}

	.export-fab:hover {
		background: #1d4ed8;
	}

	/* Modal */
	.dialog-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 200;
	}

	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 2rem;
		border-radius: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		z-index: 201;
		min-width: 300px;
	}

	.dialog h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	.dialog button {
		padding: 0.5rem 1rem;
		font-weight: 600;
		border: 1px solid #ccc;
		border-radius: 6px;
		cursor: pointer;
		background: white;
		transition: all 0.2s;
	}

	.dialog button:hover {
		background: #f3f4f6;
	}

	.close-btn {
		background: #f3f4f6 !important;
	}

	.close-btn:hover {
		background: #e5e7eb !important;
	}

	/* Print styles */
	@media print {
		.export-container {
			margin: 0;
			padding: 0;
			background: white;
		}

		.export-fab,
		.dialog,
		.dialog-backdrop {
			display: none !important;
		}

		.sheet-page {
			margin: 0;
			border: none;
			box-shadow: none;
			page-break-after: always;
		}
	}
</style>
