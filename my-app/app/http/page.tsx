'use client'

import axios from 'axios'

export default function Http() {
  const url = 'http://localhost:3000'
  const payload = {
    id: 100,
    name: 'java',
    price: 900
  }

  // ดึงข้อมูลมาแสดงผล
  const doGet = async () => {
    try {
      const response = await axios.get(url)
      console.log('GET Response:', response.data)
    } catch (error) {
      console.error('GET Error:', error)
    }
  }

  // เพิ่มข้อมูล
  const doPost = async () => {
    try {
      const response = await axios.post(url, payload)
      console.log('POST Response:', response.data)
    } catch (error) {
      console.error('POST Error:', error)
    }
  }

  // แก้ไขข้อมูล
  const doPut = async () => {
    try {
      const response = await axios.put(url + '/1', payload)
      console.log('PUT Response:', response.data)
    } catch (error) {
      console.error('PUT Error:', error)
    }
  }

  // ลบข้อมูล
  const doDelete = async () => {
    try {
      const response = await axios.delete(url + '/1')
      console.log('DELETE Response:', response.data)
    } catch (error) {
      console.error('DELETE Error:', error)
    }
  }

  return (
    <div className="flex gap-2">
      <button className="button" onClick={doGet}>GET</button>
      <button className="button" onClick={doPost}>POST</button>
      <button className="button" onClick={doPut}>PUT</button>
      <button className="button" onClick={doDelete}>DELETE</button>
    </div>
  )
}
