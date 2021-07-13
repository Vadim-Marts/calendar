const topNav = document.querySelector('.top-nav');

let eventList = {};
let eventListJson;
let dataAtribute;

let a = localStorage.getItem('eventList');
eventListJson =  JSON.parse(a);

eventList = isEmpty(eventListJson) ? {} : eventListJson;

topNav.addEventListener('click', topNavButtons);

function isEmpty(obj) {
    for (let key in obj) {

      return false;
    }
    return true;
}
function saveEventList() {
    eventListJson = JSON.stringify(eventList);
    localStorage.setItem('eventList', eventListJson);
}
class EventForm {
    constructor(selector) {
        this.selector = selector;
        this.$el = document.querySelector(`.${this.selector}`);
    }

    show(e) {
        this.$el.classList.add(`${this.selector}--opened`);
        this.setFormCoords(e);

        dataAtribute = e.target.closest('[data-data]').dataset.data;
    }
    hide() {
        this.$el.classList.remove(`${this.selector}--opened`);
    }
    setFormCoords(e) {
        const step = 50;
        const width = this.$el.offsetWidth;
        const height = this.$el.offsetHeight;
        let xCoord = e.clientX;
        let yCoord = e.clientY;
        
        if (xCoord - width - step < 0) {
            xCoord = xCoord + step;
        } else {
            xCoord = xCoord - width - step;
        }
    
        if (yCoord + height > window.innerHeight){
            yCoord = yCoord - height;
        } else {
            yCoord = yCoord;
    
        }
    
        this.$el.style.left = xCoord + 'px';
        this.$el.style.top = yCoord + 'px';
    }
    
}
class CreateEventForm extends EventForm {
    isEdit;
    currentIndex;

    constructor(selector) {
        super(selector);
        this.input = document.querySelector(`.${this.selector}__input-title`);
        this.description = document.querySelector(`.${this.selector}__input-text`);
        this.inputHours = document.querySelector(`.${this.selector}__hours`);
        this.inputMinutes = document.querySelector(`.${this.selector}__minutes`);
        this.buttonsList = document.querySelectorAll(`#${this.selector}__btn`);

        this.$el.addEventListener('click', e => {
            const closeBtn = e.target.matches(`.${this.selector}__close`);
            const saveBtn = e.target.matches(`.${this.selector}__save`);
        
            if (closeBtn) this.hide();
            if (saveBtn) this.save();
        });
    }

