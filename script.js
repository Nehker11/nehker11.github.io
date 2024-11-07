let serviceId = localStorage.getItem("serviceId") ? parseInt(localStorage.getItem("serviceId")) : 1;

document.addEventListener("DOMContentLoaded", () => {
  const storedServices = JSON.parse(localStorage.getItem("services")) || [];
  storedServices.forEach(service => addServiceToTable(service));
});

document.getElementById("serviceForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const service = {
    id: serviceId++,
    name: document.getElementById("serviceName").value,
    provider: document.getElementById("providerName").value,
    client: document.getElementById("clientName").value,
    purchasePrice: `$${parseFloat(document.getElementById("purchasePrice").value).toFixed(2)}`,
    salePrice: `$${parseFloat(document.getElementById("salePrice").value).toFixed(2)}`,
    paymentMethod: document.getElementById("paymentMethod").value,
    date: new Date().toLocaleString()
  };

  localStorage.setItem("serviceId", serviceId);

  const services = JSON.parse(localStorage.getItem("services")) || [];
  services.push(service);
  localStorage.setItem("services", JSON.stringify(services));

  addServiceToTable(service);
  document.getElementById("serviceForm").reset();
});

function addServiceToTable(service) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${service.id}</td>
    <td>${service.name}</td>
    <td>
      <button class="view-btn" onclick="showServiceDetails(${service.id})">Ver</button>
      <button class="delete-btn" onclick="deleteService(${service.id})">Eliminar</button>
    </td>
  `;

  document.getElementById("serviceList").appendChild(row);
}

function showServiceDetails(id) {
  const services = JSON.parse(localStorage.getItem("services")) || [];
  const service = services.find(service => service.id === id);

  if (service) {
    document.getElementById("serviceInfo").innerHTML = `
      <strong>Nombre del Servicio:</strong> ${service.name}<br>
      <strong>Nombre del Proveedor:</strong> ${service.provider}<br>
      <strong>Nombre del Cliente:</strong> ${service.client}<br>
      <strong>Precio de Compra:</strong> ${service.purchasePrice}<br>
      <strong>Precio de Venta:</strong> ${service.salePrice}<br>
      <strong>Método de Pago:</strong> ${service.paymentMethod}<br>
      <strong>Fecha:</strong> ${service.date}
    `;
    document.getElementById("serviceDetails").style.display = "block";
  }
}

function deleteService(id) {
  const services = JSON.parse(localStorage.getItem("services")) || [];
  const updatedServices = services.filter(service => service.id !== id);

  localStorage.setItem("services", JSON.stringify(updatedServices));
  document.getElementById("serviceList").innerHTML = "";
  updatedServices.forEach(service => addServiceToTable(service));
}

document.getElementById("closeModal").addEventListener("click", function() {
  document.getElementById("serviceDetails").style.display = "none";
});
