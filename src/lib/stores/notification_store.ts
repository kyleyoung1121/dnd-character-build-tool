import { writable } from 'svelte/store';

export interface Notification {
	id: string;
	type: 'error' | 'warning' | 'info' | 'success';
	title: string;
	message: string;
	duration?: number; // ms, undefined means manual dismiss
	timestamp: number;
}

export const notifications = writable<Notification[]>([]);

let notificationId = 0;

/**
 * Add a notification to the store
 */
export function addNotification(
	type: Notification['type'],
	title: string,
	message: string,
	duration: number = 5000
): string {
	const id = `notification-${++notificationId}`;
	const notification: Notification = {
		id,
		type,
		title,
		message,
		duration,
		timestamp: Date.now()
	};

	notifications.update((n) => [...n, notification]);

	// Auto-remove after duration
	if (duration > 0) {
		setTimeout(() => {
			removeNotification(id);
		}, duration);
	}

	return id;
}

/**
 * Remove a notification by id
 */
export function removeNotification(id: string) {
	notifications.update((n) => n.filter((notification) => notification.id !== id));
}

/**
 * Clear all notifications
 */
export function clearNotifications() {
	notifications.update(() => []);
}

/**
 * Add a spell limit violation notification
 */
export function notifySpellLimitViolation(
	violations: import('./conflict_detection').SpellLimitViolation[],
	cause?: string
) {
	const violationText = violations
		.map((v) => {
			const levelName =
				v.level === 'cantrips'
					? 'cantrips'
					: v.level === 'leveled'
						? 'leveled spells'
						: `level ${v.level.replace('level', '')} spells`;
			return `${v.selected}/${v.limit} ${levelName} (${v.excess} over limit)`;
		})
		.join(', ');

	let message = `You have exceeded your spell limits: ${violationText}.`;
	if (cause) {
		message += ` This was caused by: ${cause}.`;
	}
	message += ' Please go to the Spells tab to deselect excess spells.';

	addNotification('error', 'Spell Limits Exceeded', message, 8000);
}
