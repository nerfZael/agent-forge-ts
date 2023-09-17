from .wrap import Agent


if __name__ == "__main__":
    agent = Agent()

    step = agent.run("goal")
    print(step)
    while True:
      step = agent.run_step("input", step.state)
      print(step)
      if step.output:
          print(step.output)
          break
