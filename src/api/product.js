import request from '@/utils/request'

/* 查询列表分页 */
export function fetchList(query) {
  return request({
    url: '/product/findList',
    method: 'get',
    params: query
  })
}

/* 查询独立项 */
export function fetchListItemById(productId) {
  return request({
    url: '/product/get',
    method: 'get',
    params: {
      productId: productId
    }
  })
}

/* 新增 */
export function addNewItem(data) {
  return request({
    url: '/product/save',
    method: 'post',
    data
  })
}

/* 更新 */
export function updateItem(data) {
  return request({
    url: '/product/update',
    method: 'post',
    data
  })
}

/* 删除 */
export function deleteItemById(productid) {
  return request({
    url: '/product/delete',
    method: 'get',
    params: {
      productid: productid
    }
  })
}
