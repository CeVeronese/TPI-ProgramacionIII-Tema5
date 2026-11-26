async function obtenerProductosInicio() {
    try {
        const respuesta = await fetch(`${API_USERS_PRODUCTS}/products`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener los productos");
        }

        const productos = await respuesta.json();
        mostrarProductos(productos.slice(0, 5));

    } catch (error) {
        console.error("Error:", error);
    }
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-producto");

        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Categoría: ${producto.categoria}</p>
            <p>Precio: $${producto.precio}</p>
            <p>${producto.disponible ? "Disponible" : "No disponible"}</p>
        `;

        const boton = document.createElement("button");
        boton.textContent = "Agregar al carrito";
        boton.disabled = !producto.disponible;

        boton.addEventListener("click", () => {
            agregarAlCarrito(producto);
        });

        tarjeta.appendChild(boton);
        contenedor.appendChild(tarjeta);
    });
}

obtenerProductosInicio();