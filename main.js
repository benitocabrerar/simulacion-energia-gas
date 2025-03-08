// Constantes de conversión
const M3_A_PIES3 = 35.3147; // 1 m³ = 35.3147 pies³
const KG_A_TON = 0.001;     // 1 kg = 0.001 toneladas
const BTU_A_KCAL = 0.252;   // 1 BTU = 0.252 kcal
const SCF_A_M3 = 0.0283;    // 1 SCF (pie cúbico estándar) = 0.0283 m³

// Constantes ambientales para diésel
const DIESEL_CO2_FACTOR = 2.68; // kg CO2/litro de diésel
const DIESEL_EFICIENCIA = 3.5; // kWh/litro de diésel (valor típico)
const DIESEL_NOX_FACTOR = 0.04; // kg NOx/litro de diésel
const DIESEL_SO2_FACTOR = 0.02; // kg SO2/litro de diésel

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
    document.getElementById('costeDiesel').value = 0.31; // Valor predeterminado para costo de diésel
    
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
    document.getElementById('costeDieselValue').textContent = 0.31; // Actualizado
    
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
    const costeDiesel = parseFloat(document.getElementById('costeDiesel').value); // USD/kWh
    
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
    
    // Cálculos comparativos con diésel
    // Costo diario con diésel
    const costoDiesel = energiaEntregadaKWh * costeDiesel; // USD/día
    
    // Ahorro económico al usar gas en lugar de diésel
    const ahorroDiesel = costoDiesel - ingresos; // USD/día
    const ahorroDieselAnual = ahorroDiesel * 365; // USD/año
    
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
    
    // Calcular el CO2 evitado anual en toneladas
    const co2DieselEvitadoAnual = co2DieselEvitado * 365 * KG_A_TON;
    
    // Equivalente en árboles para el CO2 evitado de diésel
    const arbolesDieselEquivalente = co2DieselEvitadoAnual * 42; // 1 ton CO2 = ~42 árboles/año
    
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
            poderCalorificopc,
            costeDiesel
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
            otrosCostos,
            costoDiesel,
            ahorroDiesel,
            ahorroDieselAnual
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
            equivalenteArboles,
            emisionesCO2Diesel,
            emisionesNOxDiesel,
            emisionesSO2Diesel,
            co2DieselEvitado,
            co2DieselEvitadoAnual,
            reduccionDiesel,
            arbolesDieselEquivalente
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
    
    // Actualizar resultados de comparación diésel
    document.getElementById('costoDiesel').textContent = costoDiesel.toFixed(2) + " USD/día";
    document.getElementById('ahorroDiesel').textContent = ahorroDiesel.toFixed(2) + " USD/día";
    document.getElementById('ahorroDieselAnual').textContent = ahorroDieselAnual.toFixed(0) + " USD/año";
    document.getElementById('co2DieselEvitado').textContent = co2DieselEvitado.toFixed(0) + " kg/día";
    document.getElementById('reduccionDiesel').textContent = reduccionDiesel.toFixed(1) + " %";
    
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
    
    // Actualizar pestaña ambiental con datos de diésel
    if (document.getElementById('co2-diesel')) {
        document.getElementById('co2-diesel').textContent = convertirEmisiones(emisionesCO2Diesel);
    }
    if (document.getElementById('nox-diesel')) {
        document.getElementById('nox-diesel').textContent = convertirEmisiones(emisionesNOxDiesel);
    }
    if (document.getElementById('so2-diesel')) {
        document.getElementById('so2-diesel').textContent = convertirEmisiones(emisionesSO2Diesel);
    }
    if (document.getElementById('co2-diesel-anual')) {
        document.getElementById('co2-diesel-anual').textContent = co2DieselEvitadoAnual.toFixed(0) + " ton CO₂/año";
    }
    if (document.getElementById('diesel-tree-equivalent')) {
        document.getElementById('diesel-tree-equivalent').textContent = arbolesDieselEquivalente.toFixed(0) + " árboles/año";
    }
    
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
        poderCalorificopc,
        emisionesCO2Diesel,
        emisionesNOxDiesel,
        emisionesSO2Diesel,
        co2DieselEvitado,
        reduccionDiesel
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
    document.getElementById('document.getElementById('modalExportar').style.display = 'block';
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

// Mostrar opciones de informe personalizado
function exportarInformePersonalizado() {
    document.getElementById('opcionesPersonalizadas').style.display = 'block';
}

// Exportar a PDF el informe completo
function exportarInforme() {
    mostrarNotificacion("Generando PDF, por favor espere...");
    
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
        });
}

