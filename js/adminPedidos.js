async function cargarPedidosAdmin() {
    const tabla = document.getElementById("tabla-pedidos");

    try {
        const respuesta = await fetch(`${API_ORDERS}/orders`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener pedidos");
        }

        const pedidos = await respuesta.json();

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

cargarPedidosAdmin();

async function cambiarEstado(id, nuevoEstado) {
    try {
        const respuesta = await fetch(`${API_ORDERS}/orders/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                estado: nuevoEstado
            })
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo actualizar el pedido");
        }

        alert("Estado del pedido actualizado correctamente");

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo actualizar el estado del pedido");
    }
}