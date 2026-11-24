async function cargarResumen() {
    try {
        const [respuestaProductos, respuestaPedidos, respuestaUsuarios] =
            await Promise.all([
                fetch(`${API_USERS_PRODUCTS}/products`),
                fetch(`${API_ORDERS}/orders`),
                fetch(`${API_USERS_PRODUCTS}/users`)
            ]);

        if (!respuestaProductos.ok || !respuestaPedidos.ok || !respuestaUsuarios.ok) {
            throw new Error("Error al obtener los datos");
        }

        const productos = await respuestaProductos.json();
        const pedidos = await respuestaPedidos.json();
        const usuarios = await respuestaUsuarios.json();

        document.getElementById("total-productos").textContent = productos.length;

        document.getElementById("total-pedidos").textContent =
            pedidos.filter(pedido => pedido.estado === "Pendiente").length;

        document.getElementById("total-usuarios").textContent =
            usuarios.filter(usuario => usuario.role === "USUARIO").length;

    } catch (error) {
        console.error("Error al cargar el resumen:", error);
    }
}

cargarResumen();