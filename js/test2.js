/**
* flok.li_lib.js
* Manage the UI for the flocks display
*/

// Some global variables
// fix sub nav on scroll
var $win = $(window);
var $nav, navTop;
var isNavBarFixed = false;

var twitter_anywhere_identity,
	twitter_session;

var friends_count = 776;
var followers_count = 347;

var editing_flocks = false;
var flocks_changed = false;
var members_changed = false;

var showing_members = false;

var members_cache = new Array();
var query_cache = new Array();
var users_cache = new Array();
var DMs_cache = new Array();
var friends_cache = new Array();
var followers_cache = new Array();

var DMs_search_source = new Array();
var friends_search_source = new Array();
var followers_search_source = new Array();

// Execute this even before the page fully loads
twttr.anywhere( function (T) {

	var currentUser,
		userName,
		profileImage,
		profileImageTag;

	if (T.isConnected()) {
		twitter_anywhere_identity = $.cookie( 'twitter_anywhere_identity');
		currentUser = T.currentUser;
		userName = $.trim(currentUser.data('name'));
		screenName = $.trim(currentUser.data('screen_name'));
		friends_count = $.trim(currentUser.data('friends_count'));
		followers_count = $.trim(currentUser.data('followers_count'));
		profileImage = $.trim(currentUser.data('profile_image_url'));
		profileImageTag = '<a class="pull-right visible-phone">' +
							'<img class="avatar" src="' + profileImage + '" alt="' + userName + '" />' +
						'</a>' +
						'<a class="label pull-right visible-phone" onclick="twttr.anywhere.signOut();">Sign out @' + screenName + '</a>' +
						'<span class="account-menu hidden-phone">' +
							'<ul class="nav">' +
								'<li class="dropdown">' +
									'<a class="dropdown-toggle" data-toggle="dropdown">' +
										'<img class="avatar pull-right" src="' + profileImage + '" alt="' + userName + '" />' +
										'<b class="caret"></b>' +
									'</a>' +
									'<ul class="dropdown-menu">' +
										'<li><a style="cursor: default;">' + userName + '</a></li>' +
										'<li><a style="cursor: default;">' + $.trim(currentUser.data('location')) + '</a></li>' +
										'<li class="divider"></li>' +
										'<li><a style="cursor: default;"><span class="badge">' + $.trim(currentUser.data('statuses_count')) + '</span> statuses</a></li>' +
										'<li><a style="cursor: default;"><span class="badge">' + $.trim(currentUser.data('favourites_count')) + '</span> favourites</a></li>' +
										'<li><a style="cursor: default;"><span class="badge">' + $.trim(currentUser.data('friends_count')) + '</span> following</a></li>' +
										'<li><a style="cursor: default;"><span class="badge">' + $.trim(currentUser.data('followers_count')) + '</span> followers</a></li>' +
										'<li class="divider"></li>' +
										'<li><a onclick="signOut();" href="#">Sign out @' + screenName + '</a></li>' +
									'</ul>' +
								'</li>' +
							'</ul>' +
						'</span>';

		$('#account').html(profileImageTag);
		$('#account').removeClass().addClass("account");

		// Setup Twitter buttons
		var tweetCount = "";
		var followCount = "true";
		var showScreenName = "true"

	} else {

		if ($.cookie( 'twitter_anywhere_identity') != null) {
			// Not connected with Twitter so delete the cookie and reload
			$.cookie( 'twitter_anywhere_identity', null, {path: '/'} );
			$.cookie( 'twitter_anywhere_identity', null, {path: '/alpha/'} );
			window.location.reload;

		} else {

			// User not connected, so delete the cookie
			$.cookie( 'twitter_anywhere_identity', null, {path: '/'} );
			$.cookie( 'twitter_anywhere_identity', null, {path: '/alpha/'} );
			$('#account').removeClass().addClass("connect");
			T('#account').connectButton({ size: 'medium' });

			// Setup Twitter buttons
			var tweetCount = "none";
			var followCount = "false";
			var showScreenName = "false"
		}
	};
	$('#nav-social').html('<a id="tweet-btn" class="twitter-share-button" href="https://twitter.com/share" data-count="' + tweetCount +
							'" data-url="http://flok.li" data-related="flok_li:Tweet to flocks,2flk:Follow to tweet to flocks" data-via="cubidea" data-lang="en">Tweet</a>' +
							'<a id="follow-btn" class="twitter-follow-button" href="https://twitter.com/flok_li" data-show-count="' + followCount +
							'" data-show-screen-name="' + showScreenName + '" data-lang="en">Follow @flok_li</a>'
	);
	twttr.widgets.load();

	T.bind('authComplete', function (event, user) {
		// triggered when auth completed successfully
		event.preventDefault();
		event.stopPropagation();
		window.location.reload();
	});

	T.bind('signOut', function (event) {
		// triggered when user logs out
		event.preventDefault();
		event.stopPropagation();
	});

});

/*
// Add Twitter "Tweet" and "Follow" buttons
!function(d,s,id){
	var js,fjs=d.getElementsByTagName(s)[0];
	if(!d.getElementById(id)){
		js=d.createElement(s);
		js.id=id;
		js.src="//platform.twitter.com/widgets.js";
		fjs.parentNode.insertBefore(js,fjs);
	}
}
(document,"script","twitter-wjs");
*/

