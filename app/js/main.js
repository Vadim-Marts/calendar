/* Header buttons */

const   togleSidebarButton = document.querySelector('.top-nav__main-menu-btn'),
        arrowButtons = document.querySelector('.arrow-btns'),
        currentDate = new Date(),
        monthsArrArr = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад',  'Грудень'];
        
togleSidebarButton.addEventListener('click', togleSidebar);

createSmallCalendar(currentDate);



arrowButtons.addEventListener('click', (event) => {
    const button = event.target.offsetParent.classList.value;

    switch (button) {
        case 'prev-btn' : 
            setPrevMonth(currentDate);
            break;
        case 'next-btn' : 
            setNextMonth(currentDate);
            break;
    }       
    
});





function togleSidebar () {
    const sidebar = document.querySelector('.sidebar');

    sidebar.classList.toggle('sidebar--hide');
}


function getMonth(argDate) { 
    let month;
    
    month = argDate.getMonth();
    return month;
}
function getYear(argDate) { argDate
    let year;
    
    year = argDate.getFullYear();
    return year;
}

function createSmallCalendar (argDate) {
    const monthName = document.querySelector('.current__month'),
            yearName = document.querySelector('.current__year'),
            smallCalendarDays = document.querySelector('.sm-calendar__days'),
            smallCalendarElemDayClass = 'sm-calendar__day',
            dayNotThisMonthClass = 'dayNotThisMonth',
            currentDayClass = 'current_day';

    let year = getYear(argDate);
    let month = getMonth(argDate);
    let date = new Date(year, month);
    let content = '';
    let arr = [];

    for (let i = 0; i < date.getDay(); i++) {
        let date = new Date(year, month, 1);
        date.setDate(date.getDate() - i -1);
        
        content = `<div class="${smallCalendarElemDayClass} ${dayNotThisMonthClass}">${date.getDate()}</div>`;

        arr.push(content);
    }
    content = arr.reverse().join('');


    while (date.getMonth() === month) {
        const dateString = date.toLocaleDateString().split(",")[0];
        const currentDateString = currentDate.toLocaleDateString().split(",")[0];
        if (dateString === currentDateString) {
            content += `<div class="${smallCalendarElemDayClass} ${currentDayClass}"> ${date.getDate()}</div>`;
            date.setDate(date.getDate() + 1);
        }
        content += `<div class="${smallCalendarElemDayClass}"> ${date.getDate()}</div>`;
        date.setDate(date.getDate() + 1);
    }

    if (date.getDate() !== 0) {
        for (let i = date.getDay(); i < 7; i++) {
            let j = 1;
            let dates = new Date(year, month + 1, date.getDate());
            date.setDate(date.getDate() + j);
            
            content += `<div class="${smallCalendarElemDayClass} ${dayNotThisMonthClass}">${dates.getDate()}</div>`;
            j++;
        }
    }

    smallCalendarDays.innerHTML = content;
    monthName.innerText = monthsArr[month]; 
    yearName.innerText = year;

} 



{
    let i = 1;

    function setNextMonth (argDate) {
        let year = getYear(argDate);
        let month = getMonth(argDate);
        let newDate = new Date(year, month);
        
        newDate.setMonth(newDate.getMonth() + i);
        i++;

        createSmallCalendar(newDate)
    }

    function setPrevMonth (argDate) {
        let year = getYear(argDate);
        let month = getMonth(argDate);
        let newDate = new Date(year, month);
        
        --i;
        newDate.setMonth(newDate.getMonth() + i - 1);

        createSmallCalendar(newDate);
    }
}


















