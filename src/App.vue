<script>
import Album from './components/Album.vue'
import AlbumList from './components/AlbumList.vue'
import { mapStores } from 'pinia'
import { useGlobalVariablesStore } from './stores/globalVariables'
import { invoke } from '@tauri-apps/api/tauri'

export default {
  data() {
    return {
      settings_store: null,
      active_startup_dialog: null
    }
  },
  components: {
    Album,
    AlbumList
  },
  methods: {
    async open_folder() {
      console.log('open_folder')
      await this.globalVariablesStore.select_collection_folder()
      if (this.globalVariablesStore.collection_folder)
        this.active_startup_dialog = false
    },
    async generateThumbnail () {

    }
  },
  async mounted() {
    // invoke('image_to_webp')
    // invoke('image_to_webp', {filePath:'/run/media/nikita/7b8e0470-68d9-4f9c-a75d-4761fb89cf69/a7c/2022-02-23/DSC00011.JPG', outputFile: '/run/media/nikita/7b8e0470-68d9-4f9c-a75d-4761fb89cf69/a7c/2022-02-23/DSC00011.webp'})
    await this.globalVariablesStore.init()
    if (!this.globalVariablesStore.collection_folder) {
      this.active_startup_dialog = true
    }
  },
  computed: {
    ...mapStores(useGlobalVariablesStore),
  }
}
</script>

<template>
  <div id="vs-app">
    <div class="center grid">
      <vs-row>

        <Transition>
          <vs-col span v-bind:class="[globalVariablesStore.current_album ? { 'vs-col-1': true } : { 'vs-col-6': true }]">
            <AlbumList v-if="this.globalVariablesStore.collection_folder"></AlbumList>
          </vs-col>

        </Transition>
        <vs-col span v-bind:class="[globalVariablesStore.current_album ? { 'vs-col-11': true } : { 'vs-col-6': true }]">

          <Album v-if="this.globalVariablesStore.current_album" />
        </vs-col>
      </vs-row>
    </div>

    <vs-dialog prevent-close blur v-model="active_startup_dialog">
      <template #header>
        <h4 class="not-margin">
          Select <b>Collection</b> folder
        </h4>
      </template>

      <vs-button border @click="open_folder()">Select Folder</vs-button>
    </vs-dialog>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
