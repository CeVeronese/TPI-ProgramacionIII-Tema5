document.addEventListener("DOMContentLoaded", () => {
    mostrarPedidosCliente();
});

async function mostrarPedidosCliente() {
    const contenedorTabla = document.getElementById("lista-pedidos");
    if (!contenedorTabla) return;

    // Obtenemos el ID o email del usuario actual logueado (ajustá la clave según tu sistema de login, ej: "usuario" o "userId")
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    const idUsuario = usuarioActual.id;
    console.log("ID DEL USUARIO:", idUsuario);

    let pedidos = [];

    try {
        const respuesta = await fetch(`${API_ORDERS}/orders`);
        if (respuesta.ok) {
            const datosServidor = await respuesta.json();
            // FILTRADO CLAVE: Solo traemos los pedidos cuyo userId o usuario coincida con el actual
            pedidos = datosServidor.filter(p => String(p.userId) === String(idUsuario));
            console.log("ID DEL USUARIO:", idUsuario);
            console.log("PEDIDOS ENCONTRADOS:", pedidos);
        } else {
            throw new Error("Error en servidor");
        }
    } catch (error) {
        console.warn("Leyendo desde localStorage con filtro de usuario:", error);
        // Si usamos localStorage, filtramos los pedidos guardados que correspondan a este usuario
        const todosLosPedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
        pedidos = todosLosPedidos.filter(p => String(p.userId) === String(idUsuario));
    }

    if (pedidos.length === 0) {
        contenedorTabla.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">No tenés pedidos registrados todavía.</td>
            </tr>
        `;
        return;
    }

    contenedorTabla.innerHTML = "";

    pedidos.forEach((pedido, index) => {
        const listaItems = pedido.productos || pedido.items || [];
        
        let listaProductos = "Sin productos";
        if (Array.isArray(listaItems) && listaItems.length > 0) {
            listaProductos = listaItems.map(p => `${p.nombre || 'Producto'} (x${p.cantidad || 1})`).join(", ");
        }

        let claseBadge = "bg-warning text-dark";
        let estadoStr = pedido.estado ? pedido.estado.toLowerCase() : "pendiente";

        if (estadoStr.includes("aprobado") || estadoStr.includes("entregado") || estadoStr.includes("completado")) {
            claseBadge = "bg-success";
        } else if (estadoStr.includes("en camino") || estadoStr.includes("enviado")) {
            claseBadge = "bg-info text-dark";
        } else if (estadoStr.includes("cancelado") || estadoStr.includes("rechazado")) {
            claseBadge = "bg-danger";
        }

        const idPedido = pedido.id || `PED-${index + 1}`;
        const fechaPedido = pedido.fecha || "S/F";
        const totalPedido = pedido.total ? Number(pedido.total).toFixed(2) : "0.00";
        const estadoPedido = pedido.estado || "Pendiente";

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="fw-bold">${idPedido}</td>
            <td>${fechaPedido}</td>
            <td>${listaProductos}</td>
            <td class="fw-semibold">$${totalPedido}</td>
            <td><span class="badge ${claseBadge}">${estadoPedido}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="verDetallePedido('${idPedido}')">
                    <i class="bi bi-eye"></i> Ver
                </button>
            </td>
        `;
        contenedorTabla.appendChild(fila);
    });
}

function verDetallePedido(id) {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    const idUsuario = usuarioActual.id;
    const todosLosPedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const pedido = todosLosPedidos.find(p => String(p.id) === String(id) && String(p.userId) === String(idUsuario));
    
    if (pedido) {
        alert(`Detalle del pedido: ${pedido.id}\nFecha: ${pedido.fecha}\nEstado actual: ${pedido.estado}\nTotal: $${pedido.total}`);
    } else {
        alert("No se encontró el detalle del pedido seleccionado.");
    }
}