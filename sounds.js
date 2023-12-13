function playBackgroundMusic() {
    // Initialize Web Audio API
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Get the audio element
    var audioElement = document.getElementById('backgroundMusic');

    // Create an audio source from the audio element
    var audioSource = audioContext.createMediaElementSource(audioElement);

    // Connect the audio source to the audio context
    audioSource.connect(audioContext.destination);

    // Start playing the audio
    audioElement.play();
}
function stopBackgroundMusic() {
    // Get the audio element
    var audioElement = document.getElementById('backgroundMusic');

    // Pause the audio
    audioElement.pause();
}