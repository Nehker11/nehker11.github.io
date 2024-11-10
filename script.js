let serviceId = 1;
let totalInversion = 0;
let totalGanancias = 0;

const serviceForm = document.getElementById('serviceForm');
const serviceList = document.getElementById('serviceList');
const serviceDetailsModal = document.getElementById('serviceDetails');
const totalizationModal = document.getElementById('totalizationModal');

// Recuperar servicios desde el almacenamiento local
let services = JSON.parse(localStorage.getItem('services')) || [];

// Renderizar la tabla al cargar la página
renderServices();

// Escuchar el envío del formulario para agregar un servicio
serviceForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const serviceName = document.getElementById('serviceName').value;
  const providerName = document.getElementById('providerName').value;
  const clientName = document.getElementById('clientName').value;
  const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
  const salePrice = parseFloat(document.getElementById('salePrice').value);
  const paymentMethod = document.getElementById('paymentMethod').value;

  // Obtener la fecha y hora actual
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
    date: formattedDate, // Fecha y hora de registro
  };

  services.push(service);
  totalInversion += purchasePrice;

  saveServices();
  renderServices();
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
        <button class="view-btn" onclick="verDetalles(${service.id})" style="background-color: #007bff; color: #eeeeee;">Ver</button>
        <button class="delete-btn" onclick="eliminarServicio(${service.id})" style="color: #e63946; border: 1px solid #e63946; background-color: transparent;">Eliminar</button>
        <button onclick="cambiarEstado(${service.id})" style="background-color: ${service.status === 'Pendiente' ? '#e63946' : '#007bff'}; color: #ffffff;">
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
    <strong>Precio de Compra:</strong> $${service.purchasePrice.toFixed(2)} <br>
    <strong>Precio de Venta:</strong> $${service.salePrice.toFixed(2)} <br>
    <strong>Método de Pago:</strong> ${service.paymentMethod} <br>
    <strong>Estado:</strong> ${service.status} <br>
    <strong>Fecha y Hora de Registro:</strong> ${service.date}
  `;
  serviceDetailsModal.style.display = 'block';
}

// Función para eliminar un servicio
function eliminarServicio(id) {
  const service = services.find(s => s.id === id);

  // Restar la inversión y las ganancias si el servicio está en estado "Pagado"
  totalInversion -= service.purchasePrice;
  if (service.status === 'Pagado') {
    totalGanancias -= (service.salePrice - service.purchasePrice);
  }

  // Eliminar el servicio
  services = services.filter(service => service.id !== id);

  saveServices();
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
    totalGanancias -= (service.salePrice - service.purchasePrice);
  }
  saveServices();
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

// Función para guardar los servicios en el almacenamiento local
function saveServices() {
  localStorage.setItem('services', JSON.stringify(services));
}

// Cerrar los modales si se hace clic fuera de ellos
window.onclick = function(event) {
  if (event.target === serviceDetailsModal) {
    serviceDetailsModal.style.display = 'none';
  } else if (event.target === totalizationModal) {
    totalizationModal.style.display = 'none';
  }
};

// Inicializar totalInversion y totalGanancias desde el almacenamiento local
window.onload = function() {
  services.forEach(service => {
    totalInversion += service.purchasePrice;
    if (service.status === 'Pagado') {
      totalGanancias += service.salePrice - service.purchasePrice;
    }
  });
};
