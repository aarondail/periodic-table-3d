import * as THREE from "three";

import { Element } from "./Element";
import { PeriodicTable } from "./PeriodicTable";
import { PickableObject, PickActionType } from "./Picker";
import { PixelViewPort } from "./PixelViewPort";

export interface MainContainerCameraControls {
  resetState: () => void;
  saveState: () => void;
  moveToDefault: () => void;
}
export class MainContainer extends THREE.Object3D {
  private mainTableContainer: THREE.Object3D;
  private lanthanidesTableContainer: THREE.Object3D;
  private actinidesTableContainer: THREE.Object3D;
  private elementDetailsContainer: THREE.Object3D;

  private showingTable: "main" | "lanthanides" | "actinides";
  private showingElement?: Element;

  public constructor(private vp: PixelViewPort, private readonly cameraControls: MainContainerCameraControls) {
    super();

    this.showingTable = "main";
    this.mainTableContainer = new THREE.Object3D();
    this.lanthanidesTableContainer = new THREE.Object3D();
    this.actinidesTableContainer = new THREE.Object3D();
    this.elementDetailsContainer = new THREE.Object3D();

    this.add(this.mainTableContainer);
    this.add(this.lanthanidesTableContainer);
    this.add(this.actinidesTableContainer);
    this.add(this.elementDetailsContainer);

    this.lanthanidesTableContainer.visible = false;
    this.actinidesTableContainer.visible = false;
    this.elementDetailsContainer.visible = false;

    // Lights (apply to all containers)
    {
      const l1 = new THREE.DirectionalLight(0xffffff, 9.9);
      l1.position.set(-1000, 0, 1000);
      this.add(l1);
      const l2 = new THREE.AmbientLight(0xffffff, 0.5);
      this.add(l2);
    }

    // Make Container with Spheres and (The) Periodic Table
    {
      const geo = new THREE.SphereBufferGeometry(0.3, 64, 32);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const makeSphere = (x: number, y: number, color: any, scale?: number) => {
        const mat = new THREE.MeshStandardMaterial({
          color,
          metalness: 1,
          roughness: 0.8,
          transparent: true,
          // opacity: 0.5,
          // emissive: 0x333333,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, -1 + Math.random() * -1);
        const s = scale ?? 1.0; // Math.random() * 0.4 + 0.6;
        mesh.scale.set(s, s, s);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mesh as any).pickable = true;
        // Add to main container
        this.mainTableContainer.add(mesh);
      };

      makeSphere(0, 0, "red");
      makeSphere(1, 1, "blue");
      makeSphere(1 / 2, 1 / 2, "green");
      makeSphere(0, 1, "grey");
      makeSphere(-2, 0, 0x999999); // 0x123456 0 1 2 3 4 5 6 7 8 9 A B C D E F
      makeSphere(-1, -1, "blue");
      makeSphere(-1 / 2, -1 / 2, "green");
      makeSphere(0, -1, "grey", 3.3);
      makeSphere(-1, 0, 0xffff00, 2.9);
      makeSphere(-3, -2, "blue");
      makeSphere(-3 / 2, -3 / 2, "green", 3.2);
      makeSphere(0, -3, "magenta");
      for (let i = -3; i <= 3; i += 1) {
        makeSphere(i, i, 0x33aaff);
        makeSphere(i, -1 * i, 0xffaa33);
      }

      const pt = new PeriodicTable();
      pt.scale.set(0.2, 0.2, 0.2);
      pt.position.setY(1.4);
      pt.position.setZ(0.4);
      this.mainTableContainer.add(pt);
    }

    // Lanthanides Container
    {
      // TODO
    }

    // Actinides Container
    {
      // TODO
    }

    // Element Details container
    {
      const geo = new THREE.ConeBufferGeometry(1.3, 4, 32);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // const makeSphere = (x: number, y: number, color: any, scale?: number) => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x813f70,
        metalness: 1.4,
        roughness: 0.8,
        // transparent: true,
        // opacity: 0.5,
        // emissive: 0x333333,
      });
      const mesh = new THREE.Mesh(geo, mat);
      // mesh.position.set(x, y, -1 + Math.random() * -1);
      // const s = scale ?? 1.0; // Math.random() * 0.4 + 0.6;
      // mesh.scale.set(s, s, s);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mesh as any).pickable = true;
      (mesh as any).pickAction = [PickActionType.BACK];
      // Add to main container
      this.elementDetailsContainer.add(mesh);
      // };
    }
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

  public onObjectClicked(object: PickableObject): void {
    if (!object.pickAction) {
      return;
    }
    const [pickActionType, pickActionArg] = object.pickAction;
    switch (pickActionType) {
      case PickActionType.ELEMENT_DETAIL:
        this.cameraControls.saveState();
        this.elementDetailsContainer.visible = true;
        this.actinidesTableContainer.visible = false;
        this.mainTableContainer.visible = false;
        this.lanthanidesTableContainer.visible = false;

        this.showingElement = pickActionArg;
        this.cameraControls.moveToDefault();
        break;

      case PickActionType.LANTHANIDES:
        // this.resetCamera();
        break;

      case PickActionType.BACK:
        this.elementDetailsContainer.visible = false;
        if (this.showingElement !== undefined) {
          this.showingElement = undefined;
        } else {
          this.showingTable = "main";
        }

        this.actinidesTableContainer.visible = this.showingTable === "actinides";
        this.mainTableContainer.visible = this.showingTable === "main";
        this.lanthanidesTableContainer.visible = this.showingTable === "lanthanides";

        this.cameraControls.resetState();
        break;
    }
  }
}
