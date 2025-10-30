<script>
	import { notifications, removeNotification } from '$lib/stores/notification_store';
	import { fly } from 'svelte/transition';

	function dismiss(notificationId) {
		removeNotification(notificationId);
	}

	function getIcon(type) {
		switch (type) {
			case 'error':
				return '❌';
			case 'warning':
				return '⚠️';
			case 'info':
				// Use warning icon for info notifications to match yellow theme
				return '⚠️';
			case 'success':
				return '✅';
			default:
				return 'ℹ️';
		}
	}

	function getColorClasses(type) {
		switch (type) {
			case 'error':
				return 'border-red-500 bg-red-50 text-red-900';
			case 'warning':
				return 'border-yellow-500 bg-yellow-50 text-yellow-900';
			case 'info':
				// Use yellow background for info notifications (matches ConflictWarning style for informational messages)
				return 'border-yellow-500 bg-yellow-50 text-yellow-900';
			case 'success':
				return 'border-green-500 bg-green-50 text-green-900';
			default:
				return 'border-gray-500 bg-gray-50 text-gray-900';
		}
	}
</script>

<div class="toast-container">
	{#each $notifications as notification (notification.id)}
		<div
			class="toast {getColorClasses(notification.type)}"
			transition:fly={{ y: -50, duration: 300 }}
		>
			<div class="toast-content">
				<div class="toast-header">
					<span class="toast-icon">{getIcon(notification.type)}</span>
					<h4 class="toast-title">{notification.title}</h4>
					<button
						class="toast-close"
						on:click={() => dismiss(notification.id)}
						aria-label="Close notification"
					>
						×
					</button>
				</div>
				<p class="toast-message">{notification.message}</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		top: 80px; /* Below the navigation */
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		max-width: 50vw; /* Match ConflictWarning width */
		pointer-events: none; /* Allow clicks through container */
		padding: 0 1rem;
		box-sizing: border-box;
	}

	.toast {
		pointer-events: auto; /* But allow clicks on toasts themselves */
		border: 2px solid;
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(10px);
		max-width: 100%;
	}

	.toast-content {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.toast-header {
		display: flex;
		align-items: flex-start;
		gap: 8px;
	}

	.toast-icon {
		font-size: 20px;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.toast-title {
		font-weight: 600;
		font-size: 16px;
		margin: 0;
		flex-grow: 1;
		line-height: 1.3;
	}

	.toast-close {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		flex-shrink: 0;
		line-height: 1;
		opacity: 0.6;
		transition: opacity 0.2s ease;
	}

	.toast-close:hover {
		opacity: 1;
	}

	.toast-message {
		margin: 0;
		font-size: 14px;
		line-height: 1.4;
		margin-left: 28px; /* Align with title, accounting for icon */
	}

	/* Color-specific close button styles */
	.border-red-500 .toast-close {
		color: #dc2626;
	}

	.border-yellow-500 .toast-close {
		color: #d97706;
	}

	.border-blue-500 .toast-close {
		color: #2563eb;
	}

	.border-green-500 .toast-close {
		color: #16a34a;
	}

	.border-gray-500 .toast-close {
		color: #6b7280;
	}

	.toast-close:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>
