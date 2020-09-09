// const core = require('@actions/core');

function setUpNonProd() {
    return Promise.resolve(undefined);
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
