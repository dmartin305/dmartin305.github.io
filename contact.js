import context from "./context";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import gsap from "gsap";

let icons = context.icons.contact;
let frame = 0;
const linkedinURL = "https://www.linkedin.com/in/david-martin-507132148";
let header = document.getElementById("david-martin");
let buttonGroup = document.getElementById("button-group");
let topnav = document.getElementById("topnav");
let backButton = document.getElementById("back-button");
let cameraX = window.innerWidth < 768 ? -120 : -100;
export default {
  start() {
    let rotation = context.camera.rotation;
    let position = context.camera.position;
    if (!context.pagesVisited.includes("contact")) {
      this.loadObjects();
      context.pagesVisited.push("contact");
    }
    context.world.currentPage = "contact";
    let tl = gsap.timeline();

    tl.to(header, {
      x: -innerWidth / 2 + header.clientWidth / 2,
      y: -innerHeight / 2,
      opacity: 0,
      duration: 1,
    })
      .to(
        buttonGroup,
        {
          x: innerWidth / 2 - buttonGroup.clientWidth / 2,
          y: -innerHeight / 2,
          opacity: 0,
          duration: 1,
        },
        "-=1"
      )
      .to(rotation, {
        z: -Math.PI / 2,
        y: -Math.PI / 2,
        duration: 1,
        ease: "power4.in",
      })
      .to(
        position,
        {
          z: 10,
          x: cameraX,
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
      .to(icons.linkedin.material, {
        opacity: 1,
        duration: 1,
      })
      .to(icons.email.material, {
        opacity: 1,
        duration: 1,
      })
      .to(document.getElementById("back-button"), {
        opacity: 1,
        duration: 0.5,
      });
  },
  loadObjects() {
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
    icons.linkedin = new THREE.Mesh(geometry, material);
    icons.email = new THREE.Mesh(geometry, emailMaterial);
    icons.linkedin.position.set(-70, 10, 15);
    icons.linkedin.rotation.y = -Math.PI / 2;
    icons.linkedin.rotation.x = Math.PI / 2;
    icons.email.position.set(-70, -10, 15);
    icons.email.rotation.y = -Math.PI / 2;
    icons.email.rotation.x = Math.PI / 2;
    context.scene.add(icons.linkedin, icons.email);
  },
  return() {
    this.returnHome();
  },
  returnHome() {
    let tl = gsap.timeline();

    tl.to(icons.email.material, {
      opacity: 0,
      duration: 1,
    })
      .to(
        icons.linkedin.material,
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
      .to(
        header,
        {
          x: -innerWidth / 2 + header.innerWidth / 2,
          y: innerHeight / 2 - header.innerHeight / 2,
          opacity: 1,
          duration: 1,
        },
        "-=.5"
      )
      .to(
        buttonGroup,
        {
          x: -innerWidth / 2 + buttonGroup.innerWidth / 2,
          y: innerHeight / 2 - buttonGroup.innerHeight / 2,
          opacity: 1,
          duration: 1,
        },
        "-=1"
      )
      .to(context.camera.rotation, {
        z: 0,
        y: 0,
        x: 0,
        duration: 1,
        ease: "power4.out ",
      })
      .to(
        context.camera.position,
        {
          x: 0,
          y: 0,
          z: 100,
          duration: 1,
          ease: "power1.out",
        },
        "-=1"
      );
    context.world.currentPage = "home";
  },
  animate() {
    const intersectsLinkedin =
      context.raycaster.intersectObject(icons.linkedin).length > 0;
    const intersectsEmail =
      context.raycaster.intersectObject(icons.email).length > 0;
    if (intersectsLinkedin) {
      icons.linkedin.scale.x = 1.2;
      icons.linkedin.scale.y = 1.2;
      context.world.contact.linkedinhover = true;
    } else {
      context.world.contact.linkedinhover = false;
      icons.linkedin.scale.x = 1;
      icons.linkedin.scale.y = 1;
      icons.linkedin.rotation.y += Math.cos((frame * 1) / 2) * 0.001;
      // linkedinLogo.position.z += Math.cos(frame + Math.random()) * 0.05;
    }

    if (intersectsEmail) {
      icons.email.scale.x = 1.2;
      icons.email.scale.y = 1.2;
      context.world.contact.emailhover = true;
    } else {
      context.world.contact.emailhover = false;
      icons.email.scale.x = 1;
      icons.email.scale.y = 1;
      icons.email.rotation.y -= Math.cos((frame * 1) / 2) * 0.002;
      // email.position.z -= Math.cos(frame + Math.random()) * 0.03;
    }
    if (context.world.contact.linkedinhover) {
      document.getElementById("contact-helper-text").innerText =
        "Click to visit my Linkedin Page";
    } else if (context.world.contact.emailhover) {
      document.getElementById("contact-helper-text").innerText =
        "Click to copy my email address";
    } else {
      document.getElementById("contact-helper-text").innerText = "";
    }
  },
  onClick() {
    this.onClickLinkedin();
    this.onClickEmail();
  },
  onClickLinkedin() {
    const linkedinHover = context.world.contact.linkedinhover;
    if (linkedinHover) {
      window.open(linkedinURL);
      context.world.contact.linkedinhover = false;
    }
  },
  async onClickEmail() {
    // TODO add feedback for user to know email is copied
    const emailHover = context.world.contact.emailhover;
    if (emailHover) {
      try {
        await navigator.clipboard.writeText("dmartin305@gatech.edu");
        console.log("Content copied to clipboard");
        context.world.contact.emailhover = false;
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  },
};
