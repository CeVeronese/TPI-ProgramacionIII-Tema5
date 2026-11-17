let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

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

    guardarCarrito();
    console.log("Carrito actualizado:", carrito);

    mostrarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);

    guardarCarrito();
    mostrarCarrito();
}

function mostrarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    const totalElemento = document.getElementById("total");

    if (!contenedor || !totalElemento) {
        return;
    }

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

            <button class="disminuir">−</button>
            <button class="aumentar">+</button>
            <button class="eliminar-producto">Eliminar</button>
        `;

        elemento.querySelector(".disminuir").addEventListener("click", () => {
            cambiarCantidad(producto.id, -1);
        });

        elemento.querySelector(".aumentar").addEventListener("click", () => {
            cambiarCantidad(producto.id, 1);
        });

        elemento.querySelector(".eliminar-producto").addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
        });

        contenedor.appendChild(elemento);
    });

    totalElemento.textContent = `Total: $${total}`;
}

function cambiarCantidad(id, cambio) {
    const producto = carrito.find(item => item.id === id);

    if (producto) {
        producto.cantidad += cambio;

        if (producto.cantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }
    }

    guardarCarrito();
    mostrarCarrito();
}