import { SphereGeometry } from "three";
import { ShaderMaterial } from "three";
import { IcosahedronGeometry, Mesh, MeshNormalMaterial, Object3D } from "three";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import { Color } from "three";
import { Vector2 } from "three";
import { CubeTextureLoader } from "three";
import nx from "../textures/env/nx.png";
import ny from "../textures/env/ny.png";
import nz from "../textures/env/nz.png";
import px from "../textures/env/px.png";
import py from "../textures/env/py.png";
import pz from "../textures/env/pz.png";
import gsap from "gsap";
export default class World {
  constructor(params) {
    this.camera = params.camera;
    this.renderer = params.renderer;
    this.time = params.time;
    this.debug = params.debug;
    this.container = new Object3D();
    this.container.name = "World";
    this.init();
  }
  async init() {
    const loader = new CubeTextureLoader();
    const envMap = await loader.loadAsync([px, nx, py, ny, pz, nz]);
    const geo = new SphereGeometry(10, 100, 100);
    const PARAMS = {
      scale: 0.09,
      intensity: 0.95,
      color: new Color("#4b49ff"),
      colorIntensity: 35.0,
    };
    const mat = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      uniforms: {
        uTime: {
          value: 0,
        },
        uScale: {
          value: PARAMS.scale,
        },
        uIntensity: { value: PARAMS.intensity },
        uColor: {
          value: PARAMS.color,
        },
        uMouse: {
          value: new Vector2(0, 0),
        },
        uColorIntensity: {
          value: PARAMS.colorIntensity,
        },
        uEnvMap: {
          value: envMap,
        },
      },
    });
    const mesh = new Mesh(geo, mat);
    mesh.scale.set(0, 0, 0);
    const second = mesh.clone();
    const third = mesh.clone();
    const depth = 1.3;
    mesh.position.z = -105 * depth;
    second.position.z = -120 * depth;
    second.position.x = 10;
    third.position.z = -180 * depth;
    third.position.x = -30;

    this.container.add(mesh);
    this.container.add(second);
    this.container.add(third);
    gsap.to([third.scale, second.scale, mesh.scale], {
      x: 1,
      y: 1,
      z: 1,
      ease: "back.out(1.3)",
      stagger: 0.3,
      duration: 1.5,
    });
    this.time.addEventListener("tick", () => {
      mesh.material.uniforms.uTime.value += 0.01;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.001;
    });
    window.addEventListener("mousemove", (e) => {
      mesh.material.uniforms.uMouse.value.x =
        (e.clientX / window.innerWidth) * 2 - 1;
      mesh.material.uniforms.uMouse.value.y =
        -(e.clientY / window.innerHeight) * 2 + 1;
    });
    if (this.debug) {
      const folder = this.debug.addFolder({
        title: "Params",
      });
      folder.addInput(mesh.material.uniforms.uScale, "value", {
        min: 0,
        max: 1,
        step: 0.01,
        label: "scale",
      });
      folder.addInput(mesh.material.uniforms.uIntensity, "value", {
        min: 0,
        max: 1,
        step: 0.01,
        label: "intensity",
      });
      folder
        .addInput(mesh.material.uniforms.uColor, "value", {
          label: "color",
        })
        .on("change", (ev) => {
          mesh.material.uniforms.uColor.value.r = ev.value.r / 255;
          mesh.material.uniforms.uColor.value.g = ev.value.g / 255;
          mesh.material.uniforms.uColor.value.b = ev.value.b / 255;
        });
      folder.addInput(mesh.material.uniforms.uColorIntensity, "value", {
        min: 0,
        max: 50,
        step: 0.01,
        label: "color intensity",
      });
      folder.addInput(mesh.material, "wireframe");
    }
  }
}
