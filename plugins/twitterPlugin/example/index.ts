import { GameAgent, GameWorker } from "@virtuals-protocol/game";
import TwitterPlugin, { GameTwitterClient } from "@virtuals-protocol/game-twitter-plugin";
import dotenv from "dotenv";

dotenv.config();

// Use the GameTwitterClient which implements ITweetClient (required by TwitterPlugin)
const gameTwitterClient = new GameTwitterClient({
  accessToken: process.env.GAME_TWITTER_ACCESS_TOKEN,
});

// const nativeTwitterClient = new TwitterApi({
//   appKey: "xxxxxxx",
//   appSecret: "xxxxxxx",
//   accessToken: "xxxxxxx",
//   accessSecret: "xxxxxxxxx",
// });

// Create a worker with the functions
const twitterPlugin = new TwitterPlugin({
  id: "twitter_worker",
  name: "Twitter Worker",
  description:
    "A worker that will execute tasks within the Twitter Social Platforms. It is capable of posting, reply, quote and like tweets.",
  twitterClient: gameTwitterClient,
});

// Create an agent with the worker
const agent = new GameAgent(process.env.VIRTUALS_API_TOKEN, {
  name: "Twitter Bot",
  goal: "find tweets from @btreeOrion or tweets that mention @btreeOrion",
  description: "A bot that can post tweets, reply to tweets, and like tweets",
  workers: [
    // Use local GameWorker that's compatible with local GameAgent
    new GameWorker({
      id: "twitter_worker",
      name: "Twitter Worker",
      description: "Twitter integration worker",
      functions: [
        twitterPlugin.searchTweetsFunction,
        //twitterPlugin.replyTweetFunction,
        //twitterPlugin.postTweetFunction,
      ],
      getEnvironment: async () => {
        return {
          ...(await twitterPlugin.getMetrics()),
          username: "virtualsprotocol",
          token_price: "$100.00",
        };
      },
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

  // Simple loop with delay to avoid a tight infinite loop hammering the API
  while (true) {
    await agent.step({
      verbose: true,
    });
    await new Promise((r) => setTimeout(r, 5_000));
  }
})();
