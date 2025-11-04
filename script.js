// === ДАННЫЕ ===
let events = JSON.parse(localStorage.getItem('events')) || [
    { title: 'Вебинар для родителей', date: '2025-11-15', location: 'Онлайн', link: 'zoom.us/j/123' }
];
let news = JSON.parse(localStorage.getItem('news')) || [];

// === ПАРОЛЬ ДЛЯ АДМИНКИ ===
const ADMIN_PASSWORD = 'mysecret'; // ← СМЕНИ НА СВОЙ!
let passwordAttempts = 0;

function showPasswordModal() {
    const modal = document.getElementById('password-modal');
    const input = document.getElementById('admin-password-input');
    const error = document.getElementById('password-error');
    
    if (modal && input) {
        modal.style.display = 'flex';
        input.value = '';
        input.focus();
        error.style.display = 'none';
        passwordAttempts = 0;
    }
}

function checkAdminPassword() {
    const input = document.getElementById('admin-password-input').value;
    const error = document.getElementById('password-error');
    const modal = document.getElementById('password-modal');

    if (input === ADMIN_PASSWORD) {
        modal.style.display = 'none';
        passwordAttempts = 0;
        alert('Добро пожаловать в админку!');
    } else {
        passwordAttempts++;
        error.style.display = 'block';
        error.textContent = `Неверный пароль! Попытка ${passwordAttempts} из 3`;
        if (passwordAttempts >= 3) {
            alert('Слишком много попыток. Доступ закрыт.');
            window.location.href = 'index.html';
        }
    }
}

if (document.querySelector('#admin')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(showPasswordModal, 100);
    });
}

// === БУРГЕР-МЕНЮ (ИСПРАВЛЕНО) ===
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

// Закрытие при клике вне меню
document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobile-menu');
    const burger = document.querySelector('.burger');
    if (mobileMenu && mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && !burger.contains(e.target)) {
        toggleMobileMenu();
    }
});

// === ПЛАВНЫЙ СКРОЛЛ, АНИМАЦИЯ, ФОРМЫ, РЕНДЕР, ЛАЙТБОКС, WhatsApp ===
// (остальной JS из предыдущих версий — оставь без изменений)

renderCalendar();
renderNews();
if (document.querySelector('#admin')) renderCalendar(true);
