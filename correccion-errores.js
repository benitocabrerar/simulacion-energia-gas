// correccion-errores.js - Solución específica para los errores detectados

// Variables globales para los gráficos
// Si no existen, las creamos como objetos vacíos para evitar errores de "destroy is not a function"
window.productionChart = window.productionChart || {};
window.energyChart = window.energyChart || {};
window.financialChart = window.financialChart || {};
window.emissionsChart = window.emissionsChart || {};
window.flowChart = window.flowChart || {};
window.efficiencyChart = window.efficiencyChart || {};
window.costBreakdownChart = window.costBreakdownChart || {};
window.cashFlowChart = window.cashFlowChart || {};
window.carbonComparisonChart = window.carbonComparisonChart || {};
window.emissionsCompositionChart = window.emissionsCompositionChart || {};

// Reemplazar el método destroy si no existe
const chartInstances = [
    'productionChart', 'energyChart', 'financialChart', 'emissionsChart',
    'flowChart', 'efficiencyChart', 'costBreakdownChart', 'cashFlowChart',
    'carbonComparisonChart', 'emissionsCompositionChart'
];

chartInstances.forEach(chartName => {
    if (window[chartName] && typeof window[chartName].destroy !== 'function') {
        console.log(`Agregando método destroy a ${chartName}`);
        window[chartName].destroy = function() {
            console.log(`Método destroy simulado para ${chartName}`);
            // No hace nada, solo evita errores
        };
    }
});

// Función segura para cambiar pestañas - evita errores de null/undefined
function cambiarPestanaSeguro(id) {
    console.log(`Cambiando a pestaña: ${id}`);
    
    try {
        // Validar que el id existe
        if (!id || typeof id !== 'string') {
            console.error('ID de pestaña inválido:', id);
            return;
        }
        
        // Validar que la pestaña existe
        const tabContent = document.getElementById(id);
        if (!tabContent) {
            console.error(`No se encontró el contenido de la pestaña con id: ${id}`);
            return;
        }
        
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        // Mostrar la pestaña seleccionada
        tabContent.classList.add('active');
        tabContent.style.display = 'block';
        
        // Actualizar la navegación
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            
            // Verificación segura de onclick
            const onclickAttr = tab.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes && onclickAttr.includes(id)) {
                tab.classList.add('active');
            }
        });
        
        console.log(`Pestaña ${id} activada correctamente`);
    } catch (error) {
        console.error('Error al cambiar de pestaña:', error);
    }
}

// Reemplazar la función original con nuestra versión segura
window.cambiarPestana = cambiarPestanaSeguro;

// Función segura para actualizar gráficos
function actualizarGraficosSeguro(datos) {
    console.log("Actualizando gráficos de forma segura");
    
    if (!datos || Object.keys(datos).length === 0) {
        console.warn("No hay datos para actualizar los gráficos");
        return;
    }
    
    try {
        // Obtener la pestaña activa de forma segura
        const pestanaActiva = document.querySelector('.tab-content.active');
        if (!pestanaActiva) {
            console.error("No se encontró una pestaña activa");
            return;
        }
        
        const idPestanaActiva = pestanaActiva.id;
        
        // Actualizar gráficos según la pestaña activa
        switch (idPestanaActiva) {
            case 'panel-principal':
                actualizarGraficosPanelPrincipalSeguro(datos);
                break;
            case 'proceso':
                actualizarGraficosProcesoSeguro(datos);
                break;
            case 'financiero':
                actualizarGraficosFinancieroSeguro(datos);
                break;
            case 'ambiental':
                actualizarGraficosAmbientalSeguro(datos);
                break;
            default:
                console.warn(`Pestaña desconocida: ${idPestanaActiva}`);
        }
    } catch (error) {
        console.error("Error al actualizar gráficos:", error);
    }
}

// Reemplazar la función original
window.actualizarGraficos = actualizarGraficosSeguro;

