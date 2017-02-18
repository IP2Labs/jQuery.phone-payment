/*! jquery.phone-payment - v1.0.0 - 2017-02-18
* Copyright (c) 2017 mubtxs; Licensed MIT */
'use strict';

var $, phoneFromNumber, phoneFromType, phones, defaultFormat, formatBackPhoneNumber, formatPhoneNumber, hasTextSelected, reFormatPhoneNumber, reFormatNumeric, replaceFullWidthChars, restrictPhoneNumber, restrictNumeric, safeVal, setPhoneType,
  slice = [].slice,
  indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  };

$ = window.jQuery || window.$;

$.phonePayment = {};

$.phonePayment.fn = {};

$.fn.phonePayment = function () {
  var args, method;
  method = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  return $.phonePayment.fn[method].apply(this, args);
};

defaultFormat = /(\d{1,3})/g;

$.phonePayment.phones = phones = [{
  type: 'mtn',
  patterns: ['77', '78', '39', '077', '078', '039', '25677', '25678', '25639'],
  format: defaultFormat,
  length: [9, 10, 12]
}, {
  type: 'airtel',
  patterns: ['70', '75', '070', '075', '25670', '25675', ],
  format: defaultFormat,
  length: [9, 10, 12]
}, {
  type: 'africell',
  patterns: ['79', '079', '25679'],
  format: defaultFormat,
  length: [9, 10, 12]
}, {
  type: 'vodafone',
  patterns: ['72', '072', '25672'],
  format: defaultFormat,
  length: [9, 10, 12]
}, {
  type: 'utl',
  patterns: ['71', '071', '25671'],
  format: defaultFormat,
  length: [9, 10, 12]
}];

phoneFromNumber = function (num) {
  var phone, i, j, len, len1, p, pattern, ref;
  num = (num + '').replace(/\D/g, '');
  for (i = 0, len = phones.length; i < len; i++) {
    phone = phones[i];
    ref = phone.patterns;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      pattern = ref[j];
      if (num.substr(0, pattern.length) === pattern) {
        return phone;
      }
    }
  }
};

phoneFromType = function (type) {
  var phone, i, len;
  for (i = 0, len = phones.length; i < len; i++) {
    phone = phones[i];
    if (phone.type === type) {
      return phone;
    }
  }
};

hasTextSelected = function ($target) {
  var ref;
  if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
    return true;
  }
  if ((typeof document !== "undefined" && document !== null ? (ref = document.selection) != null ? ref.createRange : void 0 : void 0) != null) {
    if (document.selection.createRange().text) {
      return true;
    }
  }
  return false;
};

safeVal = function (value, $target) {
  var currPair, cursor, digit, error, last, prevPair;
  try {
    cursor = $target.prop('selectionStart');
  } catch (error1) {
    error = error1;
    cursor = null;
  }
  last = $target.val();
  $target.val(value);
  if (cursor !== null && $target.is(":focus")) {
    if (cursor === last.length) {
      cursor = value.length;
    }
    if (last !== value) {
      prevPair = last.slice(cursor - 1, +cursor + 1 || 9e9);
      currPair = value.slice(cursor - 1, +cursor + 1 || 9e9);
      digit = value[cursor];
      if (/\d/.test(digit) && prevPair === (digit + " ") && currPair === (" " + digit)) {
        cursor = cursor + 1;
      }
    }
    $target.prop('selectionStart', cursor);
    return $target.prop('selectionEnd', cursor);
  }
};

replaceFullWidthChars = function (str) {
  var chars, chr, fullWidth, halfWidth, i, idx, len, value;
  if (str == null) {
    str = '';
  }
  fullWidth = '\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19';
  halfWidth = '0123456789';
  value = '';
  chars = str.split('');
  for (i = 0, len = chars.length; i < len; i++) {
    chr = chars[i];
    idx = fullWidth.indexOf(chr);
    if (idx > -1) {
      chr = halfWidth[idx];
    }
    value += chr;
  }
  return value;
};

reFormatNumeric = function (e) {
  var $target;
  $target = $(e.currentTarget);
  return setTimeout(function () {
    var value;
    value = $target.val();
    value = replaceFullWidthChars(value);
    value = value.replace(/\D/g, '');
    return safeVal(value, $target);
  });
};

reFormatPhoneNumber = function (e) {
  var $target;
  $target = $(e.currentTarget);
  return setTimeout(function () {
    var value;
    value = $target.val();
    value = replaceFullWidthChars(value);
    value = $.phonePayment.formatPhoneNumber(value);
    return safeVal(value, $target);
  });
};