// Use jQuery to simplify the programming
// All Javascript programmers should learn jQuery!
jQuery(document).ready(function($){

	/***** Initial page load *****/
	var pageName = pageFileName();

	$.ajaxSetup({
		cache: false /*,
		error:function(x,e){
			if(x.status==0){
				alert('You are offline!!\n Please Check Your Network.');
			} else if(x.status==404){
				alert('Requested URL not found.');
			} else if(x.status==500){
				alert('Internet Server Error.');
			} else if(x.status==503){
				alert('Service Unavailable.');
			} else if(e=='parsererror'){
				alert('Error.\nParsing JSON Request failed.');
			} else if(e=='timeout'){
				alert('Request Time out.');
			} else {
				alert('Unknow Error.\n'+x.responseText);
			}
		}*/
	});


	// Activate navbar menu item
	$('ul[id="nav-menu"] > li > a[href="' + pageName + '"]').parent().attr("class","active");

	switch (pageName) {
		case 'start.php':
			twttr.anywhere(function (T) {
				if (T.isConnected()) {
					$('#start-connect').html("You are connected as @" + T.currentUser.data('screen_name'));
					T('#start-connect').hovercards({ expanded: true });
				} else {
					T('#start-connect').connectButton({ size: 'medium' });
				}
				T('#start-follow-2flk').followButton("2flk");
			});
			break;

		case 'main.php':
			twttr.anywhere(function (T) {
				if (!(T.isConnected())) {
					// Offer to reconnect with Twitter
					T('#start-connect').connectButton({ size: 'medium' });

				} else {

					// Initialize the page

					// Load flock list
					$(load_flocks());

					// If session expired - sign out the user
					// Original: https://github.com/ehynds/jquery-idle-timeout
					// http://www.erichynds.com/jquery/a-new-and-improved-jquery-idle-timeout-plugin

					// Time (seconds) before warning alert time-out
					var $warningTimeOut = 30;

					// Cache a reference to the countdown and progress bar elements, so
					// we don't have to query the DOM for it on each ping.
					var $countdown = $("#timeout-countdown");
					var $progress_bar = $('#timeout-progress-bar').children('.bar');

					// start the idle timer plugin
					$.idleTimeout('#timeout-alert', '#timeout-stay-btn', {
						warningLength: $warningTimeOut,
						idleAfter: 1800,							// Session time-out: 30 minutes
						pollingInterval: 300,						// Poll server every: 5 minutes
						keepAliveURL: 'keepalive.php',
						serverResponseEquals: 'OK',
						onTimeout: function(){
							$countdown.html("0"); // update the counter
							$progress_bar.attr("style","width: 0%");
							$(timeOut());
						},
						onIdle: function(){
							$('#timeout-alert').modal();

						},
						onCountdown: function(counter){
							$countdown.html(counter); // update the counter
							window.setTimeout(function(){
								$progress_bar.attr("style","width: " + Math.floor(parseInt((counter/$warningTimeOut)*100)) + "%");
							},1);
						}
					});

					$('#timeout-logoff-btn').unbind("click").click(
						function (event) {
							$(signOut());
					});

//					twttr.anywhere(function (T) {
						T('.alert').hovercards({ expanded: true });
						T('#start-follow-2flk').followButton("2flk");
//					});

					$('#flocks-carousel').carousel({
						interval: 0,
						pause: ''
					});
					$('#flocks-carousel').carousel('pause');
	
					$('#edit-flocks-btn').tooltip();
					$('#new-flock-btn').tooltip();
					$('#edit-members-btn').tooltip();
/*					$('#date').datepicker({
						altField: "#schedule-date",
						altFormat: "DD, d MM, yy"
					});
					$('#datepicker').unbind("click").click(
						function(event){
							event.preventDefault();
							event.stopPropagation();
							$('#date').datepicker("show");
						}
					);
*/
					// Get flocks when the flock edit button is clicked
					$('#edit-flocks-btn').unbind("click").click(
						function(event){
							event.preventDefault();
							event.stopPropagation();
							$(edit_flocks($(this).attr("data-user-id")));
						}
					);

					// Get members when the members edit button is clicked
					$('#edit-members-btn').unbind("click").click(
						function(event){
							event.preventDefault();
							event.stopPropagation();
							$(maintain_members($('#member-list').attr("flock-id")));
						}
					);

					// Setup tabs
					$('#members-tabs a[data-toggle="tab"]').tooltip();
					$('#members-tabs a[data-toggle="tab"]').on('shown', function (e) {
						var active_tab = e.target.href.split('#')[1]; // activated tab
						var prev_tab = e.relatedTarget.href.split('#')[1]; // previous tab

						// Remove old content
						$('#member-list').html("");
						$('#member-list').hide();

						switch (active_tab) {
							case 'query-pane':
								if (query_cache.length > 0) {$(followers_by_query())}
								break;

							case 'search-pane':
								if (users_cache.length > 0) {$(search_followers())}
								break;

							case 'DMs-sent-pane':
								$('#edit-members-btn').hide();
								$(load_DMs_sent());
								break;

							case 'friends-pane':
								$('#edit-members-btn').hide();
								$('#friends-pane > span').hide();
								$('#users-filter-input').val("");
								$('#users-filter').appendTo('#friends-pane');
								$(reset_show_all_button());
								$(load_friends());
								break;

							case 'followers-pane':
								$('#edit-members-btn').hide();
								$('#followers-pane > span').hide();
								$('#users-filter-input').val("");
								$('#users-filter').appendTo('#followers-pane');
								$(reset_show_all_button());
								$(load_followers());
								break;
							default:
						}
					})

					// Send message when send message button is clicked
					$('#send-tweet-btn').unbind("click").click(
						function(event){
							event.preventDefault();
							event.stopPropagation();
							$('#tweet').attr("disabled", "disabled");
							$('#reset-tweet-btn').attr("disabled", "disabled");
							var btn = $(this);
							btn.attr("disabled", "disabled");
//							btn.button('loading');
							btn.html("<i class='icon-share-alt icon-white'></i> Sending...");
							$(send_message(
								$('#edit-flocks-btn').attr("data-user-id"),
								$('#member-list').attr("flock-id"),
								$('#tweet').val())
							);
						}
					);

					// Initialize counters
					$(init_flock_counters());

					// Initialize counter events
					$('#edit-flock-name').keyup(function() {
						$(init_flock_counters());
/*						if ($('#edit-flock-name').val().length == 0) {
							$('#save-flock-btn').attr("disabled", "disabled");
						} else {
							$('#save-flock-btn').removeAttr("disabled");
						}
*/						$(count_characters($(this), 20, $('#name-counter'), '20 chars max!'));
						$('#save-flock-btn').removeAttr("disabled");
						$('#name-group').removeClass("error");
						$('#validate-error').html("");
						if (!is_valid_input($(this), /^([a-zA-Z0-9_]*)$/)) {
							$('#save-flock-btn').attr("disabled", "disabled");
							$('#name-group').addClass("error");
							$('#validate-error').html('<strong style="color: red;">Letters, numbers and "_" only!</strong>');
						}
					});

					$('#edit-flock-desc').keyup(function() {
						$(count_characters($(this), 160, $('#desc-counter'), '160 chars max!'));
					});

					$('#clear-name-btn').unbind("click").click(
						function(event){
							event.preventDefault();
							event.stopPropagation();
							$('#edit-flock-name').val("");
							$(init_flock_counters());
						}
					);

					$('#edit-form').on('reset', function(e) {
						$('#edit-flock-name').val("");
						$('#edit-flock-desc').val("");
						$('#validate-error').html("");
						$('#name-group').removeClass("error");
						$(init_flock_counters());
						e.preventDefault();
					});


					$('#query-pane-form-query').keyup(function() {
						if ($('#query-pane-form-query').val().length > 0) {
							$('#query-pane-form-search-btn').removeAttr("disabled");
						} else {
							$('#query-pane-form-search-btn').attr("disabled","disabled");
						}
						$('#query-pane-form').removeClass("error");
					});


					$('#query-pane-form-help-btn').attr("data-content",
						'<b>twitter search</b><br>' +
						'<i>containing both "twitter" and "search"<br>' +
						'This is the default operator</i><br>' +
						'<br>' +
						'<b>"happy hour"</b><br>' +
						'<i>containing the exact phrase "happy hour"</i><br>' +
						'<br>' +
						'<b>love OR hate</b><br>' +
						'<i>containing either "love" or "hate" (or both)</i><br>' +
						'<br>' +
						'<b>beer -root</b><br>' +
						'<i>containing "beer" but not "root"</i><br>' +
						'<br>' +
						'<b>#haiku</b><br>' +
						'<i>containing the hashtag "haiku"</i><br>' +
						'<br>' +
						'<b>@twitterapi</b><br>' +
						'<i>mentioning @twitterapi</i><br>' +
						'<br>' +
						'<b><i>For more options, click on a button.</i></b>' +
						'<br>'
					)

					$('#query-pane-form-help-btn').popover({ placement : 'right' });

					$('#query-pane-form-reset-btn').unbind("click").click(
						function(event) {
							event.preventDefault();
							event.stopPropagation();
							$('#query-pane-form-query').val("");
							$('#query-pane-form-search-btn').attr("disabled", "disblaed");
					});

					$('#query-pane-form-search-btn').unbind("click").click(
						function(event){
							$(this).attr("disabled", "disblaed");
							event.preventDefault();
							event.stopPropagation();
							$(followers_by_query($('#query-pane-form-query').val()));
						}
					);


					$(init_search_counter());

					$('#search-pane-form-users').keyup(function() {
						$(init_search_counter());
						$(count_words($(this), $('#max-members').html(), $('#search-pane-form-counter'),
										$('#max-members').html()+' usernames max!'));
						$('#search-pane-form').removeClass("error");
						$('#search-pane-form-validate-error').html("");
						if (!is_valid_input($(this), /^([a-zA-Z0-9_,]*)$/)) {
							$('#search-pane-form-search-btn').attr("disabled", "disabled");
							$('#search-pane-form').addClass("error");
							$('#search-pane-form-validate-error').html('<strong style="color: red;">Letters, numbers and "_" only!</strong>');
						}
					});

					$('#search-pane-form-reset-btn').unbind("click").click(
						function(event) {
							event.preventDefault();
							event.stopPropagation();
							$('#search-pane-form-users').val("");
							$(init_search_counter());
							$(count_words($(this), $('#max-members').html(), $('#search-pane-form-counter'),
											$('#max-members').html()+' usernames max!'));
							$('#search-pane-form-search-btn').attr("disabled", "disabled");
					});

					$('#search-pane-form-search-btn').unbind("click").click(
						function(event){
							$(this).attr("disabled", "disabled");
							event.preventDefault();
							event.stopPropagation();
							$(search_followers($('#search-pane-form-users').val().replace(/^,+|,+$/, '').split(',')));
						}
					);


					$('#users-filter-clear-btn').unbind("click").click(
						function(event){
							event.preventDefault();
							event.stopPropagation();
							$('#users-filter-input').val("");
							$(hide_all_users());
							if ($('#users-filter-all-btn').attr("status") == "on") {
								$('#users-filter-all-btn').attr("status","off");
								$('#users-filter-all-btn').removeClass("btn-warning");
								$('#users-filter-all-btn').button("toggle");
							}
						}
					);

					$('#users-filter-all-btn').unbind("click").click(
						function(event){
							event.preventDefault();
//							event.stopPropagation();
							$('#users-filter-input').val("");
							if ($('#users-filter-all-btn').attr("status") == "off") {
								$('#users-filter-all-btn').attr("status","on");
								$('#users-filter-all-btn').addClass("btn-warning");
								$(show_all_users());
							} else {
								$('#users-filter-all-btn').attr("status","off");
								$('#users-filter-all-btn').removeClass("btn-warning");
								$(hide_all_users());
							}
						}
					);

					$(init_tweet_counter());

					$('#tweet').removeAttr("disabled");

					$('#tweet').keyup(function() {
						$(init_tweet_counter());
						$(count_characters($(this), 140, $('#tweet-counter'), '140 chars max!'));
					});


					$('#send-tweet').on('reset', function(e) {
						$('#tweet').val("");
						$(init_tweet_counter());
						e.preventDefault();
					});

				}
			});
			break;

		case 'howto.php':
			$nav = $('.subnav');
			navTop = $('.subnav').length && $('.subnav').offset().top - 40;

			processScroll();

			$win.on('scroll', processScroll);
			$('.subnav').scrollspy();
			break;

		case 'about.php':
			twttr.anywhere(function (T) {
				T('.container').hovercards({ expanded: true });
			});
			break;

		default:
	}

	twttr.anywhere(function (T) {
		T("#hovercard-cubidea").hovercards({ expanded: true });
	});

	/***** Initial page load *****/

});

