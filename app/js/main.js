/* Header buttons */

const   togleSidebarButton = document.querySelector('.top-nav__main-menu-btn'),
        arrowButtons = document.querySelector('.arrow-btns'),
        smallCalendarDays = document.querySelector('.sm-calendar__days'),
        currentDate = new Date();


togleSidebarButton.addEventListener('click', togleSidebar);

createCalendarDays(smallCalendarDays, currentDate);

arrowButtons.addEventListener('click', (event) => {
    switch (event.target.offsetParent.classList.value) {
        case 'prev-btn' : 
            console.log('prev');
            break;
        case 'next-btn' : 
            console.log('next');
            break;
    }       
    
})

















function togleSidebar () {
    sidebar = document.querySelector('.sidebar');

    sidebar.classList.toggle('sidebar--hide');
}

function getCurrentMonth(currentDate) { 
    let currentMonth;
    
    currentMonth = currentDate.getMonth();
    return currentMonth;
}
function getCurrentYear(currentDate) { 
    let currentYear;
    
    currentYear = currentDate.getFullYear();
    return currentYear;
}

function createCalendarDays (elem, currentDate) {
    let year = getCurrentYear(currentDate);
    let month = getCurrentMonth(currentDate);
    let date = new Date(year, month);
    let content = '';
    let arr = [];

    for (let i = 0; i < date.getDay(); i++) {
        let date = new Date(year, month, 1);
        date.setDate(date.getDate() - i -1);
        
        content = `<div class="sm-calendar__day dayNotThisMonth">${date.getDate()}</div>`;

        arr.push(content);
    }
    content = arr.reverse().join('');


    while (date.getMonth() === month) {
        content += `<div class="sm-calendar__day">${date.getDate()}</div>`;

        date.setDate(date.getDate() + 1);
    }

    if (date.getDate() !== 0) {
        for (let i = date.getDay(); i < 7; i++) {
            let j = 1;
            let dates = new Date(year, month + 1, date.getDate());
            date.setDate(date.getDate() + j);
            
            content += `<div class="sm-calendar__day dayNotThisMonth">${dates.getDate()}</div>`;
            j++;
        }
    }

    elem.innerHTML = content;
} 

function setNextMonth (createCalendarDays, currentDate) {
    const elem = smallCalendarDays;
    let year = getCurrentYear(currentDate);
    let month = getCurrentMonth(currentDate);
    let newDate = new Date();

    createCalendarDays(elem, currentDate)
}



















