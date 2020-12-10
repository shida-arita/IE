<template>
  <ion-app>
    <ion-header v-if="title">
      <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-button @click="goBack">
              <ion-icon :icon="arrowBack"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
          </ion-buttons>
          <ion-title class="page-title">{{title}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-router-outlet v-if="!isTabs" :key="key" animated/>
    <router-view v-else/>
  </ion-app>
</template>
<style scoped>
.page-title{
  text-align: center;
}
</style>
<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { reactive, toRefs, watch } from 'vue'
import { arrowBack } from 'ionicons/icons';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      key: route.path,
      isTabs: (route.path === '/index'||route.path === '/message'||route.path === '/person'),
      title: route.meta.title
    })
    watch(route, ()=>{
      state.key = route.path
      state.isTabs = (route.path === '/index'||route.path === '/message'||route.path === '/person')
      state.title = route.meta.title
    })
    const goBack=()=>{
      router.go(-1)
    }
    const toUrl = (p: string)=>{
      router.push({
        path:p
      })
    }
    return {
      goBack,
      toUrl,
      arrowBack,
      ...toRefs(state)
    }
  }
});
</script>