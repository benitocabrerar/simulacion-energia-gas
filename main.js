// Constantes de conversión
const M3_A_PIES3 = 35.3147; // 1 m³ = 35.3147 pies³
const KG_A_TON = 0.001;     // 1 kg = 0.001 toneladas

// Variables de estado
let unidadesImperiales = false;
let configuracionesGuardadas = JSON.parse(localStorage.getItem('configuraciones') || '[]');
let ultimosResultados = {}; // Para almacenar los resultados más recientes

// Función para actualizar el valor mostrado al mover los sliders
function actualizarValor(id) {
    document.getElementById(id + 'Value').textContent = document.getElementById(id).value;
    calcular(); // Recalcular automáticamente al cambiar cualquier valor
}

// Cambiar entre pestañas
function cambiarPestana(id) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Seleccionar el tab correspondiente
    const tabs = document.querySelectorAll('.tab');
    for(let i = 0; i < tabs.length; i++) {
        if(tabs[i].getAttribute('onclick').includes(id)) {
            tabs[i].classList.add('active');
            break;
        }
    }
    
    // Recalcular la pestaña actual
    calcular();
}

// Convertir valores según unidades
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

// Cambiar entre unidades métricas e imperiales
function toggleUnidades() {
    unidadesImperiales = !unidadesImperiales;
    document.getElementById('btn-unidades').textContent = unidadesImperiales 
        ? "Usar Unidades Métricas" 
        : "Usar Unidades Imperiales";
    calcular();
}

// Resetear parámetros a valores por defecto
function resetearParametros() {
    document.getElementById('pozos').value = 5;
    document.getElementById('gas').value = 100;
    document.getElementById('gor').value = 1000;
    document.getElementById('sep').value = 85;
    document.getElementById('comp').value = 90;
    document.getElementById('turb').value = 38;
    document.getElementById('precio').value = 75;
    document.getElementById('costo').value = 15;
    
    // Actualizar los valores mostrados
    document.getElementById('pozosValue').textContent = 5;
    document.getElementById('gasValue').textContent = 100;
    document.getElementById('gorValue').textContent = 1000;
    document.getElementById('sepValue').textContent = 85;
    document.getElementById('compValue').textContent = 90;
    document.getElementById('turbValue').textContent = 38;
    document.getElementById('precioValue').textContent = 75;
    document.getElementById('costoValue').textContent = 15;
    
    calcular();
    mostrarNotificacion("Parámetros restablecidos");
}

