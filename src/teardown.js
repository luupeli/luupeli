
module.exports = async function() {
    // close the browser instance
    await global.__BROWSER__.close();
  
    // clean-up the wsEndpoint file
    rimraf.sync(DIR);
};
  