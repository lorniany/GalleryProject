<script>
import { open } from '@tauri-apps/api/dialog';
import { readDir } from '@tauri-apps/api/fs';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { mapStores } from 'pinia'
import { useGlobalVariablesStore } from '../stores/globalVariables'

export default {
  name: "AlbumList",
  data() {
    return {
      albums: []
    }
  },
  methods: {
  },
  computed: {
    ...mapStores(useGlobalVariablesStore),
  },
  async mounted() {
    this.albums = []
    let albums = await readDir(this.globalVariablesStore.collection_folder);
    for (let album of albums) {
      if (album.children != null && album.name[0] != '.')
        this.albums.push(album.name)
    }
    this.albums.sort()
    this.albums.reverse()
  },
  created() {
  }
}
</script>

<template>
  <div style="display: flex; justify-content: right; padding: 15px;">
    <ul v-if="albums" style="list-style-type: none;">
      <li v-for="(album, index) in albums" :key="index" @click="globalVariablesStore.set_current_album(album)">
        {{ album }}
      </li>
    </ul>
  </div>
</template>
 
<style scoped>
li {
  padding: 2px;
  font-size: 12px;
  font-family: monospace;
  color: #919191;
}
</style>
