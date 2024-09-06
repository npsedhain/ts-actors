## This is the beginning of a series of actor models created using xstate

### To run the project

1. Run `pnpm install`
2. Run `pnpm start`

### Description

- This is a simple promise based actor.
- There are two spawned actors that perform multiple promises.
- Each actors are started and they stop when all the states are completed.

#### Create Actors

```
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
```

#### Start Actors

```
actor1.start();
actor2.start();
```

#### Expected Output

```
solving 0
solving 1
actor 1 is working x:0 active
solving 0
solving 1
actor 2 is working x:2 active
this is the first expression
this is the third expression
this is the second expression
actor 1 is working x:0 done
workflow of actor 1 completed done
this is the fourth expression
actor 2 is working x:2 done
workflow of actor 2 completed done
```
