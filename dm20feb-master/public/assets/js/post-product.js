// image handler 1
let loadFile = function (event, output_id, inputbutton_id, remove_preview_id, inputfile_holder_id) {
    var reader = new FileReader();
    reader.onload = function () {
        let output = document.getElementById(output_id);
        let inputbutton = document.getElementById(inputbutton_id);
        let remove_preview = document.getElementById(remove_preview_id);
        let inputfile_holder = document.getElementById(inputfile_holder_id);
        output.style.backgroundImage = `url(${reader.result})`;
        output.style.display = '';
        inputbutton.style.display = 'none';
        remove_preview.style.display = '';
        inputfile_holder.style.display = 'none';
    };
    reader.readAsDataURL(event.target.files[0]);
};

function removefile(output_id, input_id, remove_preview_id, inputbutton_id, inputfile_holder_id) {
    var output = document.getElementById(output_id);
    let input = document.getElementById(input_id);
    let inputbutton = document.getElementById(inputbutton_id);
    let remove_preview = document.getElementById(remove_preview_id);
    let inputfile_holder = document.getElementById(inputfile_holder_id);
    output.style.backgroundImage = '';
    input.value = null;
    inputbutton.style.display = '';
    inputfile_holder.style.display = '';
    remove_preview.style.display = 'none';
}



function change_url_parameter(category, subcategory) {
    let url = new URL(document.URL);
    var search_params = url.searchParams;

    search_params.set('category', category);
    search_params.set('subcategory', subcategory);

    url.search = search_params.toString();
    var new_url = url.toString();
    console.log(new_url);
    window.history.pushState('page', 'title', new_url);
}

function submitProductForm() {
    let product_form = document.getElementById('product_form');
    alert('button Clicked');
    product_form.submit();
}