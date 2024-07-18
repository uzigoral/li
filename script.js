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


class Personaje {
    constructor(nombre, vida, defensa, velocidad, fuerza, destreza, sigilo, puzzle) {
        this.nombre = nombre;
        this.vida = vida; // Estrellas para Vida, inicialmente vacío
        this.defensa = defensa; // Estrellas para Defensa, inicialmente vacío
        this.velocidad = velocidad; // Estrellas para Velocidad, inicialmente vacío
        this.fuerza = fuerza; // Estrellas para Fuerza, inicialmente vacío
        this.destreza = destreza; // Estrellas para Destreza, inicialmente vacío
        this.sigilo = sigilo; // Estrellas para Sigilo, inicialmente vacío
        this.puzzle = puzzle; // Estrellas para Puzzle, inicialmente vacío
    }

    actualizarEstadisticas(vida, defensa, velocidad, fuerza, destreza, sigilo, puzzle) {
        this.vida = vida;
        this.defensa = defensa;
        this.velocidad = velocidad;
        this.fuerza = fuerza;
        this.destreza = destreza;
        this.sigilo = sigilo;
        this.puzzle = puzzle;
    }
}

// Crear instancias para cada personaje con estadísticas vacías
const lisandro = new Personaje("Lisandro", "", "", "", "", "", "", "");
const lucio = new Personaje("Lucio", "", "", "", "", "", "", "");
const marcos = new Personaje("Marcos", "", "", "", "", "", "", "");