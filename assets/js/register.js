function handleCredentialResponse(response) {
    // Handle Google Sign-In response
    // You can send this response to your backend for further processing
    fetch('/auth/google/callback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                window.location.href = '/success'; // Redirect on successful authentication
            } else {
                window.location.href = '/failure'; // Redirect on failure
            }
        })
        .catch(error => console.error('Error:', error));
}