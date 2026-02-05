// ===============================
// Animation Timeline
// ===============================
const animationTimeline = () => {

  // Utility: split text into spans safely
  const splitTextIntoSpans = (element) => {
    if (!element) return;
  
    const text = element.textContent;
    element.innerHTML = text
      .split("")
      .map(char => {
        if (char === " ") return `<span>&nbsp;</span>`;
        return `<span>${char}</span>`;
      })
      .join("");
  };
  

  const textBox = document.getElementsByClassName("hbd-chatbox")[0];
  const wishHeading = document.getElementsByClassName("wish-hbd")[0];

  splitTextIntoSpans(textBox);
  splitTextIntoSpans(wishHeading);

  // Reusable animation presets
  const ideaEnter = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg",
  };

  const ideaExit = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg",
  };

  window.tl = new TimelineMax();


  tl.to(".container", 0.1, { visibility: "visible" })

    // Intro
    .from(".one", 0.7, { opacity: 0, y: 12 })
    .from(".two", 0.4, { opacity: 0, y: 12 })

    .to(".one", 0.7, { opacity: 0, y: 12 }, "+=2.5")
    .to(".two", 0.7, { opacity: 0, y: 12 }, "-=1")

    // Scene 2
    .from(".three", 0.7, { opacity: 0, y: 12 })
    .to(".three", 0.7, { opacity: 0, y: 12 }, "+=2")

    // Chat box
    .from(".four", 0.7, { scale: 0.25, opacity: 0 })
    .from(".fake-btn", 0.3, { scale: 0.4, opacity: 0 })

    .staggerTo(
      ".hbd-chatbox span",
      0.45,
      { visibility: "visible" },
      0.045
    )

    .to(".fake-btn", 0.15, {
      backgroundColor: "rgb(127, 206, 248)",
    })

    .to(".four", 0.6, {
      scale: 0.2,
      opacity: 0,
      y: -140,
    }, "+=0.7")

    // Thought sequence
    .from(".idea-1", 0.7, ideaEnter)
    .to(".idea-1", 0.7, ideaExit, "+=1.5")

    .from(".idea-2", 0.7, ideaEnter)
    .to(".idea-2", 0.7, ideaExit, "+=1.5")

    .from(".idea-3", 0.7, ideaEnter)
    .to(".idea-3 strong", 0.5, {
      scale: 1.15,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff",
    })
    .to(".idea-3", 0.7, ideaExit, "+=1.5")

    .from(".idea-4", 0.7, ideaEnter)
    .to(".idea-4", 0.7, ideaExit, "+=1.5")

    // Emphasis moment
    .from(".idea-5", 0.7, {
      rotationX: 15,
      rotationZ: -8,
      skewY: "-5deg",
      y: 50,
      opacity: 0,
    }, "+=0.5")

    .to(".idea-5 span", 0.6, {
      rotation: 90,
      x: 8,
    }, "+=0.4")

    .to(".idea-5", 0.7, {
      scale: 0.2,
      opacity: 0,
    }, "+=2")

    // Big letters
    .staggerFrom(".idea-6 span", 0.8, {
      scale: 3,
      opacity: 0,
      rotation: 15,
      ease: Expo.easeOut,
    }, 0.2)

    .staggerTo(".idea-6 span", 0.8, {
      scale: 3,
      opacity: 0,
      rotation: -15,
      ease: Expo.easeOut,
    }, 0.2, "+=1")

    .to(".valentine-box", 0.6, {
      opacity: 1,
      pointerEvents: "auto"
    })
    .call(initValentineInteraction)

    .addPause("waitForYes")

    // Floating visuals (unchanged image refs)
    .staggerFromTo(
      ".baloons img",
      2.5,
      { opacity: 0.9, y: 1400 },
      { opacity: 1, y: -1000 },
      0.2
    )

    // Image reveal
    .from(".girl-dp", 0.6, {
      scale: 3.2,
      opacity: 0,
      x: 20,
      y: -20,
      rotationZ: -40,
    }, "-=2")

    // Wish text
    .staggerFrom(".wish-hbd span", 0.7, {
      opacity: 0,
      y: -40,
      rotation: 120,
      skewX: "30deg",
      ease: Elastic.easeOut.config(1, 0.5),
    }, 0.1)

    .staggerFromTo(".wish-hbd span", 0.7,
      { scale: 1.3, rotationY: 120 },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut,
      },
      0.1,
      "celebrate"
    )

    .from(".wish h5", 0.5, {
      opacity: 0,
      y: 10,
      skewX: "-15deg",
    }, "celebrate")

    // SVG burst
    .staggerTo(".eight svg", 1.5, {
      visibility: "visible",
      opacity: 0,
      scale: 80,
      repeat: 3,
      repeatDelay: 1.4,
    }, 0.3)

    

    .to(".nine", 0.1, { opacity: 1, pointerEvents: "auto" })
    .staggerFrom(".nine p", 1, ideaEnter, 1.2)
    .to(".valentine-box", 0.6, {
      opacity: 1,
      pointerEvents: "auto"
    })
    .call(initValentineInteraction);    

  // Replay
  const replayBtn = document.getElementById("replay");
  if (replayBtn) {
    replayBtn.addEventListener("click", () => tl.restart());
  }
};

// ===============================
// Data Injection
// ===============================
const fetchData = () => {
  return fetch("customize.json")
    .then(res => res.json())
    .then(data => {
      Object.keys(data).forEach(key => {
        if (!data[key]) return;

        const el = document.getElementById(key);
        if (!el) return;

        if (key === "imagePath") {
          el.setAttribute("src", data[key]);
        } else {
          el.innerText = data[key];
        }
      });
    });
};

// ===============================
// Init (correct sequencing)
// ===============================
fetchData().then(animationTimeline);

// ===============================
// Valentine Interaction Logic
// ===============================
const initValentineInteraction = () => {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const responseText = document.getElementById("valentineResponse");

  if (!yesBtn || !noBtn) return;

  let escaped = false;

  yesBtn.addEventListener("click", () => {
    responseText.textContent = "Yay! You just made my day 💖";
  
    // Disable buttons immediately
    yesBtn.style.pointerEvents = "none";
    noBtn.style.pointerEvents = "none";
  
    // Hard-hide NO button (it may be in <body>)
    noBtn.style.display = "none";
  
    // ⏳ Let the message stay for a moment
    TweenMax.delayedCall(1.2, () => {
      TweenMax.to(".valentine-box", 0.6, {
        opacity: 0,
        scale: 0.92,
        pointerEvents: "none",
        onComplete: () => {
          const box = document.querySelector(".valentine-box");
          if (box) box.style.display = "none";
  
          // ▶ Resume animation AFTER UI is gone
          window.tl.play("waitForYes");
        }
      });
    });
  });
  
  

  noBtn.addEventListener("mouseenter", () => {
    // Preserve visual style
    let dodgeCooldown = false;

const moveNoButton = () => {
  if (dodgeCooldown) return;
  dodgeCooldown = true;

  const padding = 120;
  const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - padding);
  const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - padding);

  noBtn.style.left = `${Math.max(padding, x)}px`;
  noBtn.style.top = `${Math.max(padding, y)}px`;

  // short cooldown prevents jitter
  setTimeout(() => {
    dodgeCooldown = false;
  }, 80);
};

// Preserve style & move to body once
const escapeNoButton = () => {
  const computed = window.getComputedStyle(noBtn);

  noBtn.style.cssText += `
    font-family: ${computed.fontFamily};
    font-size: ${computed.fontSize};
    padding: ${computed.padding};
    border-radius: ${computed.borderRadius};
    background: ${computed.background};
    color: ${computed.color};
    box-shadow: ${computed.boxShadow};
    border: ${computed.border};
  `;

  if (!noBtn.dataset.escaped) {
    const rect = noBtn.getBoundingClientRect();
    document.body.appendChild(noBtn);

    noBtn.style.position = "fixed";
    noBtn.style.left = `${rect.left}px`;
    noBtn.style.top = `${rect.top}px`;
    noBtn.style.zIndex = "99999";
    noBtn.dataset.escaped = "true";
  }
};

// Start dodging when cursor comes near
document.addEventListener("mousemove", (e) => {
  if (!noBtn || noBtn.style.display === "none") return;

  escapeNoButton();

  const rect = noBtn.getBoundingClientRect();
  const buffer = 10;

  const near =
    e.clientX > rect.left - buffer &&
    e.clientX < rect.right + buffer &&
    e.clientY > rect.top - buffer &&
    e.clientY < rect.bottom + buffer;

  if (near) {
    moveNoButton();
  }
});

  });
  
};







/*// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg",
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg",
  };

  const tl = new TimelineMax();

  tl.to(".container", 0.1, {
    visibility: "visible",
  })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10,
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10,
    })
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10,
      },
      "+=2.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10,
      },
      "-=1"
    )
    .from(".three", 0.7, {
      opacity: 0,
      y: 10,
      // scale: 0.7
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10,
      },
      "+=2"
    )
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0,
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0,
    })
    .staggerTo(
      ".hbd-chatbox span",
      0.5,
      {
        visibility: "visible",
      },
      0.05
    )
    .to(".fake-btn", 0.1, {
      backgroundColor: "rgb(127, 206, 248)",
    })
    .to(
      ".four",
      0.5,
      {
        scale: 0.2,
        opacity: 0,
        y: -150,
      },
      "+=0.7"
    )
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff",
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0,
      },
      "+=0.5"
    )
    .to(
      ".idea-5 span",
      0.7,
      {
        rotation: 90,
        x: 8,
      },
      "+=0.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0,
      },
      "+=2"
    )
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut,
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut,
      },
      0.2,
      "+=1"
    )
    .staggerFromTo(
      ".baloons img",
      2.5,
      {
        opacity: 0.9,
        y: 1400,
      },
      {
        opacity: 1,
        y: -1000,
      },
      0.2
    )
    .from(
      ".girl-dp",
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45,
      },
      "-=2"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0,
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        // scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5),
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150,
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut,
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg",
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4,
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1",
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90,
      },
      "+=1"
    );

  // tl.seek("currentStep");
  // tl.timeScale(2);

  // Restart Animation on click
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
  });
};

// Import the data to customize and insert them into page
const fetchData = () => {
  fetch("customize.json")
    .then((data) => data.json())
    .then((data) => {
      Object.keys(data).map((customData) => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .getElementById(customData)
              .setAttribute("src", data[customData]);
          } else {
            document.getElementById(customData).innerText = data[customData];
          }
        }
      });
    });
};

// Run fetch and animation in sequence
const resolveFetch = () => {
  return new Promise((resolve, reject) => {
    fetchData();
    resolve("Fetch done!");
  });
};

resolveFetch().then(animationTimeline());
*/
