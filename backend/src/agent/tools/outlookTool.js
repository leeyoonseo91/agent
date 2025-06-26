import { defineTool } from "@genkit-ai/agent";
import { z } from "genkit";

export const outlookTool = defineTool({
	name: "getTodayEmails",
	description: "Get today's Outlook emails",
	inputSchema: z.object({
		userEmail: z.string()
	}),
	execute: async ({ userEmail }) => {
		return `📧 메일 요약 for ${userEmail}`;
	}
});
