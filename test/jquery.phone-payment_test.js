(function ($) {
  module('jQuery#jqueryPhonePayment', {
    setup: function () {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function () {
    expect(1);
    strictEqual(this.elems.jqueryPhonePayment(), this.elems, 'should be chainable');
  });

  test('is jqueryPhonePayment', function () {
    expect(1);
    strictEqual(this.elems.jqueryPhonePayment().text(), 'jqueryPhonePayment0jqueryPhonePayment1jqueryPhonePayment2', 'should be jqueryPhonePayment');
  });

}(jQuery));
