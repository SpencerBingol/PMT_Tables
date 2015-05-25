/*

	HTML Usage:
		<script id="pmt_table" src="/PATH/TO/pmt_tables.js" data-player="player--id"></script>

	This script will generate the table for whichever playerIDs currently exist in the Parse 
	database, whereever the above line is pasted within the post. 

	Having the id="pmt_table" means styling the table within CSS should be very easy, by just
	classifying the elements as children of #pmt_table in the site's stylesheet will make those
	attributes apply only to these tables.

	jQuery must be enabled on the site, if not already. The script itself is hosted on GitHub
	on my personal account, but if preferred can be hosted within PMT itself, as long as the 
	link is updated on the player pages.
*/

/* 
	Begin actual script called to create player information table for a given player ID.
	DEFAULT value table is first created. 
	
	If a player ID is found (and is valid in the database), retrieve their individual 
	values and insert them into the table.
	
	This table will be generate in the exact spot where the script is called in the body
	of the HTML.
*/


jQuery.getScript("http://www.parsecdn.com/js/parse-1.4.2.min.js", function() {
	Parse.initialize("8BAuipgqsxpJMvqxfX6HWYXQTxvfopICfC9w1HOG", "lhOPBC5jvcBbs6NTj5yijiVhrG7jEvnFTrdPEFpg");
	
	generate_default_table();
	var player, id = document.getElementById("pmt_table").getAttribute("data-player");

	if (typeof id === "undefined") console.log("No Player ID found!");
	else {
		//var player_found = get_player(id);
		if (player === false) console.log("Invalid Player ID found!");
	}
});

/*
	End the 'while page is loading' script, begin called functions. 
	Passing Player ID parameter to script from HMTL was completed with answer from Vlado 
	found on Stack Overflow: 
	http://stackoverflow.com/questions/2190801/passing-parameters-to-javascript-files
*/

/*
	get_player (playerID)
		- playerID (string): BRef MiLB player ID, used as key in Parse
		
		Creates a new 'PlayerInfo' Parse Object, and then a query object 
		using 'PlayerInfo' as a DB connection. 

		Searches for database entries with a matching playerID, and if 
		one exists, returns that specific PlayerInfo object.
*/

function get_player(playerID) {
	var PlayerInfo = Parse.Object.extend("player_info");
	var query = new Parse.Query(PlayerInfo);
	query.equalTo("playerID", playerID);
	query.find({
		success: function(results) {
			if (results.length > 0) {
				fill_values(results[0]);
				return true;
			} else return false;
		},
		error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
			return false;			
		}
	});
}

/*
	fill_values(player)
		- player (PlayerInfo object) : Parse player object, attributes accessed with '.get' to fill table.

		Creates an 'info' dictionary, and fills individual named attributes with fields from the 'player'
		object.

		Accesses individual elements from the default generated table, and replaces the existing values with
		these player-specific values.  
*/

