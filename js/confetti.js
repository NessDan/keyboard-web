let tsParticles, loadFull;

export const confetti = async () => {
  tsParticles ??
    ({ tsParticles } = await import(
      "https://cdn.jsdelivr.net/npm/tsparticles-engine/+esm"
    ));
  loadFull ??
    ({ loadFull } = await import(
      "https://cdn.jsdelivr.net/npm/tsparticles/+esm"
    ));

  await loadFull(tsParticles);

  async function loadParticles() {
    await tsParticles.load("tsparticles", {
      duration: 10,
      fullScreen: {
        zIndex: 1,
      },
      emitters: [
        {
          autoplay: true,
          name: "confetti1",
          position: {
            x: 0,
            y: 30,
          },
          rate: {
            quantity: 20,
            delay: 60,
          },
          particles: {
            move: {
              direction: "top-right",
              outModes: {
                top: "none",
                left: "none",
                default: "destroy",
              },
            },
          },
        },
        {
          autoplay: true,
          name: "confetti2",
          position: {
            x: 100,
            y: 30,
          },
          rate: {
            quantity: 20,
            delay: 60,
          },
          particles: {
            move: {
              direction: "top-left",
              outModes: {
                top: "none",
                right: "none",
                default: "destroy",
              },
            },
          },
        },
      ],
      particles: {
        color: {
          value: ["#ffffff", "#FF0000"],
        },
        move: {
          decay: 0.05,
          direction: "top",
          enable: true,
          gravity: {
            enable: true,
          },
          outModes: {
            top: "none",
            default: "destroy",
          },
          speed: {
            min: 40,
            max: 80,
          },
        },
        number: {
          value: 0,
        },
        opacity: {
          value: 1,
        },
        rotate: {
          value: {
            min: 0,
            max: 360,
          },
          direction: "random",
          animation: {
            enable: true,
            speed: 30,
          },
        },
        tilt: {
          direction: "random",
          enable: true,
          value: {
            min: 0,
            max: 360,
          },
          animation: {
            enable: true,
            speed: 30,
          },
        },
        size: {
          value: {
            min: 0,
            max: 2,
          },
          animation: {
            enable: true,
            startValue: "min",
            count: 1,
            speed: 16,
            sync: true,
          },
        },
        roll: {
          darken: {
            enable: true,
            value: 25,
          },
          enable: true,
          speed: {
            min: 5,
            max: 15,
          },
        },
        wobble: {
          distance: 30,
          enable: true,
          speed: {
            min: -7,
            max: 7,
          },
        },
        shape: {
          type: "character",
          options: {
            character: {
              fill: true,
              font: "Verdana",
              style: "",
              weight: 400,
              particles: {
                size: {
                  value: 20,
                },
              },
              value: ["⌨️", "⌨️", "🎮", "🕹️"],
            },
          },
        },
      },
    });
  }

  loadParticles();
};