// Función principal de cálculo
function calcular() {
    // Obtener valores de entrada
    const pozosActivos = parseInt(document.getElementById('pozos').value);
    const gasDisponible = parseInt(document.getElementById('gas').value);
    const GOR = parseInt(document.getElementById('gor').value);
    const eficienciaSeparacion = parseInt(document.getElementById('sep').value);
    const eficienciaCompresion = parseInt(document.getElementById('comp').value);
    const eficienciaTurbina = parseInt(document.getElementById('turb').value);
    const precioElectricidad = parseInt(document.getElementById('precio').value);
    const costoOperativo = parseInt(document.getElementById('costo').value);
    const costoCapital = 1200; // USD/kW instalado (valor fijo)
    
    // Variación aleatoria para simular fluctuaciones
    const variacion = 0.95 + Math.random() * 0.1;
    
    // Cálculos para el proceso
    const gasExtraido = gasDisponible * pozosActivos * variacion;
    const gasSeparado = gasExtraido * (eficienciaSeparacion/100) * variacion;
    const gasComprimido = gasSeparado * (eficienciaCompresion/100) * variacion;
    
    // Propiedades del gas
    const poderCalorifico = 9400; // kcal/m³
    const poderCalorificoTotal = gasComprimido * poderCalorifico;
    
    // Energía térmica y eléctrica
    const energiaTermica = gasComprimido * poderCalorifico * 0.00116; // Conversión a MWh
    const energiaElectrica = energiaTermica * (eficienciaTurbina/100);
    const perdidas = energiaElectrica * 0.05; // 5% de pérdidas
    const energiaEntregada = energiaElectrica - perdidas;
    
    // Cálculos económicos
    const ingresos = energiaEntregada * precioElectricidad;
    const gastos = energiaEntregada * costoOperativo + (costoCapital * energiaElectrica / 365 / 24);
    const beneficio = ingresos - gastos;
    const retornoInversion = (beneficio / gastos) * 100;
    
    // Punto de equilibrio
    const costoFijo = costoCapital * energiaElectrica / 365 / 24;
    const costoVariable = costoOperativo;
    const breakeven = costoFijo / (precioElectricidad - costoVariable);
    
    // Emisiones y residuos
    const emisionesCO2 = gasComprimido * 2.1; // kg CO2/m³ gas
    const emisionesNOx = gasComprimido * 0.005; // kg NOx/m³ gas
    const emisionesSO2 = gasComprimido * 0.001; // kg SO2/m³ gas
    const emisionesCH4 = gasComprimido * 0.003; // kg CH4/m³ gas (fugas)
    const gasNoUtilizado = gasExtraido - gasComprimido;
    const residuosCombustion = gasComprimido * 0.02; // 2% residuos
    
    // Cálculos de petróleo
    const gasExtraidoPies3 = gasExtraido * 1000 * M3_A_PIES3;
    const produccionPetroleoDiaria = gasExtraidoPies3 / GOR;
    
    // Huella de carbono
    const intensidadCarbono = emisionesCO2 / energiaEntregada;
    const reduccionVsCarbon = 100 - (intensidadCarbono / 9);
    
    // Cálculos financieros avanzados
    const ingresosAnuales = ingresos * 365;
    const gastosAnuales = gastos * 365;
    const beneficioAnual = beneficio * 365;
    const inversionInicial = energiaElectrica * 1000 * costoCapital; // USD
    
    // Costos desglosados
    const costoCombustible = gasComprimido * 0.05; // USD/día
    const costoMantenimiento = energiaElectrica * 3; // USD/día
    const costoPersonal = pozosActivos * 50; // USD/día
    const otrosCostos = gastos * 0.1; // USD/día
    
    // LCOE y otras métricas
    const lcoe = (inversionInicial / 20 + gastosAnuales) / (energiaEntregada * 365);
    const margenOperativo = (beneficio / ingresos) * 100;
    const precioEquilibrio = gastos / energiaEntregada;
    const relacionBC = ingresos / gastos;
    
    // Cálculos ambientales avanzados
    const emisionesAnualesCO2 = emisionesCO2 * 365 * KG_A_TON;
    const emisionsAhorradasFlaring = gasExtraido * 2.8 * 365 * KG_A_TON - emisionesAnualesCO2;
    const emisionsAhorradasCoal = (900 - intensidadCarbono) * energiaEntregada * 365 * KG_A_TON;
    const emisionsAhorradasOil = (700 - intensidadCarbono) * energiaEntregada * 365 * KG_A_TON;
    const emisionsAhorradasVenting = gasExtraido * 2.8 * 25 * 365 * KG_A_TON - emisionesAnualesCO2; // CH4 tiene 25 veces más GWP
    const equivalenteArboles = emisionsAhorradasFlaring * 42; // 1 ton CO2 = ~42 árboles/año
    
    // Guardar resultados para exportación
    ultimosResultados = {
        parametros: {
            pozosActivos,
            gasDisponible,
            GOR,
            eficienciaSeparacion,
            eficienciaCompresion,
            eficienciaTurbina,
            precioElectricidad,
            costoOperativo
        },
        produccion: {
            gasExtraido,
            gasComprimido,
            produccionPetroleoDiaria,
            energiaElectrica,
            energiaEntregada
        },
        economico: {
            ingresos,
            gastos,
            beneficio,
            retornoInversion,
            breakeven,
            ingresosAnuales,
            gastosAnuales,
            beneficioAnual,
            inversionInicial,
            lcoe,
            margenOperativo,
            costoCombustible,
            costoMantenimiento,
            costoPersonal,
            otrosCostos
        },
        ambiental: {
            emisionesCO2,
            emisionesNOx,
            emisionesSO2,
            emisionesCH4,
            intensidadCarbono,
            reduccionVsCarbon,
            emisionesAnualesCO2,
            emisionsAhorradasFlaring,
            emisionsAhorradasCoal,
            emisionsAhorradasOil,
            emisionsAhorradasVenting,
            equivalenteArboles
        }
    };
    
    // Actualizar interfaz con resultados
    // Panel Principal
    document.getElementById('gasExtraido').textContent = convertirGas(gasExtraido);
    document.getElementById('gasComprimido').textContent = convertirGas(gasComprimido);
    document.getElementById('petroDiario').textContent = produccionPetroleoDiaria.toFixed(0) + " bbl/día";
    document.getElementById('energiaGenerada').textContent = energiaElectrica.toFixed(2) + " MWh/día";
    document.getElementById('energiaEntregada').textContent = energiaEntregada.toFixed(2) + " MWh/día";
    
    document.getElementById('ingresos').textContent = ingresos.toFixed(2) + " USD/día";
    document.getElementById('costos').textContent = gastos.toFixed(2) + " USD/día";
    document.getElementById('beneficio').textContent = beneficio.toFixed(2) + " USD/día";
    document.getElementById('beneficio').className = beneficio > 0 ? "value positive" : "value negative";
    document.getElementById('roi').textContent = retornoInversion.toFixed(1) + " %";
    document.getElementById('roi').className = retornoInversion > 0 ? "value positive" : "value negative";
    document.getElementById('breakeven').textContent = breakeven.toFixed(2) + " MWh/día";
    
    document.getElementById('co2').textContent = convertirEmisiones(emisionesCO2);
    document.getElementById('nox').textContent = convertirEmisiones(emisionesNOx);
    document.getElementById('so2').textContent = convertirEmisiones(emisionesSO2);
    document.getElementById('carbon-intensity').textContent = intensidadCarbono.toFixed(1) + " kg CO₂/MWh";
    document.getElementById('carbon-reduction').textContent = reduccionVsCarbon.toFixed(1) + " %";
    
    // Pestaña de Proceso
    document.getElementById('flowPozo').textContent = convertirGas(gasExtraido);
    document.getElementById('flowSeparador').textContent = convertirGas(gasSeparado);
    document.getElementById('flowSepEf').textContent = "Ef: " + eficienciaSeparacion + "%";
    document.getElementById('flowCompresion').textContent = convertirGas(gasComprimido);
    document.getElementById('flowCompEf').textContent = "Ef: " + eficienciaCompresion + "%";
    document.getElementById('flowTurbina').textContent = energiaElectrica.toFixed(1) + " MWh/día";
    document.getElementById('flowTurbEf').textContent = "Ef: " + eficienciaTurbina + "%";
    document.getElementById('flowRed').textContent = energiaEntregada.toFixed(1) + " MWh/día";
    
    document.getElementById('co2-flow').textContent = convertirEmisiones(emisionesCO2);
    document.getElementById('nox-flow').textContent = convertirEmisiones(emisionesNOx);
    document.getElementById('so2-flow').textContent = convertirEmisiones(emisionesSO2);
    document.getElementById('gasNoUtil').textContent = convertirGas(gasNoUtilizado);
    
    document.getElementById('eficiencia-termica').textContent = eficienciaTurbina + " %";
    document.getElementById('rendimiento-electrico').textContent = (energiaEntregada / energiaTermica * 100).toFixed(1) + " %";
    document.getElementById('factor-planta').textContent = "85 %";
    
    // Pestaña Financiera
    document.getElementById('ingresosAnuales').textContent = "$" + ingresosAnuales.toFixed(0);
    document.getElementById('costosAnuales').textContent = "$" + gastosAnuales.toFixed(0);
    document.getElementById('beneficioAnual').textContent = "$" + beneficioAnual.toFixed(0);
    document.getElementById('roiAnual').textContent = retornoInversion.toFixed(1) + "%";
    
    document.getElementById('inversion-inicial').textContent = "$" + inversionInicial.toFixed(0) + " USD";
    document.getElementById('van').textContent = "$" + (beneficioAnual * 8).toFixed(0) + " USD"; // Simplificado
    document.getElementById('tir').textContent = (retornoInversion * 0.8).toFixed(1) + "%";
    document.getElementById('payback').textContent = (inversionInicial / beneficioAnual).toFixed(1) + " años";
    
    document.getElementById('costo-combustible').textContent = "$" + costoCombustible.toFixed(2) + " USD/día";
    document.getElementById('costo-mantenimiento').textContent = "$" + costoMantenimiento.toFixed(2) + " USD/día";
    document.getElementById('costo-personal').textContent = "$" + costoPersonal.toFixed(2) + " USD/día";
    document.getElementById('otros-costos').textContent = "$" + otrosCostos.toFixed(2) + " USD/día";
    
    document.getElementById('lcoe').textContent = lcoe.toFixed(2) + " USD/MWh";
    document.getElementById('margen-operativo').textContent = margenOperativo.toFixed(1) + "%";
    document.getElementById('precio-equilibrio').textContent = precioEquilibrio.toFixed(2) + " USD/MWh";
    document.getElementById('relacion-bc').textContent = relacionBC.toFixed(2);
    
    // Pestaña Ambiental
    document.getElementById('co2-annual').textContent = emisionesAnualesCO2.toFixed(0);
    document.getElementById('emissions-saved').textContent = emisionsAhorradasFlaring.toFixed(0);
    document.getElementById('carbon-intensity-full').textContent = intensidadCarbono.toFixed(1);
    document.getElementById('tree-equivalent').textContent = equivalenteArboles.toFixed(0);
    
    document.getElementById('co2-detail').textContent = convertirEmisiones(emisionesCO2);
    document.getElementById('nox-detail').textContent = convertirEmisiones(emisionesNOx);
    document.getElementById('so2-detail').textContent = convertirEmisiones(emisionesSO2);
    document.getElementById('ch4-detail').textContent = convertirEmisiones(emisionesCH4);
    
    document.getElementById('savings-coal').textContent = emisionsAhorradasCoal.toFixed(0) + " ton CO₂/año";
    document.getElementById('savings-oil').textContent = emisionsAhorradasOil.toFixed(0) + " ton CO₂/año";
    document.getElementById('savings-flaring').textContent = emisionsAhorradasFlaring.toFixed(0) + " ton CO₂/año";
    document.getElementById('savings-venting').textContent = emisionsAhorradasVenting.toFixed(0) + " ton CO₂/año";
    
    // Actualizar gráficos
    actualizarGraficos({
        gasExtraido, 
        gasSeparado,
        gasComprimido, 
        produccionPetroleoDiaria, 
        energiaTermica, 
        energiaElectrica, 
        perdidas, 
        energiaEntregada, 
        ingresos, 
        gastos, 
        beneficio, 
        emisionesCO2, 
        emisionesNOx, 
        emisionesSO2,
        emisionesCH4,
        costoCombustible,
        costoMantenimiento,
        costoPersonal,
        otrosCostos,
        intensidadCarbono
    });
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.getElementById('notificacion');
    
    // Establecer el color según el tipo
    if (tipo === 'error') {
        notificacion.style.backgroundColor = '#e74c3c';
    } else {
        notificacion.style.backgroundColor = '#2ecc71';
    }
    
    notificacion.textContent = mensaje;
    notificacion.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('show');
    }, 3000);
}

// Mostrar modal de exportación
function mostrarModalExportar() {
    document.getElementById('modalExportar').style.display = 'block';
}

// Mostrar modal de configuración
function mostrarModalConfiguracion() {
    document.getElementById('modalConfiguracion').style.display = 'block';
    actualizarListaConfiguraciones();
}

// Cerrar modal
function cerrarModal(id) {
    document.getElementById(id).style.display = 'none';
    if (id === 'modalExportar') {
        document.getElementById('opcionesPersonalizadas').style.display = 'none';
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    calcular();
    // Cargar configuraciones guardadas del localStorage
    configuracionesGuardadas = JSON.parse(localStorage.getItem('configuraciones') || '[]');
});
