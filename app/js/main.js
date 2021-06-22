/* Header buttons */

const   mainCalendarRow = document.querySelector('.bg-calendar__row--days');
        togleSidebarButton = document.querySelector('.top-nav__main-menu-btn'),
        addNewEventBtn = document.querySelector('.create-btn'),
        newEventForm = document.querySelector('.new-event'),
        arrowButtons = document.querySelector('.arrow-btns'),
        currentDate = new Date(),
        monthsArr = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад',  'Грудень'];
        cellClasses = {
            smCalDay : 'sm-calendar__day',
            mainCalDay : 'bg-calendar__day',
            inactive : 'dayNotThisMonth',
            current : 'current_day'
        };
        datesList = {};
let dateAtributeMainCal = '';


togleSidebarButton.addEventListener('click', togleSidebar);
addNewEventBtn.addEventListener('click', showNewEventForm);
newEventForm.addEventListener('click', event => checkButtonNewEventForm(event));

createSmallCalendar(currentDate);
createMainCalendar(currentDate);

arrowButtons.addEventListener('click', (event) => {
    const button = event.target.offsetParent.classList.value;

    switch (button) {
        case 'prev-btn' : 
            changeMonth();
            break;
        case 'next-btn' : 
            changeMonth(true);
            break;
    }       
    
});
mainCalendarRow.addEventListener('click', event => {
    const className = event.target.classList.value;
    const dateAtribute = event.target.dataset.date;

    dateAtributeMainCal = dateAtribute;

    if (className === "bg-calendar__day") {
        showNewEventForm(); 
        
    }
});



function togleSidebar () {
    const sidebar = document.querySelector('.sidebar');

    sidebar.classList.toggle('sidebar--hide');
}


{/////////

    // const newEvent = document.querySelector('.new-event');
    // const closeBtn = 'new-event__close';
    // const saveEvent = 'new-event__save';
    
    // function addNewEvent(dateAtribute) {
    //     let atribute = dateAtribute;
    //     newEvent.addEventListener('click', event => {
    //         const className = event.target.classList.value;
    
    //         if (className === closeBtn) {
    //             closeNewEvent();
    //         } else if (className === saveEvent){
    //             saveNewEvent(atribute);
    //             createMainCalendar(currentDate);
    //         }
    //     });
    //     atribute = null;
    // }
    // function openNewEvent() {
    //     newEvent.classList.add('new-event--opened');
    // }
    // function closeNewEvent() {
    //     newEvent.classList.remove('new-event--opened');
    // }
    // function saveNewEvent(atribute) {
    //     let newEventName = document.querySelector('.new-event__input-text').value;

    //     if(!datesList[atribute]) {
    //         const arr = [];
    //         const newEvent = {};
            
    //         datesList[atribute] = newEvent;
    //         arr.push(newEventName);
    //         newEvent.events = arr;
    //     } else {
    //         datesList[atribute].events.push(newEventName);
    //     }
        
    //     closeNewEvent();
    // }

//////////
}

{
    let i = 1;

    function changeMonth (isNext) {
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();
        let newDate = new Date(year, month);

        isNext ? i++ : i--;

        newDate.setMonth(newDate.getMonth() + i - 1);

        createSmallCalendar(newDate);
        createMainCalendar(newDate);
    }

}


function createSmallCalendar (argDate) {
    const monthName = document.querySelectorAll('.current__month'),
            yearName = document.querySelectorAll('.current__year'),
            smallCalendarDays = document.querySelector('.sm-calendar__days');

    let year = argDate.getFullYear();
    let month = argDate.getMonth();
    let date = new Date(year, month);
    let content = '';
    
    for (let i = date.getDay(); i > 0; i--) {
        let date = new Date(year, month, 0);
        let day = date.getDate() - i + 1;
        let arr = [];
        const dataAtribute = arr.join(arr.push(day + '/' + month + '/' + year));
               
        content += 
        `<div 
            class="${cellClasses.smCalDay} ${cellClasses.inactive}"
            data-date ="${dataAtribute}"
        >${day}</div>`;
    }

    while (date.getMonth() === month) {
        let arr = [];
        const dateString = arr.join(arr.push(date.getFullYear() + '' + date.getMonth() + date.getDate()));
        arr = [];
        const currentDateString = arr.join(arr.push(currentDate.getFullYear() + '' + currentDate.getMonth() + currentDate.getDate()));


        if (dateString === currentDateString) {
            content += `<div class="${cellClasses.smCalDay} ${cellClasses.current}"> ${date.getDate()}</div>`;
            date.setDate(date.getDate() + 1);
        }
        content += `<div class="${cellClasses.smCalDay}"> ${date.getDate()}</div>`;
        date.setDate(date.getDate() + 1);
    }

    if (date.getDate() !== 0) {
        for (let i = date.getDay(); i < 7; i++) {
            let j = 1;
            let dates = new Date(year, month + 1, date.getDate());
            date.setDate(date.getDate() + j);
            
            content += `<div class="${cellClasses.smCalDay} ${cellClasses.inactive}">${dates.getDate()}</div>`;
            j++;
        }
    }

    smallCalendarDays.innerHTML = content;

    for (let i = 0; i < 2; i++) {
        monthName[i].innerText = monthsArr[month]; 
        yearName[i].innerText = year;
    }

} 

