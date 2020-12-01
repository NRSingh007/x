$(document).mouseup(function (e) {

    var ddl_bold_from, ddl_bold_to;
    // Timings
    $('#from_timings').on('click', function (e) {
        $('#from_timings').siblings('#dd_list_from').removeClass('hidden').addClass('bor_t_ligthblue');

        $(this).siblings('#dd_list_from').children('li').on('click', function (e) {
            $('#from_timings').val(e.target.innerHTML);
            ddl_bold_from = e.target;
            $(e.target).addClass('ddl_bold').siblings().removeClass('ddl_bold');
            $('#from_timings').siblings('#dd_list_from').addClass('hidden').removeClass('bor_t_ligthblue');

        });

    });

    var dd_list_from = $('#dd_list_from');
    if (!dd_list_from.is(e.target) && dd_list_from.has(e.target).length === 0) {
        $('#dd_list_from').addClass('hidden');
    }

    $('#to_timings').on('click', function (e) {
        $('#to_timings').siblings('#dd_list_to').removeClass('hidden').addClass('bor_t_ligthblue');
        $(this).siblings('#dd_list_to').children('li').on('click', function (e) {
            $('#to_timings').val(e.target.innerHTML).addClass('ddl_bold');
            ddl_bold_to = e.target;
            $(e.target).addClass('ddl_bold').siblings().removeClass('ddl_bold');
            $('#to_timings').siblings('#dd_list_to').addClass('hidden').removeClass('bor_t_ligthblue');

        });
    });

    var dd_list_to = $('#dd_list_to');
    if (!dd_list_to.is(e.target) && dd_list_to.has(e.target).length === 0) {
        $('#dd_list_to').addClass('hidden');
    }

    // COMPANY TYPE
    var current_showBox, current_invoker, cuisines = '';

    $('.company_type #selected-items').not($('#selected-items-container')).click(function (e) {
        current_invoker = $(this);
        current_showBox = $(this).siblings('.menus-container');
        current_invoker.addClass('selected-items-active');
        current_showBox.removeClass('hidden');
        current_showBox.children('ul').removeClass('hidden');
    });

    if (!$('.company_type .menus-container').is(e.target) && $('.company_type .menus-container').has(e.target).length === 0) {
        // console.log(current_invoker);

        $('.company_type .menus-container').addClass('hidden');
        $('.company_type #selected-items').removeClass('selected-items-active');
    }

    // CUISINES
    var current_showBox, current_invoker, cuisines = '';

    $('.Cusines #selected-items').not($('#selected-items-container')).click(function (e) {
        current_invoker = $(this);
        current_showBox = $(this).siblings('.menus-container');
        current_invoker.addClass('selected-items-active');
        current_showBox.removeClass('hidden');
    });

    if (!$('.Cusines .menus-container').is(e.target) && $('.Cusines .menus-container').has(e.target).length === 0) {
        // console.log(current_invoker);

        $('.Cusines .menus-container').addClass('hidden');
        $('.Cusines #selected-items').removeClass('selected-items-active');
        $('.Cusines').addClass('autoHeight');

    }

    // Tags
    var current_showBox, current_invoker, cuisines = '';

    $('.Tags #selected-items').click(function (e) {
        current_invoker = $(this);
        current_showBox = $(this).siblings('.menus-container');
        current_invoker.addClass('selected-items-active');
        current_showBox.removeClass('hidden');
    });

    if (!$('.Tags .menus-container').is(e.target) && $('.Tags .menus-container').has(e.target).length === 0) {
        // console.log(current_invoker);

        $('.Tags .menus-container').addClass('hidden');
        $('.Tags #selected-items').removeClass('selected-items-active');
        $('.Tags').addClass('autoHeight');

    }




});


let daysGlobal = [];
let db_timings = {};
let db_tags = [];
let db_cuisines = [];

