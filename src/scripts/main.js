/** sticky header */

const pageHeader = document.querySelector('.page-header');
// eslint-disable-next-line compat/compat
const observer = new IntersectionObserver(([e]) => e.target.classList.toggle('is-pinned', e.intersectionRatio < 1), {
    threshold: [1],
});
observer.observe(pageHeader);

const mainMenu = document.getElementById('main-menu');

// close menu on click on nav links
mainMenu.querySelectorAll('nav a').forEach((a) => {
    a.addEventListener('click', () => {
        mainMenu.classList.remove('open');
        mainMenu.setAttribute('aria-expanded', 'false');
    }, false);
});

/** main menu collapsible */
document.querySelectorAll('[aria-controls="main-menu"]').forEach((el) => {
    const targetId = el.getAttribute('aria-controls');
    const target = document.getElementById(targetId);

    el.addEventListener(
        'click',
        (e) => {
            e.preventDefault();
            const isOpen = target.classList.contains('open');
            if (isOpen) {
                target.classList.remove('open');
                document.querySelectorAll(`[aria-controls="${targetId}"]`).forEach((c) => {
                    c.setAttribute('aria-expanded', 'false');
                });
            } else {
                target.classList.add('open');
                document.querySelectorAll(`[aria-controls="${targetId}"]`).forEach((c) => {
                    c.setAttribute('aria-expanded', 'true');
                });
            }
            return false;
        },
        false,
    );
});
