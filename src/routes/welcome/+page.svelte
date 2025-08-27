<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	function start() {
		goto(base + '/class');
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center">
	<h1 class="mb-6 text-3xl font-bold md:text-4xl">
		Welcome to the Ethics and Dragons Character Builder!
	</h1>
	<p class="mb-8 max-w-xl text-lg text-gray-700 md:text-xl">
		What kind of character do you want to play? What are they good at? (magic, nature, being sneaky,
		fighting) What species could they be?
	</p>
	<button
		on:click={start}
		class="rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition hover:bg-blue-700"
	>
		Start Character Creation
	</button>
</div>
