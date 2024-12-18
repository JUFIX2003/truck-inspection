// Список товаров
const products = [
    "HA-02", "HA-21", "HA-26", "פרפר קתן", "Baby",
    "Scarf big", "Scarf small", "שקיות S", "שקיות M", "שקיות L",
    "מערזי מתנה S", "מערזי מתנה M", "מערזי מתנה L", "נייר משי",
    "צלופן", "תגיות Home", "סליל קופה", "שקיות מחזור", "שרינק"
];

// Найти таблицу
const tableBody = document.querySelector("#productTable tbody");

if (!tableBody) {
    console.error("Элемент с ID 'productTable' не найден. Убедитесь, что таблица присутствует в HTML.");
} else {
    // Заполнение таблицы
    products.forEach(product => {
        const row = document.createElement("tr");

        // Добавляем название товара в первый столбец
        const nameCell = document.createElement("td");
        nameCell.textContent = product;
        row.appendChild(nameCell);

        // Добавляем 25 полей ввода
        for (let i = 0; i < 25; i++) {
            const inputCell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.min = "0";
            input.placeholder = "0";
            inputCell.appendChild(input);
            row.appendChild(inputCell);
        }

        tableBody.appendChild(row);
    });

    console.log("Таблица успешно заполнена.");
}
