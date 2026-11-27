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
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
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

    const cupon = cuponesDisponibles.find(item => item.codigo === codigo);

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
    if (!cuponAplicado) return descuento;

    if (cuponAplicado.tipo === "porcentaje") {
        descuento = subtotal * cuponAplicado.descuento / 100;
    } else if (cuponAplicado.tipo === "dosPorUno") {
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

    if (!contenedor || !totalElemento) return;

    contenedor.innerHTML = "";
    let subtotal = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-cart-x fs-1 d-block mb-3 text-secondary"></i>
                <h5 class="fw-bold">Tu carrito está vacío</h5>
                <p class="small mb-3">Agregá productos desde el catálogo para comenzar.</p>
                <a href="catalogoNuevo.html" class="btn btn-primary btn-sm">Ir al Catálogo</a>
            </div>
        `;
    }

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
        // Tarjeta interna con bordes sutiles y texto adaptable al tema oscuro/claro
        elemento.className = "d-flex align-items-center justify-content-between border-bottom py-3 px-2 text-body";

        elemento.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <div class="bg-secondary bg-opacity-10 p-3 rounded-3 text-center" style="min-width: 60px;">
                    <i class="bi bi-box-seam fs-4 text-primary"></i>
                </div>
                <div>
                    <h6 class="fw-bold mb-1 text-body">${producto.nombre}</h6>
                    <p class="small text-muted mb-0">
                        Precio unit.: $${precio.toFixed(2)} 
                        ${cuponAplicado && cuponAplicado.tipo === "porcentaje" ? `<span class="text-success ms-1">($${precioMostrar.toFixed(2)} c/ dto.)</span>` : ""}
                    </p>
                </div>
            </div>

            <div class="d-flex align-items-center gap-4">
                <div class="btn-group shadow-sm" role="group">
                    <button class="disminuir btn btn-outline-secondary btn-sm px-2">−</button>
                    <span class="btn btn-outline-secondary btn-sm disabled text-body fw-bold px-3 bg-transparent">${producto.cantidad}</span>
                    <button class="aumentar btn btn-outline-secondary btn-sm px-2">+</button>
                </div>
                
                <div class="text-end" style="min-width: 90px;">
                    <span class="fw-bold text-body">$${subtotalMostrar.toFixed(2)}</span>
                </div>

                <button class="eliminar-producto btn btn-link text-danger p-0 fs-5" title="Eliminar producto">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        `;

        elemento.querySelector(".disminuir").addEventListener("click", () => cambiarCantidad(producto.id, -1));
        elemento.querySelector(".aumentar").addEventListener("click", () => cambiarCantidad(producto.id, 1));
        elemento.querySelector(".eliminar-producto").addEventListener("click", () => eliminarDelCarrito(producto.id));

        contenedor.appendChild(elemento);
    });

    const descuentoTotal = calcularDescuento(subtotal);
    const total = subtotal - descuentoTotal;

    if (subtotalElemento) subtotalElemento.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    if (descuentoElemento) {
        descuentoElemento.textContent = `Descuento: -$${descuentoTotal.toFixed(2)}`;
        descuentoElemento.parentElement.style.display = descuentoTotal > 0 ? "flex" : "none";
    }
    if (totalElemento) totalElemento.textContent = `Total: $${total.toFixed(2)}`;

    if (mensaje && cuponAplicado) {
        if (cuponAplicado.tipo === "porcentaje") {
            mensaje.textContent = `Cupón ${cuponAplicado.codigo}: ${cuponAplicado.descuento}% OFF aplicado.`;
        } else if (cuponAplicado.tipo === "dosPorUno") {
            mensaje.textContent = "Promoción 2x1 aplicada con éxito.";
        } else {
            mensaje.textContent = "Cupón de envío gratis aplicado.";
        }
        mensaje.className = "text-success fw-semibold mt-2 small";
    }
}

// FUNCIÓN PARA CONFIRMAR EL PEDIDO Y ENVIarlo A LA TABLA
function confirmarPedido() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agregá productos antes de confirmar la compra.");
        return;
    }

    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    let subtotal = carrito.reduce((acc, prod) => acc + (Number(prod.precio) * prod.cantidad), 0);
    let descuentoTotal = calcularDescuento(subtotal);
    let totalFinal = subtotal - descuentoTotal;

    const nuevoPedido = {
        id: "PED-" + Math.floor(100000 + Math.random() * 900000),
        fecha: new Date().toLocaleDateString(),
        productos: [...carrito],
        total: totalFinal.toFixed(2),
        estado: "Pendiente"
    };

    pedidos.push(nuevoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    // Limpiamos carrito y cupón
    carrito = [];
    cuponAplicado = null;
    localStorage.removeItem("carrito");
    localStorage.removeItem("cuponAplicado");

    alert("¡Compra confirmada con éxito!");
    window.location.href = "pedidosUsuarios.html";
}

// Ejecutar al cargar
mostrarCarrito();