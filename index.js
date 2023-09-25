'use strict'

const core = require('@actions/core')
const { promises: fs } = require('fs')

function convert (json, isProduction) {
  return Object.entries(json)
    .map(([key, value]) => {
      if (!isProduction) {
        return `${key}=${value}`
      }
      if (String(key).startsWith('_PROD_')) {
        return `${String(key).replace('_PROD_', '')}=${value}`
      }
    })
    .join('\n')
}

const main = async () => {
  const secrets = core.getInput('secrets')
  const production =
    String(core.getInput('production')).toLowerCase() === 'true'
  const variables = core.getInput('variables')
  const extra = core.getInput('extra')
  const path = core.getInput('path')
  let vars = { ...JSON.parse(secrets), ...JSON.parse(variables) }
  if (extra) {
    // TODO: add extra variables
    vars = { ...vars, ...JSON.parse(extra) }
  }
  if (path) {
    // TODO: add path variables
    vars = { ...vars, ...JSON.parse(await fs.readFile(path, 'utf8')) }
  }
  const output = convert(vars, production)
  fs.writeFile('./.env', output)

  core.setOutput('content', vars)
}

main().catch((err) => core.setFailed(err.message))
