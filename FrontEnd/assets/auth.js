document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Pré-remplir les champs email et mot de passe pour le test
    document.getElementById('email').value = 'sophie.bluel@test.tld';
    document.getElementById('password').value = 'S0phie';

    // Gestion de la soumission du formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();  // Empêche le rechargement de la page

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

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

    // Vérifier le statut de connexion lorsque l'utilisateur arrive sur la page d'accueil
    const checkLoginStatus = () => {
        const loginLink = document.getElementById('login-link');
        const logoutLink = document.getElementById('logout-link');
        const token = localStorage.getItem('authToken');

        console.log('Token:', token); // Vérifiez si le token est correct

        if (token) {
            loginLink.style.display = 'none';
            logoutLink.style.display = 'block';
            console.log('Utilisateur connecté, affichage de logout.');
        } else {
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
            console.log('Utilisateur non connecté, affichage de login.');
        }
    };

    // Appeler cette fonction seulement sur la page d'accueil
    if (window.location.pathname.includes('index.html')) {
        checkLoginStatus();
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