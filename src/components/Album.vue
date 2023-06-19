
<script setup>
import VLazyImage from "v-lazy-image";
</script>
<script>
import { readDir } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { mapStores, mapState } from 'pinia'
import { useGlobalVariablesStore } from '../stores/globalVariables'

export default {
  name: "Album",
  data() {
    return {
      entries: null,
      current_key: null,
      fullscreen_view: false
    }
  },
  methods: {
    increment() {
      this.urls.push('aaa')
    },
    async read_folder(path) {
      let entries = await readDir(path);
      this.entries = []

      for (let entry of entries) {
        if (entry.name.toLowerCase().endsWith('.jpg'))
          this.entries.push(convertFileSrc(entry.path))
      }
      this.entries.sort()
    },
    show_fullscreen(key) {
      this.current_key = key
      this.fullscreen_view = true

    },
    get_img_by_key(key) {
      return this.entries[key]
    },
    next_image() {
      this.current_key = (this.current_key + 1) % this.entries.length
    },
    prev_image() {
      let current_key = (this.current_key - 1) % this.entries.length
      if (current_key < 0)
        current_key += this.entries.length
      this.current_key = current_key
    },
    listenKeys(event) {
      if (this.fullscreen_view) {
        if (event.keyCode == 37) {
          this.prev_image();
        } else if (event.keyCode == 39) {
          this.next_image();
        } else if (event.keyCode == 27) {
          this.fullscreen_view = false
          this.current_key = null
        } else {
          return
        }
      }
    }
  },
  computed: {
    ...mapStores(useGlobalVariablesStore),
    ...mapState(useGlobalVariablesStore, ['current_album'])
  },
  async mounted() {
    window.addEventListener('keyup', this.listenKeys);
    let folder = await join(this.globalVariablesStore.collection_folder, this.globalVariablesStore.current_album);
    this.read_folder(folder)
  },
  created() {
  },
  watch: {
    async current_album() {
      let folder = await join(this.globalVariablesStore.collection_folder, this.globalVariablesStore.current_album);
      this.read_folder(folder)
    }
  }
}
</script>

<template>
  <div ref="container">
    <div>{{ globalVariablesStore.current_album }}</div>
    <div class="imgcards">
      <v-lazy-image class="imgcard" v-for="(image, key) in entries" :key="key" @click="show_fullscreen(key)" :src="image"
        alt="" />
      <!-- <div class="imgcard" style="flex-grow: 100;"/> -->
    </div>
    <div class="lightbox" v-show="fullscreen_view" ref="lightbox">
      <img :src="get_img_by_key(current_key)" v-if="fullscreen_view" alt="" />
    </div>
  </div>
</template>
 
<style scoped>
.imgcards {
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
  line-height: 0;
  /* justify-content: center; */
}

.imgcard {
  padding: 5px;
  /* width: 250px; */
  height: 200px;
  object-fit: cover;
  flex-grow: 1;
  max-width: 400px;
}

.lightbox {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;

  /* padding: 1em; */

  background: rgb(53, 53, 53);
}

.lightbox>img {
  max-width: 100%;
  max-height: 100%;

}
</style>
