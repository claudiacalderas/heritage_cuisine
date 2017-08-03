// spec.js
describe('heritagecuisine', function() {
  it('should let user login the app', function() {
    browser.get('http://localhost:7070/#/home');
    element(by.model('user.username')).sendKeys('claudia');
    element(by.model('user.password')).sendKeys('cat');

    element(by.id('loginSubmit')).click();

    var newUrl = browser.getCurrentUrl();
    expect(newUrl).toEqual('http://localhost:7070/#/user');
  });
});
