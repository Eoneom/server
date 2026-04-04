const path = require('path')
const { getConfig, generator } = require('@tanstack/router-generator')

async function run() {
  const cwd = path.resolve(__dirname, '..')
  const config = getConfig({}, cwd)
  await generator(config, cwd)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
