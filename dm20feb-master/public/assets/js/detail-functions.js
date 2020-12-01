const userId = $("#userId").val();
const postId = $("#postId").val();
let _REVIEWS;
const whiteSpinner = `<div class="spinner-border text-light spinner-border-sm"></div>`;
// Bookmark ---------------------------------------------------------------------------------------
$("#BookmarkPost").click(async (e) => {
    if (!userId) {
        showInfoAlert('Please login to continue.');
        return false;
    }
    const mode = $("#BookmarkPost").hasClass('action-done') ? 'bookmarked' : 'bookmark';
    const postId = $("#BookmarkPost").data('id');

    if (mode == 'bookmarked' && postId) {
        // remove bookmark
        console.log('bookmarked');
        const prevContent = $("#BookmarkPost").html();
        $("#BookmarkPost").html(`<div class="spinner-border spinner-border-sm"></div>`);

        const action = await bookmarkAction(postId);
        if (action && action.done) {
            $("#BookmarkPost").removeClass('action-done');
        }

        $("#BookmarkPost").html(prevContent);
    }
    if (mode == 'bookmark' && postId) {
        // add bookmark
        console.log(' adding bookmark');
        const prevContent = $("#BookmarkPost").html();
        $("#BookmarkPost").html(`<div class="spinner-border spinner-border-sm"></div>`);

        const action = await bookmarkAction(postId);
        console.log({
            action
        })
        if (action && action.done) {
            $("#BookmarkPost").addClass('action-done');
        }
        $("#BookmarkPost").html(prevContent);

    }
});

$("#BookmarkPost *").click(e => {
    e.stopPropagation();
    $("#BookmarkPost").trigger("click");
});

const bookmarkAction = (postId) => {
    const rootDomain = `${location.protocol}//${window.location.hostname}${location.port ? ':'+location.port: ''}`;
    return new Promise((resolve, reject) => {
        $.post(`${rootDomain}/users/bookmark/action/${postId}`, {
                    url: location.href
                },
                (data, status) => {
                    console.log({
                        "bookmarks": data
                    })
                    if (status == 'success') {
                        resolve({
                            done: true
                        });
                    }
                })
            .fail(e => {
                reject({
                    done: false
                });
            });
    });
}


// Been Here ---------------------------------------------------------------------------------------
$("#BeenHerePost").click(async (e) => {
    if (!userId) {
        showInfoAlert('Please login to continue.');
        return false;
    }
    const mode = $("#BeenHerePost").hasClass('action-done') ? 'remove' : 'add';
    const postId = $("#BeenHerePost").data('id');

    if (mode == 'remove' && postId) {
        // remove bookmark
        console.log('removing');
        const prevContent = $("#BeenHerePost").html();
        $("#BeenHerePost").html(`<div class="spinner-border spinner-border-sm"></div>`);

        const action = await beenThereAction(postId);
        if (action && action.done) {
            $("#BeenHerePost").removeClass('action-done');
        }

        $("#BeenHerePost").html(prevContent);
    }
    if (mode == 'add' && postId) {
        // add bookmark
        console.log(' adding ');
        const prevContent = $("#BeenHerePost").html();
        $("#BeenHerePost").html(`<div class="spinner-border spinner-border-sm"></div>`);

        const action = await beenThereAction(postId);
        console.log({
            action
        })
        if (action && action.done) {
            $("#BeenHerePost").addClass('action-done');
        }
        $("#BeenHerePost").html(prevContent);

    }
});

$("#BeenHerePost *").click(e => {
    e.stopPropagation();
    $("#BeenHerePost").trigger("click");
});

const beenThereAction = (postId) => {
    const rootDomain = `${location.protocol}//${window.location.hostname}${location.port ? ':'+location.port: ''}`;
    return new Promise((resolve, reject) => {
        $.post(`${rootDomain}/users/beenThere/${postId}`, {
                    url: location.href
                },
                (data, status) => {
                    console.log({
                        "beenThere": data
                    })
                    if (status == 'success') {
                        resolve({
                            done: true
                        });
                    }
                })
            .fail(e => {
                reject({
                    done: false
                });
            });
    });
}



// alert functions ------------------------------------------------------------------------------

function showSuccessAlert(message, time) {
    $(".alert-container").show();
    $(".alert-success .message").html(message);
    $(".alert-success").show();

    setTimeout(() => {
        $(".alert-container").hide();
        $(".alert-success").hide();
    }, time ? time : 1500);

}

function showDangerAlert(message, time) {
    $(".alert-danger .message").html(message);
    $(".alert-danger").show();
    setTimeout(() => {
        $(".alert-container").show();
        $(".alert-danger").hide();
    }, time ? time : 1500);
}

function showInfoAlert(message, time) {
    $(".alert-info .message").html(message);
    $(".alert-info").show();
    setTimeout(() => {
        $(".alert-container").show();
        $(".alert-info").hide();
    }, time ? time : 1500);
}


// ********************************************************************************************
// Rating -----------------------------------------------------------------------------------
// var myDefaultWhiteList = $.fn.tooltip.Constructor.Default.whiteList;
// myDefaultWhiteList.div = ['data-weight'];
const ratingPopoverOptionsbody = `
`;

const star = `<i class="ml-2 fas fa-star"></i>`;
const colors = ["#CD1C26", "#FF7800", "#CDD614", "#5BA829", "#305D02"];

function ratedWeight() {

    const val = $('#ratingPopover').data('weight');
    return val;

}

const ratingPopoverOptions = {
    html: true,
    content: function () {
        return $(".popover-markup").html();
    },
    placement: "bottom",
    animation: true,
    offset: -105,
    sanitize: false,
    trigger: 'manual'
};


$(document).ready(function () {

    $("#ratingPopover").click(e => {
        if (!userId) {
            showInfoAlert('Please login to continue.');
            return false;
        }
        $('#ratingPopover').popover(ratingPopoverOptions);
        $('#ratingPopover').popover("toggle");

    });


    $('#ratingPopover *').click((e) => {
        $('#ratingPopover').trigger('click');
        e.stopPropagation();
    });

});

// disable popover hide on clicking inside 
$(document).mouseup(function (e) {
    var container = $(".popover");

    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.popover("hide");
    } else {
        container.popover("show");
    }
});

