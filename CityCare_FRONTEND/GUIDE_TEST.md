# 🧪 Guide de Test - CityCare Frontend

## 📋 Prérequis

1. ✅ Backend CityCare en cours d'exécution sur `http://localhost:5000`
2. ✅ Node.js et npm installés
3. ✅ Ionic CLI installé

## 🚀 Étape 1 : Démarrer le Backend

Ouvrez un nouveau terminal PowerShell et exécutez :

```powershell
# Aller dans le dossier backend
cd "C:\Users\Nourhen\Documents\CityCare\CityCare_BACKEND"

# Démarrer le serveur (en mode dev avec nodemon)
npm run dev

# OU en mode normal
npm start
```

**Attendez que le message s'affiche :**
```
🚀 CityCare Backend Server
Server running on port 5000
```

## 🚀 Étape 2 : Démarrer le Frontend

Dans un autre terminal PowerShell (celui-ci) :

```powershell
# Nous sommes déjà dans le dossier frontend
# C:\Users\Nourhen\Documents\CityCare\CityCare_FRONTEND

# Démarrer l'application Ionic
ionic serve
```

**L'application s'ouvrira automatiquement dans votre navigateur à :**
`http://localhost:8100`

## 🧪 Étape 3 : Tester l'Inscription

1. **Accéder à la page d'inscription**
   - Cliquer sur "S'inscrire" depuis la page de connexion

2. **Remplir le formulaire**
   - Nom : `Votre Nom`
   - Prénom : `Votre Prénom`
   - Email : `test@example.com`
   - Téléphone : `+216 12 345 678` (optionnel)
   - Adresse : `Tunis, Tunisie` (optionnel)
   - Mot de passe : `password123`
   - Confirmer : `password123`

3. **Cliquer sur "S'inscrire"**
   - Vous devriez voir un message de succès
   - Vous serez redirigé vers les tabs (page d'accueil)

## 🧪 Étape 4 : Tester la Connexion

1. **Se déconnecter d'abord** (nous allons implémenter cela ensuite)
   
2. **Accéder à la page de connexion**
   - URL : `http://localhost:8100/login`

3. **Entrer les identifiants**
   - Email : `test@example.com`
   - Mot de passe : `password123`

4. **Cliquer sur "Se connecter"**
   - Vous devriez voir un message de succès
   - Vous serez redirigé vers les tabs

## 🔍 Étape 5 : Vérifier le Stockage

1. **Ouvrir les DevTools du navigateur** (F12)
2. **Aller dans l'onglet "Application" (Chrome) ou "Stockage" (Firefox)**
3. **Vérifier IndexedDB ou Local Storage**
   - Vous devriez voir :
     - `auth_token` : Votre token JWT
     - `auth_user` : Les données de l'utilisateur

## 🐛 Résolution des Problèmes

### ❌ Erreur : "Cannot connect to server"
- **Solution** : Vérifiez que le backend est démarré sur le port 5000
- Vérifiez l'URL dans `environment.ts`

### ❌ Erreur CORS
- **Solution** : Vérifiez que le backend accepte les requêtes depuis `http://localhost:8100`
- Dans le backend, le CORS devrait être configuré pour accepter `*` en développement

### ❌ Erreur : "Email already exists"
- **Solution** : Utilisez un autre email ou supprimez l'utilisateur dans MongoDB

### ❌ Page blanche
- **Solution** : Vérifiez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que tous les modules sont bien importés

## 📱 Tester sur Mobile (Optionnel)

### Android
```powershell
# Ajouter la plateforme Android
ionic capacitor add android

# Build et synchroniser
ionic build
ionic capacitor sync

# Ouvrir dans Android Studio
ionic capacitor open android
```

### iOS (sur Mac uniquement)
```bash
# Ajouter la plateforme iOS
ionic capacitor add ios

# Build et synchroniser
ionic build
ionic capacitor sync

# Ouvrir dans Xcode
ionic capacitor open ios
```

## ✅ Points à Vérifier

- [ ] Le backend répond sur `http://localhost:5000`
- [ ] Le frontend se lance sur `http://localhost:8100`
- [ ] La page de login s'affiche correctement
- [ ] Le formulaire de login fonctionne
- [ ] L'inscription crée un nouvel utilisateur
- [ ] Le token est stocké localement
- [ ] La redirection vers /tabs fonctionne
- [ ] Le guard protège les routes

## 🎉 Prochaine Étape

Une fois l'authentification testée et fonctionnelle, nous allons :
1. Ajouter un bouton de déconnexion
2. Créer les pages pour les signalements
3. Implémenter le service Report
4. Ajouter la caméra et la géolocalisation

---

**Besoin d'aide ? Vérifiez les logs dans les terminaux et la console du navigateur !**
