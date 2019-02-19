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
const fs = require('fs')
const path = require('path')

function welcome() {
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

function askStandardFlowQuestions(collections) {
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

function askVisualisationFlowQuestions(collections) {
  const questions = [
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
  return inquirer.prompt(questions)
}

function getCollectionFileNames() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(__dirname, './collections'), (err, files) => {
      if (err) { reject('Something went wrong reading collections directory. Does it exist?') }

      resolve(files)
    })
  })
}

function parseFileNames(files) {
  if (!files) { throw 'You don\'t have any collection markdown files in ./collections' }

  const markdownFiles = files.filter(f => f.includes('.md'))
  const trimmedFileNames = markdownFiles.map(f => f.replace('.md', ''))
  return trimmedFileNames
}

function presentError(error) {
  console.error(chalk.yellow(error))
  process.exit(0)
}

function wrapTryCatch1(f) {
  return (x) => {
    try {
      return f(x)
    } catch (error) { presentError(error) }
  }
}

function wrapPromiseCatch0(f) {
  return () => {
    return f()
      .catch(error => presentError(error))
  }
}

function wrapPromiseCatch1(f) {
  return (x) => {
    return f(x)
      .catch(error => presentError(error))
  }
}

function wrapPromiseCatch3(f) {
  return (x) => {
    return (y) => {
      return (z) => {
        return f(x, y, z)
          .catch(error => presentError(error))
      }
    }
  }
}

function validateResponse(response) {
  const message = response.message
  if (!message || message === '') {
    throw 'Message cannot be empty'
  }
}

function formatEntry(type, message) {
  const formattedType = type.toUpperCase()
  const now = new Date()
  const iso8006String = now.toISOString()
  const entry = `${formattedType}|${iso8006String}|${message}\n`
  return entry
}

function collectionFilePath(collection) {
  const relativePath = `./collections/${collection}.md`
  return path.resolve(__dirname, relativePath)
}

function messageWriter(payload) {
  return new Promise((resolve, reject) => {
    const filePath = collectionFilePath(payload.collection)
    const entry = formatEntry(payload.type, payload.message)

    fs.appendFile(filePath, entry, (err) => {
      if (err) reject(`Something happened trying to write a log to ${path}`)
      resolve()
    })
  })
}

function goodbye(message) {
  console.log(chalk.blueBright(message))
  process.exit(0)
}

async function standardFlow() {
  const safeHandledFileNameParser = wrapTryCatch1(parseFileNames);
  const safeGetCollectionFileNames = wrapPromiseCatch0(getCollectionFileNames);
  const safeMessageWriter = wrapPromiseCatch1(messageWriter);
  const safeResponseValidator = wrapTryCatch1(validateResponse);

  // TODO: Compose these
  let files = await safeGetCollectionFileNames();
  files = safeHandledFileNameParser(files);

  const { COLLECTION, TYPE, MESSAGE } = await askStandardFlowQuestions(files);
  
  const response = {
    collection: COLLECTION,
    type: TYPE,
    message: MESSAGE,
  };

  safeResponseValidator(response);
  await safeMessageWriter(response);
}

async function readCollection(collectionName) {
  return new Promise((resolve, reject) => {
    const filePath = collectionFilePath(collectionName)

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) reject(`Error ingesting data from collection ${collectionName}`)
      resolve(data)
    })
  })
}

const collectionIndex = {
  type: 0,
  date: 1,
  message: 2,
}

function processCollectionData(data) {
  const dataLines = data.split('\n')
  const cleanedDataLines = dataLines.filter(s => s !== '')
  
  return cleanedDataLines.map((line) => {
    const lineEntries = line.split('|')

    return {
      type: lineEntries[collectionIndex.type],
      date: new Date(lineEntries[collectionIndex.date]),
      message: lineEntries[collectionIndex.message],
    }
  })
}

function logCollectionEntries(entries) {
  entries.forEach(e => {
    console.log(chalk.green('-> '), `${e.date.toISOString()} -> ${e.message}`)
  })
}

async function visualisationFlow() {
  const safeHandledFileNameParser = wrapTryCatch1(parseFileNames);
  const safeGetCollectionFileNames = wrapPromiseCatch0(getCollectionFileNames);
  const safeReadCollection = wrapPromiseCatch1(readCollection)

  // TODO: Compose these
  let files = await safeGetCollectionFileNames();
  files = safeHandledFileNameParser(files);

  const { COLLECTION, VISTYPE } = await askVisualisationFlowQuestions(files)

  // Compose these
  const collectionData = await safeReadCollection(COLLECTION)
  const collectionEntries = processCollectionData(collectionData)

  logCollectionEntries(collectionEntries)
}

async function run() {
  const args = process.argv.slice(2)
  if (args.filter(a => a === '--visualise').length > 0) {
    welcome()
    await visualisationFlow()
    goodbye('Goodbye! :>')
  } else {
    welcome()
    await standardFlow()
    goodbye('Entry Appended To Log')
  }
}

run()


