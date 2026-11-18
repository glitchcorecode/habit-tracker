document.addEventListener('DOMContentLoaded', () => {
    const habitForm = document.getElementById('habitForm');
    const habitInput = document.getElementById('habitInput');
    const habitList = document.getElementById('habitList');
    const historyList = document.getElementById('historyList');
    const currentDateEl = document.getElementById('currentDate');
    const progressBar = document.getElementById('progressBar');
    // Элемент поиска
    const searchInput = document.getElementById('searchInput');

    const todayStr = new Date().toISOString().split('T')[0];
    currentDateEl.textContent = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

    let state = JSON.parse(localStorage.getItem('habit_sys_data')) || {
        lastDate: todayStr,
        habits: [],
        history: []
    };

    if (state.lastDate !== todayStr) {
        if (state.habits.length > 0) {
            const completed = state.habits.filter(h => h.done).map(h => h.name);
            state.history.unshift({
                date: state.lastDate,
                completedCount: completed.length,
                total: state.habits.length,
                items: completed
            });
        }
        state.habits = [];
        state.lastDate = todayStr;
        saveState();
    }

    function saveState() {
        localStorage.setItem('habit_sys_data', JSON.stringify(state));
    }

    // РЕФАКТОРИНГ: Вынесли создание элемента списка в отдельную функцию
    function createHabitElement(habit) {
        const li = document.createElement('li');
        li.className = `habit-item ${habit.done ? 'done' : ''}`;
        li.onclick = (e) => {
            if(e.target.classList.contains('delete-btn')) return;
            habit.done = !habit.done;
            saveState();
            updateUI();
        };

        li.innerHTML = `
            <div class="indicator"></div>
            <span class="habit-text" ondblclick="editHabit(event, '${habit.id}')">${habit.name}</span>
            <button class="delete-btn" onclick="deleteHabit('${habit.id}')">✕</button>
        `;
        return li;
    }

    function updateUI() {
        habitList.innerHTML = '';
        
        // Логика поиска (фильтрации)
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = state.habits.filter(h => h.name.toLowerCase().includes(searchTerm));
        
        const sorted = [...filtered].sort((a, b) => a.done - b.done);
        
        sorted.forEach(habit => {
            habitList.appendChild(createHabitElement(habit));
        });

        const total = state.habits.length;
        const done = state.habits.filter(h => h.done).length;
        progressBar.style.width = total === 0 ? '0%' : `${(done / total) * 100}%`;

        historyList.innerHTML = '';
        if (state.history.length === 0) {
            historyList.innerHTML = '<div class="history-text">Архив пуст. Выполняй привычки, и завтра здесь появится отчет.</div>';
        } else {
            state.history.forEach(day => {
                const div = document.createElement('div');
                div.className = 'history-item';
                div.innerHTML = `
                    <div class="history-date">${day.date} — Выполнено ${day.completedCount} из ${day.total}</div>
                    <div class="history-text">${day.items.join(', ') || 'Нет выполненных задач'}</div>
                `;
                historyList.appendChild(div);
            });
        }
    }

    window.deleteHabit = (id) => {
        state.habits = state.habits.filter(h => h.id !== id);
        saveState();
        updateUI();
    };

    window.editHabit = (event, id) => {
        event.stopPropagation();
        const habit = state.habits.find(h => h.id === id);
        
        if (habit) {
            const newName = prompt('Редактировать привычку:', habit.name);
            if (newName !== null && newName.trim() !== '') {
                habit.name = newName.trim();
                saveState();
                updateUI();
            }
        }
    };

    habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = habitInput.value.trim();
        if (text) {
            state.habits.push({ id: Date.now().toString(), name: text, done: false });
            habitInput.value = '';
            saveState();
            updateUI();
        }
    });

    searchInput.addEventListener('input', updateUI);

    updateUI();
});