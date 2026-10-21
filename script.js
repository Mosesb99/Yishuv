(function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Nav: solid background once scrolled past the top
  var nav = document.getElementById("nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.add("scrolled");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Garin progress squares (numbers come from the site content, then the live sheet)
  var garin = document.querySelector(".garin");
  var goal = +garin.dataset.goal;
  var grid = garin.querySelector(".garin-grid");
  function renderGarin(committed) {
    grid.innerHTML = "";
    for (var i = 0; i < Math.max(goal, committed); i++) {
      var cell = document.createElement("i");
      if (i < committed) cell.className = "on";
      grid.appendChild(cell);
    }
  }
  renderGarin(+garin.dataset.committed);

  // Counters: tick through every number from 0 up to the real figure
  // (about 1.5 seconds each) as soon as they're on screen
  var counts = document.querySelectorAll(".count");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animating = "IntersectionObserver" in window && !reduceMotion;
  function countUp(el) {
    var n = 0;
    el.dataset.state = "running";
    var timer = setInterval(function () {
      var target = +el.dataset.to; // re-read so live numbers can arrive mid-count
      if (n < target) n += 1;
      el.textContent = n.toLocaleString("en-US");
      if (n >= target) {
        clearInterval(timer);
        el.dataset.state = "done";
        el.textContent = target.toLocaleString("en-US");
      }
    }, Math.min(60, Math.max(8, 1500 / Math.max(+el.dataset.to, 1))));
  }

  // Live numbers from the Google Sheet (falls back to the admin numbers if unavailable)
  if (window.fetch) {
    fetch("/api/counts")
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (live) {
        if (!live || !live.families) return;
        Array.prototype.forEach.call(document.querySelectorAll(".count[data-source]"), function (el) {
          var value = live[el.dataset.source];
          if (typeof value !== "number") return;
          el.dataset.to = value;
          if (!animating || el.dataset.state === "done") el.textContent = value.toLocaleString("en-US");
        });
        Array.prototype.forEach.call(document.querySelectorAll("[data-live=families]"), function (el) {
          el.textContent = live.families;
        });
        renderGarin(live.families);
        var asof = document.querySelector(".counters-asof");
        if (asof && live.updated) {
          asof.textContent = "Updated " + new Date(live.updated).toLocaleDateString("en-US",
            { month: "long", day: "numeric", year: "numeric" });
        }
      })
      .catch(function () {});
  }

  if (animating) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          countIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    Array.prototype.forEach.call(counts, function (el) {
      el.textContent = "0";
      countIo.observe(el);
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal, .compare");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add("in"); });
  }

  // Sign-up form: posts to /api/join (functions/api/join.js), which saves it to the Google Sheet
  function submit(form) {
    return fetch(form.action, { method: "POST", body: new FormData(form) }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) {
        if (!res.ok || !body.ok) throw new Error(res.status);
      });
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("form.form"), function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type=submit]");
    var stamp = function () { if (form.elements.t) form.elements.t.value = Date.now(); };
    stamp(); // when the form was shown; the server ignores forms sent back within seconds (bots)

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";

      if (!form.checkValidity()) {
        form.classList.add("show-errors");
        var firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        status.textContent = "Please fill in the highlighted fields.";
        status.classList.add("error");
        return;
      }

      button.disabled = true;
      status.textContent = "Sending…";

      submit(form)
        .then(function () {
          form.reset();
          stamp();
          form.classList.remove("show-errors");
          status.textContent = form.dataset.success;
          status.classList.add("success");
        })
        .catch(function () {
          status.textContent = form.dataset.error;
          status.classList.add("error");
        })
        .finally(function () {
          button.disabled = false;
        });
    });
  });
})();
