const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'your_jwt_secret'; // Change cette valeur par une clé secrète plus sécurisée

// Exemple d'utilisateurs enregistrés (à remplacer par une vraie base de données)
const users = [
    { id: 1, email: 'user@example.com', password: 'password' }
];

// Route pour gérer les connexions
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Rechercher l'utilisateur correspondant
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Générer un token JWT
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'E-mail ou mot de passe incorrect' });
    }
});

module.exports = router;