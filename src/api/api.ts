import request from '@/utils/request'

export const getEntity=()=>request({
    url: "test1.php",
    method: 'get'
  })
export const saveEntity=(data: any)=>request({
    url: "save.php",
    method: 'post',
    data
  })