// Mostrar opciones de informe personalizado
function exportarInformePersonalizado() {
    document.getElementById('opcionesPersonalizadas').style.display = 'block';
}

// Exportar a PDF el informe completo
function exportarInforme() {
    mostrarNotificacion("Generando PDF, por favor espere...");
    
    // Comprobar si la librería html2pdf está disponible
    if (typeof html2pdf !== 'function') {
        mostrarNotificacion("Error: No se ha cargado la biblioteca html2pdf. Agregue la dependencia al proyecto.", "error");
        return;
    }
    
    // Configuración para PDF
    const options = {
        margin: 10,
        filename: 'Informe_Simulador_Gas_Asociado.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Preparar contenido para PDF
    const container = document.querySelector('.container');
    
    // Asegurarse de que todas las pestañas sean visibles para la exportación
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('active');
        content.style.display = 'block';
    });
    
    // Añadir un encabezado para el informe
    const header = document.createElement('div');
    header.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px; padding: 10px; background-color: #f8f9fa; border-bottom: 1px solid #ddd;">
            <h1 style="margin-bottom: 5px;">Informe Completo: Simulador de Generación Eléctrica con Gas Asociado</h1>
            <p style="margin-top: 0; color: #666;">Fecha: ${new Date().toLocaleDateString()}</p>
        </div>
    `;
    container.prepend(header);
    
    // Generar PDF
    html2pdf().from(container).set(options)
        .save()
        .then(() => {
            // Restaurar el estado original
            container.removeChild(header);
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = '';
                content.classList.remove('active');
            });
            
            // Activar solo la pestaña actual
            document.querySelector('.tab.active').click();
            
            mostrarNotificacion("PDF generado correctamente");
            cerrarModal('modalExportar');
        })
        .catch(err => {
            mostrarNotificacion("Error al generar PDF: " + err.message, "error");
            // Restaurar el estado original en caso de error
            if (container.contains(header)) {
                container.removeChild(header);
            }
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = '';
                content.classList.remove('active');
            });
            
            // Activar solo la pestaña actual
            document.querySelector('.tab.active').click();
        });
}

// Generar informe personalizado
function generarInformePersonalizado() {
    mostrarNotificacion("Generando informe personalizado...");
    
    // Comprobar si la librería html2pdf está disponible
    if (typeof html2pdf !== 'function') {
        mostrarNotificacion("Error: No se ha cargado la biblioteca html2pdf. Agregue la dependencia al proyecto.", "error");
        return;
    }
    
    // Obtener secciones seleccionadas
    const seccionesSeleccionadas = Array.from(document.querySelectorAll('input[name="seccion"]:checked'))
        .map(checkbox => checkbox.value);
    
    if (seccionesSeleccionadas.length === 0) {
        mostrarNotificacion("Debe seleccionar al menos una sección", "error");
        return;
    }
    
    // Configuración para PDF
    const options = {
        margin: 10,
        filename: 'Informe_Personalizado_Gas_Asociado.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Crear un contenedor temporal para el informe personalizado
    const tempContainer = document.createElement('div');
    tempContainer.style.background = 'white';
    tempContainer.style.padding = '20px';
    tempContainer.style.maxWidth = '1200px';
    tempContainer.style.margin = '0 auto';
    
    // Añadir encabezado
    tempContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px; padding: 10px; background-color: #f8f9fa; border-bottom: 1px solid #ddd;">
            <h1 style="margin-bottom: 5px;">Informe Personalizado: Simulador de Generación Eléctrica con Gas Asociado</h1>
            <p style="margin-top: 0; color: #666;">Fecha: ${new Date().toLocaleDateString()}</p>
        </div>
    `;
    
    // Añadir las secciones seleccionadas
    seccionesSeleccionadas.forEach(seccion => {
        const seccionOriginal = document.getElementById(seccion);
        if (seccionOriginal) {
            tempContainer.innerHTML += `<h2>${obtenerNombreSeccion(seccion)}</h2>`;
            tempContainer.innerHTML += seccionOriginal.innerHTML;
        } else {
            console.error(`No se encontró la sección: ${seccion}`);
        }
    });
    
    // Añadir temporalmente el contenedor al documento
    document.body.appendChild(tempContainer);
    
    // Generar PDF
    html2pdf().from(tempContainer).set(options)
        .save()
        .then(() => {
            document.body.removeChild(tempContainer);
            mostrarNotificacion("PDF personalizado generado correctamente");
            cerrarModal('modalExportar');
        })
        .catch(err => {
            mostrarNotificacion("Error al generar PDF personalizado: " + err.message, "error");
            if (document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
            }
        });
}

