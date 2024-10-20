document.addEventListener('DOMContentLoaded', function () {
    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Retrieve users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if user exists
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', username); // Store the logged-in user
            alert('Login successful!');
            window.location.href = '../home.html'; // Adjust the path to home.html
        } else {
            alert('Invalid username or password.');
        }
    });

    // Handle sign-up form submission
    document.getElementById('signupForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const newUsername = document.getElementById('signupUsername').value; // Fixed this ID
        const newPassword = document.getElementById('newPassword').value; // You need to add this input in your signup form
        const emergencyContact1 = document.getElementById('emergencyContact1').value;
        const emergencyContact2 = document.getElementById('emergencyContact2').value;

        // Retrieve existing users from localStorage or create an empty array
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if username is already taken
        const userExists = users.some(user => user.username === newUsername);

        if (userExists) {
            alert('Username already exists. Please choose another.');
        } else {
            // Add the new user to the users array with additional fields
            users.push({
                name: name,
                email: email,
                phone: phone,
                username: newUsername,
                password: newPassword, // Make sure there's an input for newPassword
                emergencyContacts: [emergencyContact1, emergencyContact2]
            });

            // Save updated users list to localStorage
            localStorage.setItem('users', JSON.stringify(users));

            alert('Sign-up successful! You can now log in.');
            // Optionally, auto-fill the login form with the new credentials
            document.getElementById('username').value = newUsername;
            document.getElementById('password').value = newPassword; // You need to add this input in your login form
        }
    });

    // Handle logout button click
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedInUser'); // Clear the logged-in user
            alert('You have logged out successfully!');
            // Redirect to login page
            window.location.href = 'login.html'; // Adjust the path as needed
        });
    }

    // Show or hide the logout button based on login status
    function updateLogoutButtonVisibility() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (logoutButton) {
            logoutButton.style.display = loggedInUser ? 'block' : 'none'; // Show/hide based on login status
        }
    }

    // Run on page load to set the logout button visibility correctly
    updateLogoutButtonVisibility();
});
