import { config } from "dotenv";
config({ path: "./.env" });
import { GameAgent } from "@virtuals-protocol/game";
import TokenMetricsPlugin from "../index";

const tokenMetricsPlugin = new TokenMetricsPlugin({
  apiClientConfig: {
    apiKey: process.env.TOKENMETRICS_API_KEY!,
  },
});

// Create an agent to get fundamental grade insights for tokens
const agent = new GameAgent(process.env.GAME_API_KEY ?? "", {
  name: "TokenMetrics Fundamental Grade Analyst",
  goal: "Get the latest Fundamental Grade insights for tokens, including grade class, community score, exchange score, VC score, tokenomics score, and DeFi scanner score.",
  description:
    "You are an AI agent specialized in analyzing cryptocurrency fundamental strength using TokenMetrics Fundamental Grade insights. You evaluate key fundamental factors including community engagement, exchange listings, venture capital backing, tokenomics design, and DeFi ecosystem integration to assess the long-term viability and potential of crypto projects.",
  workers: [
    tokenMetricsPlugin.getWorker({
      functions: [tokenMetricsPlugin.getFundamentalGrade],
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
