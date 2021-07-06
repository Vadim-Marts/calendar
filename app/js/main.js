const topNav = document.querySelector('.top-nav');
const calendarMain = new Calendar();
const eventForm = new EventForm();
const eventProperty = new EventProperty();

let eventList = {};
let eventListJson;
let dataAtribute;

let a = localStorage.getItem('eventList');
eventListJson =  JSON.parse(a);

eventList = isEmpty(eventListJson) ? {} : eventListJson;


calendarMain.render();
changeDateStr();


topNav.addEventListener('click', topNavButtons);

function isEmpty(obj) {
    for (let key in obj) {

      return false;
    }
    return true;
}

function topNavButtons(event) {
    const arrow = event.target.offsetParent.classList[0];
    const now = event.target.classList[0];
    const sidebarBtn = event.target.classList[0];
    
    switch (arrow) {
        case 'next-btn':
            calendarMain.changeMonth(true);
            changeDateStr();
            break;
        case 'prev-btn':
            calendarMain.changeMonth();
            changeDateStr();
            break;
    }

    if (now === 'top-nav__today') {
        calendarMain.setCurrentMonth();
        changeDateStr();
    }

    if (sidebarBtn === 'icon-dehaze') {
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

function setFormCoords(e, formWidth, formHeight, form) {
    const step = 50;
    let xCoord = e.clientX;
    let yCoord = e.clientY;


    dataAtribute = e.target.dataset.date ||  e.target.parentElement.dataset.date; 
    
    if (xCoord - formWidth - step < 0) {
        xCoord = xCoord + step;
    } else {
        xCoord = xCoord - formWidth - step;
    }

    if (yCoord + formHeight > window.innerHeight){
        yCoord = yCoord - formHeight;
    } else {
        yCoord = yCoord;

    }

    form.style.left = xCoord + 'px';
    form.style.top = yCoord + 'px';
}

function saveEventList() {
    eventListJson = JSON.stringify(eventList);
    localStorage.setItem('eventList', eventListJson);
}

function Calendar() {
    const calendar = document.querySelector('.bg-calendar__row--days');
    const currentDate = new Date();
    const main = {
        dayCell: 'bg-calendar__day',
        inactive: 'inactive',
        day: 'bg-calendar__day-date',
        currentDay: 'current_day'
    };
    const eventClases = {
        event: 'bg-calendar__event',
        task: 'bg-calendar__task',
        reminder: 'bg-calendar__reminder',
    };
    
    const instance = {
        
        render() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const date = new Date(year,month);

            let content = '';

            for (let i = date.getDay(); i > 0; i--) {
                let date = new Date(year, month, 0);
                date.setDate(date.getDate() - i + 1);
                const day = date.getDate();

                content += 
                    `<div 
                        class="${main.dayCell} ${main.inactive}"
                        data-date="${this.getDateStr(date)}"
                    >
                        <div class="${main.day}">${day}</div>
                    </div>`;
            }
        
            while (date.getMonth() === month) {
                const day = date.getDate();              
                
                let isCurrentDay;
                const currentDateStr = this.getDateStr(new Date());
                const dateStr = this.getDateStr(date); 
                if (currentDateStr === dateStr) {
                    isCurrentDay = true;
                }
                
                if (eventList.hasOwnProperty(dateStr)) {

                    content += 
                    `<div 
                        class="${main.dayCell}"
                        data-date="${dateStr}"
                    >
                        <div class="${main.day} ${isCurrentDay ? main.currentDay : ''}">${day}</div>
                        ${this.createEventCell(dateStr)}
                    </div>`;
                } else {
                    content += 
                    `<div 
                        class="${main.dayCell}"
                        data-date="${this.getDateStr(date)}"
                    >
                        <div class="${main.day} ${isCurrentDay ? main.currentDay : ''}">${day}</div>
                    </div>`;
                }

                
                date.setDate(date.getDate() + 1);
            }
        
            if (date.getDay() !== 0) {
        
                for (let i = date.getDay(); i < 7; i++) {
                    let j = 1;
                    const day = date.getDate();
                    date.setDate(date.getDate() + j);
                    
                    content += 
                        `<div 
                            class="${main.dayCell} ${main.inactive}"
                            data-date=""
                        >
                            <div class="${main.day}">${day}</div>
                        </div>`;

                    j++;
                }
            }
        
            document.querySelector('.bg-calendar__row--days').innerHTML = content;
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
        get dateStr() {
            return `${currentDate.getMonth()}-${currentDate.getFullYear()}`
        },
        createEventCell(data) {
            let content = '';


            for (let key in eventList[data]) {
                const clas = eventList[data][key].event;

                content += `
                    <div class="${eventClases[clas]}">
                        ${eventList[data][key].title}
                    </div>
                `
            }

            return content;
        }
    }

    calendar.addEventListener('click', e => {
        const target = e.target.classList[0];
        switch (target) {
            case main.dayCell: 
                eventForm.show(e);
                break;
        }
        if (target === eventClases.event || target === eventClases.task || target === eventClases.reminder) {
            eventProperty.show(e);
            // eventForm.show(e);
            // eventForm.change(e);
        }
    });

    return instance;
}

function EventForm() {
    const form = document.querySelector('.new-event');
    const formHeader = document.querySelector('.new-event__header');
    const buttonsList = document.querySelectorAll('#new-event__btn');
    const input = document.querySelector('.new-event__input-title');
    const description = document.querySelector('.new-event__input-text');

    const instance  = {
        show(event) {
            const formWidth = 540;
            const formHeight = 400;
            
            form.classList.add('new-event--opened');

            dataAtribute = event.target.dataset.date ||  event.target.parentElement.dataset.date; 
            
            setFormCoords(event, formWidth, formHeight, form)
        },
        close() {
            buttonsList[0].checked = 'checked';
            input.value = '';    
            description.value = '';
            form.classList.remove('new-event--opened');
        },
        save() {
            const eventTitle = input.value;
            const eventDescription = description.value;
            const eventType = this.checkEventType();
            
            if(!eventTitle) {return};

            if(!eventList[dataAtribute]) {
                const newEvent = {};
                
                eventList[dataAtribute] = newEvent;
                newEvent[eventTitle] = createObj();

            } else if(!eventList[dataAtribute][eventTitle]) {  
                eventList[dataAtribute][eventTitle] = createObj();
            } else  if (eventList[dataAtribute][eventTitle]) {
               let newEvent = {};
                
                newEvent = createObj();
                eventList[dataAtribute][eventTitle] = newEvent;
            }

            saveEventList();

            this.close();
            calendarMain.render();

            function createObj() {
                const details = {};   
                
                details.title = eventTitle;
                details.description = eventDescription;
                details.event = eventType;

                return details;
            }
        },
        checkEventType() {
            let eventType;

            buttonsList.forEach(elem => {
                if(elem.checked) { eventType = elem.dataset.event_btn }
            });

            return eventType;
        },
        change(event) {
            instance.show(event);
            const data = event.target.parentElement.dataset.date;
            const name = event.target.innerText;

            input.value = eventList[data][name].title;
            description.value = eventList[data][name].description;
            buttonsList.forEach(el => {
                if(el.dataset.event_btn === eventList[data][name].event) {
                    el.checked = 'checked';
                }
            });

        }
    }

    form.addEventListener('click', e => {
        const button = e.target.classList[0];

        switch (button) {
            case 'new-event__close': 
                return instance.close();  
            case 'new-event__save':
                return instance.save();
        }
    });




    

    return instance;
}

function EventProperty() {
    const form = document.querySelector('.event-property');
    const eventTitle = document.querySelector('.event-property__title');
    const eventText = document.querySelector('.event-property__text');
    const eventDate = document.querySelector('.event-property__date');
    const weekDay = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
    const months = ['Січня', 'Лютого', 'Березня', 'Квітня', 'Травня', 'Червня', 'Липня', 'Серпня', 'Вересня', 'Жовтня', 'Листопада', 'Грудня'];
    let atribute;
    let eventCopy;

    const instance = {
        show(event) {
            eventCopy = event;
            const formWidth = 450;
            const formHeight = 150;
            
            const name = event.target.innerText;
            const data = event.target.parentElement.dataset.date;
            const description = eventList[data][name].description;
            atribute = data;
            
            eventTitle.innerText = name;
            eventText.innerText = description;
            eventDate.innerText = instance.getDate(data);
            form.classList.add('event-property--opened');
            setFormCoords(event, formWidth, formHeight, form) ;
            
        },
        close() {
            form.classList.remove('event-property--opened');
        },
        remove() {
            const obj = eventTitle.innerText;
            delete eventList[atribute][obj];
            
            if (isEmpty(eventList[atribute])) {
                delete eventList[atribute];
            }

            saveEventList();
            instance.close();
            calendarMain.render();
        },
        getDate(data) {
            const newDate = new Date(data);
            let str = '';

            str = `${weekDay[newDate.getDay()]}, ${newDate.getDate()} ${months[newDate.getMonth()]}`;
            
            return str;
        } 
    }

    form.addEventListener('click', e => {
        const button = e.target.classList[0];

        switch (button) {
            case 'close':
                instance.close(); 
                break;
            case 'delete':
                instance.remove();
                break;
            case 'edit':
                instance.close(); 
                eventForm.change(eventCopy);
                break;

        }

    });

    return instance;
}

