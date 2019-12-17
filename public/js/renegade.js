const navBar = document.getElementById("navbar");


function fadeOutFAlert() {
    if ($('.alert')) {
        setTimeout(function() {
            $('.alert').fadeOut('fast');
        }, 3000); // <-- time in milliseconds
    }
}


function toggleMenu() {
    var hamburgerMenu = document.getElementById("kx--menu__button");

    if (hamburgerMenu) {
        hamburgerMenu.onclick = function(e) {

            if (navBar.classList.contains('active')) {
                navBar.classList.toggle('active');

            } else {
                setTimeout(function() {
                    navBar.classList.toggle('active');
                }, 100);

            }

            hamburgerMenu.classList.toggle("open");

        }
    }
}


document.addEventListener("DOMContentLoaded", function(event){
    toggleMenu();
});

function init() {
    $('.tooltip').tooltipster();
    fadeOutFAlert();

    $(document).ready( function () {
	    $('#authorisations').DataTable({
	    	language: { search: "" , searchPlaceholder: "Search..."},
	    	scrollX : true,
	    	dom: '<f<t>ipl>'
	    });
	});

}

init();