import { defineTool } from "@genkit-ai/agent";
import { z } from "genkit";

export const teamsTool = defineTool({
	name: "sendTeamsMessage",
	description: "Send a message to Microsoft Teams",
	inputSchema: z.object({
		channelId: z.string(),
		message: z.string()
	}),
	execute: async ({ channelId, message }) => {
		return `✅ Teams 채널(${channelId})에 전송됨: ${message}`;
	}
});
