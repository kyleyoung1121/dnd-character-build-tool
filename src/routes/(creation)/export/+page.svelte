<script lang="ts">
	import { character_store } from '$lib/stores/character_store';
	import type { Character } from '$lib/stores/character_store';
	import { mapCharacterToSheetData } from '$lib/pdf/character-data-mapper';
	import { generateCharacterSheet, downloadCharacterSheet } from '$lib/pdf/pdf-generator';
	import { onMount } from 'svelte';

	let character: Character;
	let pdfUrl: string | null = null;
	let isGenerating = false;
	let errorMessage = '';
	let showExportDialog = false;

	const unsubscribe = character_store.subscribe((value) => {
		character = value;
		if (typeof window !== 'undefined') {
			generatePreview();
		}
	});

	onMount(() => {
		generatePreview();
		return () => {
			unsubscribe();
			if (pdfUrl) {
				URL.revokeObjectURL(pdfUrl);
			}
		};
	});

	async function generatePreview() {
		if (!character) return;
		
		isGenerating = true;
		errorMessage = '';
		
		try {
			if (pdfUrl) {
				URL.revokeObjectURL(pdfUrl);
			}
			
			const sheetData = mapCharacterToSheetData(character);
			pdfUrl = await generateCharacterSheet(sheetData);
		} catch (error) {
			console.error('Failed to generate PDF preview:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF preview';
		} finally {
			isGenerating = false;
		}
	}

	async function handleDownload() {
		try {
			const sheetData = mapCharacterToSheetData(character);
			await downloadCharacterSheet(sheetData, `${character.name || 'character'}-sheet.pdf`);
			showExportDialog = false;
		} catch (error) {
			console.error('Failed to download PDF:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to download PDF';
		}
	}

	function toggleExportDialog() {
		showExportDialog = !showExportDialog;
	}

	function handlePrint() {
		if (pdfUrl) {
			const iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.src = pdfUrl;
			document.body.appendChild(iframe);
			iframe.onload = () => {
				iframe.contentWindow?.print();
			};
		}
	}
</script>

<div class="export-page">
	<div class="content-wrapper">
		{#if errorMessage}
			<div class="error-message">
				<h3>Error Generating Character Sheet</h3>
				<p>{errorMessage}</p>
				<button class="btn-retry" on:click={generatePreview}>
					Try Again
				</button>
			</div>
		{:else if isGenerating}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Generating your character sheet...</p>
			</div>
		{:else if pdfUrl}
			<!-- DEBUG: Show raw character data -->
			<div class="debug-panel" style="background: #f0f0f0; padding: 1rem; margin-bottom: 1rem; border: 2px solid #888; border-radius: 4px;">
				<h3 style="margin: 0 0 0.5rem 0;">Debug: Character Data</h3>
				<div style="font-family: monospace; font-size: 0.9rem;">
					<strong>Skills:</strong> {JSON.stringify(character.skills)}<br/>
					<strong>Features:</strong> {JSON.stringify(character.features)}
				</div>
			</div>
			
			<div class="pdf-preview-container">
				<iframe
					src="{pdfUrl}#toolbar=0&navpanes=0&scrollbar=1"
					class="pdf-viewer"
					title="Character sheet"
				></iframe>
			</div>

			<!-- Floating Action Button -->
			<button class="fab" on:click={toggleExportDialog}>
				Finish Export
			</button>
		{:else}
			<div class="empty-state">
				<p>No character data available</p>
			</div>
		{/if}
	</div>

	<!-- Export Dialog -->
	{#if showExportDialog}
		<div class="dialog-backdrop" on:click={toggleExportDialog} role="button" tabindex="-1" 
			on:keydown={(e) => e.key === 'Escape' && toggleExportDialog()}>
		</div>
		<div class="dialog" role="dialog">
			<h2>Export Your Character</h2>
			<p>Your character sheet is ready to export.</p>
			
			<div class="dialog-actions">
				<button class="btn-primary" on:click={handleDownload}>
					Download PDF
				</button>
				<button class="btn-secondary" on:click={handlePrint}>
					Print
				</button>
			</div>
			
			<button class="btn-close" on:click={toggleExportDialog}>Close</button>
		</div>
	{/if}
</div>

<style>
	.export-page {
		min-height: 100vh;
		background: var(--color-background);
		padding: calc(var(--spacing-16) * 1.5) var(--spacing-8) var(--spacing-8) var(--spacing-8);
	}

	.header {
		max-width: 1000px;
		margin: 0 auto var(--spacing-8) auto;
		text-align: center;
	}

	.header p {
		font-size: var(--font-size-base);
		color: var(--color-text-muted);
		margin: 0;
	}

	.content-wrapper {
		max-width: 1000px;
		margin: 0 auto;
	}

	/* Error State */
	.error-message {
		background: var(--color-background);
		border: 2px solid var(--color-warning);
		border-radius: var(--radius-lg);
		padding: var(--spacing-8);
		text-align: center;
	}

	.error-message h3 {
		color: var(--color-warning);
		font-size: var(--font-size-xl);
		margin: 0 0 var(--spacing-2) 0;
	}

	.error-message p {
		color: var(--color-text-muted);
		margin: 0 0 var(--spacing-4) 0;
	}

	.btn-retry {
		background: var(--color-warning);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		padding: var(--spacing-3) var(--spacing-6);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: background var(--transition-base);
	}

	.btn-retry:hover {
		background: var(--color-warning-dark);
	}

	/* Loading State */
	.loading-state {
		background: var(--color-background);
		border-radius: var(--radius-lg);
		padding: var(--spacing-12);
		text-align: center;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid var(--color-border);
		border-top-color: var(--color-primary-blue);
		border-radius: var(--radius-circle);
		animation: spin 1s linear infinite;
		margin: 0 auto var(--spacing-4) auto;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.loading-state p {
		color: var(--color-text-muted);
		font-size: var(--font-size-base);
		margin: 0;
	}

	/* PDF Preview */
	.pdf-preview-container {
		background: var(--color-background);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		margin-bottom: var(--spacing-8);
		overflow: hidden;
		/* Use viewport height - works on any monitor */
		height: 80vh;
		min-height: 2070px;
		max-width: 800px;
	}

	.pdf-viewer {
		width: 100%;
		height: 100%;
		border: none;
	}

	/* Floating Action Button */
	.fab {
		position: fixed;
		bottom: var(--spacing-8);
		right: var(--spacing-8);
		background: var(--color-primary-blue);
		color: white;
		border: none;
		border-radius: var(--radius-pill);
		padding: var(--spacing-4) var(--spacing-8);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
		transition: all var(--transition-slow);
		z-index: 100;
	}

	.fab:hover {
		background: var(--color-primary-blue-dark);
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
	}

	.fab:active {
		transform: translateY(0);
	}

	.btn-primary,
	.btn-secondary {
		border: none;
		border-radius: var(--radius-md);
		padding: var(--spacing-3-5) var(--spacing-8);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: all var(--transition-base);
	}

	.btn-primary {
		background: var(--color-primary-blue);
		color: white;
	}

	.btn-primary:hover {
		background: var(--color-primary-blue-dark);
	}

	.btn-secondary {
		background: var(--color-background);
		color: var(--color-primary-blue);
		border: 2px solid var(--color-primary-blue);
	}

	.btn-secondary:hover {
		background: #eff6ff;
	}

	/* Empty State */
	.empty-state {
		background: var(--color-background);
		border-radius: var(--radius-lg);
		padding: var(--spacing-12);
		text-align: center;
	}

	.empty-state p {
		color: var(--color-text-muted);
		font-size: var(--font-size-base);
		margin: 0;
	}

	/* Dialog */
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--color-overlay);
		z-index: 200;
	}

	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--color-background);
		border-radius: var(--radius-lg);
		padding: var(--spacing-8);
		max-width: 400px;
		width: 90%;
		box-shadow: var(--shadow-2xl);
		z-index: 201;
	}

	.dialog h2 {
		margin: 0 0 var(--spacing-2) 0;
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.dialog p {
		margin: 0 0 var(--spacing-6) 0;
		color: var(--color-text-muted);
	}

	.dialog-actions {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
		margin-bottom: var(--spacing-4);
	}

	.dialog .btn-primary,
	.dialog .btn-secondary {
		width: 100%;
	}

	.btn-close {
		width: 100%;
		background: var(--color-neutral-100);
		color: var(--color-text-muted);
		border: none;
		border-radius: var(--radius-md);
		padding: var(--spacing-3);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: background var(--transition-base);
	}

	.btn-close:hover {
		background: var(--color-border);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.export-page {
			padding: calc(var(--spacing-16) * 1.25) var(--spacing-4) var(--spacing-4) var(--spacing-4);
		}

		.pdf-preview-container {
			height: calc(100vh - 7rem);
			min-height: 500px;
		}

		.fab {
			bottom: 1rem;
			right: 1rem;
			padding: 0.875rem 1.5rem;
			font-size: 0.9375rem;
		}
	}
</style>