formatPhoneNumber = function (e) {
  var $target, phone, digit, length, re, upperLength, value;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  $target = $(e.currentTarget);
  value = $target.val();
  phone = phoneFromNumber(value + digit);
  length = (value.replace(/\D/g, '') + digit).length;
  upperLength = 16;
  if (phone) {
    upperLength = phone.length[phone.length.length - 1];
  }
  if (length >= upperLength) {
    return;
  }
  if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
    return;
  }
  if (phone && phone.type === 'amex') {
    re = /^(\d{4}|\d{4}\s\d{6})$/;
  } else {
    re = /(?:^|\s)(\d{4})$/;
  }
  if (re.test(value)) {
    e.preventDefault();
    return setTimeout(function () {
      return $target.val(value + ' ' + digit);
    });
  } else if (re.test(value + digit)) {
    e.preventDefault();
    return setTimeout(function () {
      return $target.val(value + digit + ' ');
    });
  }
};

formatBackPhoneNumber = function (e) {
  var $target, value;
  $target = $(e.currentTarget);
  value = $target.val();
  if (e.which !== 8) {
    return;
  }
  if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
    return;
  }
  if (/\d\s$/.test(value)) {
    e.preventDefault();
    return setTimeout(function () {
      return $target.val(value.replace(/\d\s$/, ''));
    });
  } else if (/\s\d?$/.test(value)) {
    e.preventDefault();
    return setTimeout(function () {
      return $target.val(value.replace(/\d$/, ''));
    });
  }
};

restrictNumeric = function (e) {
  var input;
  if (e.metaKey || e.ctrlKey) {
    return true;
  }
  if (e.which === 32) {
    return false;
  }
  if (e.which === 0) {
    return true;
  }
  if (e.which < 33) {
    return true;
  }
  input = String.fromCharCode(e.which);
  return !!/[\d\s]/.test(input);
};

restrictPhoneNumber = function (e) {
  var $target, phone, digit, value;
  $target = $(e.currentTarget);
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  if (hasTextSelected($target)) {
    return;
  }
  value = ($target.val() + digit).replace(/\D/g, '');
  phone = phoneFromNumber(value);
  if (phone) {
    return value.length <= phone.length[phone.length.length - 1];
  } else {
    return value.length <= 16;
  }
};

setPhoneType = function (e) {
  var $target, allTypes, phone, phoneType, val;
  $target = $(e.currentTarget);
  val = $target.val();
  phoneType = $.phonePayment.phoneType(val) || 'unknown';
  if (!$target.hasClass(phoneType)) {
    allTypes = (function () {
      var i, len, results;
      results = [];
      for (i = 0, len = phones.length; i < len; i++) {
        phone = phones[i];
        results.push(phone.type);
      }
      return results;
    })();
    $target.removeClass('unknown');
    $target.removeClass(allTypes.join(' '));
    $target.addClass(phoneType);
    $target.toggleClass('identified', phoneType !== 'unknown');
    return $target.trigger('phonePayment.phoneType', phoneType);
  }
};

$.phonePayment.fn.formatPhoneNumber = function () {
  this.on('keypress', restrictNumeric);
  this.on('keypress', restrictPhoneNumber);
  this.on('keypress', formatPhoneNumber);
  this.on('keydown', formatBackPhoneNumber);
  this.on('keyup', setPhoneType);
  this.on('paste', reFormatPhoneNumber);
  this.on('change', reFormatPhoneNumber);
  this.on('input', reFormatPhoneNumber);
  this.on('input', setPhoneType);
  return this;
};

$.phonePayment.fn.restrictNumeric = function () {
  this.on('keypress', restrictNumeric);
  this.on('paste', reFormatNumeric);
  this.on('change', reFormatNumeric);
  this.on('input', reFormatNumeric);
  return this;
};

$.phonePayment.validatePhoneNumber = function (num) {
  var phone, ref;
  num = (num + '').replace(/\s+|-/g, '');
  if (!/^\d+$/.test(num)) {
    return false;
  }
  phone = phoneFromNumber(num);
  if (!phone) {
    return false;
  }
  if ((num.length === 9 && num.charAt(0) !== '7') || (num.length === 10 && num.substr(0, 2) !== '07') || (num.length === 12 && num.substr(0, 4) !== '2567')) {
    return false;
  }
  return (ref = num.length, indexOf.call(phone.length, ref) >= 0)
};

$.phonePayment.phoneType = function (num) {
  var ref;
  if (!num) {
    return null;
  }
  return ((ref = phoneFromNumber(num)) != null ? ref.type : void 0) || null;
};

$.phonePayment.formatPhoneNumber = function (num) {
  var phone, groups, ref, upperLength;
  num = num.replace(/\D/g, '');
  phone = phoneFromNumber(num);
  if (!phone) {
    return num;
  }
  upperLength = phone.length[phone.length.length - 1];
  num = num.slice(0, upperLength);
  if (phone.format.global) {
    return (ref = num.match(phone.format)) != null ? ref.join(' ') : void 0;
  } else {
    groups = phone.format.exec(num);
    if (groups == null) {
      return;
    }
    groups.shift();
    groups = $.grep(groups, function (n) {
      return n;
    });
    return groups.join(' ');
  }
};
