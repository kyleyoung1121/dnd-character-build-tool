<script lang="ts">
	import { character_store } from '$lib/stores/character_store';
	import type { Character } from '$lib/stores/character_store';
	import CharacterSheet from '$lib/components/CharacterSheet.svelte';
	import { onMount } from 'svelte';

	let showDialog = false;
	let pageStackRef: HTMLDivElement;
	let html2pdf: any = null;

	let character: Character;
	const unsubscribe = character_store.subscribe((value) => {
		character = value;
	});

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
		<CharacterSheet {character} />
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

	/* Floating "Finish Export" button */
	.export-fab {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		padding: 0.9rem 1.6rem;
		border-radius: 2rem;
		background-color: #2563eb; /* blue-600 */
		color: white;
		font-weight: bold;
		border: none;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
		cursor: pointer;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s, transform 0.1s;
		z-index: 1000;
	}

	.export-fab:hover {
		background-color: #1d4ed8; /* blue-700 */
	}

	.export-fab:active {
		transform: scale(0.96);
	}

	/* Modal backdrop */
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(2px);
		z-index: 1000;
	}

	/* Modal container */
	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
		width: 90%;
		max-width: 400px;
		z-index: 1001;
		text-align: center;
	}

	.dialog h2 {
		margin-bottom: 1rem;
		font-size: 1.25rem;
		color: #111827;
	}

	.dialog button {
		display: block;
		width: 100%;
		padding: 0.75rem;
		margin-top: 0.5rem;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		background-color: #2563eb;
		color: white;
		transition: background-color 0.2s;
	}

	.dialog button:hover {
		background-color: #1d4ed8;
	}

	.close-btn {
		background-color: #e5e7eb;
		color: #111827;
	}

	.close-btn:hover {
		background-color: #d1d5db;
	}

	/* Print adjustments */
	@media print {
		body {
			margin: 0;
		}

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
			box-shadow: none;
			border: none;
			margin: 0;
			page-break-after: always;
		}
	}
</style>
