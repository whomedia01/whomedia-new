import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface InquiryData {
  id: string;
  company: string;
  name: string;
  phone: string;
  category: string;
  message: string;
  createdAt: string;
  status: '접수대기' | '확인중' | '처리완료';
  adminMemo?: string;
}

// In-memory log for multi-admin real-time tracking (Vercel serverless safe, no fs writes)
const inquiryLogs: InquiryData[] = [
  {
    id: "inq_demo_01",
    company: "(주)한국에듀테크",
    name: "김민준 차장",
    phone: "010-3829-1029",
    category: "이러닝 콘텐츠 기획·개발",
    message: "2026년 하반기 임직원 역량 강화 이러닝 15차시 기획 및 4K 촬영 견적 문의드립니다.",
    createdAt: "2026. 8. 5. 오전 10:15:20",
    status: "확인중",
    adminMemo: "8/5 오전 담당자 유선 통화 완료. 제안서 메일 발송함."
  },
  {
    id: "inq_demo_02",
    company: "서울시교육청 연수원",
    name: "박서연 연구사",
    phone: "010-9281-5820",
    category: "공공·교육 전문 영상 제작",
    message: "교원 AI 디지털 교과서 활용 가이드 영상 5편 제작 관련 스튜디오 대여 및 편집 일정 상담 요청합니다.",
    createdAt: "2026. 8. 5. 오후 1:40:12",
    status: "접수대기",
    adminMemo: ""
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for Multi-Admin Inquiry Notification System
  app.post("/api/inquiry", async (req, res) => {
    try {
      const { company, name, phone, category, message } = req.body;
      const createdAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

      if (!company || !name || !phone || !category || !message) {
        return res.status(400).json({ success: false, message: "필수 입력 항목이 누락되었습니다." });
      }

      const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newInquiry: InquiryData = {
        id,
        company,
        name,
        phone,
        category,
        message,
        createdAt,
        status: "접수대기",
        adminMemo: ""
      };
      inquiryLogs.unshift(newInquiry);

      console.log(`[INQUIRY RECORDED - Admin Board]`, newInquiry);

      return res.json({
        success: true,
        message: "문의가 성공적으로 접수되어 관리자 시스템에 등록되었습니다.",
        data: {
          inquiry: newInquiry,
          totalLogged: inquiryLogs.length
        }
      });
    } catch (error) {
      console.error("Inquiry processing error:", error);
      return res.status(500).json({ success: false, message: "문의 접수 중 서버 오류가 발생했습니다." });
    }
  });

  // API endpoint to retrieve all inquiry logs (Admin dashboard)
  app.get("/api/inquiries", (_req, res) => {
    res.json({ success: true, count: inquiryLogs.length, data: inquiryLogs });
  });

  // API endpoint to update inquiry status or memo
  app.patch("/api/inquiry/:id", (req, res) => {
    const { id } = req.params;
    const { status, adminMemo } = req.body;

    const item = inquiryLogs.find(i => i.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: "해당 문의 항목을 찾을 수 없습니다." });
    }

    if (status && ['접수대기', '확인중', '처리완료'].includes(status)) {
      item.status = status;
    }
    if (typeof adminMemo === 'string') {
      item.adminMemo = adminMemo;
    }

    return res.json({ success: true, message: "문의 상태가 성공적으로 업데이트되었습니다.", data: item });
  });

  // API endpoint to delete inquiry
  app.delete("/api/inquiry/:id", (req, res) => {
    const { id } = req.params;
    const index = inquiryLogs.findIndex(i => i.id === id);
    if (index !== -1) {
      inquiryLogs.splice(index, 1);
      return res.json({ success: true, message: "문의 기록이 삭제되었습니다." });
    }
    return res.status(404).json({ success: false, message: "삭제할 문의를 찾을 수 없습니다." });
  });

  // Vite middleware for development / Production static serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