// rate post
let updating;
$(document).on('mouseup', '.rating-box', (e) => {
    const weight = $(e.target).data('weight');
    const postId = $("#postId").val();
    console.log({
        weight,
        postId
    });

    if (weight && postId) {
        updating = true;
        changeColors(weight);
        // $("#ratingcontainer .rating-weight-next").html('')
        // $("#ratingcontainer .rating-weight-next").html(` ${weight} ${star}`);
        $("#ratingcontainer .rating-weight").siblings('.fas').remove();
        $("#ratingcontainer .rating-weight").after(`
            <i class="fas fa-spinner fa-spin"></i>
        `);
        console.log('changing colors and updating');
        // $("#ratingPopover").popover('hide');
        $.post(`${rootDomain}/users/rating/change/${postId}`, {
                weight: weight
            },
            (data, status) => {
                console.log({
                    data
                });
                if (status == 'success' && data) {
                    $("#ratingcontainer .rating-weight-next").html('')
                    $("#ratingcontainer .rating-weight-next").html(` ${weight} ${star}`);
                    $("#ratingcontainer .rating-weight").siblings('.fas').remove();
                    $("#ratingcontainer .clear").removeClass('d-none');
                    $("#ratingPopover").removeAttr('style');
                    $("#ratingPopover").css({
                        "cssText": `border-color: ${colors[weight-1]} !important`
                    });
                    $("#ratingPopover").html(`<i class="fas fa-star "></i> Rated <span style="font-weight: bold; color: ${colors[weight-1]} !important ;"> ${weight}</span>`);

                    $("#ratingPopover").popover('hide');
                    $('#ratingPopover').data('weight', weight);
                }
            }).fail(e => {
            showDangerAlert('Please try again.');
        });
    }
});

// change previous rating-box bg-color on hover -------------------

