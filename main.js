// Constantes de conversión
const M3_A_PIES3 = 35.3147; // 1 m³ = 35.3147 pies³
const KG_A_TON = 0.001;     // 1 kg = 0.001 toneladas

// Constantes de costos y precios (valores típicos de la industria)
const COSTO_CAPITAL_KW = 800;  // USD/kW instalado - valor realista
const FACTOR_PLANTA = 0.85;    // Factor de planta típico
const VIDA_UTIL = 20;          // Años de vida útil

// Factores de emisión estandarizados
const FACTORES_EMISION = {
    // Factores precisos por m³ de gas
    CO2: 0.0021,      // kg CO2/m³ gas
    NOx: 0.0000018,   // kg NOx/m³ gas
    SO2: 0.00000068,  // kg SO2/m³ gas
    CH4: 0.000001,    // kg CH4/m³ gas (fugas)
    
    // Factores de referencia para comparación
    CARBON_CO2: 900,  // kg CO2/MWh
    PETROLEO_CO2: 700, // kg CO2/MWh
    GAS_NATURAL_CO2: 400, // kg CO2/MWh
    SOLAR_CO2: 50,     // kg CO2/MWh
    EOLICA_CO2: 15     // kg CO2/MWh
};

// Variables de estado
let unidadesImperiales = false;
let configuracionesGuardadas = JSON.parse(localStorage.getItem('configuraciones') || '[]');
let ultimosResultados = {}; // Para almacenar los resultados más recientes

// Función para actualizar el valor mostrado al mover los sliders
function actualizarValor(id) {
    document.getElementById(id + 'Value').textContent = document.getElementById(id).value;
    calcular(); // Recalcular automáticamente al cambiar cualquier valor
}

// Función modificada para cambiar entre pestañas
function cambiarPestana(id) {
    // Cambiar a la pestaña seleccionada
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
    
    // IMPORTANTE: NO LLAMAR A calcular() AQUÍ
    // Solo actualizar los gráficos de la pestaña actual sin recalcular valores
    actualizarGraficos(window.ultimosDatosCalculados || {});
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
    
    // Actualizar interfaz sin recalcular
    actualizarInterfazConResultados();
    
    // Actualizar gráficos de la pestaña actual
    const pestanaActiva = document.querySelector('.tab-content.active').id;
    actualizarGraficos(window.ultimosDatosCalculados || {});
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
    
    // Actualizar los valores mostrados
    document.getElementById('pozosValue').textContent = 5;
    document.getElementById('gasValue').textContent = 100;
    document.getElementById('gorValue').textContent = 1000;
    document.getElementById('sepValue').textContent = 85;
    document.getElementById('compValue').textContent = 90;
    document.getElementById('turbValue').textContent = 38;
    document.getElementById('precioValue').textContent = 80;  // Actualizado
    document.getElementById('costoValue').textContent = 15;
    
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
    
    // Cálculos para el proceso - SIN variación aleatoria
    const gasExtraido = gasDisponible * pozosActivos;
    const gasSeparado = gasExtraido * (eficienciaSeparacion/100);
    const gasComprimido = gasSeparado * (eficienciaCompresion/100);
    const gasNoUtilizado = gasExtraido - gasComprimido;
    
    // Convertir de miles de m³/día a m³/día para los cálculos energéticos
    const gasComprimidoM3 = gasComprimido * 1000; // Convertir a m³/día
    
    // Propiedades del gas
    const poderCalorifico = 9400; // kcal/m³
    
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
    
    // Emisiones y residuos con factores estandarizados
    const emisionesCO2 = gasComprimidoM3 * FACTORES_EMISION.CO2; // kg CO2/día
    const emisionesNOx = gasComprimidoM3 * FACTORES_EMISION.NOx; // kg NOx/día
    const emisionesSO2 = gasComprimidoM3 * FACTORES_EMISION.SO2; // kg SO2/día
    const emisionesCH4 = gasComprimidoM3 * FACTORES_EMISION.CH4; // kg CH4/día (fugas)
    
    // Huella de carbono e impacto ambiental
    const intensidadCarbono = emisionesCO2 / energiaEntregada;
    const reduccionVsCarbon = 100 - (intensidadCarbono / 9);
    
    // Cálculos ambientales anuales
    const emisionesAnualesCO2 = emisionesCO2 * 365 * KG_A_TON;
    const emisionsAhorradasFlaring = gasExtraido * 1000 * 0.0028 * 365 * KG_A_TON - emisionesAnualesCO2;
    const emisionsAhorradasCoal = (900 - intensidadCarbono) * energiaEntregada * 365 * KG_A_TON;
    const emisionsAhorradasOil = (700 - intensidadCarbono) * energiaEntregada * 365 * KG_A_TON;
    const emisionsAhorradasVenting = gasExtraido * 1000 * 0.0028 * 25 * 365 * KG_A_TON - emisionesAnualesCO2; // CH4 tiene 25 veces más GWP
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
            gasSeparado,
            gasComprimido,
            gasNoUtilizado,
            produccionPetroleoDiaria,
            energiaTermica,
            energiaElectrica,
            energiaEntregada,
            capacidadInstalada
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
    
    // Guardar los datos calculados para uso entre pestañas
    window.ultimosDatosCalculados = {
        gasExtraido: gasExtraido,
        gasSeparado: gasSeparado,
        gasComprimido: gasComprimido,
        gasNoUtilizado: gasNoUtilizado,
        produccionPetroleoDiaria: produccionPetroleoDiaria,
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
        emisionesCH4: emisionesCH4 || 0,
        costoCombustible: costoCombustible || 0,
        costoMantenimiento: costoMantenimiento || 0,
        costoPersonal: costoPersonal || 0,
        otrosCostos: otrosCostos || 0,
        intensidadCarbono: intensidadCarbono,
        capacidadInstalada: capacidadInstalada
    };
