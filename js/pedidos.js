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
        id: "PED-" + Math.floor(100000 + Math.random() * 900000),
        userId: "1",
        items: carrito.map(producto => ({
            ...producto,
            precioOriginal: Number(producto.precio),
            subtotalOriginal: Number(producto.precio) * producto.cantidad
        })),
        productos: [...carrito], // Clave para que pedidos.js dibuje los nombres en la tabla
        cupon: cuponAplicado ? cuponAplicado.codigo : null,
        subtotal: subtotal,
        descuento: descuentoTotal,
        envioGratis: cuponAplicado?.tipo === "envio",
        total: totalFinal.toFixed(2),
        estado: "Pendiente",
        fecha: new Date().toLocaleDateString()
    };

    try {
        // Intentamos enviar al backend si está activo
        const respuesta = await fetch(`${API_ORDERS}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        });

        if (!respuesta.ok) {
            console.warn("El servidor respondió con error, usando almacenamiento local.");
        }
    } catch (error) {
        console.warn("No hay conexión con el servidor backend, guardando localmente:", error);
    }

    // SIEMPRE guardamos una copia en localStorage para que la vista del cliente la dibuje al instante
    let pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidosGuardados.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));

    alert("¡Pedido realizado correctamente!");

    // Limpiamos carrito y cupones
    carrito = [];
    cuponAplicado = null;
    guardarCarrito();
    localStorage.removeItem("cuponAplicado");
    mostrarCarrito();

    // Redirigimos a la pantalla de pedidos
    window.location.href = "pedidosUsuarios.html";
}