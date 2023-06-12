import Vue from 'vue'
import { extend } from 'vee-validate';
import { maxDate, minDate } from 'vee-validate/dist/rules';
import moment from 'moment';

// Register the maxDate and minDate rules
extend('maxDate', maxDate);
extend('minDate', minDate);

// Define a custom validation rule to check the maximum range
extend('dateRangeMax', {
  validate(value, { maxRange }) {
    // Parse the selected dates using Moment.js
    const [start, end] = value.map(date => moment(date, 'YYYY-MM-DD'));

    // Check if the range exceeds the maximum number of days
    return end.diff(start, 'days') <= maxRange;
  },
  message: 'The date range may not exceed {maxRange} days.'
});