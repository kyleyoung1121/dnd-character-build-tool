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
	onMount(() => {
		if (typeof window !== 'undefined') {
			import('html2pdf.js').then((mod) => {
				html2pdf = mod.default;
			});
		}
		return () => unsubscribe();
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

	.sheet-page {
	width: 8.5in;
	height: 11in;
	background: #fff;
	border: 1px solid #999;
	box-sizing: border-box;
	padding: 0.4in;
	font-family: Arial, sans-serif;
	font-size: 9pt;
	display: flex;
	flex-direction: column;
	}

	.sheet-header {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 0.3in;
	}
	.portrait-box {
	flex: 0 0 2.3in;
	height: 2.8in;
	border: 1px solid #aaa;
	background: #f8f8f8;
	}
	.header-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	}
	.row { display: flex; gap: 0.4rem; }
	.row.three { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.4rem; }
	.field label {
	font-size: 7pt;
	text-transform: uppercase;
	font-weight: bold;
	color: #555;
	}
	.value {
	min-height: 0.25in;
	border-bottom: 1px solid #bbb;
	}

	/* --- BODY LAYOUT --- */
	.sheet-body {
	flex: 1;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 0.3in;
	}

	/* column 1 */
	.abilities-skills {
	display: grid;
	grid-template-columns: 1fr 1.4fr; /* uneven split */
	gap: 0.15in;
	}
	.other-profs {
	margin-top: 0.25in;
	}

	/* column 2 */
	.core-combat {
	display: flex;
	justify-content: space-between;
	margin-bottom: 0.2in;
	}
	.combat-item {
	width: 1.1in;
	text-align: center;
	border: 1px solid #aaa;
	border-radius: 6px;
	padding: 0.1in 0;
	}
	.combat-item .icon {
	height: 0.25in;
	margin-bottom: 0.05in;
	}
	.combat-item .icon.heart { background: url('/icons/heart.svg') center/contain no-repeat; }
	.combat-item .icon.shield { background: url('/icons/shield.svg') center/contain no-repeat; }
	.combat-item .icon.boot { background: url('/icons/boot.svg') center/contain no-repeat; }
	.combat-item .icon.flash { background: url('/icons/flash.svg') center/contain no-repeat; }

	/* column 3 */
	.personality h3 { margin: 0.05in 0; font-size: 8pt; }
	.features-traits {
	margin-top: 0.2in;
	}

	/* Print adjustments */
	@media print {
	body { margin: 0; }
	.sheet-page { box-shadow: none; border: none; page-break-after: always; }
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