/*************************************************************************************************/
/* Flocks functions																				 */
/*************************************************************************************************/

// Get flocks from the server
function load_flocks() {

	// Disable buttons, so they can't be clicked during refresh
	$('#edit-flocks-btn').hide();
	$('#new-flock-btn').hide();

	// Ask the server for flocks
	var url = $('#ajax-url').html() + 'get_flock_list.php';
	var url_params = { user_id: $('#flock-list').attr("user-id") }

	// Display a progress bar
	show_progress_bar($('#flock-list'),100,"info",true,true);
		
	$.get(url,url_params,
		function(result){
			// Add the server's response to the list
			flocks_html = $.trim(result);
			if (flocks_html == '') {
				flocks_html = '<strong>No flocks defined.<br>Click <i class="icon-plus"></i> button to create new flock.</strong>';
			}
			$('#flock-list').html('<ul class="nav nav-pills nav-stacked">' +
									flocks_html +
									'</ul>');
		})
		// Wait for load to complete
		.complete(function() {

			if (flocks_changed) {
				edify_flocks();
				toggle_newflockbtn();
				$(invalidate_cache(members_cache));
				members_changed = true;
				$('#member-list').attr('members',"");
				flocks_changed = false;
			} else {
				// Re-enable flock list clicks
				$(normalize_flocks());
				$(linkify_flocks());

				// Re-enable the buttons
//				$('#edit-flocks-btn').show();

				// Reload members
//				load_members($('li[data-flock-id][class="active"]').attr("data-flock-id"));
			}

			// Remove progress bar
			remove_progress_bar('#flock-list');

			// Re-enable the buttons
			$('#new-flock-btn').show();
			$('#edit-flocks-btn').show();
		});
}


function edit_flocks(user_id) {
	// Maintain members when the edit flock button is clicked

	if (user_id) {
		editing_flocks = true;

		// Hide buttons & views, so they can't be clicked during refresh
//		if ($('#member-list').attr('members').length > 0) {
			$('#flock-list > ul > li.active').removeClass("active").addClass("was-active");
			$('#edit-members-btn').hide();
			$('#flock-desc').hide();
			$('#member-list').hide();
////			$('#calendar-btn').hide();
			$('#send-tweet').hide();
//		}

		// Change the title
		$('#flock-legend').html('Maintain flocks...');

		$(edify_flocks());

		$(toggle_newflockbtn());

	} else {

		// Hide the "Add new flock" button
		$('#new-flock').hide();

		// Restore the function of flock items
		$(normalize_flocks());
		$(linkify_flocks());

		// Restore the state of buttons
		$('#edit-flocks-btn').unbind("click").click(
			function(event){
				event.preventDefault();
				event.stopPropagation();
				$(edit_flocks($(this).attr("data-user-id")));
			}
		);

		$("#edit-flocks-btn > i").removeClass("icon-white");
		$("#edit-flocks-btn").removeClass("btn-danger");

		// Restore the title
		$('#flock-legend').html('1. Select flock...');

		// Restore state of buttons & views
		if ($('#flock-list > ul > li.active').length > 0) {
			if ($('#member-list').attr('members').length > 0) {
//				$("#calendar-btn").show();
				$("#send-tweet").show();
			}
			$("#edit-members-btn").show();
			$('#member-list').show();
			if ($('#flock-desc > ul > li > a').html().length > 0) {
				$('#flock-desc').show();
			}
		}
//		$('li[data-flock-id][class="was-active"]').removeClass("was-active").addClass("active");
		editing_flocks = false;
	}
}


function edit_flock(flock_id) {
	if (flock_id) {
		$('#flock-legend').html('Edit flock...');
		// Fill the form with flock data
		$('#edit-flock-name').val($('li[data-flock-id="' + flock_id + '"]').attr("data-flock-name"));
		$('#edit-flock-desc').val($('li[data-flock-id="' + flock_id + '"]').attr("data-flock-desc"));

		// Add the function to the "Save" button on the flock edit form
		$('#save-flock-btn').unbind("click").click(
			function(event){
				event.preventDefault();
				event.stopPropagation();
				if (is_duplicatename(flock_id,$('#edit-flock-name').val())) {
					$('#name-group').addClass("error");
					$('#validate-error').html('<strong style="color: red;">Duplicate name!</strong>');
				} else {
					$('#name-group').removeClass("error");
					$('#validate-error').html("");
					$(save_flock(flock_id));
				}
			}
		);
	} else {
		$('#flock-legend').html('Add flock...');
		// Clear the form
		$('#edit-flock-name').val("");
		$('#edit-flock-desc').val("");

		// Add the function to the "Save" button on the flock edit form
		$('#save-flock-btn').unbind("click").click(
			function(event){
				event.preventDefault();
				event.stopPropagation();
				if (is_duplicatename(null,$('#edit-flock-name').val())) {
					$('#name-group').addClass("error");
					$('#validate-error').html('<strong style="color: red;">Duplicate name!</strong>');
				} else {
					$('#name-group').removeClass("error");
					$('#validate-error').html("");
					$(save_flock());
				}
			}
		);
	}
	$(init_flock_counters());
	$('#edit-flocks-btn').attr("data-original-title", "Back");
	$('#edit-flocks-btn > span').html("Back");
	$('#flocks-carousel').carousel('next');
	$('#edit-flocks-btn > i').removeClass("icon-check").addClass("icon-chevron-left");
	$('#edit-flocks-btn').unbind("click").click(
		function(event){
			event.preventDefault();
			event.stopPropagation();
			$(init_flockspane());
		}
	);
}


function save_flock(flock_id) {

	// Disable buttons & form fields
	$('#edit-flock-name').attr("disabled", "disabled");
	$('#edit-flock-desc').attr("disabled", "disabled");
	$('#clear-name-btn').attr("disabled", "disabled");
	$('#save-flock-btn').attr("disabled", "disabled");
	$('#reset-flock-btn').attr("disabled", "disabled");
	$('#edit-flocks-btn').attr("disabled", "disabled");

	// Save flock
	var url = $('#ajax-url').html() + 'flock.php';
	var url_params;
	if (!flock_id) {
		url_params = {
			name: $('#edit-flock-name').val(),
			desc: $('#edit-flock-desc').val()
		}
	} else {
		url_params = {
			id: flock_id,
			name: $('#edit-flock-name').val(),
			desc: $('#edit-flock-desc').val()
		}
	}

	// Display a progress bar
	show_progress_bar($('#edit-flock'),100,"info",true,true);

	$.get(url, url_params, function(result) {
			// Get server's response
			var flock_id = $.trim(result);
			if (flock_id != '-1') {
				flocks_changed = true;
			}
		})
		// Wait for load to complete
		.complete( function() {

			// Remove a progress bar
			remove_progress_bar($('#edit-flock'));

			if (flocks_changed) {
				load_flocks();
			}

			// Re-enable buttons
			$('#edit-flocks-btn').removeAttr("disabled");
			$('#reset-flock-btn').removeAttr("disabled");
			$('#save-flock-btn').removeAttr("disabled");
			$('#clear-name-btn').removeAttr("disabled");
			$('#edit-flock-desc').removeAttr("disabled");
			$('#edit-flock-name').removeAttr("disabled");
			
			$(init_flockspane());
		}
	);
}


function delete_flock(flock_id) {

	// Disable buttons & form fields
	$('#edit-flocks-btn').attr("disabled", "disabled");
	$('#new-flock-btn').attr("disabled", "disabled");
	$('#del-flock-btn').attr("disabled", "disabled");

	// Delete flock
	var url_params;
	if (flock_id) {
		url_params = {
			id: flock_id
		}
		var url = $('#ajax-url').html() + 'flock.php';

		// Display a progress bar
		show_progress_bar($('#flock-list'),100,"info",true,true);

		$.get(url, url_params, function(result) {
				// Get server's response
				var flock_id = $.trim(result);
				if (flock_id != '-1') {
					flocks_changed = true;
				}
			})
			// Wait for load to complete
			.complete( function() {
				// Remove a progress bar
				remove_progress_bar($('#flock-list'));

				if (flocks_changed) {
					load_flocks();
				}

				// Re-enable buttons
				$('#del-flock-btn').removeAttr("disabled");
				$('#new-flock-btn').removeAttr("disabled");
				$('#edit-flocks-btn').removeAttr("disabled");
			}
		);
	}
}


