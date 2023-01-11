// #region Imports
import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import Button from "@mui/material/Button";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBAFormat } from "three";
//#endregion

let renderer, camera, planeGeometry, planeMaterial, planeMesh;
let physicalResume, interactiveResume;
let linkedinLogo, email;
let techtower;
let journeyBegun;

const world = {
  plane: {
    width: 500,
    height: 500,
    widthSegments: 60,
    heightSegments: 50,
  },
  contact: {
    linkedinLogo: undefined,
    linkedinhover: false,
    email: undefined,
    emailhover: false,
  },
  resume: {
    physicalResume: undefined, // Similar to email and linkedin logo but resume, when clicked downloads pdf
    physicalResumehover: false,
    interactiveResume: undefined,
    interactiveResumehover: false,
  },
  camera: {
    initPos: {
      x: 0,
      y: 0,
      z: 100,
    },
    initRot: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  currentPage: "home",
  visited: {
    resume: false,
    about: false,
    contact: false,
  },
};

const mouse = {
  x: undefined,
  y: undefined,
};

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();

createCamera();
createRenderer();
createPlaneMesh();
animatePlane();
furnishLighting();
addAllEventListers();

let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);
  frame += 0.05;
  if (world.currentPage === "contact") handleContactAnimations();
  if (world.currentPage === "resume") handleResumeAnimations();
  handlePlaneAnimations();
  handleColorChange();
}

// #region World Creation
function createCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("bg"),
  });

  // renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
}

function furnishLighting() {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 1, 1);
  scene.add(light);
  const light2 = new THREE.SpotLight(0x0000ff, 10);
  light2.position.set(-400, 0, 30);
  scene.add(light2);
}

function createPlaneMesh() {
  planeGeometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
    vertexColors: true,
  });
  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(planeMesh);
}

function animatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  // vertice position randomization
  const { array } = planeMesh.geometry.attributes.position;
  const randomValues = [];
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
  planeMesh.geometry.attributes.position.randomValues = randomValues;
  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array;

  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0.4, 0.1, 0.4);
  }

  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
}
// #endregion

// #region Plane Animations
function handlePlaneAnimations() {
  const { array, originalPosition, randomValues } =
    planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.009;
    array[i + 1] =
      originalPosition[i + 1] + Math.cos(frame + randomValues[i + 1]) * 0.009;

    array[i + 2] =
      originalPosition[i + 2] + Math.sin(frame + randomValues[i + 2]) * 0.009;
  }

  planeMesh.geometry.attributes.position.needsUpdate = true;
}

function handleColorChange() {
  const intersects = raycaster.intersectObject(planeMesh);
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
}
// #endregion

// #region Event Handling
function addAllEventListers() {
  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText("dmartin305@gatech.edu");
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const downloadResume = async () => {
    var link = document.createElement("a");
    link.download = "document";
    link.href = "../bg.jpeg";
    link.click();
  };

  document.getElementById("back-button").addEventListener("click", () => {
    if (world.currentPage === "contact") returnHomeFromContact();
    if (world.currentPage === "resume") returnHomeFromResume();
    if (world.currentPage === "research") returnHomeFromResearch();
  });

  window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
  );

  addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  });

  addEventListener("click", () => {
    if (world.contact.linkedinhover)
      window.open("https://www.linkedin.com/in/david-martin-507132148");
    if (world.contact.emailhover) copyContent();
    if (world.resume.physicalResumehover) downloadResume();
    if (world.resume.interactiveResumehover) startResumeJourney();
  });
}
// #endregion

// #region About Me Section
document.getElementById("about").addEventListener("click", () => {
  if (!world.visited.about) {
    createAboutObjects();
    world.visited.about = true;
  }
  world.currentPage = "about";
  let tl = gsap.timeline();
  tl.to(camera.rotation, {
    x: Math.PI / 2,
    duration: 1,
    ease: "power4.in",
  })
    .to(
      camera.position,
      {
        z: 10,
        y: 100,
        duration: 1,
        ease: "power1.in",
      },
      "-=1"
    )
    .to(
      document.getElementById("gui-container"),
      {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      },
      "-=1"
    )
    .to(document.getElementById("back-button"), {
      opacity: 1,
      duration: 0.5,
    });
});

function createAboutObjects() {}

