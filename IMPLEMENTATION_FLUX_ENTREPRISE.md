# 🏢 Implémentation du Nouveau Flux Entreprise

## 📋 Vue d'ensemble

Cette implémentation réorganise complètement le flux de commande entreprise avec un système de "slots" d'employés.

---

## 🎯 Objectifs

### Pour le Business Admin :

1. **Commande entreprise** : Choisir nombre d'employés et cartes par employé
2. **Affichage du devis** : Voir le montant avant validation
3. **Enregistrement** : Créer des "slots" d'employés non assignés
4. **Gestion des slots** : Assigner nom + email à chaque slot
5. **Gestion des employés** : Ajouter/retirer cartes, supprimer employé
6. **Restriction** : Ne peut pas retirer de carte si l'employé a configuré sa carte

### Pour l'Employé :

1. **Première connexion** : Changement de mot de passe obligatoire après 2FA
2. **Dashboard** : Voir sa commande avec le nombre de cartes assignées
3. **Paramétrage** : Configurer sa carte selon le nombre défini
4. **Profil** : Afficher son profil public

---

## 🗄️ Structure de Données

### Table `orders` - Nouveaux champs :

```sql
- total_employees (int) : Nombre total d'employés
- employee_slots (JSON) : [
    {
      "slot_number": 1,
      "cards_quantity": 3,
      "employee_id": null,
      "employee_name": null,
      "employee_email": null,
      "is_assigned": false,
      "is_configured": false
    },
    ...
  ]
- cards_per_employee (int) : Nombre de cartes par employé (si uniforme)
```

### Table `order_employees` - Modifications :

```sql
- Lien avec order_id et employee_id
- card_quantity : Nombre de cartes pour cet employé
- is_configured : L'employé a-t-il paramétré sa carte ?
- slot_number : Numéro du slot assigné
```

---

## 🎨 Frontend - OrderModal

### Nouveau Flux pour "Pour Mon Entreprise"

#### Étape 1 : Choix du nombre d'employés

```vue
<template>
  <div>
    <h2>Combien d'employés souhaitez-vous équiper ?</h2>
    <input v-model.number="totalEmployees" type="number" min="1" max="100" placeholder="Ex: 5" />
    <button @click="goToCardsSelection">Suivant</button>
  </div>
</template>
```

#### Étape 2 : Choix du nombre de cartes par employé

```vue
<template>
  <div>
    <h2>Combien de cartes pour chaque employé ?</h2>

    <!-- Option 1 : Même nombre pour tous -->
    <div>
      <label>
        <input type="radio" v-model="cardsMode" value="uniform" />
        Même nombre de cartes pour tous
      </label>
      <input v-if="cardsMode === 'uniform'" v-model.number="uniformCardsQuantity" type="number" min="1" />
    </div>

    <!-- Option 2 : Personnalisé par employé -->
    <div>
      <label>
        <input type="radio" v-model="cardsMode" value="custom" />
        Nombre de cartes personnalisé
      </label>
      <div v-if="cardsMode === 'custom'" class="space-y-2">
        <div v-for="i in totalEmployees" :key="i">
          <label>Employé {{ i }} :</label>
          <input v-model.number="customCards[i - 1]" type="number" min="1" />
        </div>
      </div>
    </div>

    <button @click="showQuote">Afficher Mon Devis</button>
  </div>
</template>
```

#### Étape 3 : Affichage du devis

```vue
<template>
  <div>
    <h2>📊 Votre Devis</h2>

    <div class="summary">
      <div v-for="slot in employeeSlots" :key="slot.slot_number">
        <p>Employé {{ slot.slot_number }} : {{ slot.cards_quantity }} carte(s)</p>
      </div>

      <hr />

      <div class="totals">
        <p><strong>Nombre total d'employés :</strong> {{ totalEmployees }}</p>
        <p><strong>Nombre total de cartes :</strong> {{ totalCards }}</p>
        <p><strong>Prix unitaire :</strong> 20 000 GNF</p>
        <p><strong>Prix total :</strong> {{ formatPrice(totalPrice) }} GNF</p>
        <p><strong>Abonnement annuel :</strong> 40 000 GNF/an</p>
      </div>
    </div>

    <button @click="saveOrder" :disabled="isSaving" class="btn-primary">
      {{ isConnected ? "Enregistrer Ma Commande" : "Me Connecter et Enregistrer" }}
    </button>
  </div>
</template>
```

