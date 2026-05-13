document.addEventListener("DOMContentLoaded", () => {
  const navEnter   = document.getElementById("nav-enter");
  const navHistory = document.getElementById("nav-history");
  const navSummary = document.getElementById("nav-summary");

  const sectionEnter   = document.getElementById("section-enter");
  const sectionHistory = document.getElementById("section-history");
  const sectionSummary = document.getElementById("section-summary");

  const navLinks = document.querySelectorAll(".nav-link");

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
      const result = await response.json();
      if (result.msg === "ok") {
        resultEl.innerHTML = `<div class="msg-success">✓ Measurement saved successfully!</div>`;
        measurementForm.reset();
      } else {
        resultEl.innerHTML = `<div class="msg-error">✗ Failed to save measurement. Please try again.</div>`;
      }
    } catch (err) {
      console.error(err);
      resultEl.innerHTML = `<div class="msg-error">✗ Failed to save measurement. Please try again.</div>`;
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
        `<div class="msg-error">✗ Error fetching history.</div>`;
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
      <span class="stat-chip">Avg Systolic: ${avg} mmHg</span>
      <span class="stat-chip">${data.measurements.length} reading${data.measurements.length !== 1 ? "s" : ""}</span>
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
            label: "Systolic (mmHg)",
            data: data.measurements.map((m) => m.systolic),
            borderColor: "#c62828",
            backgroundColor: "rgba(198,40,40,0.08)",
            borderWidth: 2.5,
            pointBackgroundColor: "#c62828",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.35,
            fill: true,
          },
          {
            label: "Diastolic (mmHg)",
            data: data.measurements.map((m) => m.diastolic),
            borderColor: "#1565c0",
            backgroundColor: "rgba(21,101,192,0.05)",
            borderWidth: 2,
            pointBackgroundColor: "#1565c0",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.35,
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
            labels: { font: { size: 13, family: "Inter, sans-serif" }, usePointStyle: true, padding: 16 },
          },
          tooltip: {
            backgroundColor: "#1a202c",
            titleFont: { size: 13 },
            bodyFont: { size: 13 },
            padding: 10,
            callbacks: {
              label: (ctx) => `  ${ctx.dataset.label}: ${ctx.parsed.y} mmHg`,
            },
          },
        },
        scales: {
          y: {
            min: 40,
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { font: { size: 12 } },
            title: { display: true, text: "mmHg", font: { size: 12 } },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 }, maxRotation: 30 },
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
        `<div class="msg-error">✗ Error fetching summary.</div>`;
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
        <td>${item.user}</td>
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
