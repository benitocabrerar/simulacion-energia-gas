// Constantes de conversión y variables globales
const M3_A_PIES3 = 35.3147;
const KG_A_TON = 0.001;
const BTU_A_KCAL = 0.252;
const SCF_A_M3 = 0.0283;
const COSTO_CAPITAL_KW = 800;
const FACTOR_PLANTA = 0.85;
const VIDA_UTIL = 20;

// Variables de estado
let unidadesImperiales = false;
let configuracionesGuardadas = [];
let ultimosResultados = {};
let flujoCalculado = false;

// Función para cambiar de pestaña (FUNCIÓN AÑADIDA)
function cambiarPestana(tabId) {
    console.log("Cambiando a pestaña:", tabId);
    
    // Quitar clase active de todas las pestañas y contenidos
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Activar la pestaña seleccionada
    const tabElement = document.querySelector(`.tab[onclick="cambiarPestana('${tabId}')"]`);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        tabContent.classList.add('active');
        tabContent.style.display = 'block';
    }
    
    // Actualizar gráficos si es necesario
    if (typeof actualizarGraficos === 'function' && ultimosResultados) {
        actualizarGraficos(ultimosResultados);
    }
}

// Función principal de cálculo - versión simplificada para debug
function calcular() {
    console.log("Función calcular() ejecutándose");
    
    try {
        // Obtener valores de entrada básicos con valores por defecto si hay error
        const pozosActivos = getInputValue('pozos', 5);
        const gasDisponible = getInputValue('gas', 100);
        const GOR = getInputValue('gor', 1000);
        const eficienciaSeparacion = getInputValue('sep', 85);
        const eficienciaCompresion = getInputValue('comp', 90);
        const eficienciaTurbina = getInputValue('turb', 38);
        const precioElectricidad = getInputValue('precio', 75);
        const costoOperativo = getInputValue('costo', 15);
        const poderCalorificopc = getInputValue('pc', 1400);
        const costeDiesel = getInputValue('costeDiesel', 0.31);
        
        console.log("Valores de entrada obtenidos:", {
            pozosActivos, gasDisponible, GOR, eficienciaSeparacion, 
            eficienciaCompresion, eficienciaTurbina, precioElectricidad, 
            costoOperativo, poderCalorificopc, costeDiesel
        });
        
        // Cálculos básicos para el flujo
        const gasExtraido = gasDisponible * pozosActivos;
        const gasSeparado = gasExtraido * (eficienciaSeparacion/100);
        const gasComprimido = gasSeparado * (eficienciaCompresion/100);
        const gasNoUtilizado = gasExtraido - gasComprimido;
        
        // Guardar datos de flujo
        window.datosFlujo = { gasExtraido, gasSeparado, gasComprimido, gasNoUtilizado };
        flujoCalculado = true;
        
        // Cálculos energéticos
        const gasComprimidoM3 = gasComprimido * 1000;
        const poderCalorifico = poderCalorificopc * BTU_A_KCAL / SCF_A_M3;
        const factorConversion = 0.00116222;
        
        const energiaTermicaKWh = gasComprimidoM3 * poderCalorifico * factorConversion;
        const energiaElectricaKWh = energiaTermicaKWh * (eficienciaTurbina/100);
        const perdidasKWh = energiaElectricaKWh * 0.05;
        const energiaEntregadaKWh = energiaElectricaKWh - perdidasKWh;
        
        const energiaTermica = energiaTermicaKWh / 1000;
        const energiaElectrica = energiaElectricaKWh / 1000;
        const perdidas = perdidasKWh / 1000;
        const energiaEntregada = energiaEntregadaKWh / 1000;
        
        // Cálculos económicos
        const capacidadInstalada = energiaElectricaKWh / 24;
        const inversionInicial = capacidadInstalada * COSTO_CAPITAL_KW;
        const ingresos = energiaEntregadaKWh * (precioElectricidad / 1000);
        
        const costoFijo = inversionInicial * 0.02 / 365;
        const costoVariable = energiaEntregadaKWh * (costoOperativo / 1000);
        const gastos = costoFijo + costoVariable;
        
        const beneficio = ingresos - gastos;
        const retornoInversion = (beneficio * 365 / inversionInicial) * 100;
        const breakeven = costoFijo / ((precioElectricidad - costoOperativo) / 1000);
        
        // Cálculos para el desglose de costos
        const costoCombustible = gastos * 0.10; // 10% del total
        const costoMantenimiento = gastos * 0.35; // 35% del total
        const costoPersonal = gastos * 0.40; // 40% del total
        const otrosCostos = gastos * 0.15; // 15% del total
        
        // Cálculos ambientales
        const factorAjuste = poderCalorifico / 9400;
        const emisionesCO2 = gasComprimidoM3 * 0.0021 * factorAjuste;
        const emisionesNOx = gasComprimidoM3 * 0.0000018 * factorAjuste;
        const emisionesSO2 = gasComprimidoM3 * 0.00000068 * factorAjuste;
        const emisionesCH4 = gasComprimidoM3 * 0.000001 * factorAjuste;
        
        const intensidadCarbono = emisionesCO2 / energiaEntregada;
        const reduccionVsCarbon = 100 - (intensidadCarbono / 9);
        
        // Cálculos para diésel
        const costoDieselDiario = energiaEntregadaKWh * costeDiesel;
        const ahorroDieselDiario = costoDieselDiario - ingresos;
        const ahorroDieselAnual = ahorroDieselDiario * 365;
        
        const emisionesCO2Diesel = energiaEntregadaKWh * 0.7;
        const emisionesNOxDiesel = energiaEntregadaKWh * 0.0025;
        const emisionesSO2Diesel = energiaEntregadaKWh * 0.0015;
        
        const co2DieselEvitado = emisionesCO2Diesel - emisionesCO2;
        const reduccionDiesel = (co2DieselEvitado / emisionesCO2Diesel) * 100;
        
        // Cálculos financieros adicionales
        const ingresosAnuales = ingresos * 365;
        const gastosAnuales = gastos * 365;
        const beneficioAnual = beneficio * 365;
        const lcoe = (inversionInicial / (energiaEntregadaKWh * 365 * VIDA_UTIL)) * 1000 + costoOperativo;
        const margenOperativo = (beneficio / ingresos) * 100;
        
        // Cálculos ambientales adicionales
        const emisionesAnualesCO2 = emisionesCO2 * 365 * KG_A_TON;
        const emisionsAhorradasFlaring = emisionesAnualesCO2 * 0.8;
        const emisionsAhorradasCoal = emisionesAnualesCO2 * 1.4;
        const emisionsAhorradasOil = emisionesAnualesCO2 * 0.9;
        const emisionsAhorradasVenting = emisionesAnualesCO2 * 2.5;
        const equivalenteArboles = emisionesAnualesCO2 * 40;
        
        // Guardar resultados para uso posterior
        ultimosResultados = {
            // Parámetros básicos
            gasExtraido, gasSeparado, gasComprimido, gasNoUtilizado,
            energiaTermica, energiaElectrica, perdidas, energiaEntregada,
            ingresos, gastos, beneficio, emisionesCO2, emisionesNOx, emisionesSO2,
            emisionesCH4, intensidadCarbono, capacidadInstalada, poderCalorifico,
            
            // Económicos
            inversionInicial, lcoe, margenOperativo, costoCombustible, 
            costoMantenimiento, costoPersonal, otrosCostos,
            ingresosAnuales, gastosAnuales, beneficioAnual,
            
            // Diésel y comparación
            emisionesCO2Diesel, emisionesNOxDiesel, emisionesSO2Diesel,
            co2DieselEvitado, reduccionDiesel, costoDieselDiario, 
            ahorroDieselDiario, ahorroDieselAnual,
            
            // Adicionales para el flujo de proceso
            produccionPetroleoDiaria: gasExtraido * 1000 * M3_A_PIES3 / GOR,
            
            // Ambientales adicionales
            emisionesAnualesCO2, emisionsAhorradasFlaring, emisionsAhorradasCoal,
            emisionsAhorradasOil, emisionsAhorradasVenting, equivalenteArboles
        };
        
        console.log("Cálculos básicos completados");
        
        // Actualizar la interfaz - producción
        updateElement('gasExtraido', convertirGas(gasExtraido));
        updateElement('gasComprimido', convertirGas(gasComprimido));
        updateElement('petroDiario', (gasExtraido * 1000 * M3_A_PIES3 / GOR).toFixed(0) + " bbl/día");
        updateElement('energiaGenerada', energiaElectrica.toFixed(2) + " MWh/día");
        updateElement('energiaEntregada', energiaEntregada.toFixed(2) + " MWh/día");
        updateElement('capacidadInstalada', capacidadInstalada.toFixed(0) + " kW");
        updateElement('poderCalorifico', poderCalorifico.toFixed(0) + " kcal/m³");
        
        // Actualizar economía
        updateElement('ingresos', ingresos.toFixed(2) + " USD/día");
        updateElement('costos', gastos.toFixed(2) + " USD/día");
        updateElement('beneficio', beneficio.toFixed(2) + " USD/día");
        updateElementWithClass('beneficio', beneficio > 0 ? "value positive" : "value negative");
        updateElement('roi', retornoInversion.toFixed(1) + " %");
        updateElementWithClass('roi', retornoInversion > 0 ? "value positive" : "value negative");
        updateElement('breakeven', (breakeven / 1000).toFixed(2) + " MWh/día");
        
        // Actualizar ambiental
        updateElement('co2', convertirEmisiones(emisionesCO2));
        updateElement('nox', convertirEmisiones(emisionesNOx));
        updateElement('so2', convertirEmisiones(emisionesSO2));
        updateElement('carbon-intensity', intensidadCarbono.toFixed(1) + " kg CO₂/MWh");
        updateElement('carbon-reduction', reduccionVsCarbon.toFixed(1) + " %");
        
        // Actualizar sección de diésel
        updateElement('costoDiesel', costoDieselDiario.toFixed(2) + " USD/día");
        updateElement('ahorroDiesel', ahorroDieselDiario.toFixed(2) + " USD/día");
        updateElement('ahorroDieselAnual', ahorroDieselAnual.toFixed(0) + " USD/año");
        updateElement('co2DieselEvitado', co2DieselEvitado.toFixed(1) + " kg/día");
        updateElement('reduccionDiesel', reduccionDiesel.toFixed(1) + " %");
        
        // Actualizar el panel de proceso
        updateElement('flowPozo', convertirGas(gasExtraido));
        updateElement('flowSeparador', convertirGas(gasSeparado));
        updateElement('flowCompresion', convertirGas(gasComprimido));
        updateElement('flowTurbina', energiaElectrica.toFixed(2) + " MWh/día");
        updateElement('flowRed', energiaEntregada.toFixed(2) + " MWh/día");
        updateElement('flowSepEf', `Ef: ${eficienciaSeparacion}%`);
        updateElement('flowCompEf', `Ef: ${eficienciaCompresion}%`);
        updateElement('flowTurbEf', `Ef: ${eficienciaTurbina}%`);
        updateElement('gasNoUtil', convertirGas(gasNoUtilizado));
        
        // Actualizar detalles financieros
        updateElement('ingresosAnuales', `$${ingresosAnuales.toFixed(0)}`);
        updateElement('costosAnuales', `$${gastosAnuales.toFixed(0)}`);
        updateElement('beneficioAnual', `$${beneficioAnual.toFixed(0)}`);
        updateElement('roiAnual', `${retornoInversion.toFixed(1)}%`);
        updateElement('inversion-inicial', `$${inversionInicial.toFixed(0)} USD`);
        updateElement('costo-combustible', `$${costoCombustible.toFixed(2)} USD/día`);
        updateElement('costo-mantenimiento', `$${costoMantenimiento.toFixed(2)} USD/día`);
        updateElement('costo-personal', `$${costoPersonal.toFixed(2)} USD/día`);
        updateElement('otros-costos', `$${otrosCostos.toFixed(2)} USD/día`);
        updateElement('lcoe', `${lcoe.toFixed(2)} USD/MWh`);
        updateElement('margen-operativo', `${margenOperativo.toFixed(1)}%`);
        
        // Actualizar ambiental detallado
        updateElement('co2-detail', convertirEmisiones(emisionesCO2));
        updateElement('nox-detail', convertirEmisiones(emisionesNOx));
        updateElement('so2-detail', convertirEmisiones(emisionesSO2));
        updateElement('ch4-detail', convertirEmisiones(emisionesCH4));
        updateElement('co2-annual', emisionesAnualesCO2.toFixed(1));
        updateElement('emissions-saved', emisionsAhorradasFlaring.toFixed(1));
        updateElement('carbon-intensity-full', intensidadCarbono.toFixed(1));
        updateElement('tree-equivalent', equivalenteArboles.toFixed(0));
        updateElement('savings-coal', emisionsAhorradasCoal.toFixed(1) + " ton CO₂/año");
        updateElement('savings-oil', emisionsAhorradasOil.toFixed(1) + " ton CO₂/año");
        updateElement('savings-flaring', emisionsAhorradasFlaring.toFixed(1) + " ton CO₂/año");
        updateElement('savings-venting', emisionsAhorradasVenting.toFixed(1) + " ton CO₂/año");
        
        // Actualizar los gráficos si la función existe
        if (typeof actualizarGraficos === 'function') {
            try {
                actualizarGraficos(ultimosResultados);
                console.log("Gráficos actualizados");
            } catch (error) {
                console.error("Error al actualizar gráficos:", error);
            }
        } else {
            console.warn("La función actualizarGraficos no está disponible");
        }
        
        console.log("Función calcular() completada con éxito");
        
    } catch (error) {
        console.error("Error en la función calcular():", error);
    }
}