function createMainCalendar (argDate) {
    let year = argDate.getFullYear();
    let month = argDate.getMonth();
    let date = new Date(year, month);
    let content = '';

    for (let i = date.getDay(); i > 0; i--) {
        let date = new Date(year, month, 0);
        const day = date.getDate() - i + 1;
        const arr = []; 
        const dataAtribute = arr.join(arr.push(day + '/' + (month - 1) + '/' + year));

        if (datesList.hasOwnProperty(dataAtribute)){
            content += 
                `<div 
                    class="${cellClasses.mainCalDay} ${cellClasses.inactive}"
                    data-date="${dataAtribute}"
                >
                    <div class="bg-calendar__day-date">${day}</div>
                    <div class="bg-calendar__event">
                        ${datesList[dataAtribute][events]}
                    </div>
                </div>`;
        } else {
            content += 
                `<div 
                    class="${cellClasses.mainCalDay} ${cellClasses.inactive}"
                    data-date="${dataAtribute}"
                >
                    <div class="bg-calendar__day-date">${day}</div>
                </div>`;
        }
    }

    while (date.getMonth() === month) {
        const day = date.getDate();
        const arr = [];
        const dataAtribute = arr.join(arr.push(day + '/' + month + '/' + year));
        
        if (datesList.hasOwnProperty(dataAtribute)){
            content += 
                `<div 
                    class="${cellClasses.mainCalDay}"
                    data-date="${dataAtribute}"
                >
                    <div class="bg-calendar__day-date">${day}</div>
                    ${checkEventTypeEvent(datesList[dataAtribute].events) || ''}
                    ${checkEventTypeTask(datesList[dataAtribute].tasks) || ''}
                    ${checkEventTypeReminder(datesList[dataAtribute].reminders) || ''}
                </div>`;
        } else {
            content += 
                `<div 
                    class="${cellClasses.mainCalDay}"
                    data-date="${dataAtribute}"
                >
                    <div class="bg-calendar__day-date">${day}</div> 
                </div>`;
        }
        date.setDate(date.getDate() + 1);
    }

    if (date.getDate() !== 0) {

        for (let i = date.getDay(); i < 14; i++) {
            let j = 1;
            // let dates = new Date(year, month + 1, date.getDate());
            const day = date.getDate();
            const arr = [];
            const dataAtribute = arr.join(arr.push(day + '/' + (month + 1) + '/' + year));
            date.setDate(date.getDate() + j);
            
            if (datesList.hasOwnProperty(dataAtribute)){
                content += 
                    `<div 
                        class="${cellClasses.mainCalDay} ${cellClasses.inactive}"
                        data-date="${dataAtribute}"
                    >
                    <div class="bg-calendar__day-date">${day}</div>
                        <div class="bg-calendar__event">
                            ${datesList[dataAtribute]}
                        </div>
                    </div>`;
            } else {
                content += 
                    `<div 
                        class="${cellClasses.mainCalDay} ${cellClasses.inactive}"
                        data-date="${dataAtribute}"
                    >
                    <div class="bg-calendar__day-date">${day}</div>
                    </div>`;
            }
            j++;
        }
    }

    mainCalendarRow.innerHTML = content;
    
}

function checkEventTypeEvent(eventType) {
    const arr = eventType;
    let content = '';
    
    if(arr) {
        for (let i = 0; i < arr.length; i++) {
            content += `
                <div class="bg-calendar__event">
                    ${arr[i]}
                </div>
            `
        }
        return content;
    }
}
function checkEventTypeTask(eventType) {
    const arr = eventType;
    let content = '';
    
    if(arr) {
        for (let i = 0; i < arr.length; i++) {
            content += `
                <div class="bg-calendar__task">
                    ${arr[i]}
                </div>
            `
        }
        return content;
    }
}
function checkEventTypeReminder(eventType) {
    const arr = eventType;
    let content = '';
    
    if(arr) {
        for (let i = 0; i < arr.length; i++) {
            content += `
                <div class="bg-calendar__reminder">
                    ${arr[i]}
                </div>
            `
        }
        return content;
    }
}



function showNewEventForm() {
    newEventForm.classList.add('new-event--opened');
}
function hideNewEventForm() {
    newEventForm.classList.remove('new-event--opened');
}
function checkNewEventFormRadio() {
    const buttonsList = document.querySelectorAll('#new-event__btn');
    let eventType;

    buttonsList.forEach(elem => {
        if(elem.checked) { eventType = elem.dataset.event_btn }
    });

    return eventType;
}
function getNewEventFormFild() {
    const newEventName = document.querySelector('.new-event__input-text').value;
    const eventType = checkNewEventFormRadio();
    let atribute = dateAtributeMainCal;

    if (!newEventName) {return};    

    if(!datesList[atribute]) {
        const arr = [];
        const newEvent = {};
        
        datesList[atribute] = newEvent;
        arr.push(newEventName);
        newEvent[eventType] = arr;
    } else if(!datesList[atribute][eventType]) {  
        const arr = [];

        arr.push(newEventName);
        datesList[atribute][eventType] = arr;
    } else {
        datesList[atribute][eventType].push(newEventName);
    }
}

function checkButtonNewEventForm(eventArg) {
    const eventClass = eventArg.target.classList.value;
    const closeBtn = 'new-event__close';
    const saveEvent = 'new-event__save';

    if (eventClass === closeBtn)  {
        hideNewEventForm ();
    } else if (eventClass === saveEvent) {
        getNewEventFormFild();
        hideNewEventForm();
        createMainCalendar(currentDate);
    }
}