$(document).ready(function (e) {

    var count = 1;
    $('.Cusines .menus-container .menu li').click(function (e) {

        console.log(db_cuisines);
        cuisines = `<a>${e.target.innerHTML} <a/>`;
        console.log(count++);
        console.log($('.Cusines #selected-items-container').html());

        if ($('.Cusines #selected-items-container').html() === 'Select cuisines...') {
            $('.Cusines #selected-items-container').empty();
            console.log('equal');
        }

        if (db_cuisines.indexOf(e.target.innerHTML) === -1) {
            db_cuisines.push(e.target.innerHTML);
            $('.Cusines #selected-items-container').append(`<a class='selected-cuisine '>${e.target.innerHTML}<i id='${e.target.innerHTML}' class='fa fa-times'></i></a>`);
        } else {

        }
        db_cuisines.push(e.target.innerHTML);


        // alert('yay');

        $('.selected-items-container .selected-cuisine i').click(function (e) {
            // console.log($('.Cusines #selected-items-container').length );
            console.log($(e.target).parent('a').html());

            var remove_index = db_cuisines.indexOf($(e.target).attr('id'));
            console.log(remove_index);
            if (remove_index !== -1) {
                db_cuisines.splice(remove_index, 1);
            }
            console.log(db_cuisines);

            $(this).parent('a').remove();
            if ($('.Cusines #selected-items-container a').length === 0) {
                $('.Cusines #selected-items-container').html('Select cuisines...');
            }
        });
    });

    $('.Tags .menus-container .menu li').click(function (e) {


        console.log(db_tags.indexOf(e.target.innerHTML));
        console.log(e.target.innerHTML);
        // cuisines = `<a>${e.target.innerHTML} <a/>`;
        $('.Tags').css({ 'height': 'auto !important' });

        if ($('.Tags #selected-items-container').html() === 'Select tags...') {
            $('.Tags #selected-items-container').empty();
        }

        if (db_tags.indexOf(e.target.innerHTML) === -1) {
            db_tags.push(e.target.innerHTML);
            $('.Tags #selected-items-container').append(`<a class='selected-tag'>${e.target.innerHTML}<i id='${e.target.innerHTML}' class='fa fa-times'></i></a>`);
        } else {

        }
        console.log(db_tags)
        // alert('yay');
        $('.selected-items-container .selected-tag i').click(function (e) {
            $(this).parent('a').remove();
            var remove_index = db_tags.indexOf($(e.target).attr('id'));
            if (remove_index !== -1) {
                db_tags.splice(remove_index, 1);
            }
            console.log(db_tags);

            if ($('.Tags #selected-items-container a').length === 0) {
                $('.Tags #selected-items-container').html('Select tags...');
            }
        });
    });



    var openedSection;

    $('.company_type .menus-container .menu li').click(function (e) {
        cuisines = `<a>${e.target.innerHTML} <a/>`;
        $(openedSection).addClass('hidden');
        openedSection = `#${e.target.innerHTML}-section`;
        $(`#${e.target.innerHTML}-section`).removeClass('hidden');

        if ($('.company_type #selected-items-container').html() === 'Select type') {
            $('.company_type #selected-items-container').empty();
        }
        $('.company_type #selected-items-container').html(e.target.innerHTML);
        $('.company_type #selected-items-container input').val(e.target.innerHTML);
        $('.company_type .menus-container').addClass('hidden');
        $('.company_type #selected-items').removeClass('selected-items-active');
    });



    // ADD TIME SLOTS
    $('#add-time').click(function (e) {
        $('#time-slots-error').html('').hide();

        console.log('add time func called')
        // var staticDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        // for (let staticDay of staticDays ){
        //     if ( !daysGlobal.includes(day.name) && day.name != undefined ) {

        //     }
        // }
        var days = $('#days input[type=checkbox]:checked'), innerTimings;
        // var daysSorted = [];
        // for (let day of days){
        //     if ( day.name === 'Monday') daysSorted.push(day.name)
        //     if ( day.name === 'Tuesday') daysSorted.push(day.name)
        //     if ( day.name === 'Wednesday') daysSorted.push(day.name)
        //     if ( day.name === 'Thursday') daysSorted.push(day.name)
        //     if ( day.name === 'Friday') daysSorted.push(day.name)
        //     if ( day.name === 'Saturday') daysSorted.push(day.name)
        //     if ( day.name === 'Sunday') daysSorted.push(day.name)
        // }
        // console.log('daysGlobal',daysGlobal);

        if ($('#from_timings').val() != '' && $('#to_timings').val() != '') {

            for (let day of days) {
                console.log(day.name);
                var from = $('#from_timings').val();
                var from_array_cur = from.trim().split(':');
                var to = $('#to_timings').val();
                var to_array_cur = to.trim().split(':');

                // limit to only 3 time slots
                if (daysGlobal.includes(day.name) && day.name != undefined && db_timings[day.name] && db_timings[day.name]['timing'].length < 3) {

                    innerTimings = `
                                                    
                                                        <div class="col-2 font-weight-bold">${day.name} </div>
                                                        <div class="col-5 time-slot">`;
                    var timingsSlotCount = db_timings[day.name]['timing'].length;
                    db_timings[day.name]['timing'].push({ from: from, to: to });
                    db_timings[day.name]['closed'] = false;

                    for (let timing of db_timings[day.name]['timing']) {
                        from_array = timing.from.trim().split(':');
                        to_array = timing.to.trim().split(':');

                        if (Number(from_array[0]) < 12) { from = `${from_array[0]}:${from_array[1]}am`; } else { if (from_array[0] >= 13) { from_array[0] = Number(from_array[0]) - 12; from = `${from_array[0]}:${from_array[1]}pm`; } else { from = `${from_array[0]}:${from_array[1]}pm`; } }
                        if (Number(from_array[0]) < 1) { from_array[0] = 12; from = `${from_array[0]}:${from_array[1]}am`; }

                        if (Number(to_array[0]) < 12) { to = `${to_array[0]}:${to_array[1]}am`; } else { if (to_array[0] >= 13) { to_array[0] = Number(to_array[0]) - 12; to = `${to_array[0]}:${to_array[1]}pm`; } else { to = `${to_array[0]}:${to_array[1]}pm`; } }
                        if (Number(to_array[0]) < 1) { to_array[0] = 12; to = `${to_array[0]}:${to_array[1]}am`; }

                        if (timingsSlotCount >= 1) {
                            innerTimings = innerTimings + `${from} - ${to}, `;
                        } else {
                            innerTimings = innerTimings + `${from} - ${to} `;
                        }

                        timingsSlotCount--;

                    }


                    innerTimings = innerTimings + `</div>
                                                        <div class="col-3"><a  id="${day.name}closed"> Mark this day as closed</a> </div>
                                                        <div class="col-2"><a class=''> <i class='fa fa-times' id="${day.name}remove"></i></a></div>
    
                                                `;
                    console.log(`div#${day.name}-slot.row`);
                    $(`div#${day.name}-slot.row`).html(innerTimings);

                } else {
                    // validate message 2 time slots
                    daysGlobal.push(day.name);

                    db_timings[day.name] = { timing: [{ from: from, to: to }], closed: false };

                    if (Number(from_array_cur[0]) < 12) { from = `${from_array_cur[0]}:${from_array_cur[1]}am`; } else { if (from_array_cur[0] >= 13) { from_array_cur[0] = Number(from_array_cur[0]) - 12; from = `${from_array_cur[0]}:${from_array_cur[1]}pm`; } else { from = `${from_array_cur[0]}:${from_array_cur[1]}pm`; } }
                    if (Number(from_array_cur[0]) < 1) { from_array_cur[0] = 12; from = `${from_array_cur[0]}:${from_array_cur[1]}am`; }
                    if (Number(to_array_cur[0]) < 12) { to = `${to_array_cur[0]}:${to_array_cur[1]}am`; } else { if (to_array_cur[0] >= 13) { to_array_cur[0] = Number(to_array_cur[0]) - 12; to = `${to_array_cur[0]}:${to_array_cur[1]}pm`; } else { to = `${to_array_cur[0]}:${to_array_cur[1]}pm`; } }
                    if (Number(to_array_cur[0]) < 1) { to_array_cur[0] = 12; to = `${to_array_cur[0]}:${to_array_cur[1]}am`; }

                    innerTimings = `
                                                    <div class="row py-2" id="${day.name}-slot">
                                                        <div class="col-2 font-weight-bold">${day.name} </div>
                                                        <div class="col-5 time-slot" >${from} - ${to} </div>
                                                        <div class="col-3"><a  id="${day.name}closed"> Mark this day as closed</a> </div>
                                                        <div class="col-2"><a class=''> <i class='fa fa-times' id="${day.name}remove"></i></a></div>
                                                    </div>
    
                                                `;
                    $('.time-slots').append(innerTimings);

                }
            }

            console.log(db_timings);

        } else {
            // validate message
            $('#time-slots-error').html('Please select both opening and closing times.').show();
        }

        // RESET values and styles
        $('#days input[type=checkbox]').prop('checked', false);
        $('#from_timings').val('');
        $('#to_timings').val('');
        $('.dd_list .item').removeClass('ddl_bold');



        $('.time-slots div div a').click(function (e) {
            var id = e.target.id.replace("closed", "");
            db_timings[id] = { closed: true, timing: [] };
            console.log($(e.target).parent().siblings('.time-slot').html('CLOSED'));
        });

        $('.time-slots div div i').click(function (e) {
            $(e.target).closest('.row').remove()
            var id = e.target.id.replace("remove", "");
            db_timings[id] = {};
            console.log("daysGlobal", daysGlobal);

            var d = daysGlobal.indexOf(id);
            if (d !== -1) {
                daysGlobal.splice(d, 1);
            }
            console.log("daysGlobal", daysGlobal);

            console.log(db_timings);
            // $(e.target).parent().parent().remove();
            // $(e.target).parent().siblings('.time-select').val()

        });


    });





});


