document.addEventListener('DOMContentLoaded', () => {
    // Navigation elements
    const navEnter = document.getElementById('nav-enter');
    const navHistory = document.getElementById('nav-history');
    const navSummary = document.getElementById('nav-summary');

    const sectionEnter = document.getElementById('section-enter');
    const sectionHistory = document.getElementById('section-history');
    const sectionSummary = document.getElementById('section-summary');

    // Navigation event listeners
    navEnter.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('enter');
    });
    navHistory.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('history');
    });
    navSummary.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('summary');
    });

    function showSection(section) {
        sectionEnter.style.display = (section === 'enter') ? 'block' : 'none';
        sectionHistory.style.display = (section === 'history') ? 'block' : 'none';
        sectionSummary.style.display = (section === 'summary') ? 'block' : 'none';
    }
    // תפריטי המשתמש הנפתחים בעת טעינת העמוד
    populateUsers('userSelect');
    populateUsers('historyUserSelect');

    // טופס להזנת מדידה
    const measurementForm = document.getElementById('measurementForm');
    measurementForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = document.getElementById('userSelect').value;
        const systolic = document.getElementById('systolic').value;
        const diastolic = document.getElementById('diastolic').value;
        const pulse = document.getElementById('pulse').value;
        const measurementDate = document.getElementById('measurementDate').value;

        const data = { userId, systolic, diastolic, pulse, measurementDate };

        try {
            const response = await fetch('/measurements/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            document.getElementById('measurementResult').innerText = result.msg === 'ok' ? 'Measurement added successfully!' : 'Error adding measurement.';
            measurementForm.reset();
        } catch (err) {
            console.error(err);
            document.getElementById('measurementResult').innerText = 'Error adding measurement.';
        }
    });

    // טופס  להגשת היסטוריית מדידות
    const historyForm = document.getElementById('historyForm');
    historyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = document.getElementById('historyUserSelect').value;
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;

        try {
            const response = await fetch(`/measurements/history/${userId}?start=${start}&end=${end}`);
            const result = await response.json();
            displayHistory(result);
        } catch (err) {
            console.error(err);
            document.getElementById('historyResult').innerText = 'Error fetching history.';
        }
    });

    function displayHistory(data) {
        const container = document.getElementById('historyResult');
        container.innerHTML = '';
        if (!data.measurements || data.measurements.length === 0) {
            container.innerText = 'No measurements found for the selected period.';
            return;
        }

        const avg = data.averageSystolic.toFixed(2);
        const heading = document.createElement('h3');
        heading.innerText = `Average Systolic: ${avg}`;
        container.appendChild(heading);

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.innerHTML = `<tr>
            <th>Date</th>
            <th>Systolic</th>
            <th>Diastolic</th>
            <th>Pulse</th>
        </tr>`;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.measurements.forEach(measurement => {
            const tr = document.createElement('tr');
            if (measurement.abnormal) {
                tr.classList.add('abnormal');
            }
            tr.innerHTML = `<td>${measurement.measurement_date}</td>
                            <td>${measurement.systolic}</td>
                            <td>${measurement.diastolic}</td>
                            <td>${measurement.pulse}</td>`;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    }
