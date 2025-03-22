// Obtener elementos del DOM
const form = document.getElementById('form-producto');
const tablaProductos = document.getElementById('tabla-productos').getElementsByTagName('tbody')[0];
const selectCategoria = document.getElementById('categoria');
const inputNuevaCategoria = document.getElementById('nueva-categoria');
const buscador = document.getElementById('buscador');
const ordenar = document.getElementById('ordenar');

// Cargar productos y categorías al iniciar
document.addEventListener('DOMContentLoaded', function () {
    cargarCategorias();
    cargarProductos();
});

// Función para agregar un producto
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const categoria = selectCategoria.value || inputNuevaCategoria.value; // Usa la categoría seleccionada o la nueva
    const precioMinimo = parseFloat(document.getElementById('precio-minimo').value);
    const precioVendido = parseFloat(document.getElementById('precio-vendido').value);

    if (!nombre || !categoria || isNaN(precioMinimo) || isNaN(precioVendido)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const producto = {
        nombre,
        categoria,
        precioMinimo,
        precioVendido
    };

    agregarProducto(producto);

    // Si se ingresó una nueva categoría, agregarla al listado
    if (inputNuevaCategoria.value && !selectCategoria.querySelector(`option[value="${inputNuevaCategoria.value}"]`)) {
        agregarCategoria(inputNuevaCategoria.value);
    }

    form.reset();
    mostrarProductos();
});

// Función para agregar un producto a la lista y al localStorage
function agregarProducto(producto) {
    const productos = obtenerProductos();
    productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Función para obtener los productos desde localStorage
function obtenerProductos() {
    return JSON.parse(localStorage.getItem('productos')) || [];
}

// Función para mostrar los productos en la tabla
function mostrarProductos() {
    const productos = obtenerProductos();
    const filtro = buscador.value.toLowerCase();
    const orden = ordenar.value;

    let productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(filtro) || 
        producto.categoria.toLowerCase().includes(filtro)
    );

    if (orden) {
        const [campo, direccion] = orden.split('-');
        productosFiltrados.sort((a, b) => {
            if (a[campo] < b[campo]) return direccion === 'asc' ? -1 : 1;
            if (a[campo] > b[campo]) return direccion === 'asc' ? 1 : -1;
            return 0;
        });
    }

    tablaProductos.innerHTML = '';

    productosFiltrados.forEach((producto, index) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${producto.precioMinimo.toFixed(2)}</td>
            <td>$${producto.precioVendido.toFixed(2)}</td>
            <td class="acciones">
                <button onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;

        tablaProductos.appendChild(fila);
    });
}

// Función para eliminar un producto
function eliminarProducto(index) {
    const productos = obtenerProductos();
    productos.splice(index, 1);
    localStorage.setItem('productos', JSON.stringify(productos));
    mostrarProductos();
}

// Función para cargar categorías desde localStorage
function cargarCategorias() {
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    selectCategoria.innerHTML = '<option value="">Seleccionar categoría</option>';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });
}

// Función para agregar una categoría
function agregarCategoria(categoria) {
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    if (!categorias.includes(categoria)) {
        categorias.push(categoria);
        localStorage.setItem('categorias', JSON.stringify(categorias));
        cargarCategorias();
    }
}

// Eventos para el buscador y el ordenamiento
buscador.addEventListener('input', mostrarProductos);
ordenar.addEventListener('change', mostrarProductos);