//  NEW 

$(document).mouseup(function (e) {

    var current_showBox, current_invoker;

    // DISTRICT
    $('.district #selected-items').not($('#selected-items-container')).click(function (e) {
        current_invoker = $(this);
        current_showBox = $(this).siblings('.menus-container');
        current_invoker.addClass('selected-items-active');
        current_showBox.removeClass('hidden');
        current_showBox.children('ul').removeClass('hidden');
    });

    if (!$('.district .menus-container').is(e.target) && $('.district .menus-container').has(e.target).length === 0) {
        // console.log(current_invoker);

        $('.district .menus-container').addClass('hidden');
        $('.district #selected-items').removeClass('selected-items-active');
    }

    // STATE
    $('.state #selected-items').not($('#selected-items-container')).click(function (e) {
        current_invoker = $(this);
        current_showBox = $(this).siblings('.menus-container');
        current_invoker.addClass('selected-items-active');
        current_showBox.removeClass('hidden');
        current_showBox.children('ul').removeClass('hidden');
    });

    if (!$('.state .menus-container').is(e.target) && $('.state .menus-container').has(e.target).length === 0) {
        // console.log(current_invoker);

        $('.state .menus-container').addClass('hidden');
        $('.state #selected-items').removeClass('selected-items-active');
    }

});



