import context from "../context";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import gsap from "gsap";
import sectionMenu from "./sectionMenu";
import anim from "../animation";

var header,
  interactiveButton,
  downloadButton,
  interactive,
  download,
  interactiveHide,
  interactiveReveal,
  downloadHide,
  downlaodReveal,
  rotation,
  position;
let icons = context.icons.resume;
let tl = gsap.timeline();

export default {
  start() {
    context.world.currentPage = "resume";
    let unVisited = !context.pagesVisited.includes("resume");
    if (unVisited) {
      if (context.isMobile) {
        this.loadHTML();
        interactive = interactiveButton;
        download = downloadButton;
        interactiveHide = downloadHide = anim.hideHTML;
        interactiveReveal = downlaodReveal = anim.revealHTML;
      } else {
        this.loadObjects();
        interactive = icons.interactiveResume.material;
        download = icons.downloadResume.material;
        interactiveHide = downloadHide = anim.hideMesh;
        interactiveReveal = downlaodReveal = anim.revealMesh;
      }
      context.pagesVisited.push("resume");
      rotation = context.camera.rotation;
      position = context.camera.position;
    } else {
      if (context.isMobile) {
        context.mobileMenu.appendChild(header);
        context.mobileMenu.appendChild(downloadButton);
        context.mobileMenu.appendChild(interactiveButton);
      }
    }

    tl.to(context.header, anim.panOut(context.header))
      .to(context.buttonGroup, anim.panOut(context.buttonGroup), "-=1")
      .to(rotation, anim.resumeRotation)
      .to(position, anim.resumeLocation, "-=1")
      .to(context.mainMenu, anim.hideHTML, "-=1")
      .to(download, downlaodReveal)
      .to(interactive, interactiveReveal)
      .to(context.mobileMenu, anim.revealHTML)
      .to(context.backButton, anim.revealHTML);
  },
  loadHTML() {
    header = document.createElement("h1");
    header.style.alignSelf = "center";
    header.className = "david-text";
    header.innerText = "Resume";

    downloadButton = document.createElement("a");
    downloadButton.id = "downloadResume";
    downloadButton.className = "link";
    downloadButton.innerHTML =
      '<button style = "display: flex; padding-horizontal: 10%;  padding-left:5%;" class = "david-text button-35"><i style= "padding-right: 5%" class="fa-solid fa-download"></i> Download CV</button>';

    interactiveButton = document.createElement("a");
    interactiveButton.id = "interactiveResume";
    interactiveButton.className = "link";
    interactiveButton.innerHTML =
      '<button style = "display: flex; padding-horizontal: 10%;  padding-left:5%;" class = "david-text button-35"><i style= "padding-right: 5%" class="fa-solid fa-user-astronaut"></i> Interactive CV</button>';
    context.mobileMenu.appendChild(header);
    context.mobileMenu.appendChild(downloadButton);
    context.mobileMenu.appendChild(interactiveButton);

    downloadButton.addEventListener("click", () => this.onClickDownload());
    interactiveButton.addEventListener("click", () =>
      this.onClickInteractiveResume()
    );
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
    this.returnHome();
  },
  returnHome() {
    context.world.currentPage = "home";
    tl.to(interactive, interactiveHide)
      .to(download, downloadHide, "-=1")
      .to(context.mobileMenu, anim.hideHTML)
      .to(context.backButton, anim.hideHTML, "-=1")
      .to(context.mainMenu, anim.revealHTML, "-=1")
      .to(context.header, anim.panIn(context.header), "-=.5")
      .to(context.buttonGroup, anim.panIn(context.buttonGroup), "-=1")
      .to(rotation, anim.mainMenuRotation)
      .to(position, anim.mainMenuLocation, "-=1");
    context.mobileMenu.innerHTML = "";
  },
  animate() {
    this.handleInteractiveIconAnimation();
    this.handleDownloadIconAnimation();
    // this.handleHelperText();
  },
  intersects(object) {
    return context.raycaster.intersectObject(object).length > 0;
  },
  handleInteractiveIconAnimation() {
    if (this.intersects(icons.interactiveResume)) {
      icons.interactiveResume.scale.x = 1.2;
      icons.interactiveResume.scale.y = 1.2;
    } else {
      icons.interactiveResume.scale.x = 1;
      icons.interactiveResume.scale.y = 1;
      icons.interactiveResume.rotation.y += 0.002;
    }
  },
  handleDownloadIconAnimation() {
    if (this.intersects(icons.downloadResume)) {
      icons.downloadResume.scale.x = 1.2;
      icons.downloadResume.scale.y = 1.2;
    } else {
      icons.downloadResume.scale.x = 1;
      icons.downloadResume.scale.y = 1;
      icons.downloadResume.rotation.y += 0.002;
    }
  },
  handleHelperText() {
    // if (context.world.resume.interactiveResumehover) {
    //   document.getElementById("helper-text").innerText =
    //     "Click to begin an interactive journey";
    // } else if (context.world.resume.physicalResumehover) {
    //   document.getElementById("helper-text").innerText =
    //     "Click to download my resume";
    // } else {
    //   document.getElementById("helper-text").innerText = "";
    // }
  },
  onClick() {
    if (this.intersects(icons.downloadResume)) {
      this.onClickDownload();
    }
    if (this.intersects(icons.interactiveResume)) {
      this.onClickInteractiveResume();
    }
  },
  async onClickDownload() {
    if (context.isMobile)
      downloadButton.innerHTML =
        '<button class = "david-text button-35">Downloaded</button>';
    var link = document.createElement("a");
    link.download = "document";
    link.href = "../bg.jpeg";
    link.click();
  },
  onClickInteractiveResume() {
    if (context.isMobile)
      interactiveButton.innerHTML =
        '<button class = "david-text button-35">Interacted</button>';
  },
};