---

## 🖥️ Backend - Modifications

### OrderController - Méthode `store()` pour entreprise

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'order_type' => 'required|in:personal,business',
        'total_employees' => 'required_if:order_type,business|integer|min:1',
        'employee_slots' => 'required_if:order_type,business|array',
        'card_quantity' => 'required|integer|min:1',
    ]);

    // Créer les slots d'employés
    $slots = [];
    foreach ($validated['employee_slots'] as $slot) {
        $slots[] = [
            'slot_number' => $slot['slot_number'],
            'cards_quantity' => $slot['cards_quantity'],
            'employee_id' => null,
            'employee_name' => null,
            'employee_email' => null,
            'is_assigned' => false,
            'is_configured' => false,
        ];
    }

    $order = Order::create([
        'user_id' => $request->user()->id,
        'order_number' => Order::generateOrderNumber(),
        'order_type' => $validated['order_type'],
        'total_employees' => $validated['total_employees'] ?? 0,
        'employee_slots' => $slots,
        'card_quantity' => $validated['card_quantity'],
        'unit_price' => 20000,
        'total_price' => $validated['card_quantity'] * 20000,
        'annual_subscription' => 40000,
        'status' => 'pending',
    ]);

    return response()->json($order, 201);
}
```

---

## 👥 Section "Gérer Mes Employés" - Nouveau Design

```vue
<template>
  <div class="employee-management">
    <h2>Gérer les Employés</h2>

    <div v-for="slot in employeeSlots" :key="slot.slot_number" class="employee-slot">
      <!-- Slot non assigné -->
      <div v-if="!slot.is_assigned" class="unassigned-slot">
        <div class="slot-header">
          <span class="slot-badge">Employé {{ slot.slot_number }}</span>
          <span class="cards-badge">{{ slot.cards_quantity }} carte(s)</span>
          <span class="status-badge pending">⏳ Non assigné</span>
        </div>

        <form @submit.prevent="assignEmployee(slot)" class="assign-form">
          <input v-model="slot.employee_name" type="text" placeholder="Nom complet" required />
          <input v-model="slot.employee_email" type="email" placeholder="Email" required />
          <button type="submit" class="btn-assign">✓ Assigner cet employé</button>
        </form>
      </div>

      <!-- Slot assigné -->
      <div v-else class="assigned-slot" @click="openEmployeeModal(slot)">
        <div class="slot-header">
          <span class="slot-badge">Employé {{ slot.slot_number }}</span>
          <strong class="employee-name">{{ slot.employee_name }}</strong>
          <span class="cards-badge">{{ slot.cards_quantity }} carte(s)</span>
          <span :class="slot.is_configured ? 'status-badge verified' : 'status-badge pending'">
            {{ slot.is_configured ? "✓ Configuré" : "⏳ Non configuré" }}
          </span>
        </div>
        <p class="employee-email">{{ slot.employee_email }}</p>
      </div>
    </div>
  </div>
</template>
```

---

## 🔐 Flux de Première Connexion Employé

### 1. Login avec mot de passe temporaire

```javascript
// useAuth.js - Modification de la fonction login()
if (response.data.password_reset_required) {
  // Redirection vers page de changement de mot de passe
  router.push({ name: "EmployeeSetPassword" });
}
```

### 2. Page de changement de mot de passe

```vue
<template>
  <div class="change-password-page">
    <h1>Définissez votre nouveau mot de passe</h1>
    <p>Pour des raisons de sécurité, veuillez changer votre mot de passe temporaire.</p>

    <form @submit.prevent="changePassword">
      <div>
        <label>Nouveau mot de passe :</label>
        <input v-model="newPassword" type="password" minlength="8" required />
      </div>

      <div>
        <label>Confirmer le mot de passe :</label>
        <input v-model="confirmPassword" type="password" required />
      </div>

      <button type="submit">Définir mon mot de passe</button>
    </form>
  </div>
