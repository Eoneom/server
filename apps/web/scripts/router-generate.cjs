const path = require('path')
const { getConfig, Generator } = require('@tanstack/router-generator')

async function run() {
  const cwd = path.resolve(__dirname, '..')
  const config = getConfig({}, cwd)
  const generator = new Generator({
    config,
    root: cwd
  })
  await generator.run()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
