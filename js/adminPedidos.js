let listaPedidos = [];

async function cargarPedidosAdmin() {
    const tabla = document.getElementById("tabla-pedidos");

    try {
        const respuesta = await fetch(`${API_ORDERS}/orders`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener pedidos");
        }

        const pedidos = await respuesta.json();
        listaPedidos = pedidos;

        tabla.innerHTML = "";

        pedidos.forEach(pedido => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.userId}</td>
                <td>$${pedido.total}</td>
                <td>
                    <select class="form-select" onchange="cambiarEstado('${pedido.id}', this.value)">
                        <option value="Pendiente" ${pedido.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                        <option value="En preparación" ${pedido.estado === "En preparación" ? "selected" : ""}>En preparación</option>
                        <option value="Entregado" ${pedido.estado === "Entregado" ? "selected" : ""}>Entregado</option>
                    </select>
                </td>
                <td>${pedido.fecha}</td>
                <td>-</td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error:", error);

        tabla.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    No se pudieron cargar los pedidos.
                </td>
            </tr>
        `;
    }
}


async function cargarPedidosAdmin() {
    const tabla = document.getElementById("tabla-pedidos");

    try {
        const respuestaPedidos = await fetch(`${API_ORDERS}/orders`);
        const respuestaUsuarios = await fetch(`${API_USERS_PRODUCTS}/users`);

        if (!respuestaPedidos.ok || !respuestaUsuarios.ok) {
            throw new Error("Error al obtener datos");
        }

        const pedidos = await respuestaPedidos.json();
        const usuarios = await respuestaUsuarios.json();

        tabla.innerHTML = "";

        if (pedidos.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No hay pedidos registrados.
                    </td>
                </tr>
            `;
            return;
        }

        pedidos.forEach(pedido => {
            const usuario = usuarios.find(
                user => user.id === String(pedido.userId)
            );

            const nombreUsuario = usuario
                ? usuario.nombre
                : "Usuario desconocido";

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${pedido.id}</td>
                <td>${nombreUsuario}</td>
                <td>$${pedido.total}</td>
                <td>
                    <select class="form-select"
                        onchange="cambiarEstado('${pedido.id}', this.value)">
                        <option value="Pendiente" ${pedido.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                        <option value="En preparación" ${pedido.estado === "En preparación" ? "selected" : ""}>En preparación</option>
                        <option value="Enviado" ${pedido.estado === "Enviado" ? "selected" : ""}>Enviado</option>
                        <option value="Entregado" ${pedido.estado === "Entregado" ? "selected" : ""}>Entregado</option>
                    </select>
                </td>
                <td>${pedido.fecha}</td>
                <td>
                    <button class="btn btn-primary btn-sm"
                        onclick="verDetallesPedido('${pedido.id}')">
                        <i class="bi bi-eye"></i> Ver detalles
                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="eliminarPedido('${pedido.id}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>

            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error:", error);

        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No se pudieron cargar los pedidos.
                </td>
            </tr>
        `;
    }
}

cargarPedidosAdmin();


function verDetallesPedido(id) {
    fetch(`${API_ORDERS}/orders/${id}`)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error("No se pudo obtener el pedido");
            }

            return respuesta.json();
        })
        .then(pedido => {
            const contenido = document.getElementById("contenidoDetallePedido");

            let html = `
                <p><strong>Pedido:</strong> ${pedido.id}</p>
                <p><strong>Fecha:</strong> ${pedido.fecha}</p>
                <p><strong>Estado:</strong> ${pedido.estado}</p>
                <hr>
                <h6>Productos:</h6>
            `;

            pedido.items.forEach(producto => {
                html += `
                    <div class="d-flex justify-content-between mb-2">
                        <span>${producto.nombre} x ${producto.cantidad}</span>
                        <span>$${producto.precio * producto.cantidad}</span>
                    </div>
                `;
            });

            html += `
                <hr>
                <h5 class="text-end">Total: $${pedido.total}</h5>
            `;

            contenido.innerHTML = html;

            const modal = new bootstrap.Modal(
                document.getElementById("modalDetallePedido")
            );

            modal.show();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudieron cargar los detalles del pedido");
        });
}


async function eliminarPedido(id) {
    const confirmar = confirm(
        "¿Estás seguro de que querés eliminar este pedido?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_ORDERS}/orders/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo eliminar el pedido");
        }

        alert("Pedido eliminado correctamente");

        cargarPedidosAdmin();

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo eliminar el pedido");
    }
}
