# 📋 Documentation - Enregistrement des Heures de Connexion/Déconnexion

## ✅ Fonctionnalité Ajoutée

Une nouvelle fonctionnalité a été intégrée à votre projet pour **enregistrer automatiquement l'heure de connexion et de déconnexion** de chaque employé lorsqu'il se connecte ou se déconnecte de l'application.

## 🎯 Ce qui a été fait

### 1. **Base de données (Prisma)**
- ✅ Nouveau modèle `Session` dans `backend/prisma/schema.prisma`
- ✅ Migration créée et appliquée : `20260125124301_add_session_model`
- ✅ Le modèle enregistre :
  - `heure_connexion` : Date/heure de connexion
  - `heure_deconnexion` : Date/heure de déconnexion (null si toujours connecté)
  - `duree_minutes` : Durée de la session en minutes (calculée automatiquement)
  - `ip_address` : Adresse IP (optionnel)
  - `user_agent` : User agent du navigateur (optionnel)

### 2. **Backend**
- ✅ **Service** : `backend/src/services/sessionService.js`
  - `createSession()` : Crée une session lors de la connexion
  - `updateSessionLogout()` : Met à jour la session avec l'heure de déconnexion
  - `getSessionsByUser()` : Récupère toutes les sessions d'un utilisateur
  - `getAllSessions()` : Récupère toutes les sessions (pour les admins)
  - `getActiveSession()` : Récupère la session active d'un utilisateur

- ✅ **Controller** : `backend/src/controllers/sessionController.js`
  - Gère les endpoints API pour les sessions

- ✅ **Routes** : `backend/src/routes/sessionRoutes.js`
  - `POST /api/sessions` : Créer une session
  - `POST /api/sessions/logout` : Fermer une session
  - `GET /api/sessions/user/:id` : Sessions d'un utilisateur
  - `GET /api/sessions/active/:id` : Session active
  - `GET /api/sessions` : Toutes les sessions (admins uniquement)

- ✅ **Modification de la route login** : `backend/index.js`
  - Crée automatiquement une session lors de la connexion

- ✅ **Nouvelle route logout** : `POST /api/auth/logout`
  - Enregistre l'heure de déconnexion avant de déconnecter l'utilisateur

### 3. **Frontend**
- ✅ **Modification de `useAuth.jsx`**
  - La fonction `logout()` appelle maintenant l'API `/api/auth/logout` avant de supprimer le token
  - Gestion d'erreur non-bloquante (la déconnexion fonctionne même si l'API échoue)

## 📍 Où sont les fichiers ?

### Backend
```
backend/
├── prisma/
│   ├── schema.prisma (modifié - modèle Session ajouté)
│   └── migrations/
│       └── 20260125124301_add_session_model/
│           └── migration.sql
├── src/
│   ├── services/
│   │   └── sessionService.js (nouveau)
│   ├── controllers/
│   │   └── sessionController.js (nouveau)
│   └── routes/
│       └── sessionRoutes.js (nouveau)
└── index.js (modifié - routes login/logout)
```

### Frontend
```
frontend/
└── src/
    └── hooks/
        └── useAuth.jsx (modifié - fonction logout)
```

## 🔄 Comment ça fonctionne ?

### Lors de la connexion :
1. L'utilisateur se connecte via `/api/auth/login`
2. Le backend crée automatiquement une session avec `heure_connexion = maintenant`
3. L'utilisateur reçoit son token JWT comme avant

### Lors de la déconnexion :
1. L'utilisateur clique sur "Se déconnecter"
2. Le frontend appelle `logout()` dans `useAuth.jsx`
3. `logout()` appelle d'abord `/api/auth/logout` pour enregistrer l'heure de déconnexion
4. Le backend met à jour la session avec `heure_deconnexion = maintenant` et calcule `duree_minutes`
5. Le frontend supprime le token et déconnecte l'utilisateur

## 🛡️ Sécurité et Robustesse

- ✅ **Non-bloquant** : Si l'enregistrement de la session échoue, la connexion/déconnexion fonctionne quand même
- ✅ **Authentification** : Les routes de session nécessitent un token valide (sauf création lors du login)
- ✅ **Permissions** : Seuls les admins peuvent voir toutes les sessions

## 📊 Utilisation des données

Vous pouvez maintenant :
- Voir l'historique des connexions/déconnexions de chaque employé
- Calculer le temps de travail total
- Analyser les patterns de connexion
- Détecter les sessions actives

### Exemple de requête pour obtenir les sessions d'un utilisateur :
```javascript
GET /api/sessions/user/:id
Authorization: Bearer <token>
```

### Exemple de requête pour obtenir toutes les sessions (admin) :
```javascript
GET /api/sessions?limit=100&offset=0
Authorization: Bearer <token>
```

## ⚠️ Important

1. **Migration appliquée** : La migration Prisma a déjà été créée et appliquée. Votre base de données contient maintenant la table `sessions`.

2. **Pas de changement de conception** : Cette fonctionnalité s'intègre parfaitement dans votre architecture existante :
   - Utilise le même pattern que les autres services (presenceService, absenceService, etc.)
   - Suit les mêmes conventions de nommage
   - N'affecte pas les fonctionnalités existantes

3. **Rétrocompatibilité** : 
   - Les utilisateurs existants continuent de fonctionner normalement
   - Les anciennes sessions ne sont pas enregistrées (seulement les nouvelles connexions)

4. **Performance** : 
   - Les appels API sont asynchrones et non-bloquants
   - La création/mise à jour de session est rapide

## 🚀 Prochaines étapes (optionnel)

Si vous souhaitez afficher ces données dans l'interface :
1. Créer une page "Historique des Sessions" dans le dashboard
2. Afficher les sessions dans le profil utilisateur
3. Créer des statistiques de temps de travail

## 📝 Notes techniques

- Le modèle `Session` est lié au modèle `Utilisateur` via `utilisateurId`
- Les sessions actives ont `heure_deconnexion = null`
- La durée est calculée automatiquement en minutes lors de la déconnexion
- L'IP et le user agent sont optionnels mais enregistrés si disponibles

---

**✅ Fonctionnalité prête à l'emploi !** Aucune action supplémentaire n'est nécessaire. Les heures de connexion/déconnexion sont maintenant enregistrées automatiquement.
