// src/components/Particles.jsx
import React from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from "tsparticles-slim";

function ParticlesComponent() {
  const particlesInit = async (main) => {
    // This loads the tsparticles package bundle, which is necessary for react-particles
    await loadSlim(main);
  };

  const particlesLoaded = (container) => {
    console.log(container);
  };

  return (
    <Particles
      particlesInit={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: {
          zIndex: -10
        },
        particles: {
          number: {
            value: 30,
            limit: 30,
            density: {
              enable: true,
              value_area: 1000
            },
          },
          color: {
            value: "#0E8BFF",
            opacity: 0.3,
          },
          opacity: {
            value: 0.1,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.5,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#0E8BFF",
            opacity: 0.3,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: true,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        retina_detect: true,
        fps_limit: 60,
      }}
    />
  );
}

export default ParticlesComponent;
