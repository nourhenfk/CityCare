# 📚 Guide d'Apprentissage Ionic - CityCare Frontend

## 🎯 Qu'est-ce qu'Ionic ?

**Ionic** est un framework open-source pour créer des applications mobiles hybrides avec des technologies web (HTML, CSS, JavaScript/TypeScript). Il utilise Angular, React ou Vue et permet de :
- Créer une seule application qui fonctionne sur iOS, Android et le web
- Utiliser des composants UI natifs pré-construits
- Accéder aux fonctionnalités natives du téléphone (caméra, GPS, etc.)

## 📁 Structure du Projet Ionic

```
CityCare_FRONTEND/
├── src/
│   ├── app/                    # Code principal de l'application
│   │   ├── tabs/              # Navigation par onglets (structure principale)
│   │   ├── tab1/, tab2/, tab3/ # Pages des onglets
│   │   ├── app.module.ts      # Module racine Angular
│   │   └── app-routing.module.ts # Configuration des routes
│   ├── assets/                # Images, icônes, fichiers statiques
│   ├── theme/                 # Styles globaux et variables CSS
│   ├── environments/          # Configuration dev/prod
│   └── index.html             # Point d'entrée HTML
├── capacitor.config.ts        # Configuration Capacitor (accès natif)
├── ionic.config.json          # Configuration Ionic
└── package.json               # Dépendances npm
```

## 🔑 Concepts Clés

### 1. **Pages Ionic**
- Une page = un écran de votre application
- Composée de 3 fichiers :
  - `.page.html` → Structure (template)
  - `.page.scss` → Styles CSS
  - `.page.ts` → Logique TypeScript

### 2. **Composants Ionic**
- Éléments UI pré-construits : boutons, cartes, listes, etc.
- Exemple : `<ion-button>`, `<ion-card>`, `<ion-input>`
- Documentation : https://ionicframework.com/docs/components

### 3. **Navigation**
- Par onglets (tabs) : navigation en bas de l'écran
- Par pile (stack) : navigation avec retour arrière
- Gérée par Angular Router

### 4. **Services Angular**
- Classes TypeScript pour la logique métier
- Exemple : authentification, appels API
- Partagés entre plusieurs pages

## 🚀 Notre Plan de Développement

### Phase 1 : Configuration et Structure ✅
- [x] Créer le projet Ionic
- [ ] Configurer l'environnement (API URL)
- [ ] Installer les dépendances nécessaires

### Phase 2 : Authentification 🔐
- [ ] Créer les pages Login et Register
- [ ] Créer le service d'authentification
- [ ] Implémenter le stockage du token JWT
- [ ] Créer un guard pour protéger les routes

### Phase 3 : Gestion des Signalements 📍
- [ ] Page liste des signalements
- [ ] Page créer un signalement (avec photo et GPS)
- [ ] Page détails d'un signalement
- [ ] Service pour les appels API

### Phase 4 : Interface Admin 👨‍💼
- [ ] Dashboard admin
- [ ] Gestion des statuts
- [ ] Liste des utilisateurs

### Phase 5 : Fonctionnalités Avancées ⚡
- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Géolocalisation en temps réel

## 🎓 Prochaines Étapes

1. **Comprendre la structure générée**
2. **Configurer l'environnement de développement**
3. **Créer les pages d'authentification**
4. **Connecter au backend**

---

**Note** : Ce guide sera mis à jour au fur et à mesure de notre progression !
