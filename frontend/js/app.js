document.addEventListener('DOMContentLoaded', function() {
    // Cargar usuarios
    document.getElementById('cargarUsuarios').addEventListener('click', function() {
        fetch('http://localhost:9001/usuarios/list.usuarios')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                let usuariosList = document.getElementById('usuariosList');
                usuariosList.innerHTML = ''; 
                
                data.data.users.forEach(usuario => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${usuario.id}</td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.correo}</td>
                    `;
                    usuariosList.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error);
            });
    });

    // Cargar productos
    document.getElementById('cargarProductos').addEventListener('click', function() {
        fetch('http://localhost:9001/productos/list.productos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                let productosList = document.getElementById('productosList');
                productosList.innerHTML = '';
                
                data.data.products.forEach(producto => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${producto.id}</td>
                        <td>${producto.nombre}</td>
                        <td>$${producto.precio}</td>
                        <td>${producto.stock}</td>
                    `;
                    productosList.appendChild(row);
                });
            })
            .catch(err => console.error('Error al cargar productos:', err));
    });

    // Manejo del formulario de añadir producto
    document.getElementById('addProductoForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const precio = document.getElementById('precio').value;
        const stock = document.getElementById('stock').value;

        fetch('http://localhost:9001/productos/add.producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, precio, stock })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(data.data.message);

            document.getElementById('nombre').value = '';
            document.getElementById('precio').value = '';
            document.getElementById('stock').value = '';

            document.getElementById('cargarProductos').click();
        })
        .catch(err => console.error('Error al añadir producto:', err));
    });

    // Manejo del formulario de añadir usuario
    document.getElementById('addUsuarioForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombreUsuario').value;
        const correo = document.getElementById('correo').value;

        fetch('http://localhost:9001/usuarios/add.usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, correo })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(data.data.message);

            document.getElementById('nombreUsuario').value = '';
            document.getElementById('correo').value = '';

            document.getElementById('cargarUsuarios').click();
        })
        .catch(err => console.error('Error al añadir usuario:', err));
    });
});
