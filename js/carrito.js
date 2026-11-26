let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let cuponAplicado = JSON.parse(localStorage.getItem("cuponAplicado")) || null;

const cuponesDisponibles = [
    { codigo: "DESCUENTO20", tipo: "porcentaje", descuento: 20 },
    { codigo: "TEMPORADA15", tipo: "porcentaje", descuento: 15 },
    { codigo: "BIENVENIDO10", tipo: "porcentaje", descuento: 10 },
    { codigo: "PREMIUM25", tipo: "porcentaje", descuento: 25 },
    { codigo: "OFERTA2X1", tipo: "dosPorUno" },
    { codigo: "ENVIOGRATIS", tipo: "envio" }
];

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

    guardarCarrito();
    mostrarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);

    guardarCarrito();
    mostrarCarrito();
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

function aplicarCupon() {
    const input = document.getElementById("codigo-cupon");
    const mensaje = document.getElementById("mensaje-cupon");

    const codigo = input.value.trim().toUpperCase();

    const cupon = cuponesDisponibles.find(
        item => item.codigo === codigo
    );

    if (!cupon) {
        mensaje.textContent = "El código ingresado no es válido.";
        mensaje.className = "text-danger";
        return;
    }

    cuponAplicado = cupon;

    localStorage.setItem("cuponAplicado", JSON.stringify(cuponAplicado));

    mensaje.textContent = "¡Cupón aplicado correctamente!";
    mensaje.className = "text-success";

    mostrarCarrito();
}

function quitarCupon() {
    cuponAplicado = null;

    localStorage.removeItem("cuponAplicado");

    const mensaje = document.getElementById("mensaje-cupon");

    if (mensaje) {
        mensaje.textContent = "Cupón eliminado.";
        mensaje.className = "text-warning";
    }

    mostrarCarrito();
}

function calcularDescuento(subtotal) {
    let descuento = 0;

    if (!cuponAplicado) {
        return descuento;
    }

    if (cuponAplicado.tipo === "porcentaje") {
        descuento = subtotal * cuponAplicado.descuento / 100;
    }

    if (cuponAplicado.tipo === "dosPorUno") {
        let precios = [];

        carrito.forEach(producto => {
            for (let i = 0; i < producto.cantidad; i++) {
                precios.push(Number(producto.precio));
            }
        });

        precios.sort((a, b) => a - b);

        for (let i = 0; i + 1 < precios.length; i += 2) {
            descuento += precios[i];
        }
    }

    return Math.min(descuento, subtotal);
}

function mostrarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    const subtotalElemento = document.getElementById("subtotal");
    const descuentoElemento = document.getElementById("descuento");
    const totalElemento = document.getElementById("total");
    const mensaje = document.getElementById("mensaje-cupon");

    if (!contenedor || !totalElemento) {
        return;
    }

    contenedor.innerHTML = "";

    let subtotal = 0;

    carrito.forEach(producto => {
        const precio = Number(producto.precio);
        const subtotalProducto = precio * producto.cantidad;

        subtotal += subtotalProducto;

        let precioMostrar = precio;
        let subtotalMostrar = subtotalProducto;

        if (cuponAplicado && cuponAplicado.tipo === "porcentaje") {
            precioMostrar = precio * (1 - cuponAplicado.descuento / 100);
            subtotalMostrar = precioMostrar * producto.cantidad;
        }

        const elemento = document.createElement("div");

        elemento.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio original: $${precio.toFixed(2)}</p>
            ${cuponAplicado && cuponAplicado.tipo === "porcentaje" ?
                `<p>Precio con descuento: $${precioMostrar.toFixed(2)}</p>` : ""}
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Subtotal: $${subtotalMostrar.toFixed(2)}</p>

            <button class="disminuir">−</button>
            <button class="aumentar">+</button>
            <button class="eliminar-producto">Eliminar</button>
            <hr>
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

    const descuentoTotal = calcularDescuento(subtotal);
    const total = subtotal - descuentoTotal;

    if (subtotalElemento) {
        subtotalElemento.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    }

    if (descuentoElemento) {
        descuentoElemento.textContent = `Descuento: -$${descuentoTotal.toFixed(2)}`;
    }

    totalElemento.textContent = `Total: $${total.toFixed(2)}`;

    if (mensaje && cuponAplicado) {
        if (cuponAplicado.tipo === "porcentaje") {
            mensaje.textContent = `Cupón ${cuponAplicado.codigo}: ${cuponAplicado.descuento}% de descuento aplicado.`;
        } else if (cuponAplicado.tipo === "dosPorUno") {
            mensaje.textContent = "Promoción 2x1 aplicada.";
        } else {
            mensaje.textContent = "Cupón de envío gratis aplicado.";
        }

        mensaje.className = "text-success";
    }
}

mostrarCarrito();