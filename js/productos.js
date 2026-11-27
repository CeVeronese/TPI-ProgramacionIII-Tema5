
let todosLosProductos = [];

async function obtenerProductos() {
    try {
        const respuesta = await fetch(`${API_USERS_PRODUCTS}/products`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener los productos");
        }

        todosLosProductos = await respuesta.json();

        actualizarFiltroCategorias();
        mostrarProductos(todosLosProductos);

    } catch (error) {
        console.error("Error:", error);
    }
}

function actualizarFiltroCategorias() {
    const filtro = document.getElementById("filtro-categoria");

    if (!filtro) return;

    const categorias = [...new Set(
        todosLosProductos.map(producto => producto.categoria).filter(Boolean)
    )];

    filtro.innerHTML = '<option value="todos">Todas las categorías</option>';

    categorias.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        opcion.textContent = categoria;

        filtro.appendChild(opcion);
    });
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById("lista-productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const limite = contenedor.dataset.limite;
    const productosAMostrar = limite ? productos.slice(0, Number(limite)) : productos;
    productosAMostrar.forEach(producto => {
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

        boton.addEventListener("click", () => {
            agregarAlCarrito(producto);

            alert("¡Producto agregado correctamente al carrito!");
        });

        tarjeta.appendChild(boton);
        contenedor.appendChild(tarjeta);
    });
}

obtenerProductos();
function filtrarProductos() {
        ordenarProductos();
    }
function ordenarProductos() {
        const filtroCategoria = document.getElementById("filtro-categoria");
        const filtroPrecio = document.getElementById("orden-precio");

        const categoria = filtroCategoria ? filtroCategoria.value : "todos";
        const orden = filtroPrecio ? filtroPrecio.value : "ninguno";

        let productosFiltrados = todosLosProductos.filter(producto => {
            if (categoria === "todos") {
                return true;
            }

            const categoriaProducto = producto.categoria
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();

            return categoriaProducto === categoria;
        });

        if (orden === "mayor") {
            productosFiltrados.sort((a, b) => Number(b.precio) - Number(a.precio));
        }

        if (orden === "menor") {
            productosFiltrados.sort((a, b) => Number(a.precio) - Number(b.precio));
        }

        mostrarProductos(productosFiltrados);
}