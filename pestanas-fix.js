// verificar-graficos.js - Herramienta para diagnosticar y corregir problemas con los gráficos

// Función para verificar si se están creando correctamente los elementos canvas
function verificarCanvasGraficos() {
    console.log("Ejecutando verificación de canvas para gráficos...");
    
    // Verificar canvas en todas las pestañas
    const pestanas = ['panel-principal', 'proceso', 'financiero', 'ambiental'];
    let problemasEncontrados = false;
    
    pestanas.forEach(pestanaId => {
        const pestana = document.getElementById(pestanaId);
        if (!pestana) {
            console.error(`Pestaña no encontrada: ${pestanaId}`);
            problemasEncontrados = true;
            return;
        }
        
        // Verificar elementos canvas en esta pestaña
        const canvasElements = pestana.querySelectorAll('canvas');
        console.log(`Pestaña ${pestanaId}: ${canvasElements.length} elementos canvas encontrados`);
        
        if (canvasElements.length === 0) {
            console.error(`No se encontraron elementos canvas en la pestaña ${pestanaId}`);
            problemasEncontrados = true;
            
            // Intentar verificar si los contenedores existen
            const chartContainers = pestana.querySelectorAll('.chart-container');
            console.log(`Pestaña ${pestanaId}: ${chartContainers.length} contenedores de gráficos encontrados`);
            
            if (chartContainers.length === 0) {
                console.error(`No se encontraron contenedores de gráficos en la pestaña ${pestanaId}`);
            } else {
                // Verificar si hay divs para los canvas dentro de los contenedores
                chartContainers.forEach((container, index) => {
                    console.log(`Contenedor ${index} en ${pestanaId}:`, container.innerHTML);
                });
            }
        } else {
            // Verificar si los canvas tienen las dimensiones correctas
            canvasElements.forEach((canvas, index) => {
                console.log(`Canvas ${index} en ${pestanaId}: ${canvas.width}x${canvas.height}`);
                if (canvas.width === 0 || canvas.height === 0) {
                    console.warn(`Canvas ${index} en ${pestanaId} tiene dimensiones cero`);
                    problemasEncontrados = true;
                }
            });
        }
    });
    
    return !problemasEncontrados;
}

// Función para verificar si Chart.js está disponible y funcionando
function verificarChartJs() {
    console.log("Verificando disponibilidad de Chart.js...");
    
    if (typeof Chart !== 'function') {
        console.error("Chart.js no está disponible");
        return false;
    }
    
    try {
        // Intentar crear un gráfico de prueba
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const testChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Test'],
                datasets: [{
                    label: 'Test Dataset',
                    data: [1],
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }]
            }
        });
        
        // Limpiar
        testChart.destroy();
        document.body.removeChild(canvas);
        
        console.log("Chart.js está funcionando correctamente");
        return true;
    } catch (error) {
        console.error("Error al crear gráfico de prueba:", error);
        return false;
    }
}

// Función para crear gráficos manualmente si es necesario
function crearGraficosManualmente() {
    console.log("Intentando crear gráficos manualmente...");
    
    // Verificar si tenemos datos para trabajar
    if (!window.ultimosDatosCalculados || Object.keys(window.ultimosDatosCalculados).length === 0) {
        console.error("No hay datos disponibles para crear gráficos");
        return false;
    }
    
    // Intentar crear gráficos para cada pestaña
    try {
        // 1. Panel Principal
        crearGraficosPanelPrincipal();
        
        // 2. Proceso
        crearGraficosProceso();
        
        // 3. Financiero
        crearGraficosFinanciero();
        
        // 4. Ambiental
        crearGraficosAmbiental();
        
        console.log("Gráficos creados manualmente con éxito");
        return true;
    } catch (error) {
        console.error("Error al crear gráficos manualmente:", error);
        return false;
    }
}

