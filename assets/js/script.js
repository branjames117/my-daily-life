$(function () {
  // display the current day and date in the hero
  const currentDayEl = $('#currentDay');
  currentDayEl.text(moment().format('dddd, MMM Do, YYYY'));
  // display the current time in the hero and update it every second
  const currentTimeEl = $('#currentTime');
  currentTimeEl.text(moment().format('h:mm:ss a'));
  setInterval(() => {
    currentTimeEl.text(moment().format('h:mm:ss a'));
  }, 1000);

  // get the current hour as of page load
  let currentHour = moment().format('H');

  // default array of time rows with no user input
  const defaultHoursArr = [
    { label: '9AM', mil: 9, data: '' },
    { label: '10AM', mil: 10, data: '' },
    { label: '11AM', mil: 11, data: '' },
    { label: '12PM', mil: 12, data: '' },
    { label: '1PM', mil: 13, data: '' },
    { label: '2PM', mil: 14, data: '' },
    { label: '3PM', mil: 15, data: '' },
    { label: '4PM', mil: 16, data: '' },
    { label: '5PM', mil: 17, data: '' },
  ];

  // get hours from local storage if exists, else create it
  let hours = [];
  if (!localStorage.hours) {
    localStorage.setItem('hours', JSON.stringify(defaultHoursArr));
  }
  hours = JSON.parse(localStorage.hours);

  // for each hour in the standard work day, create a row, using data from the hours array pulled from localstorage
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
          ? 'present'
          : hours[i].mil < currentHour
          ? 'past'
          : 'future'
      )
      .attr('id', 'hour' + hours[i].mil);
    const entryRowPEl = $('<p>').text(hours[i].data);
    entryRowEl.append(entryRowPEl);

    // create the right-column which displays the save btn
    const saveRowEl = $('<div>')
      .addClass(
        'col-1 p-3 border rounded-right bg-info d-flex align-items-center justify-content-center hour-save'
      )
      .attr('id', 'save' + hours[i].mil);
    const saveButtonEl = $('<i>').addClass('fas fa-save');
    saveRowEl.append(saveButtonEl);

    // add it all together
    hourRowEl.append(timeRowEl, entryRowEl, saveRowEl);

    // throw the finished row onto the container
    $('.container').append(hourRowEl);
  }

  // update local storage any time the user saves new data
  function saveHours(e) {
    const hour = e.currentTarget.id.replace('save', '');
    const index = hour - 9;
    const value = $('#hour' + hour + ' p').text();
    // update specific item in array with new textarea value
    hours[index].data = value;
    localStorage.setItem('hours', JSON.stringify(hours));
  }

  // click listener to the text block in each row to enable user editing
  $('.hour-row').on('click', 'p', function () {
    let currData = $(this).text().trim();
    let dataInput = $('<textarea>').val(currData);
    $(this).replaceWith(dataInput);
    dataInput.trigger('focus');
  });

  // blur listener
  $('.hour-row').on('blur', 'textarea', function () {
    let newData = $(this).val().trim();
    let newEntryRowPEl = $('<p>').text(newData);
    $(this).replaceWith(newEntryRowPEl);
  });

  // click listener for save buttons
  $('.hour-save').on('click', saveHours);

  // display random quote on page
  $('#quote')
    .text(
      [
        '"Procrastination is the foundation of all disasters." - Pandora Poikilos',
        '"You can\'t make up for lost time. You can only do better in the future." - Ashley Ormon',
        '"One always has time enough, if one will apply it well." - Johann Wolfgang von Goethe',
        '"The secret of success in life is time rightly used." - Sivananda Saraswati',
        '"All we have to decide is what to do with the time that is given us." - Gandalf the Grey',
        '"Time flies like an arrow; fruit flies like a banana." - Anthony G. Oettinger',
      ][Math.floor(Math.random() * 6)]
    )
    .addClass('container text-center py-5');

  // audit hours, update colors accordingly
  function auditHours() {
    // update day in case the day changes
    currentDayEl.text(moment().format('dddd, MMM Do, YYYY'));
    // grab the new current hour
    currentHour = moment().format('H');
    // for each row, compare hour to current and adjust class list accordingly
    $('.hour-row').each(function () {
      let hourOfRow = $(this).attr('id').replace('hour', '') - 0;
      $(this).attr(
        'class',
        'col-7 col-md-8 p-3 border hour-row ' +
          (hourOfRow == currentHour
            ? 'present'
            : hourOfRow < currentHour
            ? 'past'
            : 'future')
      );
    });
  }

  // refresh the time block colors by calling auditHours() every minute
  setInterval(auditHours, 1000 * 60);
});
