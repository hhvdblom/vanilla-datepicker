/**
 * datepicker javascript module
 */
class DatePicker {    
   
    /**
     * datepicker constructor.
     */
    constructor() {        
       
        // variables
        this.disable = [];
        this.isDatePickerClicked = false;
        this.isDateClicked = false;
        this.monthChange = false;
                
        // selected date
        this.selected = {
            formattedDate: null,        
            date: null,
            day: 0,
            month: 0,
            year: 0
        };  

        // datepicker      
        this.datePickerField = null;
        this.datePickerCalendar = null;

        // named datepicker click events.
        this.clickEvents = {
            document: this.handleDocumentClick.bind(null, this),
            keydown: this.keyDownListener.bind(null, this),
            datePick: this.handleDatePickerClick.bind(null, this),
            day: this.select.bind(null, this),
            show: this.show.bind(null, this),
            handleMonthChange: this.handleMonthChange.bind(null, this),
            handleYearChange: this.handleYearChange.bind(null, this),
            changeMonth: this.changeMonth.bind(null, this)
        };
    }     

    /**
     * initialize datepicker
     * @param {any} datePickerId: id of the datepicker
     */
    initialize(datePickerId) {

        // initial selected
        this.selected.formattedDate = null;
        this.selected.date = null;
        this.selected.day = 0;
        this.selected.month = 0;
        this.selected.year = 0;

        // intialize variables
        this.disable = [];
        this.isDatePickerClicked = false;
        this.isDateClicked = false;
        this.monthChange = false;       

        // create datepicker
        this.create(datePickerId);
    }

    /**
     * create the datepicker 
     * @param {any} datePickerId: id of the datepicker
     */
    create(datePickerId) {

        // show datepicker when clicked on datepicker field.
        document.getElementById(datePickerId).addEventListener('click', this.clickEvents.show);

        // placeholder for the datepicker.
        var div = document.createElement('div');
        div.id = 'datepicker-' + datePickerId;
        document.body.appendChild(div);
    }

    /**
     * show datepicker
     * @param {any} self: datepicker instance
     * @param {any} event: handle click event.
     */
    show(self, event) {   

        // datepicker fields and calendar.      
        self.datePickerField = document.getElementById(event.target.id);
        self.datePickerCalendar = document.getElementById('datepicker-' + event.target.id);

        // build the datepicker.
        self.build();

        // positioning of the datepicker
        var rect = self.datePickerField.getBoundingClientRect();
        self.datePickerCalendar.style.position = 'fixed';
        self.datePickerCalendar.style.top = rect.bottom - 7 + 'px';
        self.datePickerCalendar.style.left = rect.left + 'px';
        self.datePickerCalendar.style.zIndex = '99999';       
    }

    /**
     * build the datepicker
     */
    build() {

        // only add if not added already
        if (!this.hasDatePicker(this.datePickerCalendar)) {

            // get date from datepicker field.
            if (this.datePickerField.value) {

                // invalid date, take date now
                var dateArray = this.datePickerField.value.split('-');
                var date = new Date(parseInt(dateArray[2]), parseInt(dateArray[1]) - 1, parseInt(dateArray[0]));
                if (isNaN(date.getTime())) {
                    date = new Date();
                    this.selected.day = date.getDate();
                    this.selected.month = date.getMonth();
                    this.selected.year = date.getFullYear();

                }

                // valid date, take that date.
                else {
                    this.selected.day = date.getDate();
                    this.selected.month = date.getMonth();
                    this.selected.year = date.getFullYear();
                }
            }

            // no date in datepicker field so take date of now
            else {
                date = new Date();
                this.selected.day = date.getDate();
                this.selected.month = date.getMonth();
                this.selected.year = date.getFullYear();                 
            }

            // selected date.
            this.selected.date = date;
            this.selected.formattedDate = this.formatDate(this.selected.day, this.selected.month, this.selected.year);

            // calendar for datepicker
            var datePicker = document.createElement('div');
            datePicker.className = 'datepicker';
            datePicker.innerHTML = this.calendarHeader() + this.calendarBody();
            
            // add calendar to datepicker
            var fragment = document.createDocumentFragment();
            fragment.appendChild(datePicker);
            this.datePickerCalendar.appendChild(fragment); 

            // add the calendar listeners.
            this.addCalenderListeners();

            // handle clicks anywhere on datepicker         
            this.datePickerCalendar.addEventListener('click', this.clickEvents.datePick);
        } 

        // listen to keyboard input.
        document.addEventListener('keydown', this.clickEvents.keydown);

        // use capturing for this event because it should be the first to fire.
        var htmlRoot = document.getElementsByTagName('html')[0];
        htmlRoot.addEventListener('click', this.clickEvents.document, true);
    }