    save() {
        const eventParams = {
            title: this.input.value,
            description: this.description.value,
            type: this.checkEventType(),
            hours: this.inputHours.value || '',
            minutes: this.inputMinutes.value || '00'
        }

        let newEvent;

        if(!eventParams.title) {return};

        if(!eventList[dataAtribute]) {
            const arr = [];

            newEvent = this.createObj(eventParams);
            arr.push(newEvent);
            
            eventList[dataAtribute] = arr;
        } else if( !isEmpty(eventList[dataAtribute]) ) {
            if ( this.isEventDuplicate(eventParams.title, eventParams.type) && !this.isEdit ) {
                alert('Така подія існує, змініть назву або тип події');
                return;
            } else if(this.isEdit) {
                eventList[dataAtribute][this.currentIndex] = this.createObj(eventParams);
            } else {
                newEvent = this.createObj(eventParams);
                eventList[dataAtribute].push(newEvent);
            }
        }

        this.isEdit = false;
        this.sortEvent();
        saveEventList();
        this.hide();
        this.clear();
        calendarMain.render();
    }
    clear() {
        this.buttonsList[0].checked = 'checked';
        this.input.value = '';    
        this.description.value = '';
        this.inputHours.value = '';
        this.inputMinutes.value = '';
    }
    hide() {
        super.hide();
        this.clear();
    }
    edit(event, index) {
        this.show(event);
        this.currentIndex = index;
        const eventProperty = {
            title: eventList[dataAtribute][index].title,
            description: eventList[dataAtribute][index].description,
            type: eventList[dataAtribute][index].event,
            hours: eventList[dataAtribute][index].time.split('.')[0],
            minutes: eventList[dataAtribute][index].time.split('.')[1],
        }

        this.input.value = eventProperty.title;
        this.description.value = eventProperty.description;
        this.inputHours.value = eventProperty.hours;
        this.inputMinutes.value = eventProperty.minutes;
        this.buttonsList.forEach(el => {
            if(el.dataset.event_btn === eventList[dataAtribute][index].event) {
                el.checked = 'checked';
            }
        });
        this.isEdit = true;
    }
    createObj(obj) {
        const details = {};   
        
        details.title = obj.title;
        details.description = obj.description;
        details.event = obj.type;
        details.time = `${obj.hours}.${obj.minutes}`;

        return details;
    }
    checkEventType() {
        let eventType;

        this.buttonsList.forEach(elem => {
            if(elem.checked) { eventType = elem.dataset.event_btn }
        });

        return eventType;
    }
    isEventDuplicate(EventTitle, EventType) {
        let isDuplicate;

        isDuplicate = eventList[dataAtribute].some( el => el.title === EventTitle && el.event === EventType );

        return isDuplicate;        
    }
    sortEvent() {
        eventList[dataAtribute].sort((a, b) => {
            return a.time - b.time;
        });
    }
};
class PropertyEventForm extends EventForm {
    weekDay = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
    months = ['Січня', 'Лютого', 'Березня', 'Квітня', 'Травня', 'Червня', 'Липня', 'Серпня', 'Вересня', 'Жовтня', 'Листопада', 'Грудня'];
    eventParams = {
        date: document.querySelector(`.${this.selector}__date`),
        description: document.querySelector(`.${this.selector}__text`),
        title: document.querySelector(`.${this.selector}__title`),
        time: document.querySelector(`.${this.selector}__time`),
    }
    eventCopy;
    eventIndex;

    constructor(selector) {
        super(selector);
        this.$el.addEventListener('click', e => {
            const closeBtn = e.target.closest(`.${this.selector}__close`);
            const removeBtn = e.target.closest(`.${this.selector}__delete`);
            const editBtn = e.target.closest(`.${this.selector}__edit`);
        
            if (closeBtn) this.hide();
            if (removeBtn) this.remove();
            if (editBtn) {
                this.hide();
                createEventForm.edit(this.eventCopy, this.eventIndex)
            };
        });
    }

    show(e) {
        super.show(e);
        this.eventCopy = e;
        const name = e.target.innerText;
        const data = e.target.parentElement.dataset.data;
        this.eventIndex = this.getIndex(name, data);
        const description = eventList[data][this.eventIndex].description;
        const time = eventList[data][this.eventIndex].time;
        
        this.eventParams.title.innerText = name;
        this.eventParams.description.innerText = description;
        this.eventParams.time.innerText = time.split('.').join(':');
        this.eventParams.date.innerText = this.getDateStr(data)
    }
    remove() {
        const name = this.eventCopy.target.innerText;
        const data = this.eventCopy.target.parentElement.dataset.data;
        const index = this.getIndex(name, data);

        eventList[data].splice(index, 1);

        if (eventList[data].length === 0) {delete eventList[data]}

        saveEventList();
        this.hide();
        calendarMain.render();
    }
    getDateStr(data) {
        const newDate = new Date(data);
        let str = '';

        str = `${this.weekDay[newDate.getDay()]}, ${newDate.getDate()} ${this.months[newDate.getMonth()]}`;
        
        return str;
    } 
    getIndex(name, data) {
        let currentIndex;

        eventList[data].forEach((item, index) => {
            if (item.title === name) currentIndex = index
        });
        return currentIndex;
    }


}

const createEventForm = new CreateEventForm('new-event');
const propertyEventForm = new PropertyEventForm('event-property');
class Calendar {
    
