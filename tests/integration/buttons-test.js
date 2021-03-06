import Ember from 'ember';

import startApp from '../../tests/helpers/start-app';
import { module, test } from 'qunit';

var App;

var BUTTON_HOVER_TIMEOUT = 1000;

module('Acceptance - Buttons', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('Load the demo page', function(assert) {
  visit('/buttons');

  andThen(function () {
    assert.ok(true, 'If this is passing, this page has no deprecation warnings');
  });
});

test('Floating buttons should be exposed on hover', assert => {
  visit('/buttons');
  var done = assert.async();

  andThen(() => {
    var mainButton = find('.fixed-btns-example > a.btn-floating');
    assert.equal($('.fixed-btns-example ul li:first-child a').css('opacity'), "0", 'Secondary buttons should be hidden before mouseover');
    Ember.$(mainButton).mouseover();
  });

  andThen(() => {
    setTimeout(() => {
      assert.equal($('.fixed-btns-example ul li:first-child a').css('opacity'), "1", 'Secondary buttons should be shown after mouseover');
      done();
    }, BUTTON_HOVER_TIMEOUT);
  });
});


test('Clicking the first floating button should fire an action', assert => {
  visit('/buttons');
  var done = assert.async();

  var oldAlert = window.alert;

  window.alert = function (alertText) {
    assert.equal(alertText, 'firstAction', 'firstAction is fired when primary button is clicked');
    window.alert = oldAlert;
    done();
  };

  click('.fixed-btns-example > a.btn-floating');

});

test('Clicking a secondary floating button should fire a different action, and pass arguments', assert => {
  visit('/buttons');
  var done = assert.async();

  var oldAlert = window.alert;

  andThen(() => {
    var mainButton = find('.fixed-btns-example > a.btn-floating');
    assert.equal($('.fixed-btns-example ul li:first-child a').css('opacity'), "0", 'Secondary buttons should be hidden before mouseover');
    Ember.$(mainButton).mouseover();
  });

  andThen(() => {
    setTimeout(() => {
      window.alert = function (alertText) {
        assert.equal(alertText, 'anotherAction\narg: "1"', 'firstAction is fired when primary button is clicked');
        window.alert = oldAlert;
        done();
      };

      click('.fixed-btns-example ul li:first-child a');
    }, BUTTON_HOVER_TIMEOUT);
  });

});
