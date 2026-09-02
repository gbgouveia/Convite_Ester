// Módulo Principal Three.js - Cena, Iluminação de Estúdio de Luxo e Partículas Prateadas
import * as THREE from 'three';
import { FloralWall } from './FloralWall.js';
import { Envelope3D } from './Envelope3D.js';
import { MemoryTunnel } from './MemoryTunnel.js';
import { CameraController } from './CameraController.js';

export class Scene3D {
  constructor(canvasElement) {
    this.canvas = canvasElement;

    this.initScene();
    this.initLights();
    this.initParticles();

    // Instancia Componentes 3D
    this.floralWall = new FloralWall(this.scene);
    this.envelope = new Envelope3D(this.scene);
    this.memoryTunnel = new MemoryTunnel(this.scene);
    this.cameraController = new CameraController(this.camera, this.floralWall);

    this.clock = new THREE.Clock();
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070D1E);
    this.scene.fog = new THREE.FogExp2(0x070D1E, 0.02);

    // Câmera
    const isMobile = window.innerWidth < 768;
    this.camera = new THREE.PerspectiveCamera(
      isMobile ? 68 : 52,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    // Renderizador PBR de Alta Performance com ACESFilmicToneMapping
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35; // Iluminação mais clara e radiante
  }

  initLights() {
    // 1. Luz Ambiente Calibrada para Evitar Qualquer Sombra Preta
    const ambientLight = new THREE.AmbientLight(0x2563EB, 1.8);
    this.scene.add(ambientLight);

    // 2. Luz Frontal de Destaque no Envelope (Front Key Light)
    const frontSpot = new THREE.DirectionalLight(0xFFFFFF, 3.8);
    frontSpot.position.set(0, 2, 8);
    this.scene.add(frontSpot);

    // 3. Luz Superior de Estúdio (Top Light)
    const topLight = new THREE.DirectionalLight(0xF8F9FA, 2.5);
    topLight.position.set(3, 8, 5);
    this.scene.add(topLight);

    // 4. Halo de Luz Azul Celeste Atrás do Envelope (Glow Effect)
    const envelopeHalo = new THREE.PointLight(0x93C5FD, 3.5, 12);
    envelopeHalo.position.set(0, 0, -0.5);
    this.scene.add(envelopeHalo);

    // 5. Rim Light 1 - Azul Royal Metálico
    const rimLightBlue = new THREE.PointLight(0x1D4ED8, 4.5, 18);
    rimLightBlue.position.set(-6, 3, 2);
    this.scene.add(rimLightBlue);

    // 6. Rim Light 2 - Prata Cromada Reluzente
    const rimLightSilver = new THREE.PointLight(0xFFFFFF, 4.0, 18);
    rimLightSilver.position.set(6, -2, 3);
    this.scene.add(rimLightSilver);
  }

  initParticles() {
    // Sistema de Poeira de Cristal / Glitter Prateado (800+ Partículas)
    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = Math.random() * -50 + 5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xF8F9FA,
      size: 0.07,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.silverParticles = new THREE.Points(geometry, material);
    this.scene.add(this.silverParticles);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.cameraController.updateFOV();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    if (this.memoryTunnel) {
      this.memoryTunnel.update(elapsedTime);
    }

    if (this.silverParticles) {
      this.silverParticles.rotation.y = elapsedTime * 0.02;
      this.silverParticles.rotation.z = elapsedTime * 0.01;
    }

    if (this.cameraController) {
      this.cameraController.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}
