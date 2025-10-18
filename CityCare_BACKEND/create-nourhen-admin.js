/**
 * Script pour créer un nouvel admin 'nourhenAdmin'
 * Usage: node create-nourhen-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const adminData = {
    name: 'nourhenAdmin',
    email: 'nourhen.admin@citycare.com',
    password: 'Nourhen@2025',
    phone: '0600000000',
    role: 'ROLE_ADMIN'
};

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        let admin = await User.findOne({ email: adminData.email });
        if (admin) {
            console.log('⚠️  L\'admin existe déjà');
        } else {
            admin = await User.create(adminData);
            console.log('✅ Compte admin "nourhenAdmin" créé avec succès !');
        }

        console.log('\n========================================');
        console.log('👨‍💼 NOUVEL ADMIN:');
        console.log('   Nom      : nourhenAdmin');
        console.log('   Email    : nourhen.admin@citycare.com');
        console.log('   Mot de passe : Nourhen@2025');
        console.log('   Rôle     : ROLE_ADMIN');
        console.log('   Dashboard: http://localhost:8100/admin\n');
        console.log('========================================\n');

        await mongoose.disconnect();
        console.log('✅ Déconnecté de MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
};

createAdmin();
