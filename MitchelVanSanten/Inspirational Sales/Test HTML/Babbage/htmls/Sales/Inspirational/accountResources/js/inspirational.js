/* salesLevel.js */

function initDatePicker()
{
	var inps = $( "input.date:not(.pan_initDone)" );
	for( var i = 0; i < inps.length; i++ )
	{
		$(inps[i]).datepicker(
			{ 
				dateFormat: "dd M yy", 
				firstDay: 1,
				monthNames: [ "Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December" ],
				dayNamesMin: [ "Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za" ]
				
			});

		$(inps[i]).addClass( "pan_initDone" );
	}

}

function getNow()
{
	var d = new Date(); 
	return parseInt(d.getTime()/1000);
}

function setReminderActive(elem)
{
	$(elem).addClass('active');
}

function timeToReminde()
{
	var now = getNow();
	var reminderList = $( ".reminderSymbol:not(.active)" );
	
	for( var i = 0; i < reminderList.length; i++ )
	{
		timeString = parseInt($(reminderList[i]).data('remindertime'));
		if( timeString < now + 1 ) setReminderActive(reminderList[i]);
		$(reminderList[i]).addClass( "pan_initDone" );
	}
	
	setReminderAlarmClock();
}

function setReminderAlarmClock()
{

	var now = getNow();
	var reminderList = $( ".reminderSymbol:not(.active)" );

	min 	= 0;
	imin 	= -1;
	for( var i = 0; i < reminderList.length; i++ )
	{
		timeString = parseInt($(reminderList[i]).data('remindertime'));
		var wait = (timeString - now);

		if( wait < 1 ) 
			setReminderActive($(reminderList[i]))
		else if( imin == -1  || wait < min ) 
		{ 
			min = wait; 
			imin = i; 
		}

	}
	if( imin > -1 )
		setTimeout(function(){timeToReminde()}, min * 1000);

}

function initReminder()
{
	var now = getNow();
	var reminderList = $( ".reminderSymbol:not(.pan_initDone)" );


	for( var i = 0; i < reminderList.length; i++ )
	{
		timeString = parseInt($(reminderList[i]).data('remindertime'));
		if( timeString < now + 1 ) setReminderActive(reminderList[i]);
		$(reminderList[i]).addClass( "pan_initDone" );
	}
	setReminderAlarmClock()
}

//	[ BEGIN TOEVOEGING BABBAGE ]
function setRole(classname, role) {
	if (document.getElementsByClassName(classname).length > 0) {
		var x = document.getElementsByClassName(classname);
		for (var i = 0; i < x.length; i++) {
			x[i].setAttribute("role", role);
		}
	}
}

function setLabel(classname, label) {
	if (document.getElementsByClassName(classname).length > 0) {
		var x = document.getElementsByClassName(classname);
		for (var i = 0; i < x.length; i++) {
			x[i].setAttribute("aria-label", label);
		}
	}
}

function setBlockquote(classname) {
	if (document.getElementsByClassName(classname).length > 0) {
		var x = document.getElementsByClassName(classname);
		for (var i = 0; i < x.length; i++) {
			if (x[i].classList.contains("initDoneBabbage")) {
				continue;
			} else {
				var blogCardMsg = x[i].innerHTML;
				x[i].innerHTML = "";
				x[i].insertAdjacentHTML("afterbegin", "<blockquote>"+blogCardMsg+"</blockquote>");
				x[i].className += " initDoneBabbage";
			}
		}
	}
}

function setLabelDropdownEditbox(classname) {
	if (document.getElementsByClassName(classname).length > 0) {
		var x = document.getElementsByClassName(classname);
		for (var i = 0; i < x.length; i++) {
			var label = x[i].innerHTML;
			var sibling = x[i].nextElementSibling;
			if (sibling.classList.contains("cell")) {
				continue;
			} else {
				sibling.children[0].setAttribute("aria-label", label);
			}
		}
	}
}

function setLabelTabblad(classname) {
	if (document.getElementsByClassName(classname).length > 0) {
		var x = document.getElementsByClassName(classname);
		for (var i = 0; i < x.length; i++) {
			var label = x[i].children[0].innerHTML;
			x[i].setAttribute("aria-label", "Tabblad:" + " " + label);
		}
	}
}
//	[ EINDE TOEVOEGING BABBAGE ]

function pan_UserInit(base)
{
	initDatePicker();
	$("select.flexselect").flexselect();
	initReminder();
	//	[ BEGIN TOEVOEGING BABBAGE ]
	setRole("tableRow", "row");
	setRole("tableItem cell", "cell");
	setRole("rowgroup", "rowgroup");
	setRole("tableBody", "table");
	setRole("buttonBox js", "button");
	setRole("addItemCard popOver-open", "link");
	setRole("popOver-headerTitle", "navigation");
	setRole("blogContainer", "navigation");
	setRole("headerCardMsg", "navigation");
	setLabel("prioritySymbol", "Prioriteit");
	setLabel("deadlineSymbol red", "Deadline rood");
	setLabel("deadlineSymbol yellow", "Deadline geel");
	setLabel("popOver-headerClose", "Pop-up sluiten");
	setLabel("popOver-headerTitle", "Pop-up titel");
	setBlockquote("blogCard");
	setLabelTabblad("tabLine-tab");
	setLabelDropdownEditbox("tableItem key");
	//	[ EINDE TOEVOEGING BABBAGE ]
	//	window.alert("Script geladen - Test");
}

/*
    h: heading
    l: list
    i: list item
    t: table
    k: link
    n: nonLinked text
    f: form field
    u: unvisited link
    v: visited link
    e: edit field
    b: button
    x: checkbox
    c: combo box
    r: radio button
    q: block quote
    s: separator
    m: frame
    g: graphic
    d: landmark
    o: embedded object
    1 to 6: headings at levels 1 to 6 respectively
    a: annotation (comment, editor revision, etc.)
*/
