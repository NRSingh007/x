// const rootDomain = 'https://digital-manipur.herokuapp.com/';
const rootDomain = `${location.protocol}//${window.location.hostname}${location.port ? ':'+location.port: ''}`;

// Manage page scroll
$(document).mouseup(function (e) {

  var locations_container = $(".cus-dd-list");

  $("#location-input , .location-holder #cus-dd-input-holder > i").click(function (e) {
    e.preventDefault();
    $("#location-input").focus();
    $(this).parent().siblings('.cus-dd-list').show();
  });
  $("#search-input , .search-holder #cus-dd-input-holder > i").click(function (e) {
    e.preventDefault();
    $("#search-input").focus();
    $(this).parent().siblings('.cus-dd-list').show();
  });

  $("#home-combo-c #location-input , #home-combo-c  .location-holder #cus-dd-input-holder > i").click(function (e) {
    e.preventDefault();
    if ( screen.width > 768 ) {
    $('html, body').stop(true, false).animate({ scrollTop: 150 }, 'fast');
    }
  });
  $("#home-combo-c #search-input , #home-combo-c  .search-holder #cus-dd-input-holder > i").click(function (e) {
    e.preventDefault();
    if ( screen.width > 768 ) {
    $('html, body').stop(true, false).animate({ scrollTop: 150 }, 'fast');
    }
  });

  // $(" #location-input").click(function(){
  //   // alert($(document).height());
  //   $('html, body').stop(true, false).animate({scrollTop:100}, 'fast');
  //     locations_container.show();
  // });
  // // If the target of the click isn't the container
  if (!locations_container.is(e.target) && locations_container.has(e.target).length === 0) {
    locations_container.hide();
  }

  $('.cus-dd-list a').click(function (e) {
    $('.cus-dd-list').hide();
  });







});

var timer, prevInput, prevInputCount = 1, stextIsEmpty = true;

const showDefaultSearchMenu = () => {
  $('.search-holder .default_dd_menu').show();
}

const hideDefaultSearchMenu = () => {
  $('.search-holder .default_dd_menu').hide();
  $('.search-holder  #searchResultError').html('');
}

const showSearchResult = (body) => {
  
  if (stextIsEmpty == false){
    hideNoResult();
  hideDefaultSearchMenu();
    $('.search-holder .search_result_menu').html(body);
    $('.search-holder .search_result_menu').show();
  }
  
}
const hideSearchResult = () => {
  $('.search-holder .search_result_menu').hide();
  showDefaultSearchMenu();
}

const showLoading = () => {
  $('#sr-loading').show();
  hideSearchResult();
  hideDefaultSearchMenu();
}

const hideLoading = () => {
  $('#sr-loading').hide();
}

const showNoResult = () => {
  $('.search-holder  #searchResultError').html(`<h6 class="py-2" style="text-align: center;">No results found</h6>`);
}
const hideNoResult = () => {
  $('.search-holder  #searchResultError').html('');
}

const startSearch = (event) => {

  prevTime = Date.now();
  event.preventDefault();
  event.stopPropagation();
  const stext = event.target.value.trim();
  const slocation = $('#location-input').val().trim();
  console.log("Searching with input = ", event.target.value);
  if (prevInput == stext) {
    console.log("Searching with same input = ", event.target.value, " ", ++prevInputCount, " times")
  } else { prevInputCount = 0 };
  prevInput = stext;

  

  if (stext.length > 0) {
    stextIsEmpty = false;

    hideDefaultSearchMenu();
    showLoading();

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(function () {

      console.log('Searching ' + stext + ' in ' + slocation);
      $.get(rootDomain + '/search/ajax?stext=' + stext + '&slocation=' + slocation, (data, status) => {

        console.log('Result.',{data});
        if (status == 'success' && data.posts && data.posts.length > 0 ) {
        console.log('Result : ',data.length,' items');

          let body = $('<div class="col" ></div>');

          data.posts.forEach(element => {
            body.append(` 
                    <div class="search-result-item ">
                      <a href="${rootDomain}/search?stext=${element.name}&slocation=${slocation}&p=1&sk=0&li=15">
                        <div class="row" style="justify-content: space-around">
                          <div class="col col-xl-1 col-lg-1 col-md-2 sr-icon">
                            <i class="fa fa-search"></i>
                          </div>
                          <div class="col col-10 sr-details">
                            <span class="item-title">${element.name}</span>
                            <small class="text-secondary item-category">${element.category && element.category.id  && element.category.id.name  ? element.category.id.name : ''}</small>
                          </div>
                        </div>
                        
                      </a>
                    </div>
                      
                      `);
          });




          if (stext.length>0) {
            hideLoading();
            showSearchResult(body);

          }

        }

        if (data.posts && data.posts.length == 0) {
          console.log('no results found');
          hideLoading();
          showNoResult();
          hideSearchResult();
          showDefaultSearchMenu();
          
        }


      });

    }, 1000);

  }
  else {
    stextIsEmpty = true;
    hideLoading();
    hideSearchResult();
  }

}

