// Componente 3D Trajetória de Memórias (Fotos de Alta Resolução + Responsividade Mobile)
import * as THREE from 'three';
import { MEMORY_PHOTOS } from '../config.js';

export class MemoryTunnel {
  constructor(scene) {
    this.scene = scene;
    this.framesGroup = new THREE.Group();
    this.scene.add(this.framesGroup);

    this.frameMeshes = [];
    this.textureLoader = new THREE.TextureLoader();
    this.initMaterials();
    this.buildPhotoFrames();
  }

  initMaterials() {
    // Moldura Fina em Prata Cromada Espelhada
    this.matSilverFrame = new THREE.MeshPhysicalMaterial({
      color: 0xE8ECEF,
      metalness: 0.95,
      roughness: 0.08,
      reflectivity: 0.9,
      clearcoat: 1.0
    });
  }

  // Gera a composição visual da foto + legenda prateada
  createPhotoCompositeTexture(photoData) {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Gradient de Fundo Azul & Prata
    const grad = ctx.createLinearGradient(0, 0, 600, 800);
    grad.addColorStop(0, '#070D1E');
    grad.addColorStop(1, '#1C2541');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 800);

    // Carrega e desenha a foto real se disponível
    const img = new Image();
    img.src = photoData.image;
    
    // Desenha placeholder estético imediatamente
    this.drawCompositeText(ctx, photoData);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    img.onload = () => {
      // Desenha a foto real centralizada com aspecto mantido
      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(30, 30, 540, 560, 16);
      } else {
        ctx.rect(30, 30, 540, 560);
      }
      ctx.clip();
      
      const aspect = img.width / img.height;
      let drawW = 540;
      let drawH = 540 / aspect;
      if (drawH < 560) {
        drawH = 560;
        drawW = 560 * aspect;
      }
      const drawX = 30 + (540 - drawW) / 2;
      const drawY = 30 + (560 - drawH) / 2;
      
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      // Borda decorativa prateada interna em volta da foto
      ctx.strokeStyle = '#E8ECEF';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 540, 560);

      // Redesenha os textos e tags no rodapé
      this.drawCompositeText(ctx, photoData, false);
      texture.needsUpdate = true;
    };

    return texture;
  }

  drawCompositeText(ctx, photoData, drawBg = true) {
    if (drawBg) {
      ctx.fillStyle = '#070D1E';
      ctx.fillRect(0, 590, 600, 210);
    }

    // Badge Decorativo Prateado (Sem exibição visual de anos numéricos)
    ctx.fillStyle = '#1D4ED8';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(180, 580, 240, 44, 22);
    } else {
      ctx.rect(180, 580, 240, 44);
    }
    ctx.fill();
    ctx.strokeStyle = '#E8ECEF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ MEMÓRIAS ✨', 300, 602);

    // Título e Subtítulo
    ctx.font = 'bold 30px Cinzel, serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(photoData.title, 300, 660);

    ctx.font = 'italic 22px Cormorant Garamond, serif';
    ctx.fillStyle = '#93C5FD';
    ctx.fillText(photoData.subtitle, 300, 705);

    // Tag
    ctx.fillStyle = '#C0C0C0';
    ctx.font = '600 20px Montserrat, sans-serif';
    ctx.fillText(`• ${photoData.tag} •`, 300, 755);
  }

  buildPhotoFrames() {
    const isMobile = window.innerWidth < 768;

    // Distribuímos as fotos ao longo do eixo Z (-8, -16)
    const zPositions = [-8, -16];
    
    // RESPONSIVIDADE MOBILE: X ajustado no mobile para manter perfeitamente no enquadramento
    const xOffsets = isMobile ? [-0.65, 0.65] : [-2.0, 2.0];
    const width = isMobile ? 2.2 : 3.0;
    const height = isMobile ? 3.0 : 4.0;
    const depth = 0.1;

    MEMORY_PHOTOS.forEach((photo, idx) => {
      const frameGroup = new THREE.Group();

      // 1. Moldura Cromada Prateada
      const frameGeo = new THREE.BoxGeometry(width, height, depth);
      const frameMesh = new THREE.Mesh(frameGeo, this.matSilverFrame);
      frameGroup.add(frameMesh);

      // 2. Painel da Foto Composta
      const photoTex = this.createPhotoCompositeTexture(photo);
      const photoMat = new THREE.MeshStandardMaterial({
        map: photoTex,
        roughness: 0.25,
        metalness: 0.1
      });
      const photoGeo = new THREE.PlaneGeometry(width - 0.2, height - 0.2);
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.position.z = depth / 2 + 0.005;
      frameGroup.add(photoMesh);

      // Posicionamento no Espaço 3D
      const posX = xOffsets[idx % xOffsets.length];
      const posY = (Math.random() - 0.5) * 0.3;
      const posZ = zPositions[idx];

      frameGroup.position.set(posX, posY, posZ);

      // Rotação reduzida em celulares para evitar cortes angulares
      const rotY = isMobile ? (posX > 0 ? -0.12 : 0.12) : (posX > 0 ? -0.25 : 0.25);
      frameGroup.rotation.y = rotY;

      this.framesGroup.add(frameGroup);
      this.frameMeshes.push({
        group: frameGroup,
        baseY: posY,
        phase: Math.random() * Math.PI * 2
      });
    });
  }

  // Animação de flutuação suave parallax
  update(time) {
    this.frameMeshes.forEach(item => {
      item.group.position.y = item.baseY + Math.sin(time * 1.5 + item.phase) * 0.1;
      item.group.rotation.z = Math.cos(time * 1.2 + item.phase) * 0.02;
    });
  }
}
