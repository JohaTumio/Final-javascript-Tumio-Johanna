let catalogo = [
    { id: 1, categoria: "camas, cama", cantidad: 1, precio: 9000, nombre: "cama moises", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgpOCexEOIgJq9IYGBFPTSgkETxpPPXz1HUg&usqp=CAU" },
    { id: 2, categoria: "camas, cama", cantidad: 1, precio: 7800, nombre: "cama colchon impermeable", img: "https://http2.mlstatic.com/D_NQ_NP_601738-MLA48266739222_112021-O.webp" },
    { id: 3, categoria: "camas,cama", cantidad: 1, precio: 8500, nombre: "cama moises mullida", img: "https://http2.mlstatic.com/D_NQ_NP_885248-MLA48241075480_112021-O.jpg" },
    { id: 4, categoria: "comederos", cantidad: 1, precio: 4200, nombre: "comedero en altura", img: "https://http2.mlstatic.com/D_NQ_NP_672083-MLA46209835771_052021-O.webp" },
    { id: 5, categoria: "comederos", cantidad: 1, precio: 3000, nombre: "comedero dispenser", img: "https://http2.mlstatic.com/D_NQ_NP_908077-MLA52448373372_112022-V.jpg" },
    { id: 6, categoria: "comederos", cantidad: 1, precio: 800, nombre: "comedero acero inoxidable", img: "https://http2.mlstatic.com/D_NQ_NP_834336-MLA51521258426_092022-O.webp" },
    { id: 7, categoria: "collares", cantidad: 1, precio: 1300, nombre: "collar regulable", img: "https://puppis.vteximg.com.br/arquivos/ids/189314-300-300/228998.jpg?v=637982461867100000" },
    { id: 8, categoria: "collares", cantidad: 1, precio: 600, nombre: "collar con pañuelo", img: "https://http2.mlstatic.com/D_NQ_NP_727013-MLA43426246555_092020-O.webp" },
    { id: 9, categoria: "collares", cantidad: 1, precio: 2230, nombre: "collar con hebilla", img: "https://http2.mlstatic.com/D_NQ_NP_915037-MLA52697434657_122022-O.webp" },
    { id: 10, categoria: "juguetes", cantidad: 1, precio: 650, nombre: "hueso de plastico", img: "https://puppis.vteximg.com.br/arquivos/ids/186460-300-300/269252.jpg?v=637868476664200000" },
    { id: 11, categoria: "juguetes", cantidad: 1, precio: 850, nombre: "soga", img: "https://http2.mlstatic.com/D_NQ_NP_658191-MLA31787987586_082019-O.jpg" },
    { id: 12, categoria: "juguetes", cantidad: 1, precio: 700, nombre: "pelota", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREocA-2BhSXCA812y8jT_9UKUqNrIN7Gy6zg&usqp=CAU" },
]

let contenedorProductos = document.getElementById("contenedorProductos")
let contenedorCarrito = document.getElementById("contenedorCarrito")

renderizarProductos(catalogo)

let verTodos = document.getElementById("verTodos")
verTodos.addEventListener("click", verTodosProductos)

function verTodosProductos() {
    renderizarProductos(catalogo)
}

function renderizarProductos(arr) {
    contenedorProductos.innerHTML = ""
    arr.forEach(({nombre, precio, img, id}) => {
        let tarjetaProducto = document.createElement("article")
        //tarjetaProducto.classList.add("producto")
        tarjetaProducto.innerHTML = `
        <h3>${nombre}</h3>
        <p>$${precio}</p>
        <img src=${img} />
        <button id="agregar${id}" >Agregar al carrito</button>
        `

        contenedorProductos.append(tarjetaProducto)

        let boton = document.getElementById(`agregar${id}`)
        boton.addEventListener("click", () => { agregarAlCarrito(id) })
    })
}

let inputFiltrar = document.getElementById("inputFiltrar")
let botonBuscar = document.getElementById("buscar")
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
        carrito.push(item)
    }
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarCarrito()
    console.log(carrito)
}

function actualizarCarrito() {
    contenedorCarrito.innerText = ""
    carrito.forEach(({nombre, precio, cantidad, id}) => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.classList.add("itemCarrito")
        tarjetaProducto.innerHTML = `
        <h3>${nombre}</h3>
        <p>Precio:$ ${precio}</p>
        <p>Cantidad: <span id="cantidad">${cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${id})" class= "boton-eliminar">Eliminar</button>
        `
        contenedorCarrito.appendChild(tarjetaProducto)

    })
    contadorCarrito.innerText = carrito.length
    precioTotal.innerText = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad * producto.precio, 0)

}

function eliminarDelCarrito(prodId) {
    let item = carrito.find(producto => producto.id === prodId)
    let indice = carrito.indexOf(item)
    carrito.splice(indice, 1)
    actualizarCarrito()
    console.log(carrito)
}

let botonVaciar = document.getElementById("finalizarCarrito")
botonVaciar.addEventListener("click", finalizarCompra)

function finalizarCompra() {
    localStorage.removeItem("carrito")
    carrito = []
    actualizarCarrito()
    console.log(carrito)
}



