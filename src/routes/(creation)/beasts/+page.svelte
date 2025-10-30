<script>
	import { character_store, getBeastTabName } from '$lib/stores/character_store';

	// Determine the appropriate title based on character class
	$: pageTitle = getBeastTabName($character_store);
	
	// Determine what type of content to show
	$: isDruid = $character_store.class === 'Druid';
	$: isBeastMaster = $character_store.class === 'Ranger' && $character_store.subclass === 'Beast Master';
	$: isWizard = $character_store.class === 'Wizard';
	$: isPactOfChain = 
		$character_store.class === 'Warlock' && 
		$character_store.features && 
		$character_store.features.includes('Pact of the Chain');
</script>

<div class="page-container">
	<h1>{pageTitle}</h1>
	
	<div class="content">
		{#if isDruid}
			<div class="info-section">
				<h2>Wild Shape Forms</h2>
				<p>
					As a Druid with Wild Shape, you can transform into beast forms. 
					This page will allow you to browse and select from available beast forms for your Wild Shape feature.
				</p>
				<p class="note">
					<strong>Note:</strong> At 3rd level, you can transform into beasts with a challenge rating of 1/4 or lower 
					that don't have a flying or swimming speed.
				</p>
			</div>
		{/if}
		
		{#if isBeastMaster}
			<div class="info-section">
				<h2>Ranger's Companion</h2>
				<p>
					As a Beast Master Ranger, you have a loyal beast companion that fights alongside you. 
					This page will allow you to select and customize your beast companion.
				</p>
				<p class="note">
					<strong>Note:</strong> Your companion must be Medium or smaller with a challenge rating of 1/4 or lower.
				</p>
			</div>
		{/if}
		
		{#if isWizard}
			<div class="info-section">
				<h2>Find Familiar</h2>
				<p>
					As a Wizard, you can learn the Find Familiar spell to summon a magical familiar. 
					This page will allow you to browse and select a familiar if you choose to learn this spell.
				</p>
				<p class="note">
					<strong>Note:</strong> Available familiars include bat, cat, crab, frog, hawk, lizard, octopus, owl, 
					poisonous snake, fish, rat, raven, sea horse, spider, or weasel.
				</p>
			</div>
		{/if}
		
		{#if isPactOfChain}
			<div class="info-section">
				<h2>Pact of the Chain Familiar</h2>
				<p>
					With Pact of the Chain, you gain the Find Familiar spell and can choose special familiar forms. 
					This page will allow you to select your familiar.
				</p>
				<p class="note">
					<strong>Note:</strong> You can choose a normal familiar or one of the special forms: 
					imp, pseudodragon, quasit, or sprite. Your familiar can also attack!
				</p>
			</div>
		{/if}
		
		<div class="placeholder">
			<p>🐾 Beast and familiar selection will be added here soon! 🐾</p>
		</div>
	</div>
</div>

<style>
	.page-container {
		padding: 6rem 2rem 2rem 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		color: #1e293b;
		font-size: 2.5rem;
		margin-bottom: 2rem;
		text-align: center;
	}

	.content {
		background: white;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.info-section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: #f8fafc;
		border-radius: 6px;
		border-left: 4px solid #3b82f6;
	}

	.info-section h2 {
		color: #1e293b;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.info-section p {
		color: #475569;
		line-height: 1.6;
		margin-bottom: 0.5rem;
	}

	.note {
		background: #fff;
		padding: 1rem;
		border-radius: 4px;
		margin-top: 1rem;
		border: 1px solid #e2e8f0;
	}

	.note strong {
		color: #3b82f6;
	}

	.placeholder {
		text-align: center;
		padding: 3rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 8px;
		margin-top: 2rem;
	}

	.placeholder p {
		color: white;
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
	}
</style>
