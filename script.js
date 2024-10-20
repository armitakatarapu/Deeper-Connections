<<<<<<< HEAD
async function callHumeAI(input) {
    const response = await fetch('https://your-api-endpoint/api/hume-ai', { // Replace with your actual API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.result; // Adjust based on your actual API response
}

document.getElementById('openEvi').onclick = function() {
    document.getElementById('eviModal').style.display = 'block';
};

document.getElementById('closeEvi').onclick = function() {
    document.getElementById('eviModal').style.display = 'none';
};

document.getElementById('sendMessage').onclick = async function() {
    const userInput = document.getElementById('userInput').value;
    const outputDiv = document.getElementById('eviOutput');

    outputDiv.innerText = "Processing...";

    try {
        const result = await callHumeAI(userInput);
        outputDiv.innerText = result; // Display the result
    } catch (error) {
        console.error('Error calling Hume AI:', error);
        outputDiv.innerText = "Error: " + error.message; // Show error message
    }
};
=======
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
>>>>>>> parent of 0f2efef (cleared)
