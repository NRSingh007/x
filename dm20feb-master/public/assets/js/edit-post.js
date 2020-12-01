
        let post;
        const postId = $("#postId").val();


        $("#imagesModal").on('show.bs.modal', function () {

            if (post) {
                // alert('The modal is about to be shown.');

                if (post.images.logo && post.images.logo.url) {
                    $('#logoImg').attr('src',
                        `${rootDomain}/uploads/images/web_thumbnail/${post.images.logo.url}`);
                }

                if (post.images.coverImage && post.images.coverImage.url) {
                    $('#coverImageImg').css('background-image',
                        `url('${rootDomain}/uploads/images/web_thumbnail/${post.images.coverImage.url}')`);
                }

                if (post.images.collection && post.images.collection.length > 0) {
                    $("#collectionImg").html('');

                    post.images.collection.forEach(image => {
                        if (image && image.url) {
                            $("#collectionImg").append(`
                    <div class="image-box">
                        <div class="image-box-overlay">
                            <div class="">
                                <button class="btn btn-sm btn-link remove-img" data-name="${image.url}">Remove</button>
                                </div>
                                                        </div>
                        <img src="/uploads/images/web_thumbnail/${image.url}" id="logoImg " class="img-thumbnail" alt="">
                        
                    </div>
                    `);
                        }

                    });
                } else {
                                    $("#collectionImg").html(`<p class="px-4 my-2">No images added yet!</p>`);
                                
                }


            }

        });

        $("#changeLogo").click((event) => {
            console.log({
                event
            });
            event.preventDefault();
            $("#logoFile").trigger('click');
        });

        $("#logoFile").change((e) => {

            // const file = $("#logoFile")[0].files[0];
            const file = e.target.files[0];
            console.log({
                e,
                file
            });
            if (Number(file.size) / (1024 * 1024) > 5 && (file.type != 'image/png' || file.type !=
                    'image/jpg')) {
                alert('Image size should be less than 5mb and of type jpeg or png. ');
            } else {
                $("#changeLogo")
                    .html(`<div class="spinner-border spinner-border-sm"></div> Uploaing...`)
                    .prop('disabled', true);

                // upload image
                const formData = new FormData();
                formData.append('logo', file);
                formData.append('postId', postId);
                $.ajax({
                    url: `${rootDomain}/users/post/${postId}/upload-images-logo`,
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false, // neccessary for file upload
                    success: function (data) {
                        console.log('File submitted');
                        console.log("file info: ", data);

                        if (data) {
                            post.images.logo.url = data.filename;
                            $('#logoImg').attr('src',
                                `${rootDomain}/uploads/images/web_thumbnail/${data.filename}`);
                        }
                        $("#changeLogo").html(`Change`).prop('disabled', false);

                    },
                    error: function (data) {
                        console.log('Error');
                        alert('Error occurred while uploading image to server');
                        $("#changeLogo").html(`Change`).prop('disabled', false);

                    }
                });
            }


        });

        $("#removeLogo").click((event) => {
            console.log({
                event
            });
            event.preventDefault();
            $("#removeLogo")
                .html(`<div class="spinner-border spinner-border-sm"></div> Removing...`)
                .prop('disabled', true);

            $.post(`${rootDomain}/users/post/${postId}/remove-images-logo`, {}, (data, status) => {
                if (status == 'success' && data) {
                    post.images.logo.url = null;
                    if (data)
                        $('#logoImg').attr('src',
                            `/assets/img/bg-abstract.jpg`);
                    $("#removeLogo")
                        .html(`Remove`)
                        .prop('disabled', false);
                }
            }).fail(e => {
                console.log({
                    e
                });
                alert('Error occurred while removing image from server');
                $("#removeLogo")
                    .html(`Remove`)
                    .prop('disabled', false);
            });

        });

        $("#changeCoverImage").click((event) => {
            console.log({
                event
            });
            event.preventDefault();
            $("#coverImageFile").trigger('click');
        });

        $("#coverImageFile").change((e) => {
            console.log({
                e
            });
            // const file = $("#logoFile")[0].files[0];
            const file = e.target.files[0];
            if (Number(file.size) / (1024 * 1024) > 5 && (file.type != 'image/png' || file.type !=
                    'image/jpg')) {
                alert('Image size should be less than 5mb and of type jpeg or png. ');
            } else {

                $("#changeCoverImage")
                    .html(`<div class="spinner-border spinner-border-sm"></div>Uploading...`)
                    .prop('disabled', true);

                // upload image
                const formData = new FormData();
                formData.append('coverImage', file);
                formData.append('postId', postId);
                $.ajax({
                    url: `${rootDomain}/users/post/${postId}/upload-images-coverImage`,
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false, // neccessary for file upload
                    success: function (data) {
                        console.log('File submitted');
                        console.log("file info: ", data);

                        if (data) {
                            post.images['coverImage']['url'] = data.filename;

                            $('#coverImageImg').css('background-image',
                                `url('${rootDomain}/uploads/images/web_thumbnail/${data.filename}')`
                            );
                        }
                        $("#changeCoverImage")
                            .html(`Change`)
                            .prop('disabled', false);

                    },
                    error: function (data) {
                        console.log('Error');
                        alert('Error occurred while uploading image to server');
                        $("#changeCoverImage")
                            .html(`Change`)
                            .prop('disabled', false);
                    }
                });
            }



        });

        $("#removeCoverImage").click((event) => {
            console.log({
                event
            });
            event.preventDefault();
            $("#removeCoverImage")
                .html(`<div class="spinner-border spinner-border-sm"></div> Removing...`)
                .prop('disabled', true);

            $.post(`${rootDomain}/users/post/${postId}/remove-images-coverImage`, {}, (data, status) => {
                if (status == 'success' && data) {
                    if (data) {
                        post.images.coverImage.url = null;

                        $('#coverImageImg').css('background-image',
                            `url('/assets/img/bg-abstract-lg.jpg')`);
                    }
                    $("#removeCoverImage")
                        .html(`Remove`)
                        .prop('disabled', false);

                }
            }).fail(e => {
                console.log({
                    e
                });
                alert('Error occurred while removing image from server');
                $("#removeCoverImage")
                    .html(`Remove`)
                    .prop('disabled', false);
            });

        });

        $("#addCollection").click((event) => {
            event.preventDefault();
            $("#collectionFile").trigger('click');
        });

        $("#collectionFile").on('change', (event) => {

            console.log(event);
            const files = $("#collectionFile")[0].files;
            if (files.length > 3) {
                alert('You are only allowed to upload a maximum of 3 images');
            } else {
                console.log("uploading collection");

                $("#addCollection")
                    .html(`<div class="spinner-border spinner-border-sm"></div> Uploading...`)
                    .prop('disabled', true);

                // upload images
                const formData = new FormData();
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    formData.append('collectionImages', file);
                }

                formData.append('postId', postId);
                $.ajax({
                    url: `${rootDomain}/users/post/${postId}/upload-images-collection`,
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false, // neccessary for file upload
                    success: function (data) {
                        console.log('Files submitted');
                        console.log("files info: ", data);

                        if (data) {
                            post.images.collection = [...post.images.collection, ...data];

                            $("#collectionImg").html('');
                            post.images.collection.forEach(image => {

                                if (image && image.url)
                                $("#collectionImg").append(`
                                <div class="image-box">
                                    <div class="image-box-overlay">
                                        <div class="">
                                            <button data-name="${image.url}" class="btn btn-sm btn-link remove-img">
                                                Remove</button>
                                            </div>
                                                                    </div>
                                    <img src="/uploads/images/web_thumbnail/${image.url}" id="logoImg " class="img-thumbnail" alt="">
                                    
                                </div>
                                `);
                            });
                        }
                        $("#addCollection")
                            .html(`Add`)
                            .prop('disabled', false);

                    },
                    error: function (data) {
                        console.log('Error');
                        alert('Error occurred while uploading image to server');
                        $("#addCollection")
                            .html(`Add`)
                            .prop('disabled', false);
                    }
                });



            }

        });

        $(document).on('click', '.remove-img', (e) => {
            let imageName = $(e.target).data('name');
            console.log({
                e,
                imageName
            });
            if (imageName) {
                $(e.target).html(`<div class="spinner-border spinner-border-sm"></div> Removing..`).prop(
                    'disabled', true);

                $.post(`${rootDomain}/users/post/${postId}/remove-images-collection/${imageName}`, {
                            imageName
                        },
                        (data, status) => {
                            console.log({
                                data
                            })
                            if (status == 'success' && data) {

                                if ( post.images.collection && post.images.collection.length  < 1 ) {
                                    $("#collectionImg").html(`<p class="px-4 my-2">No images added yet!</p>`);
                                }
                                
                                $(e.target).html(`Remove`).prop('disabled', false);
                                $(e.target).parent().parent('').parent('.image-box').remove();

                                console.log("post.images.collection");
                                console.log(post.images.collection);

                                post.images.collection = post.images.collection.filter(img => {
                                    if (img) {
                                        console.log(String(img.url), " - ", String(imageName), String(
                                            img.url) == String(imageName));
                                        return String(img.url) != String(imageName);
                                    } else {
                                        return false;
                                    }
                                });
                                console.log(post.images.collection);

                            }
                        })
                    .fail(e => {
                        $(e.target).html(`Remove`).prop('disabled', false);
                        alert('Error occurred while deleting image!');
                    });
            }
        })
   
        function preventFormSubmit(e) {
            e.preventDefault();
        }
        // TIMINGS
        let timingsAdd = {
            monday: {},
            tuesday: {},
            wednesday: {},
            thursday: {},
            friday: {},
            saturday: {},
            sunday: {},
        };

        // handle timingsAdd 
        const timingsControlAdd = {



            init: function () {
                console.log('%c Calling timingsAdd init() ', 'color: orange; font-weight: bold;');

                // init days
                const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
                let body;
                days.forEach(day => {
                    $('#timing_day_add').append(
                        `<option value="${day}" >${day.toUpperCase()}</option>`);
                });

                // init from
                // let hours = [...Array(25).keys()];
                const range = (start, stop, step = 1) =>
                    Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);
                let hours = range(0, 24.5, .5);
                hours.splice(0, 1);
                const hoursWithPeriods = hours.map(hour => {

                    if (hour == 12)
                        return `${hour}:00 Noon`;
                    else if (hour == 24)
                        return `${hour}:00 Midnight`;
                    else if (hour > 12 && hour < 24)
                        return Number.isInteger(hour) ? `${hour}:00 PM` : `${hour - 0.5}:30 PM`;
                    else
                        return Number.isInteger(hour) ? `${hour}:00 AM` : `${hour - 0.5}:30 AM`;

                });

                hoursWithPeriods.forEach(time => {
                    $('#timing_from_add').append(`<option value="${time}" >${time}</option>`);
                    $('#timing_to_add').append(`<option value="${time}" >${time}</option>`);
                });

                // $('#timing_day_add').html(body);
            },

            addTime: function (e) {
                console.log('%c ADDTIME  ', 'color: blue; font-weight: bold;');

                e.preventDefault();
                // const day = $('#timing_day_add').val().trim().toLowerCase();
                let checkboxs = $("#daysId .custom-control-input:checked");
                const from = $('#timing_from_add').val().trim();
                const to = $('#timing_to_add').val().trim();

                if (checkboxs.length > 0 && from && to) {

                    for (let i = 0; i < checkboxs.length; i++) {
                        let day = $(checkboxs[i]).prop('id').trim().toLowerCase();
                        if (timingsAdd[day].slots && timingsAdd[day].slots.length < 3) {
                            timingsAdd[day].slots.push(`${from} - ${to}`);
                        } else if (!timingsAdd[day].slots) {
                            timingsAdd[day].slots = [`${from} - ${to}`];
                        }

                        // override if closed 
                        if (timingsAdd[day].closed) {
                            timingsAdd[day].closed = false;
                        }

                    }
                    this.refreshTime();
                }


            },

            addClosedDay: function (e) {

                e.preventDefault();
                let checkboxs = $("#daysId .custom-control-input:checked");


                if (checkboxs.length > 0) {

                    for (let i = 0; i < checkboxs.length; i++) {
                        let day = $(checkboxs[i]).prop('id').trim().toLowerCase();

                        if (day) {
                            timingsAdd[day].closed = true;
                            timingsAdd[day].slots = [];
                            console.log('%c Operation: ADDCLOSEDAY DONE!,',
                                'color: orange; font-weight: bold;');
                            this.refreshTime();
                        } else {
                            console.log('%c Operation: ADDCLOSEDAY Failed!,',
                                'color: orange; font-weight: bold;');
                        }
                    }
                }
            },

            removeClosedDay: function (e) {
                let checkboxs = $("#daysId .custom-control-input:checked");
                const from = $('#timing_from_add').val().trim();
                const to = $('#timing_to_add').val().trim();

                if (checkboxs.length > 0 && from && to) {

                    for (let i = 0; i < checkboxs.length; i++) {
                        let day = $(checkboxs[i]).prop('id').trim().toLowerCase();
                        timingsAdd[day].closed = false;
                    }

                }
            },

            removeTime: function (day) {
                console.log('%c Operation: removeTime !,', 'color: orange; font-weight: bold;');

                if (day) {
                    timingsAdd[day.trim()] = {};
                    this.refreshTime();
                }

            },
            refreshTime: function () {
                $('#time-slot-display-addPost').html('');
                const entries = Object.entries(timingsAdd);

                console.log({
                    timingsAdd
                });
                let body = '';
                entries.forEach(item => {

                    if ( typeof item[1].slots != 'undefined' && ( item[1].slots.length > 0 || item[1].closed ) )
                        body = body + `
                    <li class='list-group-item d-flex'>
                        <div class='col-4 text-capitalize text-left'>${item[0]} </div>`;
                    if ( typeof item[1].closed != 'undefined' && item[1].closed) {
                        body = body + `<div class='col-7 px-0 text-left'>Closed</div>
                        <div class="close-time">
                            <i class="fa fa-times" aria-hidden="true" onclick="timingsControlAdd.removeTime('${item[0]}')"></i>
                        </div></li>`
                    } else if ( typeof item[1].slots != 'undefined' && item[1].slots.length > 0 || item[1].closed) {
                        body = body + `<div class='col-7 px-0 text-left'>${item[1].slots.toString()}</div> 
                            <div class="close-time">
                                <i class="fa fa-times" aria-hidden="true" onclick="timingsControlAdd.removeTime('${item[0]}')"></i>
                            </div>      
                        </li>`
                    }

                });


                $('#time-slot-display-addPost').html(`<ul class="list-group">${body}</ul>`);


            }

        };

        // init timingsAdd
        timingsControlAdd.init();

        // root domain
        // const rootDomain = `${location.protocol}//${window.location.hostname}${location.port ? ':' + location.port : ''}`;

        // DOM Ready 
        $(document).ready((e) => {

            // show required fields
            let requireds = $(
                "form[name='add_post'] input:required, form[name='add_post'] textarea:required, form[name='add_post'] select:required"
            );
            for (let i = 0; i < requireds.length; i++) {
                // $(requireds[i]).prop('required', false);
                $(requireds[i]).siblings('label').append(
                    `<i  class="fal fa-asterisk text-danger small ml-1  required" ></i>`);
            }

            // disable submit btn
            $("#submit-form-post").prop('disabled', true);


            

            // get post 
            const postId = $("#postId").val();
            if (postId) {
                console.log('Fetching post');
                $.get(`${rootDomain}/users/getPost/${postId}`,
                        (data, status) => {
                            console.log('Success! Fetching post');
                            console.log({data});

                            if (status == 'success' && data) {
                                post = data;

                                $("#photosId, #documentsId").show();
                                // update locality 
                                fetchLocality(data.address.locality.id);
                                // update category, subcategory, keywords
                                updateAllSelectAddPost(data.state, data.district, data.category);
                                // fetchSubcategoryAndKeywordsAddPost(
                                //     data.category.subCategory.id,
                                //     data.keywords
                                // );
                                // timings
                                timingsAdd = data.timings;
                                timingsControlAdd.refreshTime();
                                // console.log(data);


                            }

                        })
                    .fail(e => {
                        console.log('Failed in fetching post data');
                    });
            }




            // init google MAP
            const dynamicMap = googleDynamicMap();
            console.log("ADD POST MAP exist", typeof dynamicMap.getMap() != 'undefined');
            if (dynamicMap.getMap()) {
                dynamicMap.resetMarker();
            } else {
                dynamicMap.init();
                const lat = $('form[name="add_post"] input[name="lat"]').val();
                const lng = $('form[name="add_post"] input[name="lng"]').val();
                if (lat && lng) {
                    dynamicMap.changeMarkerAndPanTo({
                        lat: Number(lat),
                        lng: Number(lng)
                    });
                }
            }


        });

        var constraints = {
            company_name: {
                presence: {
                    allowEmpty: false
                }
            },
            company_email: {
                presence: {
                    allowEmpty: false
                },
                email: true
            },
            company_website: {
                format: {
                    pattern: /^$|^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm,
                    message: 'Enter a valid URL ( for e.g. http://www.xyz.com )'

                }
                
                // url: true

            },
            company_description: {
                presence: {
                    allowEmpty: false
                },
                length: {
                    minimum: 50,
                    message: '^Input should be minimum 50 characters '
                }
            },
            state: {
                presence: {
                    allowEmpty: false
                }
            },
            district: {
                presence: {
                    allowEmpty: false
                }
            },
            locality: {
                presence: {
                    allowEmpty: false
                }
            },
            areaAndStreetAddress: {
                presence: {
                    allowEmpty: false
                }
            },
            building: {
                presence: {
                    allowEmpty: true
                }
            },
            landmark: {
                presence: {
                    allowEmpty: true
                }
            },
            pincode: {
                presence: {
                    allowEmpty: false
                },
                numericality: {
                   onlyInteger: false,
                //    greaterThanOrEqualTo: 0
                },
                format: {
                    pattern: /^[0-9]{6}$/,
                    message: '^ Input should be numeric and exactly 6 charaacters'
                }
            },
            lat: {
                presence: {
                    allowEmpty: false
                },
                numericality: {
                onlyInteger: false,
                // greaterThanOrEqualTo: 0
                }
                // type: "number"
            },
            lng: {
                presence: {
                    allowEmpty: false
                },
                numericality: {
                onlyInteger: false,
                greaterThanOrEqualTo: 0
                }
                // type: "number"
            },
            owner_name: {
                presence: {
                    allowEmpty: false
                }
            },
            company_mobile: {

                presence: {
                    allowEmpty: false
                },
                format: {
                    pattern: /^\d{10}$/,
                    message: "^Input should be numeric and exactly 10 characters"
                }
            },
            company_optional_mobile: {
                presence: {
                    allowEmpty: true
                },
                format: {
                    pattern: /^$|^\d{10}$/,
                    message: "^Input should be numeric and exactly 10 characters"
                }
                
            },
            // company_telephone: {
                
            //     numericality: {
            //     onlyInteger: false,
            //     // greaterThanOrEqualTo: 0
            //     },
            //     format: {
            //         pattern: /^[0-9]{5,15}$/,
            //         message: "^Input should be numeric with minimum 5 characters and maximum 15 characters"
            //     }
            // },
            // company_optional_telephone: {
                
            //     numericality: {
            //     onlyInteger: false,
            //     // greaterThanOrEqualTo: 0
            //     },
            //     format: {
            //         pattern: /^[0-9]{5,15}$/,
            //         message: "^Input should be numeric with minimum 5 characters and maximum 15 characters"
            //     }
            // },
            owner_email: {
                presence: true,
                email: true
            },
           
            category: {
                presence: {
                    allowEmpty: false
                }
            },
            subCategory: {
                presence: {
                    allowEmpty: false
                }
            },
            keywords: {
                presence: {
                    allowEmpty: false
                }
            }
        };

        // form change listener and check valid
            $(document).on('change keyup focusout', `
                #company_name_add,
                #company_email_add,
                #company_website_add,
                #company_description_add,
                #owner_mobile1_add,
                #owner_mobile_optional_add,
                #owner_telephone1_add,
                #owner_telephone_optional_add,
                #company_state_address_add,
                #company_district_address_add,
                #company_locality_address_add,
                #company_street_address_add,
                #company_building_apartment_address_add,
                #company_landmarks_address_add,
                #company_pincode_address_add,
                #geo_lat,
                #geo_lng,
                #owner_contact_name_add,
                #owner_email_add,
                #owner_optional_email,
                #category,
                #subCategory,
                #company_keywords_add
                `, (e) => {
                    console.log({ "Element":e.target });

                    if ($(e.target).val().length > 1) {


                        // validate.js
                        
                        const form = $("form[name='add_post']")[0];
                        const formData = new FormData(form);
                        let validationInputs = {};
                        
                        for (let [key, value] of formData.entries()) {
                            validationInputs[key] = value;
                        }
                        
                        console.log({
                            validationInputs
                        });
                        validate.validators.presence.message = '^This field is required';
                        validate.validators.email.message =
                            '^Enter a valid email ( for eg. abc_10@xyz.com )';
                        validate.validators.url.message =
                            '^Enter a valid url ( for eg. http://www.abc.xyz )';
                        const validStatus = validate(validationInputs, constraints);
                        console.log("Validation status : ", validStatus);

                        // update css
                        let currentInputId = $(e.target).prop('id');
                        let currentInputName = $(e.target).prop('name');

                        console.log({currentInputId, currentInputName});
                        if (validStatus == undefined) {
                            $("#submit-form-post").prop('disabled', false);
                            $(`#${currentInputId}`).css('border-color', '#ced4da');
                            $(`#${currentInputId}`).siblings(`.feedback`).remove();


                        } else {
                            $("#submit-form-post").prop('disabled', true);

                            if (validStatus[currentInputName]) {

                                const messageArray = validStatus[currentInputName];
                                let messages = '';
                                messageArray.forEach(msg => {
                                    messages += `<div>${msg}</div>`
                                })

                                $(`#${currentInputId}`).css('border-color', 'red');
                                const feedback = $(`#${currentInputId}`).siblings('.feedback');
                                console.log({
                                    feedback
                                });
                                if (feedback && feedback.length >= 1) {
                                    $(`#${currentInputId} `).siblings('.feedback').html(`${messages}`);
                                } else {
                                    $(`#${currentInputId}`).after(
                                        `<div class="small text-danger feedback">${messages}</div>`);
                                }

                                // remove feedback for non-required fields
                                if (!$(`#${currentInputId}`).prop('required')) {
                                    setTimeout(() => {
                                        $(`#${currentInputId}`).css('border-color', '#ced4da');
                                        $(`#${currentInputId}`).siblings(`.feedback`).remove();

                                    }, 3000);
                                }



                            } else {
                                $(`#${currentInputId}`).css('border-color', '#ced4da');
                                $(`#${currentInputId}`).siblings(`.feedback`).remove();

                                let keys = Object.keys(validStatus);
                                if ( keys.indexOf('lat') == -1 || keys.indexOf('lng') == -1 ) {
                                    $("#dynamic_map_add").css('border-color', '#ced4da');
                                }
                            }
                            console.log({
                                currentInputId,
                                currentInputName
                            });
                        }


                        // not working : bug exist
                        // const fromStatus = $("form[name='add_post']")[0].checkValidity();
                        // console.log('form changed', fromStatus);
                        // if (fromStatus) {
                        // } else {
                        // }
                    }

                });

        function validateAll(e) {
            
                // validate.js
                console.log("validateAll");

                const form = $("form[name='add_post']")[0];
                const formData = new FormData(form);
                let validationInputs = {};
                
                for (let [key, value] of formData.entries()) {
                    validationInputs[key] = value;
                }
                
                console.log({
                    validationInputs
                });
                validate.validators.presence.message = '^This field is required';
                validate.validators.email.message =
                    '^Enter a valid email ( for eg. abc_10@xyz.com )';
                validate.validators.url.message =
                    '^Enter a valid url ( for eg. http://www.abc.xyz )';
                const validStatus = validate(validationInputs, constraints);
                console.log("Validation status : ", validStatus);

                if (validStatus == undefined) {
                    $("#submit-form-post").prop('disabled', false);


                } else {
                    $("#submit-form-post").prop('disabled', true);


                    const keys = Object.keys(validStatus);

                    
                    for ( let key of keys ) {
                        console.log(key);
                        if ( key == 'lat' || key == 'lng') {
                            $("#dynamic_map_add").css('border-color', 'red');
                            // continue;

                        } else {
                            // $("#dynamic_map_add").css('border-color', '#ced4da');
                        }

                        const messageArray = validStatus[key];
                        // let messages = '';
                        // messageArray.forEach(msg => {
                        //     messages += `<div>${msg}</div>`
                        // });

                        let messages = messageArray[0];

                        let elements = [`input[name='${key}']`, `textarea[name='${key}']`, `select[name='${key}']`]

                        elements.forEach( element => {

                            $(element).css('border-color', 'red');
                            const feedback = $(element).siblings('.feedback');
                            // console.log({
                            //     feedback
                            // });

                            if (feedback && feedback.length >= 1) {
                                $(element).siblings('.feedback').html(`${messages}`);
                            } else {
                                $(element).after(
                                    `<div class="small text-danger feedback">${messages}</div>`);
                            }

                            // remove feedback for non-required fields
                            if (!$(element).prop('required')) {
                                setTimeout(() => {
                                    $(element).css('border-color', '#ced4da');
                                    $(element).siblings(`.feedback`).remove();

                                }, 3000);
                            }
                            
                        });
                        

                        

                        



                    } 
                    // else {
                    //     $(`#${currentInputId}`).css('border-color', '#ced4da');
                    //     $(`#${currentInputId}`).siblings(`.feedback`).remove();
                    // }
                    
                }

        }

        // form modifiers
        function updateAllSelectAddPost() {

            const { address, category, keywords } = post;

            console.log({ address, category , keywords });
            // $('#add-listing-container #company_state_address_add option:not(:first-child)').remove();
            const states = $("#company_state_address_add option");
            for ( let i =0; i < states.length ; i++ ) {
                if ( String($(states[i]).data('id')) == String( address && address.state && address.state.id ? address.state.id : '') ) {
                    $(states[i]).prop('selected', true);
                    updateDistrict( address && address.district && address.district.id ? address.district.id : '');
                }
            }

            // $('#add-listing-container #company_district_address_add option:not(:first-child)').remove();
            // districts.forEach((district) => {
            //     $('#add-listing-container #company_district_address_add').append(
            //         `<option value="${district._id}" data-id="${district._id}" data-name="${district.name}" >${district.name}</option> `
            //     );
            // });

            const categories = $("#category option");
            for ( let i =0; i < categories.length ; i++ ) {
                if ( String($(categories[i]).data('id')) == String( category && category.id ? category.id : '') ) {
                    $(categories[i]).prop('selected', true);
                    fetchSubcategoryAndKeywordsAddPost( 
                        category && category.subCategory && category.subCategory.id ? category.subCategory.id : null, 
                        keywords  );
                }
            }

            // $('#add-listing-container #category option:not(:first-child)').remove();
            // categories.forEach((category) => {
            //     $('#add-listing-container #category').append(
            //         `<option value="${category._id}" data-id="${category._id}" data-name="${category.name}" >${category.name}</option> `
            //     );
            // });


        }

        function updateDistrict( selectedDistrictId ) {
            const stateId = $('#company_state_address_add').val();
            const { address, category } = post;

            if (!stateId) return alert('invalid stateId');
            $.post(`${rootDomain}/search/districts/get`, {stateId},
            ( response, status ) => {
                console.log({response});
                if ( status == 'success' && response && typeof response == 'object' ) {
                    const districts = response;

                    $('#add-listing-container #company_district_address_add option:not(:first-child)').remove();
                        $('#add-listing-container #company_locality_address_add option:not(:first-child)').remove();
                    districts.forEach((districtnew) => {

                        if ( selectedDistrictId &&  String(districtnew._id) == String( selectedDistrictId ) ) {
                            $('#add-listing-container #company_district_address_add').append(
                                `<option value="${districtnew._id}" selected data-id="${districtnew._id}" data-name="${districtnew.name}"  >${districtnew.name}</option> `
                            );
                            fetchLocality(address && address.locality && address.locality.id ? address.locality.id : '')
                        } else {
                                $('#add-listing-container #company_district_address_add').append(
                                    `<option value="${districtnew._id}"  data-id="${districtnew._id}" data-name="${districtnew.name}"  >${districtnew.name}</option> `
                                );
                            }
                        });
                }
            }).fail( error => {
                console.log({error});
            });

        }

        function fetchLocality(localityId = null) {
            const selectedDistrictId = $('#add-listing-container #company_district_address_add').val();
            $.get(`${rootDomain}/search/localities/${selectedDistrictId}`, (data, status) => {
                    if (status == 'success') {
                        console.log(data);
                        // updateAllSelectAddPost(data.state, data.district, data.category);
                        $('#add-listing-container #company_locality_address_add option:not(:first-child)').remove();
                        data.forEach((locality) => {
                            $('#add-listing-container #company_locality_address_add').append(
                                `<option 
                                ${ String(localityId) == String(locality._id) ? 'selected':'' }
                                value="${locality._id}" data-id="${locality._id}" data-name="${locality.name}"  >${locality.name}</option>`
                            );
                        });
                    }
                })
                .fail((error) => {
                    console.log('Fail ', error)
                });
        }

        function fetchSubcategoryAndKeywordsAddPost(subCategoryId = null, keywordsArray = null) {

            console.log({keywordsArray, subCategoryId});
            console.log("fetchSubcategoryAndKeywordsAddPost");

            const selectedCategoryId = $('#category').val();
            if ( !selectedCategoryId ) return alert('Invalid categoryId');
            $.get(`${rootDomain}/users/posts/fetchSubcategoryAndKeywords/${selectedCategoryId}`, (data, status) => {
                    if (status == 'success' && data) {
                        console.log(data);
                        // updateAllSelectAddPost(data.state, data.district, data.category);

                        // update keywords
                        $('#add-listing-container #company_keywords_add option:not(:first-child)').remove();
                        let keywordsIds;
                        if( keywordsArray) {
                           keywordsIds = keywordsArray.map(i => i.id);
                        } 
                        console.log({keywordsIds});
                        data.keywords.forEach((keyword) => {

                            $('#add-listing-container #company_keywords_add').append(
                                `<option 
                                ${ keywordsIds && keywordsIds && keywordsIds.indexOf(keyword._id) != -1 ? 'selected' : '' }
                                value="${keyword._id}"  data-id="${keyword._id}" data-name="${keyword.name}"  >${keyword.name}</option>`
                            );
                        });

                        // update subcategory
                        $('#add-listing-container #subCategory option:not(:first-child)').remove();
                        data.subCategory.forEach((subcategory) => {
                            $('#add-listing-container #subCategory').append(
                                `<option
                                ${ subCategoryId && String(subCategoryId) == String(subcategory._id) ? 'selected': ''}
                                 value="${subcategory._id}" data-id="${subcategory._id}" data-name="${subcategory.name}"  >${subcategory.name}</option>`
                            );
                        });

                        validateAll();

                    }
                })
                .fail((error) => {
                    console.log('Fail ', error)
                });
        }

        function showAlert(error = false, message) {
            const template = `
        <div style="position: fixed;
                    z-index: 1;
                    left: 43%;
                    top: 10px;" class="alert ${error ? 'alert-danger' : 'alert-success'} fade show alert-dismissible">
            <strong>${error ? 'Error' : 'Success'}!</strong> ${message}
        </div>
        `;
            $('body').append(template);
            setTimeout(() => {
                $('body .alert').hide();
            }, 5000);
        }


        $("#add_post_form").submit(function (e) {

            e.preventDefault();
            console.log('%c Form submit handled', 'color: orange; font-weight: bold;');

            // Validation
            const form = $("form[name='add_post']")[0];
            form.classList.add('was-validated');
            const fromStatus = form.checkValidity();
            // console.log({
            //     fromStatus
            // });

            // if (!fromStatus) {
            //     return false;
            // }

            // disable submit btn and show loading
            $("#submit-form-post").prop('disabled', true);
            $("#submit-form-post").html(
                `<div class="spinner-border spinner-border-sm mr-3 text-light"></div> Updating post...`);

            // create formData
            var upload = new FormData(document.getElementById('add_post_form'));
            console.log({
                upload
            });

            let filesUploaded = {};

            

                submitAddPostFormData(null, upload, form);

            return false;


        });

        function submitAddPostFormData(filesUploaded, upload, form) {

            console.log('Entering submitAddPostFormData text fields');
            // // modify formdata with uploaded file links
            // if (filesUploaded) {
            //     const keys = Object.keys(filesUploaded);
            //     keys.forEach(key => {
            //         upload[key] = filesUploaded[key];
            //     });
            // }

            // // convert form data to plain object
            // let data = {};
            // Object.keys(upload).forEach((key, index) => {
            //     // if ( typeof upload[key] == 'array' && upload[key].length > 0 ) {
            //     //     upload[key] = 
            //     // }
            //     data[key] = upload[key];
            // });

            // // add timingsAdd
            // data['timings'] = timingsAdd;

            // // status
            // data['status_add'] = data['status_add'] == 'true' ? true : false;
            // data['verified_add'] = data['verified_add'] == 'true' ? true : false;

            // // location
            // data['coordinates'] = upload['lat'] && upload['lng'] ? { 'lat':  upload['lat'], 'lng':  upload['lng'] } :  undefined ;

            // upload formdata even if no files are submitted
            // And post only if more than 3 inputs [ already entered = "status_add", "verified_add", "keywords" ] are enter 
            // const formfields = Object.keys(upload);

            // new 
            const state = $("#add_post_form select[name='state'] option:selected").data();
            const district = $("#add_post_form select[name='district'] option:selected").data();
            const locality = $("#add_post_form select[name='locality'] option:selected").data();
            const areaAndStreetAddress = $("#add_post_form input[name='areaAndStreetAddress']").val();
            const building = $("#add_post_form input[name='building']").val();
            const landmark = $("#add_post_form input[name='landmark']").val();
            const pincode = $("#add_post_form input[name='pincode']").val();

            const address = {
                state,
                district,
                locality,
                areaAndStreetAddress,
                building,
                landmark,
                pincode
            };

            let category = $("#add_post_form select[name='category'] option:selected").data();
            const subCategory = $("#add_post_form select[name='subCategory'] option:selected").data();
            category['subCategory'] = subCategory;

            const keywordsObj = $("#add_post_form select[name='keywords'] option:selected");
            let keywords = [];
            for (let i = 0; i < keywordsObj.length; i++) {
                keywords.push($(keywordsObj[i]).data());
            }

            let images = {
                    logo: null,
                    coverImage: null,
                    collection: []
                },
                docs = [];

            if (filesUploaded) {

                const filesKey = Object.keys(filesUploaded);
                let imagesFileName = ['customFile1', 'customFile2', 'customFile3', 'customFile4', 'customFile5'];
                let docsFileName = ['document1', 'document2', 'document3'];
                let docsName = ['document1_name', 'document2_name', 'document3_name'];

                filesKey.forEach(key => {

                    let index = imagesFileName.indexOf(key);
                    if (index != -1) {
                        images['collection'].push({
                            url: filesUploaded[imagesFileName[index]]
                        });
                    }

                    let index1 = docsFileName.indexOf(key);
                    if (index1 != -1) {
                        docs.push({
                            url: filesUploaded[docsFileName[index1]],
                            name: upload.get(docsName[index1]) ? upload.get(docsName[index1]) : null
                        });
                    }

                    if (key == 'logo') {
                        images['logo'] = {
                            url: filesUploaded['logo']
                        }
                    }

                    if (key == 'coverImage') {
                        images['coverImage'] = {
                            url: filesUploaded['coverImage']
                        }
                    }
                });

            }

            console.log({
                address,
                category,
                keywords
            });

            let data = {
                geoLocation: {
                    coordinates: {
                        lat: parseFloat(upload.get('lat')),
                        lng: parseFloat(upload.get('lng'))
                    }
                },
                ownerDetails: {
                    email: [
                        upload.get('owner_email') ? upload.get('owner_email') : null,
                        upload.get('owner_optional_email') ? upload.get('owner_optional_email') : null
                    ],
                    name: upload.get('owner_name') ? upload.get('owner_name') : null
                },
                timings: timingsAdd,
                address: address,
                category: category,
                // verified: upload.get('status_add') == true ? true : false,
                // status: upload.get('verified_add') == true ? true : false,
                // openingStatus: false,
                description: {
                    short: upload.get('company_description') ? upload.get('company_description') : null
                },
                name: upload.get('company_name') ? upload.get('company_name') : null,
                email: upload.get('company_email') ? upload.get('company_email') : null,
                website: upload.get('company_website') ? upload.get('company_website') : null,
                mobileNumber: [{
                        number: upload.get('company_mobile') ? upload.get('company_mobile') : null
                    },
                    {
                        number: upload.get('company_optional_mobile') ? upload.get('company_optional_mobile') :
                            null
                    }
                ],
                telephoneNumber: [{
                        number: upload.get('company_telephone') ? upload.get('company_telephone') : null
                    },
                    {
                        number: upload.get('company_optional_telephone') ? upload.get(
                            'company_optional_telephone') : null
                    }
                ],
                // preference: null,
                // userPackageId: null,
                // userPackageDate: null,
                modifiedOn: Date.now(),
                keywords: keywords

            }
            console.log('Final form data: ', data);

            // if (formfields.length > 3) {
            console.log('Submitting....');
            $("#add_post_form input[type='submit']").prop("disabled", true);

            if ( postId )
            $.post(`${rootDomain}/users/posts/update-post/${postId}`,
                data,
                (data, status) => {
                    if (status == 'success') {
                        // console.log(data);
                        showAlert(false, 'Post updated successfully');
                        setTimeout(() => {
                            const username = $("#username").val();
                                    location.replace(`${rootDomain}/users/home#Posts`);
                                }, 3000);

                        // *** remove validation styles 
                        form.classList.remove('was-validated');

                        // *** Reset form 
                        $("#add_post_form").trigger('reset');

                        // input : not working
                        const filesInput = $("#add_post_form .custom-file-input");
                        let filesInputArray = Object.values(filesInput);
                        for (let index = 0; index < filesInput.length; index++) {
                            $(filesInputArray[index]).val('');
                            $(filesInputArray[index]).siblings("label").html($(filesInputArray[index]).attr(
                                'placeholder'));

                        }

                        // timings
                        $('#time-slot-display-addPost').html('');

                        // keywords
                        $('#postAddContainer #company_keywords_add').html('');

                        console.log('form submitted ');

                        $("#submit-form-post").prop('disabled', true);
                        $("#submit-form-post").html('Update post');
                        

                        // $('#add_post_form input[type="submit"]').removeAttr("disabled");
                    }
                }).fail((error) => {
                console.log('Fail ', error);
                $("#submit-form-post").prop('disabled', false);

                showAlert(true, 'Unexpected error occurred. Please try again.');
                // $('#add_post_form input[type="submit"]').removeAttr("disabled");
            });
            // }

        }

        $(document).ready((e) => {
            $('#add_post input[type="file"]').on('change', (e) => {
                const val = $(e.target).val();
                console.log("File changed : ", val);
                if (val) {
                    const size = e.target.files[0].size / (1024 * 1024); // mb
                    if (size > 1) {
                        $(e.target).val('');
                        $(e.target).siblings('label').html($(e.target).prop('placeholder'));
                        $(e.target).siblings('.feedback').remove();
                        $(e.target).after(
                            `<div class="small text-danger feedback" >Invalid file size</div>`);


                    } else {
                        $(e.target).css('border-color', '#ced4da')
                        $(e.target).siblings('.feedback').remove();
                        $(e.target).siblings('.remove-file').remove();
                        $(e.target).after(`
                            <button type="button"  class="btn mt-2 mb-3 btn-success btn-sm px-3 remove-file" onclick="removeFile(event)">Remove</button>
                            `);
                    }

                }

            });
        });

        function removeFile(e) {
            e.preventDefault();
            const inputsObj = $(e.target).siblings('input');
            // $(e.target).siblings('.custom-file').children('label').html('');
            for (let i = 0; i < inputsObj.length; i++) {
                console.log(inputsObj[i]);
                $(inputsObj[i]).val('');
                $(inputsObj[i]).siblings('label').html($(inputsObj[i]).prop('placeholder'));

                // remove doc name
                if ($(inputsObj[i]).prop('accept') == `.docx, .pdf`) {
                    console.log('DOC Filename removed');
                    $(e.target).parent().parent().siblings('.col').children('div').children('input').val('');
                }
            }
            $(e.target).remove();
        }



        // Event listener to validate form
        $(document).on('change', ' input select checkbox radio textarea', e => {
            validateAll();
        });