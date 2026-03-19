document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById("email").value.trim();
            const passwordInput = document.getElementById("password").value.trim();

            try {
                const response = await axios.get('http://localhost:3000/users', {
                    params: { email: emailInput }
                });

                const users = response.data;

                if (users.length > 0) {
                    const user = users[0];

                    if (user.password === passwordInput) {
                        localStorage.setItem("currentUser", JSON.stringify(user));
                        window.location.href = "index.html";
                    } else {
                        alert("Неверный пароль!");
                    }
                } else {
                    alert("Пользователь с таким email не найден!");
                }

            } catch (error) {
                console.error("Ошибка API:", error);
                alert("Не удалось связаться с сервером.");
            }
        });
    }
});