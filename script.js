let serviceId = 1;
let totalInversion = 0;
let totalGanancias = 0;

const serviceForm = document.getElementById('serviceForm');
const serviceList = document.getElementById('serviceList');
const serviceDetailsModal = document.getElementById('serviceDetails');
const totalizationModal = document.getElementById('totalizationModal');

// Recuperar servicios desde el almacenamiento local
let services = JSON.parse(localStorage.getItem('services')) || [];

// Renderizar la tabla al cargar la página y calcular totales
initializeApp();

serviceForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const serviceName = document.getElementById('serviceName').value;
  const providerName = document.getElementById('providerName').value;
  const clientName = document.getElementById('clientName').value;
  const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
  const salePrice = parseFloat(document.getElementById('salePrice').value);
  const paymentMethod = document.getElementById('paymentMethod').value;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString();

  const service = {
    id: serviceId++,
    name: serviceName,
    provider: providerName,
    client: clientName,
    purchasePrice: purchasePrice,
    salePrice: salePrice,
    paymentMethod: paymentMethod,
    status: 'Pendiente',
    date: formattedDate,
  };

  services.push(service);
  updateTotals();

  saveServices();
  renderServices();
  serviceForm.reset();
});

function renderServices() {
  serviceList.innerHTML = '';
  services.forEach(service => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${service.id}</td>
      <td>${service.name}</td>
      <td>
        <button class="view-btn" onclick="verDetalles(${service.id})" style="background-color: #007bff; color: #eeeeee;">Ver</button>
        <button class="delete-btn" onclick="eliminarServicio(${service.id})" style="background-color: #e63946; color: #ffffff;">Eliminar</button>
        <button class="${service.status === 'Pendiente' ? 'status-btn-pending' : 'status-btn-paid'}" onclick="cambiarEstado(${service.id})">${service.status}</button>
      </td>
    `;
    serviceList.appendChild(tr);
  });
}

function verDetalles(id) {
  const service = services.find(s => s.id === id);
  document.getElementById('serviceInfo').innerHTML = `
    <strong>Fecha y Hora:</strong> ${service.date}<br>
    <strong>Cliente:</strong> ${service.client}<br>
    <strong>Proveedor:</strong> ${service.provider}<br>
    <strong>Precio de Compra:</strong> $${service.purchasePrice.toFixed(2)}<br>
    <strong>Precio de Venta:</strong> $${service.salePrice.toFixed(2)}<br>
    <strong>Método de Pago:</strong> ${service.paymentMethod}<br>
  `;
  serviceDetailsModal.style.display = 'block';
}

function eliminarServicio(id) {
  const index = services.findIndex(s => s.id === id);
  if (index !== -1) {
    const service = services[index];

    // Actualizar inversión y ganancias al eliminar el servicio
    totalInversion -= service.purchasePrice;
    if (service.status === 'Pagado') {
      totalGanancias -= (service.salePrice - service.purchasePrice);
    }

    services.splice(index, 1);
    saveServices();
    renderServices();
    updateTotals();
  }
}

function cambiarEstado(id) {
  const service = services.find(s => s.id === id);

  if (service.status === 'Pendiente') {
    service.status = 'Pagado';
    totalGanancias += service.salePrice - service.purchasePrice;
  } else {
    service.status = 'Pendiente';
    totalGanancias -= service.salePrice - service.purchasePrice;
  }

  saveServices();
  renderServices();
  updateTotals();
}

function abrirTotalizacion() {
  document.getElementById('investmentAndProfit').innerHTML = `
    <strong>Total Inversión:</strong> $${totalInversion.toFixed(2)} <br>
    <strong>Total Ganancias:</strong> $${totalGanancias.toFixed(2)}
  `;
  totalizationModal.style.display = 'block';
}

function cerrarDetalles() {
  serviceDetailsModal.style.display = 'none';
}

function cerrarTotalizacion() {
  totalizationModal.style.display = 'none';
}

function saveServices() {
  localStorage.setItem('services', JSON.stringify(services));
  localStorage.setItem('totalInversion', totalInversion);
  localStorage.setItem('totalGanancias', totalGanancias);
}

function resetList() {
  const confirmed = confirm("¿Estás seguro de que deseas borrar la lista de servicios y la totalización de inversión y ganancias?");
  if (confirmed) {
    services = [];
    totalInversion = 0;
    totalGanancias = 0;
    saveServices();
    renderServices();

    document.getElementById('investmentAndProfit').innerHTML = `
      <strong>Total Inversión:</strong> $${totalInversion.toFixed(2)} <br>
      <strong>Total Ganancias:</strong> $${totalGanancias.toFixed(2)}
    `;
  }
}

window.onclick = function (event) {
  if (event.target === serviceDetailsModal) {
    cerrarDetalles();
  }
  if (event.target === totalizationModal) {
    cerrarTotalizacion();
  }
};

function initializeApp() {
  totalInversion = parseFloat(localStorage.getItem('totalInversion')) || 0;
  totalGanancias = parseFloat(localStorage.getItem('totalGanancias')) || 0;

  renderServices();
  updateTotals();
}

function updateTotals() {
  totalInversion = services.reduce((sum, service) => sum + service.purchasePrice, 0);
  totalGanancias = services
    .filter(service => service.status === 'Pagado')
    .reduce((sum, service) => sum + (service.salePrice - service.purchasePrice), 0);

  document.getElementById('investmentAndProfit').innerHTML = `
    <strong>Total Inversión:</strong> $${totalInversion.toFixed(2)} <br>
    <strong>Total Ganancias:</strong> $${totalGanancias.toFixed(2)}
  `;
}
