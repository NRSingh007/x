
const rootDomain = `${location.protocol}//${window.location.hostname}${location.port ? ':' + location.port : ''}`;


$(document).ready(() => {
    $('.collapsed i').removeClass();
    // collapse shown button when click on non-accordion button in left sidebar
    $('.non-accordion ').click(function (e) {
        $('.non-accordion ').removeClass('btn-active active');
        $('.list-group-item a').removeClass('btn-active');
        $(this).addClass('btn-active ');
        $('.collapse').addClass('collapsing').delay(500).removeClass('collapsing show').delay(300);;
    });

    // add active class to collapsible list items
    $('.list-group-item a').click(function (e) {

        $('.non-accordion ').removeClass('btn-active active');
        $('.list-group-item a').removeClass('btn-active');
        $(this).addClass('btn-active');
    });

    $('.collapsed').click(function (e) {

        //     $('.collapsed i').removeClass();
        //     $('.collapsed i').addClass('fal fa-angle-down'); 

        // console.log('clicked',$(this).children('i').hasClass('fa-angle-down'))
        // if ($(this).children('i').hasClass('fa-angle-down') ) {
        //     $(this).children('i').removeClass().addClass('fal fa-angle-up')
        // } else {
        //     $(this).children('i').removeClass().addClass('fal fa-angle-down')
        // }

    });

});

function getCustomDate(jsDate) {
    var dd = jsDate.getDate() < 10 ? '0' + jsDate.getDate() : jsDate.getDate();
    var mm = jsDate.getMonth() + 1 < 10 ? '0' + (jsDate.getMonth() + 1) : (jsDate.getMonth() + 1);
    var yyyy = jsDate.getFullYear();
    var hr = jsDate.getHours() + 1 < 10 ? '0' + (jsDate.getHours() + 1) : (jsDate.getHours() + 1);
    var min = jsDate.getMinutes() + 1 < 10 ? '0' + (jsDate.getMinutes() + 1) : (jsDate.getMinutes() + 1);
    var sec = jsDate.getSeconds() + 1 < 10 ? '0' + (jsDate.getSeconds() + 1) : (jsDate.getSeconds() + 1);
    var period = hr <= 12 ? 'AM' : 'PM';
    var customDate = dd + '/' + mm + '/' + yyyy + ' ' + hr + ':' + min + ':' + sec + ' ' + period;
    return customDate;
}


function showSuccessAlert(message) {
    $(".alert-container").show();
    $(".alert-success .message").html(message);
    $(".alert-success").show();

    setTimeout(() => {
        $(".alert-container").hide();
        $(".alert-success").hide();
    }, 1500);

}

function showDangerAlert(message) {
    $(".alert-container").show();
    $(".alert-danger .message").html(message);
    $(".alert-danger").show();
    setTimeout(() => {
        $(".alert-container").hide();
        $(".alert-danger").hide();
    }, 1500);
}

function showInfoAlert(message) {
    $(".alert-container").show();
    $(".alert-info .message").html(message);
    $(".alert-info").show();
    setTimeout(() => {
        $(".alert-container").hide();
        $(".alert-info").hide();
    }, 1500);
}

