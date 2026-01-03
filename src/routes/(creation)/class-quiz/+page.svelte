<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	function returnToClass() {
		goto(`${base}/class`);
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
	<div class="w-full max-w-4xl rounded-lg bg-white p-8 text-center shadow-xl border border-gray-200">
		<h1 class="mb-8 text-4xl font-bold text-gray-800">Class Quiz</h1>
		
		<div class="mb-8 text-gray-600">
			<p class="text-lg">Quiz coming soon!</p>
		</div>

		<button
			onclick={returnToClass}
			class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
		>
			Return to Class Selection
		</button>
	</div>
</div>
