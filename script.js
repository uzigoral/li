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

    // Limpiar el inventario al comenzar una nueva partida
    localStorage.removeItem('inventory'); // Esto asegura que el inventario está vacío al reiniciar el juego

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
            fuerza: 5, // + 5 con cuchillo mariposa (esto se añadirá cuando se equipen armas)
            destreza: 0.60,
            calma: 0.80,
            puzzle: 40
        }
    };

    // Recuperar el personaje actual y sus estadísticas
    let personaje = personajes[personajeGuardado];
    if (!personaje) {
        // Si no hay personaje guardado, usa el primer personaje por defecto
        personaje = personajes.Lisandro;
    }
    
    // Actualizar estadísticas del personaje
    function updateCharacterStats() {
        personajes[personajeGuardado] = personaje;
    }

    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    console.log('Inventario inicial:', inventory);

    // Función para actualizar el inventario en localStorage
    function updateInventory(itemName) {
        // Asegurarse de que el inventario está vacío cuando se comienza una nueva partida
        inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        if (!inventory.includes(itemName)) {
            inventory.push(itemName);
            localStorage.setItem('inventory', JSON.stringify(inventory));
            console.log('Inventario actual:', inventory); // Mostrar el inventario completo
        }
    }

    // Función para actualizar la consola
    function updateConsole(message) {
        const consoleOutput = document.getElementById('console-output');
        if (consoleOutput) {
            consoleOutput.textContent = `* ${message}`; // Reemplaza el contenido de la consola con un asterisco
        }
    }

    // Función para manejar el clic en los ítems
    function handleItemClick(itemClass, allowedCharacter, successMessage, failureMessage, itemName, showNewItemClass, newImageSrc, increaseSpeed) {
        const itemElement = document.querySelector(itemClass);
        if (itemElement) {
            itemElement.addEventListener('click', () => {
                if (personajeGuardado === allowedCharacter) {
                    itemElement.style.display = 'none';
                    updateConsole(successMessage);
                    updateInventory(itemName); // Guardar el ítem en el inventario
                    if (showNewItemClass) {
                        document.querySelector(showNewItemClass).style.display = 'block'; // Mostrar el nuevo ítem
                    }
                    if (newImageSrc) {
                        const imageElement = document.getElementById('cuarto_1');
                        if (imageElement) {
                            imageElement.src = newImageSrc; // Cambiar la imagen
                        }
                    }
                    if (increaseSpeed) {
                        personaje.velocidad += 0.12; // Aumentar la velocidad en un 12%
                        updateCharacterStats(); // Actualizar las estadísticas del personaje
                        console.log(`La velocidad de ${personajeGuardado} ha aumentado a ${personaje.velocidad}`);
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
    handleItemClick('.i4', 'Marcos', 'Te metes en el agujero, ¡Has encontrado una piedra para afilar!', 'Intentas ver que hay en el agujero, pero es muy estrecho', 'Piedra para afilar');
    handleItemClick('.i5', 'Lucio', '¡Has encontrado un amuleto de velocidad, tu velocidad sube en una estrella!', 'si lees esto el codigo fallo', 'Amuleto de Velocidad', null, null, true); // Aumentar velocidad en 12%

    // Almacenar la elección del personaje en localStorage
    document.querySelectorAll('.choose-character').forEach(button => {
        button.addEventListener('click', () => {
            const personaje = button.getAttribute('data-character');
            localStorage.setItem('personajeSeleccionado', personaje);
            console.log(`${personaje} ha sido elegido.`);
        });
    });
});