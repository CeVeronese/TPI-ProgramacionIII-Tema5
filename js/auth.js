async function iniciarSesion(email, password) {
    try {
        const respuesta = await fetch(`${API_USERS_PRODUCTS}/users`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener usuarios");
        }

        const usuarios = await respuesta.json();

        const usuario = usuarios.find(
            user => user.email === email && user.password === password
        );

        if (usuario) {
            localStorage.setItem("usuarioActual", JSON.stringify(usuario));

            if (usuario.role === "ADMIN") {
                window.location.href = "admin2.html"; 
            } else {
                window.location.href = "inicioCliente.html";
            }

        } else {
            alert("Correo o contraseña incorrectos");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo iniciar sesión");
    }
}

async function registrarUsuario(nombre, email, password) {
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
            throw new Error("No se pudo registrar el usuario");
        }

        alert("¡Cuenta creada correctamente!");

        window.location.href = "login.html";

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo crear la cuenta");
    }
}

const formularioRegistro = document.getElementById("form-registro");

if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", function(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        registrarUsuario(nombre, email, password);
    });
}