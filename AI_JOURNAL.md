# บันทึกการใช้งาน AI

## Session 1: สร้างระบบบันทึก AI Journal อัตโนมัติ
**คำถามที่ถาม AI:** "จะทำยังไงให้ AI บันทึก AI_JOURNAL.md ให้ตลอดทุกการถาม หรือสร้างโฟลเดอร์ skills ดีกว่าไหม"
**AI ตอบว่า:** แนะนำสร้าง custom skill/slash command แทนการใช้ hook อัตโนมัติ เพราะคุมได้ดีกว่า แล้วสร้างไฟล์ `.claude/skills/journal/SKILL.md` (พร้อม template.md และ examples/sample.md) และ `.claude/commands/journal.md` ให้พิมพ์ `/journal` เรียกใช้ได้
**สิ่งที่เราปรับเอง:** ทักว่าโครงสร้างที่ถูกต้องคือ `.claude/skills/<skill-name>/SKILL.md` ตามเอกสารทางการ ไม่ใช่ `.claude/commands/` อย่างที่ AI แนะนำตอนแรก

## Session 2: ทดสอบระบบบันทึก AI Journal
**คำถามที่ถาม AI:** "ทดสอบระบบบันทึก AI Journal ว่าทำงานไหม"
**AI ตอบว่า:** เพิ่ม Session ใหม่ต่อท้ายไฟล์ `AI_JOURNAL.md` โดยอัตโนมัติเพื่อยืนยันว่า skill `/journal` ทำงานได้ถูกต้อง
**สิ่งที่เราปรับเอง:** -

## Session 3: ตั้งค่าให้บันทึก Journal อัตโนมัติ
**คำถามที่ถาม AI:** "ทำเลย" (สร้าง CLAUDE.md เพื่อให้ AI บันทึก journal อัตโนมัติทุกการถาม)
**AI ตอบว่า:** สร้างไฟล์ `CLAUDE.md` ที่ root ของโปรเจคพร้อมกติกาให้ AI บันทึก Session ใหม่ลง `AI_JOURNAL.md` หลังตอบทุกครั้ง พร้อมกำหนดข้อยกเว้น
**สิ่งที่เราปรับเอง:** -

## Session 4: ถามวันที่และเวลาในกรุงเทพ
**คำถามที่ถาม AI:** "วันนี้วันอะไรเดือนอะไรปีอะไรเวลาในกรุงเทพกี่โมง"
**AI ตอบว่า:** วันพุธที่ 29 เมษายน 2026 แต่ไม่มีข้อมูลเวลา real-time ให้ดูนาฬิกาเครื่องเอา
**สิ่งที่เราปรับเอง:** -

## Session 5: ถามว่าระบบบันทึกใช้กติกาจากไหน
**คำถามที่ถาม AI:** "คุณเรียกใช้ AI_JOURNAL.md จากไหน — จาก skill หรือจาก CLAUDE.md"
**AI ตอบว่า:** ครั้งล่าสุดทำตามกติกาใน `CLAUDE.md` (โหลดอัตโนมัติทุก session) ไม่ได้เรียก skill อธิบายความต่างระหว่าง CLAUDE.md (อัตโนมัติ) กับ skill `/journal` (ต้องเรียกเอง)
**สิ่งที่เราปรับเอง:** -

## Session 6: ถามว่าระบบบันทึกอัตโนมัติทำให้ช้าลงไหม
**คำถามที่ถาม AI:** "มันจะทำให้ทำงานช้ากว่าเดิมไหม"
**AI ตอบว่า:** ช้าลงนิดหน่อย ราว 2-5 วินาที/คำตอบ จากการเพิ่ม tool call (Read + Edit) และโหลด CLAUDE.md เข้า context พร้อมแนะนำทางเลือกถ้าอยากปิด/กรองเฉพาะคำถามสำคัญ
**สิ่งที่เราปรับเอง:** -

## Session 7: ปิดระบบบันทึกอัตโนมัติ
**คำถามที่ถาม AI:** "1" (เลือกตัวเลือกที่ 1: ปิดอัตโนมัติ)
**AI ตอบว่า:** ลบไฟล์ `CLAUDE.md` ทิ้งเพื่อปิดการบันทึกอัตโนมัติ จากนี้จะบันทึกก็ต่อเมื่อผู้ใช้สั่ง `/journal` เท่านั้น
**สิ่งที่เราปรับเอง:** -

## Session 8: ลบโครงสร้างที่ซ้ำซ้อน
**คำถามที่ถาม AI:** ".claude/commands กับ .claude/skills/journal จำเป็นไหม" แล้วตามด้วย "แก้สิ"
**AI ตอบว่า:** อธิบายว่าทั้งสองทำงานเหมือนกัน แนะนำเก็บ `.claude/skills/journal/` ไว้เพราะเป็นโครงสร้างมาตรฐาน แล้วลบ `.claude/commands/journal.md` พร้อมโฟลเดอร์ commands ที่ว่างทิ้ง
**สิ่งที่เราปรับเอง:** -

## Session 9: เปิดระบบบันทึกอัตโนมัติอีกครั้ง
**คำถามที่ถาม AI:** "เปิดระบบอัตโนมัติสิ"
**AI ตอบว่า:** ตรวจสอบพบว่าไฟล์ `CLAUDE.md` ยังอยู่ (การลบครั้งก่อนไม่สำเร็จหรือถูกสร้างกลับมา) ระบบ auto-journal จึงทำงานอยู่แล้ว
**สิ่งที่เราปรับเอง:** -

