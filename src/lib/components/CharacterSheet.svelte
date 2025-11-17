<script lang="ts">
	import type { Character } from '$lib/stores/character_store';
	export let character: Character;
</script>

<div class="sheet-page">
	<!-- HEADER -->
	<div class="header">
		<div class="portrait-box"></div>

		<div class="char-info">
			<div class="info-row"><label>Character Name:</label> <span>{character.name}</span></div>
			<div class="info-row"><label>Race:</label> <span>{character.race}</span></div>
			<div class="info-row"><label>Class:</label> <span>{character.class}</span></div>
			<div class="info-row"><label>Background:</label> <span>{character.background}</span></div>
			<div class="info-row"><label>Size:</label> <span>{character.size}</span></div>
			<div class="info-row"><label>Player:</label> <span>"Player Name Here"</span></div>
		</div>
	</div>

	<!-- PAGE BODY -->
	<div class="page-body">
		<!-- COLUMN 1 -->
		<div class="col col-1">
			<div class="abilities-and-skills">
				<div class="abilities">
					<div class="section-title">Ability Scores</div>
					<!-- Ability grid placeholder -->
					<div class="placeholder">[Ability Scores Here]</div>
				</div>

				<div class="skills">
					<div class="section-title">Skills</div>
					<div class="placeholder">[Skills List Here]</div>
				</div>
			</div>

			<div class="other-proficiencies">
				<div class="section-title">Other Proficiencies</div>
				<div class="placeholder">[Languages, Tools, etc.]</div>
			</div>
		</div>

		<!-- COLUMN 2 -->
		<div class="col col-2">
			<div class="core-combat">
				<div class="section-title">Core Combat</div>
				<div class="core-row">
					<div class="core-box">AC</div>
					<div class="core-box">Initiative</div>
					<div class="core-box">Speed</div>
					<div class="core-box">HP</div>
				</div>
			</div>

			<div class="attacks">
				<div class="section-title">Attacks & Spellcasting</div>
				<div class="placeholder">[Weapons and Spells]</div>
			</div>

			<div class="equipment">
				<div class="section-title">Equipment</div>
				<div class="placeholder">[Gear List]</div>
			</div>
		</div>

		<!-- COLUMN 3 -->
		<div class="col col-3">
			<div class="personality">
				<div class="section-title">Personality Traits, Ideals, Bonds, Flaws</div>
				<div class="placeholder">[Optional personality info]</div>
			</div>

			<div class="features">
				<div class="section-title">Features & Traits</div>
				<div class="placeholder tall">[Class Features, Feats, etc.]</div>
			</div>
		</div>
	</div>
</div>

<style>
	.sheet-page {
		width: 8.5in;
		height: 11in;
		background: white;
		border: 1px solid #ccc;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}

	.header {
		display: flex;
		border: 1px solid #000;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.portrait-box {
		width: 20%;
		height: 1.5in;
		border: 1px solid #000;
		margin-right: 0.5rem;
		background: #f9fafb;
	}

	.char-info {
		width: 70%;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px dotted #999;
	}

	label {
		font-weight: bold;
		font-size: 0.85rem;
	}

	.page-body {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 0.5rem;
		flex: 1;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.section-title {
		font-weight: bold;
		text-align: center;
		border-bottom: 1px solid #000;
		margin-bottom: 0.25rem;
	}

	.placeholder {
		min-height: 1.5in;
		border: 1px dashed #aaa;
		padding: 0.5rem;
		background: #f9fafb;
	}

	.placeholder.tall {
		min-height: 4in;
	}

	.abilities-and-skills {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 0.5rem;
	}

	.core-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.25rem;
	}

	.core-box {
		border: 1px solid #000;
		padding: 0.25rem;
		text-align: center;
		background: #f3f4f6;
		font-weight: bold;
	}
</style>
