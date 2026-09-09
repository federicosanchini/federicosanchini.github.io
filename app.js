const grid = document.querySelector("#projects-grid");
const filterRoot = document.querySelector("#filters");
const modal = document.querySelector("#project-modal");
const modalContent = document.querySelector("#modal-content");

const categories = ["All", ...new Set(projects.map((project) => project.category))];
let activeCategory = "All";

function renderFilters() {
  filterRoot.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `filter-button ${activeCategory === category ? "active" : ""}`;
    button.textContent = category;

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

    <div class="modal-links">
      ${externalLink(project.github, "Source code")}
      ${project.demo ? externalLink(project.demo, "Launch demo") : ""}
    </div>
  `;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

document.querySelector("#year").textContent = new Date().getFullYear();

renderFilters();
renderProjects();
