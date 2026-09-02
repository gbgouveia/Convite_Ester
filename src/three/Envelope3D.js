// Componente 3D Envelope de Luxo Hiper-Realista - Convite 15 Anos Ester (Azul Royal & Prata Reluzente)
import * as THREE from 'three';
import gsap from 'gsap';

export class Envelope3D {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.isOpen = false;
    this.textureLoader = new THREE.TextureLoader();
    this.initMaterials();
    this.buildEnvelope();
    this.buildWaxSeal();
    this.buildLetter();
    this.buildShatterParticles();

    this.group.position.set(0, 0, 0);
  }

  initMaterials() {
    const paperTex = this.textureLoader.load('/assets/navy_paper.jpg');
    paperTex.wrapS = THREE.RepeatWrapping;
    paperTex.wrapT = THREE.RepeatWrapping;
    paperTex.repeat.set(2, 2);

    this.matNavyEnvelope = new THREE.MeshPhysicalMaterial({
      color: 0x1E3A8A,
      bumpMap: paperTex,
      bumpScale: 0.02,
      roughness: 0.22,
      metalness: 0.3,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9
    });

    this.matEnvelopeInner = new THREE.MeshStandardMaterial({
      color: 0x2563EB,
      roughness: 0.3,
      metalness: 0.4
    });

    this.matSilverSeal = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      metalness: 0.98,
      roughness: 0.02,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01
    });

    this.matSilverBorder = new THREE.MeshPhysicalMaterial({
      color: 0xF8F9FA,
      metalness: 0.98,
      roughness: 0.05,
      clearcoat: 1.0
    });

    this.matLetterPaper = new THREE.MeshPhysicalMaterial({
      color: 0xF8F9FA,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 0.5
    });
  }

  buildEnvelope() {
    const width = 3.5;
    const height = 2.4;
    const depth = 0.14;

    const bodyGeo = new THREE.BoxGeometry(width, height, depth);
    this.bodyMesh = new THREE.Mesh(bodyGeo, this.matNavyEnvelope);
    this.group.add(this.bodyMesh);

    const borderGeo = new THREE.BoxGeometry(width + 0.06, height + 0.06, depth * 0.7);
    const borderMesh = new THREE.Mesh(borderGeo, this.matSilverBorder);
    borderMesh.position.z = -0.01;
    this.group.add(borderMesh);

    this.buildCornerDecorations(width, height, depth);

    this.flapPivot = new THREE.Group();
    this.flapPivot.position.set(0, height / 2, depth / 2 + 0.006);
    this.group.add(this.flapPivot);

    const flapShape = new THREE.Shape();
    flapShape.moveTo(-width / 2, 0);
    flapShape.lineTo(width / 2, 0);
    flapShape.lineTo(0, -height * 0.72);
    flapShape.closePath();

    const flapGeo = new THREE.ShapeGeometry(flapShape);
    this.flapMesh = new THREE.Mesh(flapGeo, this.matNavyEnvelope);
    this.flapPivot.add(this.flapMesh);

    const flapBorderMesh = new THREE.Mesh(flapGeo, this.matSilverBorder);
    flapBorderMesh.scale.set(1.025, 1.025, 1);
    flapBorderMesh.position.z = -0.003;
    this.flapPivot.add(flapBorderMesh);
  }

  buildCornerDecorations(w, h, d) {
    const cornerSize = 0.35;
    const corners = [
      { x: -w/2 + 0.2, y: h/2 - 0.2 },
      { x: w/2 - 0.2, y: h/2 - 0.2 },
      { x: -w/2 + 0.2, y: -h/2 + 0.2 },
      { x: w/2 - 0.2, y: -h/2 + 0.2 }
    ];

    corners.forEach(c => {
      const geo = new THREE.BoxGeometry(cornerSize, cornerSize, d * 0.8);
      const mesh = new THREE.Mesh(geo, this.matSilverBorder);
      mesh.position.set(c.x, c.y, 0);
      mesh.rotation.z = Math.PI / 4;
      this.group.add(mesh);
    });
  }

  buildWaxSeal() {
    this.sealGroup = new THREE.Group();

    const sealGeo = new THREE.CylinderGeometry(0.42, 0.46, 0.09, 32);
    sealGeo.rotateX(Math.PI / 2);
    this.sealMesh = new THREE.Mesh(sealGeo, this.matSilverSeal);
    this.sealGroup.add(this.sealMesh);

    const ringGeo = new THREE.TorusGeometry(0.38, 0.035, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, this.matSilverSeal);
    this.sealGroup.add(ringMesh);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(128, 128, 110, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#0F2B5C';
    ctx.font = '900 125px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('15', 128, 128);

    const sealTex = new THREE.CanvasTexture(canvas);
    const textGeo = new THREE.PlaneGeometry(0.55, 0.55);
    const textMat = new THREE.MeshStandardMaterial({
      map: sealTex,
      metalness: 0.95,
      roughness: 0.05
    });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.z = 0.05;
    this.sealGroup.add(textMesh);

    this.sealGroup.position.set(0, -0.22, 0.16);
    this.group.add(this.sealGroup);
  }

  buildLetter() {
    const letterGeo = new THREE.PlaneGeometry(3.1, 2.1);
    
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, 600, 400);

    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 6;
    ctx.strokeRect(15, 15, 570, 370);

    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 36px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Ester Ferreira Paixão de Sousa', 300, 160);

    ctx.font = 'italic 26px Cormorant Garamond, serif';
    ctx.fillStyle = '#3B82F6';
    ctx.fillText('• 15 Anos •', 300, 220);

    const letterTex = new THREE.CanvasTexture(canvas);
    const letterMat = new THREE.MeshPhysicalMaterial({
      map: letterTex,
      roughness: 0.2,
      metalness: 0.1
    });

    this.letterMesh = new THREE.Mesh(letterGeo, letterMat);
    this.letterMesh.position.set(0, 0, 0.02);
    this.group.add(this.letterMesh);
  }

  buildShatterParticles() {
    const count = 60;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = -0.22;
      pos[i * 3 + 2] = 0.16;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.08,
      transparent: true,
      opacity: 0
    });

    this.shatterPoints = new THREE.Points(geo, mat);
    this.group.add(this.shatterPoints);
  }

  open(onCompleteCallback) {
    if (this.isOpen) return;
    this.isOpen = true;

    const tl = gsap.timeline({
      onComplete: () => {
        if (onCompleteCallback) onCompleteCallback();
      }
    });

    tl.to(this.sealGroup.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.4,
      ease: "back.in(2)"
    });

    tl.to(this.shatterPoints.material, {
      opacity: 1,
      duration: 0.1
    }, "-=0.3");

    tl.to(this.flapPivot.rotation, {
      x: Math.PI,
      duration: 1.4,
      ease: "power2.inOut"
    }, "-=0.1");

    tl.to(this.letterMesh.position, {
      y: 1.3,
      z: 0.12,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.6");

    tl.to(this.group.rotation, {
      x: 0.1,
      y: 0.2,
      duration: 1.4,
      ease: "power1.out"
    }, 0);
  }

  // Reseta o estado do envelope sem reiniciar o áudio
  reset() {
    this.isOpen = false;
    this.sealGroup.scale.set(1, 1, 1);
    this.flapPivot.rotation.x = 0;
    this.letterMesh.position.set(0, 0, 0.02);
    this.group.rotation.set(0, 0, 0);
    this.shatterPoints.material.opacity = 0;
  }
}
