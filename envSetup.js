const core = require('@actions/core');
// const fs = require('fs');
const exec = require('@actions/exec');

// RELEASE_NOTES
// PUBLISH_CHANNEL

function requireNonNull(toBeNotNull, message) {
  if(!toBeNotNull) {
    throw Error(message);
  }
  return toBeNotNull;
}

function getVersionAndPublishChannel(githubRef) {
  const [,,channel,version] = githubRef.split('/');
  if(!(channel && version)) {
    throw Error(`Expected the branch name ${githubRef} to match pattern refs/head/<releaseChannel>/<versionNumber>`)
  }
  return {
    channel,
    version
  };
}

async function setUpNonProd() {
  await exec.exec('ls', ['-la']);
  const githubRef = requireNonNull(
    process.env.GITHUB_REF,
    'Expected environment GITHUB_REF to be defined!'
  );
  const {
    version,
    channel
  } = getVersionAndPublishChannel(githubRef)
  core.exportVariable('VERSION', version);
  core.exportVariable('PUBLISH_CHANNEL', channel);
  core.exportVariable('ayylmao', 'ayyLmao its a prank');
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
