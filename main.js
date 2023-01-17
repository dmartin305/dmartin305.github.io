import "./style.css";
import context from "./context";
import * as THREE from "three";
import resumeMenu from "./resume/menu";
import contactMenu from "./contact";
import resumeSectionMenu from "./resume/sectionMenu";
import plane from "./plane";
import aboutMenu from "./about";
import sectionMenu from "./resume/sectionMenu";

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
  // Create short hand for html elements to make the following easier to read
  let about = document.getElementById("about");
  let resume = document.getElementById("resume");
  let contact = document.getElementById("contact");
  let backButton = document.getElementById("back-button");

  
  about.addEventListener("click", () => aboutMenu.start());
  resume.addEventListener("click", () => resumeMenu.start());
  contact.addEventListener("click", () => contactMenu.start());
  
  backButton.addEventListener("click", () => {
    if (pageIs("contact")) contactMenu.returnHome();
    if (pageIs("resume")) resumeMenu.returnHome();
    if (pageIs("about")) aboutMenu.returnHome();
    if (pageIs("resumeSection")) sectionMenu.return();
  });
  
  addEventListener("click", () => {
    console.log(context.world.currentPage);
    if (pageIs("resume")) resumeMenu.onClick();
    if (pageIs("about")) aboutMenu.onClick();
    if (pageIs("contact")) contactMenu.onClick();
    if (pageIs("resumeSection")) resumeSectionMenu.onClick();
  });

  window.addEventListener(
    "resize",
    () => {
      context.camera.aspect = window.innerWidth / window.innerHeight;
      context.camera.updateProjectionMatrix();
      context.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
  );

  document.addEventListener("wheel", (event) => {

  });

  addEventListener("mousemove", (event) => {
    context.mouse.x = (event.clientX / innerWidth) * 2 - 1;
    context.mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  });
}

animate();
