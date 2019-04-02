
(function() {
    'use strict';
    
    var TILE_LENGTH = 100;
    var PUZZLE_SIZE = 4;
    var SHUFFLE_NUM = 1000;

    var blankId = "3_3";
    var moves = 0;
    var started;
    var shuffling = false;
    
    var timer;
    var seconds = 0;
	
	var loggedIn = false;
    var username;

    var $ = function(id) {
        return document.getElementById(id);
    };
    var qsa = function(sel) {
        return document.querySelectorAll(sel); 
    };

    window.onload = function() {
		initializeUser();
        initializePuzzle();
        $("shuffleButton").onclick = shuffle;
        $("image").onchange = changeImg;
        //$("displaySerial").onchange = displaySerial;
    };
	

    function initializeUser() {
        if (getCookie("username")) {
            loggedIn = true;
            username = getCookie("username");
        }
        if (loggedIn) {
            $("username").innerHTML = username;
			$("user-signed-in").classList.remove("hidden");
			$("user-not-signed-in").classList.add("hidden");
            /*$("signIn").classList.add("hidden");
            $("signInNote").classList.add("hidden");
            $("signOut").classList.remove("hidden");
			$("to15puzzle").classList.remove("hidden");
            $("signOut").onclick = signOut;*/
        } else {
			$("user-signed-in").classList.add("hidden");
			$("user-not-signed-in").classList.remove("hidden");
		}
    }
/*
    function displaySerial() {
        var tiles = qsa(".tile");
        if ($("displaySerial").checked) {
            for (var i = 0; i < tiles.length; i++) {
                tiles[i].innerHTML = i + 1;
            }
        } else {
            for (var i = 0; i < tiles.length; i++) {
                tiles[i].innerHTML = null;
            }
        }
    }
*/    
    function changeImg() {
        var tiles = qsa(".tile");
        for (var i = 0; i < tiles.length; i++) {
            tiles[i].style.backgroundImage = "url(./img/" + $("image").value + ")";
        } 
    }
    
    function initializePuzzle() {
        for (var i = 0; i < 15; i++) {
            var tile = document.createElement("div");
            tile.classList.add("tile");
            tile.style.backgroundImage = "url(./img/" + $("image").value + ")";
            tile.style.backgroundPosition = "-" + (i % PUZZLE_SIZE) * TILE_LENGTH + "px" + 
                    " -" + parseInt(i / PUZZLE_SIZE, 10) * TILE_LENGTH + "px";
            tile.style.left = (i % PUZZLE_SIZE) * TILE_LENGTH + "px";
            tile.style.top = parseInt(i / PUZZLE_SIZE, 10) * TILE_LENGTH + "px";
            tile.innerHTML = i + 1;
            $("puzzlearea").appendChild(tile);
            tile.id = "" + (i % PUZZLE_SIZE) + "_" + parseInt(i / PUZZLE_SIZE, 10);
        }
        setMoveable();
        $("startInfo").innerHTML = "Click \"Shuffle\" to start!";
    }
    
    function move() {
        var tempId = this.id;
        this.id = blankId;
        this.style.left = parseInt(blankId.substring(0,1), 10) * TILE_LENGTH + "px";
        this.style.top = parseInt(blankId.substring(2,3), 10) * TILE_LENGTH + "px";
        blankId = tempId;
        setMoveable();
        if (!shuffling && started) {
            if (moves == 0) {
                $("time").innerHTML = getTime();
                clearInterval(timer);
                timer = null;
                timer = setInterval(oneSecond, 1000);
                $("shuffleButton").classList.add("hidden");
                $("giveUpButton").classList.remove("hidden");
                $("giveUpButton").onclick = giveUp;
            }
            moves++;
            $("moves").innerHTML = moves;
            if (blankId == "3_3") {
                checkWin();
            }
        }
    }
    
    function giveUp() {
        window.location.reload();
    }
    
    function setMoveable() {
        var oldMoveable = qsa(".moveable");
        for (var i = 0; i < oldMoveable.length; i++) {
            oldMoveable[i].classList.remove("moveable");
            oldMoveable[i].onclick = null;
        }
        var idIndex = parseInt(blankId.substring(0,1), 10);
        if (idIndex > 0) {
            getTile((idIndex - 1), blankId.substring(2,3)).classList.add("moveable");
            getTile((idIndex - 1), blankId.substring(2,3)).onclick = move;
        }
        if (idIndex < 3) {
            getTile((idIndex + 1), blankId.substring(2,3)).classList.add("moveable");
            getTile((idIndex + 1), blankId.substring(2,3)).onclick = move;
        }
        idIndex = parseInt(blankId.substring(2,3), 10);
        if (idIndex > 0) {
            getTile(blankId.substring(0,1), (idIndex - 1)).classList.add("moveable");
            getTile(blankId.substring(0,1), (idIndex - 1)).onclick = move;
        }
        if (idIndex < 3) {
            getTile(blankId.substring(0,1), (idIndex + 1)).classList.add("moveable");
            getTile(blankId.substring(0,1), (idIndex + 1)).onclick = move;
        }
    }
    
    function getTile(col, row) {
        return $(col + "_" + row);
    }
    
    function getTime() {
        var min;
        var sec;
        min = parseInt(seconds / 60);
        sec = seconds % 60;
        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        return "" + min + ":" + sec;
    }
    
    function oneSecond() {
        seconds++;
        $("time").innerHTML = getTime();
    }
    
    function shuffle() {
        moves = 0;
        $("moves").innerHTML = moves;
        seconds = 0;
        $("time").innerHTML = getTime();
        $("startInfo").innerHTML = null;
        
        shuffling = true;
        for (var i = 0; i < SHUFFLE_NUM; i++) {
            var neighbors = qsa(".moveable");
            var choose = parseInt(Math.random() * neighbors.length, 10);
            neighbors[choose].onclick();
        }
        shuffling = false;
        started = true;
    }
    
    function checkWin() {
        var win = true;
        var tiles = qsa(".tile");
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].innerHTML != (parseInt(tiles[i].id[0], 10) + parseInt(tiles[i].id[2], 10) * 4 + 1)) {
                win = false;
            }
        }
        
        if (win) {
            started = false;
            $("startInfo").innerHTML = "You WIN! Click \"Shuffle\" to start again!";

            $("shuffleButton").classList.remove("hidden");
            $("giveUpButton").classList.add("hidden");
            clearInterval(timer);
            timer = null;
            
            var name = "";
			if (getCookie("username")) {
				username = getCookie("username");
				alert("Congratulations, " + username + "! You won!");
            	name = username;
				// here
				alert("Your score has been recorded!");
				var ajaxGetPromise = AjaxGetPromise("record.php" + "?username=" + name + 
														"&moves=" + moves + "&time=" + seconds);
				ajaxGetPromise
					.catch(havingError);
			}// else {
			//	name = prompt("Congratulations! You won! \n Please enter your name:","Anonym");
			//}
			/*
			alert("Your score has been recorded!");
			var ajaxGetPromise = AjaxGetPromise("record.php" + "?username=" + name + 
                                                    "&moves=" + moves + "&time=" + seconds);
        	ajaxGetPromise
        		.catch(havingError);
			*/
        }
    }
    
    function havingError(errorMessage) {
        alert("Ohhh... There is something wrong: " + errorMessage);
    }
	
	function deleteCookie(name) { 
        var exp = new Date(); 
        exp.setTime(exp.getTime() - 1); 
        var cval = getCookie(name); 
        if(cval != null) {
            document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
        }
    }
    
    function getCookie(cookieName) {
        var name = cookieName + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
})();




