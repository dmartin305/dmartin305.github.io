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
      if (context.isMobile) {
        this.loadHTML();
      } else {
        this.loadObjects();
      }
      context.pagesVisited.push("about");
      rotation = context.camera.rotation;
      position = context.camera.position;
    }

    tl.to(context.header, anim.panOut(context.header))
      .to(context.buttonGroup, anim.panOut(context.buttonGroup), "-=1")
      .to(rotation, anim.aboutRotation)
      .to(position, anim.aboutLocation, "-=1")
      .to(context.mainMenu, anim.hideHTML, "-=1")
      .to(context.mobileMenu, anim.revealHTML)
      .to(context.backButton, anim.revealHTML);
  },
  loadHTML() {},
  loadObjects() {},
  return() {
    this.returnHome();
  },
  returnHome() {
    context.world.currentPage = "home";
    tl.to(context.backButton, anim.hideHTML, "-=1")
      .to(context.mainMenu, anim.revealHTML, "-=1")
      .to(context.header, anim.panIn(context.header), "-=.5")
      .to(context.buttonGroup, anim.panIn(context.buttonGroup), "-=1")
      .to(rotation, anim.mainMenuRotation)
      .to(position, anim.mainMenuLocation, "-=1");
    context.mobileMenu.innerHTML = "";
  },
  animate() {},
  onClick() {},
};
