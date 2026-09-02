// Componente 3D Paredão Floral Hiper-Realista - Convite 15 Anos Ester (Azul & Prata)
import * as THREE from 'three';

export class FloralWall {
  constructor(scene) {
    this.scene = scene;
    this.wallGroup = new THREE.Group();
    this.scene.add(this.wallGroup);

    this.textureLoader = new THREE.TextureLoader();
    this.initMaterials();
    this.buildFloralWall();
  }

  initMaterials() {
    // 1. Carrega a Textura Fotográfica Hiper-Realista de Paredão Floral
    const floralTexture = this.textureLoader.load('/assets/floral_wall.jpg');
    floralTexture.colorSpace = THREE.SRGBColorSpace;
    floralTexture.wrapS = THREE.ClampToEdgeWrapping;
    floralTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Material Físico PBR do Paredão Floral com Brilho Acetinado e Reflexos
    this.matFloralWall = new THREE.MeshPhysicalMaterial({
      map: floralTexture,
      bumpMap: floralTexture,
      bumpScale: 0.08,
      roughness: 0.35,
      metalness: 0.15,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      reflectivity: 0.8
    });

    // 2. Folhas 3D Flutuantes em Prata Cromada Espelhada (Depth Parallax)
    this.matSilverLeaf = new THREE.MeshPhysicalMaterial({
      color: 0xE8ECEF,
      metalness: 0.98,
      roughness: 0.05,
      reflectivity: 0.95,
      clearcoat: 1.0
    });
  }

  buildFloralWall() {
    // Painel 3D de Fundo com Dimensão Ampla (26 x 18)
    const wallGeo = new THREE.PlaneGeometry(28, 18);
    this.wallMesh = new THREE.Mesh(wallGeo, this.matFloralWall);
    this.wallGroup.add(this.wallMesh);

    // Adiciona elementos 3D de folhas metálicas flutuando à frente do painel para paralaxe 3D
    const leafCount = 35;
    for (let i = 0; i < leafCount; i++) {
      const leafGeo = new THREE.ConeGeometry(0.25, 0.8, 5);
      leafGeo.rotateX(Math.PI / 2);
      leafGeo.scale(1, 0.12, 1);

      const leafMesh = new THREE.Mesh(leafGeo, this.matSilverLeaf);
      leafMesh.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        Math.random() * 0.8 + 0.1
      );
      leafMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      this.wallGroup.add(leafMesh);
    }

    this.wallGroup.position.z = -5;
  }

  // Atualiza a posição do paredão floral para seguir a câmera no eixo Z
  update(cameraZ) {
    this.wallGroup.position.z = cameraZ - 11.5;
  }
}
