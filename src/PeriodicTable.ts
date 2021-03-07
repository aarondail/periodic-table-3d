import * as THREE from "three";

// eslint-disable-next-line import/no-webpack-loader-syntax
import ELEMENTS from "!!raw-loader!./elements.txt";
// eslint-disable-next-line import/no-webpack-loader-syntax
import TABLE from "!!raw-loader!./table.txt";

export class PeriodicTable extends THREE.Object3D {
  public constructor() {
    super();
    console.log(ELEMENTS);
    console.log(TABLE);
  }
}
