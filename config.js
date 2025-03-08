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
    
    const configuracion = {
        id: Date.now(), // Usar timestamp como ID único
        nombre: nombre,
        fecha: new Date().toLocaleDateString(),
        valores: { pozos, gas, gor, sep, comp, turb, precio, costo }
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
    
    // Actualizar los valores mostrados
    document.getElementById('pozosValue').textContent = configuracion.valores.pozos;
    document.getElementById('gasValue').textContent = configuracion.valores.gas;
    document.getElementById('gorValue').textContent = configuracion.valores.gor;
    document.getElementById('sepValue').textContent = configuracion.valores.sep;
    document.getElementById('compValue').textContent = configuracion.valores.comp;
    document.getElementById('turbValue').textContent = configuracion.valores.turb;
    document.getElementById('precioValue').textContent = configuracion.valores.precio;
    document.getElementById('costoValue').textContent = configuracion.valores.costo;
    
    // Recalcular con los nuevos valores
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
    
    if (!listaConfiguraciones) {
        console.error("Elemento listaConfiguraciones no encontrado");
        return;
    }
    
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
                    <button class="btn-primary" onclick="cargarConfiguracion(${config.id})"><i class="fas fa-upload"></i> Cargar</button>
                    <button class="btn-tertiary" onclick="eliminarConfiguracion(${config.id})"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            </li>
        `;
    });
    
    html += '</ul>';
    listaConfiguraciones.innerHTML = html;
}