$("#search-input").keyup((event) => {

  if ($("#location-input").val().trim().length == 0) {
    hideDefaultSearchMenu();
    hideSearchResult();
    $("#location-input").click();
    stextIsEmpty = false;
  }
  if($("#search-input").val().trim().length == 0) {
    hideNoResult();
    hideSearchResult();
    stextIsEmpty = false;
  }
  
  if ($("#location-input").val().trim().length != 0 && $("#search-input").val().trim().length != 0 ){
    startSearch(event);
  }

});


$(document).on('click', '.goback', e => {
  $(".both-holder").removeClass('search-holder-max');
  $('.search-holder .cus-dd-list').hide();
  $('.search-holder').css('display','block !important');
  $(".search-holder .input-item i").show();
  $(".search-holder .input-item .goback").remove();
  $('.location-holder').attr('style','display: block !important');

});

$(document).on('focus',"#search-input", (event)=>{

  // max out both input holder to fixed position in mobile devices
  // check device width < 768px
  console.log('Screen width : ', screen.width  );
  if ( screen.width < 768 ) {
    $(".search-holder .input-item i").hide();
    $(".search-holder .input-item").prepend(`<i style="font-size: 20px;"  class="goback fas fa-angle-left"
    style="color: #A6AFB4;"></i>`)
    $(".both-holder").addClass('search-holder-max');
    $('.search-holder .cus-dd-list').show();
    $('.location-holder').attr('style','display: none !important');

  }




  //
  console.log(this);
  console.log(event.target.value.trim().length);
  if (event.target.value.trim().length == 0) {
    hideNoResult();
    hideSearchResult();

  } else {
    startSearch(event);
  }
  
});

$("#search-input").blur((event)=>{

  // max out both input holder to fixed position in mobile devices
  // check device width < 768px
  console.log('Screen width : ', screen.width  );
  if ( screen.width < 768 ) {
    
    $(".goBack").trigger('click');

  }

});


$(document).on('click', '.goBackLocation', e => {
  $(".both-holder").removeClass('search-holder-max');
  $('.location-holder .cus-dd-list').hide();
  $('.search-holder').css('display','block !important');
  $(".location-holder .input-item i").show();
  $(".location-holder .input-item .goBackLocation").remove();
});

// handle click on locaiton item
// Need to add outside dom ready since, these elements are added dynamically
$(document).on('click', '.location-item', function (e) {
  e.preventDefault();
  console.log("Location item clicked");
  console.log($(this).html());
  $('#location-input').val($(this).html().trim());
  $('#search-input').click();

});

$("#location-input").focus((event)=>{

  // max out both input holder to fixed position in mobile devices
  // check device width < 768px
  console.log('Screen width : ', screen.width  );
  if ( screen.width < 768 ) {
    $(".location-holder .input-item i").hide();
    $(".location-holder .input-item").prepend(`<i style="font-size: 20px;"  class="goBackLocation fas fa-angle-left"
    style="color: #A6AFB4;"></i>`)
    $(".both-holder").addClass('search-holder-max');
    $('.location-holder .cus-dd-list').show();
    $('.search-holder').css('display','none !important');

  }

});



// $("#location-input").blur((event)=>{
//   event.preventDefault();
//   event.stopPropagation();
//   // max out both input holder to fixed position in mobile devices
//   // check device width < 768px
//   console.log('Screen width : ', screen.width  );
//   if ( screen.width < 768 ) {
    