    /**
     * select date on calendar
     * @param {any} self: datepicker instance
     * @param {any} event: click day id is in here.
     */
    select(self, event) {

        // month is not changed.
        self.monthChange = false;

        // day clicked
        var day = event.target;
        if (day) {

            // set this day as selected.
            day.classList.add('datepicker-day-selected');

            // set selected date.
            self.select.day = parseInt(day.dataset.day);
            self.select.month = parseInt(day.dataset.month);
            self.select.year = parseInt(day.dataset.year);
            self.datePickerField.value = self.select.dateFormatted = self.formatDate(self.select.day, self.select.month, self.select.year);

            // show selected date.
            self.datePickerField.focus();
            setTimeout(function () { self.datePickerField.blur(); }, 100);
        }

        // hide datepicker.
        self.isDatePickerClicked = false;
        self.isDateClicked = true;
        self.hide();
    };

    /**
     * check if datepicker is already built and added to DOM
     * @param {any} el
     */
    hasDatePicker(el) {
        return el && el.querySelector('.datepicker') ? true : false;
    }

    /**
     * get short monthname.
     * @param {string} month: 
     */
    getMonthShort(month) {
        var months = ['Jan', 'Feb', 'Maa', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
        var formatted = month.charAt(0).toUpperCase() + month.substr(1, month.length - 1).toLowerCase();
        return months.indexOf(formatted);
    }    

    /**
     * calendar header
     */
    calendarHeader() { 
        var html =
            '<div class="datepicker-header">' +
            '<div class="datepicker-arrow datepicker-arrow-prev"></div>' +
            '<div class="datepicker-date">' + this.calendarMonths() + '&nbsp;&nbsp;' + this.calendarYears() + '</div>' +
            '<div class="datepicker-arrow datepicker-arrow-next"></div>' +
            '</div>';   
        return html;
    }

    /**
     * calendar body
     */
    calendarBody() {

        // week day short names.
        var weeks = ['M', 'D', 'W', 'D', 'V', 'Z', 'Z'];
        var html = '<div class="datepicker-calendar"><table><tr>';
        for (var weekIndex = 0; weekIndex < weeks.length; weekIndex++) 
            html += '<td><div class="datepicker-week">' + weeks[weekIndex] + '</div></td>';
        html += "</tr><tr>";
       
        // days in month.
        var columnIndex = 0;
        var daysInMonth = this.getDaysInMonth(); 
        for (var dayIndex = 0 - this.rowPadding(); dayIndex < daysInMonth; dayIndex++) {

            // not a valid day, so empty column
            if (dayIndex < 0) 
                html += '<td></td>';            

            // valid day, fill column.
            else {
                var dayClass = dayIndex === (this.selected.day - 1) ? 'datepicker-day-today' : '';
                html += '<td><div class="datepicker-day ' + dayClass + '" ';
                html += 'data-day="' + (dayIndex + 1) + '" data-month="' + this.selected.month;
                html += '" data-year="' + this.selected.year + '" ';
                html += '>' + (dayIndex + 1) + '</div></td>';
            }

            // start with new row
            columnIndex++;
            if (columnIndex % 7 === 0) {
                columnIndex = 0;
                html += '</tr><tr>';
            }
        }
        html += "</tr>";       

        // return body
        return html += '</table></div>';
    }

    /**
     * calendar months select tag.
     */
    calendarMonths() {

        // short month names
        var months = ['Jan', 'Feb', 'Maa', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

        // select tag for months
        var monthsSelect = '<select class="datepicker-date-month">';
        for (var monthIndex = 0; monthIndex < 12; monthIndex++) {
            monthsSelect += '<option value="' + monthIndex + '"';
            if (monthIndex == this.selected.month)
                monthsSelect += ' selected';
            monthsSelect += '>' + months[monthIndex] + "</option>";
        }

        // return select tag for months
        return monthsSelect += '</select>';
    }

    /**
     * calendar years select tag.
     */
    calendarYears() {

        // years for select tag.
        var yearsSelect = '<select class="datepicker-date-year">';
        var currentYear = new Date().getFullYear();
        for (var yearIndex = this.selected.year - 20; yearIndex <= currentYear + 5; yearIndex++) {
            yearsSelect += '<option value="' + yearIndex + '"';
            if (yearIndex == this.selected.year) 
                yearsSelect += ' selected';            
            yearsSelect += '>' + yearIndex + '</option>';
        }

        // return select tag for years.
        return yearsSelect += '</select>';
    }

    /**
     * event listeners for the calendar
     */
    addCalenderListeners() {

        // add event listeners for previous/next button.
        var prevButton = this.datePickerCalendar.getElementsByClassName('datepicker-arrow-prev')[0];
        var nextButton = this.datePickerCalendar.getElementsByClassName('datepicker-arrow-next')[0];
        nextButton.addEventListener('click', this.clickEvents.changeMonth);
        prevButton.addEventListener('click', this.clickEvents.changeMonth);

        // add event listener for month/year change
        var monthSelect = this.datePickerCalendar.getElementsByClassName('datepicker-date-month')[0];
        var yearSelect = this.datePickerCalendar.getElementsByClassName('datepicker-date-year')[0];
        monthSelect.addEventListener('change', this.clickEvents.handleMonthChange);
        yearSelect.addEventListener('change', this.clickEvents.handleYearChange);        

        // add day click listeners
        var days = this.datePickerCalendar.getElementsByClassName('datepicker-day');
        if (days && days.length) 
            for (var dayIndex = 0; dayIndex < days.length; dayIndex++) 
                if (typeof days[dayIndex].onclick !== "function") 
                    if (days[dayIndex].className && days[dayIndex].className.indexOf('datepicker-day-disabled') === -1) 
                        days[dayIndex].addEventListener('click', this.clickEvents.day);                    
    }

    /**
     * remove the event listeners from the calendar
     */
    removeCalendarListeners() {

        // add event listeners for previous/next button.
        var prevButton = this.datePickerCalendar.getElementsByClassName('datepicker-arrow-prev')[0];
        var nextButton = this.datePickerCalendar.getElementsByClassName('datepicker-arrow-next')[0];
        nextButton.removeEventListener('click', this.clickEvents.changeMonth);
        prevButton.removeEventListener('click', this.clickEvents.changeMonth);

        // remove month/year listeners
        var monthSelect = this.datePickerCalendar.getElementsByClassName('datepicker-date-month')[0];
        var yearSelect = this.datePickerCalendar.getElementsByClassName('datepicker-date-year')[0];
        monthSelect.removeEventListener('click', this.clickEvents.handleMonthChange);
        yearSelect.removeEventListener('click', this.clickEvents.handleYearChange);

        // remove day click listeners
        var days = this.datePickerCalendar.getElementsByClassName('datepicker-day');
        if (days && days.length)
            for (var dayIndex = 0; dayIndex < days.length; dayIndex++)
                if (typeof days[dayIndex].onclick === "function")
                    days[dayIndex].removeEventListener('click', this.clickEvents.day);

        // remove datepicker click listeners
        this.datePickerCalendar.removeEventListener('click', this.clickEvents.datePick);    
    }

    /**
     * update calendar with new month/year
     * @param {any} newMonth: new month chosen
     * @param {any} newYear: or new year chosen
     */
    calendarUpdate(newMonth, newYear) {

        // month has changed.
        this.monthChange = true;

        // new month chosen   
        if (newMonth)
            this.selected.month = newMonth;

        // new year chosen.
        if (newYear)
            this.selected.year = newYear;

        // remove calendar listeners
        this.removeCalendarListeners();

        // show updated calendar.
        var datepicker = this.datePickerCalendar.querySelector('.datepicker');
        datepicker.innerHTML = this.calendarHeader() + this.calendarBody();

        // reinstall event listeners.
        this.addCalenderListeners();

        // no date is picked yet.
        this.isDatePickerClicked = false;
    }

    /**
     * change month
     * @param {any} self: datepicker instance
     * @param {any} event: handle click event
     */
    changeMonth(self, event) {

        // let this code handle the click event
        event.preventDefault();
        event.stopPropagation();

        // next button clicked
        var positive = false;
        if (event.target.className.indexOf('datepicker-arrow-next') !== -1) 
            positive = true;

        // next month
        var newMonth = self.selected.month;
        var newYear = self.selected.year;
        if (positive) {
            var newMonth = ++self.selected.month;
            if (newMonth == 12) {
                self.selected.month = newMonth = 0;
                self.selected.year = ++newYear;
            }
        }

        // previous month
        else {
            var newMonth = --self.selected.month;
            if (newMonth < 0) {
                self.selected.month = newMonth = 11;
                self.selected.year = --newYear;
            }
        }

        // update calendar with new month/year.        
        self.calendarUpdate(newMonth, newYear);
    }

    /**
     * handle month change from select tag
     * @param {any} self: datepicker
     * @param {any} event: change event.
     */
    handleMonthChange(self, event) {
        self.calendarUpdate(event.target.value);
    }

    /**
     * handle year change from select tag
     * @param {any} self: datepicker
     * @param {any} event: change event.
     */
    handleYearChange(self, event) {
        self.calendarUpdate(null, event.target.value);
    }

    /**
     * format this date
     * @param {any} selectedDay: selected day
     * @param {any} selectedMonth: selected month
     * @param {any} selectedYear: selected year
     */
    formatDate(selectedDay, selectedMonth, selectedYear) {
        var day = selectedDay < 10 ? '0' + selectedDay : selectedDay;
        var month = selectedMonth < 9 ? '0' + (selectedMonth + 1) : (selectedMonth + 1);
        return day + '-' + month + '-' + selectedYear;
    }

    /**
     * get days in month     
     */
    getDaysInMonth() {
        return [31, this.isLeapYear(this.selected.year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.selected.month];
    }

    /**
     * check if year is leap year
     * @param {any} year
     */
    isLeapYear(year) {
        return year % 100 === 0 ? year % 400 === 0 ? true : false : year % 4 === 0;
    }

    /**
     * pad extra rows when needed.
     */
    rowPadding() {
        var startWeekDay = new Date(this.selected.year, this.selected.month, 1).getDay();      
        return [6, 0, 1, 2, 3, 4, 5][startWeekDay];
    }

    /**
     * hide datepicker
     */
    hide() {

        // no date selected, remove datepicker
        if (!this.monthChange && !this.isDatePickerClicked) {
            this.removeEventListeners();
            this.isDateClicked = false;
            this.datePickerCalendar.innerHTML = '';
            this.datePickerField = self.datePickerCalendar = null;               
        }

        // datepicker is not clicked, month not changed so set focus to datepicker field.
        else if (!this.isDatePickerClicked) {
            this.datePickerField.focus();
            this.monthChange = false;
        }
    } 

    /**     
     * remove event Listeners
     */
    removeEventListeners() {

        // remove calendar listeners
        this.removeCalendarListeners();                 

        // remove keyboard listener
        document.removeEventListener('keydown', this.clickEvents.keydown);
        
        // remove document click listener
        var htmlRoot = document.getElementsByTagName('html')[0];
        htmlRoot.removeEventListener('click', this.clickEvents.document, true);        
    }

    /**
     * handle datepicker click
     * @param {any} self: datepicker instance
     * @param {any} event: stop event propagation
     */
    handleDatePickerClick(self, event) {
        event.stopPropagation();
        if (!self.isDateClicked) 
            self.isDatePickerClicked = true;
    }

    /**
     * hide datepicker if clicked outside datepicker
     * @param {any} self datepicker instance
     * @param {any} event field clicked
     */
    handleDocumentClick(self, event) {

        // no date selected.
        self.isDatePickerClicked = false;
        self.monthChange = false;

        // hide if not clicked on the datepicker.
        if (!self.isEventInElement(event, document.getElementsByClassName("datepicker")[0]))
            self.hide();      
    } 

    /**
     * check whether the event occurred roughly inside (or above) the element.
     * @param {MouseEvent} event event to check.
     * @param {Node} element element to check.
     */
    isEventInElement(event, element) {

        var rect = element.getBoundingClientRect();
        var x = event.clientX;
        if (x < rect.left || x >= rect.right) return false;
        var y = event.clientY;
        if (y < rect.top || y >= rect.bottom) return false;
        return true;
    }

    /**
     * hide when keyboard characters are pressed.
     * @param {any} self: datepicker instance
     */
    keyDownListener(self) {
        self.monthChange = false;
        self.hide();
    }
}

// export the datepicker class.
export { DatePicker };