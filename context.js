export default {
  camera: undefined,
  scene: undefined,
  renderer: undefined,
  raycaster: undefined,
  icons: {
    resume: {
      downloadResume: undefined,
      interactiveResume: undefined,
      interaction: {
        education: undefined,
        experience: undefined,
        skills: undefined,
      },
    },
    contact: {
      linkedin: undefined,
      email: undefined,
    },
  },
  objects: {
    plane: undefined,
    techtower: {
      object: undefined,
      meshes: [],
      materials:[]
    }
  },
  pagesVisited: ["home"],
  visited: {
    resume: {
      main: false,
      sectionMenu: false,
    },
  },
  world: {
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
      physicalResume: undefined,
      physicalResumehover: false,
      interactiveResume: undefined,
      interactiveResumehover: false,
      resumeSection: {
        educationhover: false,
        experiencehover: false,
        skillshover: false,
      },
      currentSection: undefined,
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
  },
  mouse: {
    x: undefined,
    y: undefined,
  },
};
