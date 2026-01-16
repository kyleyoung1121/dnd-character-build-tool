<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { activeConflicts, markTabAsVisited } from '$lib/stores/conflict_store';
	import {
		character_store,
		hasSpellAccess,
		hasBeastAccess,
		getBeastTabName
	} from '$lib/stores/character_store';
	import NotificationToast from '$lib/components/NotificationToast.svelte';
	import { onMount } from 'svelte';
	import { initializeSpellCleanup } from '$lib/stores/spell_cleanup';
	import { initializeEquipmentCleanup } from '$lib/stores/equipment_cleanup';
	import { debugConflicts } from '$lib/debug/conflict_debug';

	// Initialize spell cleanup service when app loads
	// This ensures spells are cleaned up when class/race/subclass changes,
	// even if the user never visits the spells page again
	initializeSpellCleanup();

	// Initialize equipment cleanup service when app loads
	// This ensures equipment selections are cleared when proficiencies are lost,
	// preventing invalid equipment selections
	initializeEquipmentCleanup();

	const baseNavItems = [
		{ name: 'Class', href: base + '/class', id: 'class' },
		{ name: 'Species', href: base + '/species', id: 'species' },
		{ name: 'Abilities', href: base + '/abilities', id: 'abilities' },
		{ name: 'Background', href: base + '/background', id: 'background' },
		{ name: 'Equipment', href: base + '/equipment', id: 'equipment' },
		{ name: 'Export', href: base + '/export', id: 'export' }
	];

	// Quiz tabs (hidden by default, revealed when visiting)
	const quizTabs = [
		{ name: 'Class Quiz', href: base + '/class-quiz', id: 'class-quiz' },
		{ name: 'Species Quiz', href: base + '/species-quiz', id: 'species-quiz' }
	];

	// Declare navItems variable
	let navItems = baseNavItems;

	// Build navigation items dynamically based on character's abilities
	$: {
		const items = [];

		// Check if we're on quiz pages
		const currentPath = $page.url.pathname;
		const isOnClassQuiz = currentPath.includes('/class-quiz');
		const isOnSpeciesQuiz = currentPath.includes('/species-quiz');

		// Add Class tab
		items.push(baseNavItems[0]); // Class
		
		// Add Class Quiz tab if on class quiz page
		if (isOnClassQuiz) {
			items.push(quizTabs[0]); // Class Quiz
		}

		// Add Species tab
		items.push(baseNavItems[1]); // Species
		
		// Add Species Quiz tab if on species quiz page
		if (isOnSpeciesQuiz) {
			items.push(quizTabs[1]); // Species Quiz
		}

		// Add remaining base tabs (Abilities, Background, Equipment)
		items.push(baseNavItems[2]); // Abilities
		items.push(baseNavItems[3]); // Background
		items.push(baseNavItems[4]); // Equipment

		// Add Beasts/Familiars tab if character has access
		if (hasBeastAccess($character_store)) {
			items.push({
				name: getBeastTabName($character_store),
				href: base + '/beasts',
				id: 'beasts'
			});
		}

		// Add Spells tab if character has spell access
		if (hasSpellAccess($character_store)) {
			items.push({ name: 'Spells', href: base + '/spells', id: 'spells' });
		}

		// Always add Export at the end
		items.push(baseNavItems[5]); // Export

		navItems = items;
	}

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
				<a 
					href={item.href} 
					class:has-conflict={hasConflict(item.id)}
					aria-current={$page.url.pathname === item.href ? 'page' : undefined}
				>
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
		background-color: var(--color-primary-dark); /* dark blue-gray background */
		padding: var(--spacing-4) var(--spacing-8);
		box-shadow: var(--shadow-md);
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
		gap: var(--spacing-6);
		justify-content: center;
	}

	nav li {
	}

	nav a {
		color: white;
		text-decoration: none;
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-base);
		padding: var(--spacing-2) var(--spacing-3);
		border-radius: var(--radius-sm);
		transition: background-color var(--transition-slow);
	}

	nav a:hover {
		background-color: var(--color-primary-blue); /* bright blue on hover */
		color: white;
	}

	/* Highlight current page */
	nav a[aria-current='page'] {
		background-color: var(--color-primary-blue); /* blue for current page */
		box-shadow: var(--shadow-primary);
	}

	/* Conflict indicator styles */
	nav a.has-conflict {
		position: relative;
		background-color: var(--color-warning); /* red background for conflicts */
		animation: pulse-warning 2s infinite;
	}

	nav a.has-conflict:hover {
		background-color: var(--color-warning-light); /* darker red on hover */
	}

	.conflict-indicator {
		margin-left: var(--spacing-2);
		font-size: var(--font-size-sm);
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
