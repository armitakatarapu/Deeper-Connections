document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value; // Adjusted to match the new ID
    const emergencyContact1 = document.getElementById('emergencyContact1').value;
    const emergencyContact2 = document.getElementById('emergencyContact2').value;

    // Retrieve existing users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if the username already exists
    const userExists = users.find(user => user.username === username);
    
    if (userExists) {
        alert('Username already exists.');
        return;
    }

    // Create a new user object
    const newUser = {
        name,
        phone,
        username,
        password, // Store password in plain text (not recommended for production)
        emergencyContacts: [emergencyContact1, emergencyContact2]
    };

    // Save the new user in localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Signup successful!');
    window.location.href = 'login.html'; // Redirect to login page
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('loginPassword').value; // Adjusted to match the new ID
    
    // Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find the user by username and password
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        localStorage.setItem('loggedInUser', user.username);
        alert('Login successful!');
        window.location.href = '../myconnections.html'; // Redirect to My Connections page
    } else {
        alert('Invalid username or password.');
    }
});

if (!localStorage.getItem('loggedInUser')) {
    // Redirect to login page if not logged in
    window.location.href = 'login.html';
}

// Logout button functionality
document.getElementById('logoutButton').addEventListener('click', function() {
    // Clear the logged-in user from localStorage
    localStorage.removeItem('loggedInUser');
    
    // Optionally, you can redirect to the login page
    alert('You have been logged out.');
    window.location.href = 'login.html'; // Redirect to the login page
});
