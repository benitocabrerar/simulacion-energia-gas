// correccion-dimensiones.js - Solución para el problema de dimensiones de canvas

document.addEventListener('DOMContentLoaded', function() {
    console.log("Aplicando corrección para dimensiones de canvas...");
    
    setTimeout(function() {
        // Corregir dimensiones de canvas en todas las pestañas
        const canvasIds = [
            // Panel Principal
            'productionChart', 'energyChart', 'financialChart', 'emissionsChart',
            // Proceso
            'flowChart', 'efficiencyChart',
            // Financiero
            'costBreakdownChart', 'cashFlowChart',
            // Ambiental
            'carbonComparisonChart', 'emissionsCompositionChart'
        ];
        
        // Asignar dimensiones mínimas a todos los canvas
        canvasIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                // Verificar si el canvas tiene dimensiones
                if (canvas.width === 0 || canvas.height === 0) {
                    console.log(`Corrigiendo dimensiones para canvas ${id}`);
                    
                    // Asignar dimensiones mínimas
                    canvas.width = 300;
                    canvas.height = 150;
                    
                    // También aplicar estilo CSS
                    canvas.style.width = '100%';
                    canvas.style.height = '230px';
                    canvas.style.display = 'block';
                }
            }
        });
        
        // Asegurar que los contenedores de gráficos tengan altura
        document.querySelectorAll('.chart-container').forEach(container => {
            if (parseInt(getComputedStyle(container).height) === 0) {
                console.log('Corrigiendo altura de contenedor de gráfico');
                container.style.height = '300px';
                container.style.minHeight = '300px';
            }
        });
        
        // Crear gráficos manualmente
        crearTodosLosGraficos();
        
        // Reajustar canvas cuando se cambia de pestaña
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                setTimeout(() => {
                    ajustarDimensionesCanvas();
                    crearTodosLosGraficos();
                }, 200);
            });
        });
    }, 1000);
});

// Función para ajustar dimensiones de canvas
function ajustarDimensionesCanvas() {
    // Obtener la pestaña activa
    const pestanaActiva = document.querySelector('.tab-content.active');
    if (!pestanaActiva) return;
    
    console.log(`Ajustando dimensiones en pestaña: ${pestanaActiva.id}`);
    
    // Buscar todos los canvas en la pestaña activa
    const canvases = pestanaActiva.querySelectorAll('canvas');
    
    canvases.forEach((canvas, index) => {
        if (canvas.width === 0 || canvas.height === 0) {
            console.log(`Ajustando dimensiones del canvas ${index} en ${pestanaActiva.id}`);
            
            // Asignar dimensiones mínimas
            canvas.width = 300;
            canvas.height = 150;
            
            // También aplicar estilo CSS
            canvas.style.width = '100%';
            canvas.style.height = '230px';
            canvas.style.display = 'block';
            
            // Forzar reflow del DOM
            void canvas.offsetWidth;
        }
    });
}

// Función para crear todos los gráficos
function crearTodosLosGraficos() {
    // Verificar si tenemos datos
    if (!window.ultimosDatosCalculados || Object.keys(window.ultimosDatosCalculados).length === 0) {
        if (typeof calcular === 'function') {
            calcular();
            console.log("Cálculo realizado para obtener datos");
        } else {
            console.warn("Función calcular no disponible");
            return;
        }
    }
    
    const datos = window.ultimosDatosCalculados;
    
    // Obtener la pestaña activa
    const pestanaActiva = document.querySelector('.tab-content.active');
    if (!pestanaActiva) return;
    
    console.log(`Creando gráficos para pestaña: ${pestanaActiva.id}`);
    
    // Crear gráficos según la pestaña activa
    switch (pestanaActiva.id) {
        case 'panel-principal':
            crearGraficosPanelPrincipal(datos);
            break;
        case 'proceso':
            crearGraficosProceso(datos);
            break;
        case 'financiero':
            crearGraficosFinanciero(datos);
            break;
        case 'ambiental':
            crearGraficosAmbiental(datos);
            break;
    }
}

