const inventoryForm = document.getElementById('inventoryForm');
const inventoryList = document.getElementById('inventoryList');
const totalProfit = document.getElementById('totalProfit');
const totalInvestment = document.getElementById('totalInvestment');
const historyButton = document.getElementById('historyButton');
const backButton = document.getElementById('backButton');

let products = JSON.parse(localStorage.getItem('products')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];

// Actualizar lista de inventario
function updateInventoryList() {
    inventoryList.innerHTML = '';
    let totalGain = 0;
    let totalInv = 0;

    products.forEach((product, index) => {
        const gain = product.salePrice - product.purchasePrice;
        if (product.paid) {
            totalGain += gain;
        } else {
            totalInv += product.purchasePrice;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.provider}</td>
            <td>$${product.purchasePrice.toFixed(2)}</td>
            <td>$${product.salePrice.toFixed(2)}</td>
            <td><button class="${product.paid ? 'paid' : 'pending'}" onclick="togglePaid(${index})">${product.paid ? 'Pagado' : 'Pendiente'}</button></td>
            <td>${new Date(product.date).toLocaleString()}</td>
            <td>
                <button onclick="editProduct(${index})">Editar</button>
                <button onclick="deleteProduct(${index})">Eliminar</button>
            </td>
        `;
        inventoryList.appendChild(row);
    });

    totalInvestment.innerText = `Inversión Total: $${totalInv.toFixed(2)}`;
    totalProfit.innerText = `Ganancias Totales: $${totalGain.toFixed(2)}`;
}

// Alternar estado de pagado
function togglePaid(index) {
    products[index].paid = !products[index].paid;
    localStorage.setItem('products', JSON.stringify(products));
    updateInventoryList();
}

// Agregar producto
inventoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const provider = document.getElementById('providerName').value;
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const salePrice = parseFloat(document.getElementById('salePrice').value);
    const date = new Date();

    products.push({ name, provider, purchasePrice, salePrice, date, paid: false });
    localStorage.setItem('products', JSON.stringify(products));
    updateInventoryList();
    inventoryForm.reset();
});

// Editar producto
function editProduct(index) {
    const product = products[index];
    document.getElementById('productName').value = product.name;
    document.getElementById('providerName').value = product.provider;
    document.getElementById('purchasePrice').value = product.purchasePrice;
    document.getElementById('salePrice').value = product.salePrice;
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    updateInventoryList();
}

// Eliminar producto
function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    updateInventoryList();
}

// Muestra el historial de servicios
function showHistory() {
    inventoryList.innerHTML = '';
    history.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.provider}</td>
            <td>$${product.purchasePrice.toFixed(2)}</td>
            <td>$${product.salePrice.toFixed(2)}</td>
            <td>${product.paid ? 'Pagado' : 'Pendiente'}</td>
            <td>${new Date(product.date).toLocaleString()}</td>
            <td></td>
        `;
        inventoryList.appendChild(row);
    });
    backButton.style.display = 'block';
    historyButton.style.display = 'none';
}

// Volver a la vista principal
function showInventory() {
    updateInventoryList();
    backButton.style.display = 'none';
    historyButton.style.display = 'block';
}

// Mover productos al historial cada lunes a las 7 am
function scheduleWeeklyReset() {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7));
    nextMonday.setHours(7, 0, 0, 0);

    const timeUntilNextMonday = nextMonday - now;
    setTimeout(() => {
        history = [...history, ...products];
        products = [];
        localStorage.setItem('history', JSON.stringify(history));
        localStorage.setItem('products', JSON.stringify(products));
        updateInventoryList();
        scheduleWeeklyReset(); // Reprogramar para el siguiente lunes
    }, timeUntilNextMonday);
}

historyButton.addEventListener('click', showHistory);
backButton.addEventListener('click', showInventory);

updateInventoryList();
scheduleWeeklyReset();
