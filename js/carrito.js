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

    mostrarCarrito();
}

function mostrarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    const totalElemento = document.getElementById("total");

    contenedor.innerHTML = "";

    let total = 0;

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;

        total += subtotal;

        const elemento = document.createElement("div");

        elemento.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Subtotal: $${subtotal}</p>
            <button class="eliminar-producto">Eliminar</button>
        `;

        elemento.querySelector("button").addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
        });

        contenedor.appendChild(elemento);
    });

    totalElemento.textContent = `Total: $${total}`;
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);

    mostrarCarrito();
}