// Obtener nombre legible de sección
function obtenerNombreSeccion(id) {
    switch(id) {
        case 'panel-principal': return 'Panel Principal';
        case 'proceso': return 'Flujo del Proceso';
        case 'financiero': return 'Análisis Financiero';
        case 'ambiental': return 'Huella Ambiental';
        default: return id;
    }
}

// Exportar sección específica a PDF
function exportarSeccion(seccionId) {
    mostrarNotificacion("Generando PDF de sección...");
    
    // Comprobar si la librería html2pdf está disponible
    if (typeof html2pdf !== 'function') {
        mostrarNotificacion("Error: No se ha cargado la biblioteca html2pdf. Agregue la dependencia al proyecto.", "error");
        return;
    }
    
    const seccion = document.getElementById(seccionId);
    if (!seccion) {
        mostrarNotificacion("Error: No se encontró la sección especificada.", "error");
        return;
    }
    
    const nombreSeccion = obtenerNombreSeccion(seccionId);
    
    const options = {
        margin: 10,
        filename: `Seccion_${nombreSeccion.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Crear un contenedor temporal para la sección
    const tempContainer = document.createElement('div');
    tempContainer.style.background = 'white';
    tempContainer.style.padding = '20px';
    tempContainer.style.maxWidth = '1200px';
    tempContainer.style.margin = '0 auto';
    
    // Añadir encabezado
    tempContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px; padding: 10px; background-color: #f8f9fa; border-bottom: 1px solid #ddd;">
            <h1 style="margin-bottom: 5px;">${nombreSeccion}: Simulador de Generación Eléctrica con Gas Asociado</h1>
            <p style="margin-top: 0; color: #666;">Fecha: ${new Date().toLocaleDateString()}</p>
        </div>
    `;
    
    tempContainer.innerHTML += seccion.innerHTML;
    
    // Añadir temporalmente el contenedor al documento
    document.body.appendChild(tempContainer);
    
    // Generar PDF
    html2pdf().from(tempContainer).set(options)
        .save()
        .then(() => {
            document.body.removeChild(tempContainer);
            mostrarNotificacion(`PDF de ${nombreSeccion} generado correctamente`);
        })
        .catch(err => {
            mostrarNotificacion("Error al generar PDF de sección: " + err.message, "error");
            if (document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
            }
        });
}

// Exportar todos los datos en formato CSV
function exportarDatosCompletos() {
    // Verificar que tengamos datos para exportar
    if (!ultimosResultados || Object.keys(ultimosResultados).length === 0) {
        mostrarNotificacion("No hay datos disponibles para exportar. Por favor, ejecute la simulación primero.", "error");
        return;
    }
    
    // Crear contenido CSV con todos los datos
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados para parámetros
    csvContent += "PARÁMETROS DE SIMULACIÓN\n";
    csvContent += "Parámetro,Valor\n";
    for (const [key, value] of Object.entries(ultimosResultados.parametros)) {
        csvContent += `${formatearNombreParametro(key)},${value}\n`;
    }
    
    // Encabezados para producción
    csvContent += "\nPRODUCCIÓN\n";
    csvContent += "Parámetro,Valor\n";
    for (const [key, value] of Object.entries(ultimosResultados.produccion)) {
        csvContent += `${formatearNombreParametro(key)},${value}\n`;
    }
    
    // Encabezados para económico
    csvContent += "\nANÁLISIS ECONÓMICO\n";
    csvContent += "Parámetro,Valor\n";
    for (const [key, value] of Object.entries(ultimosResultados.economico)) {
        csvContent += `${formatearNombreParametro(key)},${value}\n`;
    }
    
    // Encabezados para ambiental
    csvContent += "\nANÁLISIS AMBIENTAL\n";
    csvContent += "Parámetro,Valor\n";
    for (const [key, value] of Object.entries(ultimosResultados.ambiental)) {
        csvContent += `${formatearNombreParametro(key)},${value}\n`;
    }
    
    // Codificar para el navegador
    const encodedUri = encodeURI(csvContent);
    
    // Crear un enlace temporal para descargar el CSV
    const a = document.createElement('a');
    a.href = encodedUri;
    a.download = 'Datos_Completos_Simulacion.csv';
    a.click();
    
    mostrarNotificacion("Datos exportados en formato CSV");
    cerrarModal('modalExportar');
}

// Exportar parámetros en CSV
function exportarParametros() {
    if (!ultimosResultados || !ultimosResultados.parametros) {
        mostrarNotificacion("No hay parámetros disponibles para exportar. Por favor, ejecute la simulación primero.", "error");
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados
    csvContent += "Parámetro,Valor\n";
    
    // Datos
    for (const [key, value] of Object.entries(ultimosResultados.parametros)) {
        csvContent += `${formatearNombreParametro(key)},${value}\n`;
    }
    
    // Codificar y descargar
    const encodedUri = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encodedUri;
    a.download = 'Parametros_Simulacion.csv';
    a.click();
    
    mostrarNotificacion("Parámetros exportados en formato CSV");
}

// Exportar datos financieros en CSV
function exportarDatosFinancieros() {
    if (!ultimosResultados || !ultimosResultados.economico) {
        mostrarNotificacion("No hay datos financieros disponibles para exportar. Por favor, ejecute la simulación primero.", "error");
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados
    csvContent += "Parámetro,Valor\n";
    
    // Datos
    for (const [key, value] of Object.entries(ultimosResultados.economico)) {
        csvContent += `${formatearNombreParametro(key)},${value}\n`;
    }
    
    // Codificar y descargar
    const encodedUri = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encodedUri;
    a.download = 'Datos_Financieros_Simulacion.csv';
    a.click();
    
    mostrarNotificacion("Datos financieros exportados en formato CSV");
}

// Exportar datos ambientales en CSV
function exportarDatosAmbientales() {
    if (!ultimosResultados || !ultimosResultados.ambiental) {
        mostrarNotificacion("No hay datos ambientales disponibles para exportar. Por favor, ejecute la simulación primero.", "error");
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados
    csvContent += "Parámetro,Valor\n";
    
    // Datos
    for (const [key, value] of Object.entries(ultimosResultados.ambiental)) {
        csvContent += `${formatearNombreParametro(key)},${value}\n`;
    }
    
    // Codificar y descargar
    const encodedUri = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encodedUri;
    a.download = 'Datos_Ambientales_Simulacion.csv';
    a.click();
    
    mostrarNotificacion("Datos ambientales exportados en formato CSV");
}

// Formatear nombres de parámetros para CSV
function formatearNombreParametro(key) {
    // Mapeo de nombres clave a nombres legibles
    const nombresMapeados = {
        pozosActivos: "Pozos Activos",
        gasDisponible: "Gas Disponible (miles m³/día)",
        GOR: "GOR (pies³/bbl)",
        poderCalorifico: "Poder Calorífico (BTU/PCS)", // Agregado poder calorífico
        eficienciaSeparacion: "Eficiencia Separación (%)",
        eficienciaCompresion: "Eficiencia Compresión (%)",
        eficienciaTurbina: "Eficiencia Turbina (%)",
        precioElectricidad: "Precio Electricidad (USD/MWh)",
        costoOperativo: "Costo Operativo (USD/MWh)",
        gasExtraido: "Gas Extraído (miles m³/día)",
        gasComprimido: "Gas Comprimido (miles m³/día)",
        produccionPetroleoDiaria: "Producción Petróleo (bbl/día)",
        energiaElectrica: "Energía Eléctrica (MWh/día)",
        energiaEntregada: "Energía Entregada (MWh/día)",
        ingresos: "Ingresos (USD/día)",
        gastos: "Gastos (USD/día)",
        beneficio: "Beneficio (USD/día)",
        retornoInversion: "ROI (%)",
        breakeven: "Punto de Equilibrio (MWh/día)",
        ingresosAnuales: "Ingresos Anuales (USD/año)",
        gastosAnuales: "Gastos Anuales (USD/año)",
        beneficioAnual: "Beneficio Anual (USD/año)",
        inversionInicial: "Inversión Inicial (USD)",
        lcoe: "LCOE (USD/MWh)",
        margenOperativo: "Margen Operativo (%)",
        costoCombustible: "Costo Combustible (USD/día)",
        costoMantenimiento: "Costo Mantenimiento (USD/día)",
        costoPersonal: "Costo Personal (USD/día)",
        otrosCostos: "Otros Costos (USD/día)",
        emisionesCO2: "Emisiones CO₂ (kg/día)",
        emisionesNOx: "Emisiones NOx (kg/día)",
        emisionesSO2: "Emisiones SO₂ (kg/día)",
        emisionesCH4: "Emisiones CH₄ (kg/día)",
        intensidadCarbono: "Intensidad Carbono (kg CO₂/MWh)",
        reduccionVsCarbon: "Reducción vs Carbón (%)",
        emisionesAnualesCO2: "Emisiones Anuales CO₂ (ton/año)",
        emisionsAhorradasFlaring: "Emisiones Ahorradas vs Flaring (ton CO₂/año)",
        emisionsAhorradasCoal: "Emisiones Ahorradas vs Carbón (ton CO₂/año)",
        emisionsAhorradasOil: "Emisiones Ahorradas vs Petróleo (ton CO₂/año)",
        emisionsAhorradasVenting: "Emisiones Ahorradas vs Venteo (ton CO₂/año)",
        equivalenteArboles: "Equivalente en Árboles (árboles/año)"
    };
    
    return nombresMapeados[key] || key;
}