/*

solution 2


(function() {
    'use strict';
    
    var SHUFFLE_NUM = 1000;
    var TILE_NUM = 16;
    
    var shuffling = false;
    
    // returns the HTML element get by id
    var $ = function(id) {
        return document.getElementById(id);
    };
    
    var qs = function(sel) {
        return document.querySelector(sel);
    };
    
    var qsa = function(sel) {
        return document.querySelectorAll(sel); 
    };

    // the main function, run when the window finished onloading
    window.onload = function() {
        initializePuzzle();
        $("shuffleButton").onclick = shuffle;
    };
    
    function initializePuzzle() {
        for (var i = 0; i < TILE_NUM - 1; i++) {
            var tile = document.createElement("div");
            tile.classList.add("tile");
            tile.style.backgroundPosition = "-" + (i % 4) * 100 + "px" + " -" + parseInt(i / 4)*100 + "px";
            tile.innerHTML = i + 1;
            $("puzzlearea").appendChild(tile);
            tile.id = "" + i;
            //tile.onclick = move;
        }
        var blankTile = document.createElement("div");
        blankTile.classList.add("blankTile");
        $("puzzlearea").appendChild(blankTile);
        blankTile.id = "" + TILE_NUM - 1;
        setMoveable(TILE_NUM - 1);
    }
    
    function move() {
        var moveTo = qs(".blankTile");
        moveTo.classList.remove("blankTile");
        moveTo.classList.add("tile");
        moveTo.innerHTML = this.innerHTML;
        moveTo.style.backgroundPosition = this.style.backgroundPosition;
        this.classList.remove("tile");
        this.classList.remove("moveable");
        this.classList.add("blankTile");
        this.innerHTML = null;
        this.style.backgroundPosition = null;
        setMoveable(this.id);
        if (!shuffling) {
            checkWin();
        }
    }
    
    function setMoveable(nowNum) {
        for (var i = 0; i < TILE_NUM; i++) {
            if (i + Math.sqrt(TILE_NUM) == nowNum ||
                    i - Math.sqrt(TILE_NUM) == nowNum ||
                    (i + 1 == nowNum && parseInt(i / Math.sqrt(TILE_NUM)) == parseInt((i + 1) / Math.sqrt(TILE_NUM))) ||
                    (i - 1 == nowNum && parseInt(i / Math.sqrt(TILE_NUM)) == parseInt((i - 1) / Math.sqrt(TILE_NUM)))
            ) {
                $(i).classList.add("moveable");
                $(i).onclick = move;
            } else {
                $(i).classList.remove("moveable");
                $(i).onclick = null;
            }
        }
    }
    
    function shuffle() {
        shuffling = true;
        for (var i = 0; i < SHUFFLE_NUM; i++) {
            var neighbors = qsa(".moveable");
            var choose = parseInt(Math.random()*neighbors.length);
            neighbors[choose].onclick();
        }
        shuffling = false;
    }
    
    function checkWin() {
        var win = true;
        for (var i = 0; i < TILE_NUM - 1; i++) {
            if ($(i).innerHTML != (i + 1)) {
                win = false;
            }
        }
        if (win) {
            alert("Congratulations! You won!");
        }
    }
    
})();


*/