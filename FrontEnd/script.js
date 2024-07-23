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
});