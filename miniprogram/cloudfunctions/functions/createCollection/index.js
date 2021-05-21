const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    // 创建集合
   await db.createCollection('sales')
   await db.collection('sales').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      region: '华东',
      city: '上海',
      sales: 11
    }
  })
  await db.collection('sales').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      region: '华东',
      city: '南京',
      sales: 11
    }
  })
  await db.collection('sales').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      region: '华南',
      city: '广州',
      sales: 22
    }
  })
  await db.collection('sales').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      region: '华南',
      city: '深圳',
      sales: 22
    }
  })
  return {
    success: true
  }
  } catch (e) {
    return {
      success: true,
      data: 'create collection success'
    }
  }
}