// Fix-All.js - Script para corregir problemas de navegación y cálculos
// Este script debe incluirse después de todos los scripts existentes

(function() {
    console.log("⚠️ Fix-All script ejecutándose");

    // 1. Verificar y corregir función cambiarPestana
    if (typeof window.cambiarPestana !== 'function') {
        console.log("🔧 Implementando función cambiarPestana");
        
        window.cambiarPestana = function(tabId) {
            console.log("Cambiando a pestaña:", tabId);
            
            // Quitar clase active de todas las pestañas
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Quitar clase active de todos los contenidos
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Activar la pestaña seleccionada
            document.querySelector(`.tab[onclick="cambiarPestana('${tabId}')"]`).classList.add('active');
            
            // Mostrar el contenido de la pestaña seleccionada
            const tabContent = document.getElementById(tabId);
            tabContent.classList.add('active');
            tabContent.style.display = 'block';
            
            // Si hay resultados calculados, actualizar los gráficos
            if (window.ultimosResultados && typeof window.actualizarGraficos === 'function') {
                console.log("Actualizando gráficos para la pestaña:", tabId);
                window.actualizarGraficos(window.ultimosResultados);
            }
        };
    }
    
    // 2. Implementar reemplazo básico de la función calcular si no existe o no funciona correctamente
    const originalCalcular = window.calcular;
    window.calcular = function() {
        console.log("Ejecutando función calcular mejorada");
        
        try {
            // Intentar usar la función original primero
            if (typeof originalCalcular === 'function') {
                originalCalcular();
            }
            
            // Verificar si se generaron resultados
            if (!window.ultimosResultados || !window.ultimosResultados.gasExtraido) {
                console.log("La función original no generó resultados, usando cálculos de respaldo");
                
                // Obtener valores de entrada básicos
                const pozosActivos = parseInt(document.getElementById('pozos').value) || 5;
                const gasDisponible = parseInt(document.getElementById('gas').value) || 100;
                const GOR = parseInt(document.getElementById('gor').value) || 1000;
                const eficienciaSeparacion = parseInt(document.getElementById('sep').value) || 85;
                const eficienciaCompresion = parseInt(document.getElementById('comp').value) || 90;
                const eficienciaTurbina = parseInt(document.getElementById('turb').value) || 38;
                const precioElectricidad = parseInt(document.getElementById('precio').value) || 75;
                const costoOperativo = parseInt(document.getElementById('costo').value) || 15;
                
                // Cálculos básicos
                const gasExtraido = gasDisponible * pozosActivos;
                const gasSeparado = gasExtraido * (eficienciaSeparacion/100);
                const gasComprimido = gasSeparado * (eficienciaCompresion/100);
                const gasNoUtilizado = gasExtraido - gasComprimido;
                
                // Energía
                const energiaTermica = gasComprimido * 10; // Simplificación
                const energiaElectrica = energiaTermica * (eficienciaTurbina/100);
                const perdidas = energiaElectrica * 0.05;
                const energiaEntregada = energiaElectrica - perdidas;
                
                // Económicos
                const ingresos = energiaEntregada * (precioElectricidad / 1000);
                const gastos = energiaEntregada * (costoOperativo / 1000);
                const beneficio = ingresos - gastos;
                
                // Actualizar interfaz básica
                document.getElementById('gasExtraido').textContent = gasExtraido.toFixed(2) + " miles m³/día";
                document.getElementById('gasComprimido').textContent = gasComprimido.toFixed(2) + " miles m³/día";
                document.getElementById('petroDiario').textContent = (gasExtraido * 35.3147 / GOR).toFixed(0) + " bbl/día";
                document.getElementById('energiaGenerada').textContent = energiaElectrica.toFixed(2) + " MWh/día";
                document.getElementById('energiaEntregada').textContent = energiaEntregada.toFixed(2) + " MWh/día";
                
                document.getElementById('ingresos').textContent = ingresos.toFixed(2) + " USD/día";
                document.getElementById('costos').textContent = gastos.toFixed(2) + " USD/día";
                document.getElementById('beneficio').textContent = beneficio.toFixed(2) + " USD/día";
                
                // Emisiones
                const emisionesCO2 = gasComprimido * 2.1;
                const emisionesNOx = gasComprimido * 0.05;
                const emisionesSO2 = gasComprimido * 0.02;
                
                document.getElementById('co2').textContent = emisionesCO2.toFixed(1) + " kg/día";
                document.getElementById('nox').textContent = emisionesNOx.toFixed(1) + " kg/día";
                document.getElementById('so2').textContent = emisionesSO2.toFixed(1) + " kg/día";
                
                // Guardar resultados para gráficos
                window.ultimosResultados = {
                    gasExtraido: gasExtraido,
                    gasSeparado: gasSeparado,
                    gasComprimido: gasComprimido,
                    gasNoUtilizado: gasNoUtilizado,
                    energiaTermica: energiaTermica,
                    energiaElectrica: energiaElectrica,
                    perdidas: perdidas,
                    energiaEntregada: energiaEntregada,
                    ingresos: ingresos,
                    gastos: gastos,
                    beneficio: beneficio,
                    emisionesCO2: emisionesCO2,
                    emisionesNOx: emisionesNOx,
                    emisionesSO2: emisionesSO2,
                    produccionPetroleoDiaria: gasExtraido * 35.3147 / GOR
                };
            }
            
            // Actualizar gráficos
            if (typeof window.actualizarGraficos === 'function' && window.ultimosResultados) {
                try {
                    window.actualizarGraficos(window.ultimosResultados);
                } catch (error) {
                    console.error("Error al actualizar gráficos:", error);
                    // Si falla la función original, intentar usar nuestra implementación de respaldo
                    actualizarGraficosRespaldo(window.ultimosResultados);
                }
            } else if (window.ultimosResultados) {
                // Usar nuestra implementación de respaldo si la original no existe
                actualizarGraficosRespaldo(window.ultimosResultados);
            }
            
        } catch (error) {
            console.error("Error en función calcular:", error);
        }
    };
    
    // 3. Función de respaldo para actualizar gráficos
    function actualizarGraficosRespaldo(datos) {
        console.log("Usando función de respaldo para actualizar gráficos");
        
        try {
            // Actualizar solo los gráficos de la pestaña activa
            const activeTabId = document.querySelector('.tab-content.active').id;
            
            if (activeTabId === 'panel-principal') {
                actualizarGraficoProduccion(datos);
                actualizarGraficoEnergia(datos);
                actualizarGraficoFinanciero(datos);
                actualizarGraficoEmisiones(datos);
            }
            // Las otras pestañas se pueden implementar si es necesario
            
        } catch (error) {
            console.error("Error al actualizar gráficos de respaldo:", error);
        }
    }
    
    // Funciones para actualizar gráficos específicos
    function actualizarGraficoProduccion(datos) {
        if (!window.Chart || !document.getElementById('productionChart')) return;
        
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
    }
    
    function actualizarGraficoEnergia(datos) {
        if (!window.Chart || !document.getElementById('energyChart')) return;
        
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
                        datos.energiaTermica, 
                        datos.energiaElectrica, 
                        datos.perdidas, 
                        datos.energiaEntregada
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
                maintainAspectRatio: false
            }
        });
    }
    
    function actualizarGraficoFinanciero(datos) {
        if (!window.Chart || !document.getElementById('financialChart')) return;
        
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
                        data: [datos.ingresos],
                        backgroundColor: 'rgba(46, 204, 113, 0.7)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Costos',
                        data: [datos.gastos],
                        backgroundColor: 'rgba(231, 76, 60, 0.7)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Beneficio',
                        data: [datos.beneficio],
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    function actualizarGraficoEmisiones(datos) {
        if (!window.Chart || !document.getElementById('emissionsChart')) return;
        
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
                        datos.emisionesCO2, 
                        datos.emisionesNOx, 
                        datos.emisionesSO2
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
    }
    
    // 4. Asegurar que actualizarValor funciona correctamente
    const originalActualizarValor = window.actualizarValor;
    window.actualizarValor = function(id) {
        // Primero intentar usar la función original
        if (typeof originalActualizarValor === 'function') {
            try {
                originalActualizarValor(id);
                // Si llegamos aquí, la función original se ejecutó sin errores
                return;
            } catch (error) {
                console.error("Error en función original actualizarValor:", error);
                // Continuamos con nuestra implementación
            }
        }
        
        // Nuestra implementación de respaldo
        try {
            const element = document.getElementById(id);
            const valueElement = document.getElementById(id + 'Value');
            
            if (element && valueElement) {
                valueElement.textContent = element.value;
            }
            
            // Llamar a nuestra versión mejorada de calcular
            window.calcular();
        } catch (error) {
            console.error("Error en función actualizarValor de respaldo:", error);
        }
    };
    
    // 5. Ejecutar cálculo inicial
    setTimeout(function() {
        console.log("Ejecutando cálculo inicial desde Fix-All");
        window.calcular();
    }, 500);
    
    console.log("✅ Fix-All script completado");
})();
