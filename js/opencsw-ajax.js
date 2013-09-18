function OsrelMap() {
  return  {
    "SunOS5.8": "5-8",
    "SunOS5.9": "5-9",
    "SunOS5.10": "5-10",
    "SunOS5.11": "5-11",
  };
}

function OsrelMapDot() {
  return {
    "SunOS5.8": "5.8",
    "SunOS5.9": "5.9",
    "SunOS5.10": "5.10",
    "SunOS5.11": "5.11",
  };
};

function catalogId(catalog, arch, osrel) {
  var osrel_map = OsrelMap();
  return "#" + catalog + "-" + arch + "-" + osrel_map[osrel];
}*/

function MakeAjaxCall(url, table_cell, catalogname, arch, osrel) {
  $.getJSON(url, function(data2) {
    $(table_cell).empty();
    html_to_write = (
      "<span><a href=\"http://buildfarm.opencsw.org/pkgdb/srv4/"
      + data2.md5_sum + "/\" title=\"packaged by "
      + data2.maintainer_full_name + "\">" + data2.version + "</a>"
      + " "
      + "<a title=\"Download " + data2.version
      + "\" class=\"download-link\" href=\"http://mirror.opencsw.org/"
      + catalogname + "/" + arch + "/" + osrel
      + '/'
      + data2.maintainer_full_name
      + "\">[↓]</a>"
      + "</span>");

    $(html_to_write).appendTo(table_cell);
  })
  .fail(function() {
    console.log("Fetching " + url + " failed.")
    $(table_cell).empty();
    $("<span>not found</span>").appendTo(table_cell);
  });
}

function AddPackageInCatalog(catalog, arch, osrel, catalogname) {
  var url = (
      'http://buildfarm.opencsw.org/pkgdb/rest/catalogs/'
      + catalog + "/" + arch
      + '/' + osrel + '/catalognames/' + catalogname + '/');
  table_cell = catalogId(catalog, arch, osrel);
  $(table_cell).empty();
  $("<span style=\"color: #AAA;\">.test</span>").appendTo(table_cell);
  var osrel_map_dot = OsrelMapDot();
  // The call below has to be rolled into a function to allow storing current
  // variable values. Otherwise it doesn't work, e.g. all calls result in the
  // 'legacy' column are updated instead of the correct cells.
  MakeAjaxCall(url, table_cell, catalogname, arch, osrel_map_dot[osrel]);
}

function UpdateMatrix(catalogname) {
  // The list of catalogs is hardcoded; but could be also fetched via REST
  var catalognames = {unstable: 1, kiel: 2, dublin: 3, legacy: 4};
  var archs = {sparc: 1, i386: 2};
  var osrels = OsrelMapDot();
  for (c in catalognames) {
    for (a in archs) {
      for (o in osrels) {
        // Because if variable scoping, this has to be wrapped in a function.
        // The resulting list is not sorted, because of asychronous calls.
        AddPackageInCatalog(c, a, o, catalogname);
      }
    }
  }
}
function ProcessUserInput() {
  $("#version_matrix > tbody > tr > td.data").empty();
  var catalogname = $("#catalogname_field").val();
  UpdateMatrix(catalogname);
  return false;
}

function SetUpAjax() {
  $("form#catalogname").submit(ProcessUserInput);
  $("#catalogname_field").focus();
}

$(document).ready(SetUpAjax);
