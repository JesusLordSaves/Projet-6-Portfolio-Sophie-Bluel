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

    // Fermer la modale en cliquant en dehors du contenu
    window.addEventListener('click', (event) => {
        if (event.target === galleryModal || event.target === addPhotoModal) {
            galleryModal.style.display = 'none';
            addPhotoModal.style.display = 'none';
        }
    });
});