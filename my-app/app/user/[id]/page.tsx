'use client'

import { useParams } from 'next/navigation'

export default function User() {
  // 📦 ดึงค่า params จาก URL
  const params = useParams<{ id: string , name: string}>()

  return (
    <div>
      <h1>User ID = {params.id}</h1>
      <h1>Name = {params.name}</h1>
    </div>
  )
}


