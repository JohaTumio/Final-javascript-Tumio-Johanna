fetch("./catalogo.json")
    .then(resp => resp.json())
    .then(productos => miPrograma(productos))
    .catch(error => console.log(error))

function miPrograma(catalogo) {
    let contenedorProductos = document.getElementById("contenedorProductos")
    let contenedorCarrito = document.getElementById("contenedorCarrito")

    let ocultarCarrito = document.getElementById("ocultarCarrito")
    let bienvenida = document.getElementById("bienvenida")
    let ocultarProductos = document.getElementById("productos")
    let ocultarNav = document.getElementById("lista_nav")
    let ocultarFormulario = document.getElementById("contacto")
    let verCarrito = document.getElementById("verCarrito")
    verCarrito.addEventListener("click", mostrarCarrito)

    function mostrarCarrito() {
        contenedorProductos.classList.toggle("ocultar")
        ocultarCarrito.classList.toggle("ocultar")
        bienvenida.classList.toggle("ocultar")
        ocultarProductos.classList.toggle("ocultar")
        ocultarNav.classList.toggle("ocultar")
        ocultarFormulario.classList.toggle("ocultar")
    }

    renderizarProductos(catalogo)

    let verTodos = document.getElementById("verTodos")
    verTodos.classList.add("botonesFiltro")
    verTodos.addEventListener("click", verTodosProductos)

    function verTodosProductos() {
        renderizarProductos(catalogo)
    }

    function renderizarProductos(arr) {
        contenedorProductos.innerHTML = ""
        arr.forEach(({ nombre, precio, img, id }) => {
            let tarjetaProducto = document.createElement("article")
            tarjetaProducto.classList.add("tarjetasProducto")
            tarjetaProducto.innerHTML = `
        <h3>${nombre}</h3>
        <p>$${precio}</p>
        <img src=${img} />
        <button id="agregar${id}">Agregar al carrito</button>
        `
            contenedorProductos.append(tarjetaProducto)
            let boton = document.getElementById(`agregar${id}`)
            boton.addEventListener("click", () => { agregarAlCarrito(id) })
            boton.classList.add("botonAgregarCarrito")
        })
    }

    let inputFiltrar = document.getElementById("inputFiltrar")
    inputFiltrar.classList.add("inputFiltrar")

    let botonBuscar = document.getElementById("buscar")
    botonBuscar.classList.add("botonesFiltro")
    botonBuscar.addEventListener("click", filtrar)

    function filtrar() {
        let productosFiltrados = catalogo.filter(({ nombre, categoria }) => nombre.toLowerCase().includes(inputFiltrar.value.toLowerCase()) || categoria.toLowerCase().includes(inputFiltrar.value.toLowerCase()))
        renderizarProductos(productosFiltrados)
    }

    let contadorCarrito = document.getElementById("contadorCarrito")
    let precioTotal = document.getElementById("precioTotal")
    let carrito = []
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        actualizarCarrito()
    }

    function carritoVacio() {
        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = `
        <p class= "parrafoCarVacio">¡Aún no agregaste productos!</p>
        `
        }
    }
    carritoVacio()

    function agregarAlCarrito(prodId) {
        let existe = carrito.some(producto => producto.id === prodId)
        if (existe) {
            carrito.map(producto => {
                if (producto.id === prodId) {
                    producto.cantidad++
                }
            })
        } else {
            let item = catalogo.find((producto) => producto.id === prodId)
            item.cantidad = 1
            carrito.push(item)
        }
        localStorage.setItem("carrito", JSON.stringify(carrito))
        actualizarCarrito()
        agreElimToasti("Producto Agregado")
    }

    function actualizarCarrito() {
        contenedorCarrito.innerText = ""
        carrito.forEach(({ nombre, precio, cantidad, id }) => {
            let tarjetaProducto = document.createElement("div")
            tarjetaProducto.classList.add("itemCarrito")
            tarjetaProducto.innerHTML = `
        <h3>${nombre}</h3>
        <p>Precio:<br>$${precio}</p>
        <button id=restarCant${id} class= "btnAumRestCant">-</button>
        <p class= "cantidadCarrito">Cantidad: ${cantidad}</p>
        <button id=aumentarCant${id} class= "btnAumRestCant">+</button>
        <p>SubTotal: $${(cantidad * precio)}</p>
        <button id=eliminar${id} class= "botonEliminarCarrito">Eliminar</button>
        `
            contenedorCarrito.appendChild(tarjetaProducto)
            let btnEliminar = document.getElementById("eliminar" + id)
            btnEliminar.addEventListener("click", eliminarDelCarrito)

            let btnRestarCant = document.getElementById("restarCant" + id)
            btnRestarCant.addEventListener("click", restarCant)

            let btnAumentarCant = document.getElementById("aumentarCant" + id)
            btnAumentarCant.addEventListener("click", aumentarCant)

        })
        carritoVacio()
        contadorCarrito.innerText = carrito.length
        precioTotal.innerText = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad * producto.precio, 0)
    }

    function aumentarCant(e) {
        prodId = e.target.id.substring(12)
        let item = carrito.find(producto => producto.id === Number(prodId))
        let indice = carrito.indexOf(item)
        carrito[indice].cantidad++
        actualizarCarrito()
        localStorage.setItem("carrito", JSON.stringify(carrito))
        agreElimToasti("Cantidad actualizada")
    }

    function restarCant(e) {
        let prodId = e.target.id.substring(10)
        let item = carrito.find(producto => producto.id === Number(prodId))
        let indice = carrito.indexOf(item)
        if (carrito[indice].cantidad > 1) {
            carrito[indice].cantidad--
            agreElimToasti("Cantidad actualizada")
        } else if (carrito[indice].cantidad == 1) {
            agreElimToasti("Elimine el producto")
        }
        actualizarCarrito()
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }

    function eliminarDelCarrito(e) {
        let prodId = e.target.id.substring(8)
        let item = carrito.find((producto) => producto.id === parseInt(prodId))
        let indice = carrito.indexOf(item)
        carrito.splice(indice, 1)
        actualizarCarrito()
        localStorage.setItem("carrito", JSON.stringify(carrito))
        agreElimToasti("Producto Eliminado")
    }

    let botonVaciar = document.getElementById("finalizarCarrito")
    botonVaciar.addEventListener("click", finalizarCompra)

    function finalizarCompra() {
        localStorage.removeItem("carrito")
        carrito = []
        actualizarCarrito()
        Swal.fire({
            html: `<h2 class= "tituloSweet">¡Compra realizada con éxito!</h2>`,
            footer: '<span class= "footerSweet">Su compra se guardadó con el id <strong>12321312</strong></span>',
            icon: 'success',
            position: 'center',
            color: '#f1bc0b',
            showConfirmButton: true,
            confirmButtonText: "Confirmar",
            width: "35%",
            backdrop: true,
            confirmButtonColor: "#ffc87f",
            customClass: {
                actions: 'btnConfirmar',
                popup: 'tamañoAlertSweet',
            }
        });
    }
    function agreElimToasti(text) {
        Toastify({
            text: text,
            duration: 1500,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, #f1bc0b, #96c93d)",
            },
            className: "toast-message"
        }).showToast();
    }

    let btnEnviarFormulario = document.getElementById("btnEnviarForm")
    btnEnviarFormulario.addEventListener("click", () => {
        let nombre = document.getElementById("nombre").value
        let telefono = document.getElementById("telefono").value
        let email = document.getElementById("mail").value
        let mensaje = document.getElementById("msg").value
        
        if (nombre == "" || telefono == "" || email == "" || mensaje == "") {
            Swal.fire({
                icon: 'error',
                html: `
                <h2 class= "tituloSweet">¡Hubo un error!</h2>
                <br>
                <p class= "pFormulario">Debes completar todos los campos</p>`,
                color: '#f1bc0b',
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton:false,
                customClass: {
                    popup: 'tamañoAlertSweet',
                }
            })
        } else {
            Swal.fire({
                icon: 'success',
                html: `
                <h2 class= "tituloSweet">¡Completado!</h2>
                <br>
                <p class= "pFormulario">Gracias por contactarse con nosotros ${nombre} en breve le responderemos a su correo ${email}</p>`,
                color: '#f1bc0b',
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton:false,
                customClass: {
                    popup: 'tamañoAlertSweet',
                }
            })
        }
    })
}

