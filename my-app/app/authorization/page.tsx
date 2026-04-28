'use client'

import axios from 'axios'

export default function Authorization() {
  const sendToken = async () => {
    try {
      // 🔐 กำหนด Token จำลอง
      const token = 'abcd'

      // 🔖 Headers สำหรับ Authorization
      const headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }

      // 📦 ข้อมูลที่จะส่งไปยัง API
      const payload = {
        id: 100,
        name: 'java',
        price: 900
      }

      // 🌐 URL ของ API ที่ต้องการส่งข้อมูลไป
      const url = 'http://localhost:3001/api/product/create'

      // 🚀 ส่งข้อมูลแบบ POST พร้อม Header Authorization
      const response = await axios.post(url, payload, { headers })

      // ✅ แสดงผลใน console
      console.log('Response:', response.data)
    } catch (error) {
      // ❌ แสดง Error ถ้ามีปัญหา
      console.error('Error sending token:', error)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Authorization Example</h2>
      <button className="button" onClick={sendToken}>
        Send Token
      </button>
    </div>
  )
}
