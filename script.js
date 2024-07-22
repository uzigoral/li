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


document.addEventListener('DOMContentLoaded', function() {
    // Manejo de selección de personaje
    const buttons = document.querySelectorAll('button[data-character]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Evita la navegación predeterminada

            const selectedCharacter = this.getAttribute('data-character');
            console.log('Personaje seleccionado:', selectedCharacter);

            // Aquí puedes hacer algo con el personaje seleccionado
            // Por ejemplo, guardarlo en localStorage para usarlo en otras páginas
            localStorage.setItem('selectedCharacter', selectedCharacter);

            // Navegar a la siguiente página
            window.location.href = this.parentElement.getAttribute('href');
        });
    });

    // Opcional: Recuperar el personaje seleccionado en otras páginas
    const selectedCharacter = localStorage.getItem('selectedCharacter');
    if (selectedCharacter) {
        console.log('Personaje seleccionado previamente:', selectedCharacter);
        // Aquí puedes usar el personaje seleccionado para personalizar la página
    }

    // Definición de clases
    class Personaje {
        constructor(nombre, vida, defensa, velocidad, fuerza, destreza, calma, puzzle) {
            this.nombre = nombre;
            this.vida = vida;
            this.defensa = defensa;
            this.velocidad = velocidad;
            this.fuerza = fuerza;
            this.destreza = destreza;
            this.calma = calma;
            this.puzzle = puzzle;
        }

        actualizarEstadisticas(vida, defensa, velocidad, fuerza, destreza, calma, puzzle) {
            this.vida = vida;
            this.defensa = defensa;
            this.velocidad = velocidad;
            this.fuerza = fuerza;
            this.destreza = destreza;
            this.calma = calma;
            this.puzzle = puzzle;
        }
    }

    // Crear instancias para cada personaje con estadísticas vacías
    const lisandro = new Personaje("Lisandro", 40, 20, 40, 30, 30, 30, 10);
    const lucio = new Personaje("Lucio", 50, 30, 10, 40, 20, 20, 30);
    const marcos = new Personaje("Marcos", 30, 10, 20, 10, 50, 40, 40);

    console.log(lisandro);
    console.log(lucio);
    console.log(marcos);
    console.log(selectedCharacter)
});