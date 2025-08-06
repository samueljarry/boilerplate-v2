import { Ticker } from "@/core/commons/utils/Ticker";
import { ExtendedObject3D } from "@/core/three/components/ExtendedObject3D";
import { createTimeline } from "animejs";
import { DodecahedronGeometry, DoubleSide, Mesh, MeshPhysicalMaterial } from 'three';

export class DemoObject extends ExtendedObject3D {
  private _mesh: Mesh<DodecahedronGeometry, MeshPhysicalMaterial>;

  constructor() {
    super();
    
    this._createMesh();
  }

  private _createMesh() {
    this._mesh = new Mesh(
      new DodecahedronGeometry(),
      new MeshPhysicalMaterial({
        transparent: true,
        transmission: 1,
        metalness: 0,
        roughness: 0,
        iridescence: 10,
        ior: 2.3,
        thickness: 0.001,
        specularIntensity: 1,
        side: DoubleSide,
        specularColor: 0xffffff,
      })
    );

    this.add(this._mesh);
  }

  private _createIntroAnimation() {
    return createTimeline({ autoplay: true }).add(this._mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1700,
      ease: "inOutExpo",
    });
  }

  public override init(): void {
    super.init();

    this._mesh.scale.setScalar(0);
    const animation = this._createIntroAnimation();
    animation.play();
  }

  public override update(dt: number): void {
    super.update(dt);

    this._updateMesh(dt);
  }

  private _updateMesh(dt: number) {
    this._mesh.rotation.y -= dt;
    this._mesh.rotation.z += dt;

    const scale = Math.cos(Ticker.ElapsedTime * 1.4) * 0.25 + 1;

    this.scale.setScalar(scale);
  }
}