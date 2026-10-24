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
        <a class="scroll-cue" href="#invitation"><span>The day</span><span class="scroll-line" aria-hidden="true"></span></a>
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
          <p class="invite-where">${placeLines()}</p>
          ${blessing}
          <p class="invite-follow">${esc(invite.follow)}</p>
        </article>
        <ul class="fact-grid">
          <li class="fact reveal"><span>${esc(w.when.label)}</span><strong>${esc(w.when.title)}</strong><em>${esc(w.when.note)}</em></li>
          <li class="fact reveal"><span>${esc(w.where.label)}</span><strong>${esc(w.where.title)}</strong><em>${esc(w.where.note)}</em></li>
          <li class="fact reveal"><span>${esc(w.attire.label)}</span><strong>${esc(w.attire.title)}</strong><em>${esc(w.attire.note)}</em></li>
        </ul>
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
    const addressHtml = address
      ? `<p>${[e.street, [e.city, e.region].filter(Boolean).join(", ")].filter(Boolean).map((line) => esc(line)).join("<br />")}</p>`
      : `<p>The address will be added here.</p>`;
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
            ${address ? `<div class="map-art" aria-hidden="true"><span class="pin"></span></div>` : ""}
            <div class="venue-copy">
              <span class="hotel-kicker">The gathering</span>
              <h3>${esc(e.venue || "Place to follow")}</h3>
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
    const plusYes = String(data.guests) === "2" ? "checked" : "";
    const plusNo = String(data.guests) === "1" ? "checked" : "";
    return `<form class="form${accept ? " is-accepting" : ""}" id="rsvp-form" novalidate>
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
      <div class="only-accepting" id="accepting-fields">
        <fieldset>
          <legend class="field-legend">A plus one?</legend>
          <div class="choice-grid">
            <label class="choice">
              <input type="radio" name="plusOne" value="no" ${plusNo} />
              <span><strong>Just me</strong></span>
            </label>
            <label class="choice">
              <input type="radio" name="plusOne" value="yes" ${plusYes} />
              <span><strong>I'll bring someone</strong></span>
            </label>
          </div>
          <p class="field-error" id="plus-error"></p>
        </fieldset>
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

  function partyLine(guests) {
    const count = Number(guests);
    if (count === 2) return "You and a plus one";
    if (count === 1) return "Just you";
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
      guests: coming ? String(data.guests || "") : "",
      guestNames: coming ? data.guestNames : "",
      meal: coming ? mealLabel(data.meal) : "",
      song: coming ? data.song : "",
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
      coming ? summaryRow("Headcount", partyLine(data.guests)) : "",
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
          <p class="deadline">${esc(w.rsvp.deadline)}</p>
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
    const fine = [e.venue, e.street, e.city].filter(Boolean).join(" · ");
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
      renderHeader(),
      `<main>`,
      renderHero(),
      renderInvitation(),
      // renderStory(),
      renderSchedule(),
      renderTravel(),
      // renderRegistry(),
      renderParty(),
      renderGallery(),
      renderFaq(),
      renderRsvp(existing),
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
    if (coming) lines.push(`Headcount: ${data.guests}`);
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

  function readForm(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    data.name = String(data.name || "").trim();
    data.email = String(data.email || "").trim();
    data.note = String(data.note || "").trim();
    data.plusOne = data.plusOne === "yes" || data.plusOne === "no" ? data.plusOne : "";
    data.guests = data.plusOne === "yes" ? "2" : data.plusOne === "no" ? "1" : "";
    return data;
  }

  function submitForm(form) {
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
    if (data.attendance === "accept" && data.plusOne !== "yes" && data.plusOne !== "no") {
      setError(null, "plus-error", "Please tell us if you are bringing someone.");
      invalid = invalid || $("input[name='plusOne']", form);
    }
    if (invalid) {
      invalid.focus();
      return;
    }
    if (data.attendance !== "accept") data.guests = "";
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
        if (action === "gallery-open") openGallery(Number(trigger.dataset.index));
        if (action === "lightbox-close") $("#lightbox")?.close();
        if (action === "lightbox-prev") stepGallery(-1);
        if (action === "lightbox-next") stepGallery(1);
      }
      if (event.target.closest(".site-nav a")) toggleNav(false);
    });

    document.addEventListener("change", (event) => {
      if (event.target.name === "attendance") {
        const form = event.target.closest("form");
        if (form) form.classList.toggle("is-accepting", event.target.value === "accept" && event.target.checked);
      }
    });

    document.addEventListener("submit", (event) => {
      const form = event.target.closest("#rsvp-form");
      if (!form) return;
      event.preventDefault();
      submitForm(form);
    });

    document.addEventListener("keydown", (event) => {
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
  }

  render();
  bind();
  tick();
  window.setInterval(tick, 1000);
  onScroll();
  watchReveal();
})();
