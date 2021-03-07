import * as THREE from "three";
import { Text } from "troika-three-text";

const getGeometry = (() => {
  let geometry: THREE.ExtrudeGeometry;

  const createGeometry = () => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, -1);
    shape.lineTo(-1, 1);
    shape.lineTo(1, 1);
    shape.lineTo(1, -1);
    shape.lineTo(-1, -1);

    const extrudeSettings = {
      steps: 4,
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0.4,
      bevelSize: 0.4,
      bevelSegments: 4,
    };

    geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  return () => {
    if (!geometry) {
      createGeometry();
    }
    return geometry;
  };
})();

export interface ElementBlockOptions {
  symbol: string;
  name: string;
  index: number;
}

export class ElementBlock extends THREE.Object3D {
  public constructor(options: ElementBlockOptions) {
    super();
    const geometry = getGeometry();
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ metalness: 1.0, color: "blue" }));
    this.add(mesh);

    const symbolText = new Text();
    symbolText.text = options.symbol;
    symbolText.fontSize = 1;
    symbolText.position.y = 0.5;
    symbolText.position.z = 1.43;
    symbolText.anchorX = "center";
    symbolText.anchorY = "middle";
    symbolText.color = 0xffffff;

    // Update the rendering:
    const nameText = new Text();
    nameText.text = options.name;
    nameText.fontSize = 0.5;
    nameText.position.y = -0.8;
    nameText.position.z = 1.43;
    nameText.anchorX = "center";
    nameText.anchorY = "middle";
    nameText.color = 0xffffff;

    symbolText.sync();
    nameText.sync();

    this.add(symbolText);
    this.add(nameText);
  }
}
