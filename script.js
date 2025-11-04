// === ДАННЫЕ ===
let events = JSON.parse(localStorage.getItem('events')) || [
    { title: 'Вебинар для родителей', date: '2025-11-15', location: 'Онлайн', link: 'zoom.us/j/123' }
];
let news = JSON.parse(localStorage.getItem('news')) || [];

// === ПАРОЛЬ ДЛЯ АДМИНКИ ===
const ADMIN_PASSWORD = 'mysecret'; // ← СМЕНИ НА СВОЙ ПАРОЛЬ!
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

// Показать модалку при загрузке админки
if (document.querySelector('#admin')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(showPasswordModal, 100);
    });
}

// === ПЛАВНЫЙ СКРОЛЛ ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// === АНИМАЦИЯ ПРИ ЗАГРУЗКЕ И СКРОЛЛЕ ===
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

// Шапка при скролле
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// === ФОРМЫ (Formspree) ===
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            try {
                await fetch(form.action || 'https://formspree.io/f/YOUR_ID', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                alert('Отправлено! Спасибо!');
                form.reset();
            } catch (error) {
                alert('Ошибка, попробуй ещё раз или напиши в WhatsApp.');
            }
        });
    });
});

// === РЕНДЕР КАЛЕНДАРЯ ===
function renderCalendar(isAdmin = false) {
    const container = document.querySelector('.calendar-container');
    if (!container) return;
    container.innerHTML = events.map((event, index) => `
        <div class="event">
            <h3>${event.title}</h3>
            <p>Дата: ${event.date}</p>
            <p>Место: ${event.location || 'Не указано'}</p>
            <a href="${event.link || '#'}" target="_blank">Ссылка</a>
            ${isAdmin ? `<button onclick="deleteEvent(${index})" style="margin-top:10px;background:red;color:white;border:none;padding:10px;border-radius:10px;cursor:pointer;">Удалить</button>` : `<button onclick="bookEvent('${event.title}')">Записаться</button>`}
        </div>
    `).join('');
    if (events.length === 0) container.innerHTML = '<p>Пока событий нет.</p>';
}

// Удаление события
function deleteEvent(index) {
    if (confirm('Удалить это событие?')) {
        events.splice(index, 1);
        localStorage.setItem('events', JSON.stringify(events));
        renderCalendar(true);
    }
}

// Запись на событие
function bookEvent(title) {
    const name = prompt('Твоё имя:');
    const email = prompt('Email:');
    if (name && email) {
        alert(`Запись на "${title}" отправлена! Подтверждение на ${email}`);
    }
}

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

// === АДМИНКА: ДОБАВЛЕНИЕ ===
function toggleAdmin() {
    const form = document.querySelector('.admin-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addContent(type) {
    const title = document.getElementById('admin-title').value.trim();
    const desc = document.getElementById('admin-desc').value.trim();
    if (!title || !desc) {
        alert('Заполни все поля!');
        return;
    }

    if (type === 'event') {
        events.push({ title, date: desc, location: 'Уточнить', link: '#' });
        localStorage.setItem('events', JSON.stringify(events));
        renderCalendar(true);
    } else if (type === 'news') {
        news.push({ title, desc });
        localStorage.setItem('news', JSON.stringify(news));
        renderNews();
    } else if (type === 'photo') {
        alert('Фото добавь вручную в папку img/ и обнови галерею.');
    }

    alert('Добавлено!');
    document.querySelector('.admin-form').reset();
    toggleAdmin();
}

// === ЛАЙТБОКС ===
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightbox && lightboxImg) {
            lightboxImg.src = imgSrc;
            lightbox.classList.add('active');
        }
    });
});

document.querySelector('.close-lightbox')?.addEventListener('click', () => {
    document.getElementById('lightbox')?.classList.remove('active');
});

// === WhatsApp ===
document.querySelector('.whatsapp-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://wa.me/77771234567?text=Привет! Хочу записаться на семинар.');
});

// === ВЫЗОВЫ ПРИ ЗАГРУЗКЕ ===
renderCalendar();
renderNews();

if (document.querySelector('#admin')) renderCalendar(true);
// === БУРГЕР-МЕНЮ ===
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const burger = document.querySelector('.burger');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (!mobileMenu || !burger) return;

    // Создаём overlay, если его нет
    if (!overlay) {
        const newOverlay = document.createElement('div');
        newOverlay.id = 'mobile-menu-overlay';
        newOverlay.onclick = toggleMobileMenu;
        document.body.appendChild(newOverlay);
    }

    const isActive = mobileMenu.classList.toggle('active');
    burger.classList.toggle('active', isActive);
    document.getElementById('mobile-menu-overlay').classList.toggle('active', isActive);

    // Блокируем скролл страницы
    document.body.style.overflow = isActive ? 'hidden' : '';
}

// Закрытие при клике вне меню
document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobile-menu');
    const burger = document.querySelector('.burger');
    if (mobileMenu && mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && !burger.contains(e.target)) {
        toggleMobileMenu();
    }
});
