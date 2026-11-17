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
                window.location.href = "admin.html";
            } else {
                window.location.href = "catalogo.html";
            }

        } else {
            alert("Correo o contraseña incorrectos");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo iniciar sesión");
    }
}