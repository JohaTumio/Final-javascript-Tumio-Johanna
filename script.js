/* let catalogo = [
    { id: 1, categoria: "camas", precio: 9000, nombre: "cama moises", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgpOCexEOIgJq9IYGBFPTSgkETxpPPXz1HUg&usqp=CAU" },
    { id: 2, categoria: "camas", precio: 7800, nombre: "cama anti desgarro", img: "https://http2.mlstatic.com/D_NQ_NP_601738-MLA48266739222_112021-O.webp" },
    { id: 3, categoria: "camas", precio: 8500, nombre: "cama mullida", img: "https://http2.mlstatic.com/D_NQ_NP_885248-MLA48241075480_112021-O.jpg" },
    { id: 4, categoria: "comederos", precio: 4200, nombre: "comedero en altura", img: "https://http2.mlstatic.com/D_NQ_NP_672083-MLA46209835771_052021-O.webp" },
    { id: 5, categoria: "comederos", precio: 3000, nombre: "comedero dispenser", img: "https://http2.mlstatic.com/D_NQ_NP_908077-MLA52448373372_112022-V.jpg" },
    { id: 6, categoria: "comederos", precio: 800, nombre: "comedero acero", img: "https://http2.mlstatic.com/D_NQ_NP_834336-MLA51521258426_092022-O.webp" },
    { id: 7, categoria: "collares", precio: 1300, nombre: "collar regulable", img: "https://puppis.vteximg.com.br/arquivos/ids/189314-300-300/228998.jpg?v=637982461867100000" },
    { id: 8, categoria: "collares", precio: 600, nombre: "collar con pañuelo", img: "https://http2.mlstatic.com/D_NQ_NP_727013-MLA43426246555_092020-O.webp" },
    { id: 9, categoria: "collares", precio: 2230, nombre: "collar con hebilla", img: "https://http2.mlstatic.com/D_NQ_NP_915037-MLA52697434657_122022-O.webp" },
    { id: 10, categoria: "juguetes", precio: 650, nombre: "hueso de plastico", img: "https://puppis.vteximg.com.br/arquivos/ids/186460-300-300/269252.jpg?v=637868476664200000" },
    { id: 11, categoria: "juguetes", precio: 850, nombre: "soga", img: "https://http2.mlstatic.com/D_NQ_NP_658191-MLA31787987586_082019-O.jpg" },
    { id: 12, categoria: "juguetes", precio: 700, nombre: "pelota", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREocA-2BhSXCA812y8jT_9UKUqNrIN7Gy6zg&usqp=CAU" },
] */
fetch("./catalogo.json")
    .then(resp => resp.json())
    .then(productos=> miPrograma(productos))
    .catch(error => console.log(error))

function miPrograma(catalogo) {
    let contenedorProductos = document.getElementById("contenedorProductos")
    let contenedorCarrito = document.getElementById("contenedorCarrito")

    let ocultarCarrito = document.getElementById("ocultarCarrito")
    let bienvenida = document.getElementById("bienvenida")
    let ocultarProductos = document.getElementById("productos")
    let ocultarNav = document.getElementById("lista_nav")
    let verCarrito = document.getElementById("verCarrito")
    verCarrito.addEventListener("click", mostrarCarrito)

    function mostrarCarrito() {
        contenedorProductos.classList.toggle("ocultar")
        ocultarCarrito.classList.toggle("ocultar")
        bienvenida.classList.toggle("ocultar")
        ocultarProductos.classList.toggle("ocultar")
        ocultarNav.classList.toggle("ocultar")
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
        <button id="agregar${id}" >Agregar al carrito</button>
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
        <button onclick="restarCant(${id})" class= "btnAumRestCant">-</button>
        <p class= "cantidadCarrito">Cantidad: <span id="cantidad">${cantidad}</span></p>
        <button onclick="aumentarCant(${id})" class= "btnAumRestCant">+</button>
        <p>SubTotal: $${(cantidad * precio)}</p>
        <button onclick="eliminarDelCarrito(${id})" class= "botonEliminarCarrito">Eliminar</button>
        `
            contenedorCarrito.appendChild(tarjetaProducto)
        })
        carritoVacio()
        contadorCarrito.innerText = carrito.length
        precioTotal.innerText = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad * producto.precio, 0)
    }

    function aumentarCant(prodId) {
        let item = carrito.find(producto => producto.id === Number(prodId))
        let indice = carrito.indexOf(item)
        carrito[indice].cantidad++
        actualizarCarrito()
        localStorage.setItem("carrito", JSON.stringify(carrito))
        agreElimToasti("Cantidad actualizada")
    }

    function restarCant(prodId) {
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

    function eliminarDelCarrito(prodId) {
        let item = carrito.find(producto => producto.id === prodId)
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
            html: `<h2 class= "tituloSweet">¡Compra realizada con éxito!</h2>
        `,
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
}