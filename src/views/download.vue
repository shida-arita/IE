<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title style="text-align:center">下载数据</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            
                <ion-radio-group :value="way" @ionChange="way=$event.detail.value">
                    <ion-row>
                    <ion-col size="6">
                        <ion-item lines="none">
                            <ion-radio value="sentence"></ion-radio>
                            <ion-label>按句子划分</ion-label>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item lines="none">
                            <ion-radio value="entity"></ion-radio>
                            <ion-label>按实体划分</ion-label>
                        </ion-item>
                    </ion-col>
                    </ion-row>
                </ion-radio-group>
            
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
            <ion-button :disabled="downloading" expand="block" @click="download">
                <ion-spinner v-if="downloading" name="bubbles"/>下载
            </ion-button>
            <ion-button :disabled="downloading" expand="block" @click="download2">
                <ion-spinner v-if="downloading" name="bubbles"/>下载二
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
          test:20,
          way:'sentence'
      })
       const download2 = async()=>{
          if (!state.downloading){
              state.downloading = true
              const res: any = await downEntity('ttest.php',{
                  train:state.train,
                  test:state.test,
                  way:state.way
              })
              state.downloading = false
              if (res.trainNum>0) {
                    const element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res.train));
                    element.setAttribute('download', 'train.txt');
                    
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    
                    element.click();
              }
              if (res.testNum>0) {
                    const element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res.test));
                    element.setAttribute('download', 'test.txt'); 
                    
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    
                    element.click();
              }
          }
          

      }
      const download = async()=>{
          if (!state.downloading){
              state.downloading = true
              const res: any = await downEntity('test.php',{
                  train:state.train,
                  test:state.test,
                  way:state.way
              })
              state.downloading = false
              if (res.trainNum>0) {
                    const element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res.train));
                    element.setAttribute('download', 'train.txt');
                    
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    
                    element.click();
              }
              if (res.testNum>0) {
                    const element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res.test));
                    element.setAttribute('download', 'test.txt');
                    
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    
                    element.click();
              }
          }
          

      }
      return {
          download,
          download2,
          ...toRefs(state)
      }
  }
})
</script>