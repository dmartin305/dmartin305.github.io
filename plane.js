import context from "./context";
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import gsap from "gsap";

const randomValues = [];
let frame = 0;
export default {
  create() {
    const planeGeometry = new THREE.PlaneGeometry(
      context.world.plane.width,
      context.world.plane.height,
      context.world.plane.widthSegments,
      context.world.plane.heightSegments
    );
    const planeMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      flatShading: true,
      vertexColors: true,
    });
    context.objects.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    context.scene.add(context.objects.plane);
    context.objects.plane.geometry.dispose();
    context.objects.plane.geometry = new THREE.PlaneGeometry(
      context.world.plane.width,
      context.world.plane.height,
      context.world.plane.widthSegments,
      context.world.plane.heightSegments
    );

    // vertice position randomization
    const { array } = context.objects.plane.geometry.attributes.position;
    for (let i = 0; i < array.length; i++) {
      if (i % 3 === 0) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];

        array[i] = x + (Math.random() - 0.5) * 3;
        array[i + 1] = y + (Math.random() - 0.5) * 3;
        array[i + 2] = z + (Math.random() - 0.5) * 5;
      }
      randomValues.push(Math.random() * Math.PI * 2);
    }
    let position = context.objects.plane.geometry.attributes.position;
    position.randomValues = randomValues;
    position.originalPosition = position.array;

    const colors = [];
    for (let i = 0; i < position.count; i++) {
      colors.push(0.4, 0.1, 0.4);
    }

    context.objects.plane.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
  },
  animate() {
    frame += 0.05;
    const { array, originalPosition, randomValues } =
      context.objects.plane.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
      array[i] =
        originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.009;
      array[i + 1] =
        originalPosition[i + 1] + Math.cos(frame + randomValues[i + 1]) * 0.009;

      array[i + 2] =
        originalPosition[i + 2] + Math.sin(frame + randomValues[i + 2]) * 0.009;
    }

    context.objects.plane.geometry.attributes.position.needsUpdate = true;

    const intersects = context.raycaster.intersectObject(context.objects.plane);
    if (intersects.length > 0) {
      const { color } = intersects[0].object.geometry.attributes;

      const { a, b, c } = intersects[0].face;

      const initialColor = { r: 0.4, g: 0.1, b: 0.4 };
      const hoverColor = { r: 0.8, g: 0.0, b: 0.8 };

      color.setX(a, hoverColor.r);
      color.setY(a, hoverColor.g);
      color.setZ(a, hoverColor.b);
      color.setX(b, hoverColor.r);
      color.setY(b, hoverColor.b);
      color.setZ(b, hoverColor.g);
      color.setX(c, hoverColor.r);
      color.setY(c, hoverColor.g);
      color.setZ(c, hoverColor.b);
      color.needsUpdate = true;

      gsap.to(hoverColor, {
        r: initialColor.r,
        g: initialColor.g,
        b: initialColor.b,
        duration: 1,
        onUpdate: () => {
          color.setX(a, hoverColor.r);
          color.setY(a, hoverColor.g);
          color.setZ(a, hoverColor.b);
          color.setX(b, hoverColor.r);
          color.setY(b, hoverColor.g);
          color.setZ(b, hoverColor.b);
          color.setX(c, hoverColor.r);
          color.setY(c, hoverColor.g);
          color.setZ(c, hoverColor.b);
          color.needsUpdate = true;
        },
      });
    }
  },
};
