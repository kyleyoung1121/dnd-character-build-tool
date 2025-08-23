<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	function start() {
		goto(base + '/class');
	}
</script>

<div class="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-100">
	<h1 class="text-3xl md:text-4xl font-bold mb-6">Welcome to the Ethics and Dragons Character Builder!</h1>
	<p class="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
		What kind of character do you want to play? What are they good at? (magic, nature, being sneaky, fighting) What species could they be?
	</p>
	<button 
		on:click={start} 
		class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
		Start Character Creation
	</button>
</div>
