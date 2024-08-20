document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');


    // Gestion de la soumission du formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();  // Empêche le rechargement de la page

            const email = document.getElementById('email').value = 'sophie.bluel@test.tld';
            const password = document.getElementById('password').value = 'S0phie';

            try {
                const response = await fetch('http://localhost:5678/api/users/login', {
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

                    // Vérifier que le token est bien stocké
                    console.log('Token après connexion:', localStorage.getItem('authToken'));

                    // Rediriger vers la page d'accueil
                    window.location.href = 'index.html';
                } else {
                    // Afficher un message d'erreur
                    alert('E-mail ou mot de passe incorrect');
                }
            } catch (error) {
                console.error('Erreur lors de la requête :', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        });
    }

  


    // Gestion de la déconnexion
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('authToken');
            checkLoginStatus(); // Re-vérifier le statut après déconnexion
            window.location.href = 'index.html';  // Rediriger vers la page d'accueil après déconnexion
        });
    }
});