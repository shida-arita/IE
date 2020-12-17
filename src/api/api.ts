import request from '@/utils/request'

export const getEntity=(params: any)=>request({
    url: "test1.php",
    method: 'get',
    params
  })
  export const getData=(u: string)=>request({
    url:"testL.php",
    method: 'get',
    params:{ url:encodeURI(u) }
  })
  export const getEntityL=(params: any)=>request({
    url: "testE.php",
    method: 'get',
    params
  })
export const saveEntity=(data: any)=>request({
    url: "save.php",
    method: 'post',
    data
  })
  export const upload=(data: any)=>request({
    url: "upload2.php",
    method: 'post',
    data
  })
  export const downEntity=(params: any)=>request({
    url: "test.php",
    method: 'get',
    params
  })