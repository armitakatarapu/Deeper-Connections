document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (!loggedInUser) {
        alert('You need to be logged in to access My Connections.');
        window.location.href = 'login.html';
    }
});
