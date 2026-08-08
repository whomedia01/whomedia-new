import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for Project/Rental Inquiry Submission
  app.post("/api/inquiry", async (req, res) => {
    try {
      const { company, name, phone, category, message } = req.body;
      const createdAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

      if (!company || !name || !phone || !category || !message) {
        return res.status(400).json({ success: false, message: "필수 입력 항목이 누락되었습니다." });
      }

      console.log(`[INQUIRY RECEIVED]`, { company, name, phone, category, message, createdAt });

      return res.json({
        success: true,
        message: "문의가 성공적으로 접수되었습니다."
      });
    } catch (error) {
      console.error("Inquiry processing error:", error);
      return res.status(500).json({ success: false, message: "문의 접수 중 서버 오류가 발생했습니다." });
    }
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
