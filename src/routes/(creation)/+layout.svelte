<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { activeConflicts, markTabAsVisited } from '$lib/stores/conflict_store';
	import { character_store, hasSpellAccess } from '$lib/stores/character_store';
	import NotificationToast from '$lib/components/NotificationToast.svelte';
	import { onMount } from 'svelte';

	const baseNavItems = [
		{ name: 'Class', href: base + '/class', id: 'class' },
		{ name: 'Species', href: base + '/species', id: 'species' },
		{ name: 'Abilities', href: base + '/abilities', id: 'abilities' },
		{ name: 'Background', href: base + '/background', id: 'background' },
		{ name: 'Equipment', href: base + '/equipment', id: 'equipment' },
		{ name: 'Export', href: base + '/export', id: 'export' }
	];

	// Add spells tab conditionally based on character's spell access
	$: navItems = hasSpellAccess($character_store)
		? [
				...baseNavItems.slice(0, 5), // Class through Equipment
				{ name: 'Spells', href: base + '/spells', id: 'spells' },
				baseNavItems[5] // Export
			]
		: baseNavItems;

	// Mark current tab as visited when navigating
	$: if ($page.route?.id) {
		const currentTabId = getCurrentTabId($page.route.id);
		if (currentTabId) {
			markTabAsVisited(currentTabId);
		}
	}

	function getCurrentTabId(routeId) {
		// Extract tab id from route like "/(creation)/class" -> "class"
		const match = routeId.match(/\(creation\)\/([^/]+)/);
		return match ? match[1] : null;
	}

	function hasConflict(tabId) {
		return $activeConflicts.tabsNeedingAttention.includes(tabId);
	}
</script>

<nav>
	<ul>
		{#each navItems as item}
			<li>
				<a href={item.href} class:has-conflict={hasConflict(item.id)}>
					{item.name}
					{#if hasConflict(item.id)}
						<span class="conflict-indicator" title="This tab has conflicts that need attention"
							>⚠️</span
						>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<NotificationToast />

<slot />

<style>
	nav {
		background-color: #1e293b; /* dark blue-gray background */
		padding: 1rem 2rem;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
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

	/* Conflict indicator styles */
	nav a.has-conflict {
		position: relative;
		background-color: #dc2626; /* red background for conflicts */
		animation: pulse-warning 2s infinite;
	}

	nav a.has-conflict:hover {
		background-color: #b91c1c; /* darker red on hover */
	}

	.conflict-indicator {
		margin-left: 0.5rem;
		font-size: 0.9em;
		filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
	}

	@keyframes pulse-warning {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>
