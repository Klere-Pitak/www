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
function updateTimeline({ trigger }) {
    const href = barba.url.parse(trigger.href).path;
    const currentLink = timeline.querySelector(`a[href="${href}"]`);
    
    timeline.querySelectorAll('a').forEach((el) => {
        // update aria-current attribute
        if (el === currentLink) {
            el.setAttribute('aria-current', 'page');
        } else {
            el.removeAttribute('aria-current')
        }

        // update data attribute `direction` used by Barba transitions
        const position = currentLink && currentLink.compareDocumentPosition(el)
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

updateTimeline({ trigger: timeline.querySelector('a[aria-current="page"]') })

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

// scroll to details when opening
document.getElementById('toggle_details').addEventListener(
    'click',
    () => {
        // add delay in the event stack to ensure composent is displayed before scrolling
        setTimeout(() => {
            const details = document.getElementById('details');
            if (details.classList.contains('open')) {
                details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 10);
    },
    false,
);
