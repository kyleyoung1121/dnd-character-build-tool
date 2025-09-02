<script lang="ts">
	import ConflictWarning from '$lib/components/ConflictWarning.svelte';
</script>

<div class="main-content">
	<!-- Show conflict warnings for this tab -->
	<ConflictWarning tabName="spells" />

	<p class="intro-text">
		Spellcasting classes like Wizards, Clerics, and Sorcerers can cast spells. At 3rd level, you'll
		have access to various cantrips and 1st-level spells based on your class.
	</p>

	<div class="coming-soon">
		<h2>🔮 Spells Coming Soon!</h2>
		<p>
			Spell selection will be implemented in a future update. For now, refer to your Player's
			Handbook for available spells based on your chosen class.
		</p>
	</div>
</div>

<style>
	.main-content {
		padding: 2rem 1rem;
		padding-top: 80px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.intro-text {
		max-width: 50vw;
		margin: 0 auto 3rem auto;
		text-align: center;
		font-size: 1.1rem;
		color: #444;
	}

	.coming-soon {
		background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
		border: 2px solid #b3d9ff;
		border-radius: 12px;
		padding: 3rem 2rem;
		text-align: center;
		margin: 2rem auto;
		max-width: 600px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.coming-soon h2 {
		font-size: 2rem;
		color: #2563eb;
		margin-bottom: 1rem;
	}

	.coming-soon p {
		font-size: 1.1rem;
		color: #374151;
		line-height: 1.6;
		margin: 0;
	}
</style>
