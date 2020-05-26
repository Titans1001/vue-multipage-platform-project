'use strict'
const chalk = require('chalk')

//npm install --save semver
const semver = require('semver') //检测版本
// semver.valid('1.2.3') // '1.2.3'
// semver.valid('a.b.c') // null
// semver.clean('  =v1.2.3   ') // '1.2.3'
// semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true
// semver.gt('1.2.3', '9.8.7') // false
// semver.lt('1.2.3', '9.8.7') // true
// semver.valid(semver.coerce('v2')) // '2.0.0'
// semver.valid(semver.coerce('42.6.7.9.3-alpha')) // '42.6.7'



const shell = require('shelljs') //可在cmd窗口执行一些脚本，详情参考 autodeploy.js


const packageConfig = require('../package.json')


function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
  }
]

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
  }
}
