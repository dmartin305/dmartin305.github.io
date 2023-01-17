import context from "../../context";
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import gsap from "gsap";

export default {
  start() {
    if (!context.pagesVisited.includes("education")) {
      this.loadObjects();
      context.pagesVisited.push("education");
    }
    context.world.currentPage = "education";
  },
  loadObjects() {
    const loader = new GLTFLoader();
    loader.load("models/techtowerisland.glb", function (gltf) {
      context.objects.techtower.object = gltf.scene;
      let techtower = context.objects.techtower.object;

      gltf.scene.position.x = context.camera.position.x - 15;
      gltf.scene.position.z = 5;
      gltf.scene.rotation.x = Math.PI / 2;

      context.scene.add(gltf.scene);
    });
  },
  return() {},
  returnHome() {},
  animate() {},
};
