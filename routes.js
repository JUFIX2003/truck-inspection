// ✅ Импорт Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// ✅ Подключение Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBqpApGpmHOirvr51aOZ5wXEm8fT4XuE9A",
    authDomain: "myapp-93bf6.firebaseapp.com",
    databaseURL: "https://myapp-93bf6-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "myapp-93bf6",
    storageBucket: "myapp-93bf6.firebasestorage.app",
    messagingSenderId: "150397918393",
    appId: "1:150397918393:web:2d109048247d86530d0f68",
    measurementId: "G-JDB7BEWHBT"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
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

    // ✅ Устанавливаем текущую дату
    const today = new Date().toISOString().split("T")[0];
    if (!routeDateInput.value) {
        routeDateInput.value = today;
    }

    // ✅ Открытие редактора маршрутов
    editRouteButton.addEventListener("click", function () {
        editMenu.style.display = "flex";
    });

    // ✅ Закрытие редактора маршрутов
    closeEditorButton.addEventListener("click", function () {
        editMenu.style.display = "none";
    });

    // ✅ Добавление новой строки маршрута в редактор
    addRouteButton.addEventListener("click", function () {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><select class="driverSelect">
                <option value="יוסי">יוסי</option>
                <option value="משה">משה</option>
                <option value="דוד">דוד</option>
            </select></td>
            <td><input type="text" class="routeInput" placeholder="הזן מסלול"></td>
            <td><button class="openSubmenuButton">משימות נוספות</button></td>
            <td><select class="truckSelect">
                <option value="MAN 2021">MAN 2021</option>
                <option value="VOLVO FH">VOLVO FH</option>
                <option value="SCANIA">SCANIA</option>
            </select></td>
        `;
        routesTableBody.appendChild(newRow);
    });

    // ✅ Очистка всех маршрутов в редакторе
    clearRoutesButton.addEventListener("click", function () {
        routesTableBody.innerHTML = "";
    });

    // ✅ Очистка всех таблиц на главной странице
    clearAllButton.addEventListener("click", function () {
        routesContainer.innerHTML = "";
    });

    // ✅ Открытие подменю при нажатии на "משימות נוספות"
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("openSubmenuButton")) {
            submenu.style.display = "block";
        }
    });

    // ✅ Закрытие подменю
    closeSubmenuButton.addEventListener("click", function () {
        submenu.style.display = "none";
    });

    // ✅ Сохранение маршрутов в Firebase
    saveRoutesButton.addEventListener("click", function () {
        const shift = routeShiftInput.value;
        const shiftText = routeShiftInput.options[routeShiftInput.selectedIndex].text;
        let routeDate = routeDateInput.value || today;

        const routes = [];
        document.querySelectorAll("#routesTable tbody tr").forEach(row => {
            const driver = row.querySelector(".driverSelect").value;
            const route = row.querySelector(".routeInput").value;
            const truck = row.querySelector(".truckSelect").value;
            const tasks = taskInput.value;

            routes.push({
                date: routeDate,
                shift: shiftText,
                driver: driver,
                route: route,
                tasks: tasks,
                truck: truck
            });
        });

        // ✅ Проверяем, есть ли данные
        if (routes.length > 0) {
            // ✅ Сохраняем в Firebase
            const newRouteRef = push(ref(db, "routes/" + routeDate + "/" + shift));
            set(newRouteRef, routes)
                .then(() => alert("🚛 המסלולים נשמרו בהצלחה!"))
                .catch(error => console.error("Ошибка при сохранении: ", error));
        } else {
            alert("⚠ Нет данных для сохранения!");
        }

        // ✅ Закрываем редактор
        editMenu.style.display = "none";
        routesTableBody.innerHTML = "";
        taskInput.value = "";
    });

    // ✅ Загрузка маршрутов из Firebase
    function loadRoutesFromFirebase() {
        const shifts = ["morning", "afternoon", "friday"];

        shifts.forEach(shift => {
            const routesRef = ref(db, "routes/" + today + "/" + shift);
            onValue(routesRef, (snapshot) => {
                if (snapshot.exists()) {
                    let shiftTable = document.querySelector(`#table-${shift}`);
                    if (!shiftTable) {
                        shiftTable = document.createElement("table");
                        shiftTable.id = `table-${shift}`;
                        shiftTable.innerHTML = `
                            <thead>
                                <tr><th colspan="5">${shift.toUpperCase()}</th></tr>
                                <tr>
                                    <th>תאריך</th>
                                    <th>נהג</th>
                                    <th>מסלול</th>
                                    <th>משימות נוספות</th>
                                    <th>רכב</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        `;
                        routesContainer.appendChild(shiftTable);
                    }

                    const shiftTableBody = shiftTable.querySelector("tbody");
                    shiftTableBody.innerHTML = "";

                    snapshot.forEach(routeSnapshot => {
                        const routeData = routeSnapshot.val();
                        routeData.forEach(route => {
                            const newRow = document.createElement("tr");
                            newRow.innerHTML = `
                                <td>${route.date}</td>
                                <td>${route.driver}</td>
                                <td>${route.route}</td>
                                <td>${route.tasks}</td>
                                <td>${route.truck}</td>
                            `;
                            shiftTableBody.appendChild(newRow);
                        });
                    });
                }
            });
        });
    }

    // ✅ Загружаем маршруты при запуске страницы
    loadRoutesFromFirebase();
});