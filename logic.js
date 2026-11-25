function filterHabits(habits, query) {
    if (!query) return habits;
    const cleanQuery = query.trim().toLowerCase();
    return habits.filter(h => h.name.toLowerCase().includes(cleanQuery));
}

module.exports = { filterHabits };