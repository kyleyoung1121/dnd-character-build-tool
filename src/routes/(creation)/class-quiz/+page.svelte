<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	function returnToClass() {
		goto(`${base}/class`);
	}
</script>

<div class="quiz-container">
	<div class="quiz-card">
		<h1>Class Quiz</h1>
		
		<div class="quiz-content">
			<p>Quiz coming soon!</p>
		</div>

		<button
			onclick={returnToClass}
			class="return-button"
		>
			Return to Class Selection
		</button>
	</div>
</div>

<style>
	.quiz-container {
		display: flex;
		min-height: 100vh;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-8);
		padding-top: 80px;
		background: var(--color-neutral-50);
	}

	.quiz-card {
		width: 100%;
		max-width: 800px;
		background: var(--color-background);
		border-radius: var(--radius-lg);
		padding: var(--spacing-8);
		text-align: center;
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--color-border);
	}

	h1 {
		margin-bottom: var(--spacing-8);
		font-size: var(--font-size-3xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-text-primary);
		font-family: var(--font-family-base);
	}

	.quiz-content {
		margin-bottom: var(--spacing-8);
		color: var(--color-text-muted);
	}

	.quiz-content p {
		font-size: var(--font-size-lg);
		font-family: var(--font-family-base);
	}

	.return-button {
		padding: var(--spacing-3) var(--spacing-6);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		font-family: var(--font-family-base);
		color: white;
		background: var(--color-primary-blue);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-base);
	}

	.return-button:hover {
		background: #2563eb;
		box-shadow: var(--shadow-md);
	}
</style>
