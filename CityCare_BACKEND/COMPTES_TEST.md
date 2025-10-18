# 🔐 Comptes de Test - CityCare

## Créer les comptes de test

Pour créer automatiquement les comptes admin et utilisateur de test, exécutez :

```bash
cd CityCare_BACKEND
node create-admin.js
```

---

## 📋 Identifiants de connexion

### 👨‍💼 Compte Administrateur

- **Email** : `admin@citycare.com`
- **Mot de passe** : `Admin@123`
- **Rôle** : `ROLE_ADMIN`
- **Dashboard** : http://localhost:8100/admin

**Fonctionnalités :**
- ✅ Voir tous les signalements
- ✅ Statistiques globales
- ✅ Gestion des utilisateurs
- ✅ Modifier le statut des signalements
- ✅ Assigner des signalements aux agents

---

### 👤 Compte Utilisateur

- **Email** : `user@citycare.com`
- **Mot de passe** : `User@123`
- **Rôle** : `ROLE_USER`
- **Dashboard** : http://localhost:8100/dashboard

**Fonctionnalités :**
- ✅ Créer des signalements
- ✅ Voir ses propres signalements
- ✅ Commenter ses signalements
- ✅ Modifier ses signalements

---

## 🧪 Tester le flux d'authentification

### Test 1 : Connexion Admin

1. Ouvrez http://localhost:8100
2. Si vous êtes connecté, cliquez sur déconnexion
3. Entrez les identifiants admin :
   - Email : `admin@citycare.com`
   - Mot de passe : `Admin@123`
4. Cliquez sur "Se connecter"
5. ✅ Vous devez être redirigé vers `/admin`
6. ✅ Vous devez voir les statistiques globales

### Test 2 : Connexion Utilisateur

1. Déconnectez-vous (icône en haut à droite)
2. Entrez les identifiants utilisateur :
   - Email : `user@citycare.com`
   - Mot de passe : `User@123`
3. Cliquez sur "Se connecter"
4. ✅ Vous devez être redirigé vers `/dashboard`
5. ✅ Vous devez voir vos signalements

### Test 3 : Protection des routes

1. Connectez-vous en tant qu'utilisateur normal
2. Essayez d'accéder manuellement à http://localhost:8100/admin
3. ✅ Vous devez être redirigé vers `/dashboard` (accès refusé)

---

## 🗑️ Supprimer les comptes de test

Si vous voulez supprimer ces comptes de test de la base de données :

```bash
# Ouvrir MongoDB Shell
mongosh

# Sélectionner la base de données
use citycare_test

# Supprimer les comptes de test
db.users.deleteOne({ email: "admin@citycare.com" })
db.users.deleteOne({ email: "user@citycare.com" })

# Vérifier
db.users.find()
```

---

## 📝 Créer d'autres comptes manuellement

### Via l'API (Postman / Thunder Client)

**POST** `http://localhost:5000/api/auth/register`

```json
{
  "name": "Votre Nom",
  "email": "email@example.com",
  "password": "VotreMotDePasse123",
  "phone": "0612345678",
  "role": "ROLE_USER"
}
```

> **Note** : Par défaut, les utilisateurs créés via `/register` ont le rôle `ROLE_USER`. Pour créer un admin, il faut modifier le rôle directement dans la base de données ou utiliser le script `create-admin.js`.

### Via MongoDB directement

```javascript
db.users.updateOne(
  { email: "email@example.com" },
  { $set: { role: "ROLE_ADMIN" } }
)
```

---

## 🔒 Sécurité

⚠️ **IMPORTANT** : Ces identifiants sont uniquement pour le développement et les tests locaux.

**Pour la production :**
- ❌ NE PAS utiliser ces mots de passe
- ✅ Utiliser des mots de passe forts et uniques
- ✅ Activer l'authentification à deux facteurs
- ✅ Utiliser des variables d'environnement pour les secrets
- ✅ Changer les mots de passe par défaut

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez que MongoDB est démarré
2. Vérifiez que le backend est lancé (`npm run dev`)
3. Vérifiez que le frontend est lancé (`ionic serve`)
4. Vérifiez les logs du backend pour les erreurs
5. Ouvrez la console du navigateur (F12) pour voir les erreurs frontend
