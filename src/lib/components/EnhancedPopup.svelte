<script lang="ts">
	import { base } from '$app/paths';
	import { onMount, onDestroy } from 'svelte';
	
	export let title: string;
	export let itemName: string = ''; // The actual name (e.g., "Barbarian") without "Add" or "to Character"
	export let isOpen: boolean = false;
	export let onClose: () => void;
	export let onConfirm: () => void;
	export let confirmText: string = 'Confirm';
	export let cancelText: string = 'Cancel';
	
	// Content fields
	export let flavorText: string = '';
	export let cultureNotes: string = '';
	export let imagePath: string = '';
	export let imageAlt: string = '';
	
	// Enhanced artwork display logic
	$: hasEnhancedImage = imagePath && imagePath.includes('/popup-art/');
	$: usePlaceholder = !hasEnhancedImage;

	// ESC key handler
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			onClose();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div class="popup-backdrop" on:click={onClose}></div>

	<!-- Enhanced Popup -->
	<div class="enhanced-popup">
		<div class="popup-content">
			<!-- Header -->
			<div class="popup-header">
				<h2>{title}</h2>
				<button class="close-button" on:click={onClose} aria-label="Close">×</button>
			</div>

			<!-- Body -->
			<div class="popup-body">
				<!-- Enhanced Artwork Section -->
				<div class="artwork-section">
					{#if usePlaceholder}
						<div class="artwork-placeholder">
							<div class="placeholder-content">
								<p class="placeholder-text">
									Professional artwork of<br>
									<strong>{itemName || title}</strong><br>
									goes here
								</p>
								<p class="placeholder-note">
											<code>/assets/popup-art/{(itemName || title).toLowerCase().replace(/\s+/g, '_')}.jpg</code>
								</p>
							</div>
						</div>
					{:else}
						<img src={imagePath} alt={imageAlt || title} class="enhanced-artwork" />
					{/if}
				</div>

				<!-- Content Sections -->
				<div class="content-sections">
					<!-- Flavor Text -->
					{#if flavorText}
						<div class="content-section">
							<h3 class="section-title flavor-title">"{flavorText}"</h3>
						</div>
					{/if}

					<!-- Culture & Society -->
					{#if cultureNotes}
						<div class="content-section">
							<h3 class="section-title">Culture & Society</h3>
							<div class="culture-content">
								{cultureNotes}
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Footer -->
			<div class="popup-footer">
				<button class="cancel-button" on:click={onClose}>
					{cancelText}
				</button>
				<button class="confirm-button" on:click={onConfirm}>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.popup-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 1000;
	}

	.enhanced-popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1001;
	}

	.popup-content {
		background: #fff;
		width: 60vw;
		max-width: 800px;
		height: 85vh;
		border-radius: var(--radius-lg);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: var(--shadow-2xl);
	}

	.popup-header {
		background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
		color: white;
		padding: var(--spacing-5) var(--spacing-6);
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.popup-header h2 {
		margin: 0;
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
	}

	.close-button {
		background: none;
		border: none;
		color: white;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-circle);
		transition: background-color var(--transition-base);
	}

	.close-button:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}

	.popup-body {
		padding: 0;
		overflow-y: auto;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.artwork-section {
		position: relative;
		width: 100%;
		height: 250px;
		background: var(--color-neutral-50);
		border-bottom: 1px solid var(--color-border);
	}

	.enhanced-artwork {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.artwork-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, var(--color-neutral-50), var(--color-neutral-200));
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px dashed var(--color-neutral-300);
	}

	.placeholder-content {
		text-align: center;
		color: var(--color-text-muted);
	}
	.placeholder-text {
		font-size: var(--font-size-md);
		margin-bottom: var(--spacing-4);
		line-height: var(--line-height-tight);
	}

	.placeholder-note {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-tight);
		color: var(--color-neutral-400);
	}

	.placeholder-note code {
		background: var(--color-neutral-100);
		padding: var(--spacing-1) var(--spacing-2);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
	}

	.content-sections {
		padding: var(--spacing-6);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-6);
	}

	.content-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.section-title {
		margin: 0;
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-primary-dark);
		border-bottom: 2px solid var(--color-primary-blue);
		padding-bottom: var(--spacing-1);
		display: inline-block;
		width: fit-content;
	}

	.flavor-title {
		font-style: italic;
		font-size: var(--font-size-lg);
		color: var(--color-primary);
		border: none;
		padding: 0;
		font-weight: var(--font-weight-medium);
	}

	.culture-content {
		font-size: var(--font-size-base);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
		text-align: justify;
	}

	.popup-footer {
		padding: var(--spacing-5) var(--spacing-6);
		display: flex;
		justify-content: flex-end;
		gap: var(--spacing-3);
		border-top: 1px solid var(--color-border);
		background: var(--color-background-alt);
	}

	.cancel-button {
		background-color: var(--color-neutral-500);
		color: white;
		border: none;
		padding: var(--spacing-3) var(--spacing-6);
		font-size: var(--font-size-base);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: background-color var(--transition-slow);
	}

	.cancel-button:hover {
		background-color: var(--color-neutral-600);
	}

	.confirm-button {
		background: linear-gradient(135deg, var(--color-success), var(--color-success-light));
		color: white;
		border: none;
		padding: var(--spacing-3) var(--spacing-6);
		font-size: var(--font-size-base);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-slow);
		font-weight: var(--font-weight-semibold);
	}

	.confirm-button:hover {
		background: linear-gradient(135deg, var(--color-success-dark), var(--color-success));
		transform: translateY(-1px);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.popup-content {
			width: 90vw;
			height: 90vh;
		}

		.popup-header {
			padding: var(--spacing-4) var(--spacing-5);
		}

		.popup-header h2 {
			font-size: var(--font-size-lg);
		}

		.artwork-section {
			height: 200px;
		}

		.content-sections {
			padding: var(--spacing-5);
			gap: var(--spacing-5);
		}

		.section-title {
			font-size: var(--font-size-md);
		}

		.flavor-title {
			font-size: var(--font-size-lg);
		}

		.popup-footer {
			padding: var(--spacing-4) var(--spacing-5);
		}

		.cancel-button,
		.confirm-button {
			padding: var(--spacing-3) var(--spacing-5);
			font-size: var(--font-size-sm);
		}
	}
</style>
