const topNav = document.querySelector('.top-nav');

let eventList = {};
let eventListJson;
let dataAtribute;

let a = localStorage.getItem('eventList');
eventListJson =  JSON.parse(a);

eventList = isEmpty(eventListJson) ? {} : eventListJson;



topNav.addEventListener('click', topNavButtons);

const calendarMain = new Calendar();
calendarMain.render();
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

    constructor(selector) {
        super(selector);
        this.input = document.querySelector(`.${this.selector}__input-title`);
        this.description = document.querySelector(`.${this.selector}__input-text`);
        this.buttonsList = document.querySelectorAll(`#${this.selector}__btn`);
    }

    save() {
        const eventTitle = this.input.value;
        const eventDescription = this.description.value;
        const eventType = this.checkEventType();
        let newEvent;

        if(!eventTitle) {return};

        if(!eventList[dataAtribute]) {
            const arr = [];

            newEvent = this.createObj(eventTitle, eventDescription, eventType);
            arr.push(newEvent);
            
            eventList[dataAtribute] = arr;
        } else if( !isEmpty(eventList[dataAtribute]) ) {
            if ( this.isEventDuplicate(eventTitle, eventType) ) {
                alert('Така подія існує, змініть назву або тип події');
                return;
            }

            newEvent = this.createObj(eventTitle, eventDescription, eventType);
            eventList[dataAtribute].push(newEvent);
        }
        
        saveEventList();
        this.hide();
        this.clear();
        calendarMain.render();
    }
    clear() {
        this.buttonsList[0].checked = 'checked';
        this.input.value = '';    
        this.description.value = '';
    }
    createObj(eventTitle, eventDescription, eventType) {
        const details = {};   
        
        details.title = eventTitle;
        details.description = eventDescription;
        details.event = eventType;

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
};

const createEventForm = new CreateEventForm('new-event');
const propertyEventForm = new EventForm('event-property');

createEventForm.$el.addEventListener('click', e => {
    const closeBtn = e.target.matches(`.${createEventForm.selector}__close`);
    const saveBtn = e.target.matches(`.${createEventForm.selector}__save`);

    if (closeBtn) createEventForm.hide();
    if (saveBtn) createEventForm.save();
});
propertyEventForm.$el.addEventListener('click', e => {
    const closeBtn = e.target.matches(`.${createEventForm.selector}__close`);
    const saveBtn = e.target.matches(`.${createEventForm.selector}__save`);

    if (closeBtn) createEventForm.hide();
});




function Calendar() {
    
    const currentDate = new Date();
    const main = {
        dayCell: 'bg-calendar__day',
        inactive: 'inactive',
        day: 'bg-calendar__day-date',
        currentDay: 'current_day'
    };
        
    const instance =  {
        
        render() {
            let content = '';
    
            const dateCopy = new Date(currentDate);
            for (let day = (1 - this.firsDayOfWeek); day <= (this.daysCount + (6 - this.lastDayOfWeek)); day++) {
                dateCopy.setDate(1);
                dateCopy.setFullYear(currentDate.getFullYear());
                dateCopy.setMonth(currentDate.getMonth());
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
                        class="${main.dayCell} ${isInactive ? 'inactive' : ''}"
                    >
                        <div class="${main.day} ${isCurrentDay ? main.currentDay : ''}">${dateCopy.getDate()}</div>
                        ${this.hasEvent(data_date) || ''}                    
                    </div>
                `;
            }
    
            document.querySelector('.bg-calendar__row--days').innerHTML = content;
        },
        get firsDayOfWeek() {
            return this.getDayOfWeek(1);
        },
        get lastDayOfWeek() {
            return this.getDayOfWeek(this.daysCount);
        },
        get daysCount() {
            const date = new Date(currentDate);
            const currentMonth = date.getMonth();

            date.setMonth(currentMonth + 1);
            date.setDate(0);
    
            return date.getDate();
        },
        get dateStr() {
            return `${currentDate.getMonth()}-${currentDate.getFullYear()}`
        },
        getDayOfWeek(day) {
            const date = new Date(currentDate);
            
            date.setDate(day);
            
            return date.getDay();
        },
        getDateStr(date) {
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            return `${year}-${month}-${day}`;
        },
        changeMonth(next) {
            next ? currentDate.setMonth(currentDate.getMonth() + 1) : currentDate.setMonth(currentDate.getMonth() - 1);

            instance.render();
        },
        setCurrentMonth() {
            const date = new Date();
            currentDate.setMonth(date.getMonth());
            currentDate.setFullYear(date.getFullYear());
            currentDate.setDate(date.getDate());
            instance.render();
        },
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

    document.querySelector('.bg-calendar__row--days').addEventListener('click', e => {
        const dayCell = e.target.matches('.bg-calendar__day');
        const event = e.target.matches('.event');
       
        if (dayCell) createEventForm.show(e);

        if (event) {
            propertyEventForm.show(e);
        }

        console.log(event);
    });
    
    return instance;
}