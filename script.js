// === ДАННЫЕ ===
let events = JSON.parse(localStorage.getItem('events')) || [
    { title: 'Вебинар для родителей', date: '2025-11-15', location: 'Онлайн', link: 'zoom.us/j/123' }
];
let news = JSON.parse(localStorage.getItem('news')) || [];

// === БУРГЕР-МЕНЮ ===
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const burger = document.querySelector('.burger');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (!mobileMenu || !burger) return;

    const isActive = mobileMenu.classList.contains('active');

    if (isActive) {
        mobileMenu.classList.remove('active');
        burger.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        mobileMenu.classList.add('active');
        burger.classList.add('active');
        if (!overlay) {
            const newOverlay = document.createElement('div');
            newOverlay.id = 'mobile-menu-overlay';
            newOverlay.onclick = toggleMobileMenu;
            document.body.appendChild(newOverlay);
        } else {
            overlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }
}

// Автозакрытие при клике по ссылке
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(toggleMobileMenu, 100);
    });
});

// Закрытие при клике вне
document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobile-menu');
    const burger = document.querySelector('.burger');
    if (mobileMenu && mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && !burger.contains(e.target)) {
        toggleMobileMenu();
    }
});

// === АНИМАЦИЯ ПРИ СКРОЛЛЕ ===
function checkVisibility() {
    document.querySelectorAll('section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            section.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);

// === РЕНДЕР НОВОСТЕЙ ===
function renderNews() {
    const container = document.querySelector('.news-container');
    if (!container) return;
    container.innerHTML = news.map(item => `
        <div class="news-item">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
        </div>
    `).join('');
    if (news.length === 0) {
        container.innerHTML = '<p>Пока новостей нет.</p>';
    }
}

// === ШАПКА ПРИ СКРОЛЛЕ ===
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// === ЗАПУСК ===
renderNews();
checkVisibility();
