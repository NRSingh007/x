function showMobilesSubcategory() {
    let mobilesSubcategory = document.getElementById('mobiles-subcategory');
    let carsSubcategory = document.getElementById('cars-subcategory');
    let bikesSubcategory = document.getElementById('bikes-subcategory');
    let electronicsSubcategory = document.getElementById('electronics-subcategory');
    let homeLifestyleSubcategory = document.getElementById('home-lifestyle-subcategory');
    let bakerySubcategory = document.getElementById('bakery-subcategory');
    let selectSubcategory = document.getElementById('select-subcategory');

    let mobileSubCategoryClass = document.getElementById('mobiles-menu').classList;
    let carsSubCategoryClass = document.getElementById('cars-menu').classList;
    let bikesSubCategoryClass = document.getElementById('bikes-menu').classList;
    let electronicsSubCategoryClass = document.getElementById('electronics-menu').classList;
    let homeLifestyleSubCategoryClass = document.getElementById('home-lifestyle-menu').classList;
    let bakerySubCategoryClass = document.getElementById('bakery-menu').classList;

    mobileSubCategoryClass.add('menu-active');
    carsSubCategoryClass.remove('menu-active');
    bikesSubCategoryClass.remove('menu-active');
    electronicsSubCategoryClass.remove('menu-active');
    homeLifestyleSubCategoryClass.remove('menu-active');
    bakerySubCategoryClass.remove('menu-active');

    selectSubcategory.style.display = '';
    mobilesSubcategory.style.display = '';
    carsSubcategory.style.display = 'none';
    bikesSubcategory.style.display = 'none';
    electronicsSubcategory.style.display = 'none';
    homeLifestyleSubcategory.style.display = 'none';
    bakerySubcategory.style.display = 'none';

}

function showCarsSubcategory() {
    let mobilesSubcategory = document.getElementById('mobiles-subcategory');
    let carsSubcategory = document.getElementById('cars-subcategory');
    let bikesSubcategory = document.getElementById('bikes-subcategory');
    let electronicsSubcategory = document.getElementById('electronics-subcategory');
    let homeLifestyleSubcategory = document.getElementById('home-lifestyle-subcategory');
    let selectSubcategory = document.getElementById('select-subcategory');


    let mobileSubCategoryClass = document.getElementById('mobiles-menu').classList;
    let carsSubCategoryClass = document.getElementById('cars-menu').classList;
    let bikesSubCategoryClass = document.getElementById('bikes-menu').classList;
    let electronicsSubCategoryClass = document.getElementById('electronics-menu').classList;
    let homeLifestyleSubCategoryClass = document.getElementById('home-lifestyle-menu').classList;
    let bakerySubcategory = document.getElementById('bakery-subcategory');
    let bakerySubCategoryClass = document.getElementById('bakery-menu').classList;


    mobileSubCategoryClass.remove('menu-active');
    carsSubCategoryClass.add('menu-active');
    bikesSubCategoryClass.remove('menu-active');
    electronicsSubCategoryClass.remove('menu-active');
    homeLifestyleSubCategoryClass.remove('menu-active');
    bakerySubCategoryClass.remove('menu-active');

    selectSubcategory.style.display = '';
    mobilesSubcategory.style.display = 'none';
    carsSubcategory.style.display = '';
    bikesSubcategory.style.display = 'none';
    electronicsSubcategory.style.display = 'none';
    homeLifestyleSubcategory.style.display = 'none';
    bakerySubcategory.style.display = 'none';

}

function showBikesSubcategory() {
    let mobilesSubcategory = document.getElementById('mobiles-subcategory');
    let carsSubcategory = document.getElementById('cars-subcategory');
    let bikesSubcategory = document.getElementById('bikes-subcategory');
    let electronicsSubcategory = document.getElementById('electronics-subcategory');
    let homeLifestyleSubcategory = document.getElementById('home-lifestyle-subcategory');
    let selectSubcategory = document.getElementById('select-subcategory');

    let mobileSubCategoryClass = document.getElementById('mobiles-menu').classList;
    let carsSubCategoryClass = document.getElementById('cars-menu').classList;
    let bikesSubCategoryClass = document.getElementById('bikes-menu').classList;
    let electronicsSubCategoryClass = document.getElementById('electronics-menu').classList;
    let homeLifestyleSubCategoryClass = document.getElementById('home-lifestyle-menu').classList;
    let bakerySubcategory = document.getElementById('bakery-subcategory');
    let bakerySubCategoryClass = document.getElementById('bakery-menu').classList;

    mobileSubCategoryClass.remove('menu-active');
    carsSubCategoryClass.remove('menu-active');
    bikesSubCategoryClass.add('menu-active');
    electronicsSubCategoryClass.remove('menu-active');
    homeLifestyleSubCategoryClass.remove('menu-active');
    bakerySubCategoryClass.remove('menu-active');

    selectSubcategory.style.display = '';
    mobilesSubcategory.style.display = 'none';
    carsSubcategory.style.display = 'none';
    bikesSubcategory.style.display = '';
    electronicsSubcategory.style.display = 'none';
    homeLifestyleSubcategory.style.display = 'none';
    bakerySubcategory.style.display = 'none';

}

