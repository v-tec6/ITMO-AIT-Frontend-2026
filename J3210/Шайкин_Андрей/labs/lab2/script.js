const API_URL = "http://localhost:3000";

function getAuthToken() { return localStorage.accessToken; }

function checkAuth(redirectIfNotAuth = false) {
    const token = getAuthToken();
    const navAuthBtn = document.getElementById('navAuthBtn');
    if (token && navAuthBtn) navAuthBtn.style.display = 'none';
    if (redirectIfNotAuth && !token) window.location.href = "auth.html";
    if (window.location.pathname.includes('auth.html') && token) window.location.href = "profile.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

async function register(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const registerData = {};
    formData.forEach((value, key) => registerData[key] = value);

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            body: JSON.stringify(registerData),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) { alert(await response.json()); return; }
        const data = await response.json();
        localStorage.accessToken = data.accessToken;
        localStorage.user = JSON.stringify(data.user);
        window.location.href = "profile.html";
    } catch (e) { console.error(e); }
}

async function login(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const loginData = {};
    formData.forEach((value, key) => loginData[key] = value);

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) { alert("Неверный логин или пароль"); return; }
        const data = await response.json();
        localStorage.accessToken = data.accessToken;
        localStorage.user = JSON.stringify(data.user);
        window.location.href = "profile.html";
    } catch (e) { console.error(e); }
}

document.addEventListener("DOMContentLoaded", () => {
    const isProfile = window.location.pathname.includes('profile.html');
    checkAuth(isProfile);
});