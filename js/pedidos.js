async function confirmarPedido() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const pedido = {
        userId: "1",
        items: carrito,
        total: carrito.reduce(
            (acumulador, producto) =>
                acumulador + producto.precio * producto.cantidad,
            0
        ),
        estado: "Pendiente",
        fecha: new Date().toISOString().split("T")[0]
    };

    try {
        const respuesta = await fetch(`${API_ORDERS}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo registrar el pedido");
        }

        alert("¡Pedido realizado correctamente!");

        carrito = [];
        guardarCarrito();
        mostrarCarrito();

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al realizar el pedido");
    }
}