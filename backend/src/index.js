import express from "express";
import cors from "cors";
import helmet from "helmet";
import { agentRouter } from "./agent/agentRouter";

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json()); // JSON 요청 파싱

app.use(
	helmet({
		contentSecurityPolicy: false // CSP 비활성화
	})
);

// 라우트
app.get("/", (req, res) => {
	res.send("Hello, Express!");
});

app.post("/chat", async (req, res) => {
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	console.log(req.body);
	const { message } = req.body; // 사용자가 보낸 메시지

	// TODO: 여기에 AI 모델을 호출하고 응답을 생성하는 로직을 추가합니다.
	const botResponse = `백엔드에서 받은 메시지: "${message}"`;

	res.json({
		response: botResponse
	});
});

app.post("/api/agent", async (req, res) => {
	const { input, userEmail } = req.body;
	const result = await agentRouter.invoke({ input, userEmail });
	res.json({ result });
});

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(process.env.PORT);
	console.log(`Server is running on http://localhost:${PORT}`);
});
