import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/token',
    method: 'post',
    data
  })
}

export function logout() {
  /* return request({
    url: '/login/logout',
    method: 'post'
  }) */
  return new Promise((resolve,reject)=>{
    
    resolve()
  })
}

export function getUserInfo(token) {
  /* return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  }) */
  return new Promise((resolve,reject)=>{
    let admin = {
      roles: ['admin'],
      token: 'admin',
      introduction: '我是超级管理员',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    }
    let res = {
      data: admin
    }
    resolve(res)
  })
}

