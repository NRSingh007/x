// ######### Landing page search functions ###########



const showSearchHolder = () => {
    let location_search_holder = document.getElementById('location_search_holder');
    location_search_holder.style.display = '';
}
const hideSearchHolder = () => {
    let location_search_holder = document.getElementById('location_search_holder');
    location_search_holder.style.display = 'none';
}

var showProductSearch = () => {
    let location_product_search_holder = document.getElementById('location_product_search_holder');
    location_product_search_holder.style.display = '';
}
var hideProductSearch = () => {
    let location_product_search_holder = document.getElementById('location_product_search_holder');
    location_product_search_holder.style.display = 'none';
}


const search_input = document.getElementById('search_input');
search_input.oninput = function searchLocation() {
    let search_query = document.getElementById('search_input').value;
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

            let location_list = document.getElementById('location_search_holder');
            while (location_list.childNodes.length > 1) {
                location_list.removeChild(location_list.lastChild);
            }
            let location_result = document.getElementById('location_search_holder');
            updatedLocationList.forEach((element, index) => {
                if (index < 11) {
                    if (updatedLocationList.length > 0) {
                        // console.log(element.name);
                        let li = document.createElement("li");
                        let text = document.createTextNode(`${element}`);
                        li.setAttribute("id", `${index}`);
                        li.setAttribute("data-value", `${element}`);
                        li.addEventListener('mousedown', function () {
                            let location_input = document.getElementById('search_input');
                            let location_element = document.getElementById(`${index}`);
                            if (location_element != null) {
                                console.log(location_element.getAttribute("data-value"));
                                location_input.value = location_element.getAttribute("data-value");
                                data.locations.forEach(l => {
                                    if (l.name.trim() == location_element.getAttribute("data-value").trim()) {
                                        document.getElementById('location_type').value = l.location_type.trim();
                                    }
                                })
                                return true;
                            } else {
                                return false;
                            }
                        })
                        li.appendChild(text);
                        location_result.appendChild(li);
                    }

                }

            })
            if (updatedLocationList.length == 0) {
                let li = document.createElement("li");
                let text = document.createTextNode("No Location Found");
                li.appendChild(text);
                location_result.appendChild(li);
                console.log("Empty data");
            }
        })
        .catch(error => {
            console.log('Fail', error)
        });
}

const choose_location = (locationId) => {
    let location_input = document.getElementById('search_input');
    let location_element = document.getElementById(locationId);
    if (location_element != null) {
        // console.log(location_element.getAttribute("data-value"));
        location_input.value = location_element.getAttribute("data-value");
        return true;
    } else {
        return false;
    }

}



const search_title = document.getElementById('search_title');
search_title.oninput = () => {
    const search_location = document.getElementById('search_input').value;
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

                let product_list = document.getElementById('location_product_search_holder');
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
                                    if (search_location.value != '') {
                                        document.getElementById('search_form').submit();
                                        return true;
                                    }
                                    else {
                                        search_title.value = product_element.getAttribute("data-value");
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


function validateSearchForm() {
    let location_input = document.getElementById('search_input');
    let product_input = document.getElementById('search_title');

    if (location_input.value == '') {
        return false;
    }
}

