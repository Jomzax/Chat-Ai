# บันทึกการใช้งาน AI

## Session 1: ตั้งค่าโปรเจค Next.js
**คำถามที่ถาม AI:** "ช่วยตั้งค่า Next.js 14 พร้อม TypeScript และ Tailwind ให้หน่อย"
**AI ตอบว่า:** แนะนำให้รัน `npx create-next-app@latest` พร้อม flag `--typescript --tailwind` และตั้งค่า ESLint
**สิ่งที่เราปรับเอง:** เปลี่ยนจาก Next.js 14 เป็น 15, เพิ่ม Prettier เข้าไปด้วย

## Session 2: ทำระบบอัปโหลดไฟล์
**คำถามที่ถาม AI:** "อยากทำระบบอัปโหลดรูปไป Supabase Storage"
**AI ตอบว่า:** เขียน API route ที่รับ FormData แล้วใช้ `supabase.storage.from().upload()` พร้อมตัวอย่าง client component
**สิ่งที่เราปรับเอง:** เพิ่มการ resize รูปก่อนอัปโหลดด้วย sharp, จำกัดขนาดไฟล์ 5MB
