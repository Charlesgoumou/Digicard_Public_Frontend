# Endpoint API /api/account

## Description
Cet endpoint permet de mettre à jour les informations de compte utilisateur (nom, email, téléphone, mot de passe).

## Route
```
PUT /api/account
```

## Authentification
Requiert une authentification via Sanctum (utilisateur connecté).

## Paramètres acceptés

### Tous les paramètres sont optionnels, mais au moins un doit être fourni

- `name` (string, optionnel) : Nom complet de l'utilisateur
- `email` (string, optionnel, email valide) : Adresse email de connexion
- `phone` (string|null, optionnel) : Numéro de téléphone au format +224XXXXXXXXX
- `current_password` (string, requis si changement de mot de passe) : Mot de passe actuel
- `password` (string, requis si changement de mot de passe, min 8 caractères) : Nouveau mot de passe
- `password_confirmation` (string, requis si changement de mot de passe) : Confirmation du nouveau mot de passe

## Validation

### Pour le nom :
- Doit être fourni et non vide si présent

### Pour l'email :
- Doit être un email valide
- Doit être unique (ne doit pas déjà exister pour un autre utilisateur)
- Si l'email est modifié, l'utilisateur devra peut-être se reconnecter

### Pour le téléphone :
- Format : `+224XXXXXXXXX` (9 chiffres après +224)
- Peut être null pour supprimer le téléphone

### Pour le mot de passe :
- `current_password` est requis pour valider l'identité de l'utilisateur
- `password` doit contenir au moins 8 caractères
- `password` et `password_confirmation` doivent correspondre
- `current_password` doit correspondre au mot de passe actuel de l'utilisateur

## Exemple de requête

```json
PUT /api/account
{
  "name": "Nouveau Nom"
}
```

```json
PUT /api/account
{
  "email": "nouveau@email.com"
}
```

```json
PUT /api/account
{
  "phone": "+224123456789"
}
```

```json
PUT /api/account
{
  "current_password": "ancienMotDePasse",
  "password": "nouveauMotDePasse",
  "password_confirmation": "nouveauMotDePasse"
}
```

## Réponse en cas de succès

```json
{
  "message": "Informations mises à jour avec succès",
  "user": {
    "id": 1,
    "name": "Nouveau Nom",
    "email": "nouveau@email.com",
    "phone": "+224123456789",
    ...
  }
}
```

## Réponses d'erreur

### 422 - Erreur de validation
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

### 401 - Non authentifié
```json
{
  "message": "Unauthenticated."
}
```

### 400 - Mot de passe actuel incorrect
```json
{
  "message": "Le mot de passe actuel est incorrect."
}
```

## Implémentation Laravel suggérée

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/account', [AccountController::class, 'update']);
});

// app/Http/Controllers/AccountController.php
public function update(Request $request)
{
    $user = $request->user();
    $validated = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|regex:/^\+224[0-9]{9}$/',
        'current_password' => 'required_with:password',
        'password' => 'required_with:current_password|min:8|confirmed',
    ]);

    // Vérifier le mot de passe actuel si changement de mot de passe
    if ($request->has('current_password')) {
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 400);
        }
        $validated['password'] = Hash::make($validated['password']);
    }

    // Mettre à jour uniquement les champs fournis
    $user->fill($validated);
    $user->save();

    return response()->json([
        'message' => 'Informations mises à jour avec succès',
        'user' => $user->fresh()
    ]);
}
```



