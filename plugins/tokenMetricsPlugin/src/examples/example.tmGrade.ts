import { config } from "dotenv";
config({ path: "./.env" });
import { GameAgent } from "@virtuals-protocol/game";
import TokenMetricsPlugin from "../index";

const tokenMetricsPlugin = new TokenMetricsPlugin({
  apiClientConfig: {
    apiKey: process.env.TOKENMETRICS_API_KEY!,
  },
});

// Create an agent to get TM Grade insights for tokens
const agent = new GameAgent(process.env.GAME_API_KEY ?? "", {
  name: "TokenMetrics TM Grade Analyst",
  goal: "Get the latest TM Grade for tokens, including trader grade change, quant grade, signals, momentum, and 24-hour percentage changes for both TM Grade and Trader Grade.",
  description:
    "You are an AI agent specialized in analyzing TokenMetrics (TM) Grade insights for cryptocurrencies. You provide comprehensive analysis of TM grades, trader grade changes, quantitative metrics, trading signals, and momentum indicators to help users make informed trading and investment decisions.",
  workers: [
    tokenMetricsPlugin.getWorker({
      functions: [tokenMetricsPlugin.getTmGrade],
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