// Common 
$(document).on('mouseenter', "#ratingcontainer .rating-box", (e) => {
    // console.log('hovering 1 *');
    $("#ratingcontainer .rating-weight").show();
    $("#ratingcontainer .rating-weight-next").hide();
});
$(document).on('mouseleave', "#ratingcontainer .rating-box", (e) => {
    // console.log('hovering 1 *');
    $("#ratingcontainer .rating-weight").hide();
    $("#ratingcontainer .rating-weight-next").show();
    const boxes = $("#ratingcontainer .rating-boxes .rating-box");

    $("#ratingcontainer .rating-weight").html(` <strong>5</strong> ${star}`);
    $("#ratingcontainer .one-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });
    $("#ratingcontainer .two-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });
    $("#ratingcontainer .three-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });
    $("#ratingcontainer .four-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });



});

$(document).on('mouseleave', '#ratingcontainer .rating-boxes', () => {
    let numbers = ['one', 'two', 'three', 'four', 'five'];
    $("#ratingcontainer .rating-weight-next").hide();
    $("#ratingcontainer .rating-weight").hide();

    if (ratedWeight()) {
        $("#ratingcontainer .rating-weight").show();

        console.log('updating colors upto weight ', ratedWeight());
        for (let i = 0; i < 5; i++) {


            if (i < ratedWeight()) {
                $("#ratingcontainer ." + numbers[i] + "-star").css({
                    "border-color": `${colors[ratedWeight()-1]}`,
                    "background-color": `${colors[ratedWeight()-1]}`
                });
            } else {
                $("#ratingcontainer ." + numbers[i] + "-star").css({
                    "border-color": `#cbcbcb`,
                    "background-color": `#cbcbcb`
                });

            }

        }

    }
});


// listeners
$(document).on('mouseenter', "#ratingcontainer .one-star", (e) => {
    // console.log('hovering 1 *');
    $("#ratingcontainer .rating-weight").html(` <strong>1</strong> ${star}`);
    $("#ratingcontainer .one-star").css({
        "border-color": "#CD1C26",
        "background-color": "#CD1C26"
    });
});

$(document).on('mouseenter', "#ratingcontainer .two-star", (e) => {
    // console.log(e.type);
    $("#ratingcontainer .rating-weight").html(` <strong>2</strong> ${star}`);
    console.log('hovering 2 *');
    $("#ratingcontainer .one-star").css({
        "border-color": "#CD1C26",
        "background-color": "#CD1C26"
    });
    $(".two-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });
    $("#ratingcontainer .three-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });
    $("#ratingcontainer .four-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });
    $("#ratingcontainer .five-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });
});

$(document).on('mouseenter', "#ratingcontainer .three-star", (e) => {
    $("#ratingcontainer .rating-weight").html(` <strong>3</strong> ${star}`);
    $(".one-star").css({
        "border-color": "#CD1C26 ",
        "background-color": "#CD1C26"
    });
    $(".two-star").css({
        "border-color": "#FF7800 ",
        "background-color": "#FF7800"
    });
    $("#ratingcontainer .three-star").css({
        "border-color": "#CDD614 ",
        "background-color": "#CDD614"
    });
    $("#ratingcontainer .four-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });
    $("#ratingcontainer .five-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });
});

$(document).on('mouseenter', "#ratingcontainer .four-star", (e) => {
    $("#ratingcontainer .rating-weight").html(` <strong>4</strong> ${star}`);

    $("#ratingcontainer .one-star").css({
        "border-color": "#CD1C26 ",
        "background-color": "#CD1C26"
    });
    $("#ratingcontainer .two-star").css({
        "border-color": "#FF7800 ",
        "background-color": "#FF7800"
    });
    $("#ratingcontainer .three-star").css({
        "border-color": "#CDD614 ",
        "background-color": "#CDD614"
    });
    $("#ratingcontainer .four-star").css({
        "border-color": "#5BA829 ",
        "background-color": "#5BA829"
    });
    $("#ratingcontainer .five-star").css({
        "border-color": "#cbcbcb ",
        "background-color": "#cbcbcb"
    });
});

$(document).on('mouseenter', "#ratingcontainer .five-star", (e) => {

    $("#ratingcontainer .rating-weight").html(` <strong>5</strong> ${star}`);
    $("#ratingcontainer .one-star").css({
        "border-color": "#CD1C26 ",
        "background-color": "#CD1C26"
    });
    $("#ratingcontainer .two-star").css({
        "border-color": "#FF7800 ",
        "background-color": "#FF7800"
    });
    $("#ratingcontainer .three-star").css({
        "border-color": "#CDD614 ",
        "background-color": "#CDD614"
    });
    $("#ratingcontainer .four-star").css({
        "border-color": "#5BA829 ",
        "background-color": "#5BA829"
    });
});


// change colors
function changeColors(weight) {

    const boxes = $("#ratingcontainer .rating-boxes .rating-box");
    for (let i = 0; i < weight; i++) {
        $(boxes[i]).removeAttr("style");
        $(boxes[i]).css({
            "cssText": `border-color: ${colors[weight-1]} ; background-color: ${colors[weight-1]} ;`
        });
    }

}

$("#ratingPopover").on("show.bs.popover", function () {

    const boxes = $("#ratingcontainer .rating-boxes .rating-box");
    const weight = ratedWeight();
    $("#ratingcontainer .rating-weight").hide();
    if (weight) {
        $("#ratingcontainer .rating-weight-next").html(`<strong>${weight}</strong> <i class="ml-2 fas fa-star"></i>`).show();
    }
    for (let i = 0; i < 5; i++) {

        $(boxes[i]).removeAttr("style");

        if (i < weight) {
            $(boxes[i]).css({
                "cssText": `background-color:   ${colors[ratedWeight()-1]} ;
                 border-color: ${colors[ratedWeight()-1]} `
            });
        } else {
            $(boxes[i]).css({
                "cssText": `background-color:   #cbcbcb ;
                 border-color: #cbcbcb `
            });
        }

        console.log($(boxes[i]).attr("style"));

    }
});

// clear / remove rating 

$(document).on('mouseup', '#removeRating', (e) => {
    // console.log('clicked');
    const postId = $("#postId").val();
    console.log({
        postId
    });

    if (postId) {
        updating = true;
        // $("#ratingcontainer .rating-weight-next").html('')
        // $("#ratingcontainer .rating-weight-next").html(` ${weight} ${star}`);
        $("#ratingcontainer .rating-weight").siblings('.fas').remove();
        $("#ratingcontainer .rating-weight").after(`
            <i class="fas fa-spinner fa-spin"></i>
        `);
        console.log('changing colors and updating');
        // $("#ratingPopover").popover('hide');
        $.post(`${rootDomain}/users/rating/remove/${postId}`, null,
            (data, status) => {
                console.log({
                    data
                });
                if (status == 'success' && data) {
                    removeColors();

                    $("#ratingcontainer .rating-weight-next").hide()
                    $("#ratingcontainer .rating-weight").hide();
                    $("#ratingcontainer .clear").addClass('d-none');
                    $("#ratingcontainer .rating-weight").siblings('.fas').remove();
                    $("#ratingPopover").removeAttr('style');
                    $("#ratingPopover").css({
                        "cssText": `border-color: #cbcbcb !important`
                    });
                    $("#ratingPopover").html(`<i class="fas fa-star "></i> Rate`);

                    $("#ratingPopover").popover('hide');
                    $('#ratingPopover').data('weight', '');
                }
            }).fail(e => {
            console.log({
                e
            });
            showDangerAlert('Please try again.');
        });
    }

});


function removeColors() {
    const boxes = $("#ratingcontainer .rating-boxes .rating-box");
    for (let i = 0; i < 5; i++) {
        $(boxes[i]).removeAttr("style");
        $(boxes[i]).css({
            "cssText": `border-color: #cbcbcb ; background-color: #cbcbcb ;`
        });
    }
}






// viewRating ************************************************************************************


const viewRatingPopoverOptions = {
    html: true,
    content: function () {
        return $(".popover-markup-view-rating").html();
    },
    placement: "bottom",
    offset: -177,
    sanitize: false,
    trigger: 'hover click'
};

$(document).ready(e => {
    $("#viewRating").popover(viewRatingPopoverOptions);
});


// seemoreTimings ************************************************************************************


const seemoreTimingsPopoverOptions = {
    html: true,
    content: function () {
        return $(".popover-markup-seemore-timings").html();
    },
    placement: "bottom",
    offset: 80,
    sanitize: false,
    trigger: 'hover click'
};

$(document).ready(e => {
    $("#timingsId").popover(seemoreTimingsPopoverOptions);
});


// REVIEW COMMENT ********************************************************************************
$(document).ready(e => {

    $('.OPENREVIEW').click(e => {
        e.preventDefault();
        if (!userId) {
            showInfoAlert('Please login to continue.');
            setTimeout(() => {
                location.assign('/auth/login');
            }, 1000);
            return false;
        } else {

            const reviewId = $(e.target).data('reviewid');

            if (!reviewId) {
                $("#reviewModal .modal-title").text('Write a review');
                $("#submitReview").show();
                $("#addReviewPhotos").show();
                $("#submitCommentOnReview").hide();
                $("#submitCommentOnReview").data('reviewid', '');
            }
        }
    });

    // $("#comment").on('keyup', function () {
    //     const message = $("#comment").val();
    //     if (130 - message.length > 0) {
    //         $("#commentValidation").html(`( <span class="text-info">${130-message.length}</span> characters left )`)
    //     } else {
    //         $("#commentValidation").html(`<i class="text-success fas fa-check"></i>`);
    //     }
    // });

    $("#reviewModal").on('show.bs.modal', function () {
        if ( !userId) {
            return false;
        }
    });

    $("#reviewModal").on('hide.bs.modal', function () {

        fileCount = 0;
        $("#comment").val('');
        $("#reviewModal .modal-body .review-images").removeClass('d-flex');
        $("#reviewModal .modal-body .review-images").addClass('d-none');
        $("#reviewModal .modal-body .review-images-container").empty();
        $("#submitReview").html('Submit');
        // $("#commentValidation").empty();


        // reset for comment on review
        $("#reviewModal .modal-title").text('Write a review');
        $("#submitReview").show();
        $("#submitCommentOnReview").hide();
        $("#submitCommentOnReview").data('reviewid', '');

    });


});

$(document).on('click', '#addReviewPhotos', e => {
    e.preventDefault();
    $("#addReviewPhotosFile").trigger('click');
});

let fileCount = 0;
$(document).on('change', "#addReviewPhotosFile", e => {
    // alert('change');
    console.log({
        e
    });
    const files = e.target.files;
    if (!files) {
        return;
    }
    if (files && ((fileCount + files.length) > 10)) {
        alert('You can upload maximum of 10 images');
        return false;
    }

    console.log({
        files
    });
    $("#reviewModal .modal-body .review-images").removeClass('d-none');
    $("#reviewModal .modal-body .review-images").addClass('d-flex');
    loadBackgroundPreview(files);
});


function loadBackgroundPreview(files) {
    // console.log("input files", input.files[0]);

    if (files) {

        for (let file of files) {
            fileCount++;
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#reviewModal .modal-body .review-images-container").append(
                    `
                <div class="img bg-img rounded border"
                            style="background-image: url(${e.target.result})"
                            >
                            </div>
                `
                );

            };
            reader.readAsDataURL(file);
        }
    }
}


$(document).on('click', '#submitReview', e => {
    e.preventDefault();

    const form = $("#reviewForm")[0];
    const message = $("#comment").val();
    const files = $("#addReviewPhotosFile")[0].files;
    const inputFile = $("#addReviewPhotosFile")[0];
    console.log({
        files
    });

    if (message && message.length > 0) {
        const formData = new FormData(form);
        // formData.append('images', inputFile? inputFile : null);
        // formData.append('message', message ? message: null); 

        $("#submitReview").html(whiteSpinner);
        submitReview(formData);
    } else {
        $(document).ready(function () {
            $("#comment").focus();
        });
    }

});



function submitReview(formData) {

    $.ajax({
        url: `${rootDomain}/users/review/add/${postId}`,
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false, // neccessary for file upload
        success: function (data) {
            console.log("Response data: ", data);

            if (data) {
                console.log('Review submitted');
                $('#reviewModal').modal('hide');
                $("#reviewForm").trigger('reset');
                $("#submitReview").html('Submit');
                showSuccessAlert('Your review has been submitted successfully.', 3000);
                const userReviewsCount = $("#userReviewsCount").val();
                $("#userReviewsCount").val(userReviewsCount ? userReviewsCount + 1 : '');
                getReviews();
            }
        },
        error: function (error) {
            console.log('Error', error);
            if (error.message) {
                showDangerAlert("Please try again later.", 3000);
            }
        }
    });
}

// get reviews ********************************************************************************

$(document).ready(e => {
    getReviews();
});

function getReviews() {

    return new Promise((resolve, reject) => {
        $.post(`${rootDomain}/search/post/get/${postId}/reviews`, null,
            (data, status) => {
                console.log({
                    data
                });

                if (status == 'success' && data.length > 0) {
                    $("#reviewsSection").show();
                    _REVIEWS = [...data];
                } else {
                    $("#reviewsSection").hide();
                }
                refreshReviews(data, 'home');
                resolve('done');

                // reject('done');

            }).fail(e => {

            console.log({
                e
            });
            $("#reviewsSection").hide();
            reject('done');
        });
    });
}

let skipReview = 0 , step = 5; 
function refreshReviews(a, mode) {
    const reviews = a ? a : _REVIEWS;
    console.log("refreshReviews");
    // find unique users
    $(".reviews-container").html('');
    $(".reviews-header").hide();
    console.log({reviews});

    if (reviews && reviews.length > 0) {
        $(".reviews-header").show();

        let uniqueUsers = [];
        reviews.forEach(review => {
            console.log({
                uniqueUsers
            });
            console.log("Unique ", uniqueUsers.every(user => String(user._id) != String(review.user._id)));
            if (uniqueUsers && uniqueUsers.every(user => String(user._id) != String(review.user._id))) {
                uniqueUsers.push(review.user);
                console.log('checking');

            }
            // console.log('checking');
        });

        // reviewed users name
        $("#avatar-group").html('');

        $("#moreUsers").html(uniqueUsers.length + " others");
        let names = [];
        for (let user of uniqueUsers) {

            if (user.name && user.name.firstName) {
                names.push(user.name.firstName);

                if (user.images && user.images.profile && user.images.profile.common && user.images.profile.common.url) {
                    $("#avatar-group").append(`<div class="avatar-icon bg-img rounded-circle border" 
                    style="background-image: url('/uploads/images/mobile/${user.images.profile.common.url}')"></div>`);
                } else {
                    $("#avatar-group").append(`<i class="avatar-icon fas fa-user-circle border rounded-circle border-white text-secondary"
                    style="font-size: 30px;"></i>`);
                }

            }
            if (names.length == 2) {
                break;
            }
        }


        if (uniqueUsers.length > 2 && names.length == 2) {
            $("#reviewedUsers").html(`<span id="userName">${names[0]}</span> and <span id="moreUsers">${uniqueUsers.length - 1}</span> others have
            reviewed this place.`);
        } else if (uniqueUsers.length == 2 && names.length == 2) {
            $("#reviewedUsers").html(`<span id="userName">${names[0]}</span> and <span id="moreUsers">${names[1]}</span> have
            reviewed this place.`);
        } else if (uniqueUsers.length == 1 && names.length == 1) {
            $("#reviewedUsers").html(`<span id="userName">${names[0]}</span> have
            reviewed this place.`);
        } else {
            $("#reviewedUsers").html(`<span id="userName">${uniqueUsers.length}</span> users have
            reviewed this place.`);
        }

        // review 
        $(".reviews-container").html('');
        let count = 0;

        let revCount = 0;

        let limit = skipReview + step;
        console.log({limit});
        for (let i = 0; i < reviews.length ; i++) {

            if ( mode && mode == 'home' && i == 5 && typeof allReviewHref != 'undefined') {
                $(".reviews-container").siblings(".see-all-reviews").remove();
                $(".reviews-container").after(`
                    <div class="my-2 see-all-reviews">
                        <a role="button" href="${allReviewHref}" class="btn btn-block text-danger btn-light btn-sm"> See all reviews </a>
                    </div>
                `);
                break;
            }
            
        
            
            
            if ( reviews.length  < limit){
                $(".reviews-container").siblings('.load-more').remove();
            }
            if ( i == limit  ) {
                $(".reviews-container").siblings('.load-more').remove();

                console.log({i});
                console.log(reviews.length - i);
                if ( reviews.length - (i +1) > 0 ) {
                    $(".reviews-container").after(`
                        <div class="my-2 load-more">
                            <buttton onclick="refreshReviews()" class="btn btn-block text-danger btn-light btn-sm"> Load more (${ reviews.length - i  }) </button>
                        </div>
                    `);
                } 

                break;

            } 

            skipReview++;


            let avatar, user = reviews[i].user;
            if (user.images && user.images.profile && user.images.profile.common && user.images.profile.common.url) {
                avatar = `<div class="review-profile-img  bg-img rounded-circle border" 
                style="background-image: url('/uploads/images/mobile/${user.images.profile.common.url}')"></div>`;
            } else {
                avatar = `<i class="review-profile-img  fas fa-user-circle border rounded-circle border-white text-secondary"
                style="font-size: 45px;"></i>`;
            }

            // const rated = user.ratings.some( e => String(e.post) == String(postId));
            const rating = user && user.ratings && user.ratings.length > 0 ? user.ratings.find(e => String(e.post) == String(postId)) : null;
            let userRating;
            if (rating) {
                userRating = rating.weight;
            }
            // const rated = $("#ratingPopover").data('weight');
            const userReviewsCount = user.reviews ? user.reviews.length : null;
            let userReviewsCountTP, userRatingTP;

            if (userReviewsCount && userReviewsCount == 1) {
                userReviewsCountTP = `<label class="text-secondary" style="font-size: 14px;">
                    ${userReviewsCount} Review
                </label>`;
            } else if (userReviewsCount && userReviewsCount > 1) {
                userReviewsCountTP = `<label class="text-secondary" style="font-size: 14px;">
                    ${userReviewsCount} Reviews
                </label>`;
            }

            if (rating) {
                userRatingTP = `
                <span style="font-weight: bold;">Rated</span>
                <span  class="badge badge-pill text-white"  style="background-color: ${colors[userRating-1]}; width: min-content;margin-right: 13px;margin-left: 8px;">
                ${userRating}
                </span>
                `;
            }

            let imagesHolder;
            if (reviews[i].images && reviews[i].images.length > 0) {
                let images = '',
                    index = 0;
                    reviews[i].images.forEach(image => {
                    images += `
                    <div
                    data-imageindex="${index}"
                    data-reviewid="${count}"
                    reviewId
                     class="bg-img review-image rounded border"
                    style="background-image: url('/uploads/images/web_thumbnail/${image.url}');"
                    
                   
                    ></div>`;
                    index++;
                });
                imagesHolder = `<div class="review-images">${images}</div>`;
            }

            let repliesHtml = '';
            if (reviews[i].replies && reviews[i].replies.length > 0) {
                reviews[i].replies.forEach(reply => {

                    let replyAvatar, replyUser = reply.user;
                    if (replyUser.images && replyUser.images.profile && replyUser.images.profile.common && replyUser.images.profile.common.url) {
                        replyAvatar = `<div class="review-profile-img  bg-img rounded-circle border" 
                        style="background-image: url('/uploads/images/mobile/${replyUser.images.profile.common.url}')"></div>`;
                    } else {
                        replyAvatar = `<i class="review-profile-img  fas fa-user-circle border rounded-circle border-white text-secondary"
                        style="font-size: 45px;"></i>`;
                    }




                    repliesHtml += `
                    <div  class="reply-item d-flex flex-row  p-3" style="">
                        <div class=" col-2 d-flex flex-column flex-start px-0">
                            ${replyAvatar}
                            <div class="  d-flex  flex-start">
                                <span class="text-secondary small mt-2">${dayDiff(new Date(reply.createdOn), new Date())}</span>
                            </div>
                         </div>
                        <div class=" col-10 p-xs-2 pl-0">
                            <div class="message-body see-less ">${sanitizeHtml(reply.message, SH_options)}</div>
                            <button class="btn btn-link text-danger p-0 see-more-message shadow-none" >see more</button>
                        </div>
                    </div>
                    `;
                });
            }


            // <button
            //                     class="btn btn-light btn-sm cus-panel small" type="button"
            //                     style="font-size: 12px;">Follow</button>
            const deleteReviewElement  = String(reviews[i].user._id) == String(userId) ? `<div class="dropdown-item delete-review" data-id="${reviews[i]._id}"  >Delete</div>`:'';
            $(".reviews-container").append(
                `
                <div class="reviews border pt-3" >
                <div class="col review-item">

                    <div class="row">
                        <div class="col-3 col-sm-2 col-md-2 col-lg-2 col-xl-2 rounded">
                                ${avatar}
                        </div>
                        <div class="col-7 col-sm-8 d-flex flex-column align-items-start"
                            style="line-height: 12px;padding: 0;">
                            <label  style="font-weight: bold;">${ reviews[i].user && reviews[i].user.name && reviews[i].user.name.firstName ? reviews[i].user.name.firstName :''}</label>
                                ${userReviewsCountTP ? userReviewsCountTP:'' }
                                
                            </div>
                        <div class="col-2 dropdown dropleft">
                            <button class="btn float-right shadow-none  p-1" data-toggle="dropdown">
                                <i class="far fa-ellipsis-v "></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right">
                            <div data-target="#reportReviewModal" data-toggle="modal" class="dropdown-item report-review" data-id="${reviews[i]._id}" >Report</div>
                            ${deleteReviewElement}
                          </div>
                        </div>
                    </div>
                    
                    <div  class="row my-3" style="">
                        <div class=" col-3 col-sm-2 d-flex flex-column flex-start pr-0">
                    <span class="text-secondary small mt-2">${dayDiff(new Date(reviews[i].createdOn), new Date())}</span>

                            ${userRatingTP ? userRatingTP : ''}
                        </div>
                        <div class=" col-9 col-sm-10 p-xs-2 pl-0">
                        <div class="message-body see-less ">${sanitizeHtml(reviews[i].message, SH_options)}</div>
                        <button class="btn btn-link text-danger p-0 see-more-message shadow-none" >see more</button>
                            ${imagesHolder ? imagesHolder :''}
                        </div>
                        
                        
                    </div>
                    
                    <div class="mb-3">
                        <div class="d-flex flex-row justify-content-start" role="group">
                            <button data-reviewid="${reviews[i]._id}" 
                            class=" shadow-none btn btn-light btn-sm cus-panel mod-btn likes-comment" type="button">
                                <i class=" fa-heart ${ userId && reviews[i].likes.some( e => String(e) == String(userId)) ? 'text-danger fas':'far' }"></i>
                                <span class="m-hide ">${ userId && reviews[i].likes.some( e => String(e) == String(userId)) ? 'Liked':'Like' }</span>
                                <label class="like-count countsmod  ">${reviews[i].likes ? reviews[i].likes.length : 0}</label>
                            </button>
                           
                            <button id="${reviews[i]._id+'comment-btn'}" class=" shadow-none ml-1 btn btn-light btn-sm cus-panel mod-btn  replies-comment" type="button">
                                <i class="far fa-comments"></i>
                                <span  class="m-hide ml-1">Comment</span>
                                <label class=" replies-count countsmod"  style="margin: 0;margin-right: 0px;margin-left: 0px;">${reviews[i].replies.length}</label>
                            </button>
                        </div>
                    </div>
                    <div class="comments-holder" style="display: none;">
                        <div class="row comment-box " id="${reviews[i]._id+'comment-box'}">
                            <div class="col-12 d-flex align-items-center my-3">
                            <i
                                    class="fas fa-pen-nib p-2 cus-panel mr-2 rounded-circle"
                                    style="background-color: rgb(249, 214, 174);"></i>
                                    <input data-toggle="modal" data-target="#reviewModal" 
                                    data-reviewid="${reviews[i]._id}"
                                    class=" comment-on-review form-control-lg float-right ml-auto cus-panel OPENREVIEW" type="text"
                                    style="width: 90%;height: 40px;font-size: 15px;" value=""
                                    placeholder="Write a comment" name="comment">
                        </div>
                        <div class="comments">
                        ${repliesHtml}
                        </div>
                    </div>

                    </div>
                </div>
            </div>  
                `
            );

            count++;
        }
        fixedSeeMores();

    } else {
        $(".reviews-header").hide();
        $(".reviews-container").html('');

    }

    // console.log({uniqueUsers});
}


function msToTime(ms) {

    if (ms <= 86400000) {
        var hrs = Math.floor(ms / (1000 * 60 * 60));
        var remainingMs = ms % (1000 * 60 * 60);
        var mins = Math.floor(remainingMs / (1000 * 60));
        var remainingSec = remainingMs % (1000 * 60 * 60);
        var secs = Math.floor(remainingSec / (1000 * 60));

        console.log({
            hrs,
            mins,
            secs
        });

        if (hrs && hrs > 1) {
            return hrs + ' hours ago';
        } else if (hrs && hrs == 1) {
            return hrs + ' hour ago';
        }


        if (mins && mins >= 1) {
            return mins + ' minutes ago';
        } else if (mins && mins == 1) {
            return mins + ' minute ago';
        }


        if (secs && secs >= 1) {
            return secs + ' seconds ago';
        } else if (secs && secs == 1) {
            return secs + ' second ago';
        }
        return "1 second ago";
    } else {
        return;
    }


}

function dayDiff(d1, d2) {

    let milliseconds = d2.getTime() - d1.getTime();

    // 1 day = 86400000 ms
    if (milliseconds <= 86400000) {
        // TODAY
        if (milliseconds <= 86400000 / 2) {
            return msToTime(milliseconds);
        } else {
            return 'Today';
        }
    } else if (milliseconds > 86400000 && milliseconds < 2 * 86400000) {
        // YESTERDAY 
        return "Yesterday";

    } else {
        // PASTs
        let days = milliseconds / (1000 * 60 * 60 * 24);
        let years = Math.floor(parseInt(days / 365));
        let months = Math.floor(parseInt((days % 365) / ((30 + 31) / 2)));
        let date = Math.floor(parseInt(days % ((30 + 31) / 2)));

        console.log({
            milliseconds,
            days,
            years,
            months,
            date
        });

        let duration;

        if (date == 1) {
            duration =  '1 day';
        } else if (date > 1) {
            duration = date + ' days';
        }


        if (months == 1) {
            duration = duration ? ', ' + '1 month' : '1 month';
        } else if (months > 1) {
            duration = duration ? ', ' + months + ' months' : ' months';
        }

        if (years == 1) {
            duration = '1 year';
        } else if (years > 1) {
            duration = years + ' years';
        }


        console.log({
            duration
        });

        return duration += ' ago';

    }


}

function getRows(selector) {
    var height = selector.scrollHeight;
    var line_height = $(selector).css('line-height');
    line_height = parseFloat(line_height);
    return Math.round(height / line_height);
}

function fixedSeeMores() {
    const messsages = $(".message-body");

    for (let i = 0; i < messsages.length; i++) {
        console.log("Rows : ", getRows(messsages[i]));
        if (getRows(messsages[i]) <= 5) {
            $(messsages[i]).siblings('button').hide();
        }
    }


}

$(document).on('click', '.see-more-message', e => {
    $(e.target).siblings('.message-body').toggleClass('see-less');
    const text = $(e.target).html();
    $(e.target).html(text == 'see more' ? 'see less' : 'see more');

});


// review images viewer click listener
let currentImageIndex, currentReviewId;

$(document).on('click', ".review-image", e => {
    $("#reviewImageViewModal").modal("show");
    const imageIndex = $(e.target).data('imageindex');
    const reviewId = $(e.target).data('reviewid');
    renderImageModal(reviewId, imageIndex, "review-image" );
    // console.log({imageIndex, reviewId});
    // console.log(_REVIEWS);
    // console.log(_REVIEWS[reviewId]);
    // console.log(_REVIEWS[reviewId]['images']);
    // console.log(_REVIEWS[reviewId]['images'][imageIndex]);
    // console.log(_REVIEWS[reviewId]['images'][imageIndex].url);


});

$(document).on('click', "#prevImage", e => {
    console.log("prevImage");
    if ( imageGalleryMode == 'post-image') {
        renderImageModal(null, currentImageIndex > 0 ?
            --currentImageIndex : postImages.collection.length - 1, imageGalleryMode);
    }
    if ( imageGalleryMode == 'review-image') {
        renderImageModal(currentReviewId, currentImageIndex > 0 ?
            --currentImageIndex : _REVIEWS[currentReviewId]['images'].length - 1, imageGalleryMode);
    }
    if ( imageGalleryMode == 'photos-review-image') {
        renderImageModal(currentReviewId, currentImageIndex > 0 ?
            --currentImageIndex : reviewImages.length - 1, imageGalleryMode);
    }
    
});

$(document).on('click', "#nextImage", e => {
    console.log("nextImage");
    if ( imageGalleryMode == 'post-image') {
        renderImageModal(null, currentImageIndex < postImages.collection.length - 1 ?
        ++currentImageIndex : 0 , imageGalleryMode);
    }
    if ( imageGalleryMode == 'review-image') {
        renderImageModal(currentReviewId, currentImageIndex < _REVIEWS[currentReviewId]['images'].length - 1 ?
        ++currentImageIndex : 0, imageGalleryMode);
    }
    if ( imageGalleryMode == 'photos-review-image') {
        renderImageModal(currentReviewId, currentImageIndex < reviewImages.length - 1 ?
        ++currentImageIndex : 0, imageGalleryMode);
    }
});

function renderImageModal(reviewId, imageIndex, mode) {
    console.log({
        reviewId,
        imageIndex
    });
    if ( mode == 'review-image') {
        if (_REVIEWS && _REVIEWS[reviewId] && _REVIEWS[reviewId]['images'] && _REVIEWS[reviewId]['images'][imageIndex] && _REVIEWS[reviewId]['images'][imageIndex].url) {
            currentImageIndex = imageIndex;
            currentReviewId = reviewId;
            imageGalleryMode = mode;

            // $("#imageViewer .controls .nav").html(imageIndex + 1 + "/" + _REVIEWS[reviewId]['images'].length);
            $("#imageViewer .image-holder img").prop('src', `/uploads/images/web/${_REVIEWS[reviewId]['images'][imageIndex].url}`);
            $("#image-details-date").html(dayDiff(new Date(_REVIEWS[reviewId].createdOn), new Date()));

            let avatar, user = _REVIEWS[reviewId].user;
            if (user.images && user.images.profile && user.images.profile.common && user.images.profile.common.url) {
                avatar = `<div class="review-profile-img  bg-img rounded-circle border" 
                    style="background-image: url('/uploads/images/mobile/${user.images.profile.common.url}')"></div>`;
            } else {
                avatar = `<i class="review-profile-img  fas fa-user-circle border rounded-circle border-white text-secondary"
                    style="font-size: 30px;"></i>`;
            }

            $("#image-details-avatar").html(avatar);
            $("#image-details-username").html(user.name.firstName ? user.name.firstName : '*****');
            $("#imagesCounter").text(imageIndex + 1 + "/" + _REVIEWS[reviewId]['images'].length);

        } else {
            console.log("Returning")
            return false;
        }
    }

    if ( mode == 'post-image') {
        console.log({postImages})
        if (postImages && postImages.collection && postImages.collection.length > 0 && postImages.collection[imageIndex].url) {
            currentImageIndex = imageIndex;
            imageGalleryMode = mode;
            // $("#imageViewer .controls .nav").html(imageIndex + 1 + "/" + postImages.collection.length);
            $("#imageViewer .image-holder img").prop('src', `/uploads/images/web/${postImages.collection[imageIndex].url}`);
            $("#image-details-date").html();

            // let avatar, user = post.user;
            // if (user.images && user.images.profile && user.images.profile.common && user.images.profile.common.url) {
            //     avatar = `<div class="review-profile-img  bg-img rounded-circle border" 
            //         style="background-image: url('/uploads/images/mobile/${user.images.profile.common.url}')"></div>`;
            // } else {
            //     avatar = `<i class="review-profile-img  fas fa-user-circle border rounded-circle border-white text-secondary"
            //         style="font-size: 30px;"></i>`;
            // }

            $("#image-details-avatar").html('');
            $("#image-details-username").html('Owner');
            $("#imagesCounter").text(imageIndex + 1 + "/" + postImages.collection.length);
            $("#image-details-date").html('');


        } else {
            console.log("Returning")
            return false;
        }
    }

    if ( mode == 'photos-review-image') {
        console.log({reviewImages})
        if (reviewImages && reviewImages.length > 0 && reviewImages[imageIndex].url) {
            currentImageIndex = imageIndex;
            imageGalleryMode = mode;
            // $("#imageViewer .controls .nav").html(imageIndex + 1 + "/" + postImages.collection.length);
            $("#imageViewer .image-holder img").prop('src', `/uploads/images/web/${reviewImages[imageIndex].url}`);
            $("#image-details-date").html();

            let avatar, user = reviewImages[imageIndex].user;
            if (user.images && user.images.profile && user.images.profile.common && user.images.profile.common.url) {
                avatar = `<div class="review-profile-img  bg-img rounded-circle border" 
                    style="background-image: url('/uploads/images/mobile/${user.images.profile.common.url}')"></div>`;
            } else {
                avatar = `<i class="review-profile-img  fas fa-user-circle border rounded-circle border-white text-secondary"
                    style="font-size: 30px;"></i>`;
            }
            let name = '';
            if( user.name && user.name.firstName) {
                name += user.name.firstName;
            } 
            if ( user.name && user.name.lastName ) {
                name += user.name.lastName;
            }

            $("#image-details-avatar").html(avatar);
            $("#image-details-date").html(dayDiff( new Date(reviewImages[imageIndex].createdOn) , new Date()));
            $("#image-details-username").html(name);
            $("#imagesCounter").text(imageIndex + 1 + "/" + reviewImages.length);
            

        } else {
            console.log("Returning")
            return false;
        }
    }


}


// UTILS

function safe(unsafe) {
    return encodeURIComponent(unsafe);
}

// Comment LIKES  & replies ________________+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on('click', '.likes-comment', e => {
    console.log('Like');
    const reviewId = $(e.target).data('reviewid');
    console.log({
        reviewId
    });
    if ( !userId){
        showInfoAlert('Please login to continue.');
        return false;
    }
    if (reviewId) {
        $.post(`${rootDomain}/users/review/like/${postId}`, {
                    reviewId: reviewId
                },
                (data, status) => {
                    console.log({
                        "Response": data
                    })
                    if (status == 'success' && (data.totalLikes || data.totalLikes == 0)) {
                        if ($(e.target).children('i').hasClass('far')) {
                            $(e.target).children('i').removeClass('far').addClass('fas text-danger');
                            $(e.target).children('span').text('Liked');
                        } else {
                            $(e.target).children('i').removeClass('fas text-danger').addClass('far');
                            $(e.target).children('span').text('Like');
                        }

                        $(e.target).children('label.like-count').text(data.totalLikes);
                        $(e.target).children('label.like-count').show();
                    }
                })
            .fail(e => {
                console.log({
                    e
                });
                showDangerAlert('Please try again.');
            });
    }
});

$(document).on('click', '.likes-comment i, .likes-comment span ', e => {
    e.preventDefault();
    e.stopPropagation();
    $(e.target).parent().trigger('click');

});




// comment on reviews  ***************************************************************************

$(document).on('click', '.comment-on-review', e => {
    e.preventDefault();
    const reviewId = $(e.target).data('reviewid');
    console.log({
        reviewId
    });
    if(!userId) { 
        showInfoAlert('Please login to continue.');
        return false;
    }
    if (reviewId) {
        $("#reviewModal .modal-title").text('Write a comment');
        $("#submitReview").hide();
        $("#submitCommentOnReview").show();
        $("#addReviewPhotos").hide();
        $("#submitCommentOnReview").data('reviewid', reviewId);
    }


});


$(document).on('click', '#submitCommentOnReview', async e => {
    e.preventDefault();
    const reviewId = $("#submitCommentOnReview").data('reviewid');
    const form = $("#reviewForm")[0];
    const message = $("#comment").val();
    const files = $("#addReviewPhotosFile")[0].files;
    const inputFile = $("#addReviewPhotosFile")[0];
    console.log("submitCommentOnReview ");
    console.log({
        files
    });

    if (reviewId && message && message.length > 0) {
        const formData = new FormData(form);
        formData.append('reviewId', reviewId);
        // formData.append('images', inputFile? inputFile : null);
        // formData.append('message', message ? message: null); 

        $("#submitCommentOnReview").html(whiteSpinner);
        try {
            const reply = await submitCommentOnReview(formData);

            let replyAvatar, replyUser = reply.user;

            if (replyUser.images && replyUser.images.profile && replyUser.images.profile.common && replyUser.images.profile.common.url) {
                replyAvatar = `<div class="review-profile-img  bg-img rounded-circle border" 
                style="background-image: url('/uploads/images/mobile/${replyUser.images.profile.common.url}')"></div>`;
            } else {
                replyAvatar = `<i class="review-profile-img  fas fa-user-circle border rounded-circle border-white text-secondary"
                style="font-size: 45px;"></i>`;
            }

            let replyHtml = `
            <div  class="reply-item d-flex flex-row  p-3" style="">
                <div class=" col-2 d-flex flex-column flex-start px-0">
                    ${replyAvatar}
                    <div class="  d-flex  flex-start">
                        <span class="text-secondary small mt-2">${dayDiff(new Date(reply.createdOn), new Date())}</span>
                    </div>
                    </div>
                <div class=" col-10 p-xs-2 pl-0">
                    <div class="message-body see-less ">${sanitizeHtml(reply.message, SH_options)}</div>
                    <button class="btn btn-link text-danger p-0 see-more-message shadow-none" >see more</button>
                </div>
            </div>
            `;
            console.log(`#${reviewId}comment-box`);

            $(`#${reviewId}comment-box .comments`).prepend(replyHtml);
            fixedSeeMores();
            // const done = await getReviews();
            // setTimeout(() => {
            //     $(`#{reviewId}comment-btn`).trigger('click');
            // }, 5000);

        } catch (error) {
            console.log({
                error
            });
        }
    } else {
        $(document).ready(function () {
            $("#comment").focus();
        });
    }

});



function submitCommentOnReview(formData) {

    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${rootDomain}/users/review/comment/add/${postId}`,
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false, // neccessary for file upload
            success: function (data) {
                console.log("Response data: ", data);

                if (data) {
                    console.log('Review submitted');
                    $('#reviewModal').modal('hide');
                    $("#reviewForm").trigger('reset');
                    $("#submitCommentOnReview").html('Submit');
                    showSuccessAlert('Your comment has been submitted successfully.', 3000);
                    // const userReviewsCount = $("#userReviewsCount").val();
                    // $("#userReviewsCount").val(userReviewsCount ? userReviewsCount + 1 : '');
                    // getCommentsOnReview();
                    resolve(data);
                }
            },
            error: function (error) {
                console.log('Error', error);
                reject(error);
                if (error.message) {
                    showDangerAlert("Please try again later.", 3000);
                }
            }
        });
    });

}


$(document).on('click', '.replies-comment', e => {
    console.log("replies-comment clicked");
    $(e.target).parent().parent().siblings(".comments-holder").toggle();
});
$(document).on('click', '.replies-comment *', e => {
    $(e.target).parent().trigger('click');
    e.stopPropagation();
    e.preventDefault();
});






// DELETE REVIEW _____________________*********************************************************

$(document).on('click', '.delete-review', e => {
    e.preventDefault();
    const id = $(e.target).data('id');
    console.log('Deleting review');
    console.log({
        id
    });

    if (userId && id) {
        $.post(`${rootDomain}/users/review/delete/${postId}`, {
                reviewId: id
            },
            (data, status) => {
                console.log({
                    data
                });

                if (status == 'success' && data == 'done') {
                    getReviews();
                    console.log('Review deleted');
                }
            }).fail(e => {
            showDangerAlert('Please try again');
            console.log({
                e
            });
        })
    } else {
        showInfoAlert('Please login to continue.');
        return false;
    }
});


$(document).on('click', '.report-review', e => {
    e.preventDefault();
    const id = $(e.target).data('id');
    

    console.log('Reporting review');
    console.log({
        id
    });

    if (userId && id   ) {
        $("#submitReportOnReview").data('id',id);
       
    } else {
        showInfoAlert('Please login to continue.');
        return false;
    }
});

$(document).on('click', '#submitReportOnReview', e => {
    e.preventDefault();

    const formData = new FormData($("#reportReviewForm")[0]);;
    const comment = sanitizeHtml(formData.get('comment'));
    const reviewId = $(e.target).data('id');

    let reasons = [];
    if ( formData.get('Spam') == 'on') {
        reasons.push('Spam');
    }
    if ( formData.get('Harrassment') == 'on') {
        reasons.push('Harrassment');
    }
    if ( formData.get('Inappropriate_pictures') == 'on') {
        reasons.push('Inappropriate pictures');
    }
    if ( formData.get('Other') == 'on') {
        reasons.push('Other');
    }
    console.log({
        comment, reasons
    });

    if ( reasons.length <= 0 ) {
        showInfoAlert('Please select a reason');
    } else if ( reviewId && reasons.length > 0 ) {
        $.post(`${rootDomain}/users/review/report/${postId}`, {
                comment: comment,
                reasons: reasons,
                reviewId: reviewId
            },
            (data, status) => {
                if (status == 'success' && data  && data.report) {
                    console.log('Report Submitted');
                    showSuccessAlert("Your report has been submitted.");
                    $("#reportReviewModal").modal('hide');
                }
            }).fail(error => {
            showDangerAlert(error.responseJSON && error.responseJSON.message ?  error.responseJSON.message : "Please try again");

            console.log({
                e
            });
        });
    }

});

$("#reportReviewModal").on('hide.bs.modal', e=>{
    $("#reportReviewForm").trigger('reset');
});




// post images **********************************************--------------------------------------------------


$(document).on('click', ".post-image", e => {
    $("#reviewImageViewModal").modal("show");
    const imageIndex = $(e.target).data('imageindex');
    const reviewId = $(e.target).data('reviewid');
    renderImageModal(reviewId, imageIndex, "post-image" );

});



// tools
function copyLink() {

    /* Alert the copied text */

    var input = document.createElement('textarea');
    input.innerHTML = window.location.href;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    showSuccessAlert("Link Copied to Clipboard");

    return result;

}