// Funciones auxiliares
function getInputValue(id, defaultValue) {
    try {
        const element = document.getElementById(id);
        return element ? parseFloat(element.value) : defaultValue;
    } catch (error) {
        console.warn(`Error al obtener valor de ${id}, usando valor por defecto:`, defaultValue);
        return defaultValue;
    }
}

function updateElement(id, value) {
    try {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.warn(`Elemento con ID '${id}' no encontrado`);
        }
    } catch (error) {
        console.error(`Error al actualizar elemento ${id}:`, error);
    }
}

function updateElementWithClass(id, className) {
    try {
        const element = document.getElementById(id);
        if (element) {
            element.className = className;
        }
    } catch (error) {
        console.error(`Error al actualizar clase de ${id}:`, error);
    }
}

function convertirGas(valor) {
    if (unidadesImperiales) {
        return (valor * 1000 * M3_A_PIES3).toFixed(0) + " pies³/día";
    } else {
        return valor.toFixed(2) + " miles m³/día";
    }
}

function convertirEmisiones(valor) {
    if (unidadesImperiales) {
        return (valor * KG_A_TON).toFixed(3) + " ton/día";
    } else {
        return valor.toFixed(1) + " kg/día";
    }
}

// Resto de funciones con implementación mínima
function actualizarValor(id) {
    try {
        const element = document.getElementById(id);
        const valueElement = document.getElementById(id + 'Value');
        if (element && valueElement) {
            valueElement.textContent = element.value;
        }
        flujoCalculado = false;
        calcular();
    } catch (error) {
        console.error(`Error en actualizarValor(${id}):`, error);
    }
}

