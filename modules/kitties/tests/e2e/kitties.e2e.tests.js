'use strict';

describe('Kitties E2E Tests:', function () {
  describe('Test Kitties page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/kitties');
      expect(element.all(by.repeater('kitty in kitties')).count()).toEqual(0);
    });
  });
});
