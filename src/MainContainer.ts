import * as THREE from "three";
import { PixelViewPort } from "./PixelViewPort";

export class MainContainer extends THREE.Object3D {
  public constructor(private vp: PixelViewPort) {
    super();

    const geo = new THREE.SphereBufferGeometry(200, 64, 32);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const makeSphere = (x: number, y: number, color: any) => {
      const mat = new THREE.MeshStandardMaterial({ color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, 0);
      this.add(mesh);
    };

    makeSphere(0, 0, "red");
    makeSphere(this.vp.pixelWidth, this.vp.pixelHeight, "blue");
    makeSphere(this.vp.pixelWidth / 2, this.vp.pixelHeight / 2, "green");
    makeSphere(0, this.vp.pixelHeight, "white");
    makeSphere(this.vp.pixelWidth, 0, 0xffff00);

    const l1 = new THREE.DirectionalLight(0xffffff, 9.9);
    l1.position.set(-1000, 0, 1000);
    this.add(l1);
    const l2 = new THREE.AmbientLight(0xffffff, 0.5);
    this.add(l2);
  }

  public dispose(): void {
    // TODO?
  }

  public animate(deltaS: number): void {
    // TODO
  }

  public relayout(): void {
    // TODO?
  }
}
