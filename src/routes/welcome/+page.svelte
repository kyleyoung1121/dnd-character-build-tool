<script>
	import { goto } from '$app/navigation';
	function start() {
		goto('/class');
	}
</script>

<h1>Welcome to DnD Character Builder!</h1>
<p>
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec justo cursus, tincidunt arcu a, malesuada elit.
</p>
<button on:click={start}>Start Character Creation</button>
