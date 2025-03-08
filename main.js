// Constantes ambientales para diésel
const DIESEL_CO2_FACTOR = 2.68; // kg CO2/litro de diésel
const DIESEL_EFICIENCIA = 3.5; // kWh/litro de diésel (valor típico)
const DIESEL_NOX_FACTOR = 0.04; // kg NOx/litro de diésel
const DIESEL_SO2_FACTOR = 0.02; // kg SO2/litro de diésel

// Función principal de cálculo (extracto con las modificaciones para diésel)
function calcular() {
    // [Código existente...]
    
    // Obtener el costo de generación con diésel
    const costeDiesel = parseFloat(document.getElementById('costeDiesel').value);
    
    // [Código existente para cálculo de energía eléctrica...]
    
    // Cálculos comparativos con diésel
    // Costo diario con diésel
    const costoDiesel = energiaEntregadaKWh * costeDiesel; // USD/día
    
    // Ahorro económico al usar gas en lugar de diésel
    const ahorroDiesel = costoDiesel - ingresos; // USD/día
    const ahorroDieselAnual = ahorroDiesel * 365; // USD/año
    
    // Cálculos ambientales para diésel
    // Litros de diésel necesarios para generar la misma electricidad
    const litrosDiesel = energiaEntregadaKWh / DIESEL_EFICIENCIA; // litros/día
    
    // Emisiones de CO2 que se producirían con diésel
    const emisionesCO2Diesel = litrosDiesel * DIESEL_CO2_FACTOR; // kg CO2/día
    const emisionesNOxDiesel = litrosDiesel * DIESEL_NOX_FACTOR; // kg NOx/día
    const emisionesSO2Diesel = litrosDiesel * DIESEL_SO2_FACTOR; // kg SO2/día
    
    // CO2 evitado al usar gas en lugar de diésel
    const co2DieselEvitado = emisionesCO2Diesel - emisionesCO2; // kg CO2/día
    
    // Porcentaje de reducción de emisiones respecto a diésel
    const reduccionDiesel = (co2DieselEvitado / emisionesCO2Diesel) * 100; // %
    
    // Incluir en objetos de resultados
    ultimosResultados.economico.costoDiesel = costoDiesel;
    ultimosResultados.economico.ahorroDiesel = ahorroDiesel;
    ultimosResultados.economico.ahorroDieselAnual = ahorroDieselAnual;
    
    ultimosResultados.ambiental.emisionesCO2Diesel = emisionesCO2Diesel;
    ultimosResultados.ambiental.emisionesNOxDiesel = emisionesNOxDiesel;
    ultimosResultados.ambiental.emisionesSO2Diesel = emisionesSO2Diesel;
    ultimosResultados.ambiental.co2DieselEvitado = co2DieselEvitado;
    ultimosResultados.ambiental.reduccionDiesel = reduccionDiesel;
    
    // [Resto del código existente...]
    
    // Actualizar interfaz con resultados de comparación diésel
    document.getElementById('costoDiesel').textContent = costoDiesel.toFixed(2) + " USD/día";
    document.getElementById('ahorroDiesel').textContent = ahorroDiesel.toFixed(2) + " USD/día";
    document.getElementById('ahorroDieselAnual').textContent = ahorroDieselAnual.toFixed(0) + " USD/año";
    document.getElementById('co2DieselEvitado').textContent = co2DieselEvitado.toFixed(0) + " kg/día";
    document.getElementById('reduccionDiesel').textContent = reduccionDiesel.toFixed(1) + " %";
    
    // [Resto del código existente...]
}

// Resetear parámetros a valores por defecto (modificado para incluir costeDiesel)
function resetearParametros() {
    // [Código existente...]
    document.getElementById('costeDiesel').value = 0.31;
    document.getElementById('costeDieselValue').textContent = 0.31;
    // [Resto del código existente...]
}
// Constantes de conversión
const M3_A_PIES3 = 35.3147; // 1 m³ = 35.3147 pies³
const KG_A_TON = 0.001;     // 1 kg = 0.001 toneladas
const BTU_A_KCAL = 0.252;   // 1 BTU = 0.252 kcal
const SCF_A_M3 = 0.0283;    // 1 SCF (pie cúbico estándar) = 0.0283 m³

