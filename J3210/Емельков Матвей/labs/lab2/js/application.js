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

    const tableBody = document.getElementById("experimentsTableBody");
    if (tableBody) {
        try {
            const statsRes = await axios.get("http://localhost:3000/stats");
            document.getElementById("stat-experiments").innerText = statsRes.data.totalExperiments;
            document.getElementById("stat-models").innerText = statsRes.data.totalModels;

            const expRes = await axios.get("http://localhost:3000/experiments");
            const experiments = expRes.data;

            tableBody.innerHTML = "";

            experiments.forEach(exp => {
                let badgeHTML = exp.status === "success"
                    ? '<span class="badge bg-success">ОК</span>'
                    : '<span class="badge bg-warning text-dark">In process</span>';

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><a href="experiment_details.html" class="text-decoration-none text-truncate btn-min-width">${exp.name}</a></td>
                    <td><a href="models.html" class="badge bg-secondary text-decoration-none text-truncate btn-min-width">${exp.model}</a></td>
                    <td>${exp.metricName}</td>
                    <td>${exp.metricValue}</td>
                    <td>${exp.date}</td>
                    <td>${badgeHTML}</td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Ошибка загрузки данных из API:", error);
        }
    }
});