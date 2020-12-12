<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-item>
                    <ion-input @ionChange="handleInput"  :value="url" :disabled="!edit" placeholder="请设置搜索网址"/>
                <ion-buttons v-if="!edit">
                    <ion-button @click="edit=true" color="medium">
                        <ion-icon :icon="create"/>编辑
                    </ion-button>
                </ion-buttons>
                <ion-buttons v-else>
                    <ion-button @click="edit=false" color="medium">
                        取消
                    </ion-button>
                    <ion-button @click="saveUrl" color="success">
                        保存
                    </ion-button>
                </ion-buttons>
                </ion-item>
                <ion-item :lines="stateInfo===''?'none':'full'">
                <ion-text color="danger">
                     注：链接中用{entity}表示实体名称，也可以用{entity1}，{entity2}区分两个实体
                </ion-text>
                </ion-item>
                <ion-item style="font-size:0.8em;" v-if="stateInfo!=''">
                    <ion-icon :icon="search"/>
                    {{stateInfo}}
                </ion-item>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list v-if="inState!==4">
                <ion-card v-for="(item,idx) in resultList" :key="idx">
                    <ion-card-header>
                        <ion-item>
                            <ion-checkbox @ionChange="item.checked = $event.detail.checked" :checked="item.checked"/>
                            <ion-label>（{{item.entity1+','+item.entity2+','+item.label}}）</ion-label>
                        </ion-item>
                    </ion-card-header>
                    <ion-card-content>
                        {{item.sentence}}
                    </ion-card-content>
                </ion-card>
            </ion-list>
            <ion-list v-else>
                <ion-item>
                    <ion-label>成功数量：{{uploadRes.success}}</ion-label>
                    <ion-label>失败数量：{{uploadRes.fail}}</ion-label>
                </ion-item>
                <ion-card v-for="(item,idx) in uploadRes.failList" :key="idx">
                    <ion-card-header>
                        <ion-item>
                            <ion-label color="primary">失败原因：</ion-label>
                            <ion-label color="medium">{{item.reason}}</ion-label>
                        </ion-item>
                    </ion-card-header>
                    <ion-card-content>
                        {{item.data}}
                    </ion-card-content>
                </ion-card>
            </ion-list>
        </ion-content>
        <ion-footer v-if="!edit">
            <ion-toolbar>
                <ion-item @click="start" v-if="inState===0 && entityList.length && url!=='' " lines="none" button>
                    <ion-title  color="success" style="text-align:center">
                        开始搜索
                    </ion-title>
                </ion-item>
                <ion-item @click="stop" v-else-if="inState===1" lines="none" button>
                    <ion-title color="danger" style="text-align:center">
                        <ion-spinner/>停止搜索
                    </ion-title>
                </ion-item>
                <ion-row v-else-if="inState===2">
                    <ion-col v-if="searchPL<entityList.length" size="4">
                    <ion-item @click="start"  lines="none" button>
                        <ion-title color="success" style="text-align:center">
                            继续搜索
                        </ion-title>
                    </ion-item>
                    </ion-col>
                    <ion-col :size="searchPL<entityList.length?4:6">
                    <ion-item lines="none" button>
                        <ion-title @click="add" color="primary" style="text-align:center">
                            添加选中
                        </ion-title>
                    </ion-item>
                    </ion-col>
                    <ion-col :size="searchPL<entityList.length?4:6">
                    <ion-item @click="reset" lines="none" button>
                        <ion-title color="medium" style="text-align:center">
                            重新搜索
                        </ion-title>
                    </ion-item>
                    </ion-col>
                </ion-row>
                <ion-item v-else-if="inState===3" lines="none" button>
                    <ion-title color="primary" style="text-align:center">
                        <ion-spinner/>保存中
                    </ion-title>
                </ion-item>
                <ion-item @click="()=>{resultList=[];inState=2}" v-else-if="inState===4" lines="none" button>
                    <ion-title color="success" style="text-align:center">
                        返回搜索界面
                    </ion-title>
                </ion-item>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>
<script lang="ts">
import { IonPage, IonHeader, IonContent, IonToolbar, IonFooter, IonCard, IonCardContent, IonCardHeader, IonInput,  } from '@ionic/vue';
import { defineComponent, onMounted, onUnmounted, reactive, ref, toRefs } from 'vue';
import { create, trash, push, search } from 'ionicons/icons';
import { getEntityL, getData, upload } from '@/api/api'


