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

const fs = require('fs')
const path = require('path')

import { wrapPromiseCatch0, wrapPromiseCatch1, wrapTryCatch1 } from './safeCurry'
import { welcome, goodbye, logCollectionEntries } from './presentation'
import { askQuestions, standardFlowQuestions, visualisationFlowQuestions } from './questions'
import { getCollectionFileNames, entryAppender, readCollection } from './fileManipulation'
import { validateResponse } from './validators'
import { parseFileNames } from './parsers'

function formatEntry(type, message) {
  const formattedType = type.toUpperCase()
  const now = new Date()
  const iso8006String = now.toISOString()
  const entry = `${formattedType}|${iso8006String}|${message}\n`
  return entry
}

async function standardFlow() {
  const safeHandledFileNameParser = wrapTryCatch1(parseFileNames);
  const safeGetCollectionFileNames = wrapPromiseCatch0(getCollectionFileNames);
  const safeMessageWriter = wrapPromiseCatch1(entryAppender);
  const safeResponseValidator = wrapTryCatch1(validateResponse);

  // TODO: Compose these
  let files = await safeGetCollectionFileNames();
  files = safeHandledFileNameParser(files);

  // TODO: Compose these
  const flowQuestions = standardFlowQuestions(files)
  const { COLLECTION, TYPE, MESSAGE } = await askQuestions(flowQuestions);
  
  const response = {
    collection: COLLECTION,
    type: TYPE,
    message: MESSAGE,
  };

  // Compose these
  safeResponseValidator(response)
  const entry = formatEntry(response.type, response.message)
  console.log(entry)
  await safeMessageWriter({ entry: entry, collection: response.collection})
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

async function visualisationFlow() {
  const safeHandledFileNameParser = wrapTryCatch1(parseFileNames);
  const safeGetCollectionFileNames = wrapPromiseCatch0(getCollectionFileNames);
  const safeReadCollection = wrapPromiseCatch1(readCollection)

  // TODO: Compose these
  let files = await safeGetCollectionFileNames();
  files = safeHandledFileNameParser(files);

  // TODO: Compose these
  const flowQuestions = visualisationFlowQuestions(files)
  const { COLLECTION, VISTYPE } = await askQuestions(flowQuestions)

  // TODO: Compose these
  const collectionData = await safeReadCollection(COLLECTION)
  const collectionEntries = processCollectionData(collectionData)

  logCollectionEntries(collectionEntries)
}

async function creationFlow() {
  
}

async function run() {
  const args = process.argv.slice(2)
  const searchInArgs = (flag) => args.filter(a => a === flag).length > 0

  if (searchInArgs('--visualise')) {
    welcome()
    await visualisationFlow()
    goodbye('Goodbye! :>')
  } else if (searchInArgs('--create')) {
    welcome()
    await creationFlow()
    goodbye('Signal collection created :>')
  } else {
    welcome()
    await standardFlow()
    goodbye('Entry Appended To Log')
  }
}

run()
