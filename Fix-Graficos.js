// Fix-Graficos.js - Corrección específica para gráficos y cálculos faltantes
// Añade este script al final de todos los scripts

(function() {
    console.log("🔄 Fix-Graficos ejecutándose");
    
    // Verificar si existe la función actualizarGraficos original
    const originalActualizarGraficos = window.actualizarGraficos;
    
    // Reemplazar la función actualizarGraficos
    window.actualizarGraficos = function(datos) {
        console.log("📊 Actualizando gráficos con datos:", datos);
        
        try {
            // Llamar a la función original primero si existe
            if (typeof originalActualizarGraficos === 'function') {
                try {
                    originalActualizarGraficos(datos);
                } catch (error) {
                    console.error("Error en la función original actualizarGraficos:", error);
                }
            }
            
            // Verificar si los gráficos se crearon correctamente
            const pestanaActual = document.querySelector('.tab-content.active').id;
            console.log("Pestaña actual:", pestanaActual);
            
            // Actualizar gráficos según la pestaña activa
            if (pestanaActual === 'panel-principal') {
                actualizarGraficosPanelPrincipal(datos);
            } else if (pestanaActual === 'proceso') {
                actualizarGraficosProceso(datos);
            } else if (pestanaActual === 'financiero') {
                actualizarGraficosFinanciero(datos);
            } else if (pestanaActual === 'ambiental') {
                actualizarGraficosAmbiental(datos);
            }
        } catch (error) {
            console.error("Error en actualizarGraficos mejorado:", error);
        }
    };
    
    // Función para actualizar los gráficos del panel principal
    function actualizarGraficosPanelPrincipal(datos) {
        // Actualizar gráfico de producción
        if (document.getElementById('productionChart')) {
            try {
                if (window.productionChart) {
                    window.productionChart.destroy();
                }
                
                const ctx = document.getElementById('productionChart').getContext('2d');
                window.productionChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Producción Diaria'],
                        datasets: [
                            {
                                label: 'Gas (miles m³/día)',
                                data: [datos.gasExtraido],
                                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                                yAxisID: 'y'
                            },
                            {
                                label: 'Petróleo (bbl/día)',
                                data: [datos.produccionPetroleoDiaria],
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
                console.log("✅ Gráfico de producción actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico de producción:", error);
            }
        }
        
        // Actualizar gráfico de energía
        if (document.getElementById('energyChart')) {
            try {
                if (window.energyChart) {
                    window.energyChart.destroy();
                }
                
                const ctx = document.getElementById('energyChart').getContext('2d');
                window.energyChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
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
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                console.log("✅ Gráfico de energía actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico de energía:", error);
            }
        }
        
        // Actualizar gráfico financiero
        if (document.getElementById('financialChart')) {
            try {
                if (window.financialChart) {
                    window.financialChart.destroy();
                }
                
                const ctx = document.getElementById('financialChart').getContext('2d');
                window.financialChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
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
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                console.log("✅ Gráfico financiero actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico financiero:", error);
            }
        }
        
        // Actualizar gráfico de emisiones
        if (document.getElementById('emissionsChart')) {
            try {
                if (window.emissionsChart) {
                    window.emissionsChart.destroy();
                }
                
                const ctx = document.getElementById('emissionsChart').getContext('2d');
                window.emissionsChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
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
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                console.log("✅ Gráfico de emisiones actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico de emisiones:", error);
            }
        }
        
        // Actualizar gráfico de comparación de emisiones
        if (document.getElementById('emissionComparisonChart')) {
            try {
                if (window.emissionComparisonChart) {
                    window.emissionComparisonChart.destroy();
                }
                
                const ctx = document.getElementById('emissionComparisonChart').getContext('2d');
                window.emissionComparisonChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['CO₂', 'NOx', 'SO₂'],
                        datasets: [
                            {
                                label: 'Gas Natural (Este Proyecto)',
                                data: [
                                    datos.emisionesCO2 || 0,
                                    datos.emisionesNOx || 0,
                                    datos.emisionesSO2 || 0
                                ],
                                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                                borderColor: 'rgba(52, 152, 219, 1)',
                                borderWidth: 1
                            },
                            {
                                label: 'Generación con Diésel',
                                data: [
                                    datos.emisionesCO2Diesel || (datos.emisionesCO2 * 2) || 0,
                                    datos.emisionesNOxDiesel || (datos.emisionesNOx * 3) || 0,
                                    datos.emisionesSO2Diesel || (datos.emisionesSO2 * 5) || 0
                                ],
                                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                                borderColor: 'rgba(231, 76, 60, 1)',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                console.log("✅ Gráfico de comparación de emisiones actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico de comparación de emisiones:", error);
            }
        }
    }
    
    // Función para actualizar los gráficos de la pestaña de proceso
    function actualizarGraficosProceso(datos) {
        // Actualizar gráfico de flujo
        if (document.getElementById('flowChart')) {
            try {
                if (window.flowChart) {
                    window.flowChart.destroy();
                }
                
                const ctx = document.getElementById('flowChart').getContext('2d');
                window.flowChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
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
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                console.log("✅ Gráfico de flujo actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico de flujo:", error);
            }
        }
        
        // Actualizar gráfico de eficiencia
        if (document.getElementById('efficiencyChart')) {
            try {
                if (window.efficiencyChart) {
                    window.efficiencyChart.destroy();
                }
                
                // Obtener eficiencias de los sliders
                const sepEf = parseInt(document.getElementById('sep').value);
                const compEf = parseInt(document.getElementById('comp').value);
                const turbEf = parseInt(document.getElementById('turb').value);
                const transmissionEf = 95; // 5% de pérdidas
                const totalEf = (sepEf/100) * (compEf/100) * (turbEf/100) * (transmissionEf/100) * 100;
                
                const ctx = document.getElementById('efficiencyChart').getContext('2d');
                window.efficiencyChart = new Chart(ctx, {
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
                                max: 100
                            }
                        }
                    }
                });
                console.log("✅ Gráfico de eficiencia actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico de eficiencia:", error);
            }
        }
    }
    
    // Función para actualizar los gráficos de la pestaña financiera
    function actualizarGraficosFinanciero(datos) {
        // Gráfico de desglose de costos
        if (document.getElementById('costBreakdownChart')) {
            try {
                if (window.costBreakdownChart) {
                    window.costBreakdownChart.destroy();
                }
                
                // Calcular desglose de costos si no está disponible
                const costoCombustible = datos.costoCombustible || (datos.gastos * 0.2) || 0;
                const costoMantenimiento = datos.costoMantenimiento || (datos.gastos * 0.35) || 0;
                const costoPersonal = datos.costoPersonal || (datos.gastos * 0.30) || 0;
                const otrosCostos = datos.otrosCostos || (datos.gastos * 0.15) || 0;
                
                const ctx = document.getElementById('costBreakdownChart').getContext('2d');
                window.costBreakdownChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['Combustible', 'Mantenimiento', 'Personal', 'Otros'],
                        datasets: [{
                            data: [
                                costoCombustible,
                                costoMantenimiento,
                                costoPersonal,
                                otrosCostos
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
                        maintainAspectRatio: false
                    }
                });
                console.log("✅ Gráfico de desglose de costos actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico de desglose de costos:", error);
            }
        }
        
        // Gráfico de flujo de caja
        if (document.getElementById('cashFlowChart')) {
            try {
                if (window.cashFlowChart) {
                    window.cashFlowChart.destroy();
                }
                
                const ingresosBase = datos.ingresos || 100;
                const gastosBase = datos.gastos || 60;
                const beneficioBase = datos.beneficio || (ingresosBase - gastosBase);
                
                const ctx = document.getElementById('cashFlowChart').getContext('2d');
                window.cashFlowChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'],
                        datasets: [
                            {
                                label: 'Ingresos',
                                data: [
                                    ingresosBase * 365,
                                    ingresosBase * 365 * 1.02,
                                    ingresosBase * 365 * 1.04,
                                    ingresosBase * 365 * 1.06,
                                    ingresosBase * 365 * 1.08
                                ],
                                borderColor: 'rgba(46, 204, 113, 1)',
                                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                                borderWidth: 2,
                                fill: true
                            },
                            {
                                label: 'Costos',
                                data: [
                                    gastosBase * 365,
                                    gastosBase * 365 * 1.01,
                                    gastosBase * 365 * 1.02,
                                    gastosBase * 365 * 1.03,
                                    gastosBase * 365 * 1.04
                                ],
                                borderColor: 'rgba(231, 76, 60, 1)',
                                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                borderWidth: 2,
                                fill: true
                            },
                            {
                                label: 'Beneficio',
                                data: [
                                    beneficioBase * 365,
                                    beneficioBase * 365 * 1.03,
                                    beneficioBase * 365 * 1.06,
                                    beneficioBase * 365 * 1.09,
                                    beneficioBase * 365 * 1.12
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
                                beginAtZero: true
                            }
                        }
                    }
                });
                console.log("✅ Gráfico de flujo de caja actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico de flujo de caja:", error);
            }
        }
    }
    
    // Función para actualizar los gráficos de la pestaña ambiental
    function actualizarGraficosAmbiental(datos) {
        // Gráfico de comparación de intensidad de carbono
        if (document.getElementById('carbonComparisonChart')) {
            try {
                if (window.carbonComparisonChart) {
                    window.carbonComparisonChart.destroy();
                }
                
                const intensidadCarbono = datos.intensidadCarbono || 350;
                
                const ctx = document.getElementById('carbonComparisonChart').getContext('2d');
                window.carbonComparisonChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Carbón', 'Petróleo', 'Gas Natural', 'Gas Asociado (Este Proyecto)', 'Solar', 'Eólica'],
                        datasets: [{
                            label: 'Intensidad de Carbono (kg CO₂/MWh)',
                            data: [900, 700, 400, intensidadCarbono, 50, 15],
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
                                beginAtZero: true
                            }
                        }
                    }
                });
                console.log("✅ Gráfico de comparación de intensidad de carbono actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico de comparación de intensidad de carbono:", error);
            }
        }
        
        // Gráfico de composición de emisiones
        if (document.getElementById('emissionsCompositionChart')) {
            try {
                if (window.emissionsCompositionChart) {
                    window.emissionsCompositionChart.destroy();
                }
                
                const ctx = document.getElementById('emissionsCompositionChart').getContext('2d');
                window.emissionsCompositionChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['CO₂', 'NOx', 'SO₂', 'CH₄'],
                        datasets: [{
                            data: [
                                datos.emisionesCO2 || 200,
                                datos.emisionesNOx || 10,
                                datos.emisionesSO2 || 5,
                                datos.emisionesCH4 || 15
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
                        maintainAspectRatio: false
                    }
                });
                console.log("✅ Gráfico de composición de emisiones actualizado");
            } catch (error) {
                console.error("Error al actualizar gráfico de composición de emisiones:", error);
            }
        }
    }
    
    // Función para actualizar la interfaz con los resultados calculados
    function actualizarInterfazConResultados(datos) {
        // Actualizar valores en la interfaz si no están ya actualizados
        
        // Producción de gas
        if (document.getElementById('gasExtraido').textContent === "0 miles m³/día") {
            document.getElementById('gasExtraido').textContent = datos.gasExtraido.toFixed(2) + " miles m³/día";
        }
        
        if (document.getElementById('gasComprimido').textContent === "0 miles m³/día") {
            document.getElementById('gasComprimido').textContent = datos.gasComprimido.toFixed(2) + " miles m³/día";
        }
        
        if (document.getElementById('petroDiario').textContent === "0 bbl/día") {
            document.getElementById('petroDiario').textContent = datos.produccionPetroleoDiaria.toFixed(0) + " bbl/día";
        }
        
        if (document.getElementById('energiaGenerada').textContent === "0 MWh/día") {
            document.getElementById('energiaGenerada').textContent = datos.energiaElectrica.toFixed(2) + " MWh/día";
        }
        
        if (document.getElementById('energiaEntregada').textContent === "0 MWh/día") {
            document.getElementById('energiaEntregada').textContent = datos.energiaEntregada.toFixed(2) + " MWh/día";
        }
        
        // Financieros
        if (document.getElementById('ingresos').textContent === "0 USD/día") {
            document.getElementById('ingresos').textContent = datos.ingresos.toFixed(2) + " USD/día";
        }
        
        if (document.getElementById('costos').textContent === "0 USD/día") {
            document.getElementById('costos').textContent = datos.gastos.toFixed(2) + " USD/día";
        }
        
        if (document.getElementById('beneficio').textContent === "0 USD/día") {
            document.getElementById('beneficio').textContent = datos.beneficio.toFixed(2) + " USD/día";
        }
        
        // Emisiones
        if (document.getElementById('co2').textContent === "0 kg/día") {
            document.getElementById('co2').textContent = datos.emisionesCO2.toFixed(1) + " kg/día";
        }
        
        if (document.getElementById('nox').textContent === "0 kg/día") {
            document.getElementById('nox').textContent = datos.emisionesNOx.toFixed(1) + " kg/día";
        }
        
        if (document.getElementById('so2').textContent === "0 kg/día") {
            document.getElementById('so2').textContent = datos.emisionesSO2.toFixed(1) + " kg/día";
        }
        
        // Actualizar elementos en la pestaña de proceso si están disponibles
        try {
            if (document.getElementById('flowPozo') && document.getElementById('flowPozo').textContent === "0 miles m³/día") {
                document.getElementById('flowPozo').textContent = datos.gasExtraido.toFixed(2) + " miles m³/día";
            }
            
            if (document.getElementById('flowSeparador') && document.getElementById('flowSeparador').textContent === "0 miles m³/día") {
                document.getElementById('flowSeparador').textContent = datos.gasSeparado.toFixed(2) + " miles m³/día";
            }
            
            if (document.getElementById('flowCompresion') && document.getElementById('flowCompresion').textContent === "0 miles m³/día") {
                document.getElementById('flowCompresion').textContent = datos.gasComprimido.toFixed(2) + " miles m³/día";
            }
            
            if (document.getElementById('flowTurbina') && document.getElementById('flowTurbina').textContent === "0 MWh/día") {
                document.getElementById('flowTurbina').textContent = datos.energiaElectrica.toFixed(2) + " MWh/día";
            }
            
            if (document.getElementById('flowRed') && document.getElementById('flowRed').textContent === "0 MWh/día") {
                document.getElementById('flowRed').textContent = datos.energiaEntregada.toFixed(2) + " MWh/día";
            }
            
            if (document.getElementById('gasNoUtil') && document.getElementById('gasNoUtil').textContent === "0 miles m³/día") {
                document.getElementById('gasNoUtil').textContent = datos.gasNoUtilizado.toFixed(2) + " miles m³/día";
            }
        } catch (error) {
            console.error("Error al actualizar elementos en la pestaña de proceso:", error);
        }
        
        // Actualizar elementos en la pestaña financiera si están disponibles
        try {
            if (document.getElementById('costo-combustible') && document.getElementById('costo-combustible').textContent === "$0 USD/día") {
                document.getElementById('costo-combustible').textContent = "$" + datos.costoCombustible.toFixed(2) + " USD/día";
            }
            
            if (document.getElementById('costo-mantenimiento') && document.getElementById('costo-mantenimiento').textContent === "$0 USD/día") {
                document.getElementById('costo-mantenimiento').textContent = "$" + datos.costoMantenimiento.toFixed(2) + " USD/día";
            }
            
            if (document.getElementById('costo-personal') && document.getElementById('costo-personal').textContent === "$0 USD/día") {
                document.getElementById('costo-personal').textContent = "$" + datos.costoPersonal.toFixed(2) + " USD/día";
            }
            
            if (document.getElementById('otros-costos') && document.getElementById('otros-costos').textContent === "$0 USD/día") {
                document.getElementById('otros-costos').textContent = "$" + datos.otrosCostos.toFixed(2) + " USD/día";
            }
        } catch (error) {
            console.error("Error al actualizar elementos en la pestaña financiera:", error);
        }
    }
    
    // Verifica si la función calcular original genera resultados completos
    const originalCalcular = window.calcular;
    window.calcular = function() {
        console.log("🔄 Ejecutando función calcular mejorada");
        
        try {
            // Ejecutar la función original primero
            if (typeof originalCalcular === 'function') {
                originalCalcular();
            }
            
            // Verificar si hay resultados guardados
            if (!window.ultimosResultados) {
                window.ultimosResultados = {};
            }
            
            // Obtener valores de entrada
            const pozosActivos = parseInt(document.getElementById('pozos').value) || 5;
            const gasDisponible = parseInt(document.getElementById('gas').value) || 100;
            const GOR = parseInt(document.getElementById('gor').value) || 1000;
            const eficienciaSeparacion = parseInt(document.getElementById('sep').value) || 85;
            const eficienciaCompresion = parseInt(document.getElementById('comp').value) || 90;
            const eficienciaTurbina = parseInt(document.getElementById('turb').value) || 38;
            const precioElectricidad = parseInt(document.getElementById('precio').value) || 75;
            const costoOperativo = parseInt(document.getElementById('costo').value) || 15;
            
            // Completar cálculos faltantes
            // Cálculos básicos de flujo
            if (!window.ultimosResultados.gasExtraido) {
                window.ultimosResultados.gasExtraido = gasDisponible * pozosActivos;
            }
            
            if (!window.ultimosResultados.gasSeparado) {
                window.ultimosResultados.gasSeparado = window.ultimosResultados.gasExtraido * (eficienciaSeparacion/100);
            }
            
            if (!window.ultimosResultados.gasComprimido) {
                window.ultimosResultados.gasComprimido = window.ultimosResultados.gasSeparado * (eficienciaCompresion/100);
            }
            
            if (!window.ultimosResultados.gasNoUtilizado) {
                window.ultimosResultados.gasNoUtilizado = window.ultimosResultados.gasExtraido - window.ultimosResultados.gasComprimido;
            }
            
            // Cálculos de energía
            if (!window.ultimosResultados.energiaTermica) {
                window.ultimosResultados.energiaTermica = window.ultimosResultados.gasComprimido * 10; // Simplificación
            }
            
            if (!window.ultimosResultados.energiaElectrica) {
                window.ultimosResultados.energiaElectrica = window.ultimosResultados.energiaTermica * (eficienciaTurbina/100);
            }
            
            if (!window.ultimosResultados.perdidas) {
                window.ultimosResultados.perdidas = window.ultimosResultados.energiaElectrica * 0.05;
            }
            
            if (!window.ultimosResultados.energiaEntregada) {
                window.ultimosResultados.energiaEntregada = window.ultimosResultados.energiaElectrica - window.ultimosResultados.perdidas;
            }
            
            // Cálculos financieros
            if (!window.ultimosResultados.ingresos) {
                window.ultimosResultados.ingresos = window.ultimosResultados.energiaEntregada * (precioElectricidad / 1000);
            }
            
            if (!window.ultimosResultados.gastos) {
                window.ultimosResultados.gastos = window.ultimosResultados.energiaEntregada * (costoOperativo / 1000);
            }
            
            if (!window.ultimosResultados.beneficio) {
                window.ultimosResultados.beneficio = window.ultimosResultados.ingresos - window.ultimosResultados.gastos;
            }
            
            // Cálculos de emisiones
            if (!window.ultimosResultados.emisionesCO2) {
                window.ultimosResultados.emisionesCO2 = window.ultimosResultados.gasComprimido * 2.1;
            }
            
            if (!window.ultimosResultados.emisionesNOx) {
                window.ultimosResultados.emisionesNOx = window.ultimosResultados.gasComprimido * 0.05;
            }
            
            if (!window.ultimosResultados.emisionesSO2) {
                window.ultimosResultados.emisionesSO2 = window.ultimosResultados.gasComprimido * 0.02;
            }
            
            if (!window.ultimosResultados.emisionesCH4) {
                window.ultimosResultados.emisionesCH4 = window.ultimosResultados.gasComprimido * 0.03;
            }
            
            if (!window.ultimosResultados.intensidadCarbono) {
                window.ultimosResultados.intensidadCarbono = window.ultimosResultados.emisionesCO2 / window.ultimosResultados.energiaEntregada;
            }
            
            // Cálculos adicionales para comparación de emisiones con diésel
            if (!window.ultimosResultados.emisionesCO2Diesel) {
                window.ultimosResultados.emisionesCO2Diesel = window.ultimosResultados.energiaEntregada * 0.7;
            }
            
            if (!window.ultimosResultados.emisionesNOxDiesel) {
                window.ultimosResultados.emisionesNOxDiesel = window.ultimosResultados.energiaEntregada * 0.0025;
            }
            
            if (!window.ultimosResultados.emisionesSO2Diesel) {
                window.ultimosResultados.emisionesSO2Diesel = window.ultimosResultados.energiaEntregada * 0.0015;
            }
            
            // Cálculos económicos adicionales
            if (!window.ultimosResultados.costoCombustible) {
                window.ultimosResultados.costoCombustible = window.ultimosResultados.gastos * 0.2;
            }
            
            if (!window.ultimosResultados.costoMantenimiento) {
                window.ultimosResultados.costoMantenimiento = window.ultimosResultados.gastos * 0.35;
            }
            
            if (!window.ultimosResultados.costoPersonal) {
                window.ultimosResultados.costoPersonal = window.ultimosResultados.gastos * 0.30;
            }
            
            if (!window.ultimosResultados.otrosCostos) {
                window.ultimosResultados.otrosCostos = window.ultimosResultados.gastos * 0.15;
            }
            
            // Producción de petróleo
            if (!window.ultimosResultados.produccionPetroleoDiaria) {
                window.ultimosResultados.produccionPetroleoDiaria = window.ultimosResultados.gasExtraido * 35.3147 / GOR;
            }
            
            // Actualizar la interfaz con valores calculados
            actualizarInterfazConResultados(window.ultimosResultados);
            
            // Actualizar los gráficos
            window.actualizarGraficos(window.ultimosResultados);
        } catch (error) {
            console.error("Error en calcular mejorado:", error);
        }
    };
