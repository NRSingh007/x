// Select all elements with data-toggle="popover" in the document
$('[data-toggle="popover"]').popover();

// Select a specified element

function showPopover(data){
    // console.log(data);
    var body = document.createElement(`ul`);
    $(body).addClass('list-group ');

    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var day = days[new Date().getDay()].toLowerCase();
    Object.keys(data).forEach(key => {
        var list = `<li class=" list-group-item text-capitalize m-0 p-0 border-0">`;
        
        if ( data[key].closed || data[key].closed == true ) {
            if (day == key.toLowerCase() ) {
                list = list + `<span style="width: 100px; display:inline-block;"><b style="font-size: small">${key}</span> Closed </b></li>`;
            } else {
                list = list + `<span style="width: 100px; display:inline-block;">${key}</span> Closed </li>`;
            }
        } else {
            if (day == key.toLowerCase() ) {
                list = list + `<span style="width: 100px; display:inline-block;"><b style="font-size: small">${key}</span> ${data[key].open} - ${data[key].close} </b></li>`;
            } else {
                list = list + `<span style="width: 100px; display:inline-block;">${key}</span> ${data[key].open} - ${data[key].close} </li>`;
            }
        }
        $(body).append(list);
    });
    var options = {
        placement: 'bottom',
        html: true,
        content: body,
        animation: true,
        offset: '100px',
        
    };
    $('#timingsId').popover(options);

}

$('html').on('click', function(e) {
    if (typeof $(e.target).data('original-title') == 'undefined' &&
       !$(e.target).parents().is('.popover.in')) {
      $('[data-original-title]').popover('hide');
    }
  });