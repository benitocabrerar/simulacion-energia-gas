import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const SimulacionEnergiaGas = () => {
  // Estados para los parámetros configurables del usuario
  const [pozosActivos, setPozosActivos] = useState(5);
  const [gasDisponible, setGasDisponible] = useState(100); // Miles de m³/día
  const [eficienciaSeparacion, setEficienciaSeparacion] = useState(85); // %
  const [eficienciaCompresion, setEficienciaCompresion] = useState(90); // %
  const [eficienciaTurbina, setEficienciaTurbina] = useState(38); // %
  const [precioElectricidad, setPrecioElectricidad] = useState(75); // USD/MWh
  const [costoOperativo, setCostoOperativo] = useState(15); // USD/MWh
  const [costoCapital, setCostoCapital] = useState(1200); // USD/kW instalado
  const [verHistorico, setVerHistorico] = useState(false);
  const [unidadesImperiales, setUnidadesImperiales] = useState(false);
  const [GOR, setGOR] = useState(1000); // Gas-Oil Ratio: pies cúbicos de gas por barril de petróleo

  // Estados calculados basados en los parámetros
  const [datosProceso, setDatosProceso] = useState({});
  const [datosEconomicos, setDatosEconomicos] = useState({});
  const [datosEmisiones, setDatosEmisiones] = useState({});
  const [datosHistoricos, setDatosHistoricos] = useState([]);
  const [tiempoActual, setTiempoActual] = useState(0);
  const [datosPetroleo, setDatosPetroleo] = useState({});

  // Factores de conversión
  const M3_A_PIES3 = 35.3147; // 1 m³ = 35.3147 pies³
  const KG_A_TON = 0.001; // 1 kg = 0.001 toneladas

  // Actualiza los cálculos cuando cambian los parámetros
  useEffect(() => {
    calcularProceso();
    const timer = setInterval(() => {
      setTiempoActual(t => t + 1);
      agregarDatosHistoricos();
    }, 5000); // Actualizar cada 5 segundos
    
    return () => clearInterval(timer);
  }, [pozosActivos, gasDisponible, eficienciaSeparacion, eficienciaCompresion, eficienciaTurbina, 
      precioElectricidad, costoOperativo, costoCapital, tiempoActual, GOR]);

  // Calcula todos los parámetros del proceso
  const calcularProceso = () => {
    // Variación aleatoria pequeña para simular fluctuaciones
    const variacion = () => 0.95 + Math.random() * 0.1;
    
    // Cálculos para el proceso
    const gasExtraido = gasDisponible * pozosActivos * variacion();
    const gasSeparado = gasExtraido * (eficienciaSeparacion/100) * variacion();
    const gasComprimido = gasSeparado * (eficienciaCompresion/100) * variacion();
    
    // Propiedades del gas (valores típicos)
    const poderCalorifico = 9400; // kcal/m³ (valor típico para gas natural)
    const poderCalorificoTotal = gasComprimido * poderCalorifico; // kcal totales
    
    // Energía térmica disponible (MWh)
    const energiaTermica = gasComprimido * poderCalorifico * 0.00116; // Conversión a MWh
    
    // Generación eléctrica
    const energiaElectrica = energiaTermica * (eficienciaTurbina/100);
    const perdidas = energiaElectrica * 0.05; // 5% de pérdidas en transmisión
    const energiaEntregada = energiaElectrica - perdidas;
    
    // Cálculos económicos
    const ingresos = energiaEntregada * precioElectricidad;
    const gastos = energiaEntregada * costoOperativo + (costoCapital * energiaElectrica / 365 / 24);
    const beneficio = ingresos - gastos;
    const retornoInversion = (beneficio / gastos) * 100;
    
    // Cálculos de emisiones
    const emisionesCO2 = gasComprimido * 2.1; // kg CO2/m³ gas (aproximado)
    const emisionesNOx = gasComprimido * 0.005; // kg NOx/m³ gas
    const emisionesSO2 = gasComprimido * 0.001; // kg SO2/m³ gas
    
    // Residuos y gas no utilizado
    const gasNoUtilizado = gasExtraido - gasComprimido;
    const residuosCombustion = gasComprimido * 0.02; // 2% del gas genera residuos
    
    // Cálculo de producción de petróleo (basado en el GOR - Gas-Oil Ratio)
    // Convertimos primero el gas a pies cúbicos para usar el GOR estándar
    const gasExtraidoPies3 = gasExtraido * 1000 * M3_A_PIES3; // Convertir miles de m³ a pies³
    const produccionPetroleo = gasExtraidoPies3 / GOR; // Barriles de petróleo por día
    const produccionPetroleoDiaria = produccionPetroleo;
    const produccionPetroleoMensual = produccionPetroleoDiaria * 30;
    const produccionPetroleoAnual = produccionPetroleoDiaria * 365;
    
    // Producción de gas en diferentes unidades y periodos
    const produccionGasDiaria = gasExtraido; // miles de m³/día
    const produccionGasDiariaPies3 = gasExtraido * 1000 * M3_A_PIES3; // pies³/día
    const produccionGasMensual = produccionGasDiaria * 30; // miles de m³/mes
    const produccionGasAnual = produccionGasDiaria * 365; // miles de m³/año
    
    // Actualiza los estados
    setDatosProceso({
      gasExtraido,
      gasSeparado,
      gasComprimido,
      gasNoUtilizado,
      energiaTermica,
      energiaElectrica,
      perdidas,
      energiaEntregada,
      residuosCombustion,
      poderCalorificoTotal
    });
    
    setDatosEconomicos({
      ingresos,
      gastos,
      beneficio,
      retornoInversion
    });
    
    setDatosEmisiones({
      emisionesCO2,
      emisionesNOx,
      emisionesSO2
    });
    
    setDatosPetroleo({
      produccionPetroleoDiaria,
      produccionPetroleoMensual,
      produccionPetroleoAnual,
      produccionGasDiaria,
      produccionGasDiariaPies3,
      produccionGasMensual,
      produccionGasAnual
    });
  };
  
  // Agrega datos al registro histórico
  const agregarDatosHistoricos = () => {
    if (datosProceso.energiaEntregada) {
      const nuevosDatos = {
        tiempo: new Date().toLocaleTimeString(),
        energiaEntregada: datosProceso.energiaEntregada,
        ingresos: datosEconomicos.ingresos,
        gastos: datosEconomicos.gastos,
        beneficio: datosEconomicos.beneficio,
        produccionPetroleo: datosPetroleo.produccionPetroleoDiaria,
        produccionGas: datosProceso.gasExtraido
      };
      
      setDatosHistoricos(prev => {
        const nuevos = [...prev, nuevosDatos];
        return nuevos.slice(-24); // Mantener solo las últimas 24 muestras
      });
    }
  };
  
  // Funciones para conversión de unidades
  const convertirGas = (valor) => {
    if (unidadesImperiales) {
      return (valor * 1000 * M3_A_PIES3).toFixed(0) + " pies³/día";
    } else {
      return valor.toFixed(2) + " miles m³/día";
    }
  };
  
  const convertirEmisiones = (valor) => {
    if (unidadesImperiales) {
      return (valor * KG_A_TON).toFixed(3) + " ton/día";
    } else {
      return valor.toFixed(1) + " kg/día";
    }
  };
  
  // Datos para gráficos
  const datosFlujo = [
    { name: 'Gas Extraído', value: datosProceso.gasExtraido || 0 },
    { name: 'Gas Separado', value: datosProceso.gasSeparado || 0 },
    { name: 'Gas Comprimido', value: datosProceso.gasComprimido || 0 },
    { name: 'Gas No Utilizado', value: datosProceso.gasNoUtilizado || 0 },
    { name: 'Residuos', value: datosProceso.residuosCombustion || 0 }
  ];
  
  const datosEnergia = [
    { name: 'Energía Térmica', value: datosProceso.energiaTermica || 0 },
    { name: 'Energía Eléctrica', value: datosProceso.energiaElectrica || 0 },
    { name: 'Pérdidas', value: datosProceso.perdidas || 0 },
    { name: 'Energía Entregada', value: datosProceso.energiaEntregada || 0 }
  ];
  
  const datosEmisionesPie = [
    { name: 'CO2', value: datosEmisiones.emisionesCO2 || 0 },
    { name: 'NOx', value: datosEmisiones.emisionesNOx || 0 },
    { name: 'SO2', value: datosEmisiones.emisionesSO2 || 0 }
  ];
  
  const datosEconomicosPie = [
    { name: 'Ingresos', value: datosEconomicos.ingresos || 0 },
    { name: 'Gastos', value: datosEconomicos.gastos || 0 }
  ];
  
  // Datos para los nuevos gráficos
  const datosProduccionPetroleoGas = [
    { name: 'Petróleo', value: datosPetroleo.produccionPetroleoDiaria || 0, unidad: 'bbl/día' },
    { name: 'Gas', value: unidadesImperiales ? 
      (datosPetroleo.produccionGasDiariaPies3 || 0) : 
      (datosPetroleo.produccionGasDiaria || 0) * 1000, 
      unidad: unidadesImperiales ? 'pies³/día' : 'm³/día' }
  ];
  
  const datosCapacidadCalorifica = [
    { name: 'Capacidad Calorífica', value: datosProceso.poderCalorificoTotal || 0, unidad: 'kcal' }
  ];
  
  // Datos para producción proyectada
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const datosProyeccion = meses.map((mes, index) => {
    // Simulamos una ligera declinación en la producción (1% mensual)
    const factor = Math.pow(0.99, index);
    return {
      mes,
      produccionPetroleo: (datosPetroleo.produccionPetroleoDiaria || 0) * 30 * factor,
      produccionGas: (datosPetroleo.produccionGasDiaria || 0) * 30 * factor
    };
  });
  
  // Acumulados proyectados
  const acumuladosPetroleoMensual = datosProyeccion.reduce((sum, item) => sum + item.produccionPetroleo, 0);
  const acumuladosGasMensual = datosProyeccion.reduce((sum, item) => sum + item.produccionGas, 0);

  return (
    <div className="flex flex-col w-full p-4 bg-gray-50">
      <div className="text-2xl font-bold text-center mb-4">
        Simulación de Generación Eléctrica a partir de Gas Asociado
      </div>
      
      {/* Panel de Controles */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="text-lg font-semibold mb-2">Parámetros de Simulación</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pozos Activos: {pozosActivos}</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={pozosActivos} 
              onChange={(e) => setPozosActivos(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gas Disponible por Pozo (miles m³/día): {gasDisponible}</label>
            <input 
              type="range" 
              min="10" 
              max="500" 
              step="10"
              value={gasDisponible} 
              onChange={(e) => setGasDisponible(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GOR (pies³/bbl): {GOR}</label>
            <input 
              type="range" 
              min="500" 
              max="5000" 
              step="100"
              value={GOR} 
              onChange={(e) => setGOR(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Eficiencia Separación (%): {eficienciaSeparacion}</label>
            <input 
              type="range" 
              min="60" 
              max="98" 
              value={eficienciaSeparacion} 
              onChange={(e) => setEficienciaSeparacion(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Eficiencia Compresión (%): {eficienciaCompresion}</label>
            <input 
              type="range" 
              min="70" 
              max="98" 
              value={eficienciaCompresion} 
              onChange={(e) => setEficienciaCompresion(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Eficiencia Turbina (%): {eficienciaTurbina}</label>
            <input 
              type="range" 
              min="25" 
              max="45" 
              value={eficienciaTurbina} 
              onChange={(e) => setEficienciaTurbina(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio Electricidad (USD/MWh): {precioElectricidad}</label>
            <input 
              type="range" 
              min="30" 
              max="150" 
              value={precioElectricidad} 
              onChange={(e) => setPrecioElectricidad(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Costo Operativo (USD/MWh): {costoOperativo}</label>
            <input 
              type="range" 
              min="5" 
              max="40" 
              value={costoOperativo} 
              onChange={(e) => setCostoOperativo(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1 rounded ${verHistorico ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setVerHistorico(!verHistorico)}
          >
            {verHistorico ? 'Ver Tiempo Real' : 'Ver Histórico'}
          </button>
          <button 
            className={`px-3 py-1 rounded ${unidadesImperiales ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setUnidadesImperiales(!unidadesImperiales)}
          >
            {unidadesImperiales ? 'Usar Unidades Métricas' : 'Usar Unidades Imperiales'}
          </button>
        </div>
      </div>
      
      {/* Panel de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold mb-2">Producción de Gas</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-gray-500">Gas Extraído</div>
              <div className="text-xl font-bold">{convertirGas(datosProceso.gasExtraido || 0)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Gas Procesado</div>
              <div className="text-xl font-bold">{convertirGas(datosProceso.gasComprimido || 0)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Eficiencia Total (%)</div>
              <div className="text-xl font-bold">
                {datosProceso.gasExtraido ? ((datosProceso.gasComprimido / datosProceso.gasExtraido) * 100).toFixed(1) : "0.0"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Gas No Utilizado</div>
              <div className="text-xl font-bold">{convertirGas(datosProceso.gasNoUtilizado || 0)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold mb-2">Generación Eléctrica</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-gray-500">Energía Generada (MWh/día)</div>
              <div className="text-xl font-bold">{(datosProceso.energiaElectrica || 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Energía Entregada (MWh/día)</div>
              <div className="text-xl font-bold">{(datosProceso.energiaEntregada || 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Factor de Planta (%)</div>
              <div className="text-xl font-bold">
                {((datosProceso.energiaElectrica || 0) / (pozosActivos * gasDisponible * 0.00116 * 9400 * 0.45) * 100).toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Eficiencia Eléctrica (%)</div>
              <div className="text-xl font-bold">{eficienciaTurbina.toFixed(1)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold mb-2">Análisis Económico</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-gray-500">Ingresos (USD/día)</div>
              <div className="text-xl font-bold">{(datosEconomicos.ingresos || 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Costos (USD/día)</div>
              <div className="text-xl font-bold">{(datosEconomicos.gastos || 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Beneficio (USD/día)</div>
              <div className={`text-xl font-bold ${(datosEconomicos.beneficio || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(datosEconomicos.beneficio || 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">ROI (%)</div>
              <div className={`text-xl font-bold ${(datosEconomicos.retornoInversion || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(datosEconomicos.retornoInversion || 0).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos: Producción de Petróleo y Gas, y Capacidad Calorífica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Gráfico de producción petróleo y gas */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold mb-2">Producción de Petróleo y Gas</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={datosProduccionPetroleoGas}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" label={{ value: 'bbl/día', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: unidadesImperiales ? 'pies³/día' : 'm³/día', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="value" name="Petróleo (bbl/día)" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="value" name={`Gas (${unidadesImperiales ? 'pies³/día' : 'm³/día'})`} fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-gray-500">Producción de Petróleo</div>
              <div className="text-xl font-bold">{(datosPetroleo.produccionPetroleoDiaria || 0).toFixed(0)} bbl/día</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Producción de Gas</div>
              <div className="text-xl font-bold">
                {unidadesImperiales 
                  ? ((datosPetroleo.produccionGasDiariaPies3 || 0) / 1000000).toFixed(2) + " MMSCF/día"
                  : (datosPetroleo.produccionGasDiaria || 0).toFixed(2) + " miles m³/día"}
              </div>
            </div>
          </div>
        </div>
        
        {/* Gráfico de capacidad calorífica */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold mb-2">Capacidad Calorífica del Gas</div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={[
                { name: 'Capacidad Calorífica Total', value: datosProceso.poderCalorificoTotal || 0 }
              ]}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'kcal', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${(value / 1000000).toFixed(2)} millones kcal`, 'Capacidad Calorífica']} />
              <Area type="monotone" dataKey="value" fill="#ffc658" stroke="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-gray-500">Poder Calorífico Unitario</div>
              <div className="text-xl font-bold">9400 kcal/m³</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Poder Calorífico Total</div>
              <div className="text-xl font-bold">
                {((datosProceso.poderCalorificoTotal || 0) / 1000000).toFixed(2)} millones kcal
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos: Flujo de Proceso y Emisiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Diagrama de flujo del proceso */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold mb-2">Flujo del Proceso</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={datosFlujo}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip formatter={(value) => [unidadesImperiales 
                ? `${(value * 1000 * M3_A_PIES3).toFixed(0)} pies³/día` 
                : `${value.toFixed(2)} miles m³/día`, 'Volumen']} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name={`Volumen (${unidadesImperiales ? 'pies³/día' : 'miles m³/día'})`} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Gráfico de emisiones */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold mb-2">Emisiones y Residuos</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <div className="text-sm text-gray-500">CO2</div>
              <div className="text-xl font-bold">{convertirEmisiones(datosEmisiones.emisionesCO2 || 0)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">NOx</div>
              <div className="text-xl font-bold">{convertirEmisiones(datosEmisiones.emisionesNOx || 0)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">SO2</div>
              <div className="text-xl font-bold">{convertirEmisiones(datosEmisiones.emisionesSO2 || 0)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Residuos</div>
              <div className="text-xl font-bold">{convertirGas(datosProceso.residuosCombustion || 0)}</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={datosEmisionesPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {datosEmisionesPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EMISIONES_COLORS[index % EMISIONES_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [convertirEmisiones(value), 'Emisiones']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Gráficos: Energía y Datos Económicos/Históricos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Gráfico de energía */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold mb-2">Balance Energético</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={datosEnergia}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'MWh/día', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value.toFixed(2)} MWh/día`, 'Energía']} />
              <Legend />
              <Bar dataKey="value" fill="#00C49F" name="Energía (MWh/día)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Gráfico económico o histórico */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold mb-2">
            {verHistorico ? 'Histórico de Generación' : 'Análisis Económico'}
          </div>
          
          {verHistorico ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={datosHistoricos}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tiempo" />
                <YAxis yAxisId="left" label={{ value: 'MWh', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'USD', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="energiaEntregada" stroke="#8884d8" name="Energía (MWh)" />
                <Line yAxisId="right" type="monotone" dataKey="beneficio" stroke="#82ca9d" name="Beneficio (USD)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosEconomicosPie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#00C49F" />
                  <Cell fill="#FF8042" />
                </Pie>
                <Tooltip formatter={(value) => [`${value.toFixed(2)} USD/día`, 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          )}
          
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div>
              <div className="text-sm text-gray-500">Energía Mensual (MWh)</div>
              <div className="text-lg font-bold">
                {((datosProceso.energiaEntregada || 0) * 30).toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Energía Anual (MWh)</div>
              <div className="text-lg font-bold">
                {((datosProceso.energiaEntregada || 0) * 365).toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Beneficio Anual (USD)</div>
              <div className="text-lg font-bold">
                {((datosEconomicos.beneficio || 0) * 365).toFixed(0)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de Producción Acumulada */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="text-lg font-semibold mb-2">Producción Acumulada Proyectada</div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Petróleo (bbl)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gas ({unidadesImperiales ? 'MMSCF' : 'miles m³'})
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datosProyeccion.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-2 whitespace-nowrap">{item.mes}</td>
                  <td className="px-6 py-2 whitespace-nowrap">{item.produccionPetroleo.toFixed(0)}</td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    {unidadesImperiales 
                      ? ((item.produccionGas * 1000 * M3_A_PIES3) / 1000000).toFixed(2)
                      : item.produccionGas.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="px-6 py-2 whitespace-nowrap">Total Anual</td>
                <td className="px-6 py-2 whitespace-nowrap">{(datosPetroleo.produccionPetroleoAnual || 0).toFixed(0)}</td>
                <td className="px-6 py-2 whitespace-nowrap">
                  {unidadesImperiales 
                    ? ((datosPetroleo.produccionGasAnual * 1000 * M3_A_PIES3) / 1000000).toFixed(2)
                    : (datosPetroleo.produccionGasAnual || 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={datosProyeccion}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" label={{ value: 'Petróleo (bbl)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: unidadesImperiales ? 'Gas (MMSCF)' : 'Gas (miles m³)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="produccionPetroleo" name="Petróleo (bbl)" fill="#8884d8" stroke="#8884d8" />
              <Area 
                yAxisId="right" 
                type="monotone" 
                dataKey="produccionGas" 
                name={unidadesImperiales ? 'Gas (MMSCF)' : 'Gas (miles m³)'} 
                fill="#82ca9d" 
                stroke="#82ca9d"
                // Si las unidades son imperiales, transformamos los datos al mostrarlos en el gráfico
                stackId={unidadesImperiales ? "1" : undefined}
                // Convertimos las unidades si es necesario
                data={unidadesImperiales 
                  ? datosProyeccion.map(item => ({
                      ...item, 
                      produccionGas: (item.produccionGas * 1000 * M3_A_PIES3) / 1000000
                    }))
                  : datosProyeccion}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Diagrama del Proceso */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="text-lg font-semibold mb-2">Esquema del Proceso</div>
        <div className="flex flex-wrap justify-between items-center border-2 border-gray-200 p-4 rounded-lg">
          <div className="flex flex-col items-center m-2 p-2 bg-yellow-100 rounded-lg w-32">
            <div className="font-bold mb-1">Pozo</div>
            <div className="text-sm">{convertirGas(datosProceso.gasExtraido || 0)}</div>
          </div>
          <div className="text-3xl">→</div>
          
          <div className="flex flex-col items-center m-2 p-2 bg-blue-100 rounded-lg w-32">
            <div className="font-bold mb-1">Separador</div>
            <div className="text-sm">{convertirGas(datosProceso.gasSeparado || 0)}</div>
            <div className="text-xs text-gray-500">Ef: {eficienciaSeparacion}%</div>
          </div>
          <div className="text-3xl">→</div>
          
          <div className="flex flex-col items-center m-2 p-2 bg-purple-100 rounded-lg w-32">
            <div className="font-bold mb-1">Compresión</div>
            <div className="text-sm">{convertirGas(datosProceso.gasComprimido || 0)}</div>
            <div className="text-xs text-gray-500">Ef: {eficienciaCompresion}%</div>
          </div>
          <div className="text-3xl">→</div>
          
          <div className="flex flex-col items-center m-2 p-2 bg-red-100 rounded-lg w-32">
            <div className="font-bold mb-1">Turbina</div>
            <div className="text-sm">{(datosProceso.energiaElectrica || 0).toFixed(1)} MWh/día</div>
            <div className="text-xs text-gray-500">Ef: {eficienciaTurbina}%</div>
          </div>
          <div className="text-3xl">→</div>
          
          <div className="flex flex-col items-center m-2 p-2 bg-green-100 rounded-lg w-32">
            <div className="font-bold mb-1">Red Eléctrica</div>
            <div className="text-sm">{(datosProceso.energiaEntregada || 0).toFixed(1)} MWh/día</div>
            <div className="text-xs text-gray-500">Pérdidas: 5%</div>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="border-2 border-red-200 p-2 rounded-lg">
            <div className="font-bold">Residuos y Emisiones:</div>
            <div>- CO2: {convertirEmisiones(datosEmisiones.emisionesCO2 || 0)}</div>
            <div>- NOx: {convertirEmisiones(datosEmisiones.emisionesNOx || 0)}</div>
            <div>- SO2: {convertirEmisiones(datosEmisiones.emisionesSO2 || 0)}</div>
            <div>- Gas no utilizado: {convertirGas(datosProceso.gasNoUtilizado || 0)}</div>
          </div>
          <div className="border-2 border-green-200 p-2 rounded-lg">
            <div className="font-bold">Datos Económicos Acumulados:</div>
            <div>- Ingresos anuales: ${((datosEconomicos.ingresos || 0) * 365).toFixed(0)} USD</div>
            <div>- Costos anuales: ${((datosEconomicos.gastos || 0) * 365).toFixed(0)} USD</div>
            <div>- Beneficio anual: ${((datosEconomicos.beneficio || 0) * 365).toFixed(0)} USD</div>
            <div>- Retorno de inversión: {(datosEconomicos.retornoInversion || 0).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Definición de colores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const EMISIONES_COLORS = ['#FF8042', '#FFBB28', '#8884d8'];

export default SimulacionEnergiaGas;