// Función segura para actualizar gráficos del panel principal
function actualizarGraficosPanelPrincipalSeguro(datos) {
    console.log("Actualizando gráficos del panel principal de forma segura");
    
    try {
        // Gráfico de producción
        actualizarGraficoIndividualSeguro('productionChart', 'bar', {
            labels: ['Producción Diaria'],
            datasets: [
                {
                    label: 'Gas (miles m³/día)',
                    data: [datos.gasExtraido || 0],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Petróleo (bbl/día)',
                    data: [datos.produccionPetroleoDiaria || 0],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        });
        
        // Gráfico de energía
        actualizarGraficoIndividualSeguro('energyChart', 'bar', {
            labels: ['Energía Térmica', 'Energía Eléctrica', 'Pérdidas', 'Energía Entregada'],
            datasets: [{
                label: 'Energía (MWh/día)',
                data: [
                    datos.energiaTermica || 0, 
                    datos.energiaElectrica || 0, 
                    datos.perdidas || 0, 
                    datos.energiaEntregada || 0
                ],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        });
        
        // Gráfico financiero
        actualizarGraficoIndividualSeguro('financialChart', 'bar', {
            labels: ['Análisis Financiero'],
            datasets: [
                {
                    label: 'Ingresos',
                    data: [datos.ingresos || 0],
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Costos',
                    data: [datos.gastos || 0],
                    backgroundColor: 'rgba(231, 76, 60, 0.7)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Beneficio',
                    data: [datos.beneficio || 0],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }
            ]
        });
        
        // Gráfico de emisiones
        actualizarGraficoIndividualSeguro('emissionsChart', 'pie', {
            labels: ['CO₂', 'NOx', 'SO₂'],
            datasets: [{
                data: [
                    datos.emisionesCO2 || 0, 
                    datos.emisionesNOx || 0, 
                    datos.emisionesSO2 || 0
                ],
                backgroundColor: [
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(52, 152, 219, 0.7)'
                ],
                borderColor: [
                    'rgba(231, 76, 60, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(52, 152, 219, 1)'
                ],
                borderWidth: 1
            }]
        });
    } catch (error) {
        console.error("Error al actualizar gráficos del panel principal:", error);
    }
}

// Función segura para actualizar gráficos del proceso
function actualizarGraficosProcesoSeguro(datos) {
    console.log("Actualizando gráficos de proceso de forma segura");
    
    try {
        // Gráfico de flujo
        actualizarGraficoIndividualSeguro('flowChart', 'bar', {
            labels: ['Gas Extraído', 'Gas Separado', 'Gas Comprimido', 'Gas No Utilizado'],
            datasets: [{
                label: 'Volumen de Gas',
                data: [
                    datos.gasExtraido || 0,
                    datos.gasSeparado || 0,
                    datos.gasComprimido || 0,
                    datos.gasNoUtilizado || 0
                ],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(231, 76, 60, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        });
        
        // Gráfico de eficiencia
        const sepEf = parseInt(document.getElementById('sep')?.value || 85);
        const compEf = parseInt(document.getElementById('comp')?.value || 90);
        const turbEf = parseInt(document.getElementById('turb')?.value || 38);
        const transmissionEf = 95; // 5% de pérdidas
        const totalEf = (sepEf/100) * (compEf/100) * (turbEf/100) * (transmissionEf/100) * 100;
        
        actualizarGraficoIndividualSeguro('efficiencyChart', 'bar', {
            labels: ['Separación', 'Compresión', 'Turbina', 'Transmisión', 'Total'],
            datasets: [{
                label: 'Eficiencia (%)',
                data: [
                    sepEf, 
                    compEf, 
                    turbEf, 
                    transmissionEf, 
                    parseFloat(totalEf.toFixed(1))
                ],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(52, 73, 94, 0.7)',
                    'rgba(39, 174, 96, 0.7)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(52, 73, 94, 1)',
                    'rgba(39, 174, 96, 1)'
                ],
                borderWidth: 1
            }]
        });
    } catch (error) {
        console.error("Error al actualizar gráficos de proceso:", error);
    }
}

// Función segura para actualizar gráficos financieros
function actualizarGraficosFinancieroSeguro(datos) {
    console.log("Actualizando gráficos financieros de forma segura");
    
    try {
        // Gráfico de desglose de costos
        actualizarGraficoIndividualSeguro('costBreakdownChart', 'pie', {
            labels: ['Combustible', 'Mantenimiento', 'Personal', 'Otros'],
            datasets: [{
                data: [
                    datos.costoCombustible || 0,
                    datos.costoMantenimiento || 0,
                    datos.costoPersonal || 0,
                    datos.otrosCostos || 0
                ],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(231, 76, 60, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        });
        
        // Gráfico de flujo de caja
        actualizarGraficoIndividualSeguro('cashFlowChart', 'line', {
            labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'],
            datasets: [
                {
                    label: 'Ingresos',
                    data: [
                        (datos.ingresos || 0) * 365,
                        (datos.ingresos || 0) * 365 * 1.02,
                        (datos.ingresos || 0) * 365 * 1.04,
                        (datos.ingresos || 0) * 365 * 1.06,
                        (datos.ingresos || 0) * 365 * 1.08
                    ],
                    borderColor: 'rgba(46, 204, 113, 1)',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'Costos',
                    data: [
                        (datos.gastos || 0) * 365,
                        (datos.gastos || 0) * 365 * 1.01,
                        (datos.gastos || 0) * 365 * 1.02,
                        (datos.gastos || 0) * 365 * 1.03,
                        (datos.gastos || 0) * 365 * 1.04
                    ],
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'Beneficio',
                    data: [
                        (datos.beneficio || 0) * 365,
                        (datos.beneficio || 0) * 365 * 1.03,
                        (datos.beneficio || 0) * 365 * 1.06,
                        (datos.beneficio || 0) * 365 * 1.09,
                        (datos.beneficio || 0) * 365 * 1.12
                    ],
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        });
    } catch (error) {
        console.error("Error al actualizar gráficos financieros:", error);
    }
}

// Función segura para actualizar gráficos ambientales
function actualizarGraficosAmbientalSeguro(datos) {
    console.log("Actualizando gráficos ambientales de forma segura");
    
    try {
        // Gráfico de comparación de intensidad de carbono
        actualizarGraficoIndividualSeguro('carbonComparisonChart', 'bar', {
            labels: ['Carbón', 'Petróleo', 'Gas Natural', 'Gas Asociado (Este Proyecto)', 'Solar', 'Eólica'],
            datasets: [{
                label: 'Intensidad de Carbono (kg CO₂/MWh)',
                data: [900, 700, 400, datos.intensidadCarbono || 0, 50, 15],
                backgroundColor: [
                    'rgba(33, 33, 33, 0.7)',
                    'rgba(165, 105, 189, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(26, 188, 156, 0.7)'
                ],
                borderColor: [
                    'rgba(33, 33, 33, 1)',
                    'rgba(165, 105, 189, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(26, 188, 156, 1)'
                ],
                borderWidth: 1
            }]
        });
        
        // Gráfico de composición de emisiones
        actualizarGraficoIndividualSeguro('emissionsCompositionChart', 'doughnut', {
            labels: ['CO₂', 'NOx', 'SO₂', 'CH₄'],
            datasets: [{
                data: [
                    datos.emisionesCO2 || 0,
                    datos.emisionesNOx || 0,
                    datos.emisionesSO2 || 0,
                    datos.emisionesCH4 || 0
                ],
                backgroundColor: [
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(155, 89, 182, 0.7)'
                ],
                borderColor: [
                    'rgba(231, 76, 60, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(155, 89, 182, 1)'
                ],
                borderWidth: 1
            }]
        });
    } catch (error) {
        console.error("Error al actualizar gráficos ambientales:", error);
    }
}

// Función segura para crear/actualizar un gráfico individual
function actualizarGraficoIndividualSeguro(chartId, type, chartData) {
    console.log(`Actualizando gráfico ${chartId}`);
    
    try {
        // Verificar que el elemento canvas existe
        const canvas = document.getElementById(chartId);
        if (!canvas) {
            console.warn(`Canvas no encontrado: ${chartId}`);
            return;
        }
        
        // Destruir el gráfico anterior si existe
        if (window[chartId]) {
            try {
                if (typeof window[chartId].destroy === 'function') {
                    window[chartId].destroy();
                } else {
                    console.warn(`El gráfico ${chartId} no tiene método destroy`);
                }
            } catch (error) {
                console.warn(`Error al destruir gráfico ${chartId}:`, error);
            }
        }
        
        // Crear un nuevo gráfico
        const ctx = canvas.getContext('2d');
        
        // Configuraciones básicas según el tipo de gráfico
        const options = {
            responsive: true,
            maintainAspectRatio: false
        };
        
        // Añadir opciones específicas según el tipo
        if (type === 'bar' || type === 'line') {
            options.scales = {
                y: {
                    beginAtZero: true
                }
            };
        }
        
        if (type === 'pie' || type === 'doughnut') {
            options.plugins = {
                legend: {
                    position: 'right'
                }
            };
        }
        
        // Crear el nuevo gráfico
        window[chartId] = new Chart(ctx, {
            type: type,
            data: chartData,
            options: options
        });
        
        console.log(`Gráfico ${chartId} creado correctamente`);
    } catch (error) {
        console.error(`Error al actualizar gráfico ${chartId}:`, error);
    }
}

// Inicializar gráficos cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado. Aplicando correcciones de errores...");
    
    // Esperar un momento antes de inicializar para asegurar que todo está listo
    setTimeout(function() {
        try {
            // Iniciar un cálculo para tener datos
            if (typeof calcular === 'function') {
                calcular();
                console.log("Cálculo inicial realizado");
            } else {
                console.warn("Función calcular no disponible");
            }
            
            // Activar la primera pestaña por defecto
            const primeraPestana = document.querySelector('.tab-content');
            if (primeraPestana) {
                cambiarPestanaSeguro(primeraPestana.id);
            }
            
            console.log("Correcciones de errores aplicadas correctamente");
        } catch (error) {
            console.error("Error durante la inicialización:", error);
        }
    }, 1000);
});
