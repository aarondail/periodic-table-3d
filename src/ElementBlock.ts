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
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ metalness: 1.0, color: "blue", emissive: 0x000022 })
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mesh as any).pickable = true;
    this.add(mesh);

    const symbolText = new Text();
    symbolText.text = options.symbol;
    symbolText.fontSize = 1;
    symbolText.position.y = 0.2;
    symbolText.position.z = 1.425;
    symbolText.anchorX = "center";
    symbolText.anchorY = "middle";
    symbolText.color = 0xffffff;

    const nameText = new Text();
    nameText.text = options.name;
    nameText.fontSize = 0.5;
    nameText.position.y = -0.8;
    nameText.position.z = 1.425;
    nameText.anchorX = "center";
    nameText.anchorY = "middle";
    nameText.color = 0xffffff;

    const indexText = new Text();
    indexText.text = options.index + "";
    indexText.fontSize = 0.6;
    indexText.position.x = -0.9;
    indexText.position.y = 0.9;
    indexText.position.z = 1.425;
    indexText.anchorX = "center";
    indexText.anchorY = "middle";
    indexText.color = 0x66aaff;

    symbolText.sync();
    nameText.sync();
    indexText.sync();

    this.add(symbolText);
    this.add(nameText);
    this.add(indexText);
  }
}