//     $(".goBackLocation").trigger('click');

//   }

// });




// location search

var timer1, slocationIsEmpty = true;
const location_showDefaultSearchMenu = () => {
  $('.location-holder .default_dd_menu').show();
}

const location_hideDefaultSearchMenu = () => {
  $('.location-holder .default_dd_menu').hide();
  $('.location-holder  #lsrError').html('');
}

const location_showSearchResult = (body) => {
  location_hideNoResult();
  location_hideDefaultSearchMenu();
  $('.location-holder .sr_locations_menu').html(body);
  $('.location-holder .sr_locations_menu').show();
}
const location_hideSearchResult = () => {
  $('.location-holder .sr_locations_menu').hide();
  location_showDefaultSearchMenu();
}

const location_showLoading = () => {
  $('#lsr-loading').show();
  location_hideSearchResult();
  location_hideDefaultSearchMenu();
}

const location_hideLoading = () => {
  $('#lsr-loading').hide();
}

const location_showNoResult = () => {
  $('.location-holder  #lsrError').html(`<h6 class="py-2" style="text-align: center;">No results found</h6>`);
}
const location_hideNoResult = () => {
  $('.location-holder  #lsrError').html('');
}

$("#location-input").keyup((event) => {
  prevTime = Date.now();
  event.preventDefault();
  event.stopPropagation();
  const value = event.target.value.trim();
  console.log(event.target.value);

  if (value.length == 0) {
    $('#lsr-loading').hide();
    $('.location-holder  #searchResultError').html('');
    $('.location-holder .sr_locations_menu').hide();
    $('.location-holder .default_dd_menu').show();
  }

  if (value.length >= 1) {
    slocationIsEmpty = false;
    location_hideDefaultSearchMenu();
    location_showLoading();



    if (timer1) {
      clearTimeout(timer1);
    }

    timer1 = setTimeout(function () {
      console.log('searching ',value,'....');

      $.get(rootDomain + '/search/ajax/location?slocation=' + value, (data, status) => {
        console.log('Result  ', {data});
        
        if (status == 'success' && data.length > 0) {
          $('.location-holder .default_dd_menu').hide();


          // $('.search-holder .cus-dd-list .search_result_menu').show();
          console.log(status);
          console.log(data);

          $('.sr_locations_menu').html('');

          let body = $('<div class="" ></div>');

          data.forEach(element => {
            body.append(
              ` <li >
                    <a href="#" style="font-size: 14px;" >
                        <div class="d-flex py-2 px-2 location-item " style="color:#33373D; font-weight: 400; font-size: 14px" href="#">
                            ${element}
                        </div>
                    </a>
                </li>`

            );
          });
          if (value.length>0) {
            location_hideLoading();
            location_showSearchResult(body);

          }

        }

        if (data.length == 0) {
          console.log('no results found');
          location_hideLoading();
          location_showNoResult();
          location_hideSearchResult();
          location_showDefaultSearchMenu();
          
        }


      });

    }, 1000);

  } else {
    slocationIsEmpty = true;
    location_hideLoading();
    location_hideSearchResult();
  }



});

