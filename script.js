const books = [
  {
    title: "This Machine Has Meat In It",
    label: "Comedy horror / obair",
    className: "cover-machine",
    coverImage: "assets/tmhmit-front-cover.png",
    description:
      "A game about killing the eldritch nightmare that is your job. Office procedureal, occult rituals, and a mess of deplorable corporate jargon.",
    tags: ["Released", "A5", "Comedy horror", "Corporate Handbook"]
  },
  {
    title: "Clock Watchers",
    label: "Temporal espionage / am",
    className: "cover-clock",
    coverImage: "assets/clock-watchers-cover.png",
    description:
      "A guidebook for ordinary people pressganged into interdimensional temporal espionage. Congratulations (insincere)",
    tags: ["In development", "A5", "Sci-Fi", "Time travel"]
  },
  {
    title: "Threads",
    label: "Post-campaign play / cuimhni",
    className: "cover-threads",
    coverImage: "assets/threads-cover.jpg",
    description:
      "A reflective game for returning to retired characters and old campaigns, tracing the long ripples they left across people, places, and worlds.",
    tags: ["Released", "Solo / group", "Gameplay Tool"]
  },
  {
    title: "GLYPH",
    label: "Occult artbook / comharthai",
    className: "cover-glyph",
    coverImage: "assets/glyph-cover.jpg",
    description:
      "An artbook-grimoire for drawing personal magical symbols: vessels, lines of power, investitures, an introspective look at your own personal magical paradigm.",
    tags: ["Released", "Introspective", "Occult", "Art"]
  },
  {
    title: "JAZZMANJI",
    label: "Cassette jam / cluiche cairti",
    className: "cover-jazzmanji",
    coverImage: "assets/jazzmanji-cover.jpg",
    description:
      "A fast-paced dice-and-card cassette crawl where your band burns through tracks, and tries to escape the accursed tape before the Jazzman gets the final solo.",
    tags: ["Released", "Cards / Dice", "Jazz"]
  }
];

const bookGrid = document.querySelector("#bookGrid");
const signupForm = document.querySelector(".signup-form");
const logoLinks = document.querySelectorAll(".logo-link");
const heroGlyph = document.querySelector(".hero-glyph");
const scrollFloatItems = document.querySelectorAll(".scroll-float");
const bookPageLinks = {
  "This Machine Has Meat In It": "tmhmit.html",
  "Clock Watchers": "clock-watchers.html",
  Threads: "threads.html"
};

if (bookGrid) {
  bookGrid.innerHTML = books
    .map(
      (book) => `
        <article class="book-card" tabindex="0">
          ${
            book.coverImage
              ? `<img class="book-cover book-cover-image" src="${book.coverImage}" alt="">`
              : `<div class="book-cover ${book.className}" aria-hidden="true">
                  <span>${book.label}</span>
                  <strong>${book.title}</strong>
                </div>`
          }
          <div>
            <h3>${book.title}</h3>
            <p>${book.description}</p>
            <div class="book-meta">
              ${book.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
          </div>
          ${
            bookPageLinks[book.title]
              ? `<a class="book-card-link" href="${bookPageLinks[book.title]}" aria-label="Open ${book.title} page"></a>`
              : ""
          }
        </article>
      `
    )
    .join("");
}

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const smallScreenMotion = window.matchMedia("(max-width: 680px)");

if (!prefersReducedMotion && heroGlyph) {
  const blinkDuration = 420;
  const minBlinkDelay = 2800;
  const maxBlinkDelay = 9200;
  let blinkTimer;
  let blinkResetTimer;

  const scheduleBlink = () => {
    window.clearTimeout(blinkTimer);
    window.clearTimeout(blinkResetTimer);

    const delay =
      minBlinkDelay + Math.random() * (maxBlinkDelay - minBlinkDelay);

    blinkTimer = window.setTimeout(() => {
      heroGlyph.classList.add("is-blinking");

      blinkResetTimer = window.setTimeout(() => {
        heroGlyph.classList.remove("is-blinking");
        scheduleBlink();
      }, blinkDuration);
    }, delay);
  };

  scheduleBlink();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(blinkResetTimer);
      heroGlyph.classList.remove("is-blinking");
      return;
    }

    scheduleBlink();
  });
}

if (!prefersReducedMotion && scrollFloatItems.length) {
  let scrollTicking = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const clearScrollFloats = () => {
    scrollFloatItems.forEach((item) => {
      item.style.removeProperty("--float-x");
      item.style.removeProperty("--float-y");
    });
  };

  const updateScrollFloats = () => {
    if (smallScreenMotion.matches) {
      clearScrollFloats();
      scrollTicking = false;
      return;
    }

    const viewportCenter = window.innerHeight / 2;

    scrollFloatItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = itemCenter - viewportCenter;
      const depth = Number(item.dataset.depth || 0);
      const drift = Number(item.dataset.drift || 0);
      const y = clamp(distance * depth, -34, 34);
      const x = clamp(distance * drift, -12, 12);

      item.style.setProperty("--float-y", `${y.toFixed(1)}px`);
      item.style.setProperty("--float-x", `${x.toFixed(1)}px`);
    });

    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateScrollFloats);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", updateScrollFloats);
  if (smallScreenMotion.addEventListener) {
    smallScreenMotion.addEventListener("change", updateScrollFloats);
  } else if (smallScreenMotion.addListener) {
    smallScreenMotion.addListener(updateScrollFloats);
  }
  updateScrollFloats();
}


if (canHover && !prefersReducedMotion) {
  logoLinks.forEach((logo) => {
    const resetLogo = () => logo.classList.remove("is-logo-hovered");

    logo.addEventListener("pointerenter", () => {
      logo.classList.add("is-logo-hovered");
    });

    logo.addEventListener("pointerleave", resetLogo);
    logo.addEventListener("blur", resetLogo);
  });

  document.querySelectorAll(".book-card").forEach((card) => {
    const resetTilt = () => {
      card.classList.remove("is-hovered");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };

    card.addEventListener("pointerenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--tilt-x", `${(-y * 2.2).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 2.2).toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", resetTilt);
    card.addEventListener("blur", resetTilt, true);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(signupForm).get("email");
    const note = signupForm.querySelector(".form-note");

    note.textContent = email
      ? "Thanks. This demo form is ready to connect to your newsletter service."
      : "Add an email address to test the signup flow.";
  });
}
