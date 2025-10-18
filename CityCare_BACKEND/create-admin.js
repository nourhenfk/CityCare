/**
 * Script pour créer un compte administrateur de test
 * Usage: node create-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Informations du compte admin
const adminData = {
    name: 'Admin CityCare',
    email: 'admin@citycare.com',
    password: 'Admin@123',
    phone: '0612345678',
    role: 'ROLE_ADMIN'
};

// Informations du compte utilisateur de test
const userData = {
    name: 'User Test',
    email: 'user@citycare.com',
    password: 'User@123',
    phone: '0687654321',
    role: 'ROLE_USER'
};

const createUsers = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        // Vérifier si l'admin existe déjà
        let admin = await User.findOne({ email: adminData.email });
        if (admin) {
            console.log('⚠️  L\'admin existe déjà');
        } else {
            // Créer l'admin
            admin = await User.create(adminData);
            console.log('✅ Compte admin créé avec succès !');
        }

        // Vérifier si l'utilisateur test existe déjà
        let user = await User.findOne({ email: userData.email });
        if (user) {
            console.log('⚠️  L\'utilisateur test existe déjà');
        } else {
            // Créer l'utilisateur
            user = await User.create(userData);
            console.log('✅ Compte utilisateur test créé avec succès !');
        }

        console.log('\n========================================');
        console.log('📋 COMPTES DE TEST CRÉÉS');
        console.log('========================================\n');

        console.log('👨‍💼 COMPTE ADMIN:');
        console.log('   Email    : admin@citycare.com');
        console.log('   Mot de passe : Admin@123');
        console.log('   Rôle     : ROLE_ADMIN');
        console.log('   Dashboard: http://localhost:8100/admin\n');

        console.log('👤 COMPTE USER:');
        console.log('   Email    : user@citycare.com');
        console.log('   Mot de passe : User@123');
        console.log('   Rôle     : ROLE_USER');
        console.log('   Dashboard: http://localhost:8100/dashboard\n');

        console.log('========================================\n');

        // Déconnexion
        await mongoose.disconnect();
        console.log('✅ Déconnecté de MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
};

createUsers();
