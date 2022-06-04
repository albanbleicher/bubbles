import { SphereGeometry } from "three";
import { ShaderMaterial } from "three";
import { IcosahedronGeometry, Mesh, MeshNormalMaterial, Object3D } from "three";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import { Color } from "three";
import { Vector2 } from "three";
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
  init() {
    const geo = new SphereGeometry(10, 100, 100);
    const PARAMS = {
      scale: 0.11,
      intensity: 0.25,
      color: new Color("white"),
      colorIntensity: 5,
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
      },
    });
    const mesh = new Mesh(geo, mat);
    console.log(vertex);
    mesh.position.z = -105;
    this.container.add(mesh);
    this.time.addEventListener("tick", () => {
      mesh.material.uniforms.uTime.value += 0.01;
      // mesh.rotation.y += 0.01;
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
        max: 10,
        step: 0.01,
        label: "color intensity",
      });
      folder.addInput(mesh.material, "wireframe");
    }
  }
}
