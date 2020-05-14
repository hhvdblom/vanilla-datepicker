<h1>DatePicker</h1>

This is a rewrite of the foodatepicker. Because there where a couple of bug I needed to fix those. When I was busy I thought why not write the whole thing as a javascript Module. I skipped some code so if you need it in another language, no problem the code is heavily commented so easy to know where you will have to put Weeks, Months in your code.

<h2>Use the date picker</h2>

if you want to use the daypicker everywhere in your application:

// import datepicker
import { DatePicker } from './modules/datepicker.js';
window.datePicker = new DatePicker();

then create daypicker for every element on your pages:

 // create datepicker
 datePicker.initialize([element]); 
