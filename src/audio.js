// Módulo de Áudio - Trilha Sonora Contínua ("Bondade de Deus - Violino Cover") & Efeitos Sonoros
let audioCtx = null;
let isMuted = false;
let bgAudio = null;
let isAudioInitialized = false;
let isAudioEnded = false;

// Inicializa a trilha sonora MP3 sem loop (toca até o final natural da faixa de 11MB)
export function initAudio() {
  if (!bgAudio) {
    bgAudio = new Audio('assets/bg_music.mp3');
    bgAudio.loop = false; // SEM LOOP
    bgAudio.volume = 0.6;

    // Quando a música chegar ao final natural, permanece encerrada e não reinicia
    bgAudio.addEventListener('ended', () => {
      isAudioEnded = true;
    });
  }

  if (!audioCtx) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    } catch (e) {
      console.warn("Web Audio API não suportada.", e);
    }
  }

  isAudioInitialized = true;
}

// Alterna Mute/Unmute sem reiniciar a faixa de música
export function toggleMute() {
  isMuted = !isMuted;
  if (bgAudio) {
    bgAudio.muted = isMuted;
  }
  if (audioCtx && audioCtx.state === 'suspended' && !isMuted) {
    audioCtx.resume();
  }
  return isMuted;
}

export function getIsMuted() {
  return isMuted;
}

// Inicia a música de fundo se ainda não estiver tocando (NÃO REINICIA se já estiver tocando ou se chegou ao fim!)
export function playEnvelopeOpenSound() {
  initAudio();

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // Toca a música de fundo APENAS se estiver pausada e ainda não tiver atingido o fim natural
  if (bgAudio && bgAudio.paused && !isAudioEnded) {
    bgAudio.play().catch(err => {
      console.warn("Autoplay bloqueado pelo navegador, aguardando clique.", err);
    });
  }

  if (!audioCtx || isMuted) return;

  const now = audioCtx.currentTime;

  // Ruído sutil de papel/cera (sem afetar a música MP3)
  const bufferSize = audioCtx.sampleRate * 0.3;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(900, now);
  filter.frequency.exponentialRampToValueAtTime(200, now + 0.25);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start(now);
}

// Chime de Transição
export function playTransitionChime() {
  if (!audioCtx || isMuted) return;
  const now = audioCtx.currentTime;
  const notes = [523.25, 659.25, 783.99];

  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.08);

    gain.gain.setValueAtTime(0, now + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.06, now + i * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.65);
  });
}

// Fanfarra Festiva
export function playFanfareSound() {
  if (!audioCtx || isMuted) return;
  const now = audioCtx.currentTime;
  const chord = [261.63, 329.63, 392.00, 523.25];

  chord.forEach((freq) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.1);
  });
}
