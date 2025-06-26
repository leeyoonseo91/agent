// 필요한 라이브러리 가져오기
import { genkit } from "genkit";
// import { googleAI } from "@genkit-ai/googleai";
import { ollama } from "genkitx-ollama";

// Genkit 설정
// const ai = genkit({
// 	plugins: [googleAI()],
// 	model: googleAI.model("gemini-2.5-flash")
// });

const ai = genkit({
	plugins: [
		ollama({
			models: [
				{
					name: "gemma3:4b-it-qat",
					type: "generate" // type: 'chat' | 'generate' | undefined
				}
			],
			serverAddress: "http://127.0.0.1:11434" // default local address
		})
	],
	model: "ollama/gemma3:4b-it-qat"
});

// AI와 대화하는 함수
async function chatWithAI() {
	try {
		console.log("🤖 AI와 대화를 시작합니다...\n");

		// AI에게 질문하기
		const response = await ai.generate("안녕하세요! 당신은 누구인가요?");

		console.log("🤖 AI 답변:", response.text);
	} catch (error) {
		console.error("❌ 오류 발생:", error.message);
	}
}

// 함수 실행
chatWithAI();
