import context from "./context";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import gsap from "gsap";
import anim from "./animation";

var linkedinButton,
  emailButton,
  linkedin,
  email,
  linkedinHide,
  linkedinReveal,
  emailHide,
  emailReveal,
  rotation,
  position;
let icons = context.icons.contact;
let tl = gsap.timeline();

export default {
  start() {
    context.world.currentPage = "contact";
    let unVisited = !context.pagesVisited.includes("contact");
    if (unVisited) {
      if (context.isMobile) {
        this.loadHTML();
        email = emailButton;
        linkedin = linkedinButton;
        emailHide = linkedinHide = anim.hideHTML;
        emailReveal = linkedinReveal = anim.revealHTML;
      } else { 
        this.loadObjects();
        email = icons.email.material;
        linkedin = icons.linkedin.material;
        emailHide = linkedinHide = anim.hideMesh;
        emailReveal = linkedinReveal = anim.hideMesh;
      }
      context.pagesVisited.push("contact");
      rotation = context.camera.rotation;
      position = context.camera.position;
    }

    tl.to(context.header, anim.panOut(context.header))
      .to(context.buttonGroup, anim.panOut(context.buttonGroup), "-=1")
      .to(rotation, anim.contactRotation)
      .to(position, anim.contactLocation, "-=1")
      .to(context.mainMenu, anim.hideHTML, "-=1")
      .to(context.mobileMenu, anim.revealHTML)
      .to(linkedin, linkedinReveal)
      .to(email, emailReveal)
      .to(context.backButton, anim.revealHTML);
  },
  loadHTML() {
    linkedinButton = document.createElement("a");
    linkedinButton.id = "linkedin-button";
    linkedinButton.className = "link";
    linkedinButton.innerHTML =
      '<button class = "david-text button-35">Visit my Linkedin</button>';
    document
      .getElementById("mobile-button-container")
      .appendChild(linkedinButton);
    emailButton = document.createElement("a");
    emailButton.id = "email-button";
    emailButton.className = "link";
    emailButton.innerHTML =
      '<button class = "david-text button-35">Copy my Email</button>';
    document.getElementById("mobile-button-container").appendChild(emailButton);

    linkedinButton.addEventListener("click", this.onClickLinkedin);
    emailButton.addEventListener("click", this.onClickEmail);
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
    context.world.currentPage = "home";
    tl.to(email, emailHide)
      .to(linkedin, linkedinHide, "-=1")
      .to(context.backButton, anim.hideHTML, "-=1")
      .to(context.mainMenu, anim.revealHTML, "-=1")
      .to(context.header, anim.panIn(context.header), "-=.5")
      .to(context.buttonGroup, anim.panIn(context.buttonGroup), "-=1")
      .to(rotation, anim.mainMenuRotation)
      .to(position, anim.mainMenuLocation, "-=1");
  },
  animate() {
    if (this.intersects(icons.linkedin)) {
      icons.linkedin.scale.x = 1.2;
      icons.linkedin.scale.y = 1.2;
      context.world.contact.linkedinhover = true;
    } else {
      icons.linkedin.scale.x = 1;
      icons.linkedin.scale.y = 1;
      icons.linkedin.rotation.y += 0.002;
      context.world.contact.linkedinhover = false;
    }

    if (this.intersects(icons.email)) {
      icons.email.scale.x = 1.2;
      icons.email.scale.y = 1.2;
      context.world.contact.emailhover = true;
    } else {
      icons.email.scale.x = 1;
      icons.email.scale.y = 1;
      icons.email.rotation.y += 0.002;
      context.world.contact.emailhover = false;
    }
    // if (context.world.contact.linkedinhover) {
    //   document.getElementById("helper-text").innerText =
    //     "Click to visit my Linkedin Page";
    // } else if (context.world.contact.emailhover) {
    //   document.getElementById("helper-text").innerText =
    //     "Click to copy my email address";
    // } else {
    //   document.getElementById("helper-text").innerText = "";
    // }
  },
  intersects(object) {
    return context.raycaster.intersectObject(object).length > 0;
  },
  onClick() {
    this.onClickLinkedin();
    this.onClickEmail();
  },
  onClickLinkedin() {
    const linkedinHover = context.world.contact.linkedinhover;
    if (linkedinHover) {
      window.open(context.linkedinURL);
      context.world.contact.linkedinhover = false;
    }
  },
  async onClickEmail() {
    // TODO add feedback for user to know email is copied
    const emailHover = context.world.contact.emailhover;
    if (emailHover || context.isMobile) {
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
