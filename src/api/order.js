import request from '@/utils/request'

/* 查询列表分页 */
export function fetchPageList(query) {
  return request({
    url: '/order/findPage',
    method: 'get',
    params: query
  })
}

/* 查询独立项 */
export function fetchListItemById(orderid) {
  return request({
    url: '/order/get',
    method: 'get',
    params: {
      orderid: orderid
    }
  })
}

/* 新增 */
export function addNewItem(data) {
  return request({
    url: '/order/save',
    method: 'post',
    data
  })
}

/* 更新 */
export function updateItem(data) {
  return request({
    url: '/order/update',
    method: 'post',
    data
  })
}

/* 删除 */
export function deleteItemById(orderid) {
  return request({
    url: '/order/delete',
    method: 'get',
    params: {
      orderid: orderid
    }
  })
}
