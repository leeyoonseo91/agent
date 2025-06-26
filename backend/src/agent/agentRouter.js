import { routerFlow } from "@genkit-ai/flow";
import { outlookTool } from "../tools/outlookTool";
import { jiraTool } from "../tools/jiraTool";
import { teamsTool } from "../tools/teamsTool";
import { defineFlow } from "@genkit-ai/flow";
import { ollama } from "genkitx-ollama";

// const model = genkit({
// 	plugins: [
// 		ollama({
// 			models: [
// 				{
// 					name: "gemma3:4b-it-qat",
// 					type: "generate" // type: 'chat' | 'generate' | undefined
// 				}
// 			],
// 			serverAddress: "http://127.0.0.1:11434" // default local address
// 		})
// 	],
// 	model: "ollama/gemma3:4b-it-qat"
// });
const model = ollama({
	model: "gemma3:4b-it-qat",
	type: "generate",
	serverAddress: "http://127.0.0.1:11434"
});

export const agentRouter = routerFlow({
	name: "agentRouter",
	description: "Router flow for productivity tools",
	routes: [
		{
			name: "checkEmails",
			description: "오늘 받은 Outlook 메일을 확인합니다",
			flow: defineFlow({
				name: "outlookFlow",
				steps: [async ({ inputs }) => await outlookTool.invoke(inputs)]
			})
		},
		{
			name: "checkAssignedIssues",
			description: "Jira에서 나에게 할당된 이슈를 조회합니다",
			flow: defineFlow({
				name: "jiraFlow",
				steps: [async ({ inputs }) => await jiraTool.invoke(inputs)]
			})
		},
		{
			name: "sendTeamsMessage",
			description: "팀즈(Teams)에 메시지를 전송합니다.",
			flow: defineFlow({
				name: "teamsFlow",
				steps: [async ({ inputs }) => await teamsTool.invoke(inputs)]
			})
		},
		{
			name: "summarizeDailyWork",
			description:
				"오늘의 메일과 지라(Jira)에서 나에게 할당된 이슈를 요약하여 팀즈(Teams)에 메시지를 전송합니다",
			flow: defineFlow({
				name: "chainFlow",
				steps: [
					async ({ inputs }) => {
						const mailSummary = await outlookTool.invoke({
							userEmail: inputs.userEmail
						});
						return { mailSummary };
					},
					async ({ inputs, steps }) => {
						const issues = await jiraTool.invoke({
							userEmail: inputs.userEmail
						});
						return {
							mailSummary: steps[0].mailSummary,
							issues
						};
					},
					async ({ inputs, steps }) => {
						const message = `
              ✅ 오늘의 요약:
              📧 메일: ${steps[1].mailSummary}
              🔹 이슈: ${steps[1].issues}
            `;

						const result = await teamsTool.invoke({
							channelId: inputs.channelId,
							message
						});

						return result;
					}
				]
			})
		}
	],
	model
});
