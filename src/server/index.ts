import amqp from "amqplib";
import { publishJSON } from "../internal/pubsub/publish.js";
import type { PlayingState } from "../internal/gamelogic/gamestate.js";

import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";

async function main() {
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const connection = await amqp.connect(rabbitConnString);

  const channel = await connection.createConfirmChannel();

  const playingState: PlayingState = {
    isPaused: true,
  };

  await publishJSON(channel, ExchangePerilDirect, PauseKey, playingState);

  console.log("Connected to RabbitMQ!");
  console.log("Starting Peril server...");

  process.on("SIGINT", async () => {
    console.log("Shutting down...");

    await connection.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
