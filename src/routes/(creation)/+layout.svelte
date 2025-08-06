<script>
	import { base } from '$app/paths';

	export let navItems = [
		{ name: "Class", href: base + "/class" },
		{ name: "Race", href: base + "/race" },
		{ name: "Abilities", href: base + "/abilities" },
		{ name: "Background", href: base + "/background" },
		{ name: "Equipment", href: base + "/equipment" },
		{ name: "Spells", href: base + "/spells" },
		{ name: "Export", href: base + "/export" }
	];
</script>

<nav>
	<ul>
		{#each navItems as item}
			<li><a href="{item.href}">{item.name}</a></li>
		{/each}
	</ul>
</nav>

<slot />

<style>
	nav {
		background-color: #1e293b; /* dark blue-gray background */
		padding: 1rem 2rem;
		box-shadow: 0 2px 6px rgba(0,0,0,0.15);
	}

	nav ul {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 1.5rem;
        justify-content: center;
	}

	nav li {
	}

	nav a {
		color: white;
		text-decoration: none;
		font-weight: 600;
		font-size: 1rem;
		padding: 0.3rem 0.6rem;
		border-radius: 4px;
		transition: background-color 0.3s ease;
	}

	nav a:hover {
		background-color: #3b82f6; /* bright blue on hover */
		color: white;
	}
</style>
