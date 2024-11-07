let serviceId = 1;
let serviceData = JSON.parse(localStorage.getItem("serviceData")) || [];

// Cargar datos desde localStorage al cargar la página
if (serviceData.length > 0) {
    serviceId = serviceData[serviceData.length - 1].id + 1;
    updateServiceTable();
    console.log("Datos cargados desde localStorage");
}

function addService() {
    const serviceName = document.getElementById("serviceName").value;
    const providerName = document.getElementById("providerName").value;
    const clientName = document.getElementById("clientName").value;
    const purchasePrice = document.getElementById("purchasePrice").value;
    const salePrice = document.getElementById("salePrice").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const date = new Date().toLocaleString();

    if (!serviceName || !providerName || !clientName || !purchasePrice || !salePrice || !paymentMethod) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const newService = {
        id: serviceId++,
        serviceName,
        providerName,
        clientName,
        purchasePrice: `$${parseFloat(purchasePrice).toFixed(2)}`,
        salePrice: `$${parseFloat(salePrice).toFixed(2)}`,
        paymentMethod,
        date,
    };

    serviceData.push(newService);
    localStorage.setItem("serviceData", JSON.stringify(serviceData));
    console.log("Servicio agregado:", newService);
    updateServiceTable();
    document.getElementById("serviceForm").reset();
}

function updateServiceTable() {
    const tbody = document.querySelector("#serviceTable tbody");
    tbody.innerHTML = "";
    serviceData.forEach(service => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.serviceName}</td>
            <td><button onclick="showDetails(${service.id})">Ver</button></td>
        `;
        tbody.appendChild(row);
    });
}

function showDetails(id) {
    const service = serviceData.find(s => s.id === id);
    if (service) {
        const detailsContent = `
            <strong>Fecha y Hora:</strong> ${service.date}<br>
            <strong>Servicio:</strong> ${service.serviceName}<br>
            <strong>Proveedor:</strong> ${service.providerName}<br>
            <strong>Cliente:</strong> ${service.clientName}<br>
            <strong>Precio de Compra:</strong> ${service.purchasePrice}<br>
            <strong>Precio de Venta:</strong> ${service.salePrice}<br>
            <strong>Método de Pago:</strong> ${service.paymentMethod}
        `;
        document.getElementById("detailsContent").innerHTML = detailsContent;
        document.getElementById("serviceDetailsModal").style.display = "flex";
    }
}

function closeDetails() {
    document.getElementById("serviceDetailsModal").style.display = "none";
}
