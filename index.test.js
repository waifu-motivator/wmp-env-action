const envSetUp = require('./envSetup');

describe('Set Environment', function () {

  let previousGitRef;
  beforeAll(()=>{
    previousGitRef = process.env.GITHUB_REF;
  });

  beforeEach(()=>{
    process.env.GITHUB_REF = previousGitRef;
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

});
