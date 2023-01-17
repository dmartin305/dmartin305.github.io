import context from "../../context";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
      techtower.position.x = context.camera.position.x - 15;
      techtower.position.z = 5;
      techtower.rotation.x = Math.PI / 2;

      context.scene.add(techtower);
    });
  },
  return() {},
  returnHome() {},
  animate() {},
};
