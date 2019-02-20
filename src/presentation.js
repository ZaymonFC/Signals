const chalk = require('chalk')
const figlet = require('figlet')

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

function goodbye(message) {
  console.log(chalk.blueBright(message))
  process.exit(0)
}

function presentError(error) {
  console.error(chalk.yellow(error))
  process.exit(0)
}

function logCollectionEntries(entries) {
  entries.forEach(e => {
    console.log(chalk.green('-> '), `${e.date.toISOString()} -> ${e.message}`)
  })
}

module.exports = {
  welcome,
  goodbye,
  presentError,
  logCollectionEntries,
}