<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
    <div>
      <label for="whatsapp_url" class="block text-sm font-medium text-slate-300 mb-1">Lien WhatsApp</label>
      <input
        v-model.trim="form.whatsapp_url"
        type="url"
        id="whatsapp_url"
        class="input-field"
        placeholder="https://wa.me/..."
      />
    </div>
    <div>
      <label for="linkedin_url" class="block text-sm font-medium text-slate-300 mb-1">Lien LinkedIn</label>
      <input
        v-model.trim="form.linkedin_url"
        type="url"
        id="linkedin_url"
        class="input-field"
        placeholder="https://linkedin.com/in/..."
      />
    </div>
    <div>
      <label for="facebook_url" class="block text-sm font-medium text-slate-300 mb-1">Lien Facebook</label>
      <input
        v-model.trim="form.facebook_url"
        type="url"
        id="facebook_url"
        class="input-field"
        placeholder="https://facebook.com/..."
      />
    </div>
    <div>
      <label for="twitter_url" class="block text-sm font-medium text-slate-300 mb-1">Lien Twitter / X</label>
      <input
        v-model.trim="form.twitter_url"
        type="url"
        id="twitter_url"
        class="input-field"
        placeholder="https://x.com/..."
      />
    </div>
    <div>
      <label for="youtube_url" class="block text-sm font-medium text-slate-300 mb-1">Lien YouTube</label>
      <input
        v-model.trim="form.youtube_url"
        type="url"
        id="youtube_url"
        class="input-field"
        placeholder="https://youtube.com/..."
      />
    </div>
    <div>
      <label for="spotify_url" class="block text-sm font-medium text-slate-300 mb-1">Lien Spotify</label>
      <input
        v-model.trim="form.spotify_url"
        type="url"
        id="spotify_url"
        class="input-field"
        placeholder="https://open.spotify.com/..."
      />
    </div>
    <div>
      <label for="deezer_url" class="block text-sm font-medium text-slate-300 mb-1">Lien Deezer</label>
      <input
        v-model.trim="form.deezer_url"
        type="url"
        id="deezer_url"
        class="input-field"
        placeholder="https://deezer.com/..."
      />
    </div>
  </div>
</template>

<script setup>
  defineProps({
    form: {
      type: Object,
      required: true,
    },
  });
</script>

<style scoped>
  .input-field {
    @apply mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out;
  }
</style>
