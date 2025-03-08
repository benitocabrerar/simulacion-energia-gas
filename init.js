// init.js - Script para diagnóstico y solución de problemas

// Función para verificar elementos críticos y corregir problemas
function diagnosticarYCorregir() {
    console.log("Iniciando diagnóstico de la aplicación...");
    
    // 1. Verificar carga de bibliotecas externas
    if (typeof Chart !== 'function') {
        console.error("ERROR CRÍTICO: Chart.js no está disponible");
        mostrarErrorCritico("No se pudo cargar la biblioteca Chart.js");
        return false;
    }
    
    // 2. Verificar funciones esenciales
    const funcionesRequeridas = ['calcular', 'actualizarGraficos', 'cambiarPestana', 'actualizarInterfazConResultados'];
    const funcionesFaltantes = funcionesRequeridas.filter(fn => typeof window[fn] !== 'function');
    
    if (funcionesFaltantes.length > 0) {
        console.error("ERROR CRÍTICO: Faltan funciones esenciales:", funcionesFaltantes);
        mostrarErrorCritico(`Faltan funciones esenciales: ${funcionesFaltantes.join(', ')}`);
        
        // Intentar definir funciones mínimas para evitar errores fatales
        if (!window.calcular) {
            window.calcular = function() {
                console.warn("Función calcular() simulada - no realiza cálculos reales");
                return {};
            };
        }
        
        if (!window.actualizarGraficos) {
            window.actualizarGraficos = function() {
                console.warn("Función actualizarGraficos() simulada - no genera gráficos reales");
            };
        }
        
        if (!window.cambiarPestana) {
            window.cambiarPestana = function(id) {
                console.warn(`Función cambiarPestana('${id}') simulada`);
                // Implementación mínima para cambiar pestañas
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                
                const targetTab = document.getElementById(id);
                if (targetTab) targetTab.classList.add('active');
                
                // Activar la pestaña correspondiente
                document.querySelectorAll('.tab').forEach(tab => {
                    if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(id)) {
                        tab.classList.add('active');
                    }
                });
            };
        }
    }
    
    // 3. Corregir problemas con pestañas
    document.querySelectorAll('.tab').forEach(tab => {
        // Eliminar el handler onclick del HTML y usar addEventListener
        const onclickAttr = tab.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/cambiarPestana\(['"]([^'"]+)['"]\)/);
            if (match && match[1]) {
                const targetId = match[1];
                
                // Eliminar el atributo onclick
                tab.removeAttribute('onclick');
                
                // Agregar event listener
                tab.addEventListener('click', function() {
                    cambiarPestana(targetId);
                });
                
                console.log(`Corregido: Tab para ${targetId} ahora usa addEventListener`);
            }
        }
    });
    
    // 4. Verificar y corregir variables globales importantes
    if (!window.ultimosDatosCalculados) {
        window.ultimosDatosCalculados = {};
        console.warn("Corregido: Creada variable ultimosDatosCalculados");
    }
    
    if (typeof window.unidadesImperiales === 'undefined') {
        window.unidadesImperiales = false;
        console.warn("Corregido: Inicializada variable unidadesImperiales");
    }
    
    if (!window.configuracionesGuardadas) {
        window.configuracionesGuardadas = JSON.parse(localStorage.getItem('configuraciones') || '[]');
        console.warn("Corregido: Inicializada variable configuracionesGuardadas");
    }
    
    // 5. Verificar estado inicial de las pestañas
    const hasActiveTab = document.querySelector('.tab-content.active');
    if (!hasActiveTab) {
        const firstTab = document.querySelector('.tab-content');
        if (firstTab) {
            firstTab.classList.add('active');
            // También activar el botón de pestaña correspondiente
            const tabId = firstTab.id;
            document.querySelectorAll('.tab').forEach(tab => {
                if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(tabId)) {
                    tab.classList.add('active');
                }
            });
            console.warn(`Corregido: Activada pestaña inicial ${firstTab.id}`);
        }
    }
    
    console.log("Diagnóstico completado. Aplicando correcciones...");
    
    // Ejecutar cálculo inicial si es posible
    try {
        calcular();
        console.log("Cálculo inicial ejecutado correctamente");
    } catch (error) {
        console.error("Error al ejecutar cálculo inicial:", error);
    }
    
    return true;
}

// Función para mostrar error crítico en la interfaz
function mostrarErrorCritico(mensaje) {
    // Crear elemento de alerta
    const alertaDiv = document.createElement('div');
    alertaDiv.style.position = 'fixed';
    alertaDiv.style.top = '50%';
    alertaDiv.style.left = '50%';
    alertaDiv.style.transform = 'translate(-50%, -50%)';
    alertaDiv.style.background = '#f44336';
    alertaDiv.style.color = 'white';
    alertaDiv.style.padding = '20px';
    alertaDiv.style.borderRadius = '5px';
    alertaDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    alertaDiv.style.zIndex = '9999';
    alertaDiv.style.maxWidth = '80%';
    alertaDiv.style.textAlign = 'center';
    
    alertaDiv.innerHTML = `
        <h3 style="margin-top:0;">Error de Inicialización</h3>
        <p>${mensaje}</p>
        <p style="font-size:0.8em;">Verifique la consola del navegador para más detalles.</p>
        <button style="background:#ffffff; color:#f44336; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; margin-top:10px;">
            Cerrar
        </button>
    `;
    
    // Agregar evento al botón
    const cerrarBtn = alertaDiv.querySelector('button');
    cerrarBtn.addEventListener('click', function() {
        document.body.removeChild(alertaDiv);
    });
    
    // Agregar al body
    document.body.appendChild(alertaDiv);
}

// Ejecutar diagnóstico cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado. Iniciando diagnóstico...");
    setTimeout(diagnosticarYCorregir, 500); // Pequeño retraso para asegurar que todo esté cargado
});
