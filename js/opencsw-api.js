//++++++++++OpenCSW Endpoint API++++++++++//

/*	Debug for JSON
$(document).ready(function(){
$("#wum").click(function(){

var flickerAPI = "http://buildfarm.opencsw.org/pkgdb/rest/catalogs/unstable/sparc/SunOS5.10/pkgnames/CSWantiword/";
$.getJSON(flickerAPI, function(data) {
  $('#getJSON-results').html(JSON.stringify(data));
});

});
});
*/

// Endpoint request    Still to do, add catalog, and arch

$(document).ready(function(){
    //attach a jQuery live event to the button
    $("#button1").on("click", function(){
    		var pkgname = $("#pkgname_search").val();
    		var opencswAPI = "http://buildfarm.opencsw.org/pkgdb/rest/catalogs/unstable/sparc/SunOS5.10/pkgnames/CSW" + pkgname +"/";
        		$.getJSON(opencswAPI, function(data) {
        			$("#stage").html("<div> Name : " + data.maintainer_full_name + "</div>");
        			$("#stage").append("<a> Email : "  + data.maintainer_email + "</a");
        			$("#stage").append("<div> Basename : " + data.basename + "</div>");
        			$("#stage").append("<div> Version : " + data.version_string + "</div>");
        	});
      });
});



