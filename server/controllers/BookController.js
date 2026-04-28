const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const BookController = {
  list: async (req, res) => {
    const books = await prisma.book.findMany();
    res.json({ books });
  },
  create: async (req, res) => {
    const book = await prisma.book.create({
      data: {
        name: req.body.name,
        price: Number(req.body.price),
      },
    });
    res.json({ book });
  },
  update: async (req, res) => {
    const book = await prisma.book.update({
      data: {
        name: req.body.name,       // ชื่อใหม่จาก request body
        price: req.body.price      // ราคาใหม่จาก request body
      },
      where: {
        id: parseInt(req.params.id) // เลือกหนังสือจาก id ที่ส่งมาทาง URL
      }
    })

    res.json(book)  // ส่งข้อมูลหนังสือที่แก้ไขแล้วกลับไปเป็น JSON
},
  delete: async (req, res) => {
    await prisma.book.delete({
      where: {
        id: parseInt(req.params.id)
      }
    })
    res.json({message: 'success'})
  }
};
module.exports = BookController;