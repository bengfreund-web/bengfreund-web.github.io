/* Renders the portfolio from content/site.json and content/projects.json.
   Simple, white, read-in-seconds: each project is title + who it's for + one
   paragraph + a link on the left, and a small click-through screenshot
   carousel on the right. Adding a project only needs a JSON entry + images. */

(function () {
  "use strict";

  // Original pixel dimensions, so images can reserve space (no layout shift).
  var DIMS = {
    "assets/projects/myru-registration/01-overview-ai-query.png": [2356, 1543],
    "assets/projects/myru-registration/02-statewide-growth-map.png": [2356, 1961],
    "assets/projects/myru-registration/03-team-new-vs-returning.png": [2356, 925],
    "assets/projects/myru-registration/04-secure-sign-in.png": [1236, 862],
    "assets/projects/varsity-rugby/01-hero.png": [2400, 1376],
    "assets/projects/varsity-rugby/02-cost-model.png": [2212, 1523],
    "assets/projects/varsity-rugby/03-statewide-foundation-map.png": [2400, 1058],
    "assets/projects/usa-rugby-analytics/01-season-overview.png": [2300, 1840],
    "assets/projects/usa-rugby-analytics/02-possession-with-data-note.png": [2300, 1653],
    "assets/projects/try-sport/01-impact-tracker.png": [2270, 1961],
    "assets/projects/try-sport/02-homepage-hero.png": [2400, 1234],
    "assets/projects/try-sport/03-teacher-testimonial.png": [2270, 1236],
    "assets/projects/mis-website/01-home.png": [2880, 1800],
    "assets/projects/mis-website/02-what-we-do-html.png": [2880, 1800],
    "assets/projects/mis-website/03-programs-html.png": [2880, 1800],
    "assets/projects/email-automation/01-email-desktop.png": [1520, 2200],
    "assets/projects/email-automation/02-email-mobile.png": [1170, 3600],
    "assets/projects/email-automation/03-code.png": [2160, 14518],
    "assets/projects/social/yt-gUOQj7AJZYA.jpg": [1280, 720],
    "assets/projects/social/ig-gnc-DZ8H_8fDC6H.jpg": [640, 360],
    "assets/projects/social/ig-gnc-DZi0Ad9htVm.jpg": [640, 360],
    "assets/projects/social/ig-mi-DXadTO0D90z.jpg": [640, 639],
    "assets/projects/social/ig-mi-DXk1r2HGv7N.jpg": [640, 639]
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function imgBase(src) {
    return src.replace("assets/projects/", "assets/img/").replace(/\.png$/, "");
  }

  function buildImg(media, eager, sizes) {
    var base = imgBase(media.src);
    var img = el("img");
    img.src = base + "-800.webp";
    img.srcset = base + "-800.webp 800w, " + base + "-1600.webp 1600w";
    img.sizes = sizes || "340px";
    img.alt = media.alt || "";
    img.loading = eager ? "eager" : "lazy";
    img.decoding = "async";
    var d = DIMS[media.src];
    if (d) { img.width = d[0]; img.height = d[1]; }
    return img;
  }

  /* ---------------- Header ---------------- */
  function renderHeader(site) {
    var host = document.getElementById("header-inner");
    host.innerHTML = "";
    host.appendChild(el("h1", "name", site.name));
    host.appendChild(el("p", "tagline", site.tagline));
    host.appendChild(contactActions(site));
  }

  function contactActions(site) {
    var actions = el("div", "actions");
    var l = site.links;
    actions.appendChild(actionLink("Resume", l.resume, false, "btn btn-solid"));
    actions.appendChild(actionLink("LinkedIn", l.linkedin, true, "btn"));
    actions.appendChild(actionLink("GitHub", l.github, true, "btn"));
    actions.appendChild(actionLink("Email", "mailto:" + l.email, false, "btn"));
    return actions;
  }

  function actionLink(label, href, external, cls) {
    var a = el("a", cls, label);
    a.href = href;
    if (external) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  /* ---------------- Projects ---------------- */
  function renderProjects(projects) {
    var host = document.getElementById("projects");
    host.innerHTML = "";
    host.appendChild(el("h2", "section-head", "Highlighted projects"));
    projects.forEach(function (p, i) { host.appendChild(renderProject(p, i)); });
  }

  /* ---------------- Websites ---------------- */
  function renderWebsites(site) {
    var host = document.getElementById("websites");
    var list = site.websites || [];
    if (!host || !list.length) return;
    host.innerHTML = "";
    host.appendChild(el("h2", "section-head", "Websites"));
    var grid = el("div", "web-grid");
    list.forEach(function (w, i) {
      var a = el("a", "web-card");
      a.href = w.url; a.target = "_blank"; a.rel = "noopener";
      var thumb = el("div", "web-thumb");
      thumb.appendChild(buildImg({ src: w.img, alt: w.title + " homepage" }, i < 3, "(max-width: 720px) 92vw, 320px"));
      a.appendChild(thumb);
      var meta = el("div", "web-meta");
      var head = el("div", "web-head");
      head.appendChild(el("span", "web-title", w.title));
      if (w.note) head.appendChild(el("span", "mw-tag", w.note));
      meta.appendChild(head);
      if (w.owner) meta.appendChild(el("p", "web-owner", w.owner));
      a.appendChild(meta);
      grid.appendChild(a);
    });
    host.appendChild(grid);
  }

  function renderProject(p, i) {
    var isFirst = i === 0;
    var sec = el("section", "project");
    sec.id = "project-" + p.id;

    // Left: title, who it's for, a paragraph about what it is.
    var text = el("div", "project-text");
    text.appendChild(el("h2", "project-title", p.title));
    text.appendChild(el("p", "project-org", p.org));
    text.appendChild(el("p", "project-desc", p.headline));
    // Optimized second paragraph (situation + impact, no repetition with the
    // headline) for the projects that define one.
    if (p.summary) text.appendChild(el("p", "project-desc", p.summary));
    if (p.note) text.appendChild(el("p", "build-note", p.note));

    // Right: small click-through screenshot carousel.
    var media = el("div", "project-media");
    media.appendChild(renderCarousel(p.media, isFirst));

    // Bottom: a link (or a plain note when there is no public site).
    var link = el("div", "project-link");
    if (p.liveUrl) {
      var a = el("a", "visit", "Visit live site");
      a.href = p.liveUrl; a.target = "_blank"; a.rel = "noopener";
      link.appendChild(a);
    } else if (p.liveNote) {
      link.appendChild(el("p", "live-note", p.liveNote));
    }

    sec.appendChild(text);
    sec.appendChild(media);
    sec.appendChild(link);
    return sec;
  }

  function renderCarousel(mediaList, eager) {
    var gallery = mediaList.map(function (m) {
      return { full: imgBase(m.src) + "-1600.webp", alt: m.alt, caption: m.caption };
    });

    var car = el("div", "carousel");
    car.setAttribute("role", "group");
    car.setAttribute("aria-roledescription", "carousel");
    car.setAttribute("aria-label", "Project screenshots");

    var frame = el("div", "carousel-frame");
    var slides = [];
    mediaList.forEach(function (m, i) {
      var slide = el("figure", "carousel-slide" + (i === 0 ? " is-active" : ""));
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", (i + 1) + " of " + mediaList.length);
      var btn = el("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Open larger: " + (m.caption || m.alt));
      var slideImg = buildImg(m, eager && i === 0, "340px");
      if (m.fit === "top") slideImg.classList.add("fit-top");
      btn.appendChild(slideImg);
      btn.addEventListener("click", function () { openLightbox(gallery, index, btn); });
      slide.appendChild(btn);
      frame.appendChild(slide);
      slides.push(slide);
    });
    car.appendChild(frame);

    var cap = el("p", "carousel-cap", mediaList[0].caption || "");
    var index = 0;
    var dots = [];

    function goTo(i) {
      index = (i + mediaList.length) % mediaList.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-active", k === index); });
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === index); });
      cap.textContent = mediaList[index].caption || "";
    }

    if (mediaList.length > 1) {
      var controls = el("div", "carousel-controls");
      var prev = el("button", "car-nav car-prev", "‹");
      prev.type = "button"; prev.setAttribute("aria-label", "Previous screenshot");
      prev.addEventListener("click", function () { goTo(index - 1); });
      var next = el("button", "car-nav car-next", "›");
      next.type = "button"; next.setAttribute("aria-label", "Next screenshot");
      next.addEventListener("click", function () { goTo(index + 1); });

      var dotWrap = el("div", "carousel-dots");
      mediaList.forEach(function (m, i) {
        var d = el("button", "dot" + (i === 0 ? " is-active" : ""));
        d.type = "button";
        d.setAttribute("aria-label", "Go to screenshot " + (i + 1));
        d.addEventListener("click", function () { goTo(i); });
        dotWrap.appendChild(d);
        dots.push(d);
      });

      controls.appendChild(prev);
      controls.appendChild(dotWrap);
      controls.appendChild(next);
      car.appendChild(controls);

      car.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { goTo(index - 1); }
        else if (e.key === "ArrowRight") { goTo(index + 1); }
      });
    }

    car.appendChild(cap);
    return car;
  }

  /* ---------------- Content & social ---------------- */
  // Social images are .jpg sources with WebP in assets/img/social/ at fixed widths.
  function socialImg(src, widths, sizes, alt, eager) {
    var name = src.replace("assets/projects/social/", "").replace(/\.jpg$/, "");
    var img = el("img");
    var set = widths.map(function (w) { return "assets/img/social/" + name + "-" + w + ".webp " + w + "w"; });
    img.src = "assets/img/social/" + name + "-" + widths[0] + ".webp";
    img.srcset = set.join(", ");
    img.sizes = sizes;
    img.alt = alt || "";
    img.loading = eager ? "eager" : "lazy";
    img.decoding = "async";
    var d = DIMS[src];
    if (d) { img.width = d[0]; img.height = d[1]; }
    return img;
  }

  function withHandles(text, map) {
    // Replace {key} tokens with linked handles. map: {key:{handle,url}}
    var frag = document.createDocumentFragment();
    var re = /\{(\w+)\}/g, last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var info = map[m[1]];
      if (info) {
        var a = el("a", "cs-handle", info.handle);
        a.href = info.url; a.target = "_blank"; a.rel = "noopener";
        frag.appendChild(a);
      } else {
        frag.appendChild(document.createTextNode(m[0]));
      }
      last = re.lastIndex;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  }

  function renderContentSocial(site) {
    var host = document.getElementById("content-social");
    var cs = site.contentSocial;
    if (!host || !cs) return;
    host.innerHTML = "";
    host.appendChild(el("h2", "cs-title", "Videos"));
    if (cs.intro) host.appendChild(el("p", "cs-intro", cs.intro));
    if (cs.campaign) host.appendChild(el("p", "cs-campaign", cs.campaign));

    // Stats
    if (cs.stats && cs.stats.length) {
      var statsWrap = el("div", "cs-stats");
      cs.stats.forEach(function (s) {
        var stat = el("div", "cs-stat");
        stat.appendChild(el("span", "cs-stat-value", s.value));
        stat.appendChild(el("span", "cs-stat-label", s.label));
        statsWrap.appendChild(stat);
      });
      host.appendChild(statsWrap);
      if (cs.statNote) {
        var note = el("p", "cs-note");
        note.appendChild(withHandles(cs.statNote, { ig: { handle: cs.instagramHandle, url: cs.instagram } }));
        host.appendChild(note);
      }
    }

    // Highlight video (links to YouTube, no third-party embed)
    if (cs.video) {
      var v = cs.video;
      var va = el("a", "cs-video");
      va.href = v.url; va.target = "_blank"; va.rel = "noopener";
      va.setAttribute("aria-label", "Watch on YouTube: " + v.title);
      var frame = el("div", "cs-video-frame");
      frame.appendChild(socialImg(v.img, [800, 1280], "(max-width: 760px) 92vw, 680px", v.title));
      frame.appendChild(el("span", "cs-play", ""));
      va.appendChild(frame);
      host.appendChild(va);
      var vcap = el("p", "cs-video-cap");
      vcap.appendChild(el("span", "cs-video-title", v.title));
      var chan = el("span", "cs-video-chan");
      chan.appendChild(document.createTextNode(" " + v.channel + (v.channelMeta ? " (" + v.channelMeta + ")" : "")));
      vcap.appendChild(chan);
      host.appendChild(vcap);
    }

    // Example posts
    if (cs.posts && cs.posts.length) {
      var strip = el("div", "cs-posts");
      cs.posts.forEach(function (p) {
        var a = el("a", "cs-post");
        a.href = p.url; a.target = "_blank"; a.rel = "noopener";
        a.setAttribute("aria-label", "View Instagram post: " + (p.alt || ""));
        a.appendChild(socialImg(p.img, [640], "(max-width: 720px) 44vw, 240px", p.alt));
        strip.appendChild(a);
      });
      host.appendChild(strip);
      if (cs.postsNote) {
        var pnote = el("p", "cs-note");
        pnote.appendChild(withHandles(cs.postsNote, {
          gnc: { handle: cs.instagramHandle, url: cs.instagram },
          mi: { handle: cs.miHandle, url: cs.miInstagram }
        }));
        host.appendChild(pnote);
      }
    }
  }

  /* ---------------- Design ---------------- */
  function renderDesign(site) {
    var host = document.getElementById("design");
    var d = site.design;
    if (!host || !d || !d.items || !d.items.length) return;
    host.innerHTML = "";
    host.appendChild(el("h2", "cs-title", "Design"));
    if (d.intro) host.appendChild(el("p", "cs-intro", d.intro));

    var gallery = d.items.map(function (it) {
      var name = it.img.replace("assets/projects/", "assets/img/").replace(/\.\w+$/, "");
      return { full: name + "-lg.webp", alt: it.caption || "", caption: it.caption || "" };
    });

    var grid = el("div", "design-grid");
    d.items.forEach(function (it, i) {
      var name = it.img.replace("assets/projects/", "assets/img/").replace(/\.\w+$/, "");
      var btn = el("button", "design-item");
      btn.type = "button";
      btn.setAttribute("aria-label", "Open design: " + (it.caption || ""));
      var img = el("img");
      img.src = name + "-lg.webp";
      img.alt = it.caption || "";
      img.loading = "lazy";
      img.decoding = "async";
      btn.appendChild(img);
      btn.addEventListener("click", function () { openLightbox(gallery, i, btn); });
      grid.appendChild(btn);
    });
    host.appendChild(grid);
  }

  /* ---------------- More work ---------------- */
  function renderMoreWork(site) {
    var host = document.getElementById("more-work");
    if (!host) return;
    var list = site.moreWork || [];
    if (!list.length) return;
    host.innerHTML = "";
    host.appendChild(el("h2", "more-work-title", "More work"));
    var grid = el("div", "mw-grid");
    list.forEach(function (w) {
      var a = el("a", "mw-item");
      a.href = w.url;
      a.target = "_blank";
      a.rel = "noopener";
      var head = el("div", "mw-head");
      head.appendChild(el("span", "mw-title", w.title));
      if (w.note) head.appendChild(el("span", "mw-tag", w.note));
      a.appendChild(head);
      if (w.blurb) a.appendChild(el("p", "mw-blurb", w.blurb));
      grid.appendChild(a);
    });
    host.appendChild(grid);
  }

  /* ---------------- Footer ---------------- */
  function renderFooter(site) {
    var host = document.getElementById("site-footer");
    var inner = el("div", "wrap footer-inner");
    inner.appendChild(contactActions(site));
    inner.appendChild(el("p", "footer-line", site.footer));
    host.appendChild(inner);
  }

  /* ---------------- Lightbox ---------------- */
  var lb = { root: null, img: null, cap: null, prev: null, next: null, close: null, items: [], index: 0, trigger: null };

  function initLightbox() {
    lb.root = document.getElementById("lightbox");
    lb.img = document.getElementById("lb-img");
    lb.cap = document.getElementById("lb-caption");
    lb.prev = document.getElementById("lb-prev");
    lb.next = document.getElementById("lb-next");
    lb.close = document.getElementById("lb-close");

    lb.close.addEventListener("click", closeLightbox);
    lb.prev.addEventListener("click", function () { step(-1); });
    lb.next.addEventListener("click", function () { step(1); });
    lb.root.addEventListener("click", function (e) { if (e.target === lb.root) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (lb.root.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "Tab") trapTab(e);
    });
  }

  function openLightbox(items, index, trigger) {
    lb.items = items; lb.index = index; lb.trigger = trigger;
    show();
    lb.root.hidden = false;
    document.body.style.overflow = "hidden";
    lb.close.focus();
  }

  function show() {
    var it = lb.items[lb.index];
    lb.img.src = it.full;
    lb.img.alt = it.alt || "";
    lb.cap.textContent = it.caption || "";
    var single = lb.items.length < 2;
    lb.prev.style.display = single ? "none" : "";
    lb.next.style.display = single ? "none" : "";
  }

  function step(delta) {
    if (lb.items.length < 2) return;
    lb.index = (lb.index + delta + lb.items.length) % lb.items.length;
    show();
  }

  function closeLightbox() {
    lb.root.hidden = true;
    document.body.style.overflow = "";
    if (lb.trigger && lb.trigger.focus) lb.trigger.focus();
  }

  function trapTab(e) {
    var focusable = [lb.close, lb.prev, lb.next].filter(function (n) { return n.style.display !== "none"; });
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    initLightbox();
    Promise.all([
      fetch("content/site.json").then(function (r) { return r.json(); }),
      fetch("content/projects.json").then(function (r) { return r.json(); })
    ]).then(function (data) {
      var site = data[0], projects = data[1];
      renderHeader(site);
      renderProjects(projects);
      renderWebsites(site);
      renderContentSocial(site);
      renderDesign(site);
      renderFooter(site);
      if (location.hash) {
        var t = document.getElementById(location.hash.slice(1));
        if (t) t.scrollIntoView();
      }
    }).catch(function (err) {
      var host = document.getElementById("projects");
      host.textContent = "Content failed to load. See the resume: ";
      var a = el("a", "btn btn-solid", "Download resume");
      a.href = "assets/resume/Benjamin-Freund-Resume.pdf";
      host.appendChild(a);
      console.error(err);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
