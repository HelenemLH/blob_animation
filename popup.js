document.getElementById('login-button').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        
        if (username === "blobuser" && password === "blobpass") {
            alert('Login successful! Welcome ' + username);
            
        } else {
            alert('Invalid username or password.');
        }
    } else {
        alert('Please enter both username and password.');
    }
});