// Función para crear gráficos del panel principal
function crearGraficosPanelPrincipal() {
    const datos = window.ultimosDatosCalculados;
    
    // 1. Gráfico de producción
    if (document.getElementById('productionChart')) {
        if (window.productionChart) window.productionChart.destroy();
        
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
                        borderWidth: 1
                    },
                    {
                        label: 'Petróleo (bbl/día)',
                        data: [datos.produccionPetroleoDiaria],
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        borderColor: 'rgba(75, 192, 192, 1)',
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
    
    // Implementar los otros gráficos del panel principal...
}

// Función para crear gráficos de proceso
function crearGraficosProceso() {
    const datos = window.ultimosDatosCalculados;
    
    // 1. Gráfico de flujo
    if (document.getElementById('flowChart')) {
        if (window.flowChart) window.flowChart.destroy();
        
        const ctx = document.getElementById('flowChart').getContext('2d');
        window.flowChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Gas Extraído', 'Gas Separado', 'Gas Comprimido', 'Gas No Utilizado'],
                datasets: [{
                    label: 'Volumen de Gas',
                    data: [
                        datos.gasExtraido,
                        datos.gasSeparado,
                        datos.gasComprimido,
                        datos.gasNoUtilizado
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
    }
    
    // Implementar otros gráficos de la pestaña de proceso...
}

// Función para crear gráficos financieros
function crearGraficosFinanciero() {
    // Implementar gráficos para la pestaña financiera...
}

// Función para crear gráficos ambientales
function crearGraficosAmbiental() {
    // Implementar gráficos para la pestaña ambiental...
}

// Función principal para ejecutar diagnóstico y solución
function diagnosticarYSolucionarGraficos() {
    console.log("Iniciando diagnóstico de gráficos...");
    
    // 1. Verificar disponibilidad de Chart.js
    const chartJsDisponible = verificarChartJs();
    if (!chartJsDisponible) {
        console.error("Chart.js no está disponible, no se pueden crear gráficos");
        mostrarMensajeError("No se pudo cargar la biblioteca Chart.js. Los gráficos no se mostrarán.");
        return false;
    }
    
    // 2. Verificar elementos canvas
    const canvasOK = verificarCanvasGraficos();
    if (!canvasOK) {
        console.warn("Problemas con los elementos canvas, intentando solucionar...");
    }
    
    // 3. Intentar crear gráficos manualmente
    const graficosCreados = crearGraficosManualmente();
    if (!graficosCreados) {
        console.error("No se pudieron crear los gráficos manualmente");
        mostrarMensajeError("No se pudieron crear los gráficos. Intente recargar la página.");
        return false;
    }
    
    console.log("Diagnóstico y solución de gráficos completados con éxito");
    return true;
}

// Función para mostrar mensaje de error
function mostrarMensajeError(mensaje) {
    // Verificar si ya existe un mensaje
    const mensajeExistente = document.getElementById('error-message-graficos');
    if (mensajeExistente) {
        mensajeExistente.textContent = mensaje;
        return;
    }
    
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.id = 'error-message-graficos';
    mensajeDiv.style.position = 'fixed';
    mensajeDiv.style.bottom = '20px';
    mensajeDiv.style.right = '20px';
    mensajeDiv.style.backgroundColor = '#f44336';
    mensajeDiv.style.color = 'white';
    mensajeDiv.style.padding = '10px 20px';
    mensajeDiv.style.borderRadius = '4px';
    mensajeDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    mensajeDiv.style.zIndex = '9999';
    mensajeDiv.style.maxWidth = '300px';
    
    mensajeDiv.textContent = mensaje;
    
    // Agregar botón para cerrar
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.style.marginLeft = '10px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.float = 'right';
    closeBtn.onclick = function() {
        document.body.removeChild(mensajeDiv);
    };
    
    mensajeDiv.appendChild(closeBtn);
    document.body.appendChild(mensajeDiv);
    
    // Auto-eliminar después de 10 segundos
    setTimeout(() => {
        if (document.body.contains(mensajeDiv)) {
            document.body.removeChild(mensajeDiv);
        }
    }, 10000);
}

// Ejecutar diagnóstico automáticamente después de un tiempo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(diagnosticarYSolucionarGraficos, 2000);
});
