document.addEventListener("DOMContentLoaded", () => {
    mostrarPedidosCliente();
});

async function mostrarPedidosCliente() {
    const contenedorTabla = document.getElementById("lista-pedidos");
    if (!contenedorTabla) return;

    let pedidos = [];

    try {
        // 1. Intentamos traer los pedidos actualizados desde el servidor (donde impactan los cambios del admin)
        const respuesta = await fetch(`${API_ORDERS}/orders`);
        if (respuesta.ok) {
            const datosServidor = await respuesta.json();
            // Filtramos los pedidos del usuario actual (userId "1") o mostramos todos si no hay filtro
            pedidos = datosServidor.filter(p => !p.userId || String(p.userId) === "1");
            
            // Actualizamos la copia local para mantenerla sincronizada
            localStorage.setItem("pedidos", JSON.stringify(pedidos));
        } else {
            throw new Error("Respuesta no válida del servidor");
        }
    } catch (error) {
        console.warn("No se pudo conectar con la API, leyendo desde localStorage:", error);
        // 2. Respaldo: Si no hay conexión con el backend, leemos lo que haya en localStorage
        pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
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

        // Mapeo dinámico de colores según el estado que haya puesto el admin
        let claseBadge = "bg-warning text-dark";
        let estadoStr = pedido.estado ? pedido.estado.toLowerCase() : "pendiente";

        if (estadoStr.includes("aprobado") || estadoStr.includes("entregado") || estadoStr.includes("completado") || estadoStr.includes("confirmado")) {
            claseBadge = "bg-success";
        } else if (estadoStr.includes("en camino") || estadoStr.includes("enviado") || estadoStr.includes("proceso")) {
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
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const pedido = pedidos.find(p => String(p.id) === String(id));
    
    if (pedido) {
        alert(`Detalle del pedido: ${pedido.id}\nFecha: ${pedido.fecha}\nEstado actual: ${pedido.estado}\nTotal: $${pedido.total}`);
    } else {
        alert("No se encontró el detalle del pedido seleccionado.");
    }
}