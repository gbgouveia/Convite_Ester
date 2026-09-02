// Ponto de Entrada Principal da Aplicação - Convite 15 Anos Ester (Azul & Prata)
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Scene3D } from './three/scene.js';
import { initAudio, playEnvelopeOpenSound, playTransitionChime, playFanfareSound, toggleMute } from './audio.js';
import { MAPS_URL, RSVP_API_URL, EVENT_DATA } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializa a Cena 3D Three.js
  const canvas = document.getElementById('webgl-canvas');
  const scene3D = new Scene3D(canvas);

  // 2. Configura os Links de Ação (WhatsApp RSVP Seguro & Google Maps)
  const btnWhatsapp = document.getElementById('btn-whatsapp');
  const btnMaps = document.getElementById('btn-maps');

  if (btnWhatsapp) btnWhatsapp.href = RSVP_API_URL;
  if (btnMaps) btnMaps.href = MAPS_URL;

  // 3. Preenche os Dados da Aniversariante no DOM
  document.getElementById('event-name').textContent = EVENT_DATA.name;
  document.getElementById('event-date').textContent = `${EVENT_DATA.date} (${EVENT_DATA.dayOfWeek}) às ${EVENT_DATA.time}`;
  document.getElementById('event-location').textContent = EVENT_DATA.location;
  document.getElementById('event-dress').textContent = EVENT_DATA.dressCode;

  // 4. Controle Discreto de Áudio (Mute / Unmute)
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const audioLabel = document.getElementById('audio-label');

  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      initAudio();
      const muted = toggleMute();
      audioIcon.textContent = muted ? '🔇' : '🎵';
      audioLabel.textContent = muted ? 'Som Desligado' : 'Som Ligado';
    });
  }

  // 5. ISOLAMENTO CRÍTICO DE EVENTOS - Abertura da Experiência (Fase 1 ➔ Fase 2)
  const btnAbrir = document.getElementById('btn-abrir-envelope');

  if (btnAbrir) {
    btnAbrir.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      btnAbrir.style.pointerEvents = 'none';

      // Inicializa a música "Bondade de Deus" e dispara abertura (NÃO reinicia a música se já estiver tocando!)
      initAudio();
      playEnvelopeOpenSound();

      gsap.to('#hero-overlay', {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          document.getElementById('hero-overlay').style.display = 'none';
        }
      });

      gsap.to('#timeline-indicator', {
        opacity: 1,
        duration: 0.8
      });

      scene3D.cameraController.startSequence(
        scene3D.envelope,
        () => {
          playTransitionChime();
        },
        () => {
          revelarCartaoFinal();
        }
      );
    });
  }

  // 6. REVELAÇÃO DA FASE 3 (Cartão Final e Botões de Ação)
  function revelarCartaoFinal() {
    gsap.to('#timeline-indicator', { opacity: 0, duration: 0.5 });
    playFanfareSound();
    fireSilverBlueConfetti();

    const cardContainer = document.getElementById('card-final-container');
    cardContainer.classList.add('active');
    cardContainer.style.display = 'flex';

    gsap.to(cardContainer, {
      opacity: 1,
      duration: 1.0,
      ease: "power2.out",
      onStart: () => {
        cardContainer.style.pointerEvents = 'auto';
        cardContainer.style.visibility = 'visible';
      }
    });
  }

  // Confetes Prateados e Azuis
  function fireSilverBlueConfetti() {
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#C0C0C0', '#E8ECEF', '#1D4ED8', '#1E3A8A', '#93C5FD']
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }

  // 7. Rever Experiência 3D sem Reiniciar a Música nem a Página!
  const btnReplay = document.getElementById('btn-replay');
  if (btnReplay) {
    btnReplay.addEventListener('click', (e) => {
      e.preventDefault();

      const cardContainer = document.getElementById('card-final-container');
      cardContainer.style.pointerEvents = 'none';

      gsap.to(cardContainer, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          cardContainer.style.display = 'none';
          cardContainer.classList.remove('active');

          const heroOverlay = document.getElementById('hero-overlay');
          const btnAbrirEl = document.getElementById('btn-abrir-envelope');
          heroOverlay.style.display = 'block';
          if (btnAbrirEl) btnAbrirEl.style.pointerEvents = 'auto';

          gsap.to(heroOverlay, { opacity: 1, duration: 0.5 });

          // Reseta a trajetória 3D mantendo a MÚSICA TOCANDO CONTINUAMENTE!
          scene3D.cameraController.resetSequence(scene3D.envelope);
        }
      });
    });
  }
});
