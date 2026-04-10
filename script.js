const API = 'http://localhost:3000/api';

// ===== HELPERS =====
function getCurrentPage() {
    return window.location.pathname;
}

function isLoginPage() {
    return getCurrentPage().includes('login.html');
}

function getToken() {
    return localStorage.getItem('token');
}

// ===== AUTH GUARD =====
if (!getToken() && !isLoginPage()) {
    window.location.href = '/login/login.html';
}

// ===== LOGIN & SIGNUP (only run on login page) =====
if (isLoginPage()) {

    document.getElementById('signupForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const body = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            username: document.getElementById('signupUsername').value,
            password: document.getElementById('signupPassword').value,
            emergencyContact1: document.getElementById('emergencyContact1').value,
            emergencyContact2: document.getElementById('emergencyContact2').value,
        };

        const res = await fetch(`${API}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error);
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Signup successful!');
        window.location.href = '/myconnections.html';
    });

    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const body = {
            username: document.getElementById('username').value,
            password: document.getElementById('loginPassword').value,
        };

        const res = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error);
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful!');
        window.location.href = '/myconnections.html';
    });
}

// ===== LOGOUT =====
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('You have been logged out.');
        window.location.href = '/login/login.html';
    });
}