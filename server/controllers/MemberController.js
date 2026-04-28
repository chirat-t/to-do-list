const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

const MemberController = {
  // ----------------- SIGN UP -----------------
  signup: async (req, res) => {
    try {
      const { name, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newMember = await prisma.member.create({
        data: { name, username, password: hashedPassword },
      });

      res.json(newMember);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ----------------- SIGN IN -----------------
  signin: async (req, res) => {
    try {
      const { username, password } = req.body;

      // ค้นหาผู้ใช้จาก username
      const findUser = await prisma.member.findFirst({
        where: { username },
        select: { id: true, username: true, password: true },
      });

      if (!findUser) {
        return res.status(401).json({ message: 'unauthorized' });
      }

      // ตรวจสอบรหัสผ่าน
      const compare = await bcrypt.compare(password, findUser.password);
      if (!compare) {
        return res.status(401).json({ message: 'unauthorized' });
      }

      // ✅ ใช้ secret key จาก .env
      const secret_key = process.env.SECRET_KEY;

      // ✅ สร้าง payload สำหรับ JWT
      const payload = { id: findUser.id };

      // ✅ สร้าง token มีอายุ 1 วัน
      const token = jwt.sign(payload, secret_key, { expiresIn: '1d' });

      // ✅ ส่ง token กลับไป
      res.json({ id: findUser.id, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ----------------- GET /member/info -----------------
  info: async (req, res) => {
    try {
      // 1) ตรวจสอบ Header Authorization
      const auth = req.headers.authorization || '';
      if (!auth.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ error: 'Missing or invalid Authorization header' });
      }

      // 2) ดึง token ออกมา
      const token = auth.slice(7).trim(); // ลบคำว่า "Bearer "

      // 3) ตรวจสอบ token
      const secret_key = process.env.SECRET_KEY;
      const payload = jwt.verify(token, secret_key); // => { id: ... }
      const member_id = payload.id;

      // 4) ดึงข้อมูลสมาชิก (เพิ่ม username ด้วย ✅)
      const member = await prisma.member.findFirst({
        where: { id: member_id },
        select: {
          name: true,
          username: true, // ✅ เพิ่มบรรทัดนี้
        },
      });

      if (!member) {
        return res.status(404).json({ error: 'member not found' });
      }

      // 5) ส่งข้อมูลกลับ
      res.json(member);
    } catch (err) {
      // ตรวจ error จาก JWT
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: err.message });
      }
      // error ทั่วไป
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
  try {
    const { name, username, password } = req.body
    const token = req.headers['authorization']?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const secret_key = process.env.SECRET_KEY
    const payload = jwt.verify(token, secret_key)
    const member_id = payload.id

    const oldMember = await prisma.member.findUnique({
      where: { id: member_id }
    })
    if (!oldMember) return res.status(404).json({ error: 'User not found' })

    let newPassword = oldMember.password
    if (password && password.trim() !== '') {
      newPassword = await bcrypt.hash(password, 10)
    }

    await prisma.member.update({
      where: { id: member_id },
      data: {
        name,
        username,
        password: newPassword
      }
    })

    res.json({ message: 'success' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}


};

module.exports = MemberController;
