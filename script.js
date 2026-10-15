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

  // Garin progress squares (numbers come from the site content)
  var garin = document.querySelector(".garin");
  var committed = +garin.dataset.committed;
  var goal = +garin.dataset.goal;
  var grid = garin.querySelector(".garin-grid");
  for (var i = 0; i < goal; i++) {
    var cell = document.createElement("i");
    if (i < committed) cell.className = "on";
    grid.appendChild(cell);
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

  // Sign-up form: Netlify Forms (posts URL-encoded data to the site root)
  function submit(data) {
    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString()
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("form.form"), function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type=submit]");

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

      submit(new FormData(form))
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
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
