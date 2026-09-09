const grid = document.querySelector("#projects-grid");
const filterRoot = document.querySelector("#filters");
const modal = document.querySelector("#project-modal");
const modalContent = document.querySelector("#modal-content");

const categories = ["All", ...new Set(projects.map((project) => project.category))];
let activeCategory = "All";
let previousFocus = null;

function renderFilters() {
  filterRoot.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `filter-button ${activeCategory === category ? "active" : ""}`;
    button.textContent = category;
    button.setAttribute("aria-pressed", String(activeCategory === category));

    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderProjects();
    });

    filterRoot.appendChild(button);
  });
}

function externalLink(url, label) {
  if (!url) return "";
  return `<a href="${url}" target="_blank" rel="noreferrer">${label} ↗</a>`;
}

// Paths are relative to this site, including filenames containing spaces.
function fileLinks(project, detailed = false) {
  return (project.files || []).map((file) => {
    const preview = encodeURI(file.preview || file.path);
    const download = encodeURI(file.path);
    const kind = file.type === "pdf" ? "PDF" : "notebook";
    const links = `<a href="${preview}" target="_blank" rel="noopener noreferrer">View ${kind} ↗</a>
      <a href="${download}" download>Download ${kind} ↓</a>`;
    return detailed
      ? `<div class="project-file"><h4>${file.label}</h4><div class="file-actions">${links}</div></div>`
      : links;
  }).join("");
}

function renderProjects() {
  const visibleProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  grid.innerHTML = visibleProjects
    .map(
      (project) => `
      <article class="project-card">
        <div class="project-topline">
          <span>${project.category.toUpperCase()}</span>
          <span>${project.year}</span>
        </div>

        <h3>${project.title}</h3>
        <p>${project.description}</p>

        <div class="tags">
          ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>

        <div class="project-actions">
          <button type="button" data-project="${project.id}">Read project →</button>
          ${fileLinks(project)}
          ${project.demo ? externalLink(project.demo, "Live demo") : ""}
        </div>
      </article>
    `
    )
    .join("");

  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => openProject(button.dataset.project));
  });
}

function openProject(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return;

  previousFocus = document.activeElement;
  modalContent.innerHTML = `
    <div class="modal-kicker">${project.category.toUpperCase()} · ${project.year}</div>
    <h3 id="modal-title">${project.title}</h3>
    <p class="modal-description">${project.details}</p>

    <ul class="modal-points">
      ${project.highlights.map((item) => `<li>${item}</li>`).join("")}
    </ul>

    <div class="tags">
      ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>

    <section class="project-files" aria-label="Project documents">
      ${fileLinks(project, true)}
    </section>

    <div class="modal-links">
      ${externalLink(project.github, "Source code")}
      ${project.demo ? externalLink(project.demo, "Launch demo") : ""}
    </div>
  `;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-panel").scrollTop = 0;
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  if (!modal.classList.contains("open")) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (previousFocus?.isConnected) previousFocus.focus();
}

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("open")) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "Tab") {
    const items = [...modal.querySelectorAll('a[href], button:not([disabled])')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

renderFilters();
renderProjects();
