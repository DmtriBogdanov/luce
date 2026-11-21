/* Сборка bin/build-dist.php из assets/js/main.js. Не править руками. */

/* assets/js/modules/notify.js */
const __module0 = (() => {
/**
 * Уведомления: единственный способ показать пользователю всплывающее сообщение.
 * Использование в других модулях: import { notify } from './notify.js'; notify('Готово', 'success');
 * Типы: info, success, error. alert/confirm/prompt не используются (docs/specs/js.md).
 */

const NOTIFY_TIMEOUT = 4000;
const CONTAINER_ID = 'notify-container';

function initNotify() {
	getOrCreateContainer();
}

function notify(message, type = 'info') {
	const container = getOrCreateContainer();
	const toast = createToast(message, type);
	container.appendChild(toast);

	setTimeout(() => toast.remove(), NOTIFY_TIMEOUT);
}

function getOrCreateContainer() {
	let container = document.getElementById(CONTAINER_ID);
	if (!container) {
		container = document.createElement('div');
		container.id = CONTAINER_ID;
		container.className = 'notify-container';
		container.setAttribute('aria-live', 'polite');
		container.setAttribute('aria-atomic', 'false');
		document.body.appendChild(container);
	}
	return container;
}

function createToast(message, type) {
	const toast = document.createElement('div');
	toast.className = `notify notify--${type}`;
	toast.textContent = message;
	toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
	return toast;
}
return { initNotify, notify };
})();

/* assets/js/modules/mobile-menu.js */
const __module1 = (() => {
/** Единая навигация: CSS меняет раскладку, JS управляет мобильным раскрытием. */
function initMobileMenu() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const panel = document.querySelector('[data-mobile-menu]');
    const close = panel?.querySelector('[data-menu-close]');
    if (!toggle || !panel || !close) return;

    const mobile = window.matchMedia('(max-width: 639px)');
    const header = toggle.closest('header');
    let isOpen = false;
    let background = [];
    panel.classList.add('is-enhanced');

    function closeMenu(destination = null) {
        if (!isOpen) return;
        isOpen = false;
        panel.hidden = mobile.matches;
        panel.removeAttribute('role');
        panel.removeAttribute('aria-modal');
        panel.removeAttribute('aria-label');
        document.body.classList.remove('is-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        background.forEach(({ element, inert }) => { element.inert = inert; });
        background = [];
        if (destination) {
            destination.setAttribute('tabindex', '-1');
            destination.focus({ preventScroll: true });
        } else {
            const target = mobile.matches ? toggle : panel.querySelector('a');
            target.focus({ preventScroll: true });
        }
    }

    function syncViewport() {
        closeMenu();
        toggle.hidden = !mobile.matches;
        close.hidden = !mobile.matches;
        panel.hidden = mobile.matches;
    }

    toggle.addEventListener('click', () => {
        if (!mobile.matches) return;
        if (isOpen) {
            closeMenu();
            return;
        }
        isOpen = true;
        panel.hidden = false;
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-label', 'Навигация Luce');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('is-menu-open');
        const outside = [
            ...Array.from(document.body.children).filter((element) => element !== header),
            ...Array.from(panel.parentElement.children).filter((element) => element !== panel),
        ];
        background = outside.map((element) => ({ element, inert: element.inert }));
        background.forEach(({ element }) => { element.inert = true; });
        close.focus({ preventScroll: true });
    });

    close.addEventListener('click', () => closeMenu());
    panel.addEventListener('keydown', (event) => {
        if (!isOpen) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
            return;
        }
        if (event.key !== 'Tab') return;
        const controls = panel.querySelectorAll('a[href], button:not([hidden])');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
    panel.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (isOpen && link) closeMenu(document.getElementById(link.hash.slice(1)));
    });
    mobile.addEventListener('change', syncViewport);
    syncViewport();
}
return { initMobileMenu };
})();

/* assets/js/main.js */
(() => {
const { initNotify } = __module0;
const { initMobileMenu } = __module1;

document.addEventListener('DOMContentLoaded', () => {
	initNotify();
	initMobileMenu();
});
})();
