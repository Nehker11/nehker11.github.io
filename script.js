document.addEventListener("DOMContentLoaded", function () {
    const inventoryForm = document.getElementById("inventoryForm");
    const inventoryList = document.getElementById("inventoryList");
    const totalInvestment = document.getElementById("totalInvestment");
    const totalProfit = document.getElementById("totalProfit");

    // Cargar servicios de localStorage
    function loadInventory() {
        const savedInventory = JSON.parse(localStorage.getItem("inventory")) || [];
        savedInventory.forEach(addServiceToTable);
        updateTotals();
    }

    // Agregar servicio a la tabla y al localStorage
    inventoryForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const service = {
            name: document.getElementById("productName").value,
            provider: document.getElementById("providerName").value,
            purchasePrice: parseFloat(document.getElementById("purchasePrice").value),
            salePrice: parseFloat(document.getElementById("salePrice").value),
            status: "Pendiente",
            dateTime: new Date().toLocaleString()
        };
        addServiceToTable(service);
        saveToLocalStorage(service);
        updateTotals();
        inventoryForm.reset();
    });

    function addServiceToTable(service) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${service.name}</td>
            <td>${service.provider}</td>
            <td>$${service.purchasePrice.toFixed(2)}</td>
            <td>$${service.salePrice.toFixed(2)}</td>
            <td><button class="status-btn pending" onclick="toggleStatus(this)">${service.status}</button></td>
            <td>${service.dateTime}</td>
            <td>
                <button onclick="deleteProduct(this)">Eliminar</button>
                <button onclick="editProduct(this)">Editar</button>
            </td>
        `;
        inventoryList.appendChild(row);
    }

    function saveToLocalStorage(service) {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.push(service);
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    function updateTotals() {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        let totalInvestmentValue = 0;
        let totalProfitValue = 0;
        inventory.forEach(service => {
            totalInvestmentValue += service.purchasePrice;
            // Solo sumar ganancias si el servicio está pagado
            if (service.status === "Pagado") {
                totalProfitValue += (service.salePrice - service.purchasePrice);
            }
        });
        totalInvestment.textContent = `Inversión Total: $${totalInvestmentValue.toFixed(2)}`;
        totalProfit.textContent = `Ganancias Totales: $${totalProfitValue.toFixed(2)}`;
    }

    // Cambiar estado del servicio
    window.toggleStatus = function (button) {
        const row = button.closest("tr");
        const status = button.textContent === "Pendiente" ? "Pagado" : "Pendiente";
        button.textContent = status;
        button.classList.toggle("pending");
        button.classList.toggle("paid");

        // Actualizar las ganancias según el nuevo estado
        updateTotals();
        // Actualizar el almacenamiento local
        updateLocalStorage();
    };

    // Eliminar un servicio
    window.deleteProduct = function (button) {
        const row = button.closest("tr");
        const serviceName = row.cells[0].textContent;
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const updatedInventory = inventory.filter(service => service.name !== serviceName);
        localStorage.setItem("inventory", JSON.stringify(updatedInventory));
        row.remove();
        updateTotals();
    };

    // Editar un servicio
    window.editProduct = function (button) {
        const row = button.closest("tr");
        const productName = row.cells[0].textContent;
        const providerName = row.cells[1].textContent;
        const purchasePrice = parseFloat(row.cells[2].textContent.replace('$', ''));
        const salePrice = parseFloat(row.cells[3].textContent.replace('$', ''));

        // Rellenar el formulario
        document.getElementById("productName").value = productName;
        document.getElementById("providerName").value = providerName;
        document.getElementById("purchasePrice").value = purchasePrice;
        document.getElementById("salePrice").value = salePrice;

        // Eliminar el servicio antiguo
        deleteProduct(button);
    };

    // Actualizar el almacenamiento local al cambiar el estado
    function updateLocalStorage() {
        const inventory = Array.from(inventoryList.querySelectorAll("tr")).map(row => {
            return {
                name: row.cells[0].textContent,
                provider: row.cells[1].textContent,
                purchasePrice: parseFloat(row.cells[2].textContent.replace('$', '')),
                salePrice: parseFloat(row.cells[3].textContent.replace('$', '')),
                status: row.cells[4].querySelector("button").textContent,
                dateTime: row.cells[5].textContent
            };
        });
        localStorage.setItem("inventory", JSON.stringify(inventory));
        updateTotals();
    }

    loadInventory();
});
