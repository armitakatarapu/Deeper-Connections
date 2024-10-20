document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value; 
    const emergencyContact1 = document.getElementById('emergencyContact1').value;
    const emergencyContact2 = document.getElementById('emergencyContact2').value;

    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    
    const userExists = users.find(user => user.username === username);
    
    if (userExists) {
        alert('Username already exists.');
        return;
    }

    
    const newUser = {
        name,
        phone,
        username,
        password, 
        emergencyContacts: [emergencyContact1, emergencyContact2]
    };

    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Signup successful!');
    window.location.href = 'login.html'; 
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('loginPassword').value; 
    
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        localStorage.setItem('loggedInUser', user.username);
        alert('Login successful!');
        window.location.href = '../myconnections.html'; 
    } else {
        alert('Invalid username or password.');
    }
});

if (!localStorage.getItem('loggedInUser')) {
    window.location.href = 'login.html';
}


document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    
    
    alert('You have been logged out.');
    window.location.href = 'login.html';
});
