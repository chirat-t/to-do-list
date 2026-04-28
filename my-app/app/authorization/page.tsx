'use client'

import axios from 'axios'
// 1. Import Config เข้ามา (เช็ก Path ให้ตรงกับที่ไฟล์ config.ts ของคุณอยู่)
import { Config } from '../config' 

export default function Authorization() {
  const sendToken = async () => {
    try {
      // กำหนด Token จำลอง
      const token = 'abcd'

      //  Headers สำหรับ Authorization
      const headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }

      // ข้อมูลที่จะส่งไปยัง API
      const payload = {
        id: 100,
        name: 'java',
        price: 900
      }

      // 🌐 2. เปลี่ยน URL ให้ใช้ค่าจาก Config
      // แทนที่จะพิมพ์ localhost ตรงๆ ให้ใช้ Config.apiUrl แทน
      const url = `${Config.apiUrl}/api/product/create`

      // 🚀 ส่งข้อมูลแบบ POST พร้อม Header Authorization
      const response = await axios.post(url, payload, { headers })

      // ✅ แสดงผลใน console
      console.log('Response:', response.data)
      alert('ส่งข้อมูลสำเร็จ!') 
    } catch (error) {
      // ❌ แสดง Error ถ้ามีปัญหา
      console.error('Error sending token:', error)
      alert('เกิดข้อผิดพลาด: Network Error (เช็ก Console เพื่อดูรายละเอียด)')
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