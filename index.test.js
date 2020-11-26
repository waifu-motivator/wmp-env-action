const envSetUp = require('./envSetup');
const fs = require('fs');
const {GITHUB_ENV_FILE_NAME} = require('./constants')

function getInputName(name) {
  return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
}

const unsetInput = (name)=>
  delete process.env[getInputName(name)]

const setInput = (name,value)=>
  process.env[getInputName(name)]=value;

describe('Set Environment', function () {

  let previousGitRef;
  beforeAll(()=>{
    previousGitRef = process.env.GITHUB_REF;
  });

  beforeEach(()=>{
    process.env.GITHUB_REF = previousGitRef;
  });

  afterEach(() => {
    if(fs.existsSync(GITHUB_ENV_FILE_NAME)) {
      fs.unlinkSync(GITHUB_ENV_FILE_NAME)
    }
  });

  afterAll(()=>{
    process.env.GITHUB_REF = previousGitRef;
  })

  test('throws invalid environment', async () => {
    await expect(envSetUp('ayyLmao'))
      .rejects
      .toThrow('Unknown environment ayyLmao, expecting \'non-prod\' or \'prod\'');
  });

  test('non-prod should complain when no GITHUB_REF is set', async () => {
    delete process.env.GITHUB_REF;
    await expect(envSetUp('non-prod'))
      .rejects
      .toThrow('Expected environment GITHUB_REF to be defined!')
  });

  test('non-prod should complain with bad env', async () => {
    process.env.GITHUB_REF = 'ayylmao/development/v1.3'
    await expect(envSetUp('non-prod'))
      .rejects
      .toThrow('Expected the branch name ayylmao/development/v1.3 to match pattern refs/head/<releaseChannel>/<versionNumber')
  });

  test('non-prod should use override', async () => {
    process.env.GITHUB_REF = 'refs/heads/development/v1.3'
    setInput('branch-override', 'refs/heads/development/v69')
    await expect(envSetUp('non-prod')).resolves
      .toBeUndefined();
    const envFile = fs.readFileSync(GITHUB_ENV_FILE_NAME, {encoding: 'utf-8'});
    expect(envFile).toContain('VERSION=v69');
    expect(envFile).toContain('PUBLISH_CHANNEL=development');
    unsetInput('branch-override');
  });

  test('non-prod should setup correctly', async () => {
    process.env.GITHUB_REF = 'refs/heads/development/v1.3'
    await expect(envSetUp('non-prod')).resolves
      .toBeUndefined();
    const envFile = fs.readFileSync(GITHUB_ENV_FILE_NAME, {encoding: 'utf-8'});
    expect(envFile).toContain('VERSION=v1.3');
    expect(envFile).toContain('PUBLISH_CHANNEL=development');
  });
});
