window.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        window.location.href = 'login/login.html';
    } else {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === loggedInUser);
        
        if (user) {
            const userInfoDiv = document.getElementById('userInfo');
            userInfoDiv.innerHTML = `
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Emergency Contact 1:</strong> ${user.emergencyContacts[0]}</p>
                <p><strong>Emergency Contact 2:</strong> ${user.emergencyContacts[1]}</p>
            `;
        }
    }
});

