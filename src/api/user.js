import request from '@/utils/request'

/* 查询列表分页 */
export function fetchPageList(query) {
  return request({
    url: '/user/findPage',
    method: 'get',
    params: query
  })
}

/* 查询独立项 */
export function fetchListItemById(userid) {
  return request({
    url: '/user/get',
    method: 'get',
    params: {
      userid: userid
    }
  })
}

/* 更新 */
export function updateItem(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

/* 删除 */
export function deleteItemById(query) {
  return request({
    url: '/user/delete',
    method: 'get',
    params: query
  })
}
