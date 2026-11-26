let productoEditando = null;

async function cargarProductosAdmin() {
    const tabla = document.getElementById("tabla-productos");

    try {
        const respuesta = await fetch(`${API_USERS_PRODUCTS}/products`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener productos");
        }

        const productos = await respuesta.json();

        tabla.innerHTML = "";

        productos.forEach(producto => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>
                    <input type="checkbox" class="seleccionar-producto" value="${producto.id}">
                </td>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>$${producto.precio}</td>
                <td>${producto.disponible ? "Sí" : "No"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProducto('${producto.id}')">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${producto.id}')">
                        Eliminar
                    </button>
                </td>
            `;  

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error:", error);
        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No se pudieron cargar los productos.
                </td>
            </tr>
        `;
    }
}

cargarProductosAdmin();

function mostrarFormulario() {
    document.getElementById("formulario-producto").style.display = "block";
}

function ocultarFormulario() {
    document.getElementById("formulario-producto").style.display = "none";
}

document.getElementById("form-producto").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nuevoProducto = {
        nombre: document.getElementById("nombre").value,
        categoria: document.getElementById("categoria").value,
        precio: Number(document.getElementById("precio").value),
        imagen: document.getElementById("imagen").value || "https://placehold.co/300x300",
        disponible: document.getElementById("disponible").checked
    };

    try {
        const url = productoEditando
            ? `${API_USERS_PRODUCTS}/products/${productoEditando}`
            : `${API_USERS_PRODUCTS}/products`;

        const metodo = productoEditando ? "PUT" : "POST";

        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoProducto)
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo guardar el producto");
        }

        alert(productoEditando
            ? "Producto actualizado correctamente"
            : "Producto agregado correctamente");
        productoEditando = null;

        document.getElementById("form-producto").reset();
        ocultarFormulario();
        cargarProductosAdmin();

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo agregar el producto");
    }
});

async function editarProducto(id) {
    try {
        const respuesta = await fetch(`${API_USERS_PRODUCTS}/products/${id}`);

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el producto");
        }

        const producto = await respuesta.json();
        productoEditando = id;

        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("categoria").value = producto.categoria;
        document.getElementById("precio").value = producto.precio;
        document.getElementById("imagen").value = producto.imagen;
        document.getElementById("disponible").checked = producto.disponible;

        mostrarFormulario();

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar el producto");
    }
}

async function eliminarProducto(id) {
    const confirmar = confirm("¿Estás seguro de que querés eliminar este producto?");

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_USERS_PRODUCTS}/products/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo eliminar el producto");
        }

        alert("Producto eliminado correctamente");

        cargarProductosAdmin();

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo eliminar el producto");
    }
}

document.getElementById("seleccionar-todos").addEventListener("change", function () {
    const seleccionados = document.querySelectorAll(".seleccionar-producto");

    seleccionados.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

async function eliminarProductosSeleccionados() {
    const seleccionados = document.querySelectorAll(".seleccionar-producto:checked");

    if (seleccionados.length === 0) {
        alert("Seleccioná al menos un producto");
        return;
    }

    if (!confirm("¿Estás seguro de que querés eliminar los productos seleccionados?")) {
        return;
    }

    try {
        for (const checkbox of seleccionados) {
            const respuesta = await fetch(`${API_USERS_PRODUCTS}/products/${checkbox.value}`, {
                method: "DELETE"
            });

            if (!respuesta.ok) {
                throw new Error("Error al eliminar un producto");
            }
        }

        alert("Productos eliminados correctamente");
        cargarProductosAdmin();

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron eliminar todos los productos");
    }
}