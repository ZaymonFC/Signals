const inquirer = require('inquirer')

function standardFlowQuestions(collections) {
  return [
    {
      name: 'COLLECTION',
      type: 'list',
      message: 'Which signal collection do you wish to append to?',
      choices: collections,
    },
    {
      name: 'TYPE',
      type: 'list',
      choices: ['Signal', 'Event'],
      message: 'What data point type do you wish to append?'
    },
    {
      name: 'MESSAGE',
      type: 'input',
      message: 'Describe the data point with a message?'
    },
  ]
}

function visualisationFlowQuestions(collections) {
  return [
    {
      name: 'COLLECTION',
      type: 'list',
      message: 'Which signal collection would you like to visualise',
      choices: collections,
    },
    {
      name: 'VISTYPE',
      type: 'list',
      message: 'Choose your visualisation type',
      choices: ['Log']
    },
  ]
}

function askQuestions(questions) {
  return inquirer.prompt(questions)
}

export {
  standardFlowQuestions,
  visualisationFlowQuestions,
  askQuestions
}