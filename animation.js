let halfPI = Math.PI / 2;

export default {
  // CAMERA LOCATIONS
  sharedCam: { duration: 1, ease: "power1.in" },
  contactLocation: { x: -100, y: 0, z: 10, duration: 1, ease: "power1.in" },
  resumeLocation: { x: 100, y: 0, z: 10, duration: 1, ease: "power1.in" },
  aboutLocation: { x: 0, y: 100, z: 10, duration: 1, ease: "power1.in" },
  mainMenuLocation: { x: 0, y: 0, z: 100, duration: 1, ease: "power4.out" },

  // CAMERA ROTATION
  sharedRot: { duration: 1, ease: "power4.out" },
  contactRotation: { y: -halfPI, z: -halfPI, duration: 1, ease: "power4.out" },
  resumeRotation: { y: halfPI, z: halfPI, duration: 1, ease: "power4.out" },
  aboutRotation: { x: halfPI, y: 0, z: 0, duration: 1, ease: "power4.out" },
  mainMenuRotation: { x: 0, y: 0, z: 0, duration: 1, ease: "power4.out" },

  // VISIBILITY
  hideHTML: { opacity: 0, zIndex: -1, duration: 1, ease: "power4.out" },
  revealHTML: { opacity: 1, zIndex: 1, duration: 0.25 },
  hideMesh: { opacity: 0, duration: 1, ease: "power4.out" },
  revealMesh: { opacity: 1, duration: 0.25 },

  // MAIN MENU PAN IN/OUT
  panOut: function (element) {
    return {
      x: innerWidth / 2 - element.innerWidth / 2,
      y: -innerWidth / 2,
      opacity: 0,
      duration: 1,
    };
  },
  panIn: function (element) {
    return {
      x: element.innerWidth / 2 - innerWidth / 2,
      y: innerHeight / 2 - element.innerHeight / 2,
      opacity: 1,
      duration: 1,
    };
  },
};