function normalize_flocks() {
	// Remove the "Delete" buttons
	$('a[data-toggle="tab"] > a').remove();

	if ($('#flock-list > ul').children('li').length == 0) {
		$('#edit-flocks-btn').attr("data-original-title", "Add");
		$('#edit-flocks-btn > span').html("Add");
		$('#edit-flocks-btn > i').removeClass("icon-edit").addClass("icon-plus");
	} else {
		$('#edit-flocks-btn').attr("data-original-title", "Edit");
		$('#edit-flocks-btn > span').html("Edit");
		$('#edit-flocks-btn > i').removeClass("icon-plus").addClass("icon-edit");
	}
	$('#flock-list > ul > li').removeClass("active");
	$('#flock-list > ul > li > a > i').removeClass("icon-white");
	$('#flock-list > ul > li.was-active > a > i').addClass("icon-white");
	$('#flock-list > ul > li.was-active').removeClass("was-active").addClass("active");
}


function edify_flocks() {
//	$(normalize_flocks());

	$('#edit-flocks-btn').addClass("btn-danger");
	$('#edit-flocks-btn').attr("data-original-title", "Finish");
	$('#edit-flocks-btn > span').html("Finish");
	$('#edit-flocks-btn > i').removeClass("icon-edit icon-plus").addClass("icon-check icon-white");
	$('#edit-flocks-btn').unbind("click").click(
		function(event){
			event.preventDefault();
			event.stopPropagation();
			$(edit_flocks());
		}
	);

	// Prepend the "Delete" button
	$('a[data-toggle="tab"]').each(function(){
		$(this).prepend('<a id="del-flock-btn" data-flock-id="' + $(this).parent().attr("data-flock-id") +
//						'" class="btn btn-danger del-btn" href="#" title="Delete">' +
						'" class="badge badge-error" href="#" title="Delete">' +
						'<i class="icon-minus icon-white"></i></a>&nbsp;')
	});
	$('a[id="del-flock-btn"]').tooltip();
	$('a[id="del-flock-btn"]').each(function(){
		$(this).unbind("click").click(
			function(event){
				event.preventDefault();
				event.stopPropagation();
				var flock_id = $(this).attr("data-flock-id");
				$('#alert-ok-btn').addClass("btn-danger");
				$('#alert-ok-btn').unbind("click").click(
					function(event){
						event.preventDefault();
						event.stopPropagation();
						$('#alert').one('hidden', function(){
							delete_flock(flock_id);
						});
						$('#alert').modal('hide');
					}
				);
				$('#alert').modal();
			}
		);
	});

	// Change the function of flock item
	$('a[data-toggle="tab"] > i').removeClass("icon-white");
//	$('li[data-flock-id][class="active"]').removeClass("active").addClass("was-active");
	$('li[data-flock-id]').unbind("click").click(
		function(event){
			event.preventDefault();
			event.stopPropagation();
			$(edit_flock($(this).attr("data-flock-id")));
		}
	);
}


function linkify_flocks() {
	// Get members when the flock is clicked
	$('li[data-flock-id]').unbind("click").click(
		function(event){
			event.preventDefault();
//			event.stopPropagation();
			$('li[data-flock-id] > a > i').removeClass("icon-white");
			$(this).children().children().addClass("icon-white");
			$(load_members($(this).attr("data-flock-id")));
		}
	);
}


function delinkify_flocks() {
	// Disable flocks while editing members
	$('li[data-flock-id]').unbind("click");
}


function init_flockspane() {
	$('#flock-legend').html('Maintain flocks...');
	$('li[data-flock-id]').removeClass("active");
	$('#edit-flocks-btn > i').removeClass("icon-chevron-left").addClass("icon-check");
	$('#edit-flocks-btn').attr("data-original-title", "Finish");
	$('#edit-flocks-btn > span').html("Finish");
	$('#edit-flocks-btn').unbind("click").click(
		function(event){
			event.preventDefault();
			event.stopPropagation();
			$(edit_flocks());
		}
	);
	$('#flocks-carousel').carousel('prev');
	$('#name-group').removeClass("error");
	$('#validate-error').html("");
}


// Enable or disable the "Add new flock" button according to the total number of flocks allowed
function toggle_newflockbtn() {
	$('#new-flock').show();
	if ($('li[data-flock-id]').size() < $('#max-flocks').html()) {
		$('#new-flock-btn').removeAttr("disabled");
		$('#new-flock-btn').unbind("click").click(
			function(event){
				event.preventDefault();
				event.stopPropagation();
				$(edit_flock(null));
			}
		);
		$('#new-flock-btn').attr("data-original-title", 'Add new flock');
	} else {
		$('#new-flock-btn').attr("disabled", "disabled");
		$('#new-flock-btn').attr("data-original-title", 'Max # of flocks reached (' + $('#max-flocks').html() + ')');
	}
}


/*************************************************************************************************/
/* Members functions																			 */
/*************************************************************************************************/

// Get users from the server when the flock button is clicked
function load_members(flock_id) {
	
	// Invalidate cache
	$(invalidate_cache(members_cache));
	members_changed = false;

	// Update flock members
	$('#member-list').attr('members', "");
	$('#member-list').attr("flock-id", flock_id);

	// Disable buttons, so they can't be clicked during refresh
	$('#edit-members-btn').hide();

	// Hide views during update
	$('#flock-desc').hide();
	$('#send-tweet').hide();
		
	// Remove old content
	$('#member-list').html("");
	$('#member-list').hide();

	// Display a progress indicator
	show_progress_bar($('#member-list'),100,"info",true,true);

	var url = $('#ajax-url').html() + 'get_members.php';
	var url_params = { id: flock_id }
	var members_ids = new Array();
	var max_members = $('#max-members').html();

	// Ask the server for members
	$.getJSON(url,url_params,function(json){
		remove_progress_bar($('#member-list'));
		show_progress_bar($('#member-list'),0,"success");

		// Get server's response
		$.each(json,function(i,user) {
			members_ids.push(user.id);
			members_cache.push({
					'json':user
				});
			$(update_progress_bar($('#member-list'),(members_ids.length/max_members)*100));
			});
		})
		// Wait for load to complete
		.complete(function() {

			if (members_cache.length > 0) {
				// Update flock members
				$('#member-list').attr('members', members_ids.join(","));

				$(render_users(members_cache, $('#member-list'), true));
				$('img.big-avatar').lazyload( { skip_invisible : false } );
				showing_members = true;

				// Remove progress bar
				window.setTimeout(function(){
					remove_progress_bar($('#member-list'), "slow");
					// Re-enable buttons & views
					$(render_members_title());
					$('#member-list').show();
					$(update_tweet_title($('#member-list').attr("user-id")));
					$('#send-tweet').show();
					$('#edit-members-btn').attr("data-original-title", "Edit");
					$('#edit-members-btn > span').html("Edit");
					$('#edit-members-btn > i').removeClass("icon-plus").addClass("icon-edit");
					$('#edit-members-btn').show();
				},1000);

			} else {
				// Update flock members
				$('#member-list').attr('members', "");

				$('#member-list').html('<strong>No members defined. Click <i class="icon-plus"></i> to add members.</strong>');

				showing_members = false;

				// Remove progress bar
				window.setTimeout(function(){
					remove_progress_bar($('#member-list'), "slow");
					$(render_members_title());
					// Re-enable buttons & views
					$('#member-list').show();
					$('#edit-members-btn').attr("data-original-title", "Add");
					$('#edit-members-btn > span').html("Add");
					$('#edit-members-btn > i').removeClass("icon-edit").addClass("icon-plus");
					$('#edit-members-btn').show();
				},1000);
			}
		});
}


function render_members_title() {
	var desc = $('li[data-flock-id="' +  $('#member-list').attr("flock-id") + '"]').attr("data-flock-desc");
	if (!desc) {
		desc = '&nbsp';
	}
	var members = $('#member-list').attr('members');
	$(render_title(desc, (members.length == 0) ? 0 : members.split(",").length, $('#max-members').html()));
}


function update_members_title() {
	var members = $('#member-list').attr('members');
	$(update_title(((members.length == 0) ? 0 : members.split(",").length), $('#max-members').html()));
}


