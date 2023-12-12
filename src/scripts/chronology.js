const { anime, barba } = window;

barba.hooks.before(function () {
    barba.wrapper.classList.add('is-animating');
});

barba.hooks.after(function () {
    barba.wrapper.classList.remove('is-animating');
});

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

// callback function to update the timeline's position
function updateTimeline({ trigger }) {
    const href = barba.url.parse(trigger.href).path;
    timeline.querySelectorAll('a').forEach((el) => el.removeAttribute('aria-current'));
    const target = timeline.querySelector(`a[href="${href}"]`);
    if (target) {
        target.setAttribute('aria-current', 'page');
    }
}

barba.init({
    debug: false,
    transitions: [
        {
            name: 'next',
            sync: true,
            custom: ({ trigger }) => trigger.dataset && trigger.dataset.direction === 'next',
            leave: ({ current }) => slide(current.container, 'leave', 'next'),
            enter: ({ next }) => slide(next.container, 'enter', 'next'),
            beforeEnter: updateTimeline,
        },
        {
            name: 'previous',
            sync: true,
            custom: ({ trigger }) => trigger.dataset && trigger.dataset.direction === 'prev',
            leave: ({ current }) => slide(current.container, 'leave', 'prev'),
            enter: ({ next }) => slide(next.container, 'enter', 'prev'),
            beforeEnter: updateTimeline,
        },
    ],
});

// make timeline's link triggering navigation transition
timeline.querySelectorAll('a').forEach((el) => {
    el.addEventListener(
        'click',
        (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const currentHref = barba.url.parse(barba.history.current.url).path;

            // get target position compare to current and update target data attribute `direction` used by Barba transitions
            const currentPosition = timeline.querySelector(`a[href="${currentHref}"]`);
            if (currentPosition && currentPosition.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) {
                target.setAttribute('data-direction', 'next');
            } else {
                target.setAttribute('data-direction', 'prev');
            }

            // trigger navigation
            // https://barba.js.org/docs/advanced/utils/
            barba.go(target.href, target, e);

            return false;
        },
        false,
    );
});

// scroll to details when opening
const details = document.getElementById('details');
document.getElementById('toggle_details').addEventListener(
    'click',
    (e) => {
        // add delay in the event stack to ensure composent is displayed before scrolling
        setTimeout(() => {
            if (e.currentTarget.classList.contains('open')) {
                details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 10);
    },
    false,
);
