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

import { wrapPromiseCatch0, wrapPromiseCatch1, wrapTryCatch1 } from './safeCurry'
import { welcome, goodbye, logCollectionEntries } from './presentation'
import { askQuestions, standardFlowQuestions, visualisationFlowQuestions, creationFlowQuestions } from './questions'
import { getCollectionFileNames, entryAppender, readCollection, createCollectionFile } from './fileManipulation'
import { validateResponse, validateAndParseNewCollectionName } from './validators'
import { parseFileNames } from './parsers'

function formatEntry(type, message) {
  const formattedType = type.toUpperCase()
  const now = new Date()
  const iso8006String = now.toISOString()
  const entry = `${formattedType}|${iso8006String}|${message}\n`
  return entry
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

async function standardFlow() {
  const safe_handledFileNameParser = wrapTryCatch1(parseFileNames);
  const safe_getCollectionFileNames = wrapPromiseCatch0(getCollectionFileNames);
  const safe_messageWriter = wrapPromiseCatch1(entryAppender);
  const safe_responseValidator = wrapTryCatch1(validateResponse);

  // TODO: Compose these
  let files = await safe_getCollectionFileNames();
  files = safe_handledFileNameParser(files);

  if (!files || files.length === 0) {
    console.log('You do not have any signal collections.')
    await creationFlow()
    return await standardFlow()
  }

  // TODO: Compose these
  const flowQuestions = standardFlowQuestions(files)
  const { COLLECTION, TYPE, MESSAGE } = await askQuestions(flowQuestions);

  const response = {
    collection: COLLECTION,
    type: TYPE,
    message: MESSAGE,
  };

  // Compose these
  safe_responseValidator(response)
  const entry = formatEntry(response.type, response.message)

  await safe_messageWriter({ entry: entry, collection: response.collection})
}

async function visualisationFlow() {
  const safe_handledFileNameParser = wrapTryCatch1(parseFileNames);
  const safe_getCollectionFileNames = wrapPromiseCatch0(getCollectionFileNames);
  const safe_readCollection = wrapPromiseCatch1(readCollection)

  // TODO: Compose these
  let files = await safe_getCollectionFileNames();
  files = safe_handledFileNameParser(files);

  // TODO: Compose these
  const flowQuestions = visualisationFlowQuestions(files)
  const { COLLECTION, VISTYPE } = await askQuestions(flowQuestions)

  // TODO: Compose these
  const collectionData = await safe_readCollection(COLLECTION)
  const collectionEntries = processCollectionData(collectionData)

  logCollectionEntries(collectionEntries)
}

async function creationFlow() {
  const safe_fileWriter = wrapPromiseCatch1(createCollectionFile)
  const safe_collectionNameValidator = wrapTryCatch1(validateAndParseNewCollectionName)
  const safe_getCollectionFileNames = wrapPromiseCatch0(getCollectionFileNames);
  const safe_handledFileNameParser = wrapTryCatch1(parseFileNames);

  const flowQuestions = creationFlowQuestions()
  const { COLLECTION } = await askQuestions(flowQuestions)

  let existingCollections = await safe_getCollectionFileNames()
  existingCollections = safe_handledFileNameParser(existingCollections)

  const collectionName = safe_collectionNameValidator({
    collection: COLLECTION,
    existingCollections: existingCollections
  })

  await safe_fileWriter(collectionName)
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