// Constantes de costos y precios (valores típicos de la industria)
const COSTO_CAPITAL_KW = 800;  // USD/kW instalado - valor realista
const FACTOR_PLANTA = 0.85;    // Factor de planta típico
const VIDA_UTIL = 20;          // Años de vida útil

// Variables de estado
let unidadesImperiales = false;
let configuracionesGuardadas = JSON.parse(localStorage.getItem('configuraciones') || '[]');
let ultimosResultados = {}; // Para almacenar los resultados más recientes
let flujoCalculado = false; // Para controlar el cálculo del flujo solo una vez por operación

// Función para actualizar el valor mostrado al mover los sliders
function actualizarValor(id) {
    document.getElementById(id + 'Value').textContent = document.getElementById(id).value;
    flujoCalculado = false; // Resetear la bandera de cálculo cuando cambia algún valor
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
    document.getElementById('precio').value = 80;  // Ajustado a un valor más realista (USD/MWh)
    document.getElementById('costo').value = 15;
    document.getElementById('pc').value = 1400;    // Valor predeterminado para poder calorífico
    
    // Actualizar los valores mostrados
    document.getElementById('pozosValue').textContent = 5;
    document.getElementById('gasValue').textContent = 100;
    document.getElementById('gorValue').textContent = 1000;
    document.getElementById('sepValue').textContent = 85;
    document.getElementById('compValue').textContent = 90;
    document.getElementById('turbValue').textContent = 38;
    document.getElementById('precioValue').textContent = 80;  // Actualizado
    document.getElementById('costoValue').textContent = 15;
    document.getElementById('pcValue').textContent = 1400;    // Actualizado
    
    flujoCalculado = false;
    calcular();
    mostrarNotificacion("Parámetros restablecidos");
}

