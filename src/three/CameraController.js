// Controladora da Câmera e Animação GSAP (Trajetória Suave e Desacelerada)
import gsap from 'gsap';

export class CameraController {
  constructor(camera, floralWall) {
    this.camera = camera;
    this.floralWall = floralWall;

    this.camera.position.set(0, 0, 5.0);
    this.camera.lookAt(0, 0, 0);

    this.currentPhase = 1; // 1: Envelope, 2: Túnel, 3: Cartão Final
    this.activeTimeline = null;
  }

  updateFOV() {
    const isMobile = window.innerWidth < 768;
    this.camera.fov = isMobile ? 68 : 52;
    this.camera.updateProjectionMatrix();
  }

  // Transição Cinemática Desacelerada (Trajetória pelo Túnel de Memórias em 22 segundos)
  startSequence(envelope, onPhase2Callback, onPhase3Callback) {
    if (this.currentPhase !== 1) return;
    this.currentPhase = 2;

    if (onPhase2Callback) onPhase2Callback();

    this.activeTimeline = gsap.timeline();

    envelope.open(() => {
      // Foto 1: Ester Pequena (Moldura em Z = -10, Câmera para em Z = -5.0 para contemplação perfeita)
      this.activeTimeline.to(this.camera.position, {
        z: -5.0,
        duration: 6.0,
        ease: "power1.inOut",
        onUpdate: () => this.updateWallPosition()
      })
      .to(this.camera.position, {
        z: -5.5,
        duration: 2.5,
        ease: "none",
        onUpdate: () => this.updateWallPosition()
      })
      // Foto 2: Ester Media (Moldura em Z = -18, Câmera para em Z = -13.0)
      .to(this.camera.position, {
        z: -13.0,
        duration: 6.0,
        ease: "power1.inOut",
        onUpdate: () => this.updateWallPosition()
      })
      .to(this.camera.position, {
        z: -13.5,
        duration: 2.5,
        ease: "none",
        onUpdate: () => this.updateWallPosition()
      })
      // Foto 3: Ester com Violino (Moldura em Z = -26, Câmera para em Z = -21.0)
      .to(this.camera.position, {
        z: -21.0,
        duration: 6.0,
        ease: "power1.inOut",
        onUpdate: () => this.updateWallPosition()
      })
      .to(this.camera.position, {
        z: -21.5,
        duration: 2.5,
        ease: "none",
        onUpdate: () => this.updateWallPosition()
      })
      // Foto 4: Ester 15 Anos (Moldura em Z = -34, Câmera para em Z = -29.0)
      .to(this.camera.position, {
        z: -29.0,
        duration: 6.0,
        ease: "power1.inOut",
        onUpdate: () => this.updateWallPosition()
      })
      .to(this.camera.position, {
        z: -29.5,
        duration: 2.5,
        ease: "none",
        onUpdate: () => this.updateWallPosition()
      })
      // Transição Cinemática suave para o Cartão Final de Convite (Z = -42)
      .to(this.camera.position, {
        z: -42.0,
        duration: 7.0,
        ease: "power2.out",
        onUpdate: () => this.updateWallPosition(),
        onComplete: () => {
          this.currentPhase = 3;
          if (onPhase3Callback) onPhase3Callback();
        }
      });

      this.activeTimeline.to(this.camera.rotation, {
        y: 0.06,
        duration: 5.0,
        yoyo: true,
        repeat: 4,
        ease: "sine.inOut"
      }, 0);
    });
  }

  // Reseta suavemente a câmera e o envelope para rever a experiência SEM interromper o áudio
  resetSequence(envelope, onCompleteCallback) {
    if (this.activeTimeline) {
      this.activeTimeline.kill();
    }

    this.currentPhase = 1;

    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 5.0,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => this.updateWallPosition(),
      onComplete: () => {
        if (envelope) envelope.reset();
        if (onCompleteCallback) onCompleteCallback();
      }
    });

    gsap.to(this.camera.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.5
    });
  }

  updateWallPosition() {
    if (this.floralWall && this.camera) {
      this.floralWall.update(this.camera.position.z);
    }
  }

  update() {
    this.updateWallPosition();
  }
}
