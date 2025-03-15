# Simulador de Generación Eléctrica a partir de Gas Asociado

Este proyecto consiste en una aplicación web interactiva que simula el proceso completo de generación de energía eléctrica utilizando el gas asociado a la producción petrolera, desde la extracción hasta la entrega a la red eléctrica. Permite a los usuarios ajustar diversos parámetros para analizar la eficiencia, rentabilidad y el impacto ambiental de estos sistemas.

## 🌟 Características

- **Simulación en tiempo real** del flujo del proceso desde el pozo hasta la turbina y generación eléctrica
- **Análisis detallado de eficiencias** en cada etapa del proceso (separación, compresión, turbina, transmisión)
- **Cálculo de emisiones y residuos** generados (CO₂, NOx, SO₂, CH₄)
- **Análisis económico completo** con ingresos, costos desglosados y métricas de retorno de inversión
- **Proyección de producción** acumulada mensual y anual
- **Visualización interactiva de datos** con múltiples tipos de gráficos
- **Soporte para unidades métricas e imperiales**
- **Exportación de informes** en formato PDF y datos en CSV
- **Guardado y carga de configuraciones** para comparar diferentes escenarios

## 📊 Módulos principales

La aplicación está organizada en cuatro módulos principales:

### 1. Panel Principal
Muestra un resumen de los principales indicadores de producción, financieros y ambientales, con gráficos que visualizan:
- Producción diaria de gas y petróleo
- Generación de energía y pérdidas
- Ingresos vs. costos
- Distribución de emisiones

### 2. Flujo del Proceso
Visualiza el recorrido del gas asociado a través de las diferentes etapas:
- Extracción del pozo
- Separación de componentes
- Compresión del gas
- Generación en turbina
- Entrega a la red eléctrica

Incluye gráficos de flujo y análisis de eficiencia en cada etapa.

### 3. Análisis Financiero
Proporciona un desglose detallado de:
- Ingresos anuales y diarios
- Costos operativos desglosados (combustible, mantenimiento, personal)
- Indicadores financieros (ROI, VAN, TIR, periodo de recuperación)
- LCOE (Costo Nivelado de Energía)
- Proyección de flujo de caja a 5 años

### 4. Huella Ambiental
Analiza el impacto ambiental de la generación con:
- Emisiones detalladas por tipo (CO₂, NOx, SO₂, CH₄)
- Comparación de intensidad de carbono con otras fuentes
- Ahorro de emisiones frente a alternativas (carbón, petróleo, venteo)
- Equivalencias ambientales

## 🔧 Parámetros ajustables

Los usuarios pueden modificar diversos parámetros para simular diferentes escenarios:

- **Pozos activos**: Número de pozos de producción (1-20)
- **Gas disponible**: Volumen de gas por pozo (10-500 miles m³/día)
- **GOR (Gas-Oil Ratio)**: Relación gas-petróleo (500-5000 pies³/bbl)
- **Poder calorífico**: Contenido energético del gas (800-1800 BTU/PCS)
- **Eficiencias**: Separación (60-98%), compresión (70-98%), turbina (25-45%)
- **Parámetros económicos**: Precio electricidad (30-150 USD/MWh), costo operativo (5-40 USD/MWh)

## 📈 Características técnicas

- **Cálculos precisos**: Implementa modelos termodinámicos y económicos realistas
- **Visualización dinámica**: Actualización en tiempo real de gráficos al modificar parámetros
- **Exportación de datos**: Generación de informes personalizados en PDF y exportación de datos en CSV
- **Gestión de configuraciones**: Guardado y carga de diferentes escenarios para comparación
- **Adaptabilidad de unidades**: Conversión entre unidades métricas e imperiales

## 🚀 Tecnologías utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Visualización**: Chart.js para generación de gráficos interactivos
- **Estilos**: CSS personalizado con diseño responsivo
- **Exportación**: html2pdf.js para generación de documentos PDF
- **Persistencia**: LocalStorage para guardado de configuraciones

## 📱 Diseño responsivo

La aplicación está diseñada para funcionar en dispositivos de diferentes tamaños:
- **Escritorio**: Visualización completa con múltiples gráficos en paralelo
- **Tablet**: Adaptación de la disposición para pantallas medianas
- **Móvil**: Reorganización de elementos para una experiencia óptima en dispositivos pequeños

## 🔍 Casos de uso

Este simulador es particularmente útil para:

1. **Empresas petroleras** que buscan aprovechar el gas asociado en lugar de quemarlo (flaring)
2. **Ingenieros y planificadores energéticos** evaluando la viabilidad de proyectos de generación
3. **Estudiantes y académicos** analizando el potencial y limitaciones de esta fuente energética
4. **Analistas ambientales** comparando el impacto de diferentes fuentes de generación eléctrica
5. **Analistas financieros** evaluando el retorno de inversión de proyectos energéticos

## 🔧 Instalación y ejecución local

1. Clona este repositorio
   ```
   git clone https://github.com/tu-usuario/simulador-gas-asociado.git
   ```

2. Navega al directorio del proyecto
   ```
   cd simulador-gas-asociado
   ```

3. Abre el archivo `index.html` en tu navegador web preferido

No se requieren dependencias adicionales, ya que las bibliotecas necesarias (Chart.js y html2pdf) están incluidas mediante CDN.

## 📚 Fundamentos técnicos

La simulación se basa en modelos energéticos que consideran:

- **Balance energético**: Cálculo preciso de transformaciones energéticas en cada etapa
- **Eficiencias reales**: Valores típicos de la industria para equipos de separación, compresión y generación
- **Factores de emisión**: Basados en estándares de la industria para diferentes contaminantes
- **Parámetros económicos**: Costos de capital, operación y mantenimiento realistas
- **Proyecciones financieras**: Modelo de flujo de caja descontado para análisis de inversión

## 🌐 Impacto ambiental

El simulador permite evaluar el beneficio ambiental de aprovechar el gas asociado en lugar de quemarlo o ventearlo:

- Reducción de emisiones de CO₂ y metano
- Comparación con fuentes tradicionales como carbón y petróleo
- Análisis de intensidad de carbono (kg CO₂/MWh)
- Cumplimiento con objetivos de reducción de emisiones

## 💼 Análisis económico

Incluye herramientas completas para evaluar la viabilidad financiera:

- Cálculo de LCOE (Costo Nivelado de Energía)
- Análisis de sensibilidad de precios
- Rentabilidad y periodo de recuperación
- Proyecciones de flujo de caja a largo plazo

## 👥 Contribuciones

Las contribuciones son bienvenidas. Si deseas participar:

1. Haz un fork del proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE)

## 📧 Contacto

Para consultas o sugerencias, por favor contacta a benitocabrerar@gmail.com
