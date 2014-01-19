        $(function() {
					
					$("#graph").hide();
					$("#plot").hide();
            $("#draggable").css('z-index', '9999999999');
            $("#content").css('height', '150%');
					window.context = "whiteboard";
					window.name = "";
					
					$("#nameInput").keypress(function(e) {
						if(e.keyCode == 13) {
							e.preventDefault();
							window.name = $(this).val();
							var $dialog = $(this).parent();
							$(this).remove();
						  $dialog.text("Name changed to " + name);
							setTimeout(function() {
								$dialog.fadeOut(500);
							}, 1000);
						}
					});
					
					window.wasAlreadyMinimized = 0;
					
			    var apiKey    = "44618172";
			    var sessionId = "1_MX40NDYxODE3Mn5-U2F0IEphbiAxOCAwMDowMjoxNCBQU1QgMjAxNH4wLjU2MTYxNjg0fg";
			    var token     = "T1==cGFydG5lcl9pZD00NDYxODE3MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz01MmM0ZjJlZTY2NmZjYjg5NTNjMTgwZWJkNzMzOWFjOGY5YTZjZDVlOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTkRZeE9ERTNNbjUtVTJGMElFcGhiaUF4T0NBd01Eb3dNam94TkNCUVUxUWdNakF4Tkg0d0xqVTJNVFl4TmpnMGZnJmNyZWF0ZV90aW1lPTEzOTAwMzIxODEmbm9uY2U9MC4wMTgwMjM1MDEwOTE0NTQ0NTImZXhwaXJlX3RpbWU9MTM5MDYzNjk4MSZjb25uZWN0aW9uX2RhdGE9";
					
					
					var session = TB.initSession(sessionId);
					
					session.addEventListener("sessionConnected", sessionConnectedHandler);
					session.addEventListener("streamCreated", streamCreatedHandler);
					
					function sessionConnectedHandler(event) {
						session.publish(publisher);
						subscribeToStreams(event.streams);
					}
					
					function subscribeToStreams(streams) {
						for(var i = 0; i < streams.length; i++) {
							var stream = streams[i];
							if(stream.connection.connectionId != session.connection.connectionId) {
								session.subscribe(stream, "placeholder");
							}
						}
					}
					
					function streamCreatedHandler(event) {
						subscribeToStreams(event.streams);
					}
					
					var publisher = TB.initPublisher(apiKey, "placeholder");
					var session = TB.initSession(sessionId);
					
					
					session.connect(apiKey, token);
					session.addEventListener("sessionConnected", sessionConnectedHandler);
					session.addEventListener("streamCreated", streamCreatedHandler);
					resizePublisher();
					
					function resizePublisher() {
						var pubElement = document.getElementById(publisher.id);
						//pubElement.width = ($("#tokbox").width())-20;
						//pubElement.height = $("#tokbox").height()/3-20;
					}

					// chat websocket
					
            $("#msg").keypress(function(e) {
								if(e.keyCode == 13) {
									e.preventDefault();
									if($(this).val() != '') {
										var messageText = $(this).val();
										$(this).val('');
										socket.emit('chatMessage', {"messageText": messageText, "sendingUser": window.name});
									}
								}
						});
					
					// jquery animations
            // sidebar animations
            $("#icon").click(function(){
                $(".menuList").hide();
                $("#menu").css( {
                    "padding": "0"
                })

                $("#sidebar").animate( {
                    "width": "0"
                }, { duration: 250, queue: false })

                $("#content").animate( {
                    "width": "100%"

                })

                $("#sidebar_header").animate({
                    "color": "white",
                    "z-index":"-1"
                }, { duration: 150, queue: false })

                $("li a").css({
                    "color": "white"
                })



                $("#open_panel_icon").animate({
                    "left":'0px'
                },{ duration: 500, queue: false })
            });

            $("#open_panel_icon").click(function() {
                $(".menuList").show();
                $("#open_panel_icon").animate({
                    "left":'-400px'
                },{ duration: 500, queue: false })

                $("li a").css({
                    "color": "#46a9b2"
                })

                $("#sidebar_header").animate({
                    "color": "white",
                    "z-index":"-1"
                }, { duration: 150, queue: false })

                $("#content").animate( {
                    "width": "84%"

                })

                $("#sidebar").animate( {
                    "width": "16%"
                }, { duration: 250, queue: false })

                $("#menu").css( {
                    "padding": "10px"
                })

            })

            $(".close").click(function() {
                $(this).parent().parent().hide();
            })

            $("#problem_text").hide();
            $(".draggable").hide();
            $("#sidebar").hide();
            $("#menu").hide();

            $("#problem_text").fadeIn(500);
            $("#sidebar").fadeIn(500);
            $("#menu").fadeIn(500);
            $(".callout .panel").fadeIn(500);
            $(".draggable").delay(500).fadeIn(500);
            $(".draggable").draggable();
            $(".draggable").resizable();
            $(".draggable").mouseover(function() {
                $(this).animate({
                 "border-color": "#494949",
                 "border-width": "0.2em"
                 }, 100);
            });
						
            $(".draggable").mouseleave(function() {
                $(this).animate({
                    "border-color": "#9D9D9D",
                    "border-width": "1px"
                }, 100);
				    });

            $(".minimize").click(function() {
                $(this).parent().css({
                      'min-height': '0px',
                      'min-width': '0px',
                      'position': 'fixed'
                });

                $(this).parent().animate({
                    "height": "40px",
                    "width": "200px",
                    "background-color": "#9E9E9E",
                    "bottom": "0px",
										"left": 200*window.alreadyMinimized+"px"
                }, 500);
								
								window.alreadyMinimized++;

                /*$(this).parent().html("");*/
            });

            $("#clear").click(function() {
                $(".close").parent().parent().hide()
            });


						// wolframalpha
						
						$("#calc").keypress(function(e) {
							if(e.keyCode == 13) {
								e.preventDefault();
								if($(this).val() != '') {
									var exp = $(this).val();
									$(this).val('');
									$("#result").text('');
									$("#error").text('');
									$.post('/calc', {'exp': exp}, function(data) {
										var parsed = JSON.parse(data);
										if(parsed['status'] == 'ok') {
											$("#result").text(parsed['exp'] + '=' + parsed['result']);
											socket.emit('valueCalculated', {'sendingUser': window.name, 'value': parsed['result'], 'exp': parsed['exp']});
										}
										else {
											$("#error").text(parsed['error'])
										}
									});
								}
							}
						});
						
						socket.on('valueCalculated', function(data) {
							var logEl = $("<ul class='messageText'>"+"<b>"+data['sendingUser']+"</b>: "+data['exp']+"="+data['value']+"</ul>");
							if($("#calc-log").html().indexOf(logEl.html()) == -1) {
								$("#calc-log").prepend(logEl);
							}
						});
						
						socket.on('chatMessage', function(data) {
							var msgEl = $("<ul class='messageText'>"+"<b>"+data['sendingUser']+"</b>: "+data['messageText']+"</ul>");
							if($("#chat-msgs").html().indexOf(msgEl.html()) == -1) {
								$("#chat-msgs").prepend(msgEl);
							}
						});

						$("#invite").click(function() {
							var $emailBar = $("<div class='callout panel' id='emailBar'><form id='emailForm'><p>Type each email, separated by a comma.</p><input type='text' id='emails' placeholder='Emails, separated by commas...'/></form></div>");
							if($("#emailBar").length == 0) {
								$("body").prepend($emailBar);
								$("#emails").tagsInput();
								var $inputButton = $("<input type='submit' id='submitButton' value='Submit' class='small round button'>");
								$("#emailForm").append($inputButton);
								$("#emailForm").submit(function(e) {
									e.preventDefault();
										var emails = $("#emails").val();
										if(window.name != '') {
											var psetter = window.name;
										}
										else {
											psetter = 'A user';
										}
										var pName = $("#problem_text").text();
										var link = document.URL;
										$.post('/invite', {'emails': emails, 'psetter': psetter, 'pName': pName, 'link': link}, function(err, data) {
											
										});
										$("#emailBar").html("");
										$("#emailBar").text("Email sent.");
										$("#emailBar").fadeOut(500);
								});
							}
						});
						
						
						
						$(".switchLink").click(function(e) {
							e.preventDefault();
							if($(this).attr('data-selected') == 'true') {
								// do nothing
							} else {
								window.context = $(this).attr('data-context');
								if(window.context == 'latex') {
									if($("#latexInput").length == 0) {
										$("#graphInput").remove();
										var $latexEditor = $("<input type='text' id='latexInput' placeholder='Type your LaTeX here.'/>");
										$(".boardRight").prepend($latexEditor);
										$("#latexInput").keydown(function() {
												$("#latexRender").text($(this).val());
												MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
											});
										}
									}
									$(".switchLink").removeClass('small');
									$(".switchLink").removeClass('round');
									$(".switchLink").removeClass('button');
									$(".switchLink").css("color", "");
									$(this).addClass('small');
									$(this).addClass('round');
									$(this).addClass('button');
									$(this).css('color', 'white');
								}
								if(window.context == 'graph') {
									$("#latexInput").remove();
									$("#wrapper").remove();
									$("#graph").show();
									if($("#graphInput").length == 0) {
										var $graphEditor = $("<input type='text' id='graphInput' placeholder='Type your function here.'/>");
										$(".boardRight").prepend($graphEditor);
										var $graph = $("<div id='graph'></p>");
										$(".boardRight").append($graph);
										$graphEditor.ready(function() {
											$("#graphInput").keydown(function(e) {
												if(e.keyCode == 13) {
													e.preventDefault();
													var funct = $("#graphInput").val();
													$.post('/plot', {'funct': funct}, function(data) {
														parsed = JSON.parse(data);
														if(parsed['status'] == 'ok') {
															$("#graph").html('<img src="' + parsed['result'] + '"></img>');
															//socket.emit('valueCalculated', {'sendingUser': window.name, 'value': parsed['result'], 'exp': parsed['exp']});
														}
														else {
															$("#error").text(parsed['error']);
														}
													});
												}
											});
										});
									}
								}
						});
						
						$("#save").click(function(e) {
							e.preventDefault();
							window.open('/render/?problem='+encodeURIComponent($("#problem_text").text())+'&solution='+encodeURIComponent($("#solution").val()));
						});
						
        });