function returnHomeFromAbout() {
  let tl = gsap.timeline();
  tl.to(document.getElementById("back-button"), {
    opacity: 0,
    duration: 0.5,
  })
    .to(
      document.getElementById("about-me-container"),
      {
        opacity: 0,
        duration: 1,
        ease: "power4.in",
      },
      "-=.5"
    )
    .to(
      document.getElementById("gui-container"),
      {
        opacity: 1,
        duration: 1,
        ease: "power4.out",
      },
      "-=1"
    )
    .to(camera.rotation, {
      z: 0,
      y: 0,
      x: 0,
      duration: 1,
      ease: "power4.out ",
    })
    .to(
      camera.position,
      {
        x: 0,
        y: 0,
        z: 100,
        duration: 1,
        ease: "power1.out",
      },
      "-=1"
    );
}
// #endregion

// #region Resume Section
document.getElementById("resume").addEventListener("click", () => {
  if (!world.visited.resume) {
    createResumeObjects();
    world.visited.resume = true;
  }
  world.currentPage = "resume";
  let tl = gsap.timeline();
  tl.to(camera.rotation, {
    z: Math.PI / 2,
    y: Math.PI / 2,
    duration: 1,
    ease: "power4.in",
  })
    .to(
      camera.position,
      {
        z: 10,
        x: 100,
        duration: 1,
        ease: "power1.in",
      },
      "-=1"
    )
    .to(
      document.getElementById("gui-container"),
      {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      },
      "-=1"
    )
    .to(
      document.getElementById("resume-container"),
      {
        opacity: 1,
        duration: 1,
        zIndex: 1,
        ease: "power4.in",
      },
      "-=.5"
    )
    .to(physicalResume.material, {
      opacity: 1,
      duration: 1,
    })
    .to(interactiveResume.material, {
      opacity: 1,
      duration: 1,
    })
    .to(document.getElementById("back-button"), {
      opacity: 1,
      duration: 0.5,
    });
});

