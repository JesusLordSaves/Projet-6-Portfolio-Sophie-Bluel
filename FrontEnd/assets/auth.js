document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5678/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                // Stocker le token dans le localStorage
                localStorage.setItem('authToken', data.token);
                // Rediriger vers la page d'accueil
                window.location.href = 'index.html';
            } else {
                // Afficher un message d'erreur
                alert('E-mail ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    });
});