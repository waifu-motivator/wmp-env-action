const core = require('@actions/core');
const github = require('@actions/github');

// RELEASE_NOTES

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
    version: `${version}.beta.${new Date().valueOf().toString(32)}`
  };
}

function getReleaseNotes() {
  if(github.context.eventName === 'push') {
    const pushPayload = github.context.payload
    const commits = pushPayload.commits || []
    return commits
      .map(commit => `-${JSON.stringify(commit, null, 2)}`)
      .join('\n');
  }

  return `- No release notes`
}

async function setUpNonProd() {
  const githubRef = requireNonNull(
    core.getInput('branch-override') || process.env.GITHUB_REF,
    'Expected environment GITHUB_REF to be defined!'
  );
  const {
    version,
    channel
  } = getVersionAndPublishChannel(githubRef)
  core.info(`Releasing with version ${version}`)
  core.exportVariable('VERSION', version);
  core.info(`And on channel${channel}`)
  core.exportVariable('PUBLISH_CHANNEL', channel);
  const releaseNotes = getReleaseNotes()
  core.info(`With release notes
  ${releaseNotes}`)
}

function setUpProd() {
  throw Error('Production environment setup not available yet!');
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