function fill_values (player) {

	// Player info dictionary
	var info = [];

	// Given "player" object from Parse, get individual values
	info["name"] = player.get("name");
	info["twitter_handle"] = player.get("twitter");
	info["home_town"] = player.get("hometown");
	info["home_state"] = player.get("homeStateCountry");
	info["school"] = player.get("school");
	info["position"] = player.get("position");
	info["hand_bat"] = player.get("bat");
	info["hand_throw"] = player.get("throw");
	info["year_acquired"] = player.get("yearAcquired");
	info["draft_round"] = player.get("draftRound");
	info["draft_pick"] = player.get("draftPick");
	info["date_of_birth"] = player.get("dateOfBirth");
	info["weight"] = player.get("weight");	
	info["inches"] = player.get("height");
	info["height_feet"] = Math.floor(info["inches"]/12); 
	info["height_inches"] = info["inches"]%12;
	info["signing_bonus"] = player.get("signingBonus");
	info["signed_date"] = player.get("signingDate");
	info["milb_options"] = player.get("milbOptions");
	info["rule_five"] = player.get("ruleFiveEligible");
	info["milb_fa"] = player.get("milbFAEligible");
	
	// Any values that are undefined or 0 are redefined as an empty string, and not displayed
	for (var key in info) if (typeof info[key] === "undefined" || info[key] === 0) info[key] = "";


	document.getElementById("name").innerHTML = info["name"];

	// If twitter handle exists, display the handle, and generate the link
	if (info["twitter_handle"] !== "") {
		document.getElementById("handle").innerHTML = '@' + info["twitter_handle"];
		document.getElementById("handle").setAttribute('href', 'http://www.twitter.com/' + info["twitter_handle"]);
	} else {
		document.getElementById("handle").innerHTML = info["twitter_handle"];
		document.getElementById("handle").setAttribute('href', 'http://www.twitter.com/' + info["twitter_handle"]);
	}
	

	document.getElementById("hometown").innerHTML = info["home_town"] + ', ' + info["home_state"];
	document.getElementById("school").innerHTML = info["school"];
	document.getElementById("position").innerHTML = info["position"];
	document.getElementById("bats").innerHTML = info["hand_bat"];
	document.getElementById("throws").innerHTML = info["hand_throw"];
	document.getElementById("yearAcquired").innerHTML = info["year_acquired"];
	
	// If the player has a draft round and overall pick, format into a string and display
	if (info["draft_round"] === "" || info["draft_pick"] === "") document.getElementById("drafted").innerHTML = "";
	else {
		document.getElementById("drafted").innerHTML = number_suffix(info["draft_round"]) + ' Round, ' + number_suffix(info["draft_pick"]) + ' Overall Pick';
	}
	
	document.getElementById("dob").innerHTML = info["date_of_birth"];
	document.getElementById("lbs").innerHTML = info["weight"] + 'lbs';
	document.getElementById("inches").innerHTML = info["height_feet"] + '\' ' + info["height_inches"] + '"';
	document.getElementById("bonus").innerHTML = '$' + info["signing_bonus"];
	document.getElementById("signedDate").innerHTML = info["signed_date"];
	document.getElementById("milbOptions").innerHTML = info["milb_options"];
	document.getElementById("ruleFive").innerHTML = info["rule_five"];
	document.getElementById("milbFA").innerHTML = info["milb_fa"];
}

/*
	generate_default_table() 

		Creates player info table tree structure in HTML, using two columns and 
		individual fields within a div. Every element is then filled with a 
		default value for in the event there is a problem accessing and displaying
		values from the Parse database.
*/

