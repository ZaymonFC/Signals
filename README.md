# Signals - CLI to manage your progress
```javascript
//   _____  _                       _      
// /  ___|(_)                     | |     
// \ `--.  _   __ _  _ __    __ _ | | ___ 
//  `--. \| | / _` || '_ \  / _` || |/ __|
// /\__/ /| || (_| || | | || (_| || |\__ \
// \____/ |_| \__, ||_| |_| \__,_||_||___/
//             __/ |                      
//            |___/                       
```

Signals is a filebased, _functional_ CLI to manage append only logs of signals and events.
Signals is inspired by the concept of __Goals, Signals and Measures__ described here: [Goals, Signals and Measures](https://www.atlassian.com/team-playbook/plays/goals-signals-measures)

## Getting Started
Getting started with signals is simple.

1. Clone this repository into a directory of your choosing.
2. `npm install` to gather dependencies.
3. Add any `<signal-collection>.md` file to the collections folder. Where `<signal-collection>` is the name of your collection.
4. Either use `npm start` to run the CLI in place or run 'npm link' to use `signals` on the command line anywhere.

## Message Types
- __Signals__: Represent log entries that directly contribute to the signal that you are tracking.
- __Events__: Represent information log entries that are related to the signal you are tracking that may provide context or other information related to the signal. Events are __not__ signals and do not count towards any metric.

## Tool Roadmap
- [] Log style console visualisation for a signal collection.
- [] Metrics and tallies
    - [] Signals Completed
    - [] Velocity
    - [] Signal Value Graph
    - [] Signal Velocity