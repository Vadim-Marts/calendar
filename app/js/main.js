/* Header buttons */

const   togleSidebarButton = document.querySelector('.top-nav__main-menu-btn'),
        arrowButtons = document.querySelector('.arrow-btns'),
        currentDate = new Date(),
        monthsArr = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад',  'Грудень'];
        
togleSidebarButton.addEventListener('click', togleSidebar);

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



function togleSidebar () {
    const sidebar = document.querySelector('.sidebar');

    sidebar.classList.toggle('sidebar--hide');
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
            smallCalendarDays = document.querySelector('.sm-calendar__days'),
            cellClasses = {
                default : 'sm-calendar__day',
                inactive : 'dayNotThisMonth',
                current : 'current_day'
            };

    let year = argDate.getFullYear();
    let month = argDate.getMonth();
    let date = new Date(year, month);
    let content = '';

    for (let i = date.getDay(); i > 0; i--) {
        let date = new Date(year, month, 0)
               
        content += `<div class="${cellClasses.default} ${cellClasses.inactive}">${ date.getDate() - i + 1}</div>`;
    }

    while (date.getMonth() === month) {
        let arr1 = [];
        const dateString = arr1.join(arr1.push(date.getFullYear() + '' + date.getMonth() + date.getDate()));
        arr1 = [];
        const currentDateString = arr1.join(arr1.push(currentDate.getFullYear() + '' + currentDate.getMonth() + currentDate.getDate()));

        if (dateString === currentDateString) {
            content += `<div class="${cellClasses.default} ${cellClasses.current}"> ${date.getDate()}</div>`;
            date.setDate(date.getDate() + 1);
        }
        content += `<div class="${cellClasses.default}"> ${date.getDate()}</div>`;
        date.setDate(date.getDate() + 1);
    }

    if (date.getDate() !== 0) {
        for (let i = date.getDay(); i < 7; i++) {
            let j = 1;
            let dates = new Date(year, month + 1, date.getDate());
            date.setDate(date.getDate() + j);
            
            content += `<div class="${cellClasses.default} ${cellClasses.inactive}">${dates.getDate()}</div>`;
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
    const calendarCells = document.querySelectorAll('.bg-calendar__day');

    let year = argDate.getFullYear();
    let month = argDate.getMonth();
    let date = new Date(year, month);
    let daysArr = [];

    for (let i = date.getDay(); i > 0; i--) {
        let date = new Date(year, month, 0)
        daysArr.push(date.getDate() - i + 1);
    }

    while (date.getMonth() === month) {

        daysArr.push(date.getDate());
        date.setDate(date.getDate() + 1);
    }

    if (date.getDate() !== 0) {
        for (let i = calendarCells.length - daysArr.length; i > 0; i--) {
            let j = 1;
            daysArr.push(date.getDate());
            date.setDate(date.getDate() + j);
            j++;
        }
    }

    for (let i = 0; i < daysArr.length; i++){
        calendarCells[i].innerText = daysArr[i];
    }
 
}



















