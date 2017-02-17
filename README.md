# jQuery.phone-payment

> Easy ugandan phone number validation form building and validation for ugandan phone numbers and form inputs. Modification of stripe's  [jquery.payment](https://github.com/stripe/jquery.payment) for ugandan phone numbers/

## Usage

You can make an input act like a credit phone field (with number formatting and length restriction):

``` javascript
$('input.pn-num').phonePayment('formatPhoneNumber');
```

Then, when the payment form is submitted, you can validate the phone number on the client-side:

``` javascript
var valid = $.payment.validatePhoneNumber($('input.pn-num').val());

if (!valid) {
  alert('Your phone is not valid!');
  return false;
}
```

You can find a full [demo here](http://stripe.github.io/jquery.payment/example).

Supported phone types are:

* MTN
* Airtel
* Africell
* Vodafone

(Additional phone types are supported by extending the [`$.payment.phones`](#paymentphones) array.)

## API

### $.fn.phonePayment('formatPhoneNumber')

Formats phone numbers:

* Includes a space between every 3 digits
* Restricts input to numbers
* Limits to 9, 10 or 12 numbers
* Allows numbers starting with 256 or 0
* Adds a class of the phone type (e.g. 'mtn') to the input

Example:

``` javascript
$('input.pn-num').phonePayment('formatPhoneNumber');
```

### $.payment.phoneType(number)

Returns a phone type. Either:

* `mtn`
* `airtel`
* `vodafone`
* `africell`

The function will return `null` if the phone type can't be determined.

Example:

``` javascript
$.payment.phoneType('770 000 000'); //=> 'mtn'
$.payment.phoneType('256 700 000 000'); //=> 'airtel'
```

### $.payment.phones

Array of objects that describe valid phone types. Each object should contain the following fields:

``` javascript
{
  // Phone type, as returned by $.payment.phoneType.
  type: 'mtn',
  // Array of prefixes used to identify the phone type.
  patterns: [
    '77', '78', '39', 
    '077', '078', '039', 
    '25677', '25678', '25639'
    ],
  // Array of valid phone number lengths.
  length: [9, 10, 12],
  // Regex used to format the phone number. Each match is joined with a space.
  format: /(\d{1,4})/g
}
```

When identifying a phone type, the array is traversed in order until the phone number matches a prefix in `patterns`. For this reason, patterns with higher specificity should appear towards the beginning of the array.

## Example

Look in [`./example/index.html`](example/index.html)

## License

MIT © mubtxs
