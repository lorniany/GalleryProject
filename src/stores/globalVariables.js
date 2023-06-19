import { defineStore } from 'pinia'
import { Store } from "tauri-plugin-store-api";
import { open } from '@tauri-apps/api/dialog';



export const useGlobalVariablesStore = defineStore('globalVariables', {
  state: () => {
    return { settings_store: null,
             collection_folder: null,
             current_album: null }
  },
  actions: {
    async init() {
      console.log('init')
      console.log(window.location.href)
      this.settings_store = new Store(".settings.dat");
      if (window.location.href == 'http://localhost:5173/')
        await this.settings_store.set("collection_folder", null);

      this.collection_folder = await this.settings_store.get("collection_folder");
    },
    async select_collection_folder() {
      this.collection_folder = await open({ directory: true, recursive: true});
      await this.settings_store.set("collection_folder", this.collection_folder);
      await this.settings_store.save();
    },
    set_current_album(path) {
      this.current_album = path
    }
  },
})