document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('background-audio');
    const toggleButton = document.getElementById('toggle-audio');

    if (audio && toggleButton) {
        audio.loop = true;

        // Función para reproducir o pausar el audio
        function toggleAudio() {
            if (audio.paused) {
                audio.play().then(() => {
                    toggleButton.textContent = '❚❚ mute'; // Cambiar texto a "❚❚ mute"
                    localStorage.setItem('audioState', 'playing'); // Guardar estado en localStorage
                }).catch(error => {
                    console.error("Error al intentar reproducir el audio:", error);
                });
            } else {
                audio.pause();
                toggleButton.textContent = '▶ Musica'; // Cambiar texto a "▶ Musica"
                localStorage.setItem('audioState', 'paused'); // Guardar estado en localStorage
            }
        }

        // Inicializar el botón de acuerdo al estado guardado en localStorage
        const savedState = localStorage.getItem('audioState');
        if (savedState === 'playing') {
            audio.play().catch(error => {
                console.error("Error al intentar reproducir el audio:", error);
            });
            toggleButton.textContent = '❚❚ mute';
        } else {
            toggleButton.textContent = '▶ Musica';
        }

        // Asignar evento click al botón
        toggleButton.addEventListener('click', toggleAudio);

        // Restaurar el tiempo de reproducción desde localStorage
        const savedTime = localStorage.getItem('audioCurrentTime');
        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);
        }

        // Guardar el tiempo de reproducción cada cierto intervalo
        setInterval(() => {
            if (!audio.paused) { // Solo guardar el tiempo si el audio está en reproducción
                localStorage.setItem('audioCurrentTime', audio.currentTime);
            }
        }, 1000);

        // Guardar el estado del audio en localStorage antes de navegar
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                localStorage.setItem('audioCurrentTime', audio.currentTime);
                localStorage.setItem('audioState', audio.paused ? 'paused' : 'playing');
            });
        });
    } else {
        console.error("No se encontró el elemento de audio con el ID 'background-audio' o el botón 'toggle-audio'.");
    }
});

