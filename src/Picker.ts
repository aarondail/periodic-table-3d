import * as THREE from "three";

import { Element } from "./Element";

export enum PickActionType {
  ELEMENT_DETAIL,
  LANTHANIDES,
  ACTINIDES,
  BACK,
}

export type PickAction =
  | [PickActionType.ELEMENT_DETAIL, Element]
  | [PickActionType.LANTHANIDES]
  | [PickActionType.ACTINIDES]
  | [PickActionType.BACK];

export interface PickableObject extends THREE.Mesh {
  readonly pickable: true;

  readonly pickAction?: PickAction;
}

export class Picker {
  private readonly raycaster: THREE.Raycaster;
  private pickedObject?: PickableObject;
  private pickedObjectSavedColor: number;

  public constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = undefined;
    this.pickedObjectSavedColor = 0;
  }

  public get currentPickedObject(): PickableObject | undefined {
    return this.pickedObject;
  }

  public pick(normalizedPosition: THREE.Vector2, scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // Restore the color if there is a picked object
    if (this.pickedObject) {
      (this.pickedObject.material as THREE.MeshStandardMaterial).emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);

    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children, true);
    // console.log(intersectedObjects);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      for (const potentialObject of intersectedObjects) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(potentialObject.object as any).pickable) {
          continue;
        }
        // console.log("Found obj", potentialObject);

        this.pickedObject = potentialObject.object as PickableObject;
        // save its color
        this.pickedObjectSavedColor = (this.pickedObject.material as THREE.MeshStandardMaterial).emissive.getHex();
        // set its emissive color to flashing red/yellow
        // eslint-disable-next-line no-constant-condition
        (this.pickedObject.material as THREE.MeshStandardMaterial).emissive.setHex(0xac012);

        return;
      }
    }
  }
}