function update_tweet_title(user_id) {
	var members = $('#member-list').attr('members').length;
	var dms = users_remaining_dms(user_id);

	$('#tweet-title-maxDMs').html(dms);

	if (dms < members) {
		$('#tweet-no-dms-alert').show();
	}

	$('#tweet-title > ul >li > a').tooltip();
}


function maintain_members(flock_id) {
	// Maintain members when the edit members button is clicked

	if (flock_id) {
		showing_members = false;

		// Disable flocks while editing members
		$(delinkify_flocks());

		// Hide buttons & views, so they can't be clicked during refresh
		$('li[data-flock-id]').unbind("click").click(
			function(event){
				event.preventDefault();
				event.stopPropagation();
			}
		);

		$('#edit-flocks-btn').hide();
//		$('#calendar-btn').hide();
		$('#send-tweet').hide();

		// Change the title
		$('#members-legend').html('Maintain members...');

		// Change the state of buttons
		$('#edit-members-btn').addClass("btn-danger");
		$('#edit-members-btn').attr("data-original-title", "Finish");
		$('#edit-members-btn > span').html("Finish");
		$('#edit-members-btn > i').removeClass("icon-edit").addClass("icon-check icon-white");
		$('#edit-members-btn').unbind("click").click(
			function(event){
				event.preventDefault();
				event.stopPropagation();
				$(maintain_members());
			}
		);

		// Show menu
		$('#users-filter').hide();
		$('#query-pane-form-query').val("");
		$('#query-pane-form-search-btn').attr("disabled", "disblaed");
		$('#search-pane-form-users').val("");
		$('#search-pane-form-search-btn').attr("disabled", "disblaed");
		$('#members-tabs a:first').tab('show');
		$('#members-tabs-content > div').removeClass("fade").removeClass("in").removeClass("active").addClass("fade");
		$('#query-pane').addClass("in active");
		$('#search-pane-form-counter').html($('#max-members').html());
		$('#members-tabs').show();
//		$('#search-pane').show("slow");

		$('#member-list').html("");

	} else {
		showing_members = true;

		// Invalidate caches
		$(invalidate_cache(users_cache));

		$(invalidate_cache(DMs_cache));
		$(invalidate_cache(DMs_search_source));

		$(invalidate_cache(friends_cache));
		$(invalidate_cache(friends_search_source));

		$(invalidate_cache(followers_cache));
		$(invalidate_cache(followers_search_source));

		$('#members-tabs-query-count').hide();
		$('#members-tabs-found-count').hide();
		$('#members-tabs-DMs-count').hide();
		$('#members-tabs-friends-count').hide();
		$('#members-tabs-followers-count').hide();

		$('#members-tabs-content > div').removeClass("in").removeClass("active");
		$('#members-tabs-select > ul > li').removeClass("active");

		$('#member-list').show();
		$('#users-filter').hide();
		$('#members-tabs').hide();

		if (members_changed) {
			// Reload members
			$(load_members($('#member-list').attr("flock-id")));
		} else {
			// Remove old content
			$('#member-list').html("");

			// Render from cache
			$(render_users(members_cache, $('#member-list'), true));
			$('img.big-avatar').lazyload( { skip_invisible : false } );
			showing_members = true;
		}

		// Restore the state of buttons
		$('#edit-members-btn').unbind("click").click(
			function(event){
				event.preventDefault();
				event.stopPropagation();
				$(maintain_members($('#member-list').attr("flock-id")));
			}
		);

		if ( $('#member-list').attr('members').length == 0) {
			$('#edit-members-btn').attr("data-original-title", "Add members");
			$("#edit-members-btn > i").removeClass("icon-edit icon-white").addClass("icon-plus");
			$('#edit-members-btn > span').html("Add");
		} else {
			$('#edit-members-btn').attr("data-original-title", "Maintain members");
			$("#edit-members-btn > i").removeClass("icon-plus icon-white").addClass("icon-edit");
			$('#edit-members-btn > span').html("Edit");
		}
		$("#edit-members-btn").removeClass("btn-danger");

		// Restore the title
		$('#members-legend').html('2. Maintain members...');

		// Restore state of buttons & views
		if ($('#member-list').attr('members').length > 0) {
			$("#send-tweet").show();
//			$("#calendar-btn").show();
		}
		$('#edit-flocks-btn').show();

		$(linkify_flocks());
	}
}


// Get users from the server when the search by query tab is selected
function followers_by_query(query) {

	// Disable buttons, so they can't be clicked during refresh
	$('#edit-members-btn').hide();
	$('#query-pane-form').hide();

	if (query == null || query.length == 0) {

		// Render from cache
		$(render_users(query_cache, $('#member-list'), true));
		$('img.big-avatar').lazyload( { skip_invisible : false } );

		// Re-enable buttons & views
		window.setTimeout(function(){
			$('#query-pane-form').show("slow");
			$('#member-list').show();
			$('#edit-members-btn').show();
		},1000);

	} else {
		// Invalidate cache
		$(invalidate_cache(query_cache));

		$('#member-list').html("");
		$('#member-list').hide();

		// Display a progress indicator
		show_progress_bar($('#member-list'),100,"info",true,true);

		var url = $('#ajax-url').html() + 'get_followers.php';
		var url_params = {
			id:		$('#member-list').attr("user-id"),
			q:	query
			}
		var users_ids = new Array();

		// Ask the server for users
		$.getJSON(url,url_params,function(json){
			remove_progress_bar($('#member-list'));
			show_progress_bar($('#member-list'),0,"success");
			// Get server's response
			$.each(json,function(i,user) {
				users_ids.push(user.id);
				query_cache.push({ 'json':user });
				$(update_progress_bar($('#member-list'),(users_ids.length/followers_count)*100));
				});
			})
			// Wait for load to complete
			.complete(function() {
	
				if (users_ids.length > 0) {
	
					$('#members-tabs-query-count').html((users_ids.length == 0) ? 0 : users_ids.length);
					$('#members-tabs-query-count').show();

					$(render_users(query_cache, $('#member-list'), true));
	
					// Remove progress bar
					window.setTimeout(function(){
						remove_progress_bar($('#member-list'));
						// Re-enable buttons & views
						$('#query-pane-form').show("slow");
						$('#member-list').show();
						$('#edit-members-btn').show();
					},1000);

				} else {
	
					$('#members-tabs-query-count').hide();

					$('#member-list').html('<strong>No followers found.</strong>');

					// Remove progress bar
					window.setTimeout(function(){
						remove_progress_bar($('#member-list'));
						// Re-enable buttons & views
						$('#query-pane-form').show("slow");
						$('#member-list').show();
						$('#edit-members-btn').show();
					},1000);

				}
		});
	}
}


// Get users from the server when the search by usernames tab is selected
function search_followers(usernames) {

	// Disable buttons, so they can't be clicked during refresh
	$('#edit-members-btn').hide();
	$('#search-pane-form').hide();

	if (usernames == null || usernames.length == 0) {

		// Render from cache
		$(render_users(users_cache, $('#member-list'), true));
		$('img.big-avatar').lazyload( { skip_invisible : false } );

		// Re-enable buttons & views
		window.setTimeout(function(){
			$('#search-pane-form').show("slow");
			$('#member-list').show();
			$('#edit-members-btn').show();
		},1000);

	} else {
		// Invalidate cache
		$(invalidate_cache(users_cache));

		$('#member-list').html("");
		$('#member-list').hide();

		// Display a progress indicator
		show_progress_bar($('#member-list'),100,"info",true,true);

		var url = $('#ajax-url').html() + 'get_users.php';
		var url_params = {
			id:		$('#member-list').attr("user-id"),
			names:	usernames.join(',')
			}
		var users_ids = new Array();

		// Ask the server for users
		$.getJSON(url,url_params,function(json){
			remove_progress_bar($('#member-list'));
			show_progress_bar($('#member-list'),0,"success");
			// Get server's response
			$.each(json,function(i,user) {
				users_ids.push(user.id);
				users_cache.push({ 'json':user });
				$(update_progress_bar($('#member-list'),(users_ids.length/usernames.length)*100));
				});
			})
			// Wait for load to complete
			.complete(function() {
	
				if (users_ids.length > 0) {
	
					$('#members-tabs-found-count').html((users_ids.length == 0) ? 0 : users_ids.length);
					$('#members-tabs-found-count').show();

					$(render_users(users_cache, $('#member-list'), true));
	
					// Remove progress bar
					window.setTimeout(function(){
						remove_progress_bar($('#member-list'));
						// Re-enable buttons & views
						$('#search-pane-form').show("slow");
						$('#member-list').show();
						$('#edit-members-btn').show();
					},1000);

				} else {
	
					$('#members-tabs-found-count').hide();

					$('#member-list').html('<strong>No friends found.</strong>');

					// Remove progress bar
					window.setTimeout(function(){
						remove_progress_bar($('#member-list'));
						// Re-enable buttons & views
						$('#search-pane-form').show("slow");
						$('#member-list').show();
						$('#edit-members-btn').show();
					},1000);

				}
		});
	}
}


