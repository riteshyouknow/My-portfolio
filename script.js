// ============================
// GSAP ANIMATIONS
// ============================

gsap.registerPlugin(ScrollTrigger);

// Name Roll Animation
gsap.to(".nameroll h1", {
  x: "-110%",
  scrollTrigger: {
    trigger: ".page2",
    start: "top 90%",
    end: "top -150%",
    scrub: 1,
  },
});

// Intro Text Animation
gsap.from(".intro h1", {
  y: 40,
  opacity: 0,
  stagger: 0.14,
  scrollTrigger: {
    trigger: ".intro h1",
    start: "top 80%",
  },
});

// Skills Icons Animation
gsap.from(".development-elem img", {
  opacity: 0,
  y: 20,
  stagger: {
    amount: 1,
  },
  scrollTrigger: {
    trigger: ".development-elem",
    start: "top 80%",
  },
});

// Design Icons Animation
gsap.from(".designelem img", {
  opacity: 0,
  y: 20,
  stagger: {
    amount: 1,
  },
  scrollTrigger: {
    trigger: ".designelem",
    start: "top 80%",
  },
});



// ============================
// LENIS SMOOTH SCROLL
// ============================

const lenis = new Lenis({
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

lenis.on("scroll", ScrollTrigger.update);



// ============================
// SCROLL ARROW
// ============================

const arrow = document.getElementById("scrollArrow");

// Rotate Arrow on Scroll
window.addEventListener("scroll", () => {

  if (window.scrollY > 100) {
    arrow.style.transform = "rotate(90deg)";
  } else {
    arrow.style.transform = "rotate(0deg)";
  }

});

// Scroll To Top
arrow.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

});



// ============================
// PAGE RELOAD TO TOP
// ============================

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

});



// ============================
// CHAT SYSTEM
// ============================

const chatContainer =
  document.getElementById("chat-container");

const closeChat =
  document.getElementById("close-chat");

const sendBtn =
  document.getElementById("send-btn");

const chatInput =
  document.getElementById("chat-input");

const chatMessages =
  document.getElementById("chat-messages");


// Prevent Website Scroll While Chat Scrolls
chatMessages.addEventListener(
  "wheel",
  (e) => {
    e.stopPropagation();
  },
  { passive: true }
);


// Hide Chat Initially
chatContainer.style.display = "none";


// Close Chat
closeChat.addEventListener("click", () => {

  chatContainer.style.display = "none";

  robotContainer.style.display = "block";

});



// ============================
// SEND MESSAGE FUNCTION
// ============================

async function sendMessage() {

  const message = chatInput.value.trim();

  if (message === "") return;

  // User Message
  const userMessage =
    document.createElement("div");

  userMessage.classList.add("user-message");

  userMessage.innerHTML = message;

  chatMessages.appendChild(userMessage);

  chatInput.value = "";

  scrollChat();


  // Typing Loader
  const botMessage =
    document.createElement("div");

  botMessage.classList.add("bot-message");

  botMessage.innerHTML = `
  
    <div class="typing">
      <span></span>
      <span></span>
      <span></span>
    </div>

  `;

  chatMessages.appendChild(botMessage);

  scrollChat();


  // AI Reply
  const aiReply =
    await getBotReply(message);

  botMessage.innerHTML = aiReply;

  scrollChat();

}



// ============================
// AUTO SCROLL CHAT
// ============================

function scrollChat() {

  chatMessages.scrollTop =
    chatMessages.scrollHeight;

}



// ============================
// BUTTON EVENTS
// ============================

// Send Button
sendBtn.addEventListener(
  "click",
  sendMessage
);


// Enter Key Send
chatInput.addEventListener(
  "keypress",
  (e) => {

    if (e.key === "Enter") {

      e.preventDefault();

      sendMessage();

    }

  }
);



// ============================
// BACKEND API CALL
// ============================

async function getBotReply(message) {

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/chat",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: message,
        }),
      }
    );

    const data = await response.json();

    return data.reply;

  } catch (error) {

    return "Server not connected ⚠️";

  }

}



// ============================
// THREE JS ROBOT
// ============================

const robotContainer =
  document.getElementById("robot-container");

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


// Renderer
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



// ============================
// LIGHTS
// ============================

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



// ============================
// LOAD MODEL
// ============================

let mixer;
let action;
let isAnimating = false;

const loader =
  new THREE.GLTFLoader();

loader.load(
  "./models/Waving.glb",

  function (gltf) {

    const model = gltf.scene;

    model.scale.set(0.5, 0.5, 0.5);

    model.position.set(0, -1.5, 0);

    scene.add(model);


    // Animation
    mixer =
      new THREE.AnimationMixer(model);

    action =
      mixer.clipAction(
        gltf.animations[0]
      );

    action.setLoop(
      THREE.LoopOnce
    );

    action.clampWhenFinished = true;

    playWaveAnimation();

  }
);



// ============================
// PLAY ANIMATION
// ============================

function playWaveAnimation() {

  if (!action || isAnimating)
    return;

  isAnimating = true;

  action.reset();

  action.play();

  mixer.addEventListener(
    "finished",
    () => {

      isAnimating = false;

    },
    { once: true }
  );

}



// ============================
// ANIMATION LOOP
// ============================

const clock =
  new THREE.Clock();

function animate() {

  requestAnimationFrame(animate);

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



// ============================
// OPEN CHAT
// ============================

robotContainer.addEventListener(
  "click",
  () => {

    robotContainer.style.display =
      "none";

    chatContainer.style.display =
      "flex";

  }
);



// ============================
// ROBOT DRAG SYSTEM
// ============================

let isDragging = false;

let offsetX = 0;
let offsetY = 0;


// Mouse Down
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


// Mouse Move
document.addEventListener(
  "mousemove",
  (e) => {

    if (!isDragging) return;

    let x =
      e.clientX - offsetX;

    let y =
      e.clientY - offsetY;

    // Screen Limits
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


// Mouse Up
document.addEventListener(
  "mouseup",
  () => {

    isDragging = false;

    robotContainer.style.cursor =
      "grab";

  }
);



// ============================
// HOVER ANIMATION
// ============================

robotContainer.addEventListener(
  "mouseenter",
  () => {

    playWaveAnimation();

  }
);


// ============================
// QUICK BUTTONS WORKING
// ============================

const quickButtons =
  document.querySelectorAll(
    ".quick-buttons button"
  );

quickButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      // Button text input me daalo
      chatInput.value =
        button.innerText;

      // Auto send
      sendMessage();

    }
  );

});