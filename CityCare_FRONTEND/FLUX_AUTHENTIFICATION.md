# 🔐 Flux d'Authentification - CityCare

## Comportement actuel (NORMAL) ✅

Quand vous ouvrez **http://localhost:8100**, l'application vérifie automatiquement si un **token** existe dans le stockage local :

### Si vous êtes DÉJÀ connecté (token présent) :
- ✅ L'app charge automatiquement votre session
- ✅ Vous êtes redirigé vers votre dashboard selon votre rôle :
  - **Admin** → `/admin`
  - **User** → `/dashboard`

### Si vous N'êtes PAS connecté (pas de token) :
- ✅ Vous êtes redirigé vers `/login`
- ✅ Après connexion réussie → redirection vers le dashboard approprié

---

## 🧪 Comment tester le flux complet

### Option 1 : Utiliser le bouton de déconnexion (RECOMMANDÉ)

J'ai ajouté un **bouton de déconnexion** (icône de sortie) en haut à droite de chaque dashboard.

1. Allez sur http://localhost:8100
2. Si vous êtes déjà connecté, vous verrez votre dashboard
3. **Cliquez sur l'icône de déconnexion** (en haut à droite)
4. Vous serez redirigé vers `/login`
5. Le token est supprimé
6. Vous pouvez maintenant tester la connexion à nouveau

### Option 2 : Effacer le stockage manuellement

1. Ouvrez les **DevTools** du navigateur (F12)
2. Allez dans l'onglet **Console**
3. Tapez et exécutez :
   ```javascript
   localStorage.clear()
   ```
4. Rafraîchissez la page (F5)
5. Vous serez redirigé vers `/login`

### Option 3 : Navigation privée

1. Ouvrez une fenêtre de **navigation privée/incognito** (Ctrl+Shift+N)
2. Allez sur http://localhost:8100
3. Vous verrez directement la page `/login`

---

## 📋 Flux détaillé

```
┌─────────────────────────────────────────────────────────────┐
│  L'utilisateur ouvre http://localhost:8100                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Auth service vérifie  │
              │  le token dans storage │
              └────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
    ┌──────────┐                   ┌──────────────┐
    │ Token    │                   │ Pas de token │
    │ trouvé   │                   │              │
    └──────────┘                   └──────────────┘
           │                               │
           ▼                               ▼
    ┌──────────────┐              ┌────────────────┐
    │ Charge user  │              │ Redirige vers  │
    │ et vérifie   │              │    /login      │
    │ son rôle     │              └────────────────┘
    └──────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐  ┌──────────┐
│ ROLE_   │  │ ROLE_    │
│ ADMIN   │  │ USER     │
└─────────┘  └──────────┘
    │             │
    ▼             ▼
┌─────────┐  ┌──────────┐
│ /admin  │  │/dashboard│
└─────────┘  └──────────┘
```

---

## 🎯 Routes protégées

| Route         | Protection     | Accès                           |
|---------------|----------------|---------------------------------|
| `/login`      | Aucune         | Tout le monde                   |
| `/register`   | Aucune         | Tout le monde                   |
| `/dashboard`  | `authGuard`    | Utilisateurs connectés          |
| `/admin`      | `adminGuard`   | Uniquement ROLE_ADMIN connectés |
| `/tabs`       | `authGuard`    | Utilisateurs connectés          |

---

## ✅ Ce qui est CORRECT dans le comportement actuel

Le fait que vous soyez **automatiquement redirigé vers `/dashboard`** quand vous ouvrez l'app signifie que :

1. ✅ Votre système d'authentification fonctionne
2. ✅ Le token est bien stocké et persisté
3. ✅ L'auto-login fonctionne (comme WhatsApp, Facebook, etc.)
4. ✅ L'utilisateur n'a pas besoin de se reconnecter à chaque ouverture

**C'est le comportement attendu et souhaité !** 🎉

---

## 🔧 Si vous voulez forcer l'affichage de /login au démarrage

Si vous voulez **toujours** afficher `/login` au démarrage (même avec un token valide), il faudrait modifier le comportement, mais **ce n'est pas recommandé** car :

- ❌ Mauvaise expérience utilisateur
- ❌ L'utilisateur doit se reconnecter à chaque fois
- ❌ Pas standard (aucune app moderne ne fonctionne ainsi)

---

## 📱 Test complet recommandé

1. **Déconnexion** → Cliquez sur l'icône de déconnexion
2. **Login utilisateur** → Testez avec un compte ROLE_USER
3. **Vérifier redirection** → Doit aller vers `/dashboard`
4. **Déconnexion** → Cliquez à nouveau sur déconnexion
5. **Login admin** → Testez avec un compte ROLE_ADMIN
6. **Vérifier redirection** → Doit aller vers `/admin`
7. **Fermer navigateur** → Fermez complètement le navigateur
8. **Rouvrir** → Ouvrez http://localhost:8100
9. **Vérifier** → Vous devez être toujours connecté et sur votre dashboard

---

## 🚀 Prochaines étapes

Maintenant que l'authentification fonctionne parfaitement, voulez-vous :

1. **Ajouter un formulaire de création de signalement** pour les utilisateurs ?
2. **Ajouter la gestion des utilisateurs** pour les admins ?
3. **Améliorer l'UI des dashboards** avec plus de fonctionnalités ?
4. **Ajouter des filtres** sur les listes de signalements ?

Dites-moi ce que vous voulez développer ensuite ! 🎯
