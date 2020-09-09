const core = require('@actions/core');
// const fs = require('fs');
const exec = require('@actions/exec');

// RELEASE_NOTES
// VERSION
// PUBLISH_CHANNEL

function requireNonNull(toBeNotNull, message) {
  if(!toBeNotNull) {
    throw Error(message);
  }
  return toBeNotNull;
}

function getVersion(githubRef) {
  const from = githubRef.lastIndexOf('/');
  if(from < 0) {
    throw Error(`Expected the branch name ${githubRef} to match pattern <release>/<versionNumber>`)
  }
  return githubRef.substr(from + 1);
}

async function setUpNonProd() {
  await exec.exec('ls', ['-la']);
  const githubRef = requireNonNull(
    process.env.GITHUB_REF,
    'Expected environment GITHUB_REF to be defined!'
  );
  const version = getVersion(githubRef)
  core.exportVariable('VERSION', version);
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
