import context from "./context";
import resumeMenu from "./resume/menu";
import contactMenu from "./contact";
import resumeSectionMenu from "./resume/sectionMenu";
import plane from "./plane";
import aboutMenu from "./about";
import sectionMenu from "./resume/sectionMenu";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

let intro = document.querySelector(".intro");
let splashText = document.querySelector(".splash-screen");
let splashSpan = document.querySelectorAll(".splash-text");
let about = document.getElementById("about");
let resume = document.getElementById("resume");
let contact = document.getElementById("contact");
let backButton = document.getElementById("back-button");

context.raycaster = new THREE.Raycaster();
context.scene = new THREE.Scene();

createCamera();
createRenderer();
plane.create();
furnishLighting();
addAllEventListers();

function animate() {
  requestAnimationFrame(animate);
  context.renderer.render(context.scene, context.camera);
  context.raycaster.setFromCamera(context.mouse, context.camera);
  plane.animate();
  if (pageIs("contact")) contactMenu.animate();
  if (pageIs("resume")) resumeMenu.animate();
  if (pageIs("about")) aboutMenu.animate();
  if (pageIs("resumeSection")) resumeSectionMenu.animate();
}

function pageIs(page) {
  return context.world.currentPage === page;
}

// #region World Creation
function createCamera() {
  context.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  context.camera.position.z = 100;
}

function createRenderer() {
  context.renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("bg"),
  });
  context.renderer.setSize(window.innerWidth, window.innerHeight);
  context.renderer.setPixelRatio(devicePixelRatio);
}

function furnishLighting() {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 1, 1);
  context.scene.add(light);
  const light2 = new THREE.SpotLight(0x0000ff, 10);
  light2.position.set(-400, 0, 30);
  context.scene.add(light2);
}
//#endregion

function addAllEventListers() {
  about.addEventListener("click", () => aboutMenu.start());
  resume.addEventListener("click", () => resumeMenu.start());
  contact.addEventListener("click", () => contactMenu.start());
  backButton.addEventListener("click", handleBackButton);
  addEventListener("click", threejsClick);
  window.addEventListener("DOMContentLoaded", splashScreen);
  window.addEventListener("resize", resizeWindow);
  document.addEventListener("wheel", scroll);
  addEventListener("mousemove", trackMouse);
}
function scroll() {}
function splashScreen() {
  setTimeout(() => {
    splashSpan.forEach((span, index) => {
      setTimeout(() => {
        span.classList.add("active");
      }, [(index + 1) * 400]);
    });

    setTimeout(() => {
      splashSpan.forEach((span, index) => {
        setTimeout(() => {
          span.classList.remove("active");
          span.classList.add("fade");
        }, (index + 1) * 50);
      });
    }, 2000);

    setTimeout(() => {
      intro.style.top = "-100vh";
    }, 3000);
  });
}

function threejsClick() {
  if (pageIs("resume")) resumeMenu.onClick();
  if (pageIs("about")) aboutMenu.onClick();
  if (pageIs("contact")) contactMenu.onClick();
  if (pageIs("resumeSection")) resumeSectionMenu.onClick();
}

function handleBackButton() {
  if (pageIs("contact")) contactMenu.returnHome();
  if (pageIs("resume")) resumeMenu.returnHome();
  if (pageIs("about")) aboutMenu.returnHome();
  if (pageIs("resumeSection")) sectionMenu.return();
}

function resizeWindow() {
  context.camera.aspect = window.innerWidth / window.innerHeight;
  context.camera.updateProjectionMatrix();
  context.renderer.setSize(window.innerWidth, window.innerHeight);
}

function trackMouse() {
  context.mouse.x = (event.clientX / innerWidth) * 2 - 1;
  context.mouse.y = -(event.clientY / innerHeight) * 2 + 1;
}

animate();
