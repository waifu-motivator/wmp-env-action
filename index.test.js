const envSetUp = require('./envSetup');
const core = require('@actions/core');
// const process = require('process');
// const cp = require('child_process');
// const path = require('path');

describe('Set Environment', function () {

  test('throws invalid environment', async () => {
    await expect(envSetUp('ayyLmao'))
      .rejects
      .toThrow('Unknown environment ayyLmao, expecting \'non-prod\' or \'prod\'');
  });

  test('non-prod should complain when no GITHUB_REF is set', async () => {
    const previousRef = process.env.GITHUB_REF;
    delete process.env.GITHUB_REF;
    await expect(envSetUp('non-prod'))
      .rejects
      .toThrow('Expected environment GITHUB_REF to be defined!')
    process.env.GITHUB_REF = previousRef;
  });

  test('non-prod should setup correctly', async () => {
    process.env.GITHUB_REF = 'refs/heads/development/v1.3'
    await expect(envSetUp('non-prod')).resolves
      .toBeUndefined()
    expect(process.env.ayylmao).toEqual('ayyLmao its a prank')
    expect(process.env.VERSION).toEqual('v1.3')
  });

// shows how the runner will run a javascript action with env / stdout protocol
//   test('test runs', () => {
//     process.env['INPUT_MILLISECONDS'] = 500;
//     const ip = path.join(__dirname, 'index.js');
//     console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString());
//   })
});
