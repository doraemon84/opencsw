//++++++++++OpenCSW Endpoint API++++++++++//

/*	Debug for JSON
$(document).ready(function(){
$("#wum").click(function(){

var opencswAPI = "http://buildfarm.opencsw.org/pkgdb/rest/catalogs/unstable/sparc/SunOS5.10/pkgnames/CSWantiword/";
$.getJSON(opencswAPI, function(data) {
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
        		
        		
        			$("#stageA").html("<h3>"+ data.pkgname + "</h3><h4>" + data.osrel + "</h4>");
        			$("#stageB").html("<b>Maintainer</b> : " + data.maintainer_full_name + "");
        			$("#stageC").html("<b>Email</b> : <a>" + data.maintainer_email +"</a>");
        			$("#stageD").html("<br><b> Architecture</b> : "  + data.arch + "</br>");
        			$("#stageE").html("<span> Version : " + data.version_string + "</span>");
        			//SunOS 5.10 // i386 & sparc
        			var opencswAPI = "http://buildfarm.opencsw.org/pkgdb/rest/catalogs/unstable/i386/SunOS5.10/pkgnames/CSW" + pkgname +"/";
        			$.getJSON(opencswAPI, function(data) {
         			$("#stage2A").html("<br><b>Architecture</b> : "  + data.arch + "</br>");
        			$("#stage2B").html("<p> Version : " + data.version_string + "</p>");
        			});
        			
        	});
      });
});



