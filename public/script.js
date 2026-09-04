const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

document.addEventListener("DOMContentLoaded", async () => {
  // ── Sign-in modal ───────────────────────────────────────────────────────────
  const loginGate = document.getElementById("loginGate");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const authBtn = document.getElementById("authBtn");

  let authenticated = false;

  function setAuthenticated(value) {
    authenticated = value;
    authBtn.textContent = authenticated ? "Sign out" : "Sign in";
  }

  function openLoginModal() {
    loginError.hidden = true;
    loginForm.reset();
    loginGate.hidden = false;
    document.getElementById("loginPassword").focus();
  }

  function closeLoginModal() {
    loginGate.hidden = true;
  }

  function showLoginError(message) {
    loginError.textContent = message;
    loginError.hidden = false;
  }

  document.getElementById("loginBackdrop").addEventListener("click", closeLoginModal);
  document.getElementById("loginClose").addEventListener("click", closeLoginModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !loginGate.hidden) closeLoginModal();
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.hidden = true;
    const password = document.getElementById("loginPassword").value;
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setAuthenticated(true);
        closeLoginModal();
      } else {
        showLoginError("Incorrect password.");
      }
    } catch (err) {
      console.error(err);
      showLoginError("Couldn't sign in. Try again.");
    }
  });

  authBtn.addEventListener("click", async () => {
    if (authenticated) {
      try {
        await fetch("/auth/logout", { method: "POST" });
      } catch (err) {
        console.error(err);
      }
      setAuthenticated(false);
    } else {
      openLoginModal();
    }
  });

  try {
    const response = await fetch("/auth/status");
    const data = await response.json();
    setAuthenticated(!!data.authenticated);
  } catch (err) {
    console.error(err);
    setAuthenticated(false);
  }

  // ── App (viewing is public; saving/managing patients requires sign-in) ─────
  const navEnter   = document.getElementById("nav-enter");
  const navHistory = document.getElementById("nav-history");
  const navSummary = document.getElementById("nav-summary");

  const sectionEnter   = document.getElementById("section-enter");
  const sectionHistory = document.getElementById("section-history");
  const sectionSummary = document.getElementById("section-summary");

  const navLinks = document.querySelectorAll(".tab");

  function showSection(section) {
    sectionEnter.style.display   = section === "enter"   ? "block" : "none";
    sectionHistory.style.display = section === "history" ? "block" : "none";
    sectionSummary.style.display = section === "summary" ? "block" : "none";

    navLinks.forEach((l) => l.classList.remove("active"));
    const active = document.getElementById(`nav-${section}`);
    if (active) active.classList.add("active");
  }

  navEnter.addEventListener("click",   (e) => { e.preventDefault(); showSection("enter");   });
  navHistory.addEventListener("click", (e) => { e.preventDefault(); showSection("history"); });
  navSummary.addEventListener("click", (e) => { e.preventDefault(); showSection("summary"); });

  populateUsers("userSelect");
  populateUsers("historyUserSelect");

  // ── Enter Measurement ──────────────────────────────────────────────────────
  const measurementForm = document.getElementById("measurementForm");
  measurementForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId          = document.getElementById("userSelect").value;
    const systolic        = document.getElementById("systolic").value;
    const diastolic       = document.getElementById("diastolic").value;
    const pulse           = document.getElementById("pulse").value;
    const measurementDate = document.getElementById("measurementDate").value;
    const resultEl        = document.getElementById("measurementResult");

    try {
      const response = await fetch("/measurements/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, systolic, diastolic, pulse, measurementDate }),
      });
      if (response.status === 401) {
        resultEl.innerHTML = `<div class="msg-error">Sign in to save a reading.</div>`;
        openLoginModal();
        return;
      }
      const result = await response.json();
      if (result.msg === "ok") {
        resultEl.innerHTML = `<div class="msg-success">Reading saved.</div>`;
        measurementForm.reset();
      } else {
        resultEl.innerHTML = `<div class="msg-error">Couldn't save the reading. Try again.</div>`;
      }
    } catch (err) {
      console.error(err);
      resultEl.innerHTML = `<div class="msg-error">Couldn't save the reading. Try again.</div>`;
    }
  });

  // ── Measurement History ────────────────────────────────────────────────────
  const historyForm = document.getElementById("historyForm");
  historyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("historyUserSelect").value;
    const start  = document.getElementById("startDate").value;
    const end    = document.getElementById("endDate").value;

    try {
      const response = await fetch(`/measurements/history/${userId}?start=${start}&end=${end}`);
      const result   = await response.json();
      displayHistory(result);
    } catch (err) {
      console.error(err);
      document.getElementById("historyResult").innerHTML =
        `<div class="msg-error">Couldn't load history. Try again.</div>`;
    }
  });

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return String(dateStr).split("T")[0];
  }

  function displayHistory(data) {
    const container = document.getElementById("historyResult");
    container.innerHTML = "";

    if (!data.measurements || data.measurements.length === 0) {
      container.innerHTML = `<p class="msg-empty">No measurements found for the selected period.</p>`;
      return;
    }

    const avg = data.averageSystolic.toFixed(1);

    const statsBar = document.createElement("div");
    statsBar.className = "stats-bar";
    statsBar.innerHTML = `
      <span class="stat-chip">
        <span class="stat-value">${avg}</span>
        <span class="stat-label">avg systolic, mmHg</span>
      </span>
      <span class="stat-chip">
        <span class="stat-value">${data.measurements.length}</span>
        <span class="stat-label">reading${data.measurements.length !== 1 ? "s" : ""}</span>
      </span>
    `;
    container.appendChild(statsBar);

    const table  = document.createElement("table");
    const thead  = document.createElement("thead");
    thead.innerHTML = `<tr>
      <th>Date</th>
      <th>Systolic</th>
      <th>Diastolic</th>
      <th>Pulse</th>
      <th>Status</th>
    </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.measurements.forEach((m) => {
      const tr = document.createElement("tr");
      if (m.abnormal) tr.classList.add("abnormal");
      const badge = m.abnormal
        ? `<span class="badge badge-abnormal">High</span>`
        : `<span class="badge badge-normal">Normal</span>`;
      tr.innerHTML = `
        <td>${formatDate(m.measurement_date)}</td>
        <td>${m.systolic}</td>
        <td>${m.diastolic}</td>
        <td>${m.pulse}</td>
        <td>${badge}</td>`;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);

    const chartWrap = document.createElement("div");
    chartWrap.className = "chart-wrap";
    const canvas = document.createElement("canvas");
    chartWrap.appendChild(canvas);
    container.appendChild(chartWrap);

    const labels = data.measurements.map((m) => formatDate(m.measurement_date));

    new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Systolic",
            data: data.measurements.map((m) => m.systolic),
            borderColor: "#b0353c",
            backgroundColor: "rgba(176,53,60,0.07)",
            borderWidth: 2.5,
            pointBackgroundColor: "#b0353c",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true,
          },
          {
            label: "Diastolic",
            data: data.measurements.map((m) => m.diastolic),
            borderColor: "#33586c",
            backgroundColor: "rgba(51,88,108,0.05)",
            borderWidth: 2,
            pointBackgroundColor: "#33586c",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            align: "start",
            labels: {
              font: { size: 13, family: "'IBM Plex Sans', sans-serif" },
              color: "#4b5957",
              usePointStyle: true,
              boxWidth: 8,
              padding: 18,
            },
          },
          tooltip: {
            backgroundColor: "#1c2b2a",
            titleFont: { size: 13, family: "'IBM Plex Sans', sans-serif" },
            bodyFont: { size: 13, family: "'IBM Plex Mono', monospace" },
            padding: 10,
            callbacks: {
              label: (ctx) => `  ${ctx.dataset.label}: ${ctx.parsed.y} mmHg`,
            },
          },
        },
        scales: {
          y: {
            min: 40,
            grid: { color: "rgba(28,43,42,0.07)" },
            ticks: { font: { size: 12, family: "'IBM Plex Mono', monospace" }, color: "#78847f" },
            title: { display: true, text: "mmHg", font: { size: 12, family: "'IBM Plex Sans', sans-serif" }, color: "#78847f" },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, family: "'IBM Plex Mono', monospace" }, color: "#78847f", maxRotation: 30 },
          },
        },
      },
    });
  }

  // ── Monthly Summary ────────────────────────────────────────────────────────
  const summaryForm = document.getElementById("summaryForm");
  summaryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const month = document.getElementById("monthInput").value;
    try {
      const response = await fetch(`/summary/monthly?month=${month}`);
      const result   = await response.json();
      displaySummary(result);
    } catch (err) {
      console.error(err);
      document.getElementById("summaryResult").innerHTML =
        `<div class="msg-error">Couldn't load the summary. Try again.</div>`;
    }
  });

  function displaySummary(data) {
    const container = document.getElementById("summaryResult");
    container.innerHTML = "";

    if (!data.data || data.data.length === 0) {
      container.innerHTML = `<p class="msg-empty">No data available for the selected month.</p>`;
      return;
    }

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    thead.innerHTML = `<tr>
      <th>Patient</th>
      <th>Avg Systolic</th>
      <th>Avg Diastolic</th>
      <th>Avg Pulse</th>
      <th>Abnormal</th>
    </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.data.forEach((item) => {
      const tr = document.createElement("tr");
      const abnormalBadge =
        item.abnormalCount > 0
          ? `<span class="badge badge-abnormal">${item.abnormalCount}</span>`
          : `<span class="badge badge-normal">0</span>`;
      tr.innerHTML = `
        <td>${escapeHtml(item.user)}</td>
        <td>${item.avgSystolic  !== null ? item.avgSystolic.toFixed(1)  : "—"}</td>
        <td>${item.avgDiastolic !== null ? item.avgDiastolic.toFixed(1) : "—"}</td>
        <td>${item.avgPulse     !== null ? item.avgPulse.toFixed(1)     : "—"}</td>
        <td>${abnormalBadge}</td>`;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }

  // ── Populate user dropdowns ────────────────────────────────────────────────
  async function populateUsers(selectId) {
    try {
      const response = await fetch("/users/list");
      const result   = await response.json();
      const select   = document.getElementById(selectId);
      const users    = Array.isArray(result.data) ? result.data
                     : Array.isArray(result)      ? result
                     : [];
      if (users.length === 0) {
        const opt  = document.createElement("option");
        opt.value  = "";
        opt.text   = "No patients found";
        opt.disabled = true;
        select.appendChild(opt);
        return;
      }
      users.forEach((user) => {
        const option   = document.createElement("option");
        option.value   = user.id;
        option.text    = user.name;
        select.appendChild(option);
      });
    } catch (err) {
      console.error("Could not load users:", err);
    }
  }
});
