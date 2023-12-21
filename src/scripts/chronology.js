const { anime, barba } = window;

function slide(targets, step, direction) {
    const duration = 1000;
    const from = step === 'leave' ? 0 : 100;
    const to = step === 'leave' ? 100 : 0;

    targets.style.transform = direction === 'next' ? `translateX(${from}%)` : `translateX(-${from}%)`;

    const translateX = direction === 'next' ? `-${to}%` : `${to}%`;
    const opacity = step === 'leave' ? 0 : 1;
    const staggerX = window.innerWidth * 0.1;
    const anim = anime.timeline({
        easing: 'easeInOutQuart',
        duration,
    });

    anim.add({
        targets,
        translateX,
        opacity,
    });

    if (step === 'enter') {
        anim.add(
            {
                targets: targets.querySelectorAll('.period > *'),
                translateX: direction === 'next' ? [staggerX, 0] : [-staggerX, 0],
                duration: duration * 0.6,
                easing: 'easeOutQuart',
                delay: anime.stagger(100),
            },
            '-=500',
        );
    }

    return anim.finished;
}

const timeline = document.querySelector('.timeline');

// Tell Barba to go to a specific URL and play your transitions
// https://barba.js.org/docs/advanced/utils/
function goto(e) {
    e.preventDefault();

    const target = e.currentTarget;
    const href = barba.url.parse(target.href).path;
    barba.go(href, target, e);

    return false;
}

// callback function to update the timeline's position
function updateView({ trigger }) {
    const href = barba.url.parse(trigger.href).path;
    const currentLink = timeline.querySelector(`a[href="${href}"]`);
    const category = href.match(/[^/]+/gi)[0];

    timeline.querySelectorAll('ol').forEach((ol) => {
        if (ol.classList.contains(category)) {
            ol.classList.add('active');
        } else {
            ol.classList.remove('active');
        }
    });

    document.querySelectorAll('.periods a').forEach((a) => {
        if (a.classList.contains(category)) {
            a.setAttribute('aria-current', 'page');
        } else {
            a.removeAttribute('aria-current');
        }
    });

    timeline.querySelectorAll('a').forEach((el) => {
        // update aria-current attribute
        if (el === currentLink) {
            el.setAttribute('aria-current', 'page');
        } else {
            el.removeAttribute('aria-current');
        }

        // update data attribute `direction` used by Barba transitions
        const position = currentLink && currentLink.compareDocumentPosition(el);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            el.setAttribute('data-direction', 'next');
        } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            el.setAttribute('data-direction', 'prev');
        } else {
            el.removeAttribute('data-direction', 'prev');
        }

        // update click event listener
        el.removeEventListener('click', goto, false);
        el.addEventListener('click', goto, false);
    });
}

// scroll to details when opening
function attachDetailsEventListener({ next }) {
    const toggleBtn = next.container.querySelector('#toggle_details');
    if (!toggleBtn) {
        return;
    }
    toggleBtn.addEventListener(
        'click',
        (event) => {
            event.preventDefault();

            const details = next.container.querySelector('#details');
            const isOpen = details.classList.contains('open');

            if (isOpen) {
                hideDetails(details);
            } else {
                details.classList.add('open');
                setTimeout(() => {
                    details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 10);
            }

            event.currentTarget.setAttribute('aria-expanded', !isOpen);

            return false;
        },
        false,
    );
}

function hideDetails(details) {
    window.scrollTo({ top: 50, behavior: 'smooth' });
    setTimeout(() => {
        (details || document.querySelector('#details')).classList.remove('open');
    }, 200);
}

barba.init({
    debug: true,
    prevent: ({ href }) => {
        // prevent transition to root url
        return ['/', '/about'].includes(barba.url.parse(href).path);
    },
    transitions: [
        {
            name: 'next',
            sync: true,
            custom: ({ trigger }) => trigger.dataset && trigger.dataset.direction === 'next',
            leave: ({ current }) => slide(current.container, 'leave', 'next'),
            enter: ({ next }) => slide(next.container, 'enter', 'next'),
        },
        {
            name: 'previous',
            sync: true,
            custom: ({ trigger }) => trigger.dataset && trigger.dataset.direction === 'prev',
            leave: ({ current }) => slide(current.container, 'leave', 'prev'),
            enter: ({ next }) => slide(next.container, 'enter', 'prev'),
        },
    ],
});

barba.hooks.before(function () {
    barba.wrapper.classList.add('is-animating');
    hideDetails();
});

barba.hooks.after(function () {
    barba.wrapper.classList.remove('is-animating');
});

barba.hooks.beforeEnter((data) => {
    updateView(data);
    attachDetailsEventListener(data);
});

// initialize
document.addEventListener('DOMContentLoaded', function () {
    updateView({ trigger: timeline.querySelector('a[aria-current="page"]') });
    attachDetailsEventListener({ next: { container: document.body } });
});