// Función principal de cálculo
function calcular() {
    // Obtener valores de entrada
    const pozosActivos = parseInt(document.getElementById('pozos').value);
    const gasDisponible = parseInt(document.getElementById('gas').value); // miles de m³/día
    const GOR = parseInt(document.getElementById('gor').value);
    const eficienciaSeparacion = parseInt(document.getElementById('sep').value);
    const eficienciaCompresion = parseInt(document.getElementById('comp').value);
    const eficienciaTurbina = parseInt(document.getElementById('turb').value);
    const precioElectricidad = parseInt(document.getElementById('precio').value);
    const costoOperativo = parseInt(document.getElementById('costo').value);
    const poderCalorificopc = parseInt(document.getElementById('pc').value); // BTU/SCF
    
    // Determinar si necesitamos recalcular el flujo
    if (!flujoCalculado) {
        // Cálculos para el proceso - con unidades en miles de m³/día
        const gasExtraido = gasDisponible * pozosActivos; // miles de m³/día
        const gasSeparado = gasExtraido * (eficienciaSeparacion/100);
        const gasComprimido = gasSeparado * (eficienciaCompresion/100);
        
        // Guardar estos valores para referencia en toda la aplicación
        window.datosFlujo = {
            gasExtraido,
            gasSeparado,
            gasComprimido,
            gasNoUtilizado: gasExtraido - gasComprimido
        };
        
        flujoCalculado = true;
    }
    
    // Recuperar valores del flujo calculado
    const { gasExtraido, gasSeparado, gasComprimido, gasNoUtilizado } = window.datosFlujo;
    
    // Convertir de miles de m³/día a m³/día para los cálculos energéticos
    const gasComprimidoM3 = gasComprimido * 1000; // Convertir a m³/día
    
    // Conversión de poder calorífico de BTU/SCF a kcal/m³
    // 1 BTU/SCF = (BTU/SCF) × (0.252 kcal/BTU) ÷ (0.0283 m³/SCF) = 8.9 × (BTU/SCF) kcal/m³
    const poderCalorifico = poderCalorificopc * BTU_A_KCAL / SCF_A_M3; // kcal/m³
    
    // Conversión de energía (valor preciso)
    const factorConversion = 0.00116222; // 1 kcal = 0.00116222 kWh
    
    // Cálculo de energía térmica en kWh
    const energiaTermicaKWh = gasComprimidoM3 * poderCalorifico * factorConversion; // kWh/día
    
    // Cálculo de energía eléctrica generada
    const energiaElectricaKWh = energiaTermicaKWh * (eficienciaTurbina/100);
    
    // Pérdidas en transmisión (5%)
    const perdidasKWh = energiaElectricaKWh * 0.05;
    
    // Energía final entregada
    const energiaEntregadaKWh = energiaElectricaKWh - perdidasKWh;
    
    // Convertir a MWh para mostrar en la interfaz
    const energiaTermica = energiaTermicaKWh / 1000; // MWh/día
    const energiaElectrica = energiaElectricaKWh / 1000; // MWh/día
    const perdidas = perdidasKWh / 1000; // MWh/día
    const energiaEntregada = energiaEntregadaKWh / 1000; // MWh/día
    
    // Capacidad instalada (kW)
    const capacidadInstalada = energiaElectricaKWh / 24; // kW
    
    // Cálculos económicos ajustados
    const inversionInicial = capacidadInstalada * COSTO_CAPITAL_KW; // USD
    
    // Ingresos diarios
    const ingresos = energiaEntregadaKWh * (precioElectricidad / 1000); // USD/día
    
    // Costos operativos diarios (ajustados para ser más realistas)
    const costoFijo = inversionInicial * 0.02 / 365; // 2% anual de la inversión como costo fijo diario
    const costoVariable = energiaEntregadaKWh * (costoOperativo / 1000); // USD/día
    const gastos = costoFijo + costoVariable;
    
    // Beneficio diario
    const beneficio = ingresos - gastos;
    
    // ROI y punto de equilibrio
    const retornoInversion = (beneficio * 365 / inversionInicial) * 100; // % anual
    const breakeven = costoFijo / ((precioElectricidad - costoOperativo) / 1000); // kWh/día
    
    // Costos desglosados más realistas
    const costoCombustible = gasComprimido * 0.02; // USD/día - costo por disponibilidad
    const costoMantenimiento = capacidadInstalada * 0.015; // USD/día - típicamente 1.5% diario por kW instalado
    const costoPersonal = Math.min(capacidadInstalada * 0.01, pozosActivos * 20); // USD/día
    const otrosCostos = gastos * 0.08; // 8% de otros costos administrativos
    
    // Cálculos financieros anuales
    const ingresosAnuales = ingresos * 365;
    const gastosAnuales = gastos * 365;
    const beneficioAnual = beneficio * 365;
    
    // Cálculos de petróleo
    const gasExtraidoPies3 = gasExtraido * 1000 * M3_A_PIES3;
    const produccionPetroleoDiaria = gasExtraidoPies3 / GOR;
    
    // LCOE y otras métricas financieras ajustadas
    const lcoe = (inversionInicial / VIDA_UTIL + gastosAnuales) / (energiaEntregada * 365);
    const margenOperativo = (beneficio / ingresos) * 100;
    const precioEquilibrio = (costoFijo + costoVariable) / energiaEntregadaKWh * 1000; // USD/MWh
    const relacionBC = ingresos / gastos;
    
    // Payback period (años)
    const payback = inversionInicial / beneficioAnual;
    
    // Valor Actual Neto (VAN) con una tasa de descuento del 10%
    const tasaDescuento = 0.10;
    let van = -inversionInicial;
    for (let i = 1; i <= VIDA_UTIL; i++) {
        van += beneficioAnual / Math.pow(1 + tasaDescuento, i);
    }
    
    // Tasa Interna de Retorno (TIR) aproximada
    const tir = (beneficioAnual / inversionInicial) * 100;
    
    // Emisiones y residuos con factores más precisos
    // Factores de emisión para gas natural: CO2 = 2.1 kg/m³, NOx = 0.0018 kg/m³, SO2 = 0.00068 kg/m³
    // Ajustados según poder calorífico (relación con valor estándar de 9,400 kcal/m³)
    const factorAjuste = poderCalorifico / 9400;
    const emisionesCO2 = gasComprimidoM3 * 0.0021 * factorAjuste; // kg CO2/día
    const emisionesNOx = gasComprimidoM3 * 0.0000018 * factorAjuste; // kg NOx/día
    const emisionesSO2 = gasComprimidoM3 * 0.00000068 * factorAjuste; // kg SO2/día
    const emisionesCH4 = gasComprimidoM3 * 0.000001 * factorAjuste; // kg CH4/día (fugas)
    
    // Huella de carbono e impacto ambiental
    const intensidadCarbono = emisionesCO2 / energiaEntregada;
    const reduccionVsCarbon = 100 - (intensidadCarbono / 9);
    
    // Cálculos ambientales anuales
    const emisionesAnualesCO2 = emisionesCO2 * 365 * KG_A_TON;
    const emisionsAhorradasFlaring = gasExtraido * 1000 * 0.0028 * factorAjuste * 365 * KG_A_TON - emisionesAnualesCO2;
    const emisionsAhorradasCoal = (900 - intensidadCarbono) * energiaEntregada * 365 * KG_A_TON;
    const emisionsAhorradasOil = (700 - intensidadCarbono) * energiaEntregada * 365 * KG_A_TON;
    const emisionsAhorradasVenting = gasExtraido * 1000 * 0.0028 * 25 * factorAjuste * 365 * KG_A_TON - emisionesAnualesCO2; // CH4 tiene 25 veces más GWP
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
            costoOperativo,
            poderCalorificopc
        },
        produccion: {
            gasExtraido,
            gasSeparado,
            gasComprimido,
            gasNoUtilizado,
            produccionPetroleoDiaria,
            energiaTermica,
            energiaElectrica,
            energiaEntregada,
            capacidadInstalada,
            poderCalorifico
        },
        economico: {
            ingresos,
            gastos,
            beneficio,
            retornoInversion,
            breakeven: breakeven / 1000, // Convertido a MWh para mostrar
            ingresosAnuales,
            gastosAnuales,
            beneficioAnual,
            inversionInicial,
            van,
            tir,
            payback,
            lcoe,
            margenOperativo,
            precioEquilibrio,
            relacionBC,
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
    document.getElementById('capacidadInstalada').textContent = capacidadInstalada.toFixed(0) + " kW";
    document.getElementById('poderCalorifico').textContent = poderCalorifico.toFixed(0) + " kcal/m³";
    
    document.getElementById('ingresos').textContent = ingresos.toFixed(2) + " USD/día";
    document.getElementById('costos').textContent = gastos.toFixed(2) + " USD/día";
    document.getElementById('beneficio').textContent = beneficio.toFixed(2) + " USD/día";
    document.getElementById('beneficio').className = beneficio > 0 ? "value positive" : "value negative";
    document.getElementById('roi').textContent = retornoInversion.toFixed(1) + " %";
    document.getElementById('roi').className = retornoInversion > 0 ? "value positive" : "value negative";
    document.getElementById('breakeven').textContent = (breakeven / 1000).toFixed(2) + " MWh/día";
    
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
    document.getElementById('factor-planta').textContent = (FACTOR_PLANTA * 100) + " %";
    
    // Pestaña Financiera
    document.getElementById('ingresosAnuales').textContent = "$" + ingresosAnuales.toFixed(0);
    document.getElementById('costosAnuales').textContent = "$" + gastosAnuales.toFixed(0);
    document.getElementById('beneficioAnual').textContent = "$" + beneficioAnual.toFixed(0);
    document.getElementById('roiAnual').textContent = retornoInversion.toFixed(1) + "%";
    
    document.getElementById('inversion-inicial').textContent = "$" + inversionInicial.toFixed(0) + " USD";
    document.getElementById('van').textContent = "$" + van.toFixed(0) + " USD";
    document.getElementById('tir').textContent = tir.toFixed(1) + "%";
    document.getElementById('payback').textContent = payback.toFixed(1) + " años";
    
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
        gasNoUtilizado,
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
        intensidadCarbono,
        capacidadInstalada,
        poderCalorifico,
        poderCalorificopc
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
    // Inicializar los datos de flujo
    window.datosFlujo = {
        gasExtraido: 0,
        gasSeparado: 0,
        gasComprimido: 0,
        gasNoUtilizado: 0
    };
    
    calcular();
    // Cargar configuraciones guardadas del localStorage
    configuracionesGuardadas = JSON.parse(localStorage.getItem('configuraciones') || '[]');
});