function generate_default_table () {
	/* Find the element where the table will be placed */
	var body = document.getElementsByTagName("BODY")[0];
	
	/* Create the outer table div */
	var table = document.createElement('div');
	table.setAttribute('style', 'border:1px solid black;float:left;width:90%;margin:15px;padding:10px;');

	/* Create the left column div */
	var left_col = document.createElement('div');
	left_col.setAttribute('style', 'float:left;width:50%;');
	
	/* 
		Create default PLAYER NAME span 
	*/
	var name_span = document.createElement('span');
	name_span.setAttribute('style', 'padding-right:20px;');
	var name_label = document.createElement('b');
	name_label.innerHTML = "Name: ";
	var name_val = document.createElement('span');
	name_val.setAttribute('id', 'name');
	name_val.innerHTML = 'PLAYER NAME';
	name_span.appendChild(name_label);
	name_span.appendChild(name_val);
	
	/* 
		Create default TWITTER HANDLE span
	*/
	var handle_span = document.createElement('span');
	var handle_label = document.createElement('b');
	handle_label.innerHTML = 'Twitter Handle: ';
	var handle_link = document.createElement('a');
	handle_link.setAttribute('id', 'handle');
	handle_link.setAttribute('href', '');
	handle_link.innerHTML = '@TWITTERHANDLE';
	handle_span.appendChild(handle_label);
	handle_span.appendChild(handle_link);
	
	/* 
		Create default HOMETOWN span 
	*/
	var home_town_span = document.createElement('span');
	home_town_span.setAttribute('style', 'padding-right:20px;');
	var home_town_label = document.createElement('b');
	home_town_label.innerHTML = "From: ";
	var home_town_val = document.createElement('span');
	home_town_val.setAttribute('id', 'hometown');
	home_town_val.innerHTML = "HOMETOWN";
	home_town_span.appendChild(home_town_label);
	home_town_span.appendChild(home_town_val);
	
	/* 
		Create default SCHOOL span 
	*/
	var school_span = document.createElement('span');
	var school_label = document.createElement('b');
	school_label.innerHTML = "School: ";
	var school_val = document.createElement('span');
	school_val.setAttribute('id', 'school');
	school_val.innerHTML = "SCHOOL";
	school_span.appendChild(school_label);
	school_span.appendChild(school_val);
	
		
	/* 
		Create default POSITION span 
	*/
	var position_span = document.createElement('span');
	position_span.setAttribute('style', 'padding-right:20px;');
	var position_label = document.createElement('b');
	position_label.innerHTML = "Position: ";
	var position_val = document.createElement('span');
	position_val.setAttribute('id', 'position');
	position_val.innerHTML = "POS";
	position_span.appendChild(position_label);
	position_span.appendChild(position_val);
	
	/* 
		Create default HITS/THROWS span 
	*/
	var bats_throws_span = document.createElement('span');
	var bats_throws_label = document.createElement('b');
	bats_throws_label.innerHTML = "Bats/Throws: ";
	var bats_val = document.createElement('span');
	bats_val.setAttribute('id', 'bats');
	bats_val.innerHTML = "H";
	var slash_span = document.createElement('span');
	slash_span.innerHTML = "/";
	var throws_val = document.createElement('span');
	throws_val.setAttribute('id', 'throws');
	throws_val.innerHTML = "H";
	bats_throws_span.appendChild(bats_throws_label);
	bats_throws_span.appendChild(bats_val);
	bats_throws_span.appendChild(slash_span);
	bats_throws_span.appendChild(throws_val);
	
	
	/*
		Create default YEAR ACQUIRED span
	*/
	var year_acquired_span = document.createElement('span');
	year_acquired_span.setAttribute('style', 'padding-right:20px;');
	var year_acquired_label = document.createElement('b');
	year_acquired_label.innerHTML = "Year Acquired: ";
	var year_acquired_val = document.createElement('span');
	year_acquired_val.setAttribute('id', 'yearAcquired');
	year_acquired_val.innerHTML = "YYYY";
	year_acquired_span.appendChild(year_acquired_label);
	year_acquired_span.appendChild(year_acquired_val);
	
	/*
		Create default DRAFTED span
	*/
	var drafted_span = document.createElement('span');
	var drafted_label = document.createElement('b');
	drafted_label.innerHTML = "Drafted: ";
	var drafted_val = document.createElement('span');
	drafted_val.setAttribute('id', 'drafted');
	drafted_val.innerHTML = "NTH ROUND, NTH OVERALL PICK";
	drafted_span.appendChild(drafted_label);
	drafted_span.appendChild(drafted_val);
	
	/* Append all individual elements to the left column div */
	left_col.appendChild(name_span);
	left_col.appendChild(document.createElement('br'));
	left_col.appendChild(handle_span);
	left_col.appendChild(document.createElement('br'));
	left_col.appendChild(home_town_span);
	left_col.appendChild(school_span);
	left_col.appendChild(document.createElement('br'));
	left_col.appendChild(position_span);
	left_col.appendChild(bats_throws_span);
	left_col.appendChild(document.createElement('br'));
	left_col.appendChild(year_acquired_span);
	left_col.appendChild(drafted_span);	
	
	/* Create the left column div */
	var right_col = document.createElement('div');
	right_col.setAttribute('style', 'float:right;width:50%;');
	
	/*
		Create default BORN span
	*/
	var born_span = document.createElement('span');	
	var born_label = document.createElement('b');
	born_label.innerHTML = "Born: ";
	var born_val = document.createElement('span');
	born_val.setAttribute('id', 'dob');
	born_val.innerHTML = "YYYY-MM-DD";
	born_span.appendChild(born_label);
	born_span.appendChild(born_val);
	
	/*
		Create default HEIGHT/WEIGHT span
	*/
	var height_weight_span = document.createElement('span');
	var height_label = document.createElement('b');
	height_label.innerHTML = "Height: ";
	var weight_label = document.createElement('b');
	weight_label.innerHTML = "Weight: ";
	var height_val = document.createElement('span');
	height_val.setAttribute('style', 'padding-right:20px;');
	height_val.setAttribute('id', 'inches');
	height_val.innerHTML = "X' XX\"";
	var weight_val = document.createElement('span');
	weight_val.setAttribute('id', 'lbs');
	weight_val.innerHTML = "XXX lbs";
	height_weight_span.appendChild(height_label);
	height_weight_span.appendChild(height_val);
	height_weight_span.appendChild(weight_label);
	height_weight_span.appendChild(weight_val);
	
	/*
		Create default SIGNED DATE span
	*/
	var signed_span = document.createElement('span');
	signed_span.setAttribute('style', 'padding-right:20px;');
	var signed_label = document.createElement('b');
	signed_label.innerHTML = "Signed: ";
	var signed_val = document.createElement('span');
	signed_val.setAttribute('id', 'signedDate');
	signed_val.innerHTML = "YYYY-MM-DD";
	signed_span.appendChild(signed_label);
	signed_span.appendChild(signed_val);
	
	/*
		Create default BONUS span
	*/
	var bonus_span = document.createElement('span');
	var bonus_label = document.createElement('b');
	bonus_label.innerHTML = "Bonus: ";
	var bonus_val = document.createElement('span');
	bonus_val.setAttribute('id', 'bonus');
	bonus_val.innerHTML = "$XXXXXXX";
	bonus_span.appendChild(bonus_label);
	bonus_span.appendChild(bonus_val);
	
	/*
		Create default MILB OPTIONS span
	*/
	var options_span = document.createElement('span');
	var options_label = document.createElement('b');
	options_label.innerHTML = "Options Remaining: ";
	var options_val = document.createElement('span');
	options_val.setAttribute('id', 'milbOptions');
	options_val.innerHTML = "X";
	options_span.appendChild(options_label);
	options_span.appendChild(options_val);
	
	/*
		Create default RULE FIVE ELIGIBILITY span
	*/
	var rule_five_span = document.createElement('span');
	rule_five_span.setAttribute('style', 'padding-right:20px;');
	var rule_five_label = document.createElement('b');
	rule_five_label.innerHTML = "Rule 5 Eligible: ";
	var rule_five_val = document.createElement('span');
	rule_five_val.setAttribute('id', 'ruleFive');
	rule_five_val.innerHTML = "YYYY";
	rule_five_span.appendChild(rule_five_label);
	rule_five_span.appendChild(rule_five_val);
	
	/*
		Create default MILB FREE AGENCY span
	*/
	var milb_fa_span = document.createElement('span');
	var milb_fa_label = document.createElement('b');
	milb_fa_label.innerHTML = "MiLB Free Agency: ";
	var milb_fa_val = document.createElement('span');
	milb_fa_val.setAttribute('id', 'milbFA');
	milb_fa_val.innerHTML = "YYYY";
	milb_fa_span.appendChild(milb_fa_label);
	milb_fa_span.appendChild(milb_fa_val);
	
	right_col.appendChild(born_span);
	right_col.appendChild(document.createElement('br'));	// Line Break
	right_col.appendChild(height_weight_span);
	right_col.appendChild(document.createElement('br'));	// Line Break
	right_col.appendChild(signed_span);
	right_col.appendChild(bonus_span);
	right_col.appendChild(document.createElement('br'));	// Line Break
	right_col.appendChild(options_span);
	right_col.appendChild(document.createElement('br'));	// Line Break
	right_col.appendChild(rule_five_span);
	right_col.appendChild(milb_fa_span);
	
	table.appendChild(left_col);
	table.appendChild(right_col);
	body.appendChild(table);
	
	
}

// Simple function to append the appropriate suffix to any number (in a string)
// For example, 1 -> 1st, 12 -> 12th, 323 -> 323rd, etc.

function number_suffix(num) {
	var num_string = String(num);
	var ones = num_string.substring(num_string.length - 1);
	var tens = num_string.substring(num_string.length - 2);

	switch(ones) {
		case '1': 
			if (tens == '11') num_string += 'th';
			else num_string +='st';
			break;
		case '2': 
			if (tens == '12') num_string += 'th';
			else num_string +='nd';
			break;
		case '3': 
			if (tens == '13') num_string += 'th';
			else num_string +='rd';
			break;
		default: 
			num_string += 'th';
			break;
	} return num_string;
}