function createResumeObjects() {
  const texture = new THREE.TextureLoader();
  const geometry = new THREE.PlaneGeometry(15, 15);
  const material = new THREE.MeshBasicMaterial({
    map: texture.load("../resume.png"),
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const emailMaterial = new THREE.MeshBasicMaterial({
    map: texture.load("../journey.png"),
    opacity: 0,
    side: THREE.DoubleSide,
  });
  material.transparent = true;
  emailMaterial.transparent = true;
  physicalResume = new THREE.Mesh(geometry, material);
  interactiveResume = new THREE.Mesh(geometry, emailMaterial);
  physicalResume.position.set(70, -10, 15);
  physicalResume.rotation.y = Math.PI / 2;
  physicalResume.rotation.x = Math.PI / 2;
  interactiveResume.position.set(70, 10, 15);
  interactiveResume.rotation.y = Math.PI / 2;
  interactiveResume.rotation.x = Math.PI / 2;
  scene.add(physicalResume, interactiveResume);
}
function returnHomeFromResume() {
  let tl = gsap.timeline();
  tl.to(document.getElementById("back-button"), {
    opacity: 0,
    duration: 0.5,
  })
    .to(interactiveResume.material, {
      opacity: 0,
      duration: 1,
    })
    .to(physicalResume.material, {
      opacity: 0,
      duration: 1,
    })
    .to(
      document.getElementById("resume-container"),
      {
        opacity: 0,
        duration: 1,
        zIndex: -1,
        ease: "power4.in",
      },
      "-=.5"
    )
    .to(
      document.getElementById("gui-container"),
      {
        opacity: 1,
        duration: 1,
        ease: "power4.out",
      },
      "-=1"
    )
    .to(camera.rotation, {
      z: 0,
      y: 0,
      x: 0,
      duration: 1,
      ease: "power4.out ",
    })
    .to(
      camera.position,
      {
        x: 0,
        y: 0,
        z: 100,
        duration: 1,
        ease: "power1.out",
      },
      "-=1"
    );
}
function handleResumeAnimations() {
  if (physicalResume !== undefined) {
    const intersects = raycaster.intersectObject(physicalResume);
    if (intersects.length > 0) {
      physicalResume.scale.x = 1.2;
      physicalResume.scale.y = 1.2;
      world.resume.physicalResumehover = true;
    } else {
      world.resume.physicalResumehover = false;
      physicalResume.scale.x = 1;
      physicalResume.scale.y = 1;
      physicalResume.rotation.y += Math.cos((frame * 1) / 2) * 0.001;
    }
    const emailintersects = raycaster.intersectObject(interactiveResume);

    if (emailintersects.length > 0) {
      interactiveResume.scale.x = 1.2;
      interactiveResume.scale.y = 1.2;
      world.resume.interactiveResumehover = true;
    } else {
      world.resume.interactiveResumehover = false;
      interactiveResume.scale.x = 1;
      interactiveResume.scale.y = 1;
      interactiveResume.rotation.y -= Math.cos((frame * 1) / 2) * 0.002;
    }
  }
  if (world.resume.physicalResumehover) {
    document.getElementById("resume-helper-text").innerText =
      "Click to download my resume";
  } else if (world.resume.interactiveResumehover) {
    document.getElementById("resume-helper-text").innerText =
      "Click to begin an interactive journey";
  } else {
    document.getElementById("resume-helper-text").innerText = "";
  }

  if (journeyBegun !== undefined && techtower !== undefined) {
    const intersects = raycaster.intersectObject(techtower);
    // console.log(intersects);
    if (intersects.length > 0) {
      techtower.position.x = -400;
      techtower.position.z = -2;
      techtower.rotation.x = Math.PI / 2;
      techtower.rotation.y = -Math.PI / 2;
      techtower.scale.x = 1.2;
      techtower.scale.y = 1.2;
      techtower.scale.z = 1.2;
    } else {
      techtower.rotation.y += 0.001;
      techtower.position.z = 0;
      techtower.scale.x = 1;
      techtower.scale.y = 1;
      techtower.scale.z = 1;
    }
  }
}
// let stars = [];
// const lowerX = -400;
// const upperX = 400;
// const lowerY = -400;
// const upperY = 400;
// const lowerZ = 5;
// const upperZ = 500;
// const count = 1000;

// function generateStars() {
//   const geometry = new THREE.SphereGeometry();
//   const material = new THREE.MeshBasicMaterial(0xfff);
//   for (var star = 0; star < count; star++) {
//     const starGeometry = geometry;
//     starGeometry.radius = Math.random() + 0.5;
//     const starMesh = new THREE.Mesh(starGeometry, material);
//     starMesh.position.x = (upperX - lowerX) * Math.random() + lowerX;
//     starMesh.position.y = (upperY - lowerY) * Math.random() + lowerY;
//     starMesh.position.z = (upperZ - lowerZ) * Math.random() + lowerZ;

//     stars.push(starMesh);
//     scene.add(starMesh);
//   }
// }
// const controls = new OrbitControls(camera, renderer.domElement);
// generateStars();

function startResumeJourney() {
  journeyBegun = true;
  loadTechTower();
  planeMesh.material.transparent = true;
  let resumeObjects = [
    physicalResume.material,
    interactiveResume.material,
    planeMesh.material,
  ];
  let htmlResumeItems = [
    document.getElementById("resume-container"),
    document.getElementById("gui-container"),
  ];
  setTimeout(() => {
    console.log(techtower);
    let tl = gsap.timeline();
    tl.to(htmlResumeItems, { zIndex: -1, opacity: 0, duration: 1 / 2 })
      .to(resume, { opacity: 0, duration: 1, ease: "power4.out" }, "-=0.5")
      .to(
        camera.position,
        {
          x: -385,
          z: 7,
          duration: 2,
          ease: "power4.inOut",
        },
        "-=1"
      )
      .to(
        techtowermaterials,
        {
          opacity: 1,
          duration: 2,
          ease: "power4.in",
        },
        "-=1.5"
      );
  }, 100);
}
// #endregion

// #region Contact Section
document.getElementById("contact").addEventListener("click", () => {
  if (!world.visited.contact) {
    createContactObjects();
    world.visited.contact = true;
  }
  world.currentPage = "contact";
  let tl = gsap.timeline();

  tl.to(camera.rotation, {
    z: -Math.PI / 2,
    y: -Math.PI / 2,
    duration: 1,
    ease: "power4.in",
  })
    .to(
      camera.position,
      {
        z: 10,
        x: -100,
        duration: 1,
        ease: "power1.in",
      },
      "-=1"
    )
    .to(
      document.getElementById("gui-container"),
      {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      },
      "-=1"
    )
    .to(
      document.getElementById("contact-container"),
      {
        opacity: 1,
        zIndex: 1,
        duration: 1,
        ease: "power4.in",
      },
      "-=.5"
    )

    .to(linkedinLogo.material, {
      opacity: 1,
      duration: 1,
    })
    .to(email.material, {
      opacity: 1,
      duration: 1,
    })
    .to(document.getElementById("back-button"), {
      opacity: 1,
      duration: 0.5,
    });
});
function createContactObjects() {
  const texture = new THREE.TextureLoader();
  const geometry = new THREE.PlaneGeometry(15, 15);
  const material = new THREE.MeshBasicMaterial({
    map: texture.load("../logos/linkedinlogo.png"),

    side: THREE.DoubleSide,
    opacity: 0,
  });
  const emailMaterial = new THREE.MeshBasicMaterial({
    map: texture.load("../logos/email.png"),
    color: 0xffffff,
    side: THREE.DoubleSide,
    opacity: 0,
  });
  material.transparent = true;
  emailMaterial.transparent = true;
  linkedinLogo = new THREE.Mesh(geometry, material);
  email = new THREE.Mesh(geometry, emailMaterial);
  linkedinLogo.position.set(-70, 10, 15);
  linkedinLogo.rotation.y = -Math.PI / 2;
  linkedinLogo.rotation.x = Math.PI / 2;
  email.position.set(-70, -10, 15);
  email.rotation.y = -Math.PI / 2;
  email.rotation.x = Math.PI / 2;
  scene.add(linkedinLogo, email);
}
function returnHomeFromContact() {
  let tl = gsap.timeline();

  tl.to(email.material, {
    opacity: 0,
    duration: 1,
  })
    .to(
      linkedinLogo.material,
      {
        opacity: 0,
        duration: 1,
      },
      "-=1"
    )
    .to(
      document.getElementById("back-button"),
      {
        opacity: 0,
        duration: 0.5,
      },
      "-=1"
    )
    .to(
      document.getElementById("contact-container"),
      {
        opacity: 0,
        zIndex: -1,
        duration: 1,
        ease: "power4.out",
      },
      "-=.5"
    )
    .to(
      document.getElementById("gui-container"),
      {
        opacity: 1,
        duration: 1,
        ease: "power4.in",
      },
      "-=1"
    )
    .to(camera.rotation, {
      z: 0,
      y: 0,
      x: 0,
      duration: 1,
      ease: "power4.out ",
    })
    .to(
      camera.position,
      {
        x: 0,
        y: 0,
        z: 100,
        duration: 1,
        ease: "power1.out",
      },
      "-=1"
    );
}
function handleContactAnimations() {
  if (linkedinLogo !== undefined) {
    const intersects = raycaster.intersectObject(linkedinLogo);
    if (intersects.length > 0) {
      linkedinLogo.scale.x = 1.2;
      linkedinLogo.scale.y = 1.2;
      world.contact.linkedinhover = true;
    } else {
      world.contact.linkedinhover = false;
      linkedinLogo.scale.x = 1;
      linkedinLogo.scale.y = 1;
      linkedinLogo.rotation.y += Math.cos((frame * 1) / 2) * 0.001;
      // linkedinLogo.position.z += Math.cos(frame + Math.random()) * 0.05;
    }
    const emailintersects = raycaster.intersectObject(email);
    if (emailintersects.length > 0) {
      email.scale.x = 1.2;
      email.scale.y = 1.2;
      world.contact.emailhover = true;
    } else {
      world.contact.emailhover = false;
      email.scale.x = 1;
      email.scale.y = 1;
      email.rotation.y -= Math.cos((frame * 1) / 2) * 0.002;
      // email.position.z -= Math.cos(frame + Math.random()) * 0.03;
    }
  }
  if (world.contact.linkedinhover) {
    document.getElementById("contact-helper-text").innerText =
      "Click to visit my Linkedin Page";
  } else if (world.contact.emailhover) {
    document.getElementById("contact-helper-text").innerText =
      "Click to copy my email address";
  } else {
    document.getElementById("contact-helper-text").innerText = "";
  }
}
// #endregion

// #region Tech Tower Model
let techtowermaterials = [];
let techtowermeshs = [];
const loader = new GLTFLoader();
function loadTechTower() {
  loader.load("../models/techtowerisland.glb", function (gltf) {
    scene.add(gltf.scene);
    techtower = gltf.scene;
    techtower.position.x = -400;
    techtower.rotation.x = Math.PI / 2;
    techtower.rotation.y = -Math.PI / 2;
    techtower.traverse((n) => {
      if (n.isMesh) {
        techtowermaterials.push(n.material);
        techtowermeshs.push(n);
        n.material.opacity = 0;
        n.material.transparent = true;
      }
    });
    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(
      techtower.position.x + 30,
      techtower.position.y,
      techtower.position.z + 10
    );
    light.lookAt(
      techtower.position.x,
      techtower.position.y,
      techtower.position.z
    );
    scene.add(light);
  });
}
//#endregion

animate();