// Generar informe personalizado
function generarInformePersonalizado() {
    mostrarNotificacion("Generando informe personalizado...");
    
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
        tempContainer.innerHTML += `<h2>${obtenerNombreSeccion(seccion)}</h2>`;
        tempContainer.innerHTML += seccionOriginal.innerHTML;
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
    
    const seccion = document.getElementById(seccionId);
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
        });
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

// Exportar todos los datos en formato CSV
function exportarDatosCompletos() {
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
        eficienciaSeparacion: "Eficiencia Separación (%)",
        eficienciaCompresion: "Eficiencia Compresión (%)",
        eficienciaTurbina: "Eficiencia Turbina (%)",
        precioElectricidad: "Precio Electricidad (USD/MWh)",
        costoOperativo: "Costo Operativo (USD/MWh)",
        poderCalorificopc: "Poder Calorífico (BTU/SCF)",
        costeDiesel: "Costo Electricidad Diésel (USD/kWh)",
        gasExtraido: "Gas Extraído (miles m³/día)",
        gasComprimido: "Gas Comprimido (miles m³/día)",
        produccionPetroleoDiaria: "Producción Petróleo (bbl/día)",
        energiaElectrica: "Energía Eléctrica (MWh/día)",
        energiaEntregada: "Energía Entregada (MWh/día)",
        capacidadInstalada: "Capacidad Instalada (kW)",
        poderCalorifico: "Poder Calorífico (kcal/m³)",
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
        costoDiesel: "Costo con Diésel (USD/día)",
        ahorroDiesel: "Ahorro Económico vs Diésel (USD/día)",
        ahorroDieselAnual: "Ahorro Anual vs Diésel (USD/año)",
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
        equivalenteArboles: "Equivalente en Árboles (árboles/año)",
        emisionesCO2Diesel: "Emisiones CO₂ Diésel (kg/día)",
        emisionesNOxDiesel: "Emisiones NOx Diésel (kg/día)",
        emisionesSO2Diesel: "Emisiones SO₂ Diésel (kg/día)",
        co2DieselEvitado: "CO₂ Evitado Diésel (kg/día)",
        co2DieselEvitadoAnual: "CO₂ Evitado Anual vs Diésel (ton/año)",
        reduccionDiesel: "Reducción vs Diésel (%)",
        arbolesDieselEquivalente: "Equivalente en Árboles vs Diésel (árboles/año)"
    };
    
    return nombresMapeados[key] || key;
}

// FUNCIONES DE GUARDAR/CARGAR CONFIGURACIÓN

// Guardar configuración actual
function guardarConfiguracion() {
    const nombre = document.getElementById('nombreConfig').value.trim();
    
    if (!nombre) {
        mostrarNotificacion("Debe ingresar un nombre para la configuración", "error");
        return;
    }
    
    // Obtener valores actuales
    const pozos = parseInt(document.getElementById('pozos').value);
    const gas = parseInt(document.getElementById('gas').value);
    const gor = parseInt(document.getElementById('gor').value);
    const sep = parseInt(document.getElementById('sep').value);
    const comp = parseInt(document.getElementById('comp').value);
    const turb = parseInt(document.getElementById('turb').value);
    const precio = parseInt(document.getElementById('precio').value);
    const costo = parseInt(document.getElementById('costo').value);
    const pc = parseInt(document.getElementById('pc').value);
    const costeDiesel = parseFloat(document.getElementById('costeDiesel').value);
    
    const configuracion = {
        id: Date.now(), // Usar timestamp como ID único
        nombre: nombre,
        fecha: new Date().toLocaleDateString(),
        valores: { pozos, gas, gor, sep, comp, turb, precio, costo, pc, costeDiesel }
    };
    
    // Añadir a la lista de configuraciones guardadas
    configuracionesGuardadas.push(configuracion);
    
    // Guardar en localStorage
    localStorage.setItem('configuraciones', JSON.stringify(configuracionesGuardadas));
    
    // Actualizar la interfaz
    document.getElementById('nombreConfig').value = '';
    actualizarListaConfiguraciones();
    mostrarNotificacion("Configuración guardada correctamente");
}