function toggleUnidades() {
    unidadesImperiales = !unidadesImperiales;
    try {
        const btnUnidades = document.getElementById('btn-unidades');
        if (btnUnidades) {
            btnUnidades.textContent = unidadesImperiales ? "Usar Unidades Métricas" : "Usar Unidades Imperiales";
        }
        calcular();
    } catch (error) {
        console.error("Error en toggleUnidades():", error);
    }
}

function resetearParametros() {
    try {
        // Resetear todos los sliders a valores por defecto
        const defaults = {
            'pozos': 5, 'gas': 100, 'gor': 1000, 'sep': 85, 'comp': 90, 
            'turb': 38, 'precio': 80, 'costo': 15, 'pc': 1400, 'costeDiesel': 0.31
        };
        
        for (const [id, value] of Object.entries(defaults)) {
            const element = document.getElementById(id);
            const valueElement = document.getElementById(id + 'Value');
            if (element && valueElement) {
                element.value = value;
                valueElement.textContent = value;
            }
        }
        
        flujoCalculado = false;
        calcular();
        mostrarNotificacion("Parámetros restablecidos");
    } catch (error) {
        console.error("Error en resetearParametros():", error);
    }
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    try {
        const notificacion = document.getElementById('notificacion');
        if (notificacion) {
            notificacion.style.backgroundColor = tipo === 'error' ? '#e74c3c' : '#2ecc71';
            notificacion.textContent = mensaje;
            notificacion.classList.add('show');
            
            setTimeout(() => {
                notificacion.classList.remove('show');
            }, 3000);
        }
    } catch (error) {
        console.error("Error en mostrarNotificacion():", error);
    }
}

