const API_URL = "http://localhost:3000";
const EXP_TO_SHOW_ON_MAIN_PAGE = 6;

document.addEventListener("DOMContentLoaded", async () => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(userStr);
    const userNameElement = document.getElementById("userNameDisplay");
    if (userNameElement) userNameElement.innerText = user.name;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    }

    await fetchAndRenderDashboard();

    const btnSave = document.getElementById("btnSaveExperiment");
    if (btnSave) {
        btnSave.addEventListener("click", createNewExperiment);
    }
});

async function fetchAndRenderDashboard() {
    const searchTableBody = document.getElementById("searchTableBody");

    if (searchTableBody) {
        try {
            const expRes = await axios.get(`${API_URL}/experiments`);
            const experiments = expRes.data;

            searchTableBody.innerHTML = "";
            experiments.reverse().forEach(exp => {
                searchTableBody.innerHTML += `
                <tr>
                    <td><a href="experiment_details.html" class="text-decoration-none text-truncate btn-min-width">${exp.name}</a></td>
                    <td><span class="badge bg-secondary text-truncate btn-min-width">${exp.model}</span></td>
                    <td>${exp.metricName}</td>
                    <td>${exp.metricValue}</td>
                    <td>${exp.date}</td>
                    <td>${exp.duration || "-"}</td>
                    <td><span class="badge ${exp.status === 'success' ? 'bg-success' : 'bg-warning text-dark'}">${exp.status}</span></td>
                    <td>
                        <button class="btn btn-sm text-danger" onclick="deleteExp('${exp.id}')">🗑</button>
                    </td>
                </tr>
            `;
            });
        } catch (e) { console.error(e); }
    }

    const tableBody = document.getElementById("experimentsTableBody");
    if (tableBody) {
        try {
            const [statsRes, expRes] = await Promise.all([
                axios.get(`${API_URL}/models`),
                axios.get(`${API_URL}/experiments`)
            ]);

            document.getElementById("stat-experiments").innerText = expRes.data.length;
            document.getElementById("stat-models").innerText = statsRes.data.length;

            tableBody.innerHTML = "";
            expRes.data.slice().reverse().slice(0, EXP_TO_SHOW_ON_MAIN_PAGE).forEach(exp => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td><a href="experiment_details.html" class="text-decoration-none">${exp.name}</a></td>
                <td><span class="badge bg-secondary">${exp.model}</span></td>
                <td>${exp.metricName || 'Accuracy'}</td>
                <td>${exp.metricValue || '0'}</td>
                <td>${exp.date}</td>
                <td>${exp.duration || "-"}</td>
                <td><span class="badge ${exp.status === 'success' ? 'bg-success' : 'bg-warning'}">${exp.status}</span></td>
                <td>
                    <button class="btn btn-sm text-danger" onclick="deleteExp('${exp.id}')">🗑</button>
                </td>
            `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Ошибка API:", error);
        }
    }
}

async function createNewExperiment() {
    const nameInput = document.getElementById("newExpName");
    const modelInput = document.getElementById("newExpModel");

    if (!nameInput || !modelInput) return;

    const name = nameInput.value.trim();
    const modelName = modelInput.value.trim();

    if (!name || !modelName) {
        alert("Заполните название и модель!");
        return;
    }

    try {
        const [expRes, modelsRes] = await Promise.all([
            axios.get(`${API_URL}/experiments`),
            axios.get(`${API_URL}/models`)
        ]);

        const isDuplicate = expRes.data.some(e => e.name.toLowerCase() === name.toLowerCase());
        if (isDuplicate) {
            alert("Эксперимент с таким названием уже существует!");
            return;
        }

        const modelExists = modelsRes.data.some(m => m.name === modelName);
        if (!modelExists) {
            alert(`Модель "${modelName}" не найдена в реестре! Проверьте правильность написания.`);
            return;
        }

        const newExp = {
            name: name,
            model: modelName,
            metricName: "Accuracy",
            metricValue: (Math.random() * 100).toFixed(2),
            date: new Date().toLocaleString(),
            status: "process"
        };

        await axios.post(`${API_URL}/experiments`, newExp);

        const modal = bootstrap.Modal.getInstance(document.getElementById('newExperimentModal'));
        if (modal) modal.hide();

        nameInput.value = "";
        modelInput.value = "";
        await fetchAndRenderDashboard();

    } catch (e) {
        console.error("Ошибка:", e);
    }
}

window.deleteExp = async function(id) {
    if (confirm("Удалить запись?")) {
        await axios.delete(`${API_URL}/experiments/${id}`);
        await fetchAndRenderDashboard();
    }
}