</template>
```

---

## 🎨 Dashboard Employé

```vue
<template>
  <div class="employee-dashboard">
    <h1>Bienvenue, {{ user.name }} !</h1>

    <!-- Affichage de la commande assignée -->
    <div v-if="assignedOrder" class="my-order-card">
      <h3>Ma Commande</h3>
      <p><strong>Numéro :</strong> {{ assignedOrder.order_number }}</p>
      <p><strong>Nombre de cartes :</strong> {{ assignedOrder.card_quantity }}</p>
      <p>
        <strong>Statut :</strong>
        <span :class="assignedOrder.is_configured ? 'text-green-400' : 'text-yellow-400'">
          {{ assignedOrder.is_configured ? "✓ Configurée" : "⏳ À configurer" }}
        </span>
      </p>
    </div>

    <div class="actions">
      <button @click="goToSettings">⚙️ Paramétrez ma Carte</button>
      <button @click="viewProfile">👀 Afficher mon Profil</button>
    </div>
  </div>
</template>
```

---

## 🔒 Restrictions

### Backend - Modification de `removeCard()`

```php
public function removeCard(Request $request, User $employee)
{
    // Vérifier si l'employé a déjà configuré sa carte
    $orderEmployee = OrderEmployee::where('employee_id', $employee->id)
        ->where('is_configured', true)
        ->first();

    if ($orderEmployee) {
        return response()->json([
            'message' => 'Impossible de retirer une carte. Cet employé a déjà configuré sa carte.'
        ], 403);
    }

    // Continuer le retrait...
}
```

### Frontend - Masquer le bouton "Retirer une carte"

```vue
<template>
  <div class="employee-actions">
    <button @click="addCard">➕ Ajouter une carte</button>

    <!-- N'afficher que si l'employé n'a PAS configuré -->
    <button v-if="!selectedEmployee.is_configured" @click="removeCard" class="btn-warning">➖ Retirer une carte</button>

    <button @click="deleteEmployee" class="btn-danger">🗑️ Supprimer l'employé</button>
  </div>
</template>
```

---

## 📊 Résumé des Fichiers à Modifier

### Backend (Laravel)

- ✅ Migration : `add_employee_slots_to_orders_table.php`
- ✅ Model : `Order.php`
- ⏳ Controller : `OrderController.php` (store, update)
- ⏳ Controller : `EmployeeController.php` (assignSlot, removeCard restriction)

### Frontend (Vue.js)

- ⏳ Component : `OrderModal.vue` (nouveau flux)
- ⏳ View : `DashboardView.vue` (section employés)
- ⏳ View : `EmployeeSetPasswordView.vue` (changement mdp)
- ⏳ Composable : `useAuth.js` (gestion password_reset_required)

---

## 🚀 Plan d'Implémentation

1. ✅ **Étape 1** : Créer migration et modèle (FAIT)
2. ⏳ **Étape 2** : Modifier OrderModal pour flux entreprise
3. ⏳ **Étape 3** : Adapter OrderController pour créer les slots
4. ⏳ **Étape 4** : Refonte section "Gérer les employés"
5. ⏳ **Étape 5** : Ajouter restrictions (pas de retrait si configuré)
6. ⏳ **Étape 6** : Page changement mot de passe employé
7. ⏳ **Étape 7** : Adapter Dashboard employé
8. ⏳ **Étape 8** : Tests et débogage

---

## ⚠️ Points d'Attention

1. **Synchronisation** : Les slots doivent rester synchronisés avec la table `order_employees`
2. **Sécurité** : Vérifier les autorisations à chaque étape
3. **UX** : Messages clairs pour guider l'utilisateur
4. **Performance** : Optimiser les requêtes pour les grosses commandes
5. **Validation** : Valider toutes les entrées côté frontend ET backend

---

## 📝 Notes Importantes

- **Prix unitaire** : 20 000 GNF par carte
- **Abonnement** : 40 000 GNF/an (inchangé)
- **Limite employés** : 1-100 par commande
- **Limite cartes/employé** : 1-10 recommandé

---

**Document créé le :** 24/10/2025  
**Statut :** En cours d'implémentation 🚧
