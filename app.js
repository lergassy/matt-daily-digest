async function loadContent() {
  const main = document.getElementById("sections");
  const tabs = document.getElementById("tabs");
  const updatedEl = document.getElementById("updated");

  let data;
  try {
    const res = await fetch("content.json?t=" + Date.now());
    data = await res.json();
  } catch (e) {
    main.innerHTML = '<div class="empty">Не удалось загрузить контент. Проверь подключение к интернету и обнови страницу.</div>';
    return;
  }

  const sections = data.sections || {};
  const keys = Object.keys(sections);

  if (data.updated_at) {
    const d = new Date(data.updated_at);
    updatedEl.textContent = "Обновлено: " + d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  keys.forEach((key, i) => {
    const section = sections[key];

    const btn = document.createElement("button");
    btn.textContent = section.title;
    btn.dataset.target = key;
    if (i === 0) btn.classList.add("active");
    btn.addEventListener("click", () => switchTab(key));
    tabs.appendChild(btn);

    const secEl = document.createElement("section");
    secEl.className = "section" + (i === 0 ? " active" : "");
    secEl.id = "sec-" + key;

    if (!section.items || section.items.length === 0) {
      secEl.innerHTML = '<div class="empty">Пока пусто. Материалы появятся после первого автообновления.</div>';
    } else {
      section.items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        const linkHtml = item.url
          ? `<a href="${item.url}" target="_blank" rel="noopener">Источник →</a>`
          : "";
        card.innerHTML = `
          <h2>${escapeHtml(item.title)}</h2>
          <p>${escapeHtml(item.summary)}</p>
          <div class="meta">
            <span>${escapeHtml(item.source || "")}${item.date ? " · " + escapeHtml(item.date) : ""}</span>
            ${linkHtml}
          </div>
        `;
        secEl.appendChild(card);
      });
    }

    main.appendChild(secEl);
  });
}

function switchTab(key) {
  document.querySelectorAll("nav.tabs button").forEach(b => {
    b.classList.toggle("active", b.dataset.target === key);
  });
  document.querySelectorAll("main .section").forEach(s => {
    s.classList.toggle("active", s.id === "sec-" + key);
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

loadContent();