// load popular locality and district
$(document).ready(function () {
  console.log('dom loaded');

  // tooltip
  $('[data-toggle="tooltip"]').tooltip();  

  // fetch locations
  $.get(rootDomain + '/search/ajax/popularlocationsAndSearches', (data, status) => {

    console.log(status, data);

    if (data.district.length > 0) {
      $('.location-dd-list').append(`
      <h6 class="location-group-header text-secondary py-2 px-3 m-0 text-center" style="font-weight: 400;font-size: 13px; cursor: default; color: #89959B;">
            POPULAR DISTRICTS
      </h6>`);

      data.district.forEach(locality => {

        if (  typeof locality._id  == 'undefined' || locality._id == null ) return;

        $('.location-dd-list').append(`
        <li >
            <a href="#" style="font-size: 14px;" >
                <div class="d-flex py-2 px-2 location-item " style="color:#33373D; font-weight: 400; font-size: 14px" href="#">
                    ${locality._id}
                </div>
            </a>
        </li>`);
      });
    }

    if (data.locality.length > 0) {
      $('.location-dd-list').append(`<h6 class="location-group-header text-secondary py-2 px-3 m-0 text-center"
                                            style="font-weight: 400;font-size: 13px; cursor: default; color: #89959B;">
                                            POPULAR LOCALITIES</h6>`);
      data.locality.forEach(locality => {
        console.log({locality})
        if (  typeof locality._id  == 'undefined' || locality._id == null ) return;

        $('.location-dd-list').append(` <li >
        <a href="#" style="font-size: 14px;" >
            <div class="d-flex py-2 px-2 location-item " style="color:#33373D; font-weight: 400; font-size: 14px" href="#">
                ${locality._id}
            </div>
        </a>
    </li>`);
      });
    }

    $("#default_dd_menuID").html('');

    if ( data.trending.length > 0 ) {
      
      $("#default_dd_menuID ").append(`
      <h6 class="text-secondary"
      style="font-weight: light;font-size: 13px; cursor: default; color: #89959B;">
      Trending searches</h6>
      `);

      let temp = '<div class="trendingHolder">';
      data.trending.forEach( item => {
        temp += `<div class="trending-item"  data-name="${item.name}" >
            <img src="/assets/img/trend.svg"/ class="trending-icon mr-2">
            <span class="name">${item.name}</span>

            </div>`;
      });
      // <i class="far fa-chart-line text-danger trending-icon mr-2" ></i>
      temp += `</div>`;

      $("#default_dd_menuID ").append( temp );

    }

    if ( data.suggested.length > 0 ) {
      $("#default_dd_menuID ").append(`
      <h6 class="text-secondary"
      style="font-weight: light;font-size: 13px; cursor: default; color: #89959B;">
      Suggested searches</h6>
      `);

      let temp = '<div class="suggestedHolder">';
      data.suggested.forEach( item => {
        temp += `
        <div class="d-flex flex-row bg-white  px-3 default-dd-item mb-2 suggestion-item" data-name="${item.name}" href="#">
                        ${item.images && item.images.logo && item.images.logo.url ? '<img class="suggestion-img" src="/uploads/images/mobile_thumbnail/'+item.images.logo.url+'" alt="">' : '<img class="suggestion-img" src="/assets/img/logo-dim.png">'}
                        <span   class="stext suggestion-name">${item.name}</span>
        </div>
        `;
      });
      temp += `</div>`;

      $("#default_dd_menuID ").append( temp );
    }



  });




});




// handle click on locaiton item
// Need to add outside dom ready since, these elements are added dynamically
$(document).on('click', '.suggestion-item, .trending-item ', function (e) {
  e.preventDefault();
  // console.log($(".search-holder .default-dd-item > a > span").html().trim())
  const stext = $(this).data('name').trim();
  const slocation = $('#location-input').val();
  if (slocation.length == 0){
    $('#location-input').focus();
  } else {
    $('#search-input').val(stext);
    hideSearchResult();
    showSpinner();

    window.location.href = rootDomain+"/search?slocation="+slocation+"&p="+1+"&stext="+stext+"&sk="+0+"&li="+15;

  }

});

function navToPage(slocation, stext, scat, skeyword, limit, skip, totalResult, page, paginationMax = 5, paginationMin =1 ) {
  
  window.location.href = rootDomain+"/search?scat=" + scat +  "&skeyword="+ skeyword + "&slocation="+slocation+"&p="+page+"&stext="+stext+"&sk="+skip+"&li="+limit+"&trq="+totalResult+"&pgmin="+paginationMin+"&pgmax="+paginationMax;

}


// form
$("form[name='search-form']").on('submit', function(e){
  const stext =  $('#search-input').val().trim();
  const slocation = $('#location-input').val().trim();
  if (stext.length<1 || slocation.length < 1){
    e.preventDefault();
    if(slocation.length < 1) {
      $('#location-input').click();
    } else {
      $('#search-input').click();
    }

  } else {
    showSpinner();

  }

  console.log('clicked');
})

const showSpinner = ()=> {
  $('#form-search-btn').html(`
  <div class="text-center  loading" style="width: 45px" >
  <div class="spinner-border text-light spinner-border-sm "></div>
</div>
`);
}