import context from "./context";
import * as THREE from "three";
import gsap from "gsap";
let header = document.getElementById("david-martin");
let buttonGroup = document.getElementById("button-group");
let topnav = document.getElementById("topnav");
let backButton = document.getElementById("back-button");
export default {
  start() {
    let rotation = context.camera.rotation;
    let position = context.camera.position;

    if (!context.pagesVisited.includes("about")) {
      this.loadObjects();
      context.pagesVisited.push("about");
    }
    context.world.currentPage = "about";
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
      .to(topnav, { height: 50, opacity: 1, duration: 1 }, "-=.5")
      .to(rotation, {
        x: Math.PI / 2,
        duration: 1,
        ease: "power4.in",
      })
      .to(
        position,
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
      .to(backButton, {
        opacity: 1,
        duration: 0.5,
      });
  },
  loadObjects() {},
  return() {
    this.returnHome();
  },
  returnHome() {
    let tl = gsap.timeline();
    tl.to(
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
      .to(document.getElementById("gui-container"), {
        opacity: 1,
        duration: 0,
      })
      .to(topnav, { height: 0, opacity: 0, duration: 1 })
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
  animate() {},
  onClick() {},
};
