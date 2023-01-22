import context from "../context";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import gsap from "gsap";
import sectionMenu from "./sectionMenu";
 const isNotMobile =
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
let icons = context.icons.resume;
let frame = 0;
let header = document.getElementById("david-martin");
let buttonGroup = document.getElementById("button-group");
let backButton = document.getElementById("back-button");
export default {
  start() {
    var interactiveResume, downloadResume;
    let visited = context.pagesVisited;
    // Long variables shortened
   
    if (!visited.includes("resume")) {
      if (isNotMobile) {
      this.loadObjects();
      downloadResume = icons.downloadResume.material;
      interactiveResume = icons.interactiveResume.material;
      } else {
        downloadResume = document.createElement("a");
        downloadResume.id = "downloadResume";
        downloadResume.className = "link";
        downloadResume.innerHTML = '<button class = "david-text button-35">Download Resume</button>';
    
        interactiveResume = document.createElement("a");
        interactiveResume.id = "interactiveResume";
        interactiveResume.className = "link";
        interactiveResume.innerHTML = '<button class = "david-text button-35">Interactive Resume</button>';

        getElementById("mobile-button-container").appendChild(downloadResume);
        getElementById("mobile-button-container").appendChild(interactiveResume);
      }
      visited.push("resume");
    }
    context.world.currentPage = "resume";
    let rotation = context.camera.rotation;
    let position = context.camera.position;

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
        z: Math.PI / 2,
        y: Math.PI / 2,
        duration: 1,
        ease: "power4.in",
      })
      .to(
        position,
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
      .to(downloadResume, {
        opacity: 1,
        if(isMobile) {zIndex:1},
        duration: 1,
      })
      .to(interactiveResume, {
        opacity: 1,
        if(isMobile) {zIndex:1},
        duration: 1,
      })
      .to(backButton, {
        opacity: 1,
        zIndex: 2,
        duration: 0.5,
      });
  },
  loadObjects() {
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
    icons.downloadResume = new THREE.Mesh(geometry, material);
    icons.interactiveResume = new THREE.Mesh(geometry, emailMaterial);
    icons.downloadResume.position.set(70, -10, 15);
    icons.downloadResume.rotation.y = Math.PI / 2;
    icons.downloadResume.rotation.x = Math.PI / 2;
    icons.interactiveResume.position.set(70, 10, 15);
    icons.interactiveResume.rotation.y = Math.PI / 2;
    icons.interactiveResume.rotation.x = Math.PI / 2;
    context.scene.add(icons.downloadResume, icons.interactiveResume);
  },
  return() {
    context.world.currentPage = "home";
    this.returnHome();
  },
  returnHome() {
    context.world.currentPage = "home";
    let tl = gsap.timeline();
    tl.to(backButton, {
      opacity: 0,
      duration: 0.5,
    })
      .to(icons.interactiveResume.material, {
        opacity: 0,
        duration: 1,
      })
      .to(icons.downloadResume.material, {
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
          zIndex: 1,
          ease: "power4.out",
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
  },
  animate() {
   // this.handleInteractiveIconAnimation();
    // this.handleDownloadIconAnimation();
    // this.handleHelperText();
  },
  handleInteractiveIconAnimation() {
    const intersectsInteractiveResume =
      context.raycaster.intersectObject(icons.interactiveResume).length > 0;
    if (intersectsInteractiveResume) {
      icons.interactiveResume.scale.x = 1.2;
      icons.interactiveResume.scale.y = 1.2;
      context.world.resume.interactiveResumehover = true;
    } else {
      icons.interactiveResume.scale.x = 1;
      icons.interactiveResume.scale.y = 1;
      icons.interactiveResume.rotation.y -= Math.cos((frame * 1) / 2) * 0.001;
      context.world.resume.interactiveResumehover = false;
    }
  },
  handleDownloadIconAnimation() {
    const intersectsPhysicalResume =
      context.raycaster.intersectObject(icons.downloadResume).length > 0;
    if (intersectsPhysicalResume) {
      icons.downloadResume.scale.x = 1.2;
      icons.downloadResume.scale.y = 1.2;
      context.world.resume.physicalResumehover = true;
    } else {
      icons.downloadResume.scale.x = 1;
      icons.downloadResume.scale.y = 1;
      icons.downloadResume.rotation.y += Math.cos((frame * 1) / 2) * 0.001;
      context.world.resume.physicalResumehover = false;
    }
  },
  handleHelperText() {
    if (context.world.resume.interactiveResumehover) {
      document.getElementById("helper-text").innerText =
        "Click to begin an interactive journey";
    } else if (context.world.resume.physicalResumehover) {
      document.getElementById("helper-text").innerText =
        "Click to download my resume";
    } else {
      document.getElementById("helper-text").innerText = "";
    }
  },
  onClick() {
    this.onClickDownload();
    this.onClickInteractiveResume();
  },
  async onClickDownload() {
    const downloadHover = context.world.resume.physicalResumehover;
    if (downloadHover) {
      context.world.resume.physicalResumehover = false;
      var link = document.createElement("a");
      link.download = "document";
      link.href = "../bg.jpeg";
      link.click();
    }
  },
  onClickInteractiveResume() {
    const interactiveHover = context.world.resume.interactiveResumehover;
    if (interactiveHover) {
      context.world.resume.interactiveResumehover = false;
      document.getElementById("resume-helper-text").innerText = "";
      sectionMenu.start();
    }
  },
};
