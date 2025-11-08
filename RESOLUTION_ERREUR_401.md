# 🔧 Résolution de l'Erreur 401 - Session Expirée

## ❌ Symptômes

- Message d'erreur rouge : **"Erreur : Rôle utilisateur inconnu (business_admin)."**
- Console affiche : **"Failed to load resource: the server responded with a status of 401 (Unauthorized)"**
- Console affiche : **"[Guard] Initial fetch complete. User: Not Found"**

## 🔍 Cause

Votre session a expiré ou les cookies de session sont corrompus. Le navigateur essaie d'accéder au Dashboard mais le serveur ne reconnaît plus votre authentification.

---

## ✅ SOLUTION IMMÉDIATE (Pour résoudre le problème maintenant)

### Méthode 1 : Nettoyer les Cookies via les Outils de Développement

1. **Ouvrez les Outils de Développement** :
   - Appuyez sur `F12` ou `Ctrl + Shift + I` (Windows/Linux)
   - Ou `Cmd + Option + I` (Mac)

2. **Allez dans l'onglet "Application"** (ou "Stockage" selon votre navigateur)

3. **Dans le menu latéral gauche** :
   - Cliquez sur "Cookies"
   - Sélectionnez votre site (http://localhost:5173)

4. **Supprimez TOUS les cookies** :
   - Sélectionnez tous les cookies (`Ctrl+A`)
   - Cliquez sur le bouton "Supprimer" ou appuyez sur `Suppr`
   - Particulièrement supprimez :
     - `XSRF-TOKEN`
     - `laravel_session`
     - Tous les autres cookies de session

5. **Rechargez la page** :
   - Appuyez sur `F5` ou `Ctrl+R`
   - Ou `Cmd+R` (Mac)

6. **Reconnectez-vous** :
   - Cliquez sur "Connexion"
   - Entrez vos identifiants
   - Vous devriez maintenant pouvoir accéder au Dashboard

---

### Méthode 2 : Mode Navigation Privée (Test Rapide)

1. **Ouvrez une fenêtre de navigation privée** :
   - Chrome/Edge : `Ctrl + Shift + N`
   - Firefox : `Ctrl + Shift + P`
   - Safari : `Cmd + Shift + N`

2. **Allez sur votre site** : http://localhost:5173

3. **Connectez-vous normalement**

4. Si cela fonctionne, le problème vient bien des cookies. Revenez à la Méthode 1.

---

### Méthode 3 : Console JavaScript (Rapide)

1. **Ouvrez la Console JavaScript** :
   - Appuyez sur `F12`
   - Allez dans l'onglet "Console"

2. **Copiez et collez ce code** :

```javascript
// Supprimer tous les cookies
document.cookie.split(";").forEach(function (c) {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// Nettoyer le localStorage
localStorage.clear();

// Recharger la page
location.href = "/";
```

3. **Appuyez sur Entrée**

4. La page se rechargera automatiquement et vous serez déconnecté.

5. **Reconnectez-vous normalement**.

---

## 🛡️ CORRECTION PERMANENTE (Déjà implémentée)

Les modifications suivantes ont été apportées au code pour éviter ce problème à l'avenir :

### 1. **Amélioration de la fonction `logout()`**

```javascript
// Maintenant nettoie automatiquement :
- user.value = null
- Tous les cookies (XSRF-TOKEN, laravel_session)
- Le localStorage
- Les en-têtes CSRF
- Redirection vers l'accueil
```

### 2. **Intercepteur Axios pour les erreurs 401**

```javascript
// Détecte automatiquement les sessions expirées
// Redirige vers l'accueil si la session est invalide
```

### 3. **Message de chargement amélioré**

```
Au lieu de "Chargement..." :
- Spinner animé
- Message explicite
- Instruction de reconnexion si le chargement échoue
```

---

## 🔄 Si le problème persiste

### Backend (Laravel)

1. **Nettoyer le cache Laravel** :

```bash
cd c:\xampp\htdocs\site-carte-digitale
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan session:clear
```

2. **Vérifier les sessions dans la base de données** :

```bash
php artisan tinker
>>> DB::table('sessions')->truncate();
>>> exit
```

### Frontend (Vue.js)

1. **Nettoyer le cache npm** :

```bash
cd c:\Users\Goumou\OneDrive\Documentos\Dev\site_cartes_digitale
npm run build
```

2. **Redémarrer le serveur de développement** :

```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

---

## 📋 Checklist de Vérification

- [ ] J'ai supprimé tous les cookies du site
- [ ] J'ai nettoyé le localStorage
- [ ] J'ai rechargé la page
- [ ] Je me suis reconnecté
- [ ] Le Dashboard s'affiche correctement
- [ ] Mon rôle est bien reconnu (Particulier/Business Admin/Employé)
- [ ] Je peux naviguer dans l'application sans erreur

---

## 🆘 Support

Si le problème persiste après avoir suivi toutes ces étapes :

1. Vérifiez que le serveur backend Laravel est bien démarré (XAMPP)
2. Vérifiez que la base de données MySQL est accessible
3. Vérifiez les logs Laravel : `storage/logs/laravel.log`
4. Vérifiez la console du navigateur pour d'autres erreurs
5. Essayez de vous inscrire avec un nouveau compte pour tester

---

## 🎉 Problème Résolu ?

Une fois reconnecté, vous devriez voir :

- ✅ Votre Dashboard avec votre nom et photo
- ✅ Vos cartes correctement affichées
- ✅ Tous les menus fonctionnels
- ✅ Pas d'erreur 401 dans la console

**Bon développement ! 🚀**