// Funciones para modales - implementación mínima
function mostrarModalExportar() {
    mostrarModal('modalExportar');
}

function mostrarModalConfiguracion() {
    mostrarModal('modalConfiguracion');
}

function mostrarModal(id) {
    try {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'block';
        }
    } catch (error) {
        console.error(`Error al mostrar modal ${id}:`, error);
    }
}

function cerrarModal(id) {
    try {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
        }
    } catch (error) {
        console.error(`Error al cerrar modal ${id}:`, error);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente cargado y analizado");
    
    try {
        // Inicializar datos de flujo
        window.datosFlujo = {
            gasExtraido: 0,
            gasSeparado: 0,
            gasComprimido: 0,
            gasNoUtilizado: 0
        };
        
        // Ejecutar cálculo inicial
        console.log("Ejecutando cálculo inicial...");
        calcular();
        
        // Cargar configuraciones guardadas
        try {
            configuracionesGuardadas = JSON.parse(localStorage.getItem('configuraciones') || '[]');
            // Si existe la función para actualizar la lista, llamarla
            if (typeof actualizarListaConfiguraciones === 'function') {
                actualizarListaConfiguraciones();
            }
        } catch (error) {
            console.error("Error al cargar configuraciones guardadas:", error);
            configuracionesGuardadas = [];
        }
        
        console.log("Inicialización completada");
    } catch (error) {
        console.error("Error durante la inicialización:", error);
    }
});
