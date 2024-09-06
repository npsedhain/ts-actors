import { assign, fromPromise, createActor, setup } from 'xstate';

export const workflow = setup({
  types: {
    context: {} as {
      results?: string[];
    }
  },
  actors: {
    solveTasks: fromPromise(
      async ({
        input
      }: {
        input: {
          problems: [(callback: (value: unknown) => void) => void];
        };
      }) => {
        return await Promise.all(
          input.problems.map(async (problem, index) => {
            console.log('solving', index);
            await new Promise((resolve) => problem(resolve));
            return {
              problem,
              result: `Solved ${index}`
            };
          })
        );
      }
    )
  }
}).createMachine({
  id: 'async-tasks',
  initial: 'Start',
  context: {
    results: undefined
  },
  states: {
    Start: {
      invoke: {
        src: 'solveTasks',
        input: ({ event }) => ({
          problems: event.input.tasks
        }),
        onDone: {
          target: 'Done',
          actions: assign({
            results: ({ event }) => event.output.map((r) => r.result)
          })
        }
      }
    },
    Done: {
      type: 'final',
      output: ({ context }) => ({
        results: context.results
      })
    }
  }
});

const actor1 = createActor(workflow, {
  input: {
    tasks: [
      (callback: () => void) =>
        setTimeout(() => {
          console.log('this is the first expression');
          callback();
        }, 500),
      (callback: () => void) =>
        setTimeout(() => {
          console.log('this is the second expression');
          callback();
        }, 1500)
    ]
  }
});

const actor2 = createActor(workflow, {
  input: {
    tasks: [
      (callback: () => void) =>
        setTimeout(() => {
          console.log('this is the third expression');
          callback();
        }, 1000),
      (callback: () => void) =>
        setTimeout(() => {
          console.log('this is the fourth expression');
          callback();
        }, 2000)
    ]
  }
});

actor1.subscribe({
  complete() {
    console.log('workflow of actor 1 completed', actor1.getSnapshot().status);
  },
  next() {
    console.log('actor 1 is working', actor1.id, actor1.getSnapshot().status);
  }
});
actor1.start();

actor2.subscribe({
  complete() {
    console.log('workflow of actor 2 completed', actor2.getSnapshot().status);
  },
  next() {
    console.log('actor 2 is working', actor2.id, actor2.getSnapshot().status);
  }
});
actor2.start();
