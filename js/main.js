(function () {
  const w = window.WEDDING;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tones = ["lacquer", "silk", "gold", "peony", "jade", "ink"];
  let galleryIndex = 0;
  let toastTimer = 0;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function objectPosition(value) {
    const clean = String(value || "center").trim();
    if (/^center(?:\s+\d{1,3}%)?$/.test(clean)) return clean;
    return "center";
  }

  function safeUrl(url) {
    const value = String(url || "").trim();
    if (/^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(value)) return value;
    if (/^images\/[a-z0-9._/-]+$/i.test(value)) return value;
    return "";
  }

  function couple() {
    return `${w.couple.a} & ${w.couple.b}`;
  }

  function fullAddress() {
    const e = w.event;
    return [e.venue, e.street, e.city, e.region].filter(Boolean).join(", ");
  }

  function initialOf(name) {
    const clean = String(name || "").trim();
    if (!clean) return "·";
    if (clean.includes("&")) {
      return clean
        .split("&")
        .map((part) => part.trim().charAt(0).toUpperCase())
        .filter(Boolean)
        .join("\u2009");
    }
    return clean.charAt(0).toUpperCase();
  }

  function personName(name, chinese, extraClass) {
    const cn = chinese
      ? `<span class="name-cn" lang="zh">${esc(chinese)}</span>`
      : "";
    return `<span class="${extraClass || "name-en"}">${esc(name)}</span>${cn}`;
  }

  function ornament() {
    return `<div class="ornament" aria-hidden="true"><span></span><i></i><span></span></div>`;
  }

  function sectionHead(kicker, title, lead) {
    const eyebrow = kicker ? `<p class="kicker">${esc(kicker)}</p>` : "";
    return `<header class="section-head reveal">
      ${eyebrow}
      <h2 class="section-title">${esc(title)}</h2>
      ${lead ? `<p class="section-lead">${esc(lead)}</p>` : ""}
      ${ornament()}
    </header>`;
  }

  function corners() {
    return `<i class="corner tl" aria-hidden="true"></i>
      <i class="corner tr" aria-hidden="true"></i>
      <i class="corner bl" aria-hidden="true"></i>
      <i class="corner br" aria-hidden="true"></i>`;
  }

  function petals() {
    return `<div class="petals" aria-hidden="true">${"<i></i>".repeat(7)}</div>`;
  }

  function cloud() {
    return `<svg class="cloud-edge" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 90V46C180 18 320 8 480 28C640 48 760 70 960 48C1140 28 1280 16 1440 40V90H0Z"></path>
    </svg>`;
  }

  function mapHref() {
    return `https://maps.google.com/?q=${encodeURIComponent(fullAddress())}`;
  }

  function mapEmbed() {
    const query = fullAddress();
    if (!query) return "";
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=en&z=15&output=embed`;
  }

  function navLinks(className) {
    return w.nav
      .map(
        (item) =>
          `<a class="${className}" href="${esc(item.href)}" data-nav>${esc(item.label)}</a>`
      )
      .join("");
  }

  function renderHeader() {
    return `<header class="site-header" id="header">
      <a class="brand" href="#top" aria-label="${esc(couple())}, home">
        <span class="brand-names">${esc(w.couple.a)} <i>&</i> ${esc(w.couple.b)}</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-action="toggle-nav">
        <span class="sr-only">Menu</span>
        <span class="burger" aria-hidden="true"></span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Sections">
        ${navLinks("nav-link")}
        <a class="nav-rsvp" href="#rsvp">RSVP</a>
      </nav>
    </header>`;
  }

  function renderHero() {
    const e = w.event;
    const heroSrc = safeUrl(w.hero.image);
    const photo = heroSrc
      ? `<img class="hero-photo" src="${esc(heroSrc)}" alt="${esc(w.hero.imageAlt || "")}" />`
      : "";
    const place = [e.venue, e.city].filter(Boolean).join(" · ");
    return `<section class="hero" id="top">
      ${photo}
      <div class="hero-scrim" aria-hidden="true"></div>
      <div class="hero-frame">
        ${corners()}
        <p class="eyebrow"><span>${esc(w.hero.english)}</span></p>
        <p class="families">${esc(w.couple.families)}</p>
        <h1 class="hero-title">
          ${personName(w.couple.a)}
          <i>&</i>
          ${personName(w.couple.b)}
        </h1>
        <span class="foil" aria-hidden="true"></span>
        <p class="hero-date">${esc(e.weekday)}, ${esc(e.dateLine)}</p>
        ${place ? `<p class="hero-place">${esc(place)}</p>` : ""}
        <div class="countdown" id="countdown">
          ${countCell("days", "Days")}
          ${countCell("hours", "Hours")}
          ${countCell("minutes", "Minutes")}
          ${countCell("seconds", "Seconds")}
        </div>
        <p class="arrived" id="arrived" hidden>${esc(w.hero.arrived)}</p>
        <div class="hero-actions">
          <a class="btn btn-gold" href="#invitation">The details</a>
          <a class="btn btn-line" href="#rsvp">Kindly reply</a>
        </div>
        <button class="text-btn" type="button" data-action="add-calendar">Add to calendar</button>
        <a class="scroll-cue" href="#invitation"><span>Details</span><span class="scroll-line" aria-hidden="true"></span></a>
      </div>
      ${cloud()}
    </section>`;
  }

  function countCell(unit, label) {
    return `<div class="count-cell">
      <strong class="count-num" data-unit="${unit}">00</strong>
      <span class="count-label">${label}</span>
    </div>`;
  }

  function placeLines() {
    const e = w.event;
    const lines = [e.venue, e.street, [e.city, e.region].filter(Boolean).join(", ")].filter(Boolean);
    if (!lines.length) return "The place will follow with the invitation.";
    return lines.map((line) => esc(line)).join("<br />");
  }

  function recipientName() {
    const raw = new URLSearchParams(window.location.search).get("recipient");
    return String(raw || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);
  }

  function renderIntro() {
    if (reduce) return "";
    const guest = recipientName();
    const to = guest || "Friends & family";
    return `<div class="intro" id="intro">
      <button class="intro-open" type="button" id="intro-open">
        <span class="intro-stage">
          <span class="intro-envelope">
            <span class="intro-face intro-front">
              <span class="intro-seal" aria-hidden="true">S</span>
              <span class="intro-address">
                <span class="intro-to">To: ${esc(to)}</span>
                <span>From: ${esc(couple())}</span>
              </span>
            </span>
            <span class="intro-face intro-back">
              <span class="intro-v" aria-hidden="true"></span>
              <span class="intro-back-note">${esc(w.hero.english)}</span>
            </span>
          </span>
        </span>
        <span class="intro-prompt">Tap to open</span>
      </button>
    </div>`;
  }

  function renderInvitation() {
    const e = w.event;
    const invite = w.invitation;
    const directions = fullAddress()
      ? `<a class="btn btn-line-dark" href="${mapHref()}" target="_blank" rel="noopener">Directions</a>`
      : "";
    const blessing = invite.blessing
      ? `<p class="invite-blessing">${esc(invite.blessing)}</p>`
      : "";
    return `<section class="section section-invite" id="invitation" tabindex="-1">
      <div class="wrap">
        <article class="invite-card reveal">
          ${ornament()}
          <p class="invite-families">${esc(w.couple.families)}</p>
          <h2 class="invite-names">
            <span class="invite-person">${esc(w.couple.a)}</span>
            <i>&</i>
            <span class="invite-person">${esc(w.couple.b)}</span>
          </h2>
          <p class="invite-request">${esc(invite.requestLead)}<br />${esc(invite.requestTail)}</p>
          <p class="invite-when">${esc(e.dateLong)}<br />${esc(e.yearLong)}<br />${esc(e.timeLong)}</p>
          ${e.eveNote ? `<p class="invite-eve">${esc(e.eveNote)}</p>` : ""}
          <p class="invite-where">${placeLines()}</p>
          ${blessing}
          <p class="invite-follow">${esc(invite.follow)}</p>
        </article>
        <div class="btn-row center">
          <button class="btn btn-lacquer" type="button" data-action="add-calendar">Add to calendar</button>
          ${directions}
        </div>
      </div>
    </section>`;
  }

  function renderStory() {
    const chapters = w.story.chapters
      .map(
        (chapter, index) => `<li class="story-item reveal">
          <span class="story-index">${String(index + 1).padStart(2, "0")}</span>
          <h3>${esc(chapter.title)}</h3>
          <p class="story-when">${esc(chapter.when)}</p>
          <p>${esc(chapter.body)}</p>
        </li>`
      )
      .join("");
    return `<section class="section section-story" id="story">
      <div class="wrap">
        ${sectionHead(w.story.chinese, w.story.title, w.story.lead)}
        <ol class="story-list">${chapters}</ol>
      </div>
    </section>`;
  }

  function renderSchedule() {
    const days = w.schedule.days
      .map((day) => {
        const events = day.events
          .map(
            (event) => `<li class="event">
              <time>${esc(event.time)}</time>
              <div><h4>${esc(event.title)}</h4><p>${esc(event.note)}</p></div>
            </li>`
          )
          .join("");
        return `<article class="day-card reveal">
          ${day.chinese ? `<p class="day-cn">${esc(day.chinese)}</p>` : ""}
          <h3>${esc(day.title)}</h3>
          <p class="day-date">${esc(day.date)}</p>
          <ul class="event-list">${events}</ul>
        </article>`;
      })
      .join("");
    return `<section class="section section-schedule" id="schedule">
      <div class="wrap">
        ${sectionHead(w.schedule.chinese, w.schedule.title, w.schedule.lead)}
        <div class="day-grid">${days}</div>
      </div>
    </section>`;
  }

  function renderTravel() {
    const e = w.event;
    const hotels = w.travel.hotels
      .map((hotel) => {
        const href = safeUrl(hotel.href);
        const action = href
          ? `<a class="text-link" href="${esc(href)}" target="_blank" rel="noopener">Request a room</a>`
          : `<p class="text-link quiet">Details to follow</p>`;
        return `<article class="hotel-card reveal">
          <span class="hotel-kicker">Where to stay</span>
          <h3>${esc(hotel.name)}</h3>
          <p>${esc(hotel.note)}</p>
          <p>${esc(hotel.detail)}</p>
          ${action}
        </article>`;
      })
      .join("");
    const facts = w.travel.facts
      .map(
        (fact) => `<article class="reveal">
          <span class="info-label">${esc(fact.label)}</span>
          <h3>${esc(fact.title)}</h3>
          <p>${esc(fact.note)}</p>
        </article>`
      )
      .join("");
    const address = fullAddress();
    const heading = e.venue || e.city || "Place to follow";
    const addressHtml = address
      ? `<p>${esc(fullAddress())}</p>`
      : `<p>The address will be added here.</p>`;
    const map = address
      ? `<iframe class="venue-map" title="Map of ${esc(fullAddress())}" src="${esc(mapEmbed())}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      : "";
    const actions = address
      ? `<div class="btn-row">
          <a class="btn btn-lacquer" href="${mapHref()}" target="_blank" rel="noopener">Directions</a>
          <button class="btn btn-line-dark" type="button" data-action="copy-address">Copy address</button>
        </div>`
      : "";
    const hotelColumn = hotels ? `<div class="hotel-list">${hotels}</div>` : "";
    return `<section class="section section-travel" id="travel">
      <div class="wrap">
        ${sectionHead(w.travel.chinese, w.travel.title, w.travel.lead)}
        <div class="travel-grid${hotels ? "" : " is-single"}">
          <article class="venue-panel reveal${address ? "" : " no-map"}">
            ${map}
            <div class="venue-copy">
              <span class="hotel-kicker">The gathering</span>
              <h3>${esc(heading)}</h3>
              ${addressHtml}
              <p>${esc(w.travel.blurb)}</p>
              ${actions}
            </div>
          </article>
          ${hotelColumn}
        </div>
        <div class="info-row">${facts}</div>
      </div>
    </section>`;
  }

  function renderRegistry() {
    const gifts = w.registry.gifts
      .map((gift, index) => {
        const href = safeUrl(gift.href);
        const action = href
          ? `<a class="text-link" href="${esc(href)}" target="_blank" rel="noopener">View the wish</a>`
          : `<p class="text-link quiet">Link coming soon</p>`;
        return `<article class="gift-card reveal">
          <span class="gift-index">${String(index + 1).padStart(2, "0")}</span>
          <h3>${esc(gift.title)}</h3>
          <p>${esc(gift.note)}</p>
          ${action}
        </article>`;
      })
      .join("");
    return `<section class="section section-registry" id="registry">
      <div class="wrap">
        ${sectionHead(w.registry.chinese, w.registry.title, w.registry.lead)}
        <div class="gift-grid">${gifts}</div>
      </div>
    </section>`;
  }

  function renderParty() {
    const groups = w.party.groups
      .map((group) => {
        const people = group.people
          .map(
            (person) => `<article class="person reveal">
              <div class="monogram" aria-hidden="true">${esc(initialOf(person.name))}</div>
              <h3>${esc(person.name)}</h3>
              <span class="person-role">${esc(person.role)}</span>
              <p>${esc(person.note)}</p>
            </article>`
          )
          .join("");
        return `<div class="party-group">
          <h3>${esc(group.title)}</h3>
          <div class="party-grid">${people}</div>
        </div>`;
      })
      .join("");
    const body = groups || (w.party.note ? `<p class="party-note reveal">${esc(w.party.note)}</p>` : "");
    return `<section class="section section-party" id="party">
      <div class="wrap">
        ${sectionHead(w.party.chinese, w.party.title, w.party.lead)}
        ${body}
      </div>
    </section>`;
  }

  function renderGallery() {
    const scenes = w.gallery.scenes
      .map((scene, index) => {
        const tone = tones.includes(scene.tone) ? scene.tone : "lacquer";
        const src = safeUrl(scene.image);
        const alt = scene.alt || scene.caption || "";
        const photo = src
          ? `<img src="${esc(src)}" alt="${esc(alt)}" style="object-position:${objectPosition(scene.focus)}" />`
          : "";
        const mark = scene.chinese
          ? `<span class="tile-mark">${esc(scene.chinese)}</span>`
          : "";
        return `<button class="tile tone-${tone}${src ? " has-photo" : ""}" type="button" data-action="gallery-open" data-index="${index}">
          ${photo}
          ${mark}
          <span class="tile-caption">${esc(scene.caption)}</span>
        </button>`;
      })
      .join("");
    return `<section class="section section-gallery" id="gallery">
      <div class="wrap">
        ${sectionHead(w.gallery.chinese, w.gallery.title, w.gallery.lead)}
        <div class="gallery-grid">${scenes}</div>
      </div>
    </section>`;
  }

  function renderFaq() {
    const items = w.faq.items
      .map(
        (item, index) => `<div class="faq-item">
          <button type="button" id="faq-btn-${index}" aria-expanded="false" aria-controls="faq-${index}" data-action="faq">
            <span>${esc(item.q)}</span>
            <span class="mark" aria-hidden="true"></span>
          </button>
          <div class="answer" id="faq-${index}" role="region" aria-labelledby="faq-btn-${index}" hidden>
            <p>${esc(item.a)}</p>
          </div>
        </div>`
      )
      .join("");
    return `<section class="section section-faq" id="faq">
      <div class="wrap">
        ${sectionHead(w.faq.chinese, w.faq.title, w.faq.lead)}
        <div class="faq-list">${items}</div>
      </div>
    </section>`;
  }

  function mealFields(selected) {
    return w.rsvp.meals
      .map((meal) => {
        const checked = selected === meal.id ? "checked" : "";
        return `<label class="meal">
          <input type="radio" name="meal" value="${esc(meal.id)}" ${checked} />
          <span><strong>${esc(meal.label)}</strong><small>${esc(meal.note)}</small></span>
        </label>`;
      })
      .join("");
  }

  function formHtml(data) {
    const accept = data.attendance === "accept" ? "checked" : "";
    const decline = data.attendance === "decline" ? "checked" : "";
    const paper = data.invite === "paper" ? "checked" : "";
    const virtual = data.invite === "virtual" ? "checked" : "";
    return `<form class="form${paper ? " is-paper" : ""}" id="rsvp-form" novalidate>
      <h3 class="card-title">Your reply</h3>
      <div class="form-row">
        <div class="field">
          <label class="field-label" for="guest-name">Your name</label>
          <input id="guest-name" name="name" autocomplete="name" value="${esc(data.name || "")}" />
          <p class="field-error" id="name-error"></p>
        </div>
        <div class="field">
          <label class="field-label" for="guest-email">Email</label>
          <input id="guest-email" name="email" type="email" inputmode="email" autocomplete="email" value="${esc(data.email || "")}" />
          <p class="field-error" id="email-error"></p>
        </div>
      </div>
      <fieldset>
        <legend class="field-legend">Will you be there?</legend>
        <div class="choice-grid">
          <label class="choice">
            <input type="radio" name="attendance" value="accept" ${accept} />
            <span><strong>${esc(w.rsvp.accept)}</strong></span>
          </label>
          <label class="choice">
            <input type="radio" name="attendance" value="decline" ${decline} />
            <span><strong>${esc(w.rsvp.decline)}</strong></span>
          </label>
        </div>
        <p class="field-error" id="attendance-error"></p>
      </fieldset>
      <fieldset>
        <legend class="field-legend">The invitation</legend>
        <div class="choice-grid">
          <label class="choice">
            <input type="radio" name="invite" value="paper" ${paper} />
            <span><strong>Paper</strong></span>
          </label>
          <label class="choice">
            <input type="radio" name="invite" value="virtual" ${virtual} />
            <span><strong>Virtual</strong></span>
          </label>
        </div>
        <p class="field-error" id="invite-error"></p>
      </fieldset>
      <div class="only-paper">
        <div class="field">
          <label class="field-label" for="guest-address">Mailing address</label>
          <div class="address-combo">
            <input id="guest-address" name="address" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="address-suggestions" placeholder="Street, city, state, ZIP" value="${esc(data.address || "")}" />
            <ul class="address-suggestions" id="address-suggestions" role="listbox" hidden></ul>
          </div>
          <p class="field-error" id="address-error"></p>
        </div>
      </div>
      <div class="field">
        <label class="field-label" for="note">A note for the couple</label>
        <textarea id="note" name="note">${esc(data.note || "")}</textarea>
      </div>
      <button class="btn btn-lacquer btn-block" type="submit">Send reply</button>
    </form>`;
  }

  function summaryRow(label, value) {
    if (!value) return "";
    return `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`;
  }

  function mealLabel(id) {
    const meal = w.rsvp.meals.find((item) => item.id === id);
    return meal ? meal.label : "";
  }

  function inviteLabel(value) {
    if (value === "paper") return "Paper invitation";
    if (value === "virtual") return "Virtual invitation";
    return "";
  }

  function googleFormUrl(url) {
    try {
      const parsed = new URL(String(url || "").trim());
      if (parsed.protocol !== "https:" || parsed.hostname !== "docs.google.com") return "";
      if (!/^\/forms\/(?:u\/\d+\/)?d\/e\/[^/]+\/formResponse$/.test(parsed.pathname)) return "";
      return parsed.toString();
    } catch {
      return "";
    }
  }

  function entryName(value) {
    const match = String(value || "").trim().match(/^(?:entry\.)?(\d{6,})$/);
    return match ? `entry.${match[1]}` : "";
  }

  function googleFormTarget() {
    const form = w.rsvp.googleForm || {};
    const action = googleFormUrl(form.action);
    const entries = form.entries || {};
    const ready = action && Object.values(entries).some((id) => entryName(id));
    return ready ? { action, entries } : null;
  }

  function googlePayload(data) {
    const coming = data.attendance === "accept";
    return {
      name: data.name,
      email: data.email,
      attendance: coming ? w.rsvp.accept : w.rsvp.decline,
      address: data.invite === "paper" ? data.address : "",
      invite: data.invite === "paper" ? "Paper" : data.invite === "virtual" ? "Virtual" : "",
      note: data.note,
    };
  }

  function submitGoogleForm(data) {
    const target = googleFormTarget();
    if (!target) return false;
    const payload = googlePayload(data);
    const form = document.createElement("form");
    form.method = "POST";
    form.action = target.action;
    form.acceptCharset = "UTF-8";
    form.target = "google-form-frame";
    form.hidden = true;
    Object.entries(target.entries).forEach(([key, id]) => {
      const name = entryName(id);
      const value = payload[key] || "";
      if (!name || !value) return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });
    let frame = document.getElementById("google-form-frame");
    if (!frame) {
      frame = document.createElement("iframe");
      frame.id = "google-form-frame";
      frame.name = "google-form-frame";
      frame.hidden = true;
      frame.setAttribute("aria-hidden", "true");
      document.body.appendChild(frame);
    }
    document.body.appendChild(form);
    form.submit();
    form.remove();
    return true;
  }

  function successHtml(data) {
    const coming = data.attendance === "accept";
    const sent = Boolean(data.sentToForm);
    const rows = [
      summaryRow("Reply", coming ? "Joyfully attending" : "Unable to attend"),
      summaryRow("Invitation", inviteLabel(data.invite)),
      data.invite === "paper" ? summaryRow("Mailing address", data.address) : "",
      summaryRow("Note", data.note),
    ].join("");
    const kept = sent
      ? "Sent. A copy is also kept on this device."
      : "Kept on this device. Copy it if you would like to send the same note along.";
    return `<div class="reply-success">
      ${ornament()}
      <h3 id="thanks-title" tabindex="-1">Thank you, ${esc(data.name)}</h3>
      <p class="kept">${kept}</p>
      <dl class="reply-summary">${rows}</dl>
      <div class="btn-row center">
        <button class="btn btn-lacquer" type="button" data-action="copy-reply">Copy reply</button>
        <button class="btn btn-line-dark" type="button" data-action="edit-reply">Edit reply</button>
      </div>
    </div>`;
  }

  function renderRsvp(existing) {
    return `<section class="section section-rsvp" id="rsvp">
      <div class="wrap rsvp-layout">
        <div class="rsvp-intro">
          ${sectionHead(w.rsvp.chinese, w.rsvp.title, w.rsvp.lead)}
        </div>
        <div class="reply-card" id="rsvp-panel">
          ${existing ? successHtml(existing) : formHtml({})}
        </div>
      </div>
    </section>`;
  }

  function renderFooter() {
    const e = w.event;
    const place = [e.city].filter(Boolean).join("");
    const fine = [e.venue, e.street, [e.city, e.region].filter(Boolean).join(", ")].filter(Boolean).join(" · ");
    return `<footer class="site-footer">
      <p class="footer-names">${esc(couple())}</p>
      <p class="footer-date">${esc(e.dateLine)}${place ? ` · ${esc(place)}` : ""}</p>
      <p class="footer-blessing">${esc(w.footer.blessing)}</p>
      <nav class="footer-nav" aria-label="Footer">
        ${navLinks("footer-link")}
        <a href="#rsvp">RSVP</a>
      </nav>
      <button class="text-btn hashtag" type="button" data-action="copy-hashtag">${esc(e.hashtag)}</button>
      ${fine ? `<p class="fine-print">${esc(fine)}</p>` : ""}
    </footer>`;
  }

  function renderLightbox() {
    return `<dialog class="lightbox" id="lightbox" aria-label="Scene">
      <button class="lightbox-close" type="button" data-action="lightbox-close" aria-label="Close">×</button>
      <button class="lightbox-nav prev" type="button" data-action="lightbox-prev" aria-label="Previous scene">‹</button>
      <figure id="lightbox-figure"></figure>
      <button class="lightbox-nav next" type="button" data-action="lightbox-next" aria-label="Next scene">›</button>
    </dialog>`;
  }

  function render() {
    const existing = loadReply();
    $("#app").innerHTML = [
      renderIntro(),
      renderHeader(),
      `<main>`,
      renderHero(),
      renderInvitation(),
      renderRsvp(existing),
      // renderStory(),
      // renderSchedule(),
      renderTravel(),
      // renderRegistry(),
      // renderParty(),
      // renderGallery(),
      // renderFaq(),
      `</main>`,
      renderFooter(),
      renderLightbox(),
    ].join("");

    const title = `${couple()} · ${w.event.dateLine}`;
    const place = [w.event.venue, w.event.city].filter(Boolean).join(", ");
    const description = place
      ? `Save the date for the wedding of ${w.couple.a} and ${w.couple.b}, ${w.event.dateLine}, ${place}.`
      : `Save the date for the wedding of ${w.couple.a} and ${w.couple.b}, ${w.event.dateLine}.`;
    document.title = title;
    const meta = $("#meta-desc");
    const ogTitle = $("#og-title");
    const ogDesc = $("#og-desc");
    if (meta) meta.setAttribute("content", description);
    if (ogTitle) ogTitle.setAttribute("content", title);
    if (ogDesc) ogDesc.setAttribute("content", description);
  }

  function loadReply() {
    try {
      const raw = localStorage.getItem("wedding-rsvp");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveReply(data) {
    try {
      localStorage.setItem("wedding-rsvp", JSON.stringify(data));
    } catch {
      /* This browser may be blocking storage. The reply still shows. */
    }
  }

  function toast(message) {
    const node = $("#toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-on");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.classList.remove("is-on"), 2400);
  }

  async function copyText(text, message) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    toast(message);
  }

  function replyText(data) {
    const coming = data.attendance === "accept";
    const lines = [
      `${couple()} — wedding reply`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Reply: ${coming ? "Joyfully attending" : "Unable to attend"}`,
    ];
    if (data.invite) lines.push(`Invitation: ${inviteLabel(data.invite)}`);
    if (data.invite === "paper" && data.address) lines.push(`Mailing address: ${data.address}`);
    if (data.note) lines.push(`Note: ${data.note}`);
    return lines.join("\n");
  }

  function downloadIcs() {
    const e = w.event;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding//Save the Date//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${e.icsStart}-${initialOf(w.couple.a)}${initialOf(w.couple.b)}@wedding`,
      `DTSTAMP:${stamp}`,
      e.allDay ? `DTSTART;VALUE=DATE:${e.icsStart}` : `DTSTART:${e.icsStart}`,
      e.allDay ? `DTEND;VALUE=DATE:${e.icsEnd}` : `DTEND:${e.icsEnd}`,
      `SUMMARY:${couple()} — Wedding`,
      ...(fullAddress() ? [`LOCATION:${fullAddress()}`] : []),
      "DESCRIPTION:Save the date. A celebration of marriage.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const slug = `${w.couple.a}-${w.couple.b}`.toLowerCase().replace(/[^a-z0-9]+/gi, "-");
    link.href = url;
    link.download = `${slug}-wedding.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("Calendar file downloaded");
  }

  function setUnit(name, value) {
    const el = $(`[data-unit="${name}"]`);
    if (!el) return;
    const next = String(value).padStart(2, "0");
    if (el.textContent === next) return;
    el.textContent = next;
    if (reduce) return;
    el.classList.remove("tick");
    void el.offsetWidth;
    el.classList.add("tick");
  }

  function tick() {
    const target = new Date(w.event.iso).getTime();
    const wrap = $("#countdown");
    const arrived = $("#arrived");
    if (!wrap || Number.isNaN(target)) return;
    const diff = target - Date.now();
    if (diff <= 0) {
      wrap.hidden = true;
      if (arrived) arrived.hidden = false;
      return;
    }
    const total = Math.floor(diff / 1000);
    setUnit("days", Math.floor(total / 86400));
    setUnit("hours", Math.floor((total % 86400) / 3600));
    setUnit("minutes", Math.floor((total % 3600) / 60));
    setUnit("seconds", total % 60);
  }

  function toggleNav(force, restore) {
    const nav = $("#site-nav");
    const btn = $(".nav-toggle");
    const header = $("#header");
    const main = $("main");
    const footer = $(".site-footer");
    if (!nav || !btn) return;
    const open = typeof force === "boolean" ? force : !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    btn.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-lock", open);
    if (main) main.inert = open;
    if (footer) footer.inert = open;
    if (!open && restore) btn.focus();
  }

  let introTimer = 0;

  function closeIntro(immediate) {
    const intro = $("#intro");
    if (!intro || intro.classList.contains("is-done")) return;
    window.clearTimeout(introTimer);
    if (immediate) {
      intro.classList.add("is-done");
      intro.hidden = true;
      return;
    }
    if (intro.classList.contains("is-opening")) return;
    intro.classList.add("is-opening");
    window.setTimeout(() => {
      intro.classList.add("is-done");
      window.setTimeout(() => {
        intro.hidden = true;
      }, 900);
    }, 2200);
  }

  function bindIntro() {
    const intro = $("#intro");
    const open = $("#intro-open");
    if (!intro || !open) return;
    open.addEventListener("click", () => closeIntro(false));
    introTimer = window.setTimeout(() => closeIntro(false), 4500);
    $(".skip")?.addEventListener("click", () => closeIntro(true));
  }

  function onScroll() {
    const header = $("#header");
    if (header) header.classList.toggle("is-solid", window.scrollY > 24);
    const links = $$("[data-nav]");
    let current = "";
    links.forEach((link) => {
      const section = $(link.getAttribute("href"));
      if (!section) return;
      if (section.getBoundingClientRect().top <= 140) current = link.getAttribute("href");
    });
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === current);
    });
  }

  function watchReveal() {
    const nodes = $$(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );
    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
        node.classList.add("is-in");
      } else {
        observer.observe(node);
      }
    });
  }

  function showForm(data) {
    const panel = $("#rsvp-panel");
    if (!panel) return;
    panel.innerHTML = formHtml(data || {});
    $("#guest-name")?.focus();
  }

  function showSuccess(data) {
    const panel = $("#rsvp-panel");
    if (!panel) return;
    panel.innerHTML = successHtml(data);
    $("#thanks-title")?.focus();
  }

  function clearErrors(form) {
    $$(".field-error", form).forEach((node) => {
      node.textContent = "";
    });
    $$("[aria-invalid]", form).forEach((node) => node.removeAttribute("aria-invalid"));
  }

  function setError(input, errorId, message) {
    const error = document.getElementById(errorId);
    if (error) error.textContent = message;
    if (input) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", errorId);
    }
  }

  let addressSession = "";
  let addressTimer = 0;
  let addressRequest = null;
  let addressIndex = -1;

  function addressProxy() {
    const url = String(w.rsvp.addressProxy || "").trim();
    return /^https:\/\/[a-z0-9.-]+\.supabase\.co\/functions\/v1\/[a-z0-9-]+$/i.test(url) ? url : "";
  }

  function looksLikeMailingAddress(value) {
    const text = String(value || "").trim();
    const hasZip = /\b\d{5}(?:-\d{4})?\b/.test(text);
    const hasStreetNumber = /\d/.test(text);
    const hasPlaceName = /[A-Za-z]{2,}/.test(text);
    return text.length >= 10 && hasZip && hasStreetNumber && hasPlaceName;
  }

  function hideAddressSuggestions() {
    const list = document.getElementById("address-suggestions");
    const input = document.getElementById("guest-address");
    if (list) {
      list.hidden = true;
      list.innerHTML = "";
    }
    if (input) input.setAttribute("aria-expanded", "false");
    addressIndex = -1;
  }

  function hasZip(value) {
    return /\b\d{5}(?:-\d{4})?\b/.test(String(value || ""));
  }

  async function chooseAddress(value) {
    const input = document.getElementById("guest-address");
    if (!input || !value) return;
    hideAddressSuggestions();
    input.value = value;
    const error = document.getElementById("address-error");
    if (error) error.textContent = "";
    input.removeAttribute("aria-invalid");
    const checked = await confirmMailingAddress(value);
    if (!input.isConnected || input.value.trim() !== value.trim()) return;
    if (checked.ok && hasZip(checked.address)) {
      input.value = checked.address;
      return;
    }
    setError(input, "address-error", checked.ok ? "Please include a ZIP code." : checked.message);
  }

  function markAddressOption(buttons) {
    buttons.forEach((button, index) => {
      const active = index === addressIndex;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-selected", "true");
      else button.removeAttribute("aria-selected");
    });
  }

  function handleAddressKeys(event) {
    const list = document.getElementById("address-suggestions");
    const buttons = list && !list.hidden ? [...list.querySelectorAll("[data-action='address-pick']")] : [];
    if (!buttons.length) return false;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      addressIndex = Math.min(buttons.length - 1, addressIndex + 1);
      markAddressOption(buttons);
      return true;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      addressIndex = Math.max(0, addressIndex - 1);
      markAddressOption(buttons);
      return true;
    }
    if (event.key === "Enter" && addressIndex >= 0) {
      event.preventDefault();
      chooseAddress(buttons[addressIndex].dataset.address || "");
      return true;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      hideAddressSuggestions();
      return true;
    }
    return false;
  }

  function showAddressSuggestions(input, items) {
    const list = document.getElementById("address-suggestions");
    if (!list) return;
    if (!items.length) {
      hideAddressSuggestions();
      return;
    }
    addressIndex = -1;
    const options = items
      .map(
        (item) =>
          `<li role="option"><button type="button" data-action="address-pick" data-address="${esc(item)}">${esc(item)}</button></li>`
      )
      .join("");
    list.innerHTML = `${options}<li class="address-credit"><img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png" alt="Powered by Google" width="120" height="14" /></li>`;
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  async function fetchAddressSuggestions(input, query) {
    const proxy = addressProxy();
    if (!proxy) return;
    if (!addressSession) addressSession = crypto.randomUUID();
    addressRequest?.abort();
    const controller = new AbortController();
    addressRequest = controller;
    try {
      const response = await fetch(proxy, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "suggest", input: query, sessionToken: addressSession }),
      });
      if (input.value.trim() !== query) return;
      if (!response.ok) {
        hideAddressSuggestions();
        return;
      }
      const payload = await response.json();
      showAddressSuggestions(input, (payload.suggestions || []).filter(Boolean));
    } catch (error) {
      if (error.name !== "AbortError") hideAddressSuggestions();
    }
  }

  function onAddressInput(input) {
    window.clearTimeout(addressTimer);
    const query = input.value.trim();
    if (!addressProxy() || query.length < 3) {
      hideAddressSuggestions();
      return;
    }
    addressTimer = window.setTimeout(() => fetchAddressSuggestions(input, query), 250);
  }

  async function confirmMailingAddress(address) {
    const proxy = addressProxy();
    if (!proxy) {
      return looksLikeMailingAddress(address)
        ? { ok: true, address }
        : { ok: false, message: "Please include a street, city, and ZIP code." };
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(proxy, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate",
          address,
          sessionToken: addressSession || crypto.randomUUID(),
        }),
      });
      addressSession = "";
      if (!response.ok) {
        return { ok: false, message: "We couldn't check that address. Please try again in a moment." };
      }
      const payload = await response.json();
      if (payload.ok && hasZip(payload.address)) return { ok: true, address: payload.address };
      if (payload.ok) return { ok: false, message: "Please include a ZIP code." };
      return {
        ok: false,
        message: payload.message || "The post office doesn't recognize that address. Please choose one from the list.",
      };
    } catch {
      return { ok: false, message: "We couldn't check that address. Please try again in a moment." };
    } finally {
      window.clearTimeout(timer);
    }
  }

  function readForm(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    data.name = String(data.name || "").trim();
    data.email = String(data.email || "").trim();
    data.note = String(data.note || "").trim();
    data.address = String(data.address || "").trim();
    data.invite = data.invite === "paper" || data.invite === "virtual" ? data.invite : "";
    return data;
  }

  async function submitForm(form) {
    clearErrors(form);
    const data = readForm(form);
    let invalid = null;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (!data.name) {
      setError($("#guest-name", form), "name-error", "Please write your name.");
      invalid = invalid || $("#guest-name", form);
    }
    if (!emailOk) {
      setError($("#guest-email", form), "email-error", "Please add an email, so the note has a return path.");
      invalid = invalid || $("#guest-email", form);
    }
    if (data.attendance !== "accept" && data.attendance !== "decline") {
      setError(null, "attendance-error", "Please tell us if you can come.");
      invalid = invalid || $("input[name='attendance']", form);
    }
    if (data.invite !== "paper" && data.invite !== "virtual") {
      setError(null, "invite-error", "Please choose a paper or virtual invitation.");
      invalid = invalid || $("input[name='invite']", form);
    }
    if (data.invite === "paper" && !data.address) {
      setError($("#guest-address", form), "address-error", "Please add the address for the invitation.");
      invalid = invalid || $("#guest-address", form);
    }
    if (invalid) {
      invalid.focus();
      return;
    }
    if (data.invite === "paper") {
      const button = form.querySelector("[type='submit']");
      const label = button?.textContent || "Send reply";
      if (button && addressProxy()) {
        button.disabled = true;
        button.textContent = "Checking address…";
      }
      const checked = await confirmMailingAddress(data.address);
      if (!form.isConnected) return;
      if (button) {
        button.disabled = false;
        button.textContent = label;
      }
      if (!checked.ok) {
        setError($("#guest-address", form), "address-error", checked.message);
        $("#guest-address", form)?.focus();
        return;
      }
      data.address = checked.address || data.address;
      const addressInput = $("#guest-address", form);
      if (addressInput) addressInput.value = data.address;
    }
    if (data.invite !== "paper") data.address = "";
    data.sentToForm = submitGoogleForm(data);
    saveReply(data);
    showSuccess(data);
  }

  function stepGuests(direction) {
    const input = $("#guests-input");
    const output = $("#guest-count");
    if (!input || !output) return;
    const max = Number(w.rsvp.maxGuests) || 8;
    const next = Math.min(max, Math.max(1, Number(input.value || 1) + direction));
    input.value = String(next);
    output.textContent = String(next);
  }

  function paintLightbox() {
    const scene = w.gallery.scenes[galleryIndex];
    const figure = $("#lightbox-figure");
    if (!scene || !figure) return;
    const tone = tones.includes(scene.tone) ? scene.tone : "lacquer";
    const src = safeUrl(scene.image);
    figure.className = `tone-${tone}${src ? " has-photo" : ""}`;
    const alt = scene.alt || scene.caption || "";
    const captionMark = scene.chinese ? `<span>${esc(scene.chinese)}</span>` : "";
    figure.innerHTML = `${src ? `<img src="${esc(src)}" alt="${esc(alt)}" style="object-position:${objectPosition(scene.focus)}" />` : ""}<figcaption>${captionMark}${esc(scene.caption)}</figcaption>`;
  }

  function openGallery(index) {
    galleryIndex = index;
    paintLightbox();
    const dialog = $("#lightbox");
    if (dialog && !dialog.open) dialog.showModal();
  }

  function stepGallery(direction) {
    const count = w.gallery.scenes.length;
    galleryIndex = (galleryIndex + direction + count) % count;
    paintLightbox();
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-action]");
      if (trigger) {
        const action = trigger.dataset.action;
        if (action === "toggle-nav") toggleNav(undefined, true);
        if (action === "add-calendar") downloadIcs();
        if (action === "copy-address") copyText(fullAddress(), "Address copied");
        if (action === "copy-hashtag") copyText(w.event.hashtag, "Hashtag copied");
        if (action === "copy-reply") {
          const saved = loadReply();
          if (saved) copyText(replyText(saved), "Reply copied");
        }
        if (action === "edit-reply") showForm(loadReply() || {});
        if (action === "step") stepGuests(Number(trigger.dataset.step));
        if (action === "faq") {
          const item = trigger.closest(".faq-item");
          const answer = item && $("#" + trigger.getAttribute("aria-controls"));
          const open = trigger.getAttribute("aria-expanded") !== "true";
          trigger.setAttribute("aria-expanded", String(open));
          if (item) item.classList.toggle("is-open", open);
          if (answer) answer.hidden = !open;
        }
        if (action === "address-pick") chooseAddress(trigger.dataset.address || "");
        if (action === "gallery-open") openGallery(Number(trigger.dataset.index));
        if (action === "lightbox-close") $("#lightbox")?.close();
        if (action === "lightbox-prev") stepGallery(-1);
        if (action === "lightbox-next") stepGallery(1);
      }
      if (event.target.closest(".site-nav a")) toggleNav(false);
    });

    document.addEventListener("change", (event) => {
      if (event.target.name === "invite") {
        const form = event.target.closest("form");
        if (form) form.classList.toggle("is-paper", event.target.value === "paper" && event.target.checked);
      }
    });

    document.addEventListener("input", (event) => {
      if (event.target.id === "guest-address") onAddressInput(event.target);
    });

    document.addEventListener("pointerdown", (event) => {
      const pick = event.target.closest("[data-action='address-pick']");
      if (pick) {
        event.preventDefault();
        chooseAddress(pick.dataset.address || "");
        return;
      }
      if (!event.target.closest(".address-combo")) hideAddressSuggestions();
    });

    document.addEventListener("submit", (event) => {
      const form = event.target.closest("#rsvp-form");
      if (!form) return;
      event.preventDefault();
      submitForm(form);
    });

    document.addEventListener("keydown", (event) => {
      if (event.target?.id === "guest-address" && handleAddressKeys(event)) return;
      const dialog = $("#lightbox");
      if (dialog?.open) {
        if (event.key === "ArrowRight") stepGallery(1);
        if (event.key === "ArrowLeft") stepGallery(-1);
        return;
      }
      if (event.key === "Escape" && $("#site-nav")?.classList.contains("is-open")) {
        event.preventDefault();
        toggleNav(false, true);
      }
    });

    const lightbox = $("#lightbox");
    lightbox?.addEventListener("click", (event) => {
      if (event.target.id === "lightbox") event.target.close();
    });
    lightbox?.addEventListener("toggle", () => {
      document.body.classList.toggle("lightbox-open", lightbox.open);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    const desktopNav = window.matchMedia("(min-width: 1201px)");
    window.addEventListener("resize", () => {
      if (desktopNav.matches) toggleNav(false);
    });
    bindIntro();
  }

  render();
  bind();
  tick();
  window.setInterval(tick, 1000);
  onScroll();
  watchReveal();
})();
