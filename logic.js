function filterHabits(habits, query) {
    // НАМЕРЕННЫЙ ДЕФЕКТ: мы не обрезаем пробелы (trim) и не проверяем на null
    // Если ввести " спорт " (с пробелами), поиск не сработает.
    return habits.filter(h => h.name.toLowerCase().includes(query.toLowerCase()));
}

module.exports = { filterHabits };