$(document).ready(function (e) {


    var openedSection;

    // DISTRICT








});

var fetchDistricts = (stateName) => {
    $.ajax({
        url: `/api/districts?state_name=${stateName.trim()}`,
        contentType: 'application/json',
        success: function (districts) {
            console.log('success', districts);

            var html = '';
            for (let item of districts) {
                html = html + `<li class="${item.name}"  value="${item.name}">${item.name}</li>`;
            }
            $('#dd_list_districts').html(html);

        },
        error: function (res) {
            console.log('error', res);
        }
    });
}

// $('.district .menus-container .menu li').on('click', function (e) {
//     console.log('clicked district');
//     $('.district #selected-items-container').html(e.target.innerHTML);
//     console.log($("input[type='text'][name='districts']").val());
//     $("input[type='text'][name='districts']").val(e.target.innerHTML);
//     console.log($("input[type='text'][name='districts']").val());

//     $('.district .menus-container').addClass('hidden');
//     $('.district #selected-items').removeClass('selected-items-active');
// });

// STATE

// This function will work even inside document ready : since states list is rendered before page loads
$('.state .menus-container .menu li').on('click', function (e) {
    $('.state #selected-items-container').html(e.target.innerHTML);
    $("input[type='text'][name='state']").val(e.target.innerHTML);
    $('.state .menus-container').addClass('hidden');
    $('.state #selected-items').removeClass('selected-items-active');

    fetchDistricts(e.target.innerHTML);
});

// This function will not work inside document ready : since states list is rendered dynamically
$(document).on("click", ".district .menus-container .menu li", function (e) {
    var value = $(e.target).attr('value');
    console.log(value);
    $("input[type='text'][name='district']").val(value);

    $('.district #selected-items-container').html(value);
    $('.district .menus-container').addClass('hidden');
    $('.district #selected-items').removeClass('selected-items-active');
});

