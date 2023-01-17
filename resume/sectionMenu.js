import context from "../context";
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import gsap from "gsap";
import education from "./sections/education";
import experience from "./sections/experience";
import skills from "./sections/skills";
import menu from "./menu";
let icons = context.icons.resume.interaction;
let prevIcons, sectionIcons;
let educationHover = context.world.resume.resumeSection.educationhover;
let experienceHover = context.world.resume.resumeSection.experiencehover;
let skillHover = context.world.resume.resumeSection.skillshover;

export default {
  start() {
    if (!context.pagesVisited.includes("resumeSection")) {
      this.loadObjects();
      context.pagesVisited.push("resumeSection");
    }
    context.world.currentPage = "resumeSection";
    this.loadObjects();
    prevIcons = [
      context.icons.resume.downloadResume.material,
      context.icons.resume.interactiveResume.material,
    ];
    sectionIcons = [
      icons.education.material,
      icons.experience.material,
      icons.skills.material,
    ];
    let tl = gsap.timeline();
    tl.to(document.getElementById("gui-container"), {
      zIndex: -1,
      opacity: 0,
      duration: 1 / 2,
    })
      .to(prevIcons, { opacity: 0, duration: 1, ease: "power4.out" }, "-=0.5")
      .to(
        context.camera.position,
        {
          x: -75,
          duration: 2,
          ease: "power4.inOut",
        },
        "-=1"
      )
      .to(sectionIcons, {
        opacity: 1,
        duration: 2,
      });
  },
  loadObjects() {
    const texture = new THREE.TextureLoader();
    const geometry = new THREE.PlaneGeometry(15, 15);
    const eduMaterial = new THREE.MeshBasicMaterial({
      map: texture.load("../education.png"),
      opacity: 0,
      side: THREE.DoubleSide,
    });
    eduMaterial.transparent = true;
    const expMaterial = new THREE.MeshBasicMaterial({
      map: texture.load("../experience.png"),
      opacity: 0,
      side: THREE.DoubleSide,
    });
    expMaterial.transparent = true;
    const skillMaterial = new THREE.MeshBasicMaterial({
      map: texture.load("../skills.png"),
      opacity: 0,
      side: THREE.DoubleSide,
    });
    skillMaterial.transparent = true;
    icons.education = new THREE.Mesh(geometry, eduMaterial);
    icons.experience = new THREE.Mesh(geometry, expMaterial);
    icons.skills = new THREE.Mesh(geometry, skillMaterial);
    icons.education.position.set(-100, -20, 15);
    icons.education.rotation.set(Math.PI / 2, Math.PI / 2, 0);
    icons.experience.position.set(-100, 0, 15);
    icons.experience.rotation.set(Math.PI / 2, Math.PI / 2, 0);
    icons.skills.position.set(-100, 20, 15);
    icons.skills.rotation.set(Math.PI / 2, Math.PI / 2, 0);
    context.scene.add(icons.education, icons.experience, icons.skills);
  },
  return() {
    context.world.currentPage = "resume";
    let tl = gsap.timeline();
    tl.to(sectionIcons, {
      opacity: 0,
      duration: 1,
    });
    menu.start();
  },
  returnHome() {},
  animate() {
    this.handleEducationIconAnimation();
    this.handleExperienceIconAnimation();
    this.handleSkillIconAnimation();
    this.handleHelperText();
  },
  handleEducationIconAnimation() {
    const intersectsEducation =
      context.raycaster.intersectObject(icons.education).length > 0;
    if (intersectsEducation) {
      icons.education.scale.x = 1.2;
      icons.education.scale.y = 1.2;
      icons.education.scale.z = 1.2;
      context.world.resume.resumeSection.educationhover = true;
    } else {
      icons.education.scale.x = 1;
      icons.education.scale.y = 1;
      icons.education.scale.z = 1;
      context.world.resume.resumeSection.educationhover = false;
    }
  },
  handleExperienceIconAnimation() {
    const intersectsExperience =
      context.raycaster.intersectObject(icons.experience).length > 0;
    if (intersectsExperience) {
      icons.experience.scale.x = 1.2;
      icons.experience.scale.y = 1.2;
      icons.experience.scale.z = 1.2;
      context.world.resume.resumeSection.experiencehover = true;
    } else {
      icons.experience.scale.x = 1;
      icons.experience.scale.y = 1;
      icons.experience.scale.z = 1;
      context.world.resume.resumeSection.experiencehover = false;
    }
  },
  handleSkillIconAnimation() {
    const intersectsSkills =
      context.raycaster.intersectObject(icons.skills).length > 0;
    if (intersectsSkills) {
      icons.skills.scale.x = 1.2;
      icons.skills.scale.y = 1.2;
      icons.skills.scale.z = 1.2;
      context.world.resume.resumeSection.skillshover = true;
    } else {
      icons.skills.scale.x = 1;
      icons.skills.scale.y = 1;
      icons.skills.scale.z = 1;
      context.world.resume.resumeSection.skillshover = false;
    }
  },
  handleHelperText() {
    if (context.world.resume.resumeSection.educationhover) {
      document.getElementById("resume-helper-text").innerText = "EDUCATION";
    } else if (context.world.resume.resumeSection.experiencehover) {
      document.getElementById("resume-helper-text").innerText = "EXPERIENCE";
    } else if (context.world.resume.resumeSection.skillshover) {
      document.getElementById("resume-helper-text").innerText = "SKILLS";
    } else {
      document.getElementById("resume-helper-text").innerText = "";
    }
  },
  onClickEducation() {
    let educationHover = context.world.resume.resumeSection.educationhover;
    if (educationHover) {
      context.world.resume.resumeSection.educationhover = false;
      document.getElementById("resume-helper-text").innerText = "";
      context.world.currentPage = "education";
      console.log("1");
      education.start();
    }
  },
  onClick() {
    this.onClickEducation();
    this.onClickExperience();
    this.onClickSkills();
  },
  onClickExperience() {
    if (experienceHover) {
      document.getElementById("resume-helper-text");
      experience.start();
    }
  },
  onClickSkills() {
    if (skillHover) {
      document.getElementById("resume-helper-text");
      skills.start();
    }
  },
};
