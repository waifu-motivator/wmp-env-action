const core = require('@actions/core');
// const fs = require('fs');
const exec = require('@actions/exec');

// RELEASE_NOTES
// VERSION
// PUBLISH_CHANNEL

async function setUpNonProd() {
  let myOutput = '';
  let myError = '';

  const options = {};
  options.listeners = {
    stdout: (data) => {
      myOutput += data.toString();
    },
    stderr: (data) => {
      myError += data.toString();
    }
  };

  await exec.exec('ls', ['-la']);

  core.info(`Output:
  ${myOutput}`)
  core.info(`Err:
  ${myError}`)
}

function setUpProd() {
  return Promise.resolve(undefined);
}

const envSetup = async environmentToSetUp => {
  switch (environmentToSetUp) {
    case 'non-prod':
      return setUpNonProd();
    case 'prod':
      return setUpProd();
    default:
      throw Error(`Unknown environment ${environmentToSetUp}, expecting 'non-prod' or 'prod'`)
  }
};

module.exports = envSetup;
