<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title style="text-align:center">下载数据</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-item>
                <ion-label slot="start">训练集</ion-label>
                <ion-input @ionBlur="test=100-train" @ionChange="train=$event.detail.value;" :value="train" type="number" max="100" min="0"/>
                <ion-label slot="end">%</ion-label>
            </ion-item>
            <ion-item>
                <ion-label slot="start">测试集</ion-label>
                <ion-input @ionBlur="train=100-test" @ionChange="test=$event.detail.value;" :value="test" type="number" max="100" min="0"/>
                <ion-label  slot="end">%</ion-label>
            </ion-item>
            <ion-button :disabled="downloading" expand="block">
                <ion-spinner v-if="downloading" name="bubbles"/>下载
            </ion-button>
        </ion-content>
    </ion-page>
</template>
<script lang="ts">
import { IonPage, IonHeader, IonContent, IonToolbar, IonFooter, IonCard, IonCardContent, IonCardHeader } from '@ionic/vue';
import { defineComponent, onMounted, onUnmounted, reactive, ref, toRefs } from 'vue';
import { create, trash, push, search } from 'ionicons/icons';
import { getEntity, downEntity, saveEntity } from '@/api/api'
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  components: {
      IonPage, IonHeader, IonContent, IonToolbar 
  },
  setup() {
      const state = reactive({
          downloading:false,
          train:80,
          test:20
      })
      return {
          ...toRefs(state)
      }
  }
})
</script>