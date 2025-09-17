import { config } from "dotenv";
config({ path: "./.env" });
import { GameAgent } from "@virtuals-protocol/game";
import TokenMetricsPlugin from "../index";

const tokenMetricsPlugin = new TokenMetricsPlugin({
  apiClientConfig: {
    apiKey: process.env.TOKENMETRICS_API_KEY!,
  },
});

// Create an agent to get moonshot tokens for high-potential trading opportunities
const agent = new GameAgent(process.env.GAME_API_KEY ?? "", {
  name: "TokenMetrics Moonshot Analyst",
  goal: "Get AI-curated token picks (Moonshots) with high breakout potential based on grades, sentiment, volume, and on-chain data to help users trade smarter and faster.",
  description:
    "You are an AI agent specialized in identifying high-potential cryptocurrency moonshots using TokenMetrics AI analysis. You help users discover tokens with strong breakout potential based on comprehensive analysis of grades, sentiment, volume, and on-chain data.",
  workers: [
    tokenMetricsPlugin.getWorker({
      functions: [tokenMetricsPlugin.getMoonshotTokens],
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
