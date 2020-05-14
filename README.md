<h1>vanilla-datepicker</h1>

This is a rewrite of the foopicker (credits go to saikonero)

I did not give the vanilla-datepicker a special name. Just DatePicker, but you can call it in the main.js file whatever you want.

<h2>Why the rewrite?</h2>

Because there where a couple of bug I needed to fix. When I was busy I thought why not write the whole thing as a javascript Module. I skipped some code so if you need it in another language, no problem the code is heavily commented so its easy to know where you will have to put Weeks, Months and format in your code.

<h2>Use the date picker</h2>

if you want to use the daypicker everywhere in your application:

```sh
main.js:  
import { DatePicker } from './modules/datepicker.js';
window.datePicker = new DatePicker();

code.js of whatever name you want for your javascript file:
datePicker.initialize([element]);   
[element] can be every valid html element you want your datepicker connect to
```

<h2>Class</h2>

Its one class. Thats why you will need the initialize function. If you put the datePicker.initialize function in a loop and give the inputfields on a form a classname 'datepicker' then you can initialize all datepickers on that page in one loop.
