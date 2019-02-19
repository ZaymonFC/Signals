#!/usr/bin/env node
//   _____  _                       _      
// /  ___|(_)                     | |     
// \ `--.  _   __ _  _ __    __ _ | | ___ 
//  `--. \| | / _` || '_ \  / _` || |/ __|
// /\__/ /| || (_| || | | || (_| || |\__ \
// \____/ |_| \__, ||_| |_| \__,_||_||___/
//             __/ |                      
//            |___/                       
// Author Zaymon Foulds-Cook © 2019


const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const shell = require('shelljs')
const fs = require('fs')
const path = require('path')

const welcome = () => {
  console.log(
    chalk.green(
      figlet.textSync("Signals", {
        font: 'Doom',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  )
  console.log('\nWelcome to Signals: an event and signal log management CLI.\n')
}

const askQuestions = (collections) => {
  const questions = [
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
  return inquirer.prompt(questions)
}

const getCollectionFileNames = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(__dirname, './collections'), (err, files) => {
      if (err) { reject('Something went wrong reading collections directory. Does it exist?') }

      resolve(files)
    })
  })
}

const parseFileNames = (files) => {
  if (!files) { throw 'You don\'t have any collection markdown files in ./collections' }

  const markdownFiles = files.filter(f => f.indexOf('.md') >= 0)
  const trimmedFileNames = markdownFiles.map(f => f.replace('.md', ''))
  return trimmedFileNames
}

const presentError = (error) => {
  console.error(chalk.yellow(error))
  process.exit(0)
}

const wrapTryCatch1 = (f) => {
  return (x) => {
    try {
      return f(x)
    } catch (error) { presentError(error) }
  }
}


const wrapPromiseCatch0 = (f) => {
  return () => {
    return f()
    .catch(error => presentError(error))
  }
}

const wrapPromiseCatch1 = (f) => {
  return (x) => {
    return f(x)
    .catch(error => presentError(error))
  }
}

const wrapPromiseCatch3 = (f) => {
  return (x) => {
    return (y) => {
      return (z) => {
        return f(x, y, z)
        .catch(error => presentError(error))
      }
    }
  }
}

const validateResponse = (response) => {
  const message = response.message
  if (!message || message === '') {
    throw 'Message cannot be empty'
  }
}

const formatEntry = (type, message) => {
  const formattedType = type.toUpperCase()
  const now = new Date()
  const iso8006String = now.toISOString()
  const entry = `${formattedType}|${iso8006String}|${message}\n`
  return entry
}

const messageWriter = (payload) => {
  return new Promise((resolve, reject) => {
    const filename = `./collections/${payload.collection}.md`
    const entry = formatEntry(payload.type, payload.message)
    const filePath = path.resolve(__dirname, filename)
    
    fs.appendFile(filePath, entry, (err) => {
      if (err) reject(`Something happened trying to write a log to ${path}`)
      resolve()
    })
  })  
}

const goodbye = () => {
  console.log(chalk.blueBright('Entry Appended To Log'))
}

async function run() {
  // Construct safe functions
  const safeHandledFileNameParser = wrapTryCatch1(parseFileNames)
  const safeGetCollectionFileNames = wrapPromiseCatch0(getCollectionFileNames)
  const safeMessageWriter = wrapPromiseCatch1(messageWriter)
  const safeResponseValidator = wrapTryCatch1(validateResponse)

  welcome()

  let files = await safeGetCollectionFileNames()
  files = safeHandledFileNameParser(files)

  const { COLLECTION, TYPE, MESSAGE } = await askQuestions(files)

  const response = {
    collection: COLLECTION,
    type: TYPE,
    message: MESSAGE,
  }

  safeResponseValidator(response)
  safeMessageWriter(response)

  goodbye()

}


run()