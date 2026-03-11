<template>
  <div class="space-y-6">
    <!-- Chargement -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Formulaire -->
    <div v-else class="space-y-6">
      <!-- 1. Sélection du profil -->
      <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="text-3xl">👤</span> Quel est votre profil principal ?
        </h2>
        <p class="text-slate-300 text-sm mb-4">
          Cette sélection permettra d'adapter le formulaire et l'assistance IA à votre profil
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <button
            v-for="profileOption in profileOptions"
            :key="profileOption.value"
            @click="selectProfile(profileOption.value)"
            :class="[
              'p-6 rounded-lg border-2 transition-all duration-300',
              selectedProfile === profileOption.value
                ? 'border-indigo-500 bg-indigo-900/30 shadow-lg scale-105'
                : 'border-slate-600 bg-slate-700 hover:border-slate-500',
            ]"
          >
            <div class="text-4xl mb-3">{{ profileOption.icon }}</div>
            <div class="text-white font-semibold text-lg">{{ profileOption.label }}</div>
            <div v-if="selectedProfile === profileOption.value" class="mt-2 text-indigo-400 text-sm">✓ Sélectionné</div>
          </button>
        </div>

        <input type="hidden" v-model="form.profile_type" />
      </div>

      <!-- Formulaire adaptatif uniquement si profil sélectionné -->
      <div v-if="selectedProfile" ref="formContainer">
        <!-- Upload de fichier pour tous les profils (en première ligne) -->
        <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">📄</span> {{ selectedProfile === 'restaurant' ? 'Téléverser votre menu' : 'Téléverser un document' }}
          </h2>
          <p class="text-slate-300 text-sm mb-4">
            <span v-if="selectedProfile === 'restaurant'">
              Téléversez une image ou un PDF de votre menu. L'IA extraira automatiquement les plats, boissons et leurs prix pour remplir votre menu ci-dessous.
            </span>
            <span v-else>
              Téléversez votre CV, lettre de motivation ou tout autre document. L'IA extraira automatiquement les informations pour remplir les champs ci-dessous selon votre profil.
            </span>
          </p>
          
          <div class="space-y-4">
            <div>
              <input
                ref="documentInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleDocumentUpload"
                class="hidden"
                id="document-upload-input"
                :disabled="isExtractingDocument"
              />
              <label
                for="document-upload-input"
                :class="[
                  'block cursor-pointer bg-slate-700 border-2 border-dashed rounded-lg px-6 py-8 text-center transition-colors',
                  isExtractingDocument ? 'border-slate-500 opacity-50 cursor-not-allowed' : 'border-slate-600 hover:border-indigo-500'
                ]"
              >
                <div v-if="!isExtractingDocument" class="space-y-2">
                  <svg class="w-12 h-12 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p class="text-slate-300 font-medium">{{ selectedProfile === 'restaurant' ? 'Cliquez pour téléverser votre menu' : 'Cliquez pour téléverser un document' }}</p>
                  <p class="text-slate-400 text-xs">PDF, JPG, PNG (max 2MB)</p>
                </div>
                <div v-else class="space-y-2">
                  <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                  <p class="text-slate-300 font-medium">Extraction en cours...</p>
                </div>
              </label>
            </div>
            
            <div v-if="extractionMessage" :class="[
              'p-4 rounded-lg text-sm',
              extractionError ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-green-500/20 border border-green-500/50 text-green-400'
            ]">
              {{ extractionMessage }}
            </div>
          </div>
        </div>

        <!-- 2. Informations personnelles (masqué pour restaurant) -->
        <div v-if="selectedProfile !== 'restaurant'" class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">📝</span> Informations personnelles
          </h2>

          <div class="space-y-4">
            <!-- Bio -->
            <div>
              <label class="block text-slate-300 font-medium mb-2">Biographie</label>
              <textarea
                v-model="form.bio"
                rows="4"
                class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                :placeholder="selectedProfile === 'restaurant' ? 'Décrivez votre restaurant, votre spécialité culinaire, votre histoire...' : 'Décrivez-vous en quelques lignes...'"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Menu Restaurant (uniquement pour le profil restaurant) -->
        <div v-if="selectedProfile === 'restaurant'" class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">🍽️</span> Mon Menu
          </h2>

          <!-- Plats -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-semibold text-white">Plats</h3>
              <button
                @click="addDish"
                type="button"
                class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter un plat
              </button>
            </div>

            <div class="space-y-6">
              <div
                v-for="(dish, index) in form.menu?.dishes || []"
                :key="index"
                class="bg-slate-700 p-6 rounded-lg border border-slate-600"
              >
                <div class="flex justify-between items-start mb-4">
                  <h4 class="text-white font-semibold text-lg">Plat {{ index + 1 }}</h4>
                  <button
                    @click="removeDish(index)"
                    type="button"
                    class="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nom du plat -->
                  <div>
                    <label class="block text-slate-300 text-sm font-medium mb-1">Nom du plat *</label>
                    <input
                      v-model="dish.name"
                      type="text"
                      class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="Ex: Poulet Yassa"
                      required
                    />
                  </div>

                  <!-- Prix -->
                  <div>
                    <label class="block text-slate-300 text-sm font-medium mb-1">Prix (GNF) *</label>
                    <input
                      v-model.number="dish.price"
                      type="number"
                      min="0"
                      step="100"
                      class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="Ex: 15000"
                      required
                    />
                  </div>

                  <!-- Description -->
                  <div class="md:col-span-2">
                    <label class="block text-slate-300 text-sm font-medium mb-1">Description</label>
                    <textarea
                      v-model="dish.description"
                      rows="2"
                      class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="Description du plat..."
                    ></textarea>
                  </div>

                  <!-- Image du plat -->
                  <div class="md:col-span-2">
                    <label class="block text-slate-300 text-sm font-medium mb-1">Image du plat</label>
                    <div class="flex items-center gap-4">
                      <input
                        :ref="`dishImageInput-${index}`"
                        type="file"
                        accept="image/*"
                        @change="(e) => handleDishImageUpload(e, index)"
                        class="hidden"
                        :id="`dish-image-${index}`"
                      />
                      <label
                        :for="`dish-image-${index}`"
                        class="cursor-pointer bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white hover:bg-slate-500 transition-colors"
                      >
                        {{ dish.image ? 'Changer l\'image' : 'Choisir une image' }}
                      </label>
                      <div v-if="dish.image" class="flex items-center gap-2">
                        <img :src="dish.image" alt="Aperçu" class="w-20 h-20 object-cover rounded-lg" />
                        <button
                          @click="openCropModal('dish', index)"
                          type="button"
                          class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Rogner
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Disponibilité -->
                  <div>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="dish.available"
                        type="checkbox"
                        class="w-4 h-4 text-indigo-600 bg-slate-600 border-slate-500 rounded focus:ring-indigo-500"
                      />
                      <span class="text-slate-300 text-sm font-medium">Disponible</span>
                    </label>
                  </div>

                  <!-- Accompagnements -->
                  <div>
                    <label class="flex items-center gap-2 cursor-pointer mb-2">
                      <input
                        v-model="dish.hasSides"
                        type="checkbox"
                        @change="dish.hasSides ? (dish.sides = dish.sides || []) : (dish.sides = [])"
                        class="w-4 h-4 text-indigo-600 bg-slate-600 border-slate-500 rounded focus:ring-indigo-500"
                      />
                      <span class="text-slate-300 text-sm font-medium">Avec accompagnements</span>
                    </label>
                    <div v-if="dish.hasSides" class="mt-2 space-y-2">
                      <div v-for="(side, sideIndex) in dish.sides" :key="sideIndex" class="flex items-center gap-2">
                        <input
                          v-model="dish.sides[sideIndex]"
                          type="text"
                          class="flex-1 bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                          placeholder="Ex: Riz, Frites, Salade"
                        />
                        <button
                          @click="dish.sides.splice(sideIndex, 1)"
                          type="button"
                          class="text-red-400 hover:text-red-300"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <button
                        @click="dish.sides.push('')"
                        type="button"
                        class="text-indigo-400 hover:text-indigo-300 text-sm"
                      >
                        + Ajouter un accompagnement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Boissons -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-semibold text-white">Boissons</h3>
              <button
                @click="addDrink"
                type="button"
                class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter une boisson
              </button>
            </div>

            <div class="space-y-6">
              <div
                v-for="(drink, index) in form.menu?.drinks || []"
                :key="index"
                class="bg-slate-700 p-6 rounded-lg border border-slate-600"
              >
                <div class="flex justify-between items-start mb-4">
                  <h4 class="text-white font-semibold text-lg">Boisson {{ index + 1 }}</h4>
                  <button
                    @click="removeDrink(index)"
                    type="button"
                    class="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nom de la boisson -->
                  <div>
                    <label class="block text-slate-300 text-sm font-medium mb-1">Nom de la boisson *</label>
                    <input
                      v-model="drink.name"
                      type="text"
                      class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="Ex: Jus de Bissap"
                      required
                    />
                  </div>

                  <!-- Prix -->
                  <div>
                    <label class="block text-slate-300 text-sm font-medium mb-1">Prix (GNF) *</label>
                    <input
                      v-model.number="drink.price"
                      type="number"
                      min="0"
                      step="100"
                      class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="Ex: 3000"
                      required
                    />
                  </div>

                  <!-- Image de la boisson -->
                  <div class="md:col-span-2">
                    <label class="block text-slate-300 text-sm font-medium mb-1">Image de la boisson</label>
                    <div class="flex items-center gap-4">
                      <input
                        :ref="`drinkImageInput-${index}`"
                        type="file"
                        accept="image/*"
                        @change="(e) => handleDrinkImageUpload(e, index)"
                        class="hidden"
                        :id="`drink-image-${index}`"
                      />
                      <label
                        :for="`drink-image-${index}`"
                        class="cursor-pointer bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white hover:bg-slate-500 transition-colors"
                      >
                        {{ drink.image ? 'Changer l\'image' : 'Choisir une image' }}
                      </label>
                      <div v-if="drink.image" class="flex items-center gap-2">
                        <img :src="drink.image" alt="Aperçu" class="w-20 h-20 object-cover rounded-lg" />
                        <button
                          @click="openCropModal('drink', index)"
                          type="button"
                          class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Rogner
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Disponibilité -->
                  <div>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="drink.available"
                        type="checkbox"
                        class="w-4 h-4 text-indigo-600 bg-slate-600 border-slate-500 rounded focus:ring-indigo-500"
                      />
                      <span class="text-slate-300 text-sm font-medium">Disponible</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Compétences (masqué pour restaurant) -->
        <div v-if="selectedProfile !== 'restaurant'" class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">🛠️</span> Compétences
          </h2>

          <!-- Liste des compétences -->
          <div class="space-y-4 mb-4">
            <div v-for="(skill, index) in form.skills" :key="index" class="flex items-center gap-3">
              <input
                v-model="skill.icon"
                type="text"
                class="w-20 bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="🏷️"
              />
              <input
                v-model="skill.name"
                type="text"
                class="flex-grow min-w-0 bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Ex: JavaScript, Vue.js"
              />
              <button
                @click="removeSkill(index)"
                type="button"
                class="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Bouton Ajouter une compétence -->
          <button
            @click="addSkill"
            type="button"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter une compétence
          </button>
        </div>

        <!-- 4. Projets (masqué pour restaurant) -->
        <div v-if="selectedProfile !== 'restaurant'" class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">🎯</span> {{ getLabel("projects", true) }}
          </h2>

          <!-- Liste des projets -->
          <div class="space-y-4 mb-4">
            <div
              v-for="(project, index) in form.projects"
              :key="index"
              class="bg-slate-700 p-4 rounded-lg border border-slate-600"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-white font-semibold">{{ getLabel("projects", true) }} {{ index + 1 }}</h3>
                <button
                  @click="removeProject(index)"
                  type="button"
                  class="text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Titre</label>
                  <input
                    v-model="project.title"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    :placeholder="getPlaceholder('projects')"
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Description courte</label>
                  <textarea
                    v-model="project.short_description"
                    rows="2"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Description courte du projet..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Détails (HTML)</label>
                  <textarea
                    v-model="project.details_html"
                    rows="4"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm"
                    placeholder="Description détaillée du projet (HTML supporté)..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">URL du projet (optionnel)</label>
                  <input
                    v-model="project.link"
                    type="url"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Icône</label>
                  <input
                    v-model="project.icon"
                    type="text"
                    class="w-32 bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="🚀"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton Ajouter un projet -->
          <button
            @click="addProject"
            type="button"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter {{ getLabel("projects", false) }}
          </button>
        </div>

        <!-- 5. Formations (masqué pour restaurant) -->
        <div v-if="selectedProfile !== 'restaurant'" class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">🎓</span> Mes Formations
          </h2>

          <!-- Liste des formations -->
          <div class="space-y-4 mb-4">
            <div
              v-for="(item, index) in form.formations"
              :key="index"
              class="bg-slate-700 p-4 rounded-lg border border-slate-600"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-white font-semibold">Formation {{ index + 1 }}</h3>
                <button
                  @click="removeFormationItem(index)"
                  type="button"
                  class="text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Titre</label>
                  <input
                    v-model="item.title"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex: Master 2 en..., Licence en..., Baccalauréat..."
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Établissement</label>
                  <input
                    v-model="item.organization"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex: Nom de l'établissement ou organisme"
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Date</label>
                  <input
                    v-model="item.date"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex: 2016-2019, 2024, Depuis 2024"
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Description</label>
                  <textarea
                    v-model="item.description"
                    rows="3"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm"
                    placeholder="Description à la première personne (ex: 'J'ai suivi une formation en...', 'J'ai obtenu mon diplôme de...')"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton Ajouter -->
          <button
            @click="addFormationItem"
            type="button"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter une formation
          </button>
        </div>

        <!-- 6. Timeline (Parcours Professionnel) (masqué pour restaurant) -->
        <div v-if="selectedProfile !== 'restaurant'" class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">📅</span> Mon Parcours Professionnel
          </h2>

          <!-- Liste des événements timeline -->
          <div class="space-y-4 mb-4">
            <div
              v-for="(item, index) in form.timeline"
              :key="index"
              class="bg-slate-700 p-4 rounded-lg border border-slate-600"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-white font-semibold">{{ getLabel("timeline", true) }} {{ index + 1 }}</h3>
                <button
                  @click="removeTimelineItem(index)"
                  type="button"
                  class="text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Titre</label>
                  <input
                    v-model="item.title"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex: Stage en Agence, Master 2..."
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Organisation</label>
                  <input
                    v-model="item.organization"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex: Nom de l'entreprise ou établissement"
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Date</label>
                  <input
                    v-model="item.date"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex: 01/05/2022 - Aujourd'hui, 2016-2019"
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Description</label>
                  <textarea
                    v-model="item.description"
                    rows="3"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm"
                    placeholder="Description à la première personne (ex: 'J'ai occupé le poste de...', 'Mes responsabilités incluaient...')"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Icône</label>
                  <input
                    v-model="item.icon"
                    type="text"
                    class="w-32 bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="🎓"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton Ajouter -->
          <button
            @click="addTimelineItem"
            type="button"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter un événement
          </button>
        </div>

        <!-- 6. Contact -->
        <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">📧</span> Informations de contact
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-300 font-medium mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Ex: jean.dupont@example.com"
              />
            </div>

            <div>
              <label class="block text-slate-300 font-medium mb-2">Téléphone</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Ex: +224 XXX XXX XXX"
              />
            </div>

            <div v-if="form.profile_type !== 'restaurant'">
              <label class="block text-slate-300 font-medium mb-2">LinkedIn (optionnel)</label>
              <input
                v-model="form.linkedin_url"
                type="url"
                class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div v-if="form.profile_type !== 'restaurant'">
              <label class="block text-slate-300 font-medium mb-2">GitHub (optionnel)</label>
              <input
                v-model="form.github_url"
                type="url"
                class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>

        <!-- 7. Champs cachés pour les couleurs et titre -->
        <input type="hidden" v-model="form.primary_color" />
        <input type="hidden" v-model="form.secondary_color" />
        <input type="hidden" v-model="form.skills_title" />
        <input type="hidden" v-model="form.projects_title" />
        <input type="hidden" v-model="form.formations_title" />
        <input type="hidden" v-model="form.timeline_title" />

        <!-- 8. Bouton Enregistrer et Quitter -->
        <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <div class="mb-4">
            <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span class="text-3xl">💾</span> Enregistrer et Quitter
            </h2>
            <p class="text-slate-300 text-sm">Enregistrez votre profil sans le publier maintenant</p>
          </div>

          <button
            @click="savePortfolio"
            :disabled="isSaving"
            class="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg v-if="isSaving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isSaving ? "Enregistrement..." : "Enregistrer et Quitter" }}
          </button>
        </div>

        <!-- Message de feedback -->
        <div v-if="saveMessage" class="space-y-3">
          <div :class="saveError ? 'bg-red-500' : 'bg-green-500'" class="p-4 rounded-lg text-white text-center">
            {{ saveMessage }}
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de rognage d'image (responsive, même logique que Marketplace) -->
    <div
      v-if="cropModalOpen"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      @click.self="closeCropModal"
    >
      <div class="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95dvh] sm:max-h-[90vh] overflow-y-auto flex flex-col">
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 sm:p-6 flex items-center justify-between shrink-0">
          <h3 class="text-lg sm:text-xl font-bold text-white">Rogner l'image</h3>
          <button
            @click="closeCropModal"
            class="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Fermer"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="cropImage" class="p-4 sm:p-6 flex-1 min-h-0">
          <div class="menu-crop-container bg-slate-900 rounded-lg overflow-hidden">
            <Cropper
              ref="cropper"
              class="menu-cropper"
              :src="cropImage"
              :stencil-props="{ aspectRatio: 1 }"
              :resize-image="{ touch: true, wheel: { ratio: 0.1 }, adjustStencil: false }"
              :move-image="{ touch: true, mouse: true }"
              :canvas="{ width: 1200, height: 1200, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' }"
            />
          </div>
          <p class="text-slate-400 text-sm text-center mt-3">
            Molette ou pinch pour zoomer · Glisser pour déplacer · Cadre carré 1:1 (avatars/logos)
          </p>
          <div class="flex flex-col-reverse sm:flex-row gap-4 mt-6">
            <button
              type="button"
              @click="closeCropModal"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="button"
              @click="getCroppedImage"
              class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-3 px-6 rounded-lg transition-all font-semibold shadow-lg"
            >
              Appliquer le rognage
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick, watch } from "vue";
  import apiClient from "@/api";
  import Cookies from "js-cookie";
  import { useAuth } from "@/composables/useAuth";
  import { useRouter } from "vue-router";
  import { Cropper } from "vue-advanced-cropper";
  import "vue-advanced-cropper/dist/style.css";

  // Options de profil
  const profileOptions = [
    {
      value: "student",
      label: "Étudiant / Sortant",
      icon: "🎓",
    },
    {
      value: "teacher",
      label: "Enseignant / Formateur",
      icon: "👨‍🏫",
    },
    {
      value: "freelance",
      label: "Freelance / Indépendant",
      icon: "💼",
    },
    {
      value: "pharmacist",
      label: "Pharmacien",
      icon: "💊",
    },
    {
      value: "doctor",
      label: "Médecin",
      icon: "⚕️",
    },
    {
      value: "lawyer",
      label: "Avocat",
      icon: "⚖️",
    },
    {
      value: "notary",
      label: "Notaire",
      icon: "📜",
    },
    {
      value: "bailiff",
      label: "Huissier de Justice",
      icon: "📋",
    },
    {
      value: "architect",
      label: "Architecte",
      icon: "🏗️",
    },
    {
      value: "engineer",
      label: "Ingénieur",
      icon: "🔧",
    },
    {
      value: "consultant",
      label: "Consultant",
      icon: "💡",
    },
    {
      value: "accountant",
      label: "Comptable",
      icon: "📊",
    },
    {
      value: "financial_analyst",
      label: "Analyste Financier",
      icon: "📈",
    },
    {
      value: "photographer",
      label: "Photographe",
      icon: "📷",
    },
    {
      value: "graphic_designer",
      label: "Graphiste",
      icon: "🎨",
    },
    {
      value: "developer",
      label: "Développeur",
      icon: "💻",
    },
    {
      value: "banker",
      label: "Banquier",
      icon: "🏦",
    },
    {
      value: "restaurant",
      label: "Restaurant",
      icon: "🍽️",
    },
  ];

  // Labels adaptatifs selon le profil
  const adaptiveLabels = {
    student: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Étudiant en Informatique"',
      timeline: "Ma Formation & Stages",
      timelinePlaceholder: 'Ex: "Stage en Agence", "Master 2"',
      projects: "Mes Projets Académiques",
      projectsPlaceholder: 'Ex: "Projet de fin d\'études"',
    },
    teacher: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Professeur de Français"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Professeur Titulaire"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Publication d\'un livre"',
    },
    freelance: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Développeur Web Freelance"',
      timeline: "Mon Parcours & Clients",
      timelinePlaceholder: 'Ex: "Client X", "Chef de Projet Y"',
      projects: "Mon Portfolio / Projets Clients",
      projectsPlaceholder: 'Ex: "Refonte du site E-commerce Z"',
    },
    pharmacist: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Pharmacien d\'officine"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Pharmacien Titulaire", "Spécialisation"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Conseil pharmaceutique", "Projet de santé publique"',
    },
    doctor: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Médecin Généraliste"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Internat", "Spécialisation"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Recherche médicale", "Publication scientifique"',
    },
    lawyer: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Avocat en Droit des Affaires"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Cabinet d\'avocats", "Barreau"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Affaires traitées", "Publications juridiques"',
    },
    notary: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Notaire"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Étude notariale", "Chambre des Notaires"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Actes notariés", "Conseil juridique"',
    },
    bailiff: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Huissier de Justice"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Étude d\'huissier", "Chambre des Huissiers"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Significations", "Exécutions"',
    },
    architect: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Architecte DPLG"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Agence d\'architecture", "Ordre des Architectes"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Projet immobilier", "Rénovation"',
    },
    engineer: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Ingénieur en Génie Civil"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Entreprise", "Bureau d\'études"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Projet d\'infrastructure", "Innovation technique"',
    },
    consultant: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Consultant en Management"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Cabinet de conseil", "Mission"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Mission de conseil", "Transformation digitale"',
    },
    accountant: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Expert-Comptable"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Cabinet comptable", "Ordre des Experts-Comptables"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Audit", "Conseil fiscal"',
    },
    financial_analyst: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Analyste Financier"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Banque", "Fonds d\'investissement"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Analyse financière", "Évaluation d\'entreprise"',
    },
    photographer: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Photographe Professionnel"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Studio photo", "Agence"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Séance photo", "Reportage"',
    },
    graphic_designer: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Graphiste"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Agence de communication", "Freelance"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Identité visuelle", "Création graphique"',
    },
    developer: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Développeur Full Stack"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Startup", "Entreprise tech"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Application web", "Projet open source"',
    },
    banker: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Banquier d\'affaires"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Banque X", "Spécialisation"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Financement de projet", "Conseil financier"',
    },
  };

  const { user } = useAuth();
  const router = useRouter();
  const isLoading = ref(true);
  const isSaving = ref(false);
  const saveMessage = ref("");
  const saveError = ref(false);
  const photoUploadMessage = ref("");
  const photoUploadError = ref(false);
  const isUploadingPhoto = ref(false);
  const photoInput = ref(null);
  const documentInput = ref(null);
  const isExtractingDocument = ref(false);
  const extractionMessage = ref("");
  const extractionError = ref(false);

  const selectedProfile = ref(null);
  const formContainer = ref(null);

  // Stocker les données séparées pour chaque profil
  const profileData = ref({
    student: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    teacher: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    freelance: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    pharmacist: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    doctor: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    lawyer: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    notary: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    bailiff: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    architect: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    engineer: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    consultant: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    accountant: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    financial_analyst: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    photographer: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    graphic_designer: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    developer: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    banker: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
  });

  const form = ref({
    profile_type: null,
    name: "",
    photo_url: "",
    hero_headline: "",
    bio: "",
    skills: [],
    projects: [],
    formations: [],
    timeline: [],
    menu: {
      dishes: [],
      drinks: [],
    },
    email: "",
    phone: "",
    linkedin_url: "",
    github_url: "",
    primary_color: "#6366f1", // Indigo par défaut
    secondary_color: "#ffffff",
    skills_title: "Mes Compétences",
    projects_title: "Mes Projets",
    formations_title: "Mes Formations",
    timeline_title: "Mon Parcours Professionnel",
  });

  // Fonctions pour les labels adaptatifs
  const getLabel = (field, isTitle = false) => {
    if (!selectedProfile.value) return "";
    const labels = adaptiveLabels[selectedProfile.value];
    if (!labels) return "";

    if (isTitle) {
      if (field === "projects") return labels.projects;
      if (field === "timeline") return labels.timeline;
      return "";
    }

    if (field === "headline") return labels.headline;
    return "";
  };

  const getPlaceholder = (field) => {
    if (!selectedProfile.value) return "";
    const labels = adaptiveLabels[selectedProfile.value];
    if (!labels) return "";

    if (field === "headline") return labels.headlinePlaceholder;
    if (field === "timeline") return labels.timelinePlaceholder;
    if (field === "projects") return labels.projectsPlaceholder;
    return "";
  };

  const selectProfile = async (profileValue) => {
    // Si l'utilisateur change de profil, sauvegarder les données actuelles
    if (selectedProfile.value && selectedProfile.value !== profileValue) {
      // Sauvegarder les données du profil actuel
      const currentData = {
        bio: form.value.bio,
        skills: [...form.value.skills],
        projects: [...form.value.projects],
        formations: [...form.value.formations],
        timeline: [...form.value.timeline],
        skills_title: form.value.skills_title,
        projects_title: form.value.projects_title,
        formations_title: form.value.formations_title,
        timeline_title: form.value.timeline_title,
      };
      
      // Pour le profil restaurant, sauvegarder aussi le menu
      if (selectedProfile.value === 'restaurant' && form.value.menu) {
        currentData.menu = JSON.parse(JSON.stringify(form.value.menu));
      }
      
      profileData.value[selectedProfile.value] = currentData;
    }

    selectedProfile.value = profileValue;
    form.value.profile_type = profileValue;

    // Charger les données du nouveau profil sélectionné
    const savedData = profileData.value[profileValue];
    if (savedData) {
      form.value.bio = savedData.bio;
      form.value.skills = [...(savedData.skills || [])];
      form.value.projects = [...(savedData.projects || [])];
      form.value.formations = savedData.formations ? [...savedData.formations] : [];
      form.value.timeline = [...(savedData.timeline || [])];
      form.value.skills_title = savedData.skills_title;
      form.value.projects_title = savedData.projects_title;
      form.value.formations_title = savedData.formations_title || "Mes Formations";
      form.value.timeline_title = savedData.timeline_title || "Mon Parcours Professionnel";
      
      // Pour le profil restaurant, charger aussi le menu
      if (profileValue === 'restaurant' && savedData.menu) {
        form.value.menu = JSON.parse(JSON.stringify(savedData.menu));
      } else if (profileValue === 'restaurant' && !form.value.menu) {
        form.value.menu = { dishes: [], drinks: [] };
      }
    } else if (profileValue === 'restaurant' && !form.value.menu) {
      form.value.menu = { dishes: [], drinks: [] };
    }

    // Attendre que le DOM soit mis à jour, puis scroller vers le formulaire
    await nextTick();
    if (formContainer.value) {
      formContainer.value.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const setCsrfHeader = () => {
    const xsrfToken = Cookies.get("XSRF-TOKEN");
    if (xsrfToken) {
      apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    }
  };

  const loadPortfolio = async () => {
    try {
      const response = await apiClient.get("/api/user-portfolio");
      Object.assign(form.value, response.data);

      // Initialiser les arrays vides si nécessaire
      if (!form.value.skills) form.value.skills = [];
      if (!form.value.projects) form.value.projects = [];
      if (!form.value.formations) form.value.formations = [];
      if (!form.value.timeline) form.value.timeline = [];
      
      // Initialiser le menu pour le profil restaurant
      if (form.value.profile_type === 'restaurant' && !form.value.menu) {
        form.value.menu = { dishes: [], drinks: [] };
      } else if (form.value.menu && typeof form.value.menu === 'string') {
        // Si le menu est une chaîne JSON, le parser
        try {
          form.value.menu = JSON.parse(form.value.menu);
        } catch (e) {
          form.value.menu = { dishes: [], drinks: [] };
        }
      } else if (!form.value.menu) {
        form.value.menu = { dishes: [], drinks: [] };
      }
      
      // S'assurer que les titres sont définis
      if (!form.value.formations_title) form.value.formations_title = "Mes Formations";
      if (!form.value.timeline_title || form.value.timeline_title === "Mon Parcours" || form.value.timeline_title === "Ma Formation & Stages") {
        form.value.timeline_title = "Mon Parcours Professionnel";
      }

      // Si un profil était déjà configuré, charger ses données dans profileData
      if (form.value.profile_type) {
        const profileDataToSave = {
          bio: form.value.bio || "",
          skills: [...form.value.skills],
          projects: [...form.value.projects],
          formations: form.value.formations ? [...form.value.formations] : [],
          timeline: [...form.value.timeline],
          skills_title: form.value.skills_title || "Mes Compétences",
          projects_title: form.value.projects_title || "Mes Projets",
          formations_title: form.value.formations_title || "Mes Formations",
          timeline_title: form.value.timeline_title || "Mon Parcours Professionnel",
        };
        
        // Pour le profil restaurant, sauvegarder aussi le menu
        if (form.value.profile_type === 'restaurant' && form.value.menu) {
          profileDataToSave.menu = JSON.parse(JSON.stringify(form.value.menu));
        }
        
        profileData.value[form.value.profile_type] = profileDataToSave;
        selectedProfile.value = form.value.profile_type;
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    photoUploadMessage.value = "";
    photoUploadError.value = false;
    isUploadingPhoto.value = true;

    try {
      setCsrfHeader();
      const formData = new FormData();
      formData.append("photo", file);

      const response = await apiClient.post("/api/user-portfolio/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      form.value.photo_url = response.data.photo_url;
      photoUploadMessage.value = "Photo uploadée avec succès !";
      photoUploadError.value = false;
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      photoUploadMessage.value = error.response?.data?.message || "Erreur lors de l'upload.";
      photoUploadError.value = true;
    } finally {
      isUploadingPhoto.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      extractionMessage.value = `Le fichier est trop volumineux (${(file.size / 1024 / 1024).toFixed(2)} Mo). Taille maximale : 2 Mo.`;
      extractionError.value = true;
      return;
    }

    extractionMessage.value = "";
    extractionError.value = false;
    isExtractingDocument.value = true;

    try {
      setCsrfHeader();
      const formData = new FormData();
      formData.append("document", file);

      const response = await apiClient.post("/api/user-portfolio/extract-document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          profile_type: selectedProfile.value
        }
      });

      if (response.data.extractedData) {
        const data = response.data.extractedData;
        
        // Pour le profil restaurant, extraire le menu
        if (selectedProfile.value === 'restaurant') {
          // Extraire la bio et hero_headline si disponibles
          if (data.bio) form.value.bio = data.bio;
          if (data.hero_headline) form.value.hero_headline = data.hero_headline;
          
          // Extraire le menu
          if (data.menu) {
            // Initialiser le menu s'il n'existe pas
            if (!form.value.menu) {
              form.value.menu = { dishes: [], drinks: [] };
            }
            
            if (data.menu.dishes && Array.isArray(data.menu.dishes)) {
              form.value.menu.dishes = data.menu.dishes.map(dish => ({
                name: dish.name || "",
                price: dish.price || 0,
                description: dish.description || "",
                image: dish.image || null,
                available: dish.available !== undefined ? dish.available : true,
                hasSides: dish.hasSides || false,
                sides: dish.sides || [],
              }));
            }
            if (data.menu.drinks && Array.isArray(data.menu.drinks)) {
              form.value.menu.drinks = data.menu.drinks.map(drink => ({
                name: drink.name || "",
                price: drink.price || 0,
                image: drink.image || null,
                available: drink.available !== undefined ? drink.available : true,
              }));
            }
          }
          
          // Rechercher automatiquement des images pour les plats/boissons sans image
          // Faire cela en arrière-plan pour ne pas bloquer l'interface
          searchImagesForMenuItems().catch(err => {
            console.error('Erreur lors de la recherche automatique d\'images:', err);
          });
          
          extractionMessage.value = "Menu analysé avec succès ! Les plats et boissons ont été extraits automatiquement. Recherche d'images en cours...";
        } else {
          // Remplir les champs avec les données extraites pour les autres profils
          if (data.bio) form.value.bio = data.bio;
          if (data.hero_headline) form.value.hero_headline = data.hero_headline;
          if (data.skills && Array.isArray(data.skills)) {
            form.value.skills = data.skills.map(skill => ({
              icon: skill.icon || "🏷️",
              name: skill.name || skill
            }));
          }
          if (data.projects && Array.isArray(data.projects)) {
            form.value.projects = data.projects.map(project => ({
              title: project.title || project,
              short_description: project.short_description || project.description || "",
              full_description: project.full_description || project.description || "",
            }));
          }
          if (data.formations && Array.isArray(data.formations)) {
            form.value.formations = data.formations.map(formation => ({
              title: formation.title || formation,
              organization: formation.organization || "",
              date: formation.date || "",
              description: formation.description || "",
            }));
          }
          if (data.timeline && Array.isArray(data.timeline)) {
            form.value.timeline = data.timeline.map(item => ({
              title: item.title || item,
              organization: item.organization || "",
              date: item.date || item.dates || "",
              description: item.description || item.details || "",
            }));
          }
          if (data.email) form.value.email = data.email;
          if (data.phone) form.value.phone = data.phone;
          if (data.linkedin_url) form.value.linkedin_url = data.linkedin_url;
          extractionMessage.value = "Document analysé avec succès ! Les informations ont été extraites et remplies automatiquement.";
        }
        extractionError.value = false;
      } else {
        extractionMessage.value = "Aucune donnée n'a pu être extraite du document.";
        extractionError.value = true;
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction:", error);
      extractionMessage.value = error.response?.data?.message || "Erreur lors de l'extraction du document.";
      extractionError.value = true;
    } finally {
      isExtractingDocument.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
      if (documentInput.value) {
        documentInput.value.value = "";
      }
    }
  };

  const addSkill = () => {
    form.value.skills.push({
      icon: "🏷️",
      name: "",
    });
  };

  const removeSkill = (index) => {
    form.value.skills.splice(index, 1);
  };

  const addProject = () => {
    form.value.projects.push({
      title: "",
      short_description: "",
      details_html: "",
      link: "",
      icon: "🚀",
    });
  };

  const removeProject = (index) => {
    form.value.projects.splice(index, 1);
  };

  const addFormationItem = () => {
    form.value.formations.push({
      title: "",
      organization: "",
      date: "",
      description: "",
    });
  };

  const removeFormationItem = (index) => {
    form.value.formations.splice(index, 1);
  };

  const addTimelineItem = () => {
    form.value.timeline.push({
      title: "",
      organization: "",
      date: "",
      description: "",
    });
  };

  const removeTimelineItem = (index) => {
    form.value.timeline.splice(index, 1);
  };

  // Fonctions pour gérer le menu restaurant
  const addDish = () => {
    if (!form.value.menu) {
      form.value.menu = { dishes: [], drinks: [] };
    }
    if (!form.value.menu.dishes) {
      form.value.menu.dishes = [];
    }
    form.value.menu.dishes.push({
      name: "",
      price: 0,
      description: "",
      image: null,
      available: true,
      hasSides: false,
      sides: [],
    });
  };

  const removeDish = (index) => {
    if (form.value.menu?.dishes) {
      form.value.menu.dishes.splice(index, 1);
    }
  };

  const addDrink = () => {
    if (!form.value.menu) {
      form.value.menu = { dishes: [], drinks: [] };
    }
    if (!form.value.menu.drinks) {
      form.value.menu.drinks = [];
    }
    form.value.menu.drinks.push({
      name: "",
      price: 0,
      image: null,
      available: true,
    });
  };

  const removeDrink = (index) => {
    if (form.value.menu?.drinks) {
      form.value.menu.drinks.splice(index, 1);
    }
  };

  // Gestion des images pour plats et boissons
  const handleDishImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (form.value.menu?.dishes?.[index]) {
        form.value.menu.dishes[index].image = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrinkImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (form.value.menu?.drinks?.[index]) {
        form.value.menu.drinks[index].image = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Recherche automatique d'image pour un plat ou une boisson
  const searchImageForItem = async (itemName, type, index) => {
    if (!itemName || itemName.trim() === '') return;
    
    try {
      const response = await apiClient.get('/api/image-search', {
        params: {
          query: itemName,
          type: type, // 'dish' ou 'drink'
        },
      });

      if (response.data.success && response.data.image_url) {
        if (type === 'dish' && form.value.menu?.dishes?.[index]) {
          form.value.menu.dishes[index].image = response.data.image_url;
        } else if (type === 'drink' && form.value.menu?.drinks?.[index]) {
          form.value.menu.drinks[index].image = response.data.image_url;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'image:', error);
      // Ne pas afficher d'erreur à l'utilisateur, c'est silencieux
    }
  };

  // Recherche automatique d'images pour tous les plats/boissons sans image
  const searchImagesForMenuItems = async () => {
    if (!form.value.menu) return;

    // Rechercher des images pour les plats sans image
    if (form.value.menu.dishes && Array.isArray(form.value.menu.dishes)) {
      for (let i = 0; i < form.value.menu.dishes.length; i++) {
        const dish = form.value.menu.dishes[i];
        if (dish.name && !dish.image) {
          // Attendre un peu entre chaque requête pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 300 * i));
          await searchImageForItem(dish.name, 'dish', i);
        }
      }
    }

    // Rechercher des images pour les boissons sans image
    if (form.value.menu.drinks && Array.isArray(form.value.menu.drinks)) {
      const dishesCount = form.value.menu.dishes?.length || 0;
      for (let i = 0; i < form.value.menu.drinks.length; i++) {
        const drink = form.value.menu.drinks[i];
        if (drink.name && !drink.image) {
          // Attendre un peu entre chaque requête pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 300 * (dishesCount + i)));
          await searchImageForItem(drink.name, 'drink', i);
        }
      }
    }
  };

  // Modal de rognage d'image
  const cropModalOpen = ref(false);
  const cropType = ref(null); // 'dish' ou 'drink'
  const cropIndex = ref(null);
  const cropImage = ref(null);
  const croppedImage = ref(null);
  const cropper = ref(null);

  const openCropModal = (type, index) => {
    cropType.value = type;
    cropIndex.value = index;
    if (type === 'dish' && form.value.menu?.dishes?.[index]?.image) {
      cropImage.value = form.value.menu.dishes[index].image;
    } else if (type === 'drink' && form.value.menu?.drinks?.[index]?.image) {
      cropImage.value = form.value.menu.drinks[index].image;
    }
    cropModalOpen.value = true;
  };

  const closeCropModal = () => {
    cropModalOpen.value = false;
    cropImage.value = null;
    croppedImage.value = null;
  };

  const getCroppedImage = () => {
    if (!cropper.value) return;
    try {
      const result = cropper.value.getResult();
      const canvas = result.canvas;
      if (canvas) {
        croppedImage.value = canvas.toDataURL('image/jpeg', 0.9);
        applyCrop();
      }
    } catch (error) {
      console.error('Erreur lors du rognage:', error);
    }
  };

  const applyCrop = () => {
    if (croppedImage.value && cropType.value && cropIndex.value !== null) {
      if (cropType.value === 'dish' && form.value.menu?.dishes?.[cropIndex.value]) {
        form.value.menu.dishes[cropIndex.value].image = croppedImage.value;
      } else if (cropType.value === 'drink' && form.value.menu?.drinks?.[cropIndex.value]) {
        form.value.menu.drinks[cropIndex.value].image = croppedImage.value;
      }
    }
    closeCropModal();
  };

  const savePortfolio = async () => {
    isSaving.value = true;
    saveMessage.value = "";
    saveError.value = false;

    try {
      setCsrfHeader();
      await apiClient.put("/api/user-portfolio", form.value);

      // Mettre à jour profileData avec les données sauvegardées
      const profileDataToSave = {
        bio: form.value.bio || "",
        skills: [...form.value.skills],
        projects: [...form.value.projects],
        formations: form.value.formations ? [...form.value.formations] : [],
        timeline: [...form.value.timeline],
        skills_title: form.value.skills_title || "Mes Compétences",
        projects_title: form.value.projects_title || "Mes Projets",
        formations_title: form.value.formations_title || "Mes Formations",
        timeline_title: form.value.timeline_title || "Mon Parcours Professionnel",
      };
      
      // Pour le profil restaurant, sauvegarder aussi le menu
      if (selectedProfile.value === 'restaurant' && form.value.menu) {
        profileDataToSave.menu = JSON.parse(JSON.stringify(form.value.menu));
      }
      
      profileData.value[selectedProfile.value] = profileDataToSave;

      saveMessage.value = "Profil enregistré avec succès !";
      saveError.value = false;

      // Rediriger vers le dashboard après un court délai
      setTimeout(() => {
        router.push({ name: "Dashboard" });
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      saveMessage.value = error.response?.data?.message || "Erreur lors de la sauvegarde.";
      saveError.value = true;
    } finally {
      isSaving.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Watcher avec debounce pour rechercher automatiquement une image quand le nom d'un plat/boisson est saisi
  const imageSearchTimeouts = new Map(); // Pour stocker les timeouts de debounce

  watch(
    () => form.value.menu,
    (newMenu) => {
      if (!newMenu || selectedProfile.value !== 'restaurant') return;

      // Watcher pour les plats
      if (newMenu.dishes && Array.isArray(newMenu.dishes)) {
        newMenu.dishes.forEach((dish, index) => {
          // Nettoyer le timeout précédent pour ce plat
          const key = `dish-${index}`;
          if (imageSearchTimeouts.has(key)) {
            clearTimeout(imageSearchTimeouts.get(key));
          }

          // Si le plat a un nom mais pas d'image, rechercher une image après 1.5 secondes
          if (dish.name && dish.name.trim() !== '' && !dish.image) {
            const timeout = setTimeout(() => {
              searchImageForItem(dish.name, 'dish', index);
              imageSearchTimeouts.delete(key);
            }, 1500); // Debounce de 1.5 secondes
            imageSearchTimeouts.set(key, timeout);
          }
        });
      }

      // Watcher pour les boissons
      if (newMenu.drinks && Array.isArray(newMenu.drinks)) {
        newMenu.drinks.forEach((drink, index) => {
          // Nettoyer le timeout précédent pour cette boisson
          const key = `drink-${index}`;
          if (imageSearchTimeouts.has(key)) {
            clearTimeout(imageSearchTimeouts.get(key));
          }

          // Si la boisson a un nom mais pas d'image, rechercher une image après 1.5 secondes
          if (drink.name && drink.name.trim() !== '' && !drink.image) {
            const timeout = setTimeout(() => {
              searchImageForItem(drink.name, 'drink', index);
              imageSearchTimeouts.delete(key);
            }, 1500); // Debounce de 1.5 secondes
            imageSearchTimeouts.set(key, timeout);
          }
        });
      }
    },
    { deep: true }
  );

  onMounted(() => {
    loadPortfolio();
  });
</script>

<style scoped>
  /* Styles similaires à CompanyServicesForm */
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }

  /* Zone de crop menu (responsive) */
  .menu-crop-container {
    min-height: 250px;
    height: min(50vh, 400px);
  }

  @media (min-width: 640px) {
    .menu-crop-container {
      min-height: 300px;
      height: min(55vh, 450px);
    }
  }

  @media (min-width: 768px) {
    .menu-crop-container {
      min-height: 350px;
      height: min(60vh, 500px);
    }
  }

  .menu-cropper {
    height: 100%;
    width: 100%;
    background: #0f172a;
  }
</style>
