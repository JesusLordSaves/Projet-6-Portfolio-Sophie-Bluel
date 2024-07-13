console.log('Script chargé');

// URL de l'API pour récupérer les travaux de l'architecte
const apiURL = 'http://localhost:5678/api/works';

// Sélectionner l'élément de la galerie dans ton HTML
const gallery = document.getElementById('gallery'); // Assure-toi que l'élément de la galerie a l'ID "gallery"

// Fonction pour créer et ajouter les projets à la galerie
function addProjectsToGallery(projects) {
  // Vider la galerie existante
  gallery.innerHTML = '';

  // Parcourir chaque projet et créer des éléments HTML pour l'ajouter à la galerie
  projects.forEach(project => {
    // Créer un conteneur pour chaque projet
    const projectContainer = document.createElement('figure');

    // Créer une image pour le projet
    const projectImage = document.createElement('img');
    projectImage.src = project.imageUrl; // Utiliser l'URL de l'image du projet
    projectImage.alt = project.title; // Utiliser le titre du projet comme texte alternatif

    // Créer une légende pour le projet
    const projectCaption = document.createElement('figcaption');
    projectCaption.textContent = project.title;

    // Ajouter l'image et la légende au conteneur du projet
    projectContainer.appendChild(projectImage);
    projectContainer.appendChild(projectCaption);

    // Ajouter le conteneur du projet à la galerie
    gallery.appendChild(projectContainer);
  });
}

// Utiliser fetch pour envoyer une demande à l'API
fetch(apiURL)
  .then(response => response.json()) // Convertir la réponse en format JSON
  .then(data => {
    console.log(data); // Afficher les données dans la console pour vérifier
    // Ajouter les projets à la galerie
    addProjectsToGallery(data);
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des travaux :', error);
  });