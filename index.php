<!-- Welcome to openCSW 2.0 -->
<!-- THis is the first design for openCsw by Daniel Takahahashi-Schwarz -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="../../assets/ico/favicon.png">

    <title>openCSW</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="css/jumbotron.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="../../assets/js/html5shiv.js"></script>
      <script src="../../assets/js/respond.min.js"></script>
    <![endif]-->
    
     <style type="text/css">
      body, p, th, td {
        font-family: sans-serif;
        font-size: 13px;
      }
      table#version_matrix {
        border: 1px solid gray;
      }
      table#version_matrix td {
        margin: 3px;
        border: 1px solid #DDD;
        padding: 2px;
        width: 20em;
      }
      a.download-link {
        text-decoration: none;
      }
      .background{
      background-image: url("img/Green.jpg");
      }
      .background-main{
      background-image: url("");
      }
      
      
      
    </style>
    
	<script language="JavaScript" type="text/javascript"> 
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
	if(!d.getElementById(id)){js=d.createElement(s);
	js.id=id;js.src=p+"://platform.twitter.com/widgets.js";
	fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
	
	function makeFrame() {
    ifrm = document.createElement("IFRAME"); 
   	ifrm.setAttribute("src", "http://wiki.opencsw.org/");
   	ifrm.style.width = 1024+"px";
   	ifrm.style.height = 480+"px";
   	document.body.appendChild(ifrm); 
   	}
   	
   	function ajaxStart(){
        document.getElementById('loadingImage').style.visibility='visible';
        
    }
    
    

$(document).ready(function() {
        $("#content div").hide(); // Initially hide all content
        $("#tabs li:first").attr("id","current"); // Activate first tab
        $("#content div:first").fadeIn(); // Show first tab content
 
    $('#tabs a').click(function(e) {
        e.preventDefault();
        $("#content div").hide(); //Hide all content
        $("#tabs li").attr("id",""); //Reset id's
        $(this).parent().attr("id","current"); // Activate this
        $('#' + $(this).attr('title')).fadeIn(); // Show content for current tab
    });
})();
	</script>
    
  </head>

  <body class="background-main">

    <div class="navbar navbar-static-top">
      <div class="container backrground-img">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">OpenCSW</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Documentary <b class="caret"></b></a>
              <ul class="dropdown-menu">
                <li><a href="#">Tutorials</a></li>
                <li><a href="#">Manuals</a></li>
                <li><a href="#" onclick="makeFrame()">Wiki</a></li>
                <li class="divider"></li>
                <li class="dropdown-header">Nav header</li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">One more separated link</a></li>
              </ul>
            </li>
          </ul>
         
        </div><!--/.navbar-collapse -->
      </div>
    </div>
    <div id="iframe">
    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron background">
      <div class="container">
        <h1>Hello, world!</h1>
        <p>Welcome to our new OpenCSW homepage. Get started with OpenCSW in just three steps</p>
        
    
        		<a class="btn btn-danger btn-lg" >Step 1 &raquo;</a>
        		<a class="btn btn-warning btn-lg">Step 2 &raquo;</a>
        		<a class="btn btn-primary btn-lg">Step 3 &raquo;</a>
      </div>
    </div> <!-- Close Jumbotron -->

    <div class="container">
      <!-- Example row of columns -->
      <div class="row">
        <div class="col-lg-4 colcustom1">
         <a class="twitter-timeline"  href="https://twitter.com/opencsw"  data-widget-id="378852664013885440">Tweets von @opencsw</a>
        </div>
        <div class="col-lg-4 colcustom2">
        
     		<div class="tabbable">
  				<ul class="nav nav-tabs">
    			<li class="active"><a href="#pane1" data-toggle="tab">Tab 1</a></li>
    			<li><a href="#pane2" data-toggle="tab">Tab 2</a></li>
    			<li><a href="#pane3" data-toggle="tab">Tab 3</a></li>
    			<li><a href="#pane4" data-toggle="tab">Tab 4</a></li>
  				</ul>
  			<div class="tab-content">
    			<div id="pane1" class="tab-pane active">
      				<h4>The Markup</h4>
      				<pre>
      <form id="catalogname">
      <input id="catalogname_field" type="text" value="mysql5"></input>
    </form>
    
    <div id="button1">
<a class="btn btn-primary"> Request Package Information </a>
</div>

<div>
<div id="stage">

</div>
</div>

    <table id="version_matrix">
      <tbody>
        <tr>
          <th>system</th>
          <th>unstable</th>
          <th>kiel</th>
          <th>dublin</th>
          <th>legacy</th>
        </tr>
        <tr>
          <td>sparc 5.8</td>
          <td id="unstable-sparc-5-8" class="data"></td>
          <td id="kiel-sparc-5-8" class="data"></td>
          <td id="dublin-sparc-5-8" class="data"></td>
          <td id="legacy-sparc-5-8" class="data"></td>
        </tr>
        <tr>
          <td>i386 5.8</td>
          <td id="unstable-i386-5-8" class="data"></td>
          <td id="kiel-i386-5-8" class="data"></td>
          <td id="dublin-i386-5-8" class="data"></td>
          <td id="legacy-i386-5-8" class="data"></td>
        </tr>
        <tr>
          <td>sparc 5.9</td>
          <td id="unstable-sparc-5-9" class="data"></td>
          <td id="kiel-sparc-5-9" class="data"></td>
          <td id="dublin-sparc-5-9" class="data"></td>
          <td id="legacy-sparc-5-9" class="data"></td>
        </tr>
        <tr>
          <td>i386 5.9</td>
          <td id="unstable-i386-5-9" class="data"></td>
          <td id="kiel-i386-5-9" class="data"></td>
          <td id="dublin-i386-5-9" class="data"></td>
          <td id="legacy-i386-5-9" class="data"></td>
        </tr>
        <tr>
          <td>sparc 5.10</td>
          <td id="unstable-sparc-5-10" class="data"></td>
          <td id="kiel-sparc-5-10" class="data"></td>
          <td id="dublin-sparc-5-10" class="data"></td>
          <td id="legacy-sparc-5-10" class="data"></td>
        </tr>
        <tr>
          <td>i386 5.10</td>
          <td id="unstable-i386-5-10" class="data"></td>
          <td id="kiel-i386-5-10" class="data"></td>
          <td id="dublin-i386-5-10" class="data"></td>
          <td id="legacy-i386-5-10" class="data"></td>
        </tr>
        <tr>
          <td>sparc 5.11</td>
          <td id="unstable-sparc-5-11" class="data"></td>
          <td id="kiel-sparc-5-11" class="data"></td>
          <td id="dublin-sparc-5-11" class="data"></td>
          <td id="legacy-sparc-5-11" class="data"></td>
        </tr>
        <tr id="test">
          <td>i386 5.11</td>
          <td id="unstable-i386-5-11" class="data"></td>
          <td id="kiel-i386-5-11" class="data"></td>
          <td id="dublin-i386-5-11" class="data"></td>
          <td id="legacy-i386-5-11" class="data"></td>
        </tr>
      </tbody>
    </table>
    
    		<div id="loading"> <!-- ajax and button -->
          	<a class="btn btn-primary btn-lg" onclick="ajaxStart()">Step 3 &raquo;</a>
  			<p><img id="loadingImage" src="img/ajax-loader.gif" style="visibility:hidden"></p>
			</div>
      				
      		</pre>
    		</div>
    			<div id="pane2" class="tab-pane">
    				<h4>Pane 2 Content</h4>
      				<p> and so on ...</p>
    			</div>
    			<div id="pane3" class="tab-pane">
      				<h4>Pane 3 Content</h4>
    			</div>
    			<div id="pane4" class="tab-pane">
      				<h4>Pane 4 Content</h4>
    			</div>
  			</div><!-- /.tab-content -->
			</div><!-- /.tabbable -->
		</div> <!-- /. col-lg-4 -->
	
       </div>
      </div> <!-- / row -->


      <footer>
        <p>&copy; Company 2013</p>
      </footer>
    </div> <!-- /container -->
   </div> <!-- /close iframe -->

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->

    <script src="js/jquery.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/opencsw-ajax.js"></script>
    <script src="js/jquerydev.js"></script>
    <script src="http://code.jquery.com/jquery-1.6.3.min.js"></script>
    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
  </body>
</html>