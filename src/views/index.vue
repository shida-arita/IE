<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-item lines="none">
                    <ion-button>
                        上传数据
                    </ion-button>
                    <ion-button @click="download">
                        <ion-spinner v-if="downloading"/>下载数据
                    </ion-button>
                </ion-item>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-card>
                <ion-card-content>
                    <ion-item>
                        <ion-label slot="start">
                            实体1：
                        </ion-label>
                        <ion-label color="medium">
                            <ion-text v-if="data">{{data.flag[0]}}</ion-text>
                            <ion-skeleton-text v-else></ion-skeleton-text>
                        </ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label slot="start">
                            实体2：
                        </ion-label>
                        <ion-label color="medium">
                            <ion-text v-if="data">{{data.flag[1]}}</ion-text>
                            <ion-skeleton-text v-else></ion-skeleton-text>
                        </ion-label>
                    </ion-item>
                    <ion-item lines="none">
                        <ion-label slot="start">
                            关系：
                        </ion-label>
                        <ion-label color="medium" style="width:5em">
                            <ion-select @ionChange="labelChange($event)" v-if="data" :value="data.flag[2]" ok-text="确定" cancel-text="取消">
                                <ion-select-option  value="C">主席/首领</ion-select-option>
                                <ion-select-option  value="E">雇员</ion-select-option>
                                <ion-select-option  value="L">位置</ion-select-option>
                                <ion-select-option  value="N">无关系</ion-select-option>
                            </ion-select>
                            <ion-skeleton-text v-else></ion-skeleton-text>
                        </ion-label>
                    </ion-item>
                </ion-card-content>
            </ion-card>
            <ion-list v-if="data">

                <ion-card v-for="item in data.list" :key="item.ID">
                    <ion-card-header>
                        <ion-chip v-if="item.valid!=='1'" color="success">
                            状态：启用
                        </ion-chip>
                        <ion-chip v-else>
                            状态：弃用
                        </ion-chip>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-item>
                            <ion-textarea autoGrow placeholder="请输入句子内容" @input="item.editEl=$event.target" :readonly="!item.edit" :disabled="!item.edit" :value="item.sentence"/>
                        </ion-item>
                        <ion-item v-if="!item.edit" lines="none">
                            <ion-button v-if="item.valid==='1'" @click="item.valid='2'"><ion-icon :icon="push"/>启用</ion-button>
                            <ion-button v-else @click="item.valid='1'"><ion-icon :icon="trash"/>撤回</ion-button>
                            <ion-button @click="item.edit=true"><ion-icon :icon="create"/>编辑</ion-button>
                        </ion-item>
                        <ion-item v-else lines="none">
                                <ion-button @click="item.edit=false"><ion-icon :icon="create"/>取消</ion-button>
                                <ion-button @click="save(item)"><ion-icon :icon="create"/>保存</ion-button>
                        </ion-item>
                    </ion-card-content>
                </ion-card>
            </ion-list>
            <ion-button @click="saveData" :disabled="saving" expand="block"><ion-spinner v-if="saving"/>标记已阅并刷新本页</ion-button>
        </ion-content>
    </ion-page>
</template>
<style scoped>
.op-box{
    border-left: 1px solid #ddd;
    padding-left: 10px;
}
.middleAlign{
    vertical-align: middle;
}
</style>
<script lang="ts">
import { IonPage, IonHeader, IonContent, IonToolbar, IonCard, IonCardContent, IonCardHeader } from '@ionic/vue';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { create, trash, push } from 'ionicons/icons';
import { getEntity, downEntity, saveEntity } from '@/api/api'

export default defineComponent({
  name: 'App',
  components: {
      IonPage, IonHeader, IonContent, IonToolbar, IonCard, IonCardContent, IonCardHeader 
  },
  setup() {
      const data=ref(null)
      const saving=ref(false)
      const downloading=ref(false)
      const download = async()=>{
          if (!downloading.value){
              downloading.value = true
          const res: any = await downEntity()
          downloading.value = false
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res));
        element.setAttribute('download', 'train.txt');
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
          }
          

      }
      const save = (item: any)=>{
          if (item.editEl){
              item.sentence=item.editEl.innerHTML
          }
          item.edit = false
      }
      const test = (item: any)=>{
          if (item.editEl){
              item.sentence=item.editEl.innerHTML
          }
          
      }
      const getData = async()=>{
          const res: any = await getEntity()
          saving.value=false;
          if (res.flag) {
              data.value = {
                list: res.data,
                flag: res.flag
              } as any
          }
      }
      const saveData = async()=>{
          if (data.value && !saving.value) {
              saving.value=true;
              const list=(data.value as any).list
              const uploadList = []
              for (let i=0;i<list.length;i++) {
                  uploadList.push([list[i].ID, (list[i].valid!=='1')?'2':'1', list[i].sentence]);
              }
              console.log(uploadList, (data.value as any).flag[2])
              const res: any = await saveEntity({list:uploadList, label:(data.value as any).flag[2]})

              if (res.code) {
                  getData()
              }
          }
      }
      const labelChange = (e: any)=>{
          (data.value as any).flag[2] = e.detail.value
      }
      onMounted(()=>{
          getData()
      })
      onUnmounted(()=>{
          return true
      })
      return {
          create,
          data,
          test,
          trash, 
          push,
          save,
          saving,
          saveData,
          labelChange,
          download,
          downloading
      }
  }
})
</script>