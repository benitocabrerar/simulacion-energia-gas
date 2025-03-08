// Instancias de gráficos
let productionChart = null;
let energyChart = null;
let financialChart = null;
let emissionsChart = null;
let flowChart = null;
let efficiencyChart = null;
let costBreakdownChart = null;
let cashFlowChart = null;
let carbonComparisonChart = null;
let emissionsCompositionChart = null;

// Función para actualizar los gráficos
function actualizarGraficos(datos) {
    // Crear una copia protegida para evitar modificar los datos originales
    const datosProtegidos = { ...datos };
    
    // Recuperar la pestaña activa
    const activeTab = document.querySelector('.tab-content.active').id;
    
    // Gráficos del panel principal
    if (activeTab === 'panel-principal') {
        // Gráfico de producción
        if (productionChart) {
            productionChart.destroy();
        }
        
        const ctxProduction = document.getElementById('productionChart').getContext('2d');
        productionChart = new Chart(ctxProduction, {
            type: 'bar',
            data: {
                labels: ['Producción Diaria'],
                datasets: [
                    {
                        label: 'Gas (miles m³/día)',
                        data: [datosProtegidos.gasExtraido],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Petróleo (bbl/día)',
                        data: [datosProtegidos.produccionPetroleoDiaria],
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
            }
        });
        
        // Gráfico de energía
        if (energyChart) {
            energyChart.destroy();
        }
        
        const ctxEnergy = document.getElementById('energyChart').getContext('2d');
        energyChart = new Chart(ctxEnergy, {
            type: 'bar',
            data: {
                labels: ['Energía Térmica', 'Energía Eléctrica', 'Pérdidas', 'Energía Entregada'],
                datasets: [{
                    label: 'Energía (MWh/día)',
                    data: [
                        datosProtegidos.energiaTermica, 
                        datosProtegidos.energiaElectrica, 
                        datosProtegidos.perdidas, 
                        datosProtegidos.energiaEntregada
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
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'MWh/día'
                        }
                    }
                }
            }
        });
        
        // Gráfico financiero
        if (financialChart) {
            financialChart.destroy();
        }
        
        const ctxFinancial = document.getElementById('financialChart').getContext('2d');
        financialChart = new Chart(ctxFinancial, {
            type: 'bar',
            data: {
                labels: ['Análisis Financiero'],
                datasets: [
                    {
                        label: 'Ingresos',
                        data: [datosProtegidos.ingresos],
                        backgroundColor: 'rgba(46, 204, 113, 0.7)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Costos',
                        data: [datosProtegidos.gastos],
                        backgroundColor: 'rgba(231, 76, 60, 0.7)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Beneficio',
                        data: [datosProtegidos.beneficio],
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'USD/día'
                        }
                    }
                }
            }
        });
        
        // Gráfico de emisiones
        if (emissionsChart) {
            emissionsChart.destroy();
        }
        
        const ctxEmissions = document.getElementById('emissionsChart').getContext('2d');
        emissionsChart = new Chart(ctxEmissions, {
            type: 'pie',
            data: {
                labels: ['CO₂', 'NOx', 'SO₂'],
                datasets: [{
                    data: [
                        datosProtegidos.emisionesCO2, 
                        datosProtegidos.emisionesNOx, 
                        datosProtegidos.emisionesSO2
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
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }
    
    // Gráficos de la pestaña de proceso
    else if (activeTab === 'proceso') {
        // Gráfico de flujo
        if (flowChart) {
            flowChart.destroy();
        }
        
        const ctxFlow = document.getElementById('flowChart').getContext('2d');
        flowChart = new Chart(ctxFlow, {
            type: 'bar',
            data: {
                labels: ['Gas Extraído', 'Gas Separado', 'Gas Comprimido', 'Gas No Utilizado'],
                datasets: [{
                    label: 'Volumen de Gas',
                    data: [
                        datosProtegidos.gasExtraido,
                        datosProtegidos.gasSeparado,
                        datosProtegidos.gasComprimido,
                        datosProtegidos.gasNoUtilizado
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
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: unidadesImperiales ? 'pies³/día' : 'miles m³/día'
                        }
                    }
                }
            }
        });
        
        // Gráfico de eficiencia
        if (efficiencyChart) {
            efficiencyChart.destroy();
        }
        
        const sepEf = parseInt(document.getElementById('sep').value);
        const compEf = parseInt(document.getElementById('comp').value);
        const turbEf = parseInt(document.getElementById('turb').value);
        const transmissionEf = 95; // 5% de pérdidas
        const totalEf = (sepEf/100) * (compEf/100) * (turbEf/100) * (transmissionEf/100) * 100;
        
        const ctxEfficiency = document.getElementById('efficiencyChart').getContext('2d');
        efficiencyChart = new Chart(ctxEfficiency, {
            type: 'bar',
            data: {
                labels: ['Separación', 'Compresión', 'Turbina', 'Transmisión', 'Total'],
                datasets: [{
                    label: 'Eficiencia (%)',
                    data: [
                        sepEf, 
                        compEf, 
                        turbEf, 
                        transmissionEf, 
                        totalEf.toFixed(1)
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
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
            }
        });
    }
    
    // Gráficos de la pestaña financiera
    else if (activeTab === 'financiero') {
        // Gráfico de desglose de costos
        if (costBreakdownChart) {
            costBreakdownChart.destroy();
        }
        
        const ctxCostBreakdown = document.getElementById('costBreakdownChart').getContext('2d');
        costBreakdownChart = new Chart(ctxCostBreakdown, {
            type: 'pie',
            data: {
                labels: ['Combustible', 'Mantenimiento', 'Personal', 'Otros'],
                datasets: [{
                    data: [
                        datosProtegidos.costoCombustible,
                        datosProtegidos.costoMantenimiento,
                        datosProtegidos.costoPersonal,
                        datosProtegidos.otrosCostos
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
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
        
        // Gráfico de flujo de caja
        if (cashFlowChart) {
            cashFlowChart.destroy();
        }
        
        const ctxCashFlow = document.getElementById('cashFlowChart').getContext('2d');
        cashFlowChart = new Chart(ctxCashFlow, {
            type: 'line',
            data: {
                labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'],
                datasets: [
                    {
                        label: 'Ingresos',
                        data: [
                            datosProtegidos.ingresos * 365,
                            datosProtegidos.ingresos * 365 * 1.02,
                            datosProtegidos.ingresos * 365 * 1.04,
                            datosProtegidos.ingresos * 365 * 1.06,
                            datosProtegidos.ingresos * 365 * 1.08
                        ],
                        borderColor: 'rgba(46, 204, 113, 1)',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Costos',
                        data: [
                            datosProtegidos.gastos * 365,
                            datosProtegidos.gastos * 365 * 1.01,
                            datosProtegidos.gastos * 365 * 1.02,
                            datosProtegidos.gastos * 365 * 1.03,
                            datosProtegidos.gastos * 365 * 1.04
                        ],
                        borderColor: 'rgba(231, 76, 60, 1)',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Beneficio',
                        data: [
                            datosProtegidos.beneficio * 365,
                            datosProtegidos.beneficio * 365 * 1.03,
                            datosProtegidos.beneficio * 365 * 1.06,
                            datosProtegidos.beneficio * 365 * 1.09,
                            datosProtegidos.beneficio * 365 * 1.12
                        ],
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'USD/año'
                        }
                    }
                }
            }
        });
    }
    
    // Gráficos de la pestaña ambiental
    else if (activeTab === 'ambiental') {
        // Gráfico de comparación de intensidad de carbono
        if (carbonComparisonChart) {
            carbonComparisonChart.destroy();
        }
        
        const ctxCarbonComparison = document.getElementById('carbonComparisonChart').getContext('2d');
        carbonComparisonChart = new Chart(ctxCarbonComparison, {
            type: 'bar',
            data: {
                labels: ['Carbón', 'Petróleo', 'Gas Natural', 'Gas Asociado (Este Proyecto)', 'Solar', 'Eólica'],
                datasets: [{
                    label: 'Intensidad de Carbono (kg CO₂/MWh)',
                    data: [900, 700, 400, datosProtegidos.intensidadCarbono, 50, 15],
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
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'kg CO₂/MWh'
                        }
                    }
                }
            }
        });
        
        // Gráfico de composición de emisiones
        if (emissionsCompositionChart) {
            emissionsCompositionChart.destroy();
        }
        
        const ctxEmissionsComposition = document.getElementById('emissionsCompositionChart').getContext('2d');
        emissionsCompositionChart = new Chart(ctxEmissionsComposition, {
            type: 'doughnut',
            data: {
                labels: ['CO₂', 'NOx', 'SO₂', 'CH₄'],
                datasets: [{
                    data: [
                        datosProtegidos.emisionesCO2,
                        datosProtegidos.emisionesNOx,
                        datosProtegidos.emisionesSO2,
                        datosProtegidos.emisionesCH4
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
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }
}

// Exportar gráfico como imagen
function exportarGrafico(chartId) {
    const canvas = document.getElementById(chartId);
    const imgData = canvas.toDataURL('image/png');
    
    // Crear un enlace temporal para descargar la imagen
    const a = document.createElement('a');
    a.href = imgData;
    a.download = `Grafico_${chartId}.png`;
    a.click();
    
    mostrarNotificacion("Gráfico exportado como imagen");
}
