(function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Brochure: require a postal address only when a printed copy is requested
  var brochure = document.forms.brochure;
  var postal = brochure.querySelector(".postal");
  var address = brochure.elements.address;
  brochure.addEventListener("change", function (e) {
    if (e.target.name !== "format") return;
    var needsPost = e.target.value !== "Digital (email)";
    postal.hidden = !needsPost;
    address.required = needsPost;
  });

  var endpoints = window.YISHUV_FORMS || {};
  var messages = {
    brochure: "Thank you! Your brochure request is on its way to us — we'll be in touch soon.",
    join: "Thank you for signing up! Someone from our team will reach out within a week or two."
  };

  function submit(form, data) {
    var endpoint = endpoints[form.name];
    if (endpoint) {
      return fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      });
    }
    // Netlify Forms: post URL-encoded data to the site root
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

      var data = new FormData(form);
      // Combine multi-select checkboxes into a single readable value
      var interests = data.getAll("interests");
      if (interests.length) {
        data.delete("interests");
        data.append("interests", interests.join(", "));
      }

      button.disabled = true;
      status.textContent = "Sending…";

      submit(form, data)
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          form.classList.remove("show-errors");
          if (form === brochure) { postal.hidden = true; address.required = false; }
          status.textContent = messages[form.name];
          status.classList.add("success");
        })
        .catch(function () {
          status.textContent = "Sorry, something went wrong. Please try again, or email us directly.";
          status.classList.add("error");
        })
        .finally(function () {
          button.disabled = false;
        });
    });
  });
})();
