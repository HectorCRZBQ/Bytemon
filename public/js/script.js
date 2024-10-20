// Obtener el estado del sonido desde localStorage
let soundEnabled = localStorage.getItem('soundEnabled') === 'true';

// Obtener todos los botones que deberían activar el sonido
const soundButtons = document.querySelectorAll('.sound-button');

// Inicializar el botón de sonido
const soundToggleButton = document.getElementById('sound-toggle');
if (soundToggleButton) {
    soundToggleButton.innerText = soundEnabled ? 'Desactivar sonido' : 'Activar sonido';

    // Agregar evento al botón de activar sonido
    soundToggleButton.addEventListener('click', () => {
        soundEnabled = !soundEnabled; // Cambiar estado
        localStorage.setItem('soundEnabled', soundEnabled); // Guardar en localStorage
        soundToggleButton.innerText = soundEnabled ? 'Desactivar sonido' : 'Activar sonido';
    });
}

// Variable para controlar el estado de reproducción
let isSpeaking = false;

// Función para hablar el texto de un botón
function speak(text) {
    if (soundEnabled && !isSpeaking) { // Solo habla si el sonido está habilitado y no está hablando
        const utterance = new SpeechSynthesisUtterance(text);
        isSpeaking = true; // Indica que se está hablando

        // Al finalizar la reproducción, restablece isSpeaking
        utterance.onend = () => {
            isSpeaking = false;
        };

        speechSynthesis.speak(utterance);
    }
}

// Agregar el evento click a todos los botones seleccionados
soundButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        // Hablar el texto del botón al hacer clic
        if (button.id === 'contrast-toggle') {
            document.body.classList.toggle('high-contrast');

            // Guardar la preferencia en localStorage
            if (document.body.classList.contains('high-contrast')) {
                localStorage.setItem('highContrast', 'enabled');
                speak('Alto contraste activado'); // Hablar el estado
            } else {
                localStorage.setItem('highContrast', 'disabled');
                speak('Alto contraste desactivado'); // Hablar el estado
            }
        } else {
            // Hablar el texto del botón
            speak(button.innerText);
        }
    });
});

// Al cargar la página, aplica el estado de alto contraste
if (localStorage.getItem('highContrast') === 'enabled') {
    document.body.classList.add('high-contrast');
}
