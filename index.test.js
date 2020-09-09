const envSetUp = require('./envSetup');
// const process = require('process');
// const cp = require('child_process');
// const path = require('path');

describe('Set Environment', function () {

  test('throws invalid environment', async () => {
    await expect(envSetUp('ayyLmao'))
      .rejects
      .toThrow('Unknown environment ayyLmao, expecting \'non-prod\' or \'prod\'');
  });

  // test('wait 500 ms', async () => {
  //   const start = new Date();
  //   await wait(500);
  //   const end = new Date();
  //   var delta = Math.abs(end - start);
  //   expect(delta).toBeGreaterThanOrEqual(500);
  // });

// shows how the runner will run a javascript action with env / stdout protocol
//   test('test runs', () => {
//     process.env['INPUT_MILLISECONDS'] = 500;
//     const ip = path.join(__dirname, 'index.js');
//     console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString());
//   })
});
