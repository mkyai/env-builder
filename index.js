'use strict'

const core = require('@actions/core')
const { promises: fs } = require('fs')

function convert(json, branch, defaultBranch) {
  let prefix = `_${branch.toUpperCase()}_`
  const isDefault = branch === defaultBranch
  if (isDefault) {
    prefix = ''
  }

  return Object.entries(json)
    .map(([key, value]) => {
      if (!isDefault) {
        if (String(key).startsWith('_')) {
          return []
        }
        return `${key}=${value}`
      }
      if (String(key).startsWith(prefix)) {
        return `${String(key).replace(prefix, '')}=${value}`
      }
      return []
    })
    .flat()
    .join('\n')
}

const main = async () => {
  const secrets = core.getInput('secrets')
  let branch = core.getInput('branch')

  if (!branch) {
    branch = process.env.GITHUB_REF
    branch = branch.replace('refs/heads/', '')
  }

  const defaultBranch = core.getInput('default_branch')

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
  const output = convert(vars, branch, defaultBranch || 'develop')
  fs.writeFile('./.env', output)

  core.setOutput('content', vars)
}

main().catch((err) => core.setFailed(err.message))