// Get users from the server when the users DMs sent to tab is selected
function load_DMs_sent() {

	if (DMs_cache.length > 0) {

		// Render from cache
		$(render_users(DMs_cache, $('#member-list'), true));
		$('img.big-avatar').lazyload( { skip_invisible : false } );

		// Re-enable buttons & views
		window.setTimeout(function(){
			$('#member-list').show();
			$('#edit-members-btn').show();
		},1000);

	} else {
		// Invalidate cache
		$(invalidate_cache(DMs_cache));

		// Display a progress indicator
		show_progress_bar($('#member-list'),100,"info",true,true);

		var url = $('#ajax-url').html() + 'get_DMs_sent.php';
		var url_params = {id: $('#member-list').attr("user-id")}
		var users_ids = new Array();

		// Ask the server for users
		$.getJSON(url,url_params,function(json){
			remove_progress_bar($('#member-list'));
			show_progress_bar($('#member-list'),0,"success");
			// Get server's response
			$.each(json,function(i,user) {
				users_ids.push(user.id);
				DMs_cache.push({ 'json':user });
				$(update_progress_bar($('#member-list'),(users_ids.length/200)*100));
				});
			})
			// Wait for load to complete
			.complete(function() {
	
				if (users_ids.length > 0) {
	
					$('#members-tabs-DMs-count').html((users_ids.length == 0) ? 0 : users_ids.length);
					$('#members-tabs-DMs-count').show();

					$(render_users(DMs_cache, $('#member-list'), true));
					$('img.big-avatar').lazyload( { skip_invisible : false } );
	
					// Remove progress bar
					window.setTimeout(function(){
						remove_progress_bar($('#member-list'));
						// Re-enable buttons & views
						$('#member-list').show();
						$('#edit-members-btn').show();
					},1000);

				} else {
	
					$('#members-tabs-DMs-count').hide();

					$('#member-list').html('<strong>No followers found.</strong>');

					// Remove progress bar
					window.setTimeout(function(){
						remove_progress_bar($('#member-list'));
						// Re-enable buttons & views
						$('#member-list').show();
						$('#edit-members-btn').show();
					},1000);

				}
		});
	}
}


// Get followers the user is also following from server when the Friends tab is selected
function load_friends() {

	// Check if we have cached friends
	if (friends_cache.length > 0) {

		// Render from cache
		$(render_users(friends_cache, $('#member-list')));

		$(search_typeahead(friends_cache, friends_search_source));

		// Re-enable buttons & views
		window.setTimeout(function(){
			$('#users-filter').show();
			$('#friends-pane > span').show();
			$('#member-list').show();
			$('#edit-members-btn').show();
		},1000);

	} else {
	
		// Display a progress indicator
		show_progress_bar($('#member-list'),100,"info",true,true);

		var url = $('#ajax-url').html() + 'get_friends.php';
		var url_params = { id: $('#member-list').attr("user-id") }
		var friends_ids = new Array();
		var total = (followers_count > friends_count) ? friends_count : followers_count;

		// Ask the server for users
		$.getJSON(url,url_params,function(json){
			remove_progress_bar($('#member-list'));
			show_progress_bar($('#member-list'),0,"success");

			// Get server's response
			$.each(json,function(i,user) {
				friends_ids.push(user.id);
				friends_cache.push({
						'json':user
					});
				friends_search_source.push(user.name + '|' + user.screen_name);
				$(update_progress_bar($('#member-list'),(friends_ids.length/total)*100));
				});
			})
			// Wait for load to complete
			.complete(function() {

				if (friends_ids.length > 0) {

					$('#members-tabs-friends-count').html((friends_ids.length == 0) ? 0 : friends_ids.length)
					$('#members-tabs-friends-count').show();

					$(render_users(friends_cache, $('#member-list')));

					$(search_typeahead(friends_cache, friends_search_source));

					// Remove progress bar
					window.setTimeout(function(){
						// Re-enable buttons & views
						remove_progress_bar($('#member-list'), "slow");
						$('#friends-pane > span').show();
						$('#users-filter').show();
						$('#member-list').show();
						$('#edit-members-btn').show();
					},1000);

				} else {

					$('#members-tabs-friends-count').hide();

					$('#member-list').html('<strong>No friends found.</strong>');

					// Remove progress bar
					window.setTimeout(function(){
						remove_progress_bar($('#member-list'), "slow");
						$('#member-list').show();
						// Re-enable buttons & views
						$('#edit-members-btn').show();
					},1000);
				}
		});
	}
}


// Get followers the user is also following from server when the Friends tab is selected
function load_followers() {

	// Check if we have cached followers
	if (followers_search_source.length > 0) {

		// Render from cache
		$(render_users(followers_cache, $('#member-list')));

		$(search_typeahead(followers_cache, followers_search_source));

		// Re-enable buttons & views
		window.setTimeout(function(){
			$('#followers-pane > span').show();
			$('#users-filter').show();
			$('#member-list').show();
			$('#edit-members-btn').show();
		},1000);

	} else {

		// Display a progress indicator
		show_progress_bar($('#member-list'),100,"info",true,true);

		var url = $('#ajax-url').html() + 'get_followers.php';
		var url_params = { id: $('#member-list').attr("user-id") }
		var followers_ids = new Array();

		// Ask the server for users
		$.getJSON(url,url_params,function(json){
			remove_progress_bar($('#member-list'));
			show_progress_bar($('#member-list'),0,"success");

			// Get server's response
			$.each(json,function(i,user) {
				followers_ids.push(user.id);
				followers_cache.push({
						'json':user
					});
				followers_search_source.push(user.name + '|' + user.screen_name);
				$(update_progress_bar($('#member-list'),(followers_ids.length/followers_count)*100));
				});
			})
			// Wait for load to complete
			.complete(function() {
				// Show views during update
				if (followers_ids.length > 0) {

					$('#members-tabs-followers-count').html((followers_ids.length == 0) ? 0 : followers_ids.length)
					$('#members-tabs-followers-count').show();

					$(render_users(followers_cache, $('#member-list')));

					$(search_typeahead(followers_cache, followers_search_source));

					// Remove progress bar
					window.setTimeout(function(){
						// Re-enable buttons & views
						remove_progress_bar($('#member-list'), "slow");
						$('#followers-pane > span').show();
						$('#users-filter').show();
						$('#member-list').show();
						$('#edit-members-btn').show();
					},1000);

				} else {

					$('#members-tabs-followers-count').hide();

					$('#member-list').html('<strong>No followers found.</strong>');

					// Remove progress bar
					window.setTimeout(function(){
						remove_progress_bar($('#member-list'), "slow");
						$('#member-list').show();
						// Re-enable buttons & views
						$('#edit-members-btn').show();
					},1000);
				}
		});
	}
}


function search_typeahead(cache, search_source) {
	var $visible = new Array;
	$('#users-filter-input').typeahead({
		'delay':1000,
		'source':search_source,
		'matcher':function(item) {
					if (this.query.length > 1) {								// Minimum 2 chars
						if (search_source.indexOf(item) == 0) {					// First item?
							$(hide_all_users());
							$visible.length = 0;
						}
						if (~item.toLowerCase().indexOf(this.query.toLowerCase())) {
							$visible.push(item);
						}
						if (search_source.indexOf(item) == cache.length-1) {	// Last item?
							if ($visible.length > 0) {
								$.each($visible,function(i){
									$('div["#member-list"] > div[id="' + $.trim($visible[i]).split('|')[1] + '"]').attr("style","display: block;");
								})
								$('img.big-avatar').lazyload();
							}
						}
					} else {
						$(hide_all_users());
					}
					$(reset_show_all_button());
					return false;
				}
	});
}


function reset_show_all_button() {
	if ($('#users-filter-all-btn').attr("status") == "on") {
		$('#users-filter-all-btn').attr("status","off");
		$('#users-filter-all-btn').removeClass("btn-warning");
		$('#users-filter-all-btn').button("toggle");
	}
}


function render_title(desc, members, max_members) {
	$flock_desc = $('#flock-desc > ul > li > a');
	$flock_desc.html(
		desc +
		'<span id="title-members" class="pull-right">' +
		'</span>'
	);
	$(update_title(members, max_members));
	$flock_desc.tooltip({
		title:	members + " member(s) defined out of max. " + max_members
	});
	$('#flock-desc').show();
}


