const core = require('@actions/core');
const envSetUp = require('./envSetup');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const environmentToSetUp = core.getInput('release-type');

    core.info(`Setting up environment for ${environmentToSetUp} ...`);

    await envSetUp(environmentToSetUp);

    core.info(`Environment setup is now complete!`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
