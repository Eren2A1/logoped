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
        container.innerHTML = '<p style="text-align: center; color: #555;">Пока новостей нет.</p>';
    }
}

// === РЕНДЕР РАСПИСАНИЯ ===
function renderCalendar() {
    const container = document.querySelector('.calendar-container');
    if (!container) return;
    container.innerHTML = events.map(event => `
        <div class="event">
            <h3>${event.title}</h3>
            <p><strong>Дата:</strong> ${event.date}</p>
            <p><strong>Место:</strong> ${event.location}</p>
            <button onclick="alert('Запись через WhatsApp!')">Записаться</button>
        </div>
    `).join('');
    if (events.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #555;">Событий нет.</p>';
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

// === АДМИНКА: ПАРОЛЬ ===
const ADMIN_PASSWORD = 'mysecret'; // ← СМЕНИ НА СВОЙ!
let passwordAttempts = 0;

function showPasswordModal() {
    const modal = document.getElementById('password-modal');
    if (modal) {
        modal.style.display = 'flex'; // Используем style.display
        document.getElementById('admin-password-input')?.focus();
    }
}

function checkAdminPassword() {
    const input = document.getElementById('admin-password-input').value;
    const error = document.getElementById('password-error');
    const modal = document.getElementById('password-modal');

    if (input === ADMIN_PASSWORD) {
        modal.style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        renderAdminContent();
        passwordAttempts = 0;
    } else {
        passwordAttempts++;
        error.textContent = `Неверно! Попытка ${passwordAttempts}/3`;
        if (passwordAttempts >= 3) {
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        }
    }
}

// Enter в поле
document.getElementById('admin-password-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAdminPassword();
});

// === ДОБАВЛЕНИЕ КОНТЕНТА ===
function addContent() {
    const title = document.getElementById('admin-title')?.value.trim();
    const desc = document.getElementById('admin-desc')?.value.trim();
    const type = document.getElementById('admin-type')?.value;

    if (!title || !desc) return alert('Заполни поля!');

    if (type === 'news') {
        news.push({ title, desc });
        localStorage.setItem('news', JSON.stringify(news));
    } else if (type === 'event') {
        events.push({ title, date: desc, location: 'Онлайн', link: '#' });
        localStorage.setItem('events', JSON.stringify(events));
    }

    document.getElementById('admin-title').value = '';
    document.getElementById('admin-desc').value = '';
    renderAdminContent();
    renderNews();
    renderCalendar();
}

// === РЕНДЕР АДМИНКИ ===
function renderAdminContent() {
    const newsList = document.getElementById('admin-news-list');
    if (newsList) {
        newsList.innerHTML = news.length === 0 ? '<p>Новостей нет</p>' : news.map((item, i) => `
            <div class="admin-item">
                <div class="admin-item-text">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
                <button class="admin-delete" onclick="deleteNews(${i})">Удалить</button>
            </div>
        `).join('');
    }

    const eventsList = document.getElementById('admin-events-list');
    if (eventsList) {
        eventsList.innerHTML = events.length === 0 ? '<p>Событий нет</p>' : events.map((item, i) => `
            <div class="admin-item">
                <div class="admin-item-text">
                    <h4>${item.title}</h4>
                    <p>${item.date} | ${item.location}</p>
                </div>
                <button class="admin-delete" onclick="deleteEvent(${i})">Удалить</button>
            </div>
        `).join('');
    }
}

function deleteNews(i) {
    if (confirm('Удалить?')) {
        news.splice(i, 1);
        localStorage.setItem('news', JSON.stringify(news));
        renderAdminContent();
        renderNews();
    }
}

function deleteEvent(i) {
    if (confirm('Удалить?')) {
        events.splice(i, 1);
        localStorage.setItem('events', JSON.stringify(events));
        renderAdminContent();
        renderCalendar();
    }
}

// === ЗАПУСК ===
renderNews();
renderCalendar();
checkVisibility();

// === АДМИНКА: ТОЛЬКО НА admin.html ===
if (window.location.pathname.includes('admin.html')) {
    window.addEventListener('load', () => {
        setTimeout(showPasswordModal, 100);
    });
}