function update_title(members, max_members) {
	$('#flock-desc > ul > li > a > span').html(members + '/' + max_members);
}


function activate_buttons() {
	// Activate buttons
	$.each($('a[id="flockify-btn"]'),
		function(button) {
			$(flockify(button));
		}
	);
}


function indicate_flocked() {
	// Indicate already flocked
	var members = $('#member-list').attr('members').split(",");
	if (members.length > 0) {
		$.each(members,
			function(i, member){
				// Green button with "Flocked" label
				$(flocked($('a[id="flockify-btn"][data-user-id="' + member + '"]')));
			}
		);
	}
}


function update_list() {
	// Get all flocked
//	var member_ids = $('#member-list').attr('members').split(",");
	var flocked = $('#member-list').attr('members').split(",").length;

//	var flocked = $(".btn-success", $('#member-list')).length;
	if (flocked >= $('#max-members').html()) {
		// If max members - disable others until someone is "unflocked"
		$.each($(".btn:not(.btn-success)", $('#member-list')),
			function(){
				$(this).attr("disabled","disabled");
				$(this).unbind("click");
				$(this).children("i").removeClass().addClass("icon-exclamation-sign");
				$(this).children("span").html("Flock full!");
			}
		);
	} else {
		// Enable all unflocked
		$.each($(".btn:not(.btn-success)", $('#member-list')),
			function(){
				$(flockify($(this)));
			}
		);
	}
	$(update_members_title());
}


function flockify(button) {
	$(button).unbind("hover");
	$(button).unbind("click").click(
		function(event){
			event.preventDefault();
			event.stopPropagation();
			$(flock($(this)));
		}
	);
	$(button).removeAttr("disabled");
	$(button).removeClass().addClass("btn");
	$(button).children("i").removeClass().addClass("icon-plus-sign");
	$(button).children("span").html("Flockify!");
}


function flocked(button) {
	$(hoverify(button));
	$(button).unbind("click").click(
		function(event){
			event.preventDefault();
			event.stopPropagation();
			$(unflock($(this)));
		}
	);
	$(button).removeClass().addClass("btn btn-success");
	$(button).children("i").removeClass().addClass("icon-user icon-white");
	$(button).children("span").html("Flocked");
}


function flock(button) {
	// Flock the member
	$(button).unbind("hover");
	$(button).unbind("click");
	$(button).removeClass().addClass("btn btn-warning disabled");
	$(button).children("i").removeClass().addClass("icon-download-alt icon-white");
	$(button).children("span").html("Flocking...");
	
	if (is_flocked($(button).attr("data-user-id"))) {
		var member_ids = $('#member-list').attr('members').split(",");
		if (member_ids.indexOf($(button).attr("data-user-id")) == -1) {
			// Add member to the list
			member_ids.push($(button).attr("data-user-id"));
			$('#member-list').attr('members', member_ids.join(","));
		}
		$(flocked(button));
	} else {
		$(flockify(button));
	}
	$(update_list());
}


function unflock(button) {
	// Unflock the user
	$(button).unbind("hover");
	$(button).unbind("click");
	$(button).removeClass().addClass("btn btn-warning disabled");
	$(button).attr("disabled","disabled");
	$(button).children("i").removeClass().addClass("icon-trash icon-white");
	$(button).children("span").html("Unflocking...");

	if (is_unflocked($(button).attr("data-user-id"))) {
		var member_ids = $('#member-list').attr('members').split(",");
		var index = member_ids.indexOf($(button).attr("data-user-id"));
		if (index > -1) {
			member_ids.splice(index,1);							// Remove follower from the list
			$('#member-list').attr('members', member_ids.join(","));
		}
		if (showing_members) {
			$('div[data-item-id="'+$(button).attr("data-user-id")+'"]').slideUp("slow", function(){
				// Remove member from list
				$('div[data-item-id="'+$(button).attr("data-user-id")+'"]').remove();
			});
		} else {
			$(flockify(button));
		}
	} else {
		$(flocked(button));
	}
	$(update_list());
}


function is_flocked(user_id) {
	// Try to flock the user
	$(add_member(user_id,$('#member-list').attr("flock-id")));
	return members_changed;
}


function is_unflocked(member_id) {
	// Try to unflock the user
	$(remove_member(member_id,$('#member-list').attr("flock-id")));
	return members_changed;
}


function add_member(member_id, flock_id) {
	// Save member
	var url = $('#ajax-url').html() + 'member.php';
	var url_params = {
		ad: member_id,
		id: flock_id
	}

	// Temporarily turn off async TX
	$.ajaxSetup({async: false});

	$.get(url, url_params,
		function(result) {
			// Get server's response
			members_changed = (members_changed || ($.trim(result) != '-1'));
		}
	);

	// Turn async TX back on
	$.ajaxSetup({async: true});

}


function remove_member(member_id, flock_id) {
	// Remove member
	var url = $('#ajax-url').html() + 'member.php';
	var url_params = {
		rm: member_id,
		id: flock_id
	}

	// Temporarily turn off async TX
	$.ajaxSetup({async: false});

	$.get(url, url_params,
		function(result) {
			// Get server's response
			members_changed = (members_changed || ($.trim(result) != '-1'));
		}
	);

	// Turn async TX back on
	$.ajaxSetup({async: true});

}


function hoverify(button) {
	$(button).hover(
		function() {	// Mouse enter
			// Bind hover event to change color to red with "Unflock!" label
			$(button).removeClass().addClass("btn btn-danger");
			$(button).children("i").removeClass().addClass("icon-minus-sign icon-white");
			$(button).children("span").html("Unflock!");
		},
		function() {	// Mouse leaves
			// Green button with "Flocked" label
			$(button).removeClass().addClass("btn btn-success");
			$(button).children("i").removeClass().addClass("icon-user icon-white");
			$(button).children("span").html("Flocked");
		}
	);
}


/*************************************************************************************************/
/* Message functions																			 */
/*************************************************************************************************/

function send_message(user_id, flock_id, message) {

	// Send message
	var error = new Array();
	var url = $('#ajax-url').html() + 'send_message.php';
	var url_params = {
		id: flock_id,
		ms: message
	}

	// Temporarily turn off async TX
	$.ajaxSetup({async: false});

	$.get(url, url_params,
		function(result) {
			// Get server's response
			var message_sent = $.trim(result);

			setTimeout(function () {
				$('#tweet-control-group').removeClass().addClass("control-group");
				$('#tweet-send-status').html("");
			}, 10000);

			if (message_sent != '') {											// An Error occured
				error = message_sent.split(':');

				$('#tweet-control-group').removeClass().addClass("control-group error");
				$('#tweet-send-status').html(error[1]+": "+error[2]);

				$('#tweet').removeAttr("disabled");
				$('#reset-tweet-btn').removeAttr("disabled");
//				$('#send-tweet-btn').button('reset');
				$('#send-tweet-btn').html("<i class='icon-share-alt icon-white'></i> Send");
				$('#send-tweet-btn').removeAttr("disabled");
			} else {																		// OK
				$('#tweet-control-group').removeClass().addClass("control-group success");
				$('#tweet-send-status').html("Message sent successfully!");
				$('#send-tweet-btn').removeClass("btn-primary").addClass("btn-success")
//				$('#send-tweet-btn').attr("data-loading-text", "<i class='icon-ok icon-white'></i> Sent!");
//				$('#send-tweet-btn').button('loading');
				$('#send-tweet-btn').html("<i class='icon-ok icon-white'></i> Sent!");
				setTimeout(function () {
					$('#tweet-control-group').removeClass().addClass("control-group");
					$('#tweet').removeAttr("disabled");
					$('#reset-tweet-btn').removeAttr("disabled");
					$('#send-tweet-btn').removeClass("btn-success").addClass("btn-primary");
//					$('#send-tweet-btn').button('reset');
					$('#send-tweet-btn').html("<i class='icon-share-alt icon-white'></i> Send");
					$('#tweet').val('');
					$(init_tweet_counter());
				}, 3000);
			}
			update_tweet_title(user_id);
		}
	);

	// Turn async TX back on
	$.ajaxSetup({async: true});

}


function users_remaining_dms(user_id) {

	// Get user's remaining DMs count
	var $remaining_dms = 0;

	var url = $('#ajax-url').html() + 'get_remaining_DMs.php';
	var url_params = {
		id: user_id
	}

	// Temporarily turn off async TX
	$.ajaxSetup({async: false});

	$.get(url, url_params,
		function(result) {
			// Get server's response
			$remaining_dms = $.trim(result);

			if ($remaining_dms == '') {
				$remaining_dms = '0';
			}
		}
	);

	// Turn async TX back on
	$.ajaxSetup({async: true});

	return $remaining_dms;

}


