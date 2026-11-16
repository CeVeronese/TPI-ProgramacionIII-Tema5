let carrito = [];

function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(
        item => item.id === producto.id
    );

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    console.log("Carrito actualizado:", carrito);
}