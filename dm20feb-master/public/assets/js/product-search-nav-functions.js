// ######## Navbar search function ########

function showNavSearchHolder() {
    let search_nav_location_holder = document.getElementById('search_nav_location_holder');
    search_nav_location_holder.style.display = '';
}
function hideNavSearchHolder() {
    let search_nav_location_holder = document.getElementById('search_nav_location_holder');
    search_nav_location_holder.style.display = 'none';
}
function showNavSearchProductHolder() {
    let search_nav_product_holder = document.getElementById('search_nav_product_holder');
    search_nav_product_holder.style.display = '';
}
function hideNavSearchProductHolder() {
    let search_nav_product_holder = document.getElementById('search_nav_product_holder');
    search_nav_product_holder.style.display = 'none';
}

const choose_location = (locationId) => {
    let location_input = document.getElementById('nav_search_location_input');
    let location_element = document.getElementById(locationId);
    console.log(location_input.value);

    if (location_element != null) {
        // console.log(location_element.getAttribute("data-value"));
        location_input.value = location_element.getAttribute("data-value");
        document.getElementById('navSearchLocationInput').value = location_element.getAttribute("data-value");
        return true;
    } else {
        return false;
    }

}


let nav_search_location_input = document.getElementById('nav_search_location_input');
nav_search_location_input.oninput = function searchNavLocation() {

    let search_query = nav_search_location_input.value;
    return fetch(`/product/search/location?searchlocation=${search_query}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            const updatedLocationList = []

            data.locations.forEach(i => {
                // check for duplications
                if (!updatedLocationList.includes(i.name.trim())) {
                    updatedLocationList.push(i.name.trim());
                }
            });

            let location_list = document.getElementById('search_nav_location_holder');
            while (location_list.childNodes.length > 1) {
                location_list.removeChild(location_list.lastChild);
            }

            updatedLocationList.forEach((element, index) => {
                if (index < 11) {
                    if (updatedLocationList.length > 0) {
                        // console.log(element.name);
                        let li = document.createElement("li");
                        let text = document.createTextNode(`${element}`);
                        li.setAttribute("id", `${index}`);
                        li.setAttribute("data-value", `${element}`);
                        li.addEventListener('mousedown', function () {
                            let location_input = document.getElementById('nav_search_location_input');
                            let location_element = document.getElementById(`${index}`);
                            if (location_element != null) {
                                console.log(location_element.getAttribute("data-value"));
                                location_input.value = location_element.getAttribute("data-value");
                                return true;
                            } else {
                                return false;
                            }
                        })
                        li.appendChild(text);
                        location_list.appendChild(li);
                    }

                }

            })
            if (updatedLocationList.length == 0) {
                let li = document.createElement("li");
                let text = document.createTextNode("No Location Found");
                li.appendChild(text);
                location_list.appendChild(li);
                console.log("Empty data");
            }
        })
        .catch(error => {
            console.log('Fail', error)
        });
}

let search_title = document.getElementById('nav_search_product_input');
search_title.oninput = () => {
    const search_location = document.getElementById('nav_search_location_input').value;
    if (search_location != '') {
        return fetch(`/product/search/location/product?searchlocation=${search_location}&searchlocationproduct=${search_title.value}`)
            .then(response => response.json())
            .then(data => {
                const updatedLocationProductList = [];
                // console.log(data.products);
                data.products.forEach(i => {
                    // console.log(i.product_ad_title);
                    updatedLocationProductList.push(i);
                })

                let product_list = document.getElementById('search_nav_product_holder');
                while (product_list.childNodes.length > 1) {
                    product_list.removeChild(product_list.lastChild);
                }
                updatedLocationProductList.forEach((element, index) => {
                    if (index < 11) {
                        if (updatedLocationProductList.length > 0) {
                            let li = document.createElement("li");
                            let div = document.createElement("div");
                            let title = document.createTextNode(`${element.product_ad_title}`);
                            div.appendChild(title);
                            div.classList.add("location_product_search_text_title");
                            let small = document.createElement("small");
                            small.classList.add("text-muted");
                            small.classList.add("location_product_search_text_sub_title");
                            let subcategory = document.createTextNode(`${element.product_sub_category}`);
                            small.appendChild(subcategory);
                            li.classList.add("location_product_search_text")
                            li.setAttribute("id", `${element._id}`);
                            li.setAttribute("data-value", `${element.product_ad_title}`);
                            li.addEventListener('mousedown', function () {
                                let product_element = document.getElementById(`${element._id}`);
                                if (product_element != null) {
                                    console.log(product_element.getAttribute("data-value"));
                                    search_title.value = product_element.getAttribute("data-value");
                                    document.getElementById('navSearchProductInput').value = product_element.getAttribute("data-value");
                                    document.getElementById('navSearchLocationInput').value = document.getElementById('nav_search_location_input').value;
                                    if (document.getElementById('navSearchLocationInput').value != '') {
                                        document.getElementById('search_form').submit();
                                        return true;
                                    }
                                    else {
                                        document.getElementById('nav_search_product_input').value = product_element.getAttribute("data-value");
                                        return true;
                                    }

                                }
                                else {
                                    return false;
                                }
                            })
                            li.appendChild(div);
                            li.appendChild(small);
                            product_list.appendChild(li);
                        }

                    }

                })
                if (updatedLocationProductList.length == 0) {
                    let li = document.createElement("li");
                    let text = document.createTextNode("No Products Found");
                    li.appendChild(text);
                    product_list.appendChild(li);
                    console.log("Empty data");
                }

                // insert li component dynamically

            })
            .catch(error => {
                console.log('Fail', error)
            });
    }
    else {
        console.log("Empty location")
    }
}

function validateNavFormSubmit() {
    let navLocationInput = document.getElementById('nav_search_location_input');
    let navTitleInput = document.getElementById('nav_search_product_input');
    let locationInput = document.getElementById('navSearchLocationInput');
    let titleInput = document.getElementById('navSearchProductInput');
    let searchForm = document.getElementById('search_form');
    if (navLocationInput.value != '') {
        locationInput.value = navLocationInput.value;
    }
    if (navTitleInput.value != '') {
        titleInput.value = navTitleInput.value;
    }

    if (locationInput.value == '') {
        console.log(navLocationInput.value);
        console.log(navTitleInput.value);
        console.log(locationInput.value);
        console.log(titleInput.value);
        return false;
    } else {
        console.log(navLocationInput.value);
        console.log(navTitleInput.value);
        console.log(locationInput.value);
        console.log(titleInput.value);
        return searchForm.submit();
    }
}