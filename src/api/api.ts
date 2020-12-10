import request from '@/utils/request'

export const getEntity=(params: any)=>request({
    url: "test1.php",
    method: 'get',
    params
  })
export const saveEntity=(data: any)=>request({
    url: "save.php",
    method: 'post',
    data
  })
  export const downEntity=()=>request({
    url: "test.php",
    method: 'get'
  })