// Función para crear gráficos del panel principal
function crearGraficosPanelPrincipal(datos) {
    console.log("Creando gráficos del panel principal");
    
    // Gráfico de producción
    crearGrafico('productionChart', 'bar', {
        labels: ['Producción Diaria'],
        datasets: [
            {
                label: 'Gas (miles m³/día)',
                data: [datos.gasExtraido || 0],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                yAxisID: 'y'
            },
            {
                label: 'Petróleo (bbl/día)',
                data: [datos.produccionPetroleoDiaria || 0],
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                yAxisID: 'y1'
            }
        ]
    }, {
        scales: {
            y: {
                beginAtZero: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Gas (miles m³/día)'
                }
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Petróleo (bbl/día)'
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    });
    
    // Gráfico de energía
    crearGrafico('energyChart', 'bar', {
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
    crearGrafico('financialChart', 'bar', {
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
    crearGrafico('emissionsChart', 'pie', {
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
    }, {
        plugins: {
            legend: {
                position: 'right'
            }
        }
    });
}

// Función para crear gráficos de proceso
function crearGraficosProceso(datos) {
    console.log("Creando gráficos de proceso");
    
    // Gráfico de flujo
    crearGrafico('flowChart', 'bar', {
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
    
    crearGrafico('efficiencyChart', 'bar', {
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
    }, {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Eficiencia (%)'
                }
            }
        }
    });
}

// Función para crear gráficos financieros
function crearGraficosFinanciero(datos) {
    console.log("Creando gráficos financieros");
    
    // Gráfico de desglose de costos
    crearGrafico('costBreakdownChart', 'pie', {
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
    }, {
        plugins: {
            legend: {
                position: 'right'
            }
        }
    });
    
    // Gráfico de flujo de caja
    crearGrafico('cashFlowChart', 'line', {
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
}

// Función para crear gráficos ambientales
function crearGraficosAmbiental(datos) {
    console.log("Creando gráficos ambientales");
    
    // Gráfico de comparación de intensidad de carbono
    crearGrafico('carbonComparisonChart', 'bar', {
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
    crearGrafico('emissionsCompositionChart', 'doughnut', {
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
    }, {
        plugins: {
            legend: {
                position: 'right'
            }
        }
    });
}

// Función auxiliar para crear un gráfico
function crearGrafico(id, tipo, datos, opcionesAdicionales = {}) {
    // Verificar si existe el elemento
    const canvas = document.getElementById(id);
    if (!canvas) {
        console.warn(`Canvas no encontrado: ${id}`);
        return;
    }
    
    // Asegurarse de que el canvas tiene dimensiones
    if (canvas.width === 0 || canvas.height === 0) {
        canvas.width = 300;
        canvas.height = 150;
    }
    
    try {
        // Destruir instancia previa si existe
        if (window[id] && typeof window[id].destroy === 'function') {
            window[id].destroy();
        }
        
        // Obtener contexto
        const ctx = canvas.getContext('2d');
        
        // Opciones básicas
        const opciones = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0 // Deshabilitar animaciones para mejorar rendimiento
            }
        };
        
        // Añadir escalas si es necesario
        if (tipo === 'bar' || tipo === 'line') {
            opciones.scales = opciones.scales || {};
            opciones.scales.y = opciones.scales.y || {
                beginAtZero: true
            };
        }
        
        // Combinar con opciones adicionales
        const opcionesFinales = Object.assign({}, opciones, opcionesAdicionales);
        
        // Crear gráfico
        window[id] = new Chart(ctx, {
            type: tipo,
            data: datos,
            options: opcionesFinales
        });
        
        console.log(`Gráfico creado: ${id}`);
    } catch (error) {
        console.error(`Error al crear gráfico ${id}:`, error);
    }
}

// Cuando la ventana cambia de tamaño, reajustar los canvas
window.addEventListener('resize', function() {
    ajustarDimensionesCanvas();
});
