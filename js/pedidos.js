async function confirmarPedido() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const subtotal = carrito.reduce(
        (acumulador, producto) =>
            acumulador + Number(producto.precio) * producto.cantidad,
        0
    );

    const descuentoTotal = calcularDescuento(subtotal);
    const totalFinal = subtotal - descuentoTotal;

    const pedido = {
        userId: "1",
        items: carrito.map(producto => ({
            ...producto,
            precioOriginal: Number(producto.precio),
            subtotalOriginal: Number(producto.precio) * producto.cantidad
        })),
        cupon: cuponAplicado ? cuponAplicado.codigo : null,
        subtotal: subtotal,
        descuento: descuentoTotal,
        envioGratis: cuponAplicado?.tipo === "envio",
        total: totalFinal,
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
        cuponAplicado = null;

        guardarCarrito();
        localStorage.removeItem("cuponAplicado");

        mostrarCarrito();

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al realizar el pedido");
    }
}