function showElectronicsSubcategory() {
    let mobilesSubcategory = document.getElementById('mobiles-subcategory');
    let carsSubcategory = document.getElementById('cars-subcategory');
    let bikesSubcategory = document.getElementById('bikes-subcategory');
    let electronicsSubcategory = document.getElementById('electronics-subcategory');
    let homeLifestyleSubcategory = document.getElementById('home-lifestyle-subcategory');
    let selectSubcategory = document.getElementById('select-subcategory');

    let mobileSubCategoryClass = document.getElementById('mobiles-menu').classList;
    let carsSubCategoryClass = document.getElementById('cars-menu').classList;
    let bikesSubCategoryClass = document.getElementById('bikes-menu').classList;
    let electronicsSubCategoryClass = document.getElementById('electronics-menu').classList;
    let homeLifestyleSubCategoryClass = document.getElementById('home-lifestyle-menu').classList;
    let bakerySubcategory = document.getElementById('bakery-subcategory');
    let bakerySubCategoryClass = document.getElementById('bakery-menu').classList;

    mobileSubCategoryClass.remove('menu-active');
    carsSubCategoryClass.remove('menu-active');
    bikesSubCategoryClass.remove('menu-active');
    electronicsSubCategoryClass.add('menu-active');
    homeLifestyleSubCategoryClass.remove('menu-active');
    bakerySubCategoryClass.remove('menu-active');

    selectSubcategory.style.display = '';
    mobilesSubcategory.style.display = 'none';
    carsSubcategory.style.display = 'none';
    bikesSubcategory.style.display = 'none';
    electronicsSubcategory.style.display = '';
    homeLifestyleSubcategory.style.display = 'none';
    bakerySubcategory.style.display = 'none';

}

function showHomeLifestyleSubcategory() {
    let mobilesSubcategory = document.getElementById('mobiles-subcategory');
    let carsSubcategory = document.getElementById('cars-subcategory');
    let bikesSubcategory = document.getElementById('bikes-subcategory');
    let electronicsSubcategory = document.getElementById('electronics-subcategory');
    let homeLifestyleSubcategory = document.getElementById('home-lifestyle-subcategory');
    let selectSubcategory = document.getElementById('select-subcategory');
    let bakerySubcategory = document.getElementById('bakery-subcategory');

    let mobileSubCategoryClass = document.getElementById('mobiles-menu').classList;
    let carsSubCategoryClass = document.getElementById('cars-menu').classList;
    let bikesSubCategoryClass = document.getElementById('bikes-menu').classList;
    let electronicsSubCategoryClass = document.getElementById('electronics-menu').classList;
    let homeLifestyleSubCategoryClass = document.getElementById('home-lifestyle-menu').classList;
    let bakerySubCategoryClass = document.getElementById('bakery-menu').classList;


    mobileSubCategoryClass.remove('menu-active');
    carsSubCategoryClass.remove('menu-active');
    bikesSubCategoryClass.remove('menu-active');
    electronicsSubCategoryClass.remove('menu-active');
    homeLifestyleSubCategoryClass.add('menu-active');
    bakerySubCategoryClass.remove('menu-active');

    selectSubcategory.style.display = 'none';
    mobilesSubcategory.style.display = 'none';
    carsSubcategory.style.display = 'none';
    bikesSubcategory.style.display = 'none';
    electronicsSubcategory.style.display = 'none';
    homeLifestyleSubcategory.style.display = '';
    bakerySubcategory.style.display = 'none';

}
function showBakerySubcategory() {
    let mobilesSubcategory = document.getElementById('mobiles-subcategory');
    let carsSubcategory = document.getElementById('cars-subcategory');
    let bikesSubcategory = document.getElementById('bikes-subcategory');
    let electronicsSubcategory = document.getElementById('electronics-subcategory');
    let homeLifestyleSubcategory = document.getElementById('home-lifestyle-subcategory');
    let bakerySubcategory = document.getElementById('bakery-subcategory');
    let selectSubcategory = document.getElementById('select-subcategory');

    let mobileSubCategoryClass = document.getElementById('mobiles-menu').classList;
    let carsSubCategoryClass = document.getElementById('cars-menu').classList;
    let bikesSubCategoryClass = document.getElementById('bikes-menu').classList;
    let electronicsSubCategoryClass = document.getElementById('electronics-menu').classList;
    let homeLifestyleSubCategoryClass = document.getElementById('home-lifestyle-menu').classList;
    let bakerySubCategoryClass = document.getElementById('bakery-menu').classList;

    mobileSubCategoryClass.remove('menu-active');
    carsSubCategoryClass.remove('menu-active');
    bikesSubCategoryClass.remove('menu-active');
    electronicsSubCategoryClass.remove('menu-active');
    homeLifestyleSubCategoryClass.remove('menu-active');
    bakerySubCategoryClass.add('menu-active');

    selectSubcategory.style.display = 'none';
    mobilesSubcategory.style.display = 'none';
    carsSubcategory.style.display = 'none';
    bikesSubcategory.style.display = 'none';
    electronicsSubcategory.style.display = 'none';
    homeLifestyleSubcategory.style.display = 'none';
    bakerySubcategory.style.display = '';

}

// Sub-Category Form Submission
function submitSubCategoryForm(form_id) {
    let subcategory_form = document.getElementById(form_id);
    return subcategory_form.submit();
}

// function show_next_bls(param) {
//     if (history.pushState) {
//         var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?blsSkip=${param}`;
//         window.history.pushState({ path: newurl }, '', newurl);
//     }
// }