## Session 10: ลบ Session ทั้งหมดให้เหลือ 1
**คำถามที่ถาม AI:** "ลบ AI_JOURNAL.md ให้เหลือ 1 ได้ไหม"
**AI ตอบว่า:** เขียนทับไฟล์ใหม่โดยเหลือเฉพาะ Session 1
**สิ่งที่เราปรับเอง:** สั่งย้อนกลับทันทีหลังจากนั้น

## Session 11: ย้อนกลับการลบ Session
**คำถามที่ถาม AI:** "ย้อนกลับได้"
**AI ตอบว่า:** กู้คืนเนื้อหา Session 2-9 จากประวัติการสนทนา และเพิ่ม Session 10 (การลบ) กับ 11 (การย้อนกลับ) เป็นบันทึกเหตุการณ์
**สิ่งที่เราปรับเอง:** -

## Session 12: ขออธิบาย Skills
**คำถามที่ถาม AI:** "คุณรู้จัก skills ไม่ อธิบายมาหน่อย"
**AI ตอบว่า:** อธิบายว่า skill คือชุดคำสั่งเฉพาะทางที่ AI เรียกใช้เมื่อเจองานตรงกับ description พร้อมโครงสร้างไฟล์ (SKILL.md + frontmatter), ที่อยู่ 3 ระดับ (personal/project/plugin), วิธีเรียกใช้, ตัวอย่าง skill ในเครื่อง และความต่างจาก CLAUDE.md
**สิ่งที่เราปรับเอง:** -

## Session 13: เพิ่มเป้าหมายโปรเจคลง CLAUDE.md
**คำถามที่ถาม AI:** ผู้ใช้แชร์ spec โปรเจค (web app: Login/Chat/Upload/Token Usage), Tech Stack (Next.js/Nuxt.js + DB อะไรก็ได้ + Docker Compose), Required Features 30 คะแนน, Bonus 20 คะแนน, Code Quality 15 คะแนน
**AI ตอบว่า:** เพิ่มข้อมูลทั้งหมดลง `CLAUDE.md` แบ่งเป็นหัวข้อ เป้าหมายโปรเจค / Tech Stack / Required Features / Bonus Features / Code Quality พร้อมคงส่วน AI Journal เดิมไว้
**สิ่งที่เราปรับเอง:** -

## Session 14: ระบุ Tech Stack และขอบเขตงานชัดเจน
**คำถามที่ถาม AI:** ผู้ใช้ระบุ stack ที่จะใช้: Next.js (frontend), Express.js (backend), MongoDB, Claude API หรือ Gemini, JWT + bcrypt, Docker Compose พร้อมยืนยันต้องทำ Required Features ครบ และเลือกทำ Bonus 20 คะแนน
**AI ตอบว่า:** อัปเดต `CLAUDE.md` หัวข้อ Tech Stack ให้ระบุชัดเจน (ไม่ใช่ทางเลือก) และเพิ่มหัวข้อ "ขอบเขตงาน" ระบุว่า Required ทำครบทุกข้อ Bonus เป้าหมาย 20 คะแนน
**สิ่งที่เราปรับเอง:** -

## Session 15: แนะนำ skill จาก GitHub repo ที่เหมาะกับโปรเจค
**คำถามที่ถาม AI:** "ช่วยดู skill ใน github นี้หน่อย https://github.com/alirezarezvani/claude-skills.git ว่าอันไหนเหมาะกับโปรเจคนี้"
**AI ตอบว่า:** ดึงข้อมูล repo มาวิเคราะห์ แนะนำ skill 4 ตัวหลัก (rag-architect, database-designer, api-design-reviewer, api-test-suite-builder) + 4 ตัวเสริม (pr-review-expert, dependency-auditor, observability-designer, ci-cd-pipeline-builder) พร้อมเสนอลำดับการใช้งาน
**สิ่งที่เราปรับเอง:** -

## Session 16: ติดตั้ง skills จาก GitHub ลงโปรเจค
**คำถามที่ถาม AI:** "ติดตั้งให้หน่อยสิเอาไปใส่ในโฟลเดอร์ skills ด้วยนะ"
**AI ตอบว่า:** clone repo ไปที่ `/tmp/claude-skills` แล้ว copy ทั้ง 8 skills จาก `engineering/` ไปยัง `.claude/skills/` ของโปรเจค Claude Code โหลดอัตโนมัติพร้อมใช้งาน
**สิ่งที่เราปรับเอง:** -

## Session 17: ถามเรื่องโฟลเดอร์ .codex
**คำถามที่ถาม AI:** "แล้วตัวที่ชื่อว่า .codex ละ"
**AI ตอบว่า:** อธิบายว่า `.codex/` เป็น packaging สำหรับ OpenAI Codex ไม่ใช่ Claude Code — เป็นแค่ index/symlink ชี้กลับไปยังไฟล์ skill จริงใน domain folder (engineering, marketing, ฯลฯ) เราใช้ Claude Code จึง copy จาก `engineering/` ถูกต้องแล้ว ไม่ต้องติดตั้ง `.codex/`
**สิ่งที่เราปรับเอง:** -

## Session 18: ขอรายชื่อ skills ที่ติดตั้ง
**คำถามที่ถาม AI:** "มี skills อะไรบ้างที่ติดตั้ง"
**AI ตอบว่า:** ลิสต์ 9 skills รวม journal (ของผู้ใช้) + 8 ตัวจาก GitHub (rag-architect, database-designer, api-design-reviewer, api-test-suite-builder, pr-review-expert, dependency-auditor, observability-designer, ci-cd-pipeline-builder) พร้อมคำอธิบายสั้นๆ ของแต่ละตัว
**สิ่งที่เราปรับเอง:** -

