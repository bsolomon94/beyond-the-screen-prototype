(function () {
  var currentScreen = 0;
  var selectedPhoto = null;
  var installTimer = null;

  // Single shared source of truth for concertgoer profiles — used by the
  // Screen 6 teaser carousel, the Screen 8 full-reveal carousel, and the
  // Screen 8a Send-a-Like overlay, so the prompt/answers can't drift out of sync.
  var PROFILES = [
    { name: "Ryan", img: "images/profile-ryan.png", answer: "Last Nite, it's a jam" },
    { name: "Mark", img: "images/profile-mark.png", answer: "I'm here for the openers" },
    { name: "Kiran", img: "images/profile-kiran.png", answer: "TV on the Radio, supremely underrated" },
    { name: "John", img: "images/profile-john.png", answer: "The vibes" }
  ];
  var PROMPT_LABEL = "What are you most excited for tonight?";

  function buildCarousel(containerId, profiles, opts) {
    opts = opts || {};
    var container = document.getElementById(containerId);
    if (!container || container.dataset.built) return;
    container.dataset.built = "true";
    profiles.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "profile-card" + (opts.blurred ? " blurred" : "");

      var img = document.createElement("img");
      img.className = "profile-card-photo";
      img.src = p.img;
      img.alt = p.name;
      card.appendChild(img);

      var scrim = document.createElement("div");
      scrim.className = "profile-card-scrim";
      card.appendChild(scrim);

      var name = document.createElement("div");
      name.className = "profile-card-name";
      name.textContent = p.name;
      card.appendChild(name);

      var promptBox = document.createElement("div");
      promptBox.className = "profile-card-promptbox";
      promptBox.innerHTML =
        '<div class="label">' + opts.promptLabel + '</div>' +
        '<div class="answer">' + (p.answer || opts.promptAnswer) + '</div>';
      card.appendChild(promptBox);

      if (opts.showHeart) {
        var heart = document.createElement("img");
        heart.className = "profile-card-heart";
        heart.src = "images/card-heart-button.svg";
        heart.alt = "Like";
        if (opts.heartOpensSendLike) {
          heart.style.cursor = "pointer";
          heart.addEventListener("click", function (e) {
            e.stopPropagation();
            window.openSendLike(p);
          });
        }
        card.appendChild(heart);
      }

      container.appendChild(card);
    });
  }

  function attachCarouselTapToCenter(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener("click", function (e) {
      var card = e.target.closest(".profile-card");
      if (!card) return;
      var containerRect = container.getBoundingClientRect();
      var cardRect = card.getBoundingClientRect();
      var containerCenter = containerRect.left + containerRect.width / 2;
      var cardCenter = cardRect.left + cardRect.width / 2;
      // Only animate if this card isn't already the focused/centered one —
      // avoids hijacking taps on the card the user is already looking at
      // (e.g. the heart button) with an unnecessary re-scroll.
      if (Math.abs(cardCenter - containerCenter) > 20) {
        card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });
  }

  // Screens are identified by their data-screen attribute as a plain string
  // (e.g. "0", "1a", "search", "sendlike") — never parsed as a number, so
  // lettered sub-screens like "1a" can never collide with numeric screen "1".
  function showScreen(id) {
    var idStr = String(id);
    document.querySelectorAll(".screen").forEach(function (el) {
      el.classList.toggle("active", el.dataset.screen === idStr);
    });
    currentScreen = id;
    window.scrollTo(0, 0);
  }

  window.goToScreen = function (id) {
    var idStr = String(id);
    if (!document.querySelector('.screen[data-screen="' + idStr + '"]')) return;
    showScreen(id);
  };

  // Generic back is only used by the plain-numbered screens (2-9), where
  // "previous screen in the sequence" is simply n-1. Screens 0, 1, 1a, 1b
  // have their own explicit back targets wired directly in the HTML.
  window.goBack = function () {
    if (typeof currentScreen === "number" && currentScreen > 0) {
      showScreen(currentScreen - 1);
    }
  };

  window.restartDemo = function () {
    showScreen(0);
  };

  window.openPhotoSearch = function () {
    document.querySelectorAll(".screen").forEach(function (el) {
      el.classList.remove("active");
    });
    var searchScreen = document.querySelector('[data-screen="search"]');
    if (searchScreen) searchScreen.classList.add("active");
  };

  window.selectSearchedPhoto = function () {
    selectedPhoto = "images/beth-headshot.png";
    var img = document.getElementById("uploadPreview");
    var card = document.querySelector(".upload-card");
    if (img) {
      img.src = selectedPhoto;
      img.classList.remove("hidden");
    }
    if (card) card.classList.add("has-photo");
    showScreen(4);
  };

  window.openSendLike = function (profile) {
    var nameEl = document.getElementById("sendlikeName");
    if (nameEl) nameEl.textContent = profile.name;
    var bgPhoto = document.getElementById("sendlikeBgPhoto");
    if (bgPhoto) bgPhoto.src = profile.img;
    var labelEl = document.getElementById("sendlikeLabel");
    if (labelEl) labelEl.textContent = PROMPT_LABEL;
    var answerEl = document.getElementById("sendlikeAnswer");
    if (answerEl) answerEl.textContent = profile.answer;
    document.querySelectorAll(".screen").forEach(function (el) {
      el.classList.remove("active");
    });
    var sendLikeScreen = document.querySelector('[data-screen="sendlike"]');
    if (sendLikeScreen) sendLikeScreen.classList.add("active");
  };

  window.closeSendLike = function () {
    showScreen(8);
  };

  // Screen 1b "GET" -> Screen 1c (installing, ring animates, then auto-advances to Screen 2).
  window.goToInstalling = function () {
    showScreen("1c");
    var ring = document.getElementById("installingRingProgress");
    if (ring) {
      var circumference = 2 * Math.PI * 44;
      ring.style.transition = "none";
      ring.style.strokeDasharray = String(circumference);
      ring.style.strokeDashoffset = String(circumference);
      // Force reflow so the "none" transition + full offset apply before animating.
      void ring.getBoundingClientRect();
      ring.style.transition = "stroke-dashoffset 2s linear";
      ring.style.strokeDashoffset = "0";
    }
    clearTimeout(installTimer);
    installTimer = setTimeout(function () {
      goToScreen(2);
    }, 2200);
  };

  document.addEventListener("DOMContentLoaded", function () {
    buildCarousel("carousel-6", PROFILES, {
      blurred: true,
      promptLabel: PROMPT_LABEL
    });
    buildCarousel("carousel-8", PROFILES, {
      blurred: false,
      promptLabel: PROMPT_LABEL,
      showHeart: true,
      heartOpensSendLike: true
    });
    attachCarouselTapToCenter("carousel-6");
    attachCarouselTapToCenter("carousel-8");
    showScreen(0);
  });
})();