    currentDate = new Date();
    main = {
        dayCell: 'bg-calendar__day',
        inactive: 'inactive',
        day: 'bg-calendar__day-date',
        currentDay: 'current_day'
    };
    constructor() {
        document.querySelector('.bg-calendar__row--days').addEventListener('click', e => {
            const dayCell = e.target.matches(`.${this.main.dayCell}`);
            const event = e.target.matches('.event');
            
            if (dayCell) createEventForm.show(e);
        
            if (event) {
                propertyEventForm.show(e);
            }
        });
    }
    render() {
        let content = '';

        const dateCopy = new Date(this.currentDate);
        for (let day = (1 - this.firsDayOfWeek); day <= (this.daysCount + (6 - this.lastDayOfWeek)); day++) {
            dateCopy.setDate(1);
            dateCopy.setFullYear(this.currentDate.getFullYear());
            dateCopy.setMonth(this.currentDate.getMonth());
            dateCopy.setDate(day);

            let isInactive;
            if (day <= 0 || day > this.daysCount) {
                isInactive = true;
            }

            let isCurrentDay;
            const currentDateStr = this.getDateStr(new Date());
            const data_date = this.getDateStr(dateCopy); 

            if (currentDateStr === data_date) {
                isCurrentDay = true;
            }
            

            content += `
                <div 
                    data-data="${data_date}"
                    class="${this.main.dayCell} ${isInactive ? 'inactive' : ''}"
                >
                    <div class="${this.main.day} ${isCurrentDay ? this.main.currentDay : ''}">${dateCopy.getDate()}</div>
                    ${this.hasEvent(data_date) || ''}                    
                </div>
            `;
        }

        document.querySelector('.bg-calendar__row--days').innerHTML = content;
    }
    get firsDayOfWeek() {
        return this.getDayOfWeek(1);
    }
    get lastDayOfWeek() {
        return this.getDayOfWeek(this.daysCount);
    }
    get daysCount() {
        const date = new Date(this.currentDate);
        const currentMonth = date.getMonth();

        date.setMonth(currentMonth + 1);
        date.setDate(0);

        return date.getDate();
    }
    get dateStr() {
        return `${this.currentDate.getMonth()}-${this.currentDate.getFullYear()}`
    }
    getDayOfWeek(day) {
        const date = new Date(this.currentDate);
        
        date.setDate(day);
        
        return date.getDay();
    }
    getDateStr(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        return `${year}-${month}-${day}`;
    }
    changeMonth(next) {
        next ? this.currentDate.setMonth(this.currentDate.getMonth() + 1) : this.currentDate.setMonth(this.currentDate.getMonth() - 1);

        this.render();
    }
    setCurrentMonth() {
        const date = new Date();
        this.currentDate.setMonth(date.getMonth());
        this.currentDate.setFullYear(date.getFullYear());
        this.currentDate.setDate(date.getDate());
        this.render();
    }
    hasEvent(atribute) {
        if ( eventList.hasOwnProperty(atribute) ) {
            let content = '';

            let div = document.createElement('div');
            div.classList.add(`bg-calendar__event`);
            div.innerText = '1';

                eventList[atribute].forEach(el => {
                content += `<div class="event bg-calendar__${el.event}">${el.title}</div>`;
            });

            return content;
        }
    }
}

const calendarMain = new Calendar();
calendarMain.render();

function changeDateStr() {
    const monthsArr = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад',  'Грудень'];
    const monthName = document.querySelectorAll('.current__month'),
          yearName = document.querySelectorAll('.current__year');
    const month = calendarMain.dateStr.split('-').slice(0,1).join('');
    const year = calendarMain.dateStr.split('-').slice(1).join('');

    for (let i = 0; i < 2; i++) {
        monthName[i].innerText = monthsArr[month]; 
        yearName[i].innerText = year;   
    }
} 
changeDateStr();

function topNavButtons(e) {
    const prev = e.target.closest('.prev-btn');
    const next = e.target.closest('.next-btn');
    const now = e.target.closest('.top-nav__today');
    const sidebarBtn = e.target.closest('.top-nav__main-menu-btn');

    
    if (prev) {
        calendarMain.changeMonth();
        changeDateStr();
    }

    if (next) {
        calendarMain.changeMonth(true);
        changeDateStr();
    }

    if (now) {
        calendarMain.setCurrentMonth();
        changeDateStr();
    }

    if (sidebarBtn) {
        const sidebar = document.querySelector('.sidebar');

        sidebar.classList.toggle('sidebar--hide');
    }
}