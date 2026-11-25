const test = require('node:test');
const assert = require('node:assert');
const { filterHabits } = require('./logic.js');

const mockHabits = [{ name: 'Спорт' }, { name: 'Чтение' }];

test('Основной случай: обычный поиск', () => {
    const result = filterHabits(mockHabits, 'спорт');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].name, 'Спорт');
});

test('Граничный случай: пустой запрос', () => {
    const result = filterHabits(mockHabits, '');
    assert.strictEqual(result.length, 2); // Должен вернуть все привычки
});

test('Ошибочный случай: запрос с пробелами по краям', () => {
    // Из-за дефекта в logic.js этот тест упадет
    const result = filterHabits(mockHabits, ' спорт ');
    assert.strictEqual(result.length, 1); 
    assert.strictEqual(result[0].name, 'Спорт');
});