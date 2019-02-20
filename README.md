# Signals - CLI to manage your progress
```
  _____  _                       _
/  ___|(_)                     | |
\ `--.  _   __ _  _ __    __ _ | | ___
 `--. \| | / _` || '_ \  / _` || |/ __|
/\__/ /| || (_| || | | || (_| || |\__ \
\____/ |_| \__, ||_| |_| \__,_||_||___/
            __/ |
           |___/
```

Signals is a file based, _functional_ CLI to manage append only logs of signals and events.
Signals is inspired by the concept of __Goals, Signals and Measures__ described here: [Goals, Signals and Measures](https://www.atlassian.com/team-playbook/plays/goals-signals-measures)

## Getting Started
Getting started with signals is simple.

1. Clone this repository into a directory of your choosing.
2. `npm install` to gather dependencies.
3. `npm build` to build the project with Babel
4. Add any `<signal-collection>.md` file to the collections folder. Where `<signal-collection>` is the name of your collection.
5. Either use `npm start` to run the CLI in place or run 'npm link' to use `signals` on the command line anywhere. __Warning__: Build the project before running `npm link`.

## Arguments
- `--visualise` will allow you to produce a log view of any signal collection.
- `--create` will allow you to create a new collection.

## Visualisation
Currently by specifying `signals --visualise` you can produce a log view of any signal collection.

## Message Types
- __Signals__: Represent log entries that directly contribute to the signal that you are tracking.
- __Events__: Represent information log entries that are related to the signal you are tracking that may provide context or other information related to the signal. Events are __not__ signals and do not count towards any metric.

## Tool Roadmap
- [x] Log style console visualisation for a signal collection.
- [ ] Convert to es6 style imports
- [ ] Allow command line argument for creation of new signal collections.
- [ ] Move functions into logical modules
- [ ] Metrics and tallies
    - [ ] Signals Completed
    - [ ] Velocity
    - [ ] Signal Value Graph
    - [ ] Signal Velocity
- [ ] Tests and Test Coverage
- [ ] CI