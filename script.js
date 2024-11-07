let serviceId = 1; // ID inicial
let totalInversion = 0;
let totalGanancias = 0;

const serviceForm = document.getElementById('serviceForm');
const serviceList = document.getElementById('serviceList');
const totalizationButton = document.getElementById('totalizationButton');
const serviceDetailsModal = document.getElementById('serviceDetails');
const totalizationModal = document.getElementById('totalizationModal');
const closeModal = document.getElementById('closeModal');
const closeTotalizationModal = document.getElementById('closeTotalizationModal');

let services = []; // Array para almacenar los servicios

// Función para agregar un servicio
serviceForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const serviceName = document.getElementById('serviceName').value;
  const providerName = document.getElementById('providerName').value;
  const clientName = document.getElementById('clientName').value;
  const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
  const salePrice = parseFloat(document.getElementById('salePrice').value);
  const paymentMethod = document.getElementById('paymentMethod').value;

  // Crear un objeto para el servicio
  const service = {
    id: serviceId++,
    name: serviceName,
    provider: providerName,
    client: clientName,
    purchasePrice: purchasePrice,
    salePrice: salePrice,
    paymentMethod: paymentMethod,
    status: 'Pendiente',
  };

  // Agregar el servicio a la lista
  services.push(service);

  // Actualizar la tabla de servicios
  renderServices();

  // Actualizar la totalización de la inversión
  totalInversion += purchasePrice;

  // Limpiar los campos del formulario
  serviceForm.reset();
});

// Función para renderizar los servicios en la tabla
function renderServices() {
  serviceList.innerHTML = '';

  services.forEach(service => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${service.id}</td>
      <td>${service.name}</td>
      <td>
        <button onclick="verDetalles(${service.id})">Ver</button>
        <button onclick="eliminarServicio(${service.id})">Eliminar</button>
        <button onclick="cambiarEstado(${service.id})" style="background-color: ${service.status === 'Pendiente' ? '#e63946' : '#1db954'}">
          ${service.status}
        </button>
      </td>
    `;
    serviceList.appendChild(tr);
  });
}

// Función para ver los detalles de un servicio
function verDetalles(id) {
  const service = services.find(s => s.id === id);
  document.getElementById('serviceInfo').innerHTML = `
    <strong>Servicio:</strong> ${service.name} <br>
    <strong>Proveedor:</strong> ${service.provider} <br>
    <strong>Cliente:</strong> ${service.client} <br>
    <strong>Precio de Compra:</strong> $${service.purchasePrice} <br>
    <strong>Precio de Venta:</strong> $${service.salePrice} <br>
    <strong>Método de Pago:</strong> ${service.paymentMethod} <br>
    <strong>Estado:</strong> ${service.status}
  `;
  serviceDetailsModal.style.display = 'block';
}

// Función para eliminar un servicio
function eliminarServicio(id) {
  services = services.filter(service => service.id !== id);
  renderServices();
}

// Función para cambiar el estado (Pendiente/Pagado)
function cambiarEstado(id) {
  const service = services.find(s => s.id === id);
  if (service.status === 'Pendiente') {
    service.status = 'Pagado';
    totalGanancias += service.salePrice - service.purchasePrice;
  } else {
    service.status = 'Pendiente';
  }
  renderServices();
}

// Función para abrir el modal de totalización
function abrirTotalizacion() {
  document.getElementById('investmentAndProfit').innerHTML = `
    <strong>Total Inversión:</strong> $${totalInversion.toFixed(2)} <br>
    <strong>Total Ganancias:</strong> $${totalGanancias.toFixed(2)}
  `;
  totalizationModal.style.display = 'block';
}

// Función para cerrar el modal de detalles
function cerrarDetalles() {
  serviceDetailsModal.style.display = 'none';
}

// Función para cerrar el modal de totalización
function cerrarTotalizacion() {
  totalizationModal.style.display = 'none';
}

// Cerrar los modales si se hace clic fuera de ellos
window.onclick = function(event) {
  if (event.target === serviceDetailsModal) {
    serviceDetailsModal.style.display = 'none';
  } else if (event.target === totalizationModal) {
    totalizationModal.style.display = 'none';
  }
}
