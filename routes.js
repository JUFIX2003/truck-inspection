document.addEventListener("DOMContentLoaded", function() {
    // Получаем все элементы страницы
    const editMenu = document.getElementById("editMenu");
    const editRouteButton = document.getElementById("editRouteButton");
    const closeEditorButton = document.getElementById("closeEditorButton");
    const addRouteButton = document.getElementById("addRouteButton");
    const saveRoutesButton = document.getElementById("saveRoutesButton");
    const clearRoutesButton = document.getElementById("clearRoutesButton");
    const clearAllButton = document.getElementById("clearAllButton");
    const routesTableBody = document.querySelector("#routesTable tbody");
    const routesContainer = document.getElementById("routesContainer");
    const routeShiftInput = document.getElementById("routeShift");
    const submenu = document.getElementById("submenu");
    const closeSubmenuButton = document.getElementById("closeSubmenuButton");
    const taskInput = document.getElementById("taskInput");
    const routeDateInput = document.getElementById("routeDate");

    // ✅ Устанавливаем текущую дату, если она не выбрана
    
    const today = new Date().toISOString().split("T")[0];
    if (!routeDateInput.value) {
        routeDateInput.value = today;
        
    }

    // ✅ Открытие редактора маршрутов
    if (editRouteButton) {
        editRouteButton.addEventListener("click", function() {
            editMenu.style.display = "flex";
        });
    }

    // ✅ Закрытие редактора маршрутов
    if (closeEditorButton) {
        closeEditorButton.addEventListener("click", function() {
            editMenu.style.display = "none";
        });
    }

    // ✅ Добавление новой строки маршрута в редактор
    if (addRouteButton) {
        addRouteButton.addEventListener("click", function() {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>
                    <select class="driverSelect">
                        <option value="driver1">יוסי</option>
                        <option value="driver2">משה</option>
                        <option value="driver3">דוד</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="routeInput" placeholder="הזן מסלול">
                </td>
                <td>
                    <button class="openSubmenuButton">משימות נוספות</button>
                </td>
                <td>
                    <select class="truckSelect">
                        <option value="truck1">MAN 2021</option>
                        <option value="truck2">VOLVO FH</option>
                        <option value="truck3">SCANIA</option>
                    </select>
                </td>
            `;
            routesTableBody.appendChild(newRow);
        });
    }

    // ✅ Очистка всех маршрутов в редакторе
    if (clearRoutesButton) {
        clearRoutesButton.addEventListener("click", function() {
            routesTableBody.innerHTML = "";
        });
    }

    // ✅ Очистка всех таблиц на главной странице
    if (clearAllButton) {
        clearAllButton.addEventListener("click", function() {
            routesContainer.innerHTML = "";
        });
    }

    // ✅ Открытие подменю при нажатии на "משימות נוספות"
    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("openSubmenuButton")) {
            submenu.style.display = "block";
        }
    });

    // ✅ Закрытие подменю
    if (closeSubmenuButton) {
        closeSubmenuButton.addEventListener("click", function() {
            submenu.style.display = "none";
        });
    }

    // ✅ Сохранение маршрутов в таблицы по сменам
    if (saveRoutesButton) {
        saveRoutesButton.addEventListener("click", function() {
            const shiftText = routeShiftInput.options[routeShiftInput.selectedIndex].text;
            let routeDate = routeDateInput.value || today; // Фикс даты

            // Проверяем, есть ли уже таблица для этой смены
            let shiftTable = document.querySelector(`#table-${routeShiftInput.value}`);
            if (!shiftTable) {
                // Создаем новую таблицу для смены
                shiftTable = document.createElement("table");
                shiftTable.id = `table-${routeShiftInput.value}`;
                shiftTable.innerHTML = `
                    <thead>
                        <tr>
                            <th colspan="5">${shiftText}</th>
                        </tr>
                        <tr>
                            <th>תאריך</th> <!-- Дата -->
                            <th>נהג</th> <!-- Водитель -->
                            <th>מסלול</th> <!-- Маршрут -->
                            <th>משימות נוספות</th> <!-- Задачи -->
                            <th>רכב</th> <!-- Грузовик -->
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                routesContainer.appendChild(shiftTable);
            }

            // Добавляем маршруты в соответствующую таблицу
            const shiftTableBody = shiftTable.querySelector("tbody");

            document.querySelectorAll("#routesTable tbody tr").forEach(row => {
                const driver = row.querySelector(".driverSelect").value;
                const route = row.querySelector(".routeInput").value;
                const truck = row.querySelector(".truckSelect").value;
                const tasks = taskInput.value;

                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${routeDate}</td>
                    <td>${driver}</td>
                    <td>${route}</td>
                    <td>${tasks}</td>
                    <td>${truck}</td>
                `;
                shiftTableBody.appendChild(newRow);
            });

            // ✅ Закрываем редактор и очищаем маршруты
            editMenu.style.display = "none";
            routesTableBody.innerHTML = "";
            taskInput.value = "";

            alert("המסלולים נשמרו בהצלחה!");
        });
    }
});
