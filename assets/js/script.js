$(function () {
  // display the current day and date in the hero
  const currentDayEl = $('#currentDay');
  currentDayEl.text('Today is ' + moment().format('dddd, MMM Do, YYYY'));

  // get the current hour as of page load
  // let currentHour = moment().format('H');
  let currentHour = 12;

  // default array of time rows
  let defaultHoursArr = [
    { label: '9AM', mil: 9, data: '' },
    { label: '10AM', mil: 10, data: '' },
    { label: '11AM', mil: 11, data: '' },
    { label: '12PM', mil: 12, data: 'Call the boss.' },
    { label: '1PM', mil: 13, data: '' },
    { label: '2PM', mil: 14, data: '' },
    { label: '3PM', mil: 15, data: '' },
    { label: '4PM', mil: 16, data: '' },
    { label: '5PM', mil: 17, data: '' },
  ];

  // get hours from local storage if exists, else create it
  let hours = [];
  hours = localStorage.hours
    ? (hours = JSON.parse(localStorage.hours))
    : localStorage.setItem('hours', JSON.stringify(defaultHoursArr));

  // for each hour in the standard work day, create a row
  function renderHours() {
    for (let i = 0; i < hours.length; i++) {
      // create the entire row first
      const hourRowEl = $('<div>').addClass('row justify-content-center');

      // create the left-column which displays the hour
      const timeRowEl = $('<div>')
        .addClass('col-2 col-md-1 p-3 border-top')
        .text(hours[i].label);

      // create the middle-column which displays the user input
      const entryRowEl = $('<div>')
        .addClass('col-7 col-md-8 p-3 border hour-row')
        // did the hour pass, if so, give bg-secondary
        // is the hour current, if so, give bg-danger
        // is the hour yet to pass, if so, give bg-success
        .addClass(
          hours[i].mil == currentHour
            ? 'bg-success'
            : hours[i].mil < currentHour
            ? 'bg-secondary'
            : 'bg-danger'
        )
        .attr('id', 'hour' + hours[i].mil);
      const entryRowPEl = $('<p>').text(hours[i].data);
      entryRowEl.append(entryRowPEl);

      // create the right-column which displays the edit btn
      const editRowEl = $('<div>').addClass(
        'col-1 p-3 border rounded-right bg-info d-flex align-items-center justify-content-center'
      );
      const editButtonEl = $('<i>').addClass('fas fa-edit');
      editRowEl.append(editButtonEl);
      editRowEl.on('click', editButtonHandler);

      // add it all together
      hourRowEl.append(timeRowEl, entryRowEl, editRowEl);

      // throw the finished row onto the container
      $('.container').append(hourRowEl);
    }
  }

  function editButtonHandler(e) {
    $('#hour12').replaceWith('<input>').addClass('bg-green');
  }

  function saveHours() {
    localStorage.setItem('hours', JSON.stringify(hours));
  }

  renderHours();

  $('.hour-row').on('click', 'p', function () {
    console.log('clicked');
    let currData = $(this).text().trim();
    let dataInput = $('<textarea>').val(currData);
    $(this).replaceWith(dataInput);
    dataInput.trigger('focus');
  });

  $('.hour-row').on('blur', 'textarea', function () {
    console.log('blurred');
    let newData = $(this).val().trim();
    let dataIndex = $(this).parent().attr('id').replace('hour', '') - 9;
    hours[dataIndex].data = newData;
    saveHours();
    let newEntryRowPEl = $('<p>').text(newData);
    $(this).replaceWith(newEntryRowPEl);
  });
});