export default defineComponent({
  name: 'App',
  components: {
      IonPage, IonHeader, IonContent, IonToolbar, IonFooter ,IonInput
  },
  setup() {
      const state = reactive({
          edit:false,
          url:'https://baike.baidu.com/item/{entity}',
          editContent:'',
          inState:0,
          stateInfo:'正在从数据库拉取实体对……',
          searchPL:0,
          entityList:[],
          resultList:[],
          uploadRes:null
      })
      const handleInput=(e: any)=>{
         state.editContent=e.detail.value
      }
      const saveUrl=()=>{
        state.url=state.editContent
        state.edit=false;
      }
      const getEntity=async()=>{
          const res: any = await getEntityL({})
          state.entityList = res.data
          state.stateInfo = ''
      }
      const reset = ()=>{
          state.resultList = []
          state.searchPL = 0
          state.stateInfo = ''
          state.inState = 0
      }
      onMounted(()=>{
        getEntity()
      })
      const dataFormat = (response: string)=>{
        return response.replace(/<[/]*(a|strong|span).*?>/g,"").replace(/<[^>]*?\/>/g,"")
      }
      const stop=()=>{
        state.inState=(state.searchPL?2:0)
        state.stateInfo = ''
      }
      const add=async()=>{
          state.inState=3
          const uploadList = [];
          for (let i=0;i<state.resultList.length;i++) {
            const item: any=state.resultList[i]
            if (item.checked) {
                  uploadList.push([item.entity1, item.entity2, item.label, item.sentence])
            }
          }
          if (uploadList.length>0) {
              (state.uploadRes as any) = await upload({list:uploadList})
              state.inState = 4
          } else {
              state.inState = 2
          }
      }
      const start=async()=>{
        const el=state.entityList
        state.inState=1
        const re="([ 0-9\\u4e00-\\u9fa5，……‘’“”：【】—｛｝（）〈〉*《》、]|-)"
        for (;state.searchPL<el.length&&state.inState===1;state.searchPL++){
            const item = el[state.searchPL]
            state.stateInfo = '正在搜索实体对（'+item[0]+","+item[1]+","+item[2]+")……"
            
            if (state.url.match(/{entity}/)){
                for (let k=0;k<2;k++){
                    const e1 = item[k?0:1]
                    const e2 = item[k?1:0]
                    const res: any = await getData(state.url.replace(/{entity}/g, e1).replace(/{entity1}/g, item[0]).replace(/{entity2}/g, item[1]))
                    const data = dataFormat(res)
                    const reg= RegExp(re+"+"+e1+re+"*|"+re+"*"+e1+re+"+","g")
                    if (data) {
                        let arr = reg.exec(data)
                        while (arr!==null){
                            const formatStr=arr[0].replace(e1,'')
                            if(formatStr.match(e2)&&formatStr!=e2&&(!arr[0].match(/为您推荐/))){
                                (state.resultList as any).push({
                                        entity1: item[0],
                                        entity2: item[1],
                                        label: item[2],
                                        sentence: arr[0].replace(/ /g,"").replace(/^[^0-9\u4e00-\u9fa5“]+/,"").replace(/[^0-9\u4e00-\u9fa5）》”]+$/,""),
                                        checked: true
                                })
                            }
                            arr = reg.exec(data)
                        }
                    }
                }
            } else {
                const res: any = await getData(state.url.replace(/{entity1}/g, item[0]).replace(/{entity2}/g, item[1]))
                const data = dataFormat(res)
                const reg= RegExp(re+"+"+item[0]+re+"*|"+re+"*"+item[0]+re+"+","g")
                if (data) {
                    let arr = reg.exec(data)
                        while (arr!==null){
                            const formatStr=arr[0].replace(item[0],'')
                            if(formatStr.match(item[1])&&formatStr!=item[1]&&(!arr[0].match(/为您推荐/))){
                                (state.resultList as any).push({
                                    entity1: item[0],
                                    entity2: item[1],
                                    label: item[2],
                                    sentence: arr[0].replace(/ /g,"").replace(/^[^0-9\u4e00-\u9fa5“]+/,"").replace(/[^0-9\u4e00-\u9fa5）》”]+$/,""),
                                    checked: true
                                })
                            }
                            arr = reg.exec(data)
                        }
                }
            }
                
        }
        state.stateInfo = ''
      }
      return {
          create,
          search,
          saveUrl,
          handleInput,
          start,
          stop,
          reset,
          add,
          ...toRefs(state)
      }
  }
})
</script>