// Cargar configuración guardada
function cargarConfiguracion(id) {
    const configuracion = configuracionesGuardadas.find(c => c.id === id);
    
    if (!configuracion) {
        mostrarNotificacion("No se pudo encontrar la configuración", "error");
        return;
    }
    
    // Aplicar valores
    document.getElementById('pozos').value = configuracion.valores.pozos;
    document.getElementById('gas').value = configuracion.valores.gas;
    document.getElementById('gor').value = configuracion.valores.gor;
    document.getElementById('sep').value = configuracion.valores.sep;
    document.getElementById('comp').value = configuracion.valores.comp;
    document.getElementById('turb').value = configuracion.valores.turb;
    document.getElementById('precio').value = configuracion.valores.precio;
    document.getElementById('costo').value = configuracion.valores.costo;
    
    // Aplicar valores adicionales si existen
    if (configuracion.valores.pc) {
        document.getElementById('pc').value = configuracion.valores.pc;
    }
    if (configuracion.valores.costeDiesel) {
        document.getElementById('costeDiesel').value = configuracion.valores.costeDiesel;
    }
    
    // Actualizar los valores mostrados
    document.getElementById('pozosValue').textContent = configuracion.valores.pozos;
    document.getElementById('gasValue').textContent = configuracion.valores.gas;
    document.getElementById('gorValue').textContent = configuracion.valores.gor;
    document.getElementById('sepValue').textContent = configuracion.valores.sep;
    document.getElementById('compValue').textContent = configuracion.valores.comp;
    document.getElementById('turbValue').textContent = configuracion.valores.turb;
    document.getElementById('precioValue').textContent = configuracion.valores.precio;
    document.getElementById('costoValue').textContent = configuracion.valores.costo;
    
    // Actualizar valores adicionales mostrados
    if (configuracion.valores.pc) {
        document.getElementById('pcValue').textContent = configuracion.valores.pc;
    }
    if (configuracion.valores.costeDiesel) {
        document.getElementById('costeDieselValue').textContent = configuracion.valores.costeDiesel;
    }
    
    // Recalcular con los nuevos valores
    flujoCalculado = false;
    calcular();
    cerrarModal('modalConfiguracion');
    mostrarNotificacion(`Configuración "${configuracion.nombre}" cargada correctamente`);
}

// Eliminar configuración guardada
function eliminarConfiguracion(id) {
    configuracionesGuardadas = configuracionesGuardadas.filter(c => c.id !== id);
    localStorage.setItem('configuraciones', JSON.stringify(configuracionesGuardadas));
    actualizarListaConfiguraciones();
    mostrarNotificacion("Configuración eliminada correctamente");
}

// Actualizar la lista de configuraciones guardadas en la interfaz
function actualizarListaConfiguraciones() {
    const listaConfiguraciones = document.getElementById('listaConfiguraciones');
    
    if (configuracionesGuardadas.length === 0) {
        listaConfiguraciones.innerHTML = '<p>No hay configuraciones guardadas.</p>';
        return;
    }
    
    let html = '<ul class="config-list">';
    
    configuracionesGuardadas.forEach(config => {
        html += `
            <li class="config-item">
                <div>
                    <strong>${config.nombre}</strong>
                    <small style="display: block; color: #666;">${config.fecha}</small>
                </div>
                <div class="actions">
                    <button class="btn-primary" onclick="cargarConfiguracion(${config.id})"><i class="fas fa-upload"></i></button>
                    <button class="btn-tertiary" onclick="eliminarConfiguracion(${config.id})"><i class="fas fa-trash"></i></button>
                </div>
            </li>
        `;
    });
    
    html += '</ul>';
    listaConfiguraciones.innerHTML = html;
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
