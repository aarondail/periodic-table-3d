import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { MainContainer } from "./MainContainer";
import { Picker } from "./Picker";
import { PixelViewPort } from "./PixelViewPort";
import { Stats } from "./Stats";

export class ThreeJsApp {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private stats: Stats;
  private mainContainer: MainContainer;
  private vpInfo: PixelViewPort;
  private clock: THREE.Clock;
  private disposed: boolean;
  private controls: OrbitControls;
  private composer: EffectComposer;
  private picker: Picker;
  private pickPosition: THREE.Vector2;
  private pickUpdated: boolean;

  public constructor(private readonly canvas: HTMLCanvasElement) {
    this.disposed = false;
    this.stats = new Stats();
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setClearColor(0x000000);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.info.autoReset = true; // Makes better stats I think
    this.renderer.toneMapping = THREE.ReinhardToneMapping;

    this.scene = new THREE.Scene();

    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(40, 2, 0.1, 50000);
    this.camera.position.set(0, 0, 5);

    this.composer = new EffectComposer(this.renderer);

    this.vpInfo = {
      pixelWidth: canvas.clientWidth * window.devicePixelRatio,
      pixelHeight: canvas.clientHeight * window.devicePixelRatio,
      cssPixelRatio: window.devicePixelRatio,
    };
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.3;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    this.controls.enablePan = true;
    this.controls.enableKeys = true;
    this.controls.keyPanSpeed = 1000.0;
    this.controls.keys = {
      LEFT: 37, //left arrow
      UP: 38, // up arrow
      RIGHT: 39, // right arrow
      BOTTOM: 40, // down arrow
    };
    this.controls.update();

    this.mainContainer = new MainContainer(this.vpInfo);
    this.updateRendererSize(true);
    this.scene.add(
      new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshStandardMaterial({ color: 0x0088ff }))
    );
    this.scene.add(this.mainContainer);

    this.picker = new Picker();
    this.pickPosition = new THREE.Vector2();
    this.pickUpdated = false;

    canvas.addEventListener("mousemove", this.handleMouseMove);
    canvas.addEventListener("mouseout", this.handleMouseOutOrLeave);
    canvas.addEventListener("mouseleave", this.handleMouseOutOrLeave);

    requestAnimationFrame(this.animate);
  }

  public dispose(): void {
    this.disposed = true;
    this.renderer.dispose();
    this.stats.dispose();
    this.mainContainer.dispose();

    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseout", this.handleMouseOutOrLeave);
    this.canvas.removeEventListener("mouseleave", this.handleMouseOutOrLeave);
  }

  private animate = () => {
    if (this.disposed) {
      return;
    }

    this.stats.begin();
    this.updateRendererSize();
    this.controls.update();

    this.picker.pick(this.pickPosition, this.scene, this.camera);

    this.mainContainer.animate(this.clock.getDelta());
    // this.renderer.render(this.scene, this.camera);
    this.composer.render();
    this.stats.end(this.renderer);
    this.renderer.info.reset();
    requestAnimationFrame(this.animate);
  };

  private handleMouseMove = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) * this.canvas.width) / rect.width;
    const y = ((event.clientY - rect.top) * this.canvas.height) / rect.height;
    this.pickPosition.x = (x / this.canvas.width) * 2 - 1;
    this.pickPosition.y = (y / this.canvas.height) * -2 + 1; // note we flip Y
    this.pickUpdated = true;
  };

  private handleMouseOutOrLeave = () => {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    this.pickPosition.x = -100000;
    this.pickPosition.y = -100000;
    this.pickUpdated = true;
  };

  private updateRendererSize(force?: boolean): void {
    const pw = this.canvas.clientWidth * window.devicePixelRatio;
    const ph = this.canvas.clientHeight * window.devicePixelRatio;

    if (this.canvas.width !== pw || this.canvas.height !== ph || force) {
      this.vpInfo.cssPixelRatio = window.devicePixelRatio;
      this.vpInfo.pixelWidth = pw;
      this.vpInfo.pixelHeight = ph;

      this.mainContainer.relayout();
      this.renderer.setSize(pw, ph, false);
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();

      const renderScene = new RenderPass(this.scene, this.camera);

      const bloomPass = new UnrealBloomPass(new THREE.Vector2(pw, ph), 1.5, 0.4, 0.85);
      bloomPass.threshold = 0.0; // params.bloomThreshold;
      // bloomPass.strength = 1.5; // params.bloomStrength;
      bloomPass.strength = 1.0; // params.bloomStrength;
      bloomPass.radius = 0.2; // params.bloomRadius;
      // bloomPass.threshold = params.bloomThreshold;
      // bloomPass.strength = params.bloomStrength;
      // bloomPass.radius = params.bloomRadius;

      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(renderScene);
      this.composer.addPass(bloomPass);

      // this.renderer.setSize(pw, ph);
      // this.composer.setSize(pw, ph);
    }
  }
}
