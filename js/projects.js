(function () {
  const loadingEl = document.getElementById("projects-loading");
  const gridEl = document.getElementById("projects-grid");
  const emptyEl = document.getElementById("projects-empty");

  function card(p) {
    const el = document.createElement("article");
    el.className = "project-card";

    const tags = (p.tags || []).slice(0, 4).map((t) => `<span>${t}</span>`).join("");

    el.innerHTML = `
      <div class="project-card__head">
        <span class="project-card__name">${p.name}</span>
        <span class="project-card__status ${p.live ? "project-card__status--live" : ""}">
          ${p.live ? "live" : "code"}
        </span>
      </div>
      <p class="project-card__desc">${p.description || "No description yet."}</p>
      <div class="project-card__tags">${tags}</div>
      <div class="project-card__links">
        ${p.homepage ? `<a href="${p.homepage}" target="_blank" rel="noopener">Live →</a>` : ""}
        <a href="${p.url}" target="_blank" rel="noopener">Code →</a>
      </div>
    `;
    return el;
  }

  function renderEmpty() {
    emptyEl.innerHTML = `
      Nothing live yet — the pipeline's still brewing.
      <a href="https://github.com/vishwaskotegar" target="_blank" rel="noopener">Check the code in the meantime →</a>
    `;
    emptyEl.hidden = false;
  }

  function renderError() {
    emptyEl.innerHTML = `
      Couldn't reach the project feed right now.
      <a href="https://github.com/vishwaskotegar" target="_blank" rel="noopener">See the GitHub profile directly →</a>
    `;
    emptyEl.hidden = false;
  }

  fetch("data/projects.json", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("bad response");
      return res.json();
    })
    .then((data) => {
      loadingEl.hidden = true;
      const items = Array.isArray(data.projects) ? data.projects : [];
      if (!items.length) {
        renderEmpty();
        return;
      }
      gridEl.hidden = false;
      items.forEach((p) => gridEl.appendChild(card(p)));
    })
    .catch(() => {
      loadingEl.hidden = true;
      renderError();
    });
})();