/*************************************************************************************************/
/* Misc functions																				 */
/*************************************************************************************************/

function pageFileName() {
	var url = document.location.href;
	url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
	url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
	url = url.substring(url.lastIndexOf("/") + 1, url.length);
	if (url != '') {
		return url;
	} else {
		return 'index.php';
	}
}

function signOut() {
	twttr.anywhere.signOut();
	window.location = 'signout.php';
}


function timeOut() {
	twttr.anywhere.signOut();
	window.location = 'timeout.php';
}


function processScroll() {
	// fix sub nav on scroll
	var i, scrollTop = $win.scrollTop()
	if (scrollTop >= navTop && !isNavBarFixed) {
		isNavBarFixed = true;
		$nav.addClass('subnav-fixed')
	} else if (scrollTop <= navTop && isNavBarFixed) {
		isNavBarFixed = false;
		$nav.removeClass('subnav-fixed')
	}
}


function invalidate_cache(cache) {
	cache.length = 0;
}

function invalidate_search(search) {
	search.length = 0;
}

function is_duplicatename(id,name) {
	var result = false;
	$('li[data-flock-name="' + name + '"]').each(function(){
		if (!id || !($(this).attr('data-flock-id') == id)) {
			result = true;
		}
	});
	return result;
}


function is_valid_input(field, regexp) {
	return regexp.test($(field).val());
}


function init_flock_counters() {
	var namechars = $('#edit-flock-name').val().length;
	if (namechars == 0) {
		$('#save-flock-btn').attr("disabled", "disabled");
	} else {
		$('#save-flock-btn').removeAttr("disabled");
	}
	$('#name-counter').html(20 - namechars);
	$('#desc-counter').html(160 - $('#edit-flock-desc').val().length);
}


function init_search_counter() {
	var search_words = $('#search-pane-form-users').val()
	var search_words_count = search_words.replace(/^,+|,+$/, '').split(',').length;
	if (search_words.length == 0 || search_words_count == 0) {
		$('#search-pane-form-search-btn').attr("disabled", "disabled");
	} else {
		$('#search-pane-form-search-btn').removeAttr("disabled");
	}
	$('#search-pane-form-counter').html($('#max-members').html() - search_words_count);
}


function init_tweet_counter() {
	var tweetchars = $('#tweet').val().length;
	if (tweetchars == 0) {
		$('#send-tweet-btn').attr("disabled", "disabled");
	} else {
		$('#send-tweet-btn').removeAttr("disabled");
	}
	$('#tweet-counter').html(140 - tweetchars);
}


function count_characters(message, max, counter, error_message) {
	// controls character input/counter
	var charLength = $(message).val().length;
	// Displays count
	$(counter).html(max - charLength);
	// Alerts when <max> characters is reached
	if (charLength > max) {
		$(counter).html('<strong style="color: red;">' + error_message + '</strong>');
	}
}


function count_words(message, max, counter, error_message) {
	// controls word input/counter
	var wordCount = 0;
	if ($(message).val().length > 0) {wordCount = $(message).val().replace(/^,+|,+$/, '').split(',').length}
	// Displays count
	$(counter).html(max - wordCount);
	// Alerts when <max> characters is reached
	if (wordCount > max) {
		$(counter).html('<strong style="color: red;">' + error_message + '</strong>');
	}
}


function render_users(data, container, show_all) {
	var showall = (show_all != null) ? ((show_all == true) ? true : false) : false;

	$.each(data,function(i,json) {
		$.each(json,function(i,user){
			$(render_user(user, container));
		});
	});

	$(indicate_flocked());

	$(activate_buttons());

	if (showall) {
		$(show_all_users())
	}

	var members = $('#member-list').attr('members').split(",");
	if (members.length > 0) {
		$(update_list());
	}

	// Finally show buttons
	$('a[id="flockify-btn"]').attr("style","display: block;");

//	$(hovercard_users(container));
}


function show_all_users() {
//	window.setTimeout(function(){
//		$('#member-list').children().attr("style","display: block;");
		$('#member-list').children().each(function(i){
			if ($(this).attr("style") == "display: none;") {
				$(this).attr("style","display: block;");
			}
		});
//	},1);
	$('img.big-avatar').lazyload();
}


function hide_all_users() {
//	window.setTimeout(function(){
		$('#member-list').children().each(function(i){
			if ($(this).attr("style") != "display: none;") {
				$(this).attr("style","display: none;");
			}
		});
//	},1);
}


function render_user(user, container) {
	var attribs = '';
	if (user.following != null && user.following) {
		attribs += '<a id="attribs-friends" title="You are following each other" href="#"><i class="icon-user"></i><i class="icon-resize-horizontal"></i><i class="icon-user"></i></a> '
	}
	if (user.protected != null && user.protected) {
		attribs += '<a id="attribs-private" title="The user has protected account" href="#"><i class="icon-lock"></i></a> '
	}
	if (user.geo_enabled != null && user.geo_enabled) {
		attribs += '<a id="attribs-geo" title="The user shares geo location" href="#"><i class="icon-map-marker"></i></a>'
	}
	$(container).append(
		'<div id="' + user.screen_name + '" data-item-id="' + user.id + '" class="stream-item" style="display: none;">' +
			'<div class="user" data-screen-name="' + user.screen_name + '">' +
				'<div class="content">' +
					'<div class="btn-group">' +
						'<div>' +
							'<a id="flockify-btn" class="btn" data-loading-text="Flocking..." data-user-id="' + user.id +
								'" href="#" style="display: none;"><i class="icon-plus-sign"></i> <span>Flockify!</span> </a>' +
						'</div>' +
						'<div class="attribs-group">' +
							attribs +
						'</div>' +
					'</div>' +
					'<div class="stream-item-header">' +
						'<a class="user-group" href="http://twitter.com/' + user.screen_name + '">' +
							'<img class="big-avatar" alt="' + user.name + '" data-original="' + user.profile_image_url +
								'" src="images/placeholder.png">' +
							'<strong class="fullname">' + user.name + '</strong>' +
						'</a>' +
					'</div>' +
					'<div>' +
						'<span class="username" id="username">@' + user.screen_name + '</span>' +
					'</div>' +
					'<div>' +
						'<span class="location" id="location">' + ((user.location != null) ? user.location : "") + '</span>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>'
	);
	if (attribs.length > 0) {
		$('a[id="attribs-friends"]').tooltip();
		$('a[id="attribs-private"]').tooltip();
		$('a[id="attribs-geo"]').tooltip();
	}
}


// Linkify all Twitter usernames inside the container
function hovercard_users(container) {
	twttr.anywhere( function (T) {
		T(container).hovercards({ expanded: true });
	});
}


// Display a progress indicator
function show_progress_bar(container, percentage, color, striped, active) {
	var percent = (percentage != null && percentage >= 0 && percentage <= 100) ? Math.floor(parseInt(percentage)) : 100;
	var clr = (color != null && color.length > 0) ? color : "info";
	var stripe = (striped != null && striped == true) ? " progress-striped" : "";
	var actv = (active != null && active == true) ? " active" : "";

	$(container).before('<div id="progress-bar" class="progress progress-' + clr + stripe + actv + '">' +
							'<div class="bar" style="width: ' + percent + '%;"></div>' +
						'</div>');
}


// Set progress indicator percentage
function update_progress_bar(container, percentage, color, striped, active) {
	var progress_bar = $(container).prev('div[id="progress-bar"]');
	var bar = $(progress_bar).children('.bar');
	window.setTimeout(function(){
		$(bar).attr("style","width: " + ((percentage != null && percentage >= 0 && percentage <= 100) ? Math.floor(parseInt(percentage)) + "%" : "100%"));
		if (striped != null) {
			(striped == true) ? $(progress_bar).removeClass("progress-striped").addClass("progress-striped") : $(progress_bar).removeClass("progress-striped");
		}
		if (active != null) {
			(active == true) ? $(progress_bar).removeClass("ative").addClass("ative") : $(progress_bar).removeClass("ative");
		}
		if (color != null) {
			(color.length > 0) ? $(progress_bar).removeClass("progress-info progress-success progress-danger").addClass('progress-'+color) : $(progress_bar).removeClass("progress-info progress-success progress-danger");
		}
	},1);
}


// Remove a progress indicator
function remove_progress_bar(container, duration) {
	var fx_duration = (duration != null) ? duration : "";
	$(container).prev('div[id="progress-bar"]').hide(fx_duration);
	$(container).prev('div[id="progress-bar"]').remove();
}