// DEFINICION CLASES
document.addEventListener('DOMContentLoaded', () => {
    // Recuperar la elección del personaje desde localStorage
    const personajeGuardado = localStorage.getItem('personajeSeleccionado');
    if (personajeGuardado) {
        console.log(`${personajeGuardado} ha sido restaurado desde localStorage.`);
    }

    // Inicializar el inventario vacío
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    console.log('Inventario inicial:', inventory); // Mostrar el inventario inicial vacío
    updateInventoryUI(); // Actualiza la interfaz del inventario

    // Definición de personajes y sus estadísticas
    const personajes = {
        Lisandro: {
            vida: 40,
            defensa: 0.20,
            velocidad: 0.35,
            fuerza: 15,
            destreza: 0.30,
            calma: 0.60,
            puzzle: 10
        },
        Lucio: {
            vida: 50,
            defensa: 0.30,
            velocidad: 0.08,
            fuerza: 20,
            destreza: 0.20,
            calma: 0.40,
            puzzle: 30
        },
        Marcos: {
            vida: 30,
            defensa: 0.10,
            velocidad: 0.17,
            fuerza: 10, 
            destreza: 0.60,
            calma: 0.80,
            puzzle: 40
        }
    };

    // Recuperar el personaje actual y sus estadísticas
    let personaje = personajes[personajeGuardado] || personajes.Lisandro;

    // Función para actualizar el inventario en localStorage
    function updateInventory(itemName) {
        inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        if (!inventory.includes(itemName)) {
            inventory.push(itemName);
            localStorage.setItem('inventory', JSON.stringify(inventory));
            console.log('Inventario actual:', inventory); // Mostrar el inventario completo
            updateInventoryUI(); // Actualiza la interfaz del inventario
        }
    }

    // Función para actualizar la interfaz del inventario
    function updateInventoryUI() {
        const inventoryList = document.getElementById('inventario-list');
        if (inventoryList) {
            inventoryList.innerHTML = ''; // Limpia la lista actual
            inventory.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                li.setAttribute('data-item', item);
                li.classList.add('inventory-item'); // Añadir clase para estilizar o identificar los elementos
                inventoryList.appendChild(li);
    
                // Añadir manejador de eventos de clic a cada elemento de la lista
                li.addEventListener('click', () => {
                    li.style.display = 'none'; // Ocultar el elemento cuando se hace clic
                    // Opcional: eliminar el ítem del inventario
                    inventory = inventory.filter(i => i !== item);
                    localStorage.setItem('inventory', JSON.stringify(inventory));
                });
            });
        }
    }

    // Función para actualizar la consola
    function updateConsole(message) {
        const consoleOutput = document.getElementById('console-output');
        if (consoleOutput) {
            consoleOutput.textContent = `* ${message}`; // Reemplaza el contenido de la consola con un asterisco
        }
    }

    // Función para actualizar las estadísticas del personaje
    function updateCharacterStats() {
        console.log(`Estadísticas de ${personajeGuardado}:`);
        console.log(`Vida: ${personaje.vida}`);
        console.log(`Defensa: ${personaje.defensa}`);
        console.log(`Velocidad: ${personaje.velocidad}`);
        console.log(`Fuerza: ${personaje.fuerza}`);
        console.log(`Destreza: ${personaje.destreza}`);
        console.log(`Calma: ${personaje.calma}`);
        console.log(`Puzzle: ${personaje.puzzle}`);
    }

    // Función para manejar el clic en los ítems
    function handleItemClick(itemClass, allowedCharacter, successMessage, failureMessage, itemName, showNewItemClass, newImageSrc, setSpeed, increaseDamage) {
        const itemElement = document.querySelector(itemClass);
        if (itemElement) {
            itemElement.addEventListener('click', () => {
                if (personajeGuardado === allowedCharacter) {
                    itemElement.style.display = 'none';
                    updateConsole(successMessage);
    
                    // No guardar el ítem en el inventario si es 'Mapa', 'Amuleto de Velocidad', o 'Piedra para Afilar'
                    if (itemName !== 'Mapa' && itemName !== 'Amuleto de Velocidad' && itemName !== 'Piedra para afilar') {
                        updateInventory(itemName); // Guardar el ítem en el inventario, excepto los ítems mencionados
                    }
    
                    // Actualizar estadísticas según el ítem
                    if (increaseDamage !== undefined) {
                        personaje.fuerza += increaseDamage; // Aumentar el daño del personaje
                        console.log(`El daño de ${personajeGuardado} ha sido incrementado en ${increaseDamage}`);
                    }
                    if (setSpeed !== null && setSpeed !== undefined) {
                        personaje.velocidad = setSpeed; // Establecer la velocidad a un valor específico
                        console.log(`La velocidad de ${personajeGuardado} ha sido establecida en ${personaje.velocidad}`);
                    }
    
                    updateCharacterStats(); // Actualizar las estadísticas del personaje
                    
                    if (showNewItemClass) {
                        document.querySelector(showNewItemClass).style.display = 'block'; // Mostrar el nuevo ítem
                    }
                    if (newImageSrc) {
                        const imageElement = document.getElementById('cuarto_1');
                        if (imageElement) {
                            imageElement.src = newImageSrc; // Cambiar la imagen
                        }
                    }
                } else {
                    updateConsole(failureMessage);
                }
            });
        }
    }
    

    // Función para verificar la visibilidad del ítem i5 según la imagen de fondo
    function updateItemVisibility() {
        const imageElement = document.getElementById('cuarto_1');
        const item5Element = document.querySelector('.i5');
        if (imageElement && item5Element) {
            if (imageElement.src.includes('cuarto_1_tabla')) {
                item5Element.style.display = 'block'; // Mostrar el ítem si la imagen es cuarto_1_tabla
            } else {
                item5Element.style.display = 'none'; // Ocultar el ítem si la imagen es cuarto_1
            }
        }
    }

    // Inicializar la visibilidad del ítem i5 basado en la imagen de fondo actual
    updateItemVisibility();

    // Manejadores de eventos para los ítems
    handleItemClick('.i1', 'Marcos', 'Metes la cabeza y con la mano alcanzas algo, ¡Has encontrado un coffler air a la mitad!', 'Ves que hay un objeto, pero tu brazo no entra para agarrarlo...', 'Coffler Air a la mitad');
    handleItemClick('.i2', 'Lisandro', 'Agarras un coffler air del techo', 'Ves un coffler air en el techo, pero no llegas a agarrarlo', 'Coffler Air');
    handleItemClick('.i3', 'Lucio', 'Encontraste un mapa en la pared, al revisarlo te diste cuenta que decía la ubicación de un secreto, esta bajo esa madera', 'Ves un mapa en la pared, pero no podes entenderlo...', 'Mapa', '.i5', './images/cuarto_1_tabla.jpg');
    handleItemClick('.i4', 'Marcos', 'Te metes en el agujero, ¡Has encontrado una piedra para afilar! tu cuchillo hace el doble de daño', 'Intentas ver que hay en el agujero, pero es muy estrecho', 'Piedra para afilar', null, null, null, 5);
    handleItemClick('.i5', 'Lucio', '¡Has encontrado un amuleto de velocidad!, tu velocidad sube en una estrella', 'si lees esto el código falló', 'Amuleto de Velocidad', null, null, 0.12); // Establecer velocidad en 0.12

    // Almacenar la elección del personaje en localStorage
    document.querySelectorAll('.choose-character').forEach(button => {
        button.addEventListener('click', () => {
            const personaje = button.getAttribute('data-character');
            localStorage.setItem('personajeSeleccionado', personaje);
            console.log(`${personaje} ha sido elegido.`);

            // Limpiar el inventario cuando se elige un personaje
            localStorage.removeItem('inventory');
            inventory = []; // Vaciar la variable de inventario
            updateInventoryUI(); // Actualizar la interfaz del inventario
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const usarItemBtn = document.getElementById('usar-item-btn');
    const inventarioItems = document.querySelectorAll('.inventario li');

    usarItemBtn.addEventListener('click', () => {
        // Añade la clase 'activable' a todos los ítems
        inventarioItems.forEach(item => {
            item.classList.add('activable');
        });
    });
});



