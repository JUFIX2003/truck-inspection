import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Инициализация Firebase
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
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
    const editMenu = document.getElementById("editMenu");
    const editRouteButton = document.getElementById("editRouteButton");
    const closeEditorButton = document.getElementById("closeEditorButton");
    const addRouteButton = document.getElementById("addRouteButton");
    const saveRoutesButton = document.getElementById("saveRoutesButton");
    const routesTableBody = document.querySelector("#routesTable tbody");
    const routesContainer = document.getElementById("routesContainer");
    const routeShiftInput = document.getElementById("routeShift");
    const taskInput = document.getElementById("taskInput");
    const routeDateInput = document.getElementById("routeDate");

    const today = new Date().toISOString().split("T")[0];
    if (!routeDateInput.value) {
        routeDateInput.value = today;
    }

    if (editRouteButton) {
        editRouteButton.addEventListener("click", function() {
            editMenu.style.display = "flex";
        });
    }

    if (closeEditorButton) {
        closeEditorButton.addEventListener("click", function() {
            editMenu.style.display = "none";
        });
    }

    if (addRouteButton) {
        addRouteButton.addEventListener("click", function() {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" class="driverInput" placeholder="הזן נהג"></td>
                <td><input type="text" class="routeInput" placeholder="הזן מסלול"></td>
                <td><input type="text" class="taskInput" placeholder="הזן משימות נוספות"></td>
                <td><input type="text" class="truckInput" placeholder="הזן רכב"></td>
            `;
            routesTableBody.appendChild(newRow);
        });
    }

    if (saveRoutesButton) {
        saveRoutesButton.addEventListener("click", function() {
            const shiftText = routeShiftInput.options[routeShiftInput.selectedIndex].text;
            let routeDate = routeDateInput.value || today;

            const routesRef = ref(database, "routes");

            document.querySelectorAll("#routesTable tbody tr").forEach(row => {
                const driver = row.querySelector(".driverInput").value;
                const route = row.querySelector(".routeInput").value;
                const tasks = row.querySelector(".taskInput").value;
                const truck = row.querySelector(".truckInput").value;

                const newRouteRef = push(routesRef);
                set(newRouteRef, {
                    date: routeDate,
                    shift: routeShiftInput.value,
                    shiftText: shiftText,
                    driver: driver,
                    route: route,
                    tasks: tasks,
                    truck: truck
                }).then(() => {
                    console.log("Маршрут сохранён в Firebase!");
                }).catch(error => {
                    console.error("Ошибка при сохранении маршрута:", error);
                });
            });

            editMenu.style.display = "none";
            routesTableBody.innerHTML = "";
            taskInput.value = "";
        });
    }
});
