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
                        <ion-label>
                            关系：
                        </ion-label>
                        <ion-label v-if="data" color="medium">{{map[data.flag[2]]}}</ion-label>
                        <ion-label color="medium">
                            <ion-select  @ionChange="labelChange($event)" v-if="data" :value="data.flag[2]" ok-text="确定" cancel-text="取消">
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
                        <ion-chip v-if="item.valid%2===0" color="success">
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
                        <template v-if="item.origin!=='1'">
                        <ion-item v-if="!item.edit" lines="none">
                            <ion-button v-if="item.valid%2===1" @click="item.valid=data.flag[3]+2"><ion-icon :icon="push"/>启用</ion-button>
                            <ion-button v-else @click="item.valid=data.flag[3]+1"><ion-icon :icon="trash"/>撤回</ion-button>
                            <ion-button @click="item.edit=true"><ion-icon :icon="create"/>编辑</ion-button>
                        </ion-item>
                        <ion-item v-else lines="none">
                                <ion-button @click="item.edit=false"><ion-icon :icon="create"/>取消</ion-button>
                                <ion-button @click="save(item)"><ion-icon :icon="create"/>保存</ion-button>
                        </ion-item>
                        </template>
                    </ion-card-content>
                </ion-card>
            </ion-list>
        </ion-content>
        <ion-footer>
            <ion-toolbar>
                <ion-row>
                    <ion-col :size="6" v-if="history.length">
                        <ion-button @click="goBack" color="light" expand="block">回到上一组</ion-button>
                    </ion-col>
                    <ion-col :size="history.length?6:12" >
                        <ion-button  @click="saveData" :disabled="saving" expand="block"><ion-spinner v-if="saving"/>标记已阅并刷新</ion-button>
                    </ion-col>
                </ion-row>
            </ion-toolbar>
        </ion-footer>
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
import { IonPage, IonHeader, IonContent, IonToolbar, IonFooter, IonCard, IonCardContent, IonCardHeader } from '@ionic/vue';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { create, trash, push } from 'ionicons/icons';
import { getEntity, downEntity, saveEntity } from '@/api/api'

export default defineComponent({
  name: 'App',
  components: {
      IonPage, IonHeader, IonContent, IonToolbar, IonFooter, IonCard, IonCardContent, IonCardHeader 
  },
  setup() {
      const data=ref(null)
      const saving=ref(false)
      const downloading=ref(false)
      const history=ref([])
      const map={
          'C':'主席/首领',
          'E':'雇员',
          'L':'位置',
          'N':'无关系'
      }
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
      const goBack = async ()=>{
          if (data.value) {
            const tempFlag: Array<any> = ((history.value).pop() as any)
            data.value = null
            const res: any = await getEntity({'e1':tempFlag[0], 'e2':tempFlag[1], 'label':tempFlag[2], 'valid':tempFlag[3]})
            if (res.flag) {
                data.value = {
                    list: res.data,
                    flag: res.flag
                } as any
            }
          }
      }
      const test = (item: any)=>{
          if (item.editEl){
              item.sentence=item.editEl.innerHTML
          }
          
      }
      const getData = async()=>{
          const res: any = await getEntity({})
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
                  uploadList.push([list[i].ID, (list[i].valid===(data.value as any).flag[3])?(list[i].valid+2):list[i].valid, list[i].sentence]);
              }
              console.log(uploadList, (data.value as any).flag[2])
              const res: any = await saveEntity({list:uploadList, label:(data.value as any).flag[2]});
                (history.value as any).push((data.value as any).flag)
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
          downloading,
          history,
          goBack,
          map
      }
  }
})
</script>