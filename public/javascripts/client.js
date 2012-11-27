$(function(){

	var socket = io.connect('http://xxx.xxx.xxx.xxx:3001');

	$(function(){

		socket.on('connect', function(msg) {
			$("#connectId").html("");
			$("#connectId").append("Connect ID:" + socket.socket.sessionid);
			socket.emit("connect", "### " + socket.socket.sessionid + "が参加しました");
		});
	
		socket.on('message', function(msg) {
			$("#receiveMsg").append(msg + "<br>");
		});
	
		$("input[name=send]").bind('click', function(){
			$.sendEvent();
		});

		$("#message").keydown(function(e){
			if(e.keyCode == 13){
				$.sendEvent();
			}
		});

		$("input[name=disconnect]").bind('click', function(){
			socket.emit("disconnect", socket.socket.sessionid + " disconnected");
			socket.disconnect();
		});

		$.sendEvent = function(){
			var msg = $("#message").val(),
				name = $("#name").val(),
				d = new Date(),
				y = d.getFullYear(),
				m = d.getMonth(),
				dd = d.getDate(),
				h = d.getHours(),
				mi = d.getMinutes(),
				s = d.getSeconds(),
				date = y + "/" + m + "/" + dd + " " + h + ":" + mi + ":" + s;

			name = (name === "") ? name = "名無しさん" : name;
			if(msg === ""){
				return false;
			}

			socket.emit("message", date + "<br>" + name + ": " + msg + "<br>");
			$("#message").val("");
			$("#name").val("");
		};

	});

});
