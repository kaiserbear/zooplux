const sideBar = document.getElementById('sidebar');


function fadeOutFAlert() {
    if ($('.alert')) {
        setTimeout(function() {
            $('.alert').fadeOut('fast');
        }, 3000); // <-- time in milliseconds
    }
}

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