var opened_section;
$(document).on("click", ".company_type .menus-container .menu li", function (e) {
    var value = $(e.target).attr('value').trim();
    var value_transformed_id = value.replace(/ /g, '_');
    console.log(value);
    if (opened_section !== undefined)
        opened_section.addClass('hidden');
    opened_section = $(`#${value_transformed_id}-section`);

    opened_section.removeClass('hidden');
    $("input[type='text'][name='company_type']").val(value);
    $('.company_type #selected-items-container').html(value);
    $('.company_type .menus-container').addClass('hidden');
    $('.company_type #selected-items').removeClass('selected-items-active');

});



// $("form[name='businessform']").on('submit', function (e) {
//     // alert(db_timings);
//     console.log('submited', db_timings)
//     e.preventDefault();

//     var formValues = {};

//     var company_name = $("input[name='company_name']").val();
//     var locality = $("input[name='locality']").val();
//     var state = $("input[name='state']").val();
//     var district = $("input[name='district']").val();
//     var owner_name = $("input[name='owner_name']").val();
//     var phone_number = $("input[name='phone_number']").val();
//     var opening_status = $("input[type='radio'][name='opening_status']:checked").val();
//     var landmark = $("input[name='landmark']").val();
//     // var coordinates = $("input[name='coordinates']").val();
//     var timings = db_timings;

//     var company_type = $("input[name='company_type']").val();

//     var breakfast = $("input[name='Breakfast']").prop("checked");
//     var lunch = $("input[name='Lunch']").prop("checked");
//     var dinner = $("input[name='Dinner']").prop("checked");
//     var cafe = $("input[name='Cafe']").prop("checked");
//     var nightlife = $("input[name='Nightlife']").prop("checked");

//     var indoor = $("input[name='Indoor']").prop("checked");
//     var outdoor = $("input[name='Outdoor']").prop("checked");

//     var payment = $("input[type='radio'][name='paymnet']:checked").val();

//     var cuisines = db_cuisines;
//     var tags = db_tags;

//     // var Nightlife = $("input[name='Nightlife']").prop("checked");

//     formValues = {
//         company_name,
//         locality,
//         state,
//         district,
//         owner_name,
//         phone_number,
//         opening_status,
//         landmark,
//         timings,
//         company_type,
//         restaurant: {
//             service: {
//                 breakfast,
//                 lunch,
//                 dinner,
//                 cafe,
//                 nightlife
//             },
//             seating: {
//                 indoor,
//                 outdoor
//             },
//             cuisines,
//             tags
//         }
//     };

//     console.log(formValues);

//     // validate.validators.presence.message = "is required";
    
//     // var constraints = {
//     //     company_name: { presence: true },
//     //     locality: { presence: true },
//     //     state: { presence: true },
//     //     district: { presence: true },
//     //     owner_name: { presence: true },
//     //     phone_number: { presence: true, type: "number", length: 10 },
//     //     opening_status: { presence: true },
//     //     landmark: { presence: true },
//     //     timings: { presence: true },
//     //     company_type: { presence: true },
//     //     restaurant: {
//     //         service: {  presence: true  },
//     //         seating: {  presence: true  },
//     //         cuisines: {  presence: true  },
//     //         tags: {  presence: true  }
//     //     }
//     //   };

//     //   validate(formValues, constraints );
      
//     console.log(validate);


// });


// $(function() {

//         $.validator.setDefaults({
//             ignore: [],
//             highlight: function (element) {
//                 if ( $(element).is(':hidden') ){
//                     $(element).parent().addClass('is-invalid-border');
//                     $(element).siblings('label+').remove();
//                 } else {
//                     $(element).addClass('is-invalid');
//                 }
//             } 
//         });

//       $("form[name='businessform']").validate({
//         rules: {
//             company_name: {
//             required: true
//           },
//           locality: {
//             required: true
//           },
//           state: {
//             required: true
//           },
//           district: {
//             required: true
//           },
//           owner_name: { required: true },
//           phone_number: { required: true },
//           opening_status: { required: true },
//           landmark: { required: true }
//         }
        
//       });
    
//     });

// var validate = (value, rule) => {
//     switch (rule) {
//         case 'Number':
//             break;
//         case 'String':
//             break;
//         case 'Array':
//             break;
//         case 'Object':
//             break;
//         case 'Email':
//             break;
//         case 'mobile':
//             break;
//         case 'password':
//             break;
//     }

// };