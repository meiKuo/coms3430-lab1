var egg = ['./images/1.jpeg', './images/2.jpeg', './images/3.jpeg', './images/4.jpeg'] 

document.addEventListener("DOMContentLoaded", function (event) {

    var wave_type = 'sine'
    var waves = document.getElementById("select_wave").waves
    var activeGainNode = {}
    var frame = 0

    for (var i = 0; i < waves.length; i++) {
        waves[i].onclick = function () {
            wave_type = this.value;
        }
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560,  //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929,  //C - E
        '86': 349.228231433003884,  //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294,  //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000,  //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111,  //M - B
        '81': 523.251130601197269,  //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120,  //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859,  //E - E
        '82': 698.456462866007768,  //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588,  //T - G
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000,  //Y - A
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223,  //U - B
    }

    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);

    var activeOscillators = {}

    const globalGain = audioCtx.createGain(); //this will control the volume of all notes
    globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime)
    globalGain.connect(audioCtx.destination);

    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
            playNote(key);
            setTimeout(changeEgg, 50); 
        }
    }

    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {
            activeGainNode[key].gain.cancelScheduledValues(audioCtx.currentTime);
            activeGainNode[key].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01); //release

        }
        activeOscillators[key].stop(audioCtx.currentTime + 2);//cushion
        delete activeOscillators[key];
        delete activeGainNode[key];
    }

    function playNote(key) {
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)
        osc.type = wave_type

        const gainNode = audioCtx.createGain();
        
        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime) //gentle fade in so no zero
        osc.connect(gainNode);

        gainNode.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.1); //reach peak
        gainNode.gain.exponentialRampToValueAtTime(0.4, audioCtx.currentTime + 0.8); //S
       
        gainNode.connect(audioCtx.destination); 
        osc.start();

        activeOscillators[key] = osc;
        activeGainNode[key] = gainNode;
    }

    function changeEgg(){
        if (frame == 4){
            frame = 0
        }
        document.getElementById("eggo").src = egg[frame]; 
        frame++;
    }

    
});