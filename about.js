import context from "./context";
import gsap from "gsap";
import anim from "./animation";

var rotation, position;

let tl = gsap.timeline();
export default {
  start() {
    context.world.currentPage = "about";
    let unVisited = !context.pagesVisited.includes("about");
    if (unVisited) {
      // if (context.isMobile) {
      //   this.loadHTML();
      // } else {
      //   this.loadObjects();
      // }
      this.loadHTML()
      context.pagesVisited.push("about");
      rotation = context.camera.rotation;
      position = context.camera.position;
    }

    tl.to(context.header, anim.panOut(context.header))
      .to(context.buttonGroup, anim.panOut(context.buttonGroup), "<")
      .to(rotation, anim.aboutRotation)
      .to(position, anim.aboutLocation, "<")
      .to(context.mainMenu, anim.hideHTML, "<")
      .to(context.mobileMenu, anim.revealHTML)
      .to(context.backButton, anim.revealHTML);
  },
  loadHTML() {
    document.getElementById("about-david").style.zIndex = 1;
  },
  loadObjects() {},
  return() {
    this.returnHome();
  },
  returnHome() {
    context.world.currentPage = "home";
    tl.to(context.backButton, anim.hideHTML, "<")
      .to(context.mainMenu, anim.revealHTML, "<")
      .to(context.header, anim.panIn(context.header), "<")
      .to(context.buttonGroup, anim.panIn(context.buttonGroup), "<")
      .to(rotation, anim.mainMenuRotation)
      .to(position, anim.mainMenuLocation, "<");
    context.mobileMenu.innerHTML = "";
  },
  animate() {},
  onClick() {},
};
