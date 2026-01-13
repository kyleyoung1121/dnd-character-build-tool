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
		background: white;
		padding: 6rem 2rem 2rem 2rem;
	}

	.header {
		max-width: 1000px;
		margin: 0 auto 2rem auto;
		text-align: center;
	}

	.header p {
		font-size: 1rem;
		color: #666;
		margin: 0;
	}

	.content-wrapper {
		max-width: 1000px;
		margin: 0 auto;
	}

	/* Error State */
	.error-message {
		background: white;
		border: 2px solid #dc2626;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
	}

	.error-message h3 {
		color: #dc2626;
		font-size: 1.25rem;
		margin: 0 0 0.5rem 0;
	}

	.error-message p {
		color: #666;
		margin: 0 0 1rem 0;
	}

	.btn-retry {
		background: #dc2626;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-retry:hover {
		background: #b91c1c;
	}

	/* Loading State */
	.loading-state {
		background: white;
		border-radius: 8px;
		padding: 3rem;
		text-align: center;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid #e5e7eb;
		border-top-color: #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem auto;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.loading-state p {
		color: #666;
		font-size: 1rem;
		margin: 0;
	}

	/* PDF Preview */
	.pdf-preview-container {
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
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
		bottom: 2rem;
		right: 2rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 50px;
		padding: 1rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
		transition: all 0.3s ease;
		z-index: 100;
	}

	.fab:hover {
		background: #2563eb;
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
	}

	.fab:active {
		transform: translateY(0);
	}

	.btn-primary,
	.btn-secondary {
		border: none;
		border-radius: 6px;
		padding: 0.875rem 2rem;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
	}

	.btn-primary:hover {
		background: #2563eb;
	}

	.btn-secondary {
		background: white;
		color: #3b82f6;
		border: 2px solid #3b82f6;
	}

	.btn-secondary:hover {
		background: #eff6ff;
	}

	/* Empty State */
	.empty-state {
		background: white;
		border-radius: 8px;
		padding: 3rem;
		text-align: center;
	}

	.empty-state p {
		color: #666;
		font-size: 1rem;
		margin: 0;
	}

	/* Dialog */
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 200;
	}

	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		border-radius: 8px;
		padding: 2rem;
		max-width: 400px;
		width: 90%;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
		z-index: 201;
	}

	.dialog h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1a1a1a;
	}

	.dialog p {
		margin: 0 0 1.5rem 0;
		color: #666;
	}

	.dialog-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.dialog .btn-primary,
	.dialog .btn-secondary {
		width: 100%;
	}

	.btn-close {
		width: 100%;
		background: #f5f5f5;
		color: #666;
		border: none;
		border-radius: 6px;
		padding: 0.75rem;
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-close:hover {
		background: #e5e7eb;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.export-page {
			padding: 5rem 1rem 1rem 1rem;
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
