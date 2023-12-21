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
    a.addEventListener(
        'click',
        () => {
            mainMenu.classList.remove('open');
            mainMenu.setAttribute('aria-expanded', 'false');
        },
        false,
    );
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

// history slider on homepage
document.querySelectorAll('.cards').forEach((cards) => {
    cards.querySelectorAll('.card').forEach((card) => {
        card.addEventListener(
            'click',
            (e) => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                    const current = cards.querySelector('[aria-current="true"]');
                    const items = cards.querySelectorAll('.card');
                    const index = Array.prototype.indexOf.call(items, e.currentTarget);
                    const previousItems = Array.prototype.slice.call(items, 0, index);
                    current.removeAttribute('aria-current');
                    e.currentTarget.setAttribute('aria-current', true);

                    previousItems.forEach((item, i) => {
                        item.style.animation = `card-exit-${i} 600ms forwards linear`;
                        setTimeout(() => {
                            item.style.top = 0;
                            item.style.marginLeft = item.style.marginRight = 0;
                            item.style.animation = '';
                            cards.appendChild(item);
                            setTimeout(() => {
                                item.style.top = '';
                                item.style.marginLeft = item.style.marginRight = '';
                            }, 10);
                        }, 600 + 10);
                    });
                }
            },
            false,
        );
    });
});
