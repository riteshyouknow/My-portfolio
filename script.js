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
