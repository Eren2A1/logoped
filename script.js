// === АДМИНКА: ПАРОЛЬ И ОТОБРАЖЕНИЕ ===
const ADMIN_PASSWORD = 'mysecret'; // ← СМЕНИ!
let passwordAttempts = 0;

function showPasswordModal() {
    document.getElementById('password-modal').style.display = 'flex';
    document.getElementById('admin-password-input').focus();
}

function checkAdminPassword() {
    const input = document.getElementById('admin-password-input').value;
    const error = document.getElementById('password-error');

    if (input === ADMIN_PASSWORD) {
        document.getElementById('password-modal').style.display = 'none';
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

// Enter в поле пароля
document.getElementById('admin-password-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAdminPassword();
});

// === ДОБАВЛЕНИЕ КОНТЕНТА ===
function addContent() {
    const title = document.getElementById('admin-title').value.trim();
    const desc = document.getElementById('admin-desc').value.trim();
    const type = document.getElementById('admin-type').value;

    if (!title || !desc) return alert('Заполни поля!');

    if (type === 'news') {
        news.push({ title, desc });
        localStorage.setItem('news', JSON.stringify(news));
    } else if (type === 'event') {
        events.push({ title, date: desc, location: 'Онлайн', link: '#' });
        localStorage.setItem('events', JSON.stringify(events));
    } else if (type === 'photo') {
        // Просто напоминание: фото кидай в img/
        alert(`Фото "${desc}" добавь в папку img/ и обнови галерею!`);
    }

    document.getElementById('admin-title').value = '';
    document.getElementById('admin-desc').value = '';
    renderAdminContent();
    renderNews();
    renderCalendar();
}

// === РЕНДЕР АДМИНКИ ===
function renderAdminContent() {
    // Новости
    const newsList = document.getElementById('admin-news-list');
    if (newsList) {
        newsList.innerHTML = news.map((item, i) => `
            <div class="admin-item">
                <div class="admin-item-text">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
                <button class="admin-delete" onclick="deleteNews(${i})">Удалить</button>
            </div>
        `).join('');
    }

    // События
    const eventsList = document.getElementById('admin-events-list');
    if (eventsList) {
        eventsList.innerHTML = events.map((item, i) => `
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
    if (confirm('Удалить новость?')) {
        news.splice(i, 1);
        localStorage.setItem('news', JSON.stringify(news));
        renderAdminContent();
        renderNews();
    }
}

function deleteEvent(i) {
    if (confirm('Удалить событие?')) {
        events.splice(i, 1);
        localStorage.setItem('events', JSON.stringify(events));
        renderAdminContent();
        renderCalendar();
    }
}

// === ЗАПУСК АДМИНКИ ===
if (window.location.pathname.includes('admin.html')) {
    window.addEventListener('load', showPasswordModal);
}
