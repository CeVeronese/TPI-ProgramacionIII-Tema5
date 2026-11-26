async function cargarUsuariosAdmin() {
    const tabla = document.getElementById("tabla-usuarios");

    try {
        const respuesta = await fetch(`${API_USERS_PRODUCTS}/users`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener usuarios");
        }

        const usuarios = await respuesta.json();

        tabla.innerHTML = "";

        usuarios.forEach(usuario => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>${usuario.role}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarUsuario('${usuario.id}', '${usuario.role}')">
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
                <td colspan="5" class="text-center">
                    No se pudieron cargar los usuarios
                </td>
            </tr>
        `;
    }
}

function mostrarFormularioUsuario() {
    document.getElementById("formulario-usuario").style.display = "block";
}

function ocultarFormularioUsuario() {
    document.getElementById("formulario-usuario").style.display = "none";
}

document.getElementById("form-usuario").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre-usuario").value;
    const email = document.getElementById("email-usuario").value;
    const password = document.getElementById("password-usuario").value;

    try {
        const respuesta = await fetch(`${API_USERS_PRODUCTS}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                password: password,
                role: "USUARIO"
            })
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo crear el usuario");
        }

        alert("Usuario creado correctamente");

        document.getElementById("form-usuario").reset();
        ocultarFormularioUsuario();
        cargarUsuariosAdmin();

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo crear el usuario");
    }
});

cargarUsuariosAdmin();

async function eliminarUsuario(id, rol) {
    if (rol.toUpperCase() === "ADMIN") {
        alert("No se puede eliminar una cuenta administradora");
        return;
    }

    const confirmar = confirm("¿Estás seguro de que querés eliminar este usuario?");

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_USERS_PRODUCTS}/users/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo eliminar el usuario");
        }

        alert("Usuario eliminado correctamente");

        cargarUsuariosAdmin();

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo eliminar el usuario");
    }
}
