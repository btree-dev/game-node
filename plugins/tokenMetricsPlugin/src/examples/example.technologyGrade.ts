import { config } from "dotenv";
config({ path: "./.env" });
import { GameAgent } from "@virtuals-protocol/game";
import TokenMetricsPlugin from "../index";

const tokenMetricsPlugin = new TokenMetricsPlugin({
  apiClientConfig: {
    apiKey: process.env.TOKENMETRICS_API_KEY!,
  },
});

// Create an agent to get technology grade insights for tokens
const agent = new GameAgent(process.env.GAME_API_KEY ?? "", {
  name: "TokenMetrics Technology Grade Analyst",
  goal: "Get Technology Grade insights for tokens, including activity score, security score, repository score, collaboration score, and DeFi scanner score.",
  description:
    "You are an AI agent specialized in analyzing cryptocurrency technology quality using TokenMetrics Technology Grade insights. You evaluate technical aspects including development activity, security measures, code quality, collaboration patterns, and DeFi integration to assess the technological strength of crypto projects.",
  workers: [
    tokenMetricsPlugin.getWorker({
      functions: [tokenMetricsPlugin.getTechnologyGrade],
    }),
  ],
});

(async () => {
  agent.setLogger((agent, message) => {
    console.log(`-----[${agent.name}]-----`);
    console.log(message);
    console.log("\n");
  });

  await agent.init();
  
  while (true) {
    await agent.step({
      verbose: true,
    });
  }
})();
