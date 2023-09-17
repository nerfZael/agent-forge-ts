import { Agent, Logging } from "./wrap";

async function main() {
  console.log("Invoking: Logging.info(...)");

  const logger = new Logging();

  await logger.info({
    message: "Hello there",
  });

  await logger.info({
    message: "Hello again",
  });

  await logger.info({
    message: "One last time...",
  });
  const agent = new Agent();

  let runResult = (await agent.run({ goal: "goal" }));

  if (!runResult.ok) {
    throw new Error(runResult.error?.toString());
  }

  while(true) {
    runResult = await agent.runStep({ input: "input", state: runResult.value.state });
    if (runResult.ok) {
      const decodedState = JSON.parse(runResult.value.state);

      if (decodedState.finished) {
        break;
      }

    } else {
      throw new Error(runResult.error?.toString());
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
