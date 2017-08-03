// spec.js
describe('heritagecuisine correct login', function() {
  it('should let user login the app', function() {
    browser.get('http://localhost:7070/#/home');
    element(by.model('user.username')).sendKeys('claudia');
    element(by.model('user.password')).sendKeys('cat');

    element(by.id('loginSubmit')).click();

    var newUrl = browser.getCurrentUrl();
    expect(newUrl).toEqual('http://localhost:7070/#/user');
  });
});

describe('heritagecuisine incorrect login', function() {
  it('should not let user login the app with incorrect credentials', function() {
    browser.get('http://localhost:7070/#/home');
    element(by.model('user.username')).sendKeys('claudia');
    element(by.model('user.password')).sendKeys('dog');

    element(by.id('loginSubmit')).click();

    var errorMsg = element(by.id('loginMessage')).getText();
    expect(errorMsg).toEqual('Invalid combination of username and password.');

    var currentUrl = browser.getCurrentUrl();
    expect(currentUrl).toEqual('http://localhost:7070/#/home');
  });
});
