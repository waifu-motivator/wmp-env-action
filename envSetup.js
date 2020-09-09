const core = require('@actions/core');
// const fs = require('fs');
const exec = require('@actions/exec');

// RELEASE_NOTES
// VERSION
// PUBLISH_CHANNEL

async function setUpNonProd() {
  await exec.exec('ls', ['-la']);
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
