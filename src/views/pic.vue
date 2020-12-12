<template>
<ion-page>
    <ion-header>
        <ion-toolbar>
            <ion-item>
                <ion-label>标题：</ion-label>
                <ion-input @ionChange="title=$event.detail.value" :value="title" placeholder="请输入商品标题"></ion-input>
            </ion-item>
        </ion-toolbar>
    </ion-header>
    <ion-content class="background">
        <ion-card class="card">
            <ion-card-header>
                <ion-card-title color="light" class="textC textS textW">
                    <h1>{{title}}</h1>
                </ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-label color="light"><h2><ion-icon :icon="starSharp"/>曲库两万首，免费一百首</h2></ion-label>
                <ion-label color="light"><h2><ion-icon :icon="starSharp"/>变速变调多功能</h2></ion-label>
                <ion-label color="light"><h2><ion-icon :icon="starSharp"/>安全稳定不封号</h2></ion-label>
                <ion-label color="light"><h2><ion-icon :icon="starSharp"/>曲库两万首，免费一百首</h2></ion-label>
            </ion-card-content>
            
        </ion-card>
    </ion-content>
</ion-page>
</template>
<style scoped>
.background{
    --background:#8696a7;
    height:400px;
    width:400px;
}
.card{
    --background:#c1cbd7;
    height:340px;
    width:340px;
    margin-top:30px;
    margin-bottom:30px;
    margin-left:30px;
    margin-right:30px;
}
.textC{
    text-align:center;
    
}
.textS{
    text-shadow: 2px 2px 3px #8696a7;
}
.textW{
    font-weight: bold;
}
h1{
    font-size: 30px;
}
h2{
    font-size: 24px;
}
</style>
<script lang="ts">
import { IonPage, IonHeader, IonContent, IonToolbar, IonFooter, IonCard, IonCardContent, IonCardHeader } from '@ionic/vue';
import { defineComponent, onMounted, onUnmounted, reactive, ref, toRefs } from 'vue';
import { starSharp } from 'ionicons/icons';
import { getEntity, downEntity, saveEntity } from '@/api/api'
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  components: {
      IonCard, IonCardContent, IonCardHeader 
  },
  setup() {
      const state = reactive({
          title:'明日之后钢琴辅助'
      })
      return {
          starSharp,
          ...toRefs(state)
      }
  }
})
</script>