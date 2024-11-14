document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'http://localhost:5678/api/works';
    const gallery = document.getElementById('gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let projects = [];

    // Fonction pour créer et ajouter les projets à la galerie
    function addProjectsToGallery(projectsToDisplay) {
        gallery.innerHTML = '';
        projectsToDisplay.forEach(project => {
            const projectContainer = document.createElement('figure');
            projectContainer.classList.add('gallery-item');
            projectContainer.setAttribute('data-category', project.category);

            const projectImage = document.createElement('img');
            projectImage.src = project.imageUrl;
            projectImage.alt = project.title;

            const projectCaption = document.createElement('figcaption');
            projectCaption.textContent = project.title;

            projectContainer.appendChild(projectImage);
            projectContainer.appendChild(projectCaption);
            gallery.appendChild(projectContainer);
        });
    }

    // Fonction pour filtrer les projets
    function filterProjects(category) {
        if (category === 'all') {
            addProjectsToGallery(projects);
        } else {
            const filteredProjects = projects.filter(project => project.category === category);
            addProjectsToGallery(filteredProjects);
        }
    }

    // Récupérer les projets depuis l'API
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            // Assigner les bonnes catégories aux projets
            projects = data.map(project => {
                if (project.title.includes('Abajour') || project.title.includes('Structures Thermopolis')) {
                    project.category = 'objets';
                } else if (project.title.includes('Appartement') || project.title.includes('Villa')) {
                    project.category = 'appartements';
                } else if (project.title.includes('Restaurant') || project.title.includes('Hotel') || project.title.includes('Bar')) {
                    project.category = 'hotels-restaurants';
                } else {
                    project.category = 'other';
                }
                return project;
            });
            addProjectsToGallery(projects); // Afficher tous les projets par défaut
        })
        .catch(error => console.error('Error fetching projects:', error));

    // Ajouter des écouteurs d'événements aux boutons de filtre
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterProjects(category);

            // Mettre à jour le style des boutons de filtre pour indiquer quel bouton est actif
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

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
            logoutLink.style.display = 'none' ;
            console.log('Utilisateur non connecté, affichage de login.');
        }
    };

    // Appeler cette fonction seulement sur la page d'accueil
    if (window.location.pathname.includes('index.html')) {
        checkLoginStatus();
    }

    // Gestion de la déconnexion
    const logoutButton = document.getElementById('logout-link');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('authToken');
            checkLoginStatus(); // Re-vérifier le statut après déconnexion
            window.location.href = 'index.html';  // Rediriger vers la page d'accueil après déconnexion
        });
    }

    // Code pour gérer les modales
    const penIcon = document.querySelector('.fa-pen-to-square');
    const galleryModal = document.getElementById('galleryModal');
    const addPhotoModal = document.getElementById('addPhotoModal');
    const closeButtons = document.querySelectorAll('.close');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const modalGallery = document.querySelector('.modal-gallery');
    const backToGallery = document.getElementById('backToGallery');  // Flèche de retour

    // Ouvrir la première modale lorsque l'icône est cliquée
    penIcon.addEventListener('click', () => {
        galleryModal.style.display = 'block';
        loadGalleryToModal();
    });

    // Fermer les modales
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            galleryModal.style.display = 'none';
            addPhotoModal.style.display = 'none';
        });
    });

    // Ouvrir la seconde modale
    addPhotoBtn.addEventListener('click', () => {
        galleryModal.style.display = 'none';
        addPhotoModal.style.display = 'block';
    });

    // Retour à la première modale lors du clic sur la flèche de retour
    backToGallery.addEventListener('click', () => {
        addPhotoModal.style.display = 'none';
        galleryModal.style.display = 'block';
    });

    // Charger les images de la galerie dans la modale
    function loadGalleryToModal() {
        modalGallery.innerHTML = '';
        const images = gallery.querySelectorAll('img');
        images.forEach(img => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('modal-gallery-item');
    
            const imgClone = img.cloneNode();
            imgContainer.appendChild(imgClone);
    
            const deleteIcon = document.createElement('span');
            deleteIcon.innerHTML = '<i class="fa fa-trash"></i>'; // Utilisez l'icône de poubelle de FontAwesome
            deleteIcon.classList.add('delete-icon');
            imgContainer.appendChild(deleteIcon);
    
            modalGallery.appendChild(imgContainer);
        });
    }

     // Affichage de l'image sélectionnée dans la modale
     const photoFileInput = document.getElementById('photoFile');
     const imagePreview = document.getElementById('imagePreview');
 
     photoFileInput.addEventListener('change', (event) => {
         const file = event.target.files[0];
         if (file) { 
            

            const reader = new FileReader();
             reader.onload = function(e) {
                 imagePreview.src = e.target.result;
                 imagePreview.style.display = 'block';
             }
             reader.readAsDataURL(file);
         } else {
             imagePreview.style.display = 'none';
             imagePreview.src = '#';
         }
     });


    // Fermer la modale en cliquant en dehors du contenu
    window.addEventListener('click', (event) => {
        if (event.target === galleryModal || event.target === addPhotoModal) {
            galleryModal.style.display = 'none';
            addPhotoModal.style.display = 'none';
        }
    });

    // Gérer la suppression d'un projet
    document.querySelector('.modal-gallery').addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-icon')) {
            const projectElement = event.target.closest('.modal-gallery-item');
            const projectId = projectElement.dataset.projectId; // Assurez-vous que chaque élément a un data-project-id

            // Confirmer la suppression avec l'utilisateur
            if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                deleteProject(projectId, projectElement);
            }
        }
    });


    // Fonction pour supprimer le projet
    function deleteProject(projectId, projectElement) {
        fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Supprimer l'élément du DOM après suppression
                projectElement.remove();
                alert('Projet supprimé avec succès.');
            } else {
                alert('Une erreur est survenue lors de la suppression.');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Impossible de supprimer le projet.');
        });
    }

   // Gestion de l'ajout de projet
const addPhotoForm = document.getElementById('addPhotoForm');

addPhotoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addPhotoForm);
    const photoFile = formData.get('image'); // Le nom ici doit être 'image' pour correspondre au backend
    const photoTitle = formData.get('photoTitle').trim();
    const photoCategory = formData.get('photoCategory');

    console.log('Photo File:', photoFile); // Pour vérifier que l'image est bien sélectionnée
    console.log('Photo Title:', photoTitle); // Pour vérifier que le titre est bien récupéré
    console.log('Photo Category:', photoCategory); // Pour vérifier que la catégorie est bien récupérée

    // Validation basique
    if (!photoFile || !photoTitle || !photoCategory) {
        alert('Veuillez remplir tous les champs et sélectionner une image.');
        return;
    }

    // Envoi des données au serveur
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status); // Ajout du status de la réponse pour debug
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Une erreur est survenue lors de l\'envoi du projet.');
        }
    })
    .then(data => {
        console.log('Projet ajouté:', data); // Log pour vérifier que le projet est bien ajouté
        // Ajouter le nouveau projet à la galerie sans recharger la page
        addProjectsToGallery([data]);
        addPhotoModal.style.display = 'none';
        alert('Projet ajouté avec succès.');
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Impossible d\'ajouter le projet.');
    });
});
});