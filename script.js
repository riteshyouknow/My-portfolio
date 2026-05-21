gsap.to(".nameroll h1", {
  transform: "translateX(-110%)",
  scrollTrigger: {
    trigger: ".page2",
    scroller: "body",
    start: "top 90%",
    end: "top -150%",
    scrub: 1,
  },
});

gsap.from(".intro h1", {
  y: 40,
  opacity: 0,
  stagger: 0.14,

  scrollTrigger: {
    trigger: ".intro h1",
    scroller: "body",
    start: "top 80%",
  },
});

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 0,
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Tell ScrollTrigger to update on Lenis scroll
lenis.on("scroll", ScrollTrigger.update);

// svg throw DOM propertise

const arrow = document.getElementById("scrollArrow");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (scrollY > 100) {
    arrow.style.transform = "rotate(90deg)";
  } else {
    arrow.style.transform = "rotate(0deg)";
  }
});

// Scroll smoothly to top on click
arrow.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//page 3 js

gsap.from(".development-elem img", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".development-elem img",
    scroller: "body",
    //markers:true,
    start: "top 80%",
  },
  y: 20,

  stagger: {
    amount: 1,
  },
});
gsap.from(".designelem img", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".designelem img",
    scroller: "body",
    //markers:true,
    start: "top 80%",
  },
  y: 20,

  stagger: {
    amount: 2,
  },
});

//reload

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  // Temporarily set smooth scrolling in JS
  document.documentElement.style.scrollBehavior = "smooth";

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Remove smooth scroll after it's done (e.g. after 500ms)
  setTimeout(() => {
    document.documentElement.style.scrollBehavior = "auto";
  }, 500);
});

// const chatToggle = document.getElementById("chat-toggle");
const chatContainer = document.getElementById("chat-container");
const closeChat = document.getElementById("close-chat");

const sendBtn = document.getElementById("send-btn");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

/* OPEN CHAT */

// // chatToggle.addEventListener("click", () => {
//   chatContainer.style.display = "flex";
// });

/* START HIDDEN */

chatContainer.style.display =
  "none";

/* CLOSE CHAT */

closeChat.addEventListener("click", () => {
  chatContainer.style.display = "none";
});

/* SEND MESSAGE */

async function sendMessage() {
  const message = chatInput.value.trim();

  if (message === "") return;

  /* USER MESSAGE */

  const userMessage = document.createElement("div");

  userMessage.classList.add("user-message");

  userMessage.innerHTML = message;

  chatMessages.appendChild(userMessage);

  chatInput.value = "";

  /* AUTO SCROLL */

  chatMessages.scrollTop = chatMessages.scrollHeight;

  /* TEMP BOT REPLY */

  const botMessage = document.createElement("div");

  botMessage.classList.add("bot-message");

  botMessage.innerHTML = "Typing...";

  chatMessages.appendChild(botMessage);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  /* AI REPLY */

  const aiReply = await getBotReply(message);

  botMessage.innerHTML = aiReply;

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* BUTTON CLICK */

sendBtn.addEventListener("click", sendMessage);

/* ENTER KEY */

chatInput.addEventListener("keypress", (e) => {

    if(e.key === "Enter"){

        e.preventDefault();

        sendMessage();
    }

});

async function getBotReply(message) {
  const response = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      message: message,
    }),
  });

  const data = await response.json();

  return data.reply;
}







// ================= ROBOT =================

const robotContainer =
  document.getElementById(
    "robot-container"
  );

const scene =
  new THREE.Scene();

const camera =
  new THREE.PerspectiveCamera(
    45,
    1,
    0.1,
    1000
  );

camera.position.z = 5;

const renderer =
  new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

renderer.setSize(320, 320);

renderer.setPixelRatio(
  window.devicePixelRatio
);

robotContainer.appendChild(
  renderer.domElement
);

// LIGHTS

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    2
  );

scene.add(ambientLight);

const directionalLight =
  new THREE.DirectionalLight(
    0xffffff,
    2
  );

directionalLight.position.set(
  3,
  3,
  3
);

scene.add(directionalLight);

// MODEL

let mixer;
let action;
let isAnimating = false;

const loader =
  new THREE.GLTFLoader();

loader.load(

  "./models/Waving.glb",

  function (gltf) {

    const model =
      gltf.scene;

    model.scale.set(
      0.5,
      0.5,
      0.5
    );

    model.position.set(
      0,
      -1.5,
      0
    );

    scene.add(model);

    mixer =
      new THREE.AnimationMixer(
        model
      );

    action =
      mixer.clipAction(
        gltf.animations[0]
      );

    // PLAY ONLY ONCE

    action.setLoop(
      THREE.LoopOnce
    );

    action.clampWhenFinished =
      true;

    // PAGE LOAD WAVE

    playWaveAnimation();
  }
);

// PLAY FUNCTION

function playWaveAnimation() {

  // IF ALREADY PLAYING
  if (
    !action ||
    isAnimating
  ) return;

  isAnimating = true;

  action.reset();

  action.play();

  // ANIMATION END

  mixer.addEventListener(
    "finished",
    () => {

      isAnimating = false;
    },

    { once: true }
  );
}

// CLOCK

const clock =
  new THREE.Clock();

// ANIMATE

function animate() {

  requestAnimationFrame(
    animate
  );

  if (mixer) {

    mixer.update(
      clock.getDelta()
    );
  }

  renderer.render(
    scene,
    camera
  );
}

animate();

// ================= CHAT OPEN =================

robotContainer.addEventListener(
  "click",
  () => {

    // HIDE ROBOT

    robotContainer.style.display =
      "none";

    // SHOW CHAT

    chatContainer.style.display =
      "flex";
  }
);

// ================= DRAG =================

let isDragging = false;

let offsetX = 0;
let offsetY = 0;

robotContainer.addEventListener(
  "mousedown",
  (e) => {

    isDragging = true;

    offsetX =
      e.clientX -
      robotContainer.offsetLeft;

    offsetY =
      e.clientY -
      robotContainer.offsetTop;

    robotContainer.style.cursor =
      "grabbing";
  }
);

document.addEventListener(
  "mousemove",
  (e) => {

    if (!isDragging) return;

    let x =
      e.clientX - offsetX;

    let y =
      e.clientY - offsetY;

    // LIMITS

    const maxX =
      window.innerWidth - 320;

    const maxY =
      window.innerHeight - 320;

    x = Math.max(
      0,
      Math.min(x, maxX)
    );

    y = Math.max(
      0,
      Math.min(y, maxY)
    );

    robotContainer.style.left =
      `${x}px`;

    robotContainer.style.top =
      `${y}px`;

    robotContainer.style.right =
      "auto";

    robotContainer.style.bottom =
      "auto";
  }
);

document.addEventListener(
  "mouseup",
  () => {

    isDragging = false;

    robotContainer.style.cursor =
      "grab";
  }
);

// HOVER WAVE

robotContainer.addEventListener(
  "mouseenter",
  () => {

    playWaveAnimation();
  }
);

// ================= CLOSE CHAT =================

closeChat.addEventListener(
  "click",
  () => {

    // HIDE CHAT

    chatContainer.style.display =
      "none";

    // SHOW ROBOT

    robotContainer.style.display =
      "block";
  }
);