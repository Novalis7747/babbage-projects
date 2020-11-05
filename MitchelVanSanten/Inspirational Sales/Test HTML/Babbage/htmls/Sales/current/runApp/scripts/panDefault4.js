/* panDeafult-4js */



/*

*/
function pan_console(txt)
{
	if (window.console) console.log(txt);
}

/*
	LOADER
*/

function pan_setLoading()
{
	$("body > .WebApp").prepend('<div id="pan_loader" class="loader loading"></div>');
	var loader = $("#pan_loader");
	var position= $(loader).position();
	var topDistScreenPage	= Math.max(0, $(document).scrollTop() );

	position.top 	= topDistScreenPage + position.top;
	$(loader).offset(position);
}
function pan_unsetLoading()
{
	$("#pan_loader").remove();
}

/*

STICKY

*/

function pan_sticky()
{
	var body	= $("body");
	if( body && $(body).hasClass("device-desktop") )
	{
		var elements = $(".sticky:not(.pan_initStickyDone)");
		var top		= [];
		var width	= [];
		var height	= [];
		var topDistScreenPage	= Math.max(0, $(document).scrollTop() );
	
		for( var i = 0; i < elements.length; i++)
		{
			var position= $(elements[i]).position();
			top[i] 		= position.top + topDistScreenPage;
			width[i]	= $(elements[i]).width();
			height[i]	= $(elements[i]).outerHeight(true);
			$(elements[i]).addClass("pan_initStickyDone");
		}
		
		for( var i = 0; i < elements.length; i++)
		{
			var nElem = $("<div class=\"stickyReplacer\" ></div>");
			$(elements[i]).before(nElem);
			if( $(elements[i]).hasClass('inherit') )
			{
				$(nElem).css( {"width":"inherit"} );
				nElem.height(height[i]);
		
				$(elements[i]).css( {"position":"fixed", "width":"inherit" } );
			}
			else
			{
				nElem.width(width[i]);
				nElem.height(height[i]);
		
				$(elements[i]).css( {"position":"fixed", "width":width[i] + "px" } );			
			}

			var pos 	= {};
			pos.top 	= top[i];
			$(elements[i]).offset(pos);
		}
	}	
}

/*
	WARNINGS
*/
function pan_warningPopOverBody()
{
	var ret = '';
	ret += 	'<div class="popOver warning openOnArival" id="jsWarningPopOver" style="display:none;width:600px;">';
	ret += 		'<div class="popOver-header">';
	ret += 			'<div class="popOver-headerTitle">Warning</div>';
	ret += 			'<div class="buttonBox js popOver-headerClose"><div class="buttonText">x</div></div>';
	ret += 		'</div>';
	ret += 		'<div class="popOver-content"></div>';
	ret += 		'<div class="popOver-footer"></div>';
	ret +=	'</div>';
	return ret;
}
function pan_clearWarnings(popOver)
{
	$(popOver).find(".popOver-content").empty();
}

function pan_initWarnings()
{
	var warningHome = $(".warningHome");
	var messages = $(warningHome).find('.messages');
	pan_console( "initWarings " + messages.length + " messages found" );
	if( messages.length )
	{
		var warningPopOver = $("#jsWarningPopOver");
		if( warningPopOver.length == 0 )
		{
			$("._popOverHome").append(pan_warningPopOverBody());
			warningPopOver = $("#jsWarningPopOver");
		}
		
		$(warningPopOver).find(".popOver-content").append(messages);
		$(warningHome).empty();
		pan_popOverOpenBody($("#jsWarningPopOver"),0,0);
	}
}

function pan_ajaxTransferWarnings( data )
{
	var newWarningHome = pan_ajaxFindContentFromData( data, ".warningHome" );
	
	var messages		= $(newWarningHome).find('.messages');
	if ( messages.length )
	{
		pan_console("Found " + messages.length + " warnings in data" );
		$t = $(".warningHome .warning");
		if ( !$t.length )
		{
			var m = $('<div class="warning"></div>');
			$(m).append(messages);
			$(".warningHome").append(m);
		}
		$(".warningHome .warning").append(messages);
	}
	else
		pan_console("No warnings found in data" );
}

/*

	POP-OVER

*/


var popOverZLevel 	= 10;
function newPopOverZlevel()
{
	popOverZLevel += 10;
	return popOverZLevel;
}
var submitConfirmed = true;

function pan_popOverGetLeftOffset( box, xEvent )
{
	var leftOffset = 0;

	if( $(box).hasClass('positionCursor') )
	{
		leftOffset = xEvent;
	}
	else
	{

		var docWidth 		= $("body").width();
		var windowWidth 	= $(window).innerWidth();
		var leftDistScreenPage	= Math.max(0, (windowWidth-docWidth)/2.0 );

		var margin 	= $(box).css('marginLeft');
		margin		= parseInt( margin.replace( "px", "" ) );

		var boxWidth	= $(box).outerWidth();
		leftOffset	= Math.max(0,(windowWidth-boxWidth)/2) + margin;
	
		// check if close button is visible and correct if not
		var boxWidth	= $(box).outerWidth();
		if ( leftDistScreenPage + leftOffset + boxWidth > windowWidth )
		{
			leftOffset = windowWidth - leftDistScreenPage - boxWidth;
		}
	}
		
	return leftOffset;

}

function pan_popOverGetTopOffset( box,yEvent )
{
	var topOffset = 0;

	if( $(box).hasClass('positionCursor') )
	{
		topOffset = yEvent;
	}
	else
	{
		var windowHeight	= $( window ).innerHeight();
		var topDistScreenPage	= Math.max(0, $(document).scrollTop() );


		var margin 	= $(box).css('marginTop');
		margin		= parseInt( margin.replace( "px", "" ) );
		topOffset	= topDistScreenPage + margin;
	
		// check if close button is visible and correct if not
		var boxHeight	= $(box).outerHeight();
		if ( topOffset < topDistScreenPage )
		{
			topOffset = topDistScreenPage;
		}
	}
	
	return topOffset;

}



function pan_popOverOpen( popOverOpen, event )
{

	var id	= $(popOverOpen).attr('id');
	var id	= id.replace('popOverOpen', 'popOver');
	var x	= 0;
	var y	= 0;

	var box = $("#"+id);
	if ( box.length == 1 )
	{
		if( event )
		{
			x = event.pageX;
			y = event.pageY;
		}
		pan_popOverOpenBody(box,x,y)
		pan_popOverCompleteOpen( popOverOpen, box );
	}
	else
		pan_console("Cannot find popOver " + id );
}

function pan_popOverOpenBody(popOverBody,x,y)
{
	var zIndex = newPopOverZlevel();
	
	$(popOverBody).show();
	if ( zIndex ) $(popOverBody).css( "zIndex", zIndex );

	var haveOffset = false;
	var offset	= {};

	leftOffset	= pan_popOverGetLeftOffset( popOverBody,x );
	if ( leftOffset !== false )
	{ haveOffset = true; offset[ 'left' ] = leftOffset; }

	topOffset	= pan_popOverGetTopOffset( popOverBody,y );
	if ( topOffset !== false )
	{ haveOffset = true; offset[ 'top' ] = topOffset; }

	if ( haveOffset )
		$(popOverBody).offset( offset );
}

function pan_popOverClose( popOverClose )
{
	var popOver = $(popOverClose).parent().parent();
	if( pan_containsChangedForm(popOver) && !confirm('Form has been edited, close anyway?' ) )
		return;
	pan_popOverDoClose( popOverClose, popOver );
}

function pan_containsChangedForm(target)
{
	var changedForms = $(target).find('form.pan_formChanged');
	pan_console( '# changed forms ' + changedForms.length );
	return changedForms.length > 0;

}
function pan_popOverPrepareClose( button, popOver )
{
	var todoList = pan_getToDoList( button, 'onClose' );
	for( var i = 0; i < todoList.length; i++ )
	switch( todoList[i].toLowerCase() )
	{
		case 'saveform'		: pan_saveFormInContainer( popOver );	break;
	}
}

function pan_popOverDoClose( button, popOver )
{
	var todoList = pan_getToDoList( button, 'onClose' );
	for( var i = 0; i < todoList.length; i++ )
	switch( todoList[i].toLowerCase() )
	{
		case 'unloadajax'	: pan_unLoadAjaxInContainer( popOver ); 	break;
	}
	if( $(popOver).attr('id') == 'jsWarningPopOver')
		pan_clearWarnings(popOver);
	$(popOver).hide();
}

function pan_popOverCompleteOpen( button, target )
{
	var todoList = pan_getToDoList( button, 'onOpen' );
	for( var i = 0; i < todoList.length; i++ )
	switch( todoList[i].toLowerCase() )
	{
		case 'loadajax'		: pan_loadAjaxInContainer( target, ".WebApp" ); 				break;
		default				: pan_console( 'Unknown tab todo item ' + todoList[i] ); 		break;
	}
}


function pan_initPopOver()
{
	var popOvers = $(".popOver:not(.pan_initPopOverDone)");
	for( i = 0; i < popOvers.length; i++ )
	{
		popOver = popOvers[i];
		if( $(popOver).draggable )
			$(popOver).draggable( {handle:".popOver-headerTitle"} );

		$(popOver).children(".popOver-header").children(".popOver-headerTitle").mousedown( function() 
			{
				zIndex = newPopOverZlevel();
				$(this).closest('.popOver').css( "zIndex", zIndex );	
			});
		$(popOver).addClass( "pan_initPopOverDone" );
		if( $(popOver).hasClass( "openOnArival" ) )
			pan_popOverOpenBody(popOver,0,0)
	}	
}


/* ToDoList */

function pan_explodeToDoList( list, prefix )
{
	var l = list.split(',');
	var ret = new Array();
	for( i = 0; i < l.length; i++ )
	{
		if ( l[i].indexOf(prefix,0) == 0 )
		{
			var t = l[i].split('-');
			if( t.length == 2 )
				ret.push( t[1] );
		}
	}
	return ret;
}

function pan_getToDoList( element, preFix )
{
	var ret = new Array();
	var list = $(element).data('jscall');
	if ( typeof list !== 'undefined') 
		ret = pan_explodeToDoList( list, preFix );
	return ret;
}

/* 

	Closables

*/

function pan_getClosablesChildren(parent)
{
	return $(parent).find( ".tabBox, .popOver, .switchBox");

}

function pan_closablePrepareClose(closable)
{
	if		( $(colsable).hasClass( '.tabbox' )  )
	{
		tab		= pan_tabBoxgetActiveTab( closable );
		content = pan_tabBoxGetMatchingContent(tab); 
		pan_tabBoxPrepareClose( tab, content );
	}
	else if ( $(colsable).hasClass( '.popover' ) )
	{
		button 	= pan_popOverGetButton(closable);
		content = pan_popOvergetMatchingContent(button);
		pan_popOverPrepareClose( button, content );
	}
	else if ( $(colsable).hasClass( '.switchBox' ) )
	{
		tab		= pan_switchBoxgetActiveTab( closable );
		content = pan_switchBoxGetMatchingContent(tab); 
		pan_switchBoxPrepareClose( tab, content );
	}
	else pan_console( 'closable prepare close Unknown closable type' );
	
}

function pan_closableDoClose(closable)
{
	if		( $(colsable).hasClass( '.tabbox' )  )
	{
		tab		= pan_tabBoxgetActiveTab( closable );
		content = pan_tabBoxGetMatchingContent(tab); 
		pan_tabBoxDoClose( tab, content );
	}
	else if ( $(colsable).hasClass( '.popover' ) )
	{
		button 	= pan_popOverGetButton(closable);
		content = pan_popOvergetMatchingContent(button);
		pan_popOverDoClose( button, content );
	}
	else if ( $(colsable).hasClass( '.switchBox' ) )
	{
		tab		= pan_switchBoxGetActiveTab( closable );
		content = pan_switchBoxGetMatchingContent(tab); 
		pan_tabBoxDoClose( tab, content );
	}	
	else pan_console( 'closable close, Unknown closable type' );
	
}

function pan_toggleBoxOpen(box)
{
	var boxId 	= $(box).attr('id');
	var openId	= boxId.replace('toggleBox','toggleOpen');
	var closeId	= boxId.replace('toggleBox','toggleClose');
	var contentId= boxId.replace('toggleBox','toggleContent');
	
	var open 	= $('#'+openId);
	var close	= $('#'+closeId);
	var content	= $('#'+contentId);

	$(content).show();
	$(close).show();
	$(open).hide();
}

function pan_toggleBoxClose(box)
{
	var boxId 	= $(box).attr('id');
	var openId	= boxId.replace('toggleBox','toggleOpen');
	var closeId	= boxId.replace('toggleBox','toggleClose');
	var contentId= boxId.replace('toggleBox','toggleContent');
	
	var open 	= $('#'+openId);
	var close	= $('#'+closeId);
	var content	= $('#'+contentId);

	$(content).hide();
	$(close).hide();
	$(open).show();
}

function pan_initToggleBox()
{
	var boxes = $(".toggleBox:not(.pan_initTabBoxDone)");
	for( var i = 0; i < boxes.length; i++ )
	{
		var box 	= boxes[i];
		var boxId 	= $(box).attr('id');
		var openId	= boxId.replace('toggleBox','toggleOpen');
		var closeId	= boxId.replace('toggleBox','toggleClose');
		var contentId= boxId.replace('toggleBox','toggleContent');
		
		var open 	= $('#'+openId);
		var close	= $('#'+closeId);
		var content	= $('#'+contentId);
		
		var t = $(content).attr('style');
		if( typeof t == 'undefined' )
			pan_toggleBoxOpen(box);
		else
			pan_toggleBoxClose(box);
		$(box).addClass("pan_initTabBoxDone");
	}
	pan_console('initToggleBox ' + boxes.length + ' boxes found');
}

function pan_toggleBoxToggle(button)
{
	var buttonId 	=  $(button).attr('id');
	if (buttonId.search('toggleOpen') >= 0 )
	{
		var boxId	= buttonId.replace("toggleOpen","toggleBox");
		var box		= $("#"+boxId);
		pan_toggleBoxOpen(box);
	}
	else
	{
		if (buttonId.search('toggleClose') >= 0 )
		{
			var boxId	= buttonId.replace("toggleClose","toggleBox");
			var box		= $("#"+boxId);
			pan_toggleBoxClose(box);
		}
		else pan_console('Unidentified toggle box ' + boxId );
	}
}
/* 

	TAB-BOX

*/


function pan_tabBoxPrepareClose(tab,content)
{
	todoList = pan_getToDoList( tab, 'onClose' );
	for( var i = 0; i < todoList.length; i++ )
	switch( todoList[i].toLowerCase() )
	{
		case 'saveform'		: pan_saveFormInContainer( content );	break;
	}
}

function pan_tabBoxDoClose(tab,content)
{
	todoList = pan_getToDoList( tab, 'onClose' );
	for( var i = 0; i < todoList.length; i++ )
	switch( todoList[i].toLowerCase() )
	{
		case 'unloadajax'		: pan_unLoadAjaxInContainer( content );	break;
	}
	$(tab).removeClass("active");
	$(content).hide();
}

function pan_tabBoxCompleteOpen( tab, content )
{
	pan_console("tabBoxComplete open on tab id " + $(tab).attr('id') );
	todoList = pan_getToDoList( tab, 'onOpen' );
	for( var i = 0; i < todoList.length; i++ )
	switch( todoList[i].toLowerCase() )
	{
		case 'loadajax'		: pan_loadAjaxInContainer( content, ".WebApp" ); 		break;
	}
}


function pan_tabBoxGetActiveTab( tabBox )
{
	var tabLine	= $(tabBox).children('.tabBox-tabLine').first();
	var active	= $(tabLine).find( '.tabLine-tab.active' ).first();
	return active;
}

function pan_tabBoxGetDefaultTab( tabBox )
{
	var tabLine	= $(tabBox).children('.tabBox-tabLine').first();
	var defTab	= $(tabLine).find( '.tabLine-tab' ).first();
	return defTab;
}

function pan_tabBoxGetMatchingContent(tab)
{
	var tabBox		= $(tab).closest( ".tabBox" ); 
	var tabId		= $(tab).attr('id');
	var contentId 	= tabId.replace("tabBoxTab", "tabBoxContent");
	var content		= $(tabBox).find("#"+contentId);
	return content;
}

function pan_tabBoxSwitchTo( tab )
{
	var tabBox			= $(tab).closest( '.tabBox' ); 
	var currentOpenTab	= pan_tabBoxGetActiveTab( tabBox );
	
	if ( currentOpenTab.length && $(tab).attr('id') == $(currentOpenTab).attr('id') ) return;
	
	if ( currentOpenTab.length )
		pan_tabBoxCloseTab(	currentOpenTab );

	pan_tabBoxOpenTab( tab );
}

function pan_tabBoxCloseTab( closingTab )
{
	var closingContent	= pan_tabBoxGetMatchingContent(closingTab);

	if ( closingContent.length )
	{
		var childClosables = pan_getClosablesChildren(closingContent);

		for(i=1; i<childClosables;i++)
			pan_closablePrepareClose(childClosables[i]);

		for(i=1; i<childClosables;i++)
			pan_closableClose(childClosables[i]);

		pan_tabBoxPrepareClose(closingTab, closingContent);
		pan_tabBoxDoClose(closingTab, closingContent);
	}
}

function pan_tabBoxOpenTab( tab )
{
	var content = pan_tabBoxGetMatchingContent(tab);
	
	$(tab).addClass("active");
	$(content).show();
	
	pan_tabBoxCompleteOpen( tab, content );
	
}


function pan_initTabBox()
{
	var tabBoxes	= $(".tabBox:not(.pan_initTabBoxDone)");
	var activeTabs	= [];
	for( var i = 0; i < tabBoxes.length; i++ )
	{
		var active = pan_tabBoxGetActiveTab( tabBoxes[i] );
		if ( active.length == 0 )
		{
			active = pan_tabBoxGetDefaultTab(tabBoxes[i]);	
			if ( active.length == 0 ) { pan_console( 'missing tabs in tabbox ' + i); continue; }
		}

		activeTabs[i] = active;
		$(tabBoxes[i]).addClass("pan_initTabBoxDone");
		$(tabBoxes[i]).children(".tabBox-content").first().children(".contentBox-content").hide();
	}

// open active tabs
	for( var i = 0; i < activeTabs.length; i++ )
	{
		pan_console( "set tab open on tabbox " + i + " active tab  id " + $(activeTabs[i]).attr('id') );
		pan_tabBoxOpenTab( activeTabs[i] );
	}
}

// SWITCH BOX
function pan_switchBoxGetActiveTab( switchBox )
{
	var contentBoxes = $(switchBox).children('.switchBoxContent');
	var active = false;
	for( var i = 0; i < contentBoxes.length; i++ )
	{
		var tabId = $(contentBoxes[i]).attr('id');
		tabId.replace("switchBoxContent", "switchButton");
		var tab = $('#' + tabId);
		if( tab.length )
		{
			if( tab.hasClass('active') ) { active = tab; break; }
		}
		else
			pan_console(' pan_switchBoxGetActiveTab missing tab ' + tabId );
	
	}
	return active;
}

function pan_switchBoxGetDefaultTab( switchBox )
{
	var contentBoxes = $(switchBox).children('.switchBoxContent');
	var active = false;
	if( contentBoxes.length )
	{
		var tabId = $(contentBoxes[0]).attr('id');
		var id = tabId.replace("switchBoxContent", "switchButton");
		var tab = $('#' + id);
		if( tab.length )
		{
			active = tab; 
			pan_console('pan_switchBoxGetDefaultTab default tab ' + id );
		}
		else
			pan_console('pan_switchBoxGetDefaultTab missing tab ' + id );
	}
	return active;
}

function pan_switchBoxOpenTab( tab )
{
	
	var content = pan_switchBoxGetMatchingContent(tab);
	
	$(tab).addClass("active");
	$(content).show();
	pan_switchBoxCompleteOpen( tab, content );
}

function pan_switchBoxGetMatchingContent(tab)
{
	var tabId		= $(tab).attr('id');
	var contentId 	= tabId.replace("switchButton", "switchBoxContent");
	var content		= $("#"+contentId);
	return content;
}

function pan_switchBoxGetMatchingTabs(switchBox)
{
	var content 	= $(switchBox).children('.switchBoxContent');
	var tabs		= [];
	for( var i = 0; i < content.length; i++ )
	{
		var id 		= $(content[i]).attr('id');
		var tabId 	= id.replace("switchBoxContent","switchButton");
		tabs[i] 	=$('#'+tabId);
	}
	return tabs;
}

function pan_switchBoxCompleteOpen( tab, content )
{
	pan_console("switchBoxComplete open on tab id " + $(tab).attr('id') );
	todoList = pan_getToDoList( tab, 'onOpen' );
	for( var i = 0; i < todoList.length; i++ )
	switch( todoList[i].toLowerCase() )
	{
		case 'loadajax'		: pan_loadAjaxInContainer( content, ".WebApp" ); 		break;
	}
}

function pan_switchBoxPrepareClose(tab,content)
{
	todoList = pan_getToDoList( tab, 'onClose' );
	for( var i = 0; i < todoList.length; i++ )
	switch( todoList[i].toLowerCase() )
	{
		case 'saveform'		: pan_saveFormInContainer( content );	break;
	}
}

function pan_switchBoxDoClose(tab,content)
{
	todoList = pan_getToDoList( tab, 'onClose' );
	for( var i = 0; i < todoList.length; i++ )
	switch( todoList[i].toLowerCase() )
	{
		case 'unloadajax'		: pan_unLoadAjaxInContainer( content );	break;
	}
	$(tab).removeClass("active");
	$(content).hide();
}

function pan_switchBoxCloseTab( closingTab )
{
	var closingContent	= pan_switchBoxGetMatchingContent(closingTab);

	if ( closingContent.length )
	{
		var childClosables = pan_getClosablesChildren(closingContent);

		for(i=1; i<childClosables;i++)
			pan_closablePrepareClose(childClosables[i]);

		for(i=1; i<childClosables;i++)
			pan_closableClose(childClosables[i]);

		pan_switchBoxPrepareClose(closingTab, closingContent);
		pan_switchBoxDoClose(closingTab, closingContent);
	}
}

function pan_switchBoxGetActiveTab(box)
{
	var tabs	= pan_switchBoxGetMatchingTabs(box);
	var active 	= false;
	for( var i = 0; i < tabs.length; i++ )
	{		
		if( $(tabs[i]).hasClass('active') )
			active = tabs[i];
	}
	return active;
}

function pan_switchBoxSwitchTo( tab )
{
	var content 		= pan_switchBoxGetMatchingContent(tab);
	var parent			= $(content).closest('.switchBox');
	var currentOpenTab	= pan_switchBoxGetActiveTab(parent);

	if ( currentOpenTab  && $(tab).attr('id') == $(currentOpenTab).attr('id') ) return;
	
	if ( currentOpenTab ) pan_switchBoxCloseTab( currentOpenTab );

	pan_switchBoxOpenTab( tab );
}

function pan_initSwitchBox()
{
	var switchBoxes	= $(".switchBox:not(.pan_initSwitchBoxDone)");
	var activeTabs	= [];
	for( var i = 0; i < switchBoxes.length; i++ )
	{
		var active = pan_switchBoxGetActiveTab( switchBoxes[i] );
		if ( !active || active.length == 0 )
		{
			active = pan_switchBoxGetDefaultTab(switchBoxes[i]);	
			if ( active && active.length == 0 ) { pan_console( 'missing tabs in switchbox ' + i); continue; }
		}

		activeTabs[i] = active;
		$(switchBoxes[i]).addClass("pan_initSwitchBoxDone");
		$(switchBoxes[i]).children(".switchBoxContent").hide();
	}

// open active tabs
	for( var i = 0; i < activeTabs.length; i++ )
	if( activeTabs[i] )
	{
		pan_console( "set tab open on tabbox " + i + " active tab  id " + $(activeTabs[i]).attr('id') );
		pan_switchBoxOpenTab( activeTabs[i] );
	}
}


/*

		AJAX

*/

function pan_ajaxGetMatchingTarget( link )
{
	target = $(link).siblings('.ajaxTargetArea').first();
	return target;

}

function pan_loadAjaxInContainer( container, dataSelector )
{
	ajaxCalls = $(container).find("input[name='ajaxUrl']");
	for(i=0; i < ajaxCalls.length; i++ )
	{
		var	url 	= $(ajaxCalls[i]).val();
		var target	= pan_ajaxGetMatchingTarget( ajaxCalls[i] );
		var content = $(target).children();
		if(content.length == 0 )
			pan_ajaxGetUrlToTarget( url, target, dataSelector );
	}
}


function pan_unLoadAjaxInContainer( container )
{
	pan_console( 'pan_unLoadAjaxInContainer' );
	ajaxCalls = $(container).find("input[name='ajaxUrl']");
	for(i=0; i < ajaxCalls.length; i++ )
	{
		target	= pan_ajaxGetMatchingTarget( ajaxCalls[i] );
		$(target).empty();
	}

}

function pan_ajaxFindContentFromData( data, selector )
{
	var content = $(data).find( selector );
	if ( content.length ) return content;

	content = $(data).filter( selector );
	if ( content.length ) return content;
	
	return false;
}

function pan_ajaxSendForm(formUrl, postData)
{
	$.ajax({
		url:formUrl,
		type:"POST",
		data:postData,
		cache: false,
		contentType: false,
		processData: false,
		success: function(data)
			{
				pan_console('Form send succesfully to ' + formUrl );
			},
		error: function()
			{
				pan_console('Form could not be send to ' + formUrl );
			}
		});
}

function pan_ajaxGetUrlToTarget( urlToLoad, targetArea, dataSelector )
{
	$(targetArea).append( "Loading ... " );
	$.ajax({
		url:urlToLoad,
		type:"GET",
		success: function(data)
			{
				
				var content = pan_ajaxFindContentFromData( data, dataSelector );
				if ( content !== false )
				{	
					pan_ajaxTransferWarnings( data );
					pan_ajaxTransferPopOvers( data );
					var newWarningHome = pan_ajaxFindContentFromData( content, ".warningHome" );
					$(newWarningHome).remove();
					var newPopOverHome = pan_ajaxFindContentFromData( content, "._popOverHome" );
					$(newPopOverHome).remove();
					$(targetArea).empty();
					$(targetArea).append( content );
					pan_console( "Ajax GET load succesfully" );
				}
				else
				{
					$(targetArea).empty();
					$(targetArea).append( data );
					pan_console( "Ajax GET could not find content " + dataSelector );
				}
			},
		error: function()
			{
				$(target).append( "<p>Could not load requested URL "+urlToLoad+"</p>" );
			}
		});
}



function pan_ajaxPostForm( urlToLoad, postData, form )
{
	$.ajax({
		url:urlToLoad,
		type:"POST",
		data:postData,
		cache: false,
		contentType: false,
		processData: false,
		success: function(data)
			{

				pan_ajaxTransferWarnings( data );
				var haveComponents = pan_updateComponents( data );
				if ( haveComponents )
				{
					pan_ajaxTransferPopOvers( data );
					var newPopOverHome = pan_ajaxFindContentFromData( data, "._popOverHome" );
					$(newPopOverHome).remove();
				}
				else 
				{
					pan_console(data);
				}
				var newWarningHome = pan_ajaxFindContentFromData( data, ".warningHome" );
					$(newWarningHome).remove();
//				else
//					pan_replaceWebPage(data);
			},
		error: function()
			{
				$(form).append( "<p>Could not load requested URL "+urlToLoad+"</p>" );
			},
		beforeSend: function()
			{
				pan_setLoading();
				pan_disableForm( form );
			},
		complete: function()
			{
				pan_unsetLoading();
				pan_enableForm( form );
			}
		});
}

function pan_ajaxPostUrlToPage( urlToLoad, postData, form )
{
	$.ajax({
		url:urlToLoad,
		type:"POST",
		data:postData,
		cache: false,
		contentType: false,
		processData: false,
		success: function(data)
			{
				pan_replaceWebPage(data);
			},
		error: function()
			{
				$(form).append( "<p>Could not load requested URL "+urlToLoad+"</p>" );
			}
		});
}




function pan_ajaxTransferPopOvers( data )
{

	var newPopOvers = pan_ajaxFindContentFromData( data, "._popOverHome .popOver" );
	if ( newPopOvers )
		pan_console("found " + newPopOvers + " popovers in data" );
	else
	{
		pan_console("No popovers in data" );
		return;
	}
	
	var popOverHome = $("._popOverHome" );
	pan_console("popover home count " + popOverHome.length );
	for( var i = 0; i < newPopOvers.length; i++ )
	{
		var newPop = newPopOvers[i];
		var id = $(newPop).attr('id');
		var oldPop = $(popOverHome).find( "#"+id );
		if ( oldPop.length )
		{
			pan_console("skipping popOver " + id );
		}
		else
		{
			$(popOverHome).append(newPop);
			pan_console("appending popOver " + id );
		}
	}
}

function pan_updateComponents( data )
{
	var components = pan_ajaxFindContentFromData( data, ".component" );
	if ( components && components.length )
	{
		for( i = 0; i < components.length; i++ )
			pan_replaceComponent(components[i]);
		return true;
	}
	return false;
}

function pan_replaceWebPage(data)
{
	pan_console('replacing entire page' );
	newDoc = document.open("text/html", "replace");
	newDoc.write(data);
	newDoc.close();
}

function pan_replaceComponent(component)
{
	var id = $(component).attr('id');
	var oldContent = $("#" + id );

	if ( oldContent.length )
	{
		var box = $(oldContent).closest( '.pan_initNanoScrollerDone' );
		$(oldContent).replaceWith(component);
		if( box.length )
			$(box).removeClass('pan_initNanoScrollerDone');
			
	}
	
}


/* FORMS  */

function pan_confirmSubmit(txt)
{
	submitConfirmed = confirm(txt);
}

function pan_saveFormInContainer( container )
{
	form = $(container).find('form.pan_formChanged');
	if( form.length == 1 )
	{
		pan_saveFormByCommand(form);
		pan_console( 'saveFormByCommand saving form' );
	}
	else pan_console( 'no form to save' );
}

function pan_disableSubmit(form) 
{
	var i, list, submit;

	list = $(form).find("input[type=submit]");
	for (i = 0; i < list.length; i++)
	{
		submit = list[i];
		$(submit).prop("disabled",true);
		$(submit).addClass("submitDisabled");
	}

	list = $(form).find("input[type=image]");
	for (i = 0; i < list.length; i++)
	{
		submit = list[i];
		$(submit).prop("disabled",true);
		$(submit).addClass("submitDisabled");
	}
	
	list = $(form).find("button[type=submit]");
	for (i = 0; i < list.length; i++)
	{
		submit = list[i];
		$(submit).prop("disabled",true);
		$(submit).addClass("submitDisabled");
	}
}

function pan_submitForm(submit)
{
	if ( !submitConfirmed ) { submitConfirmed = true; return; }
	var todo = pan_getToDoList( submit, 'onSubmit' );
	var defaultMode = 'replaceComponents';
	var mode = defaultMode;
	if( todo.length == 1 )
	{
		mode = todo[0];
	}
	var form 	= $(submit).closest('form');
	
	pan_disableSubmit(form);
	
	$(form).addClass( "formDisabled" );
	if( form.length == 1 )
	{
		$(form).removeClass('pan_formChanged');
		var formUrl =  $(form).attr("action");
		var postData= new FormData($(form)[0]);	
		pan_addButtonToPostData(submit,postData);
		switch( mode.toLowerCase() )
		{
			case 'saveandclose'			:
				pan_addComponentsToPostData(postData);
				var popOver 	= $(form).closest('.popOver');
				if( popOver.length )
				{
					var popOverClose= $(popOver).find('.popOver-headerClose');
					pan_popOverClose( popOverClose );
				}
			 	pan_ajaxPostForm( formUrl, postData, form );
			break;
			case 'reloadpage'			:
				var popOver 	= $(form).closest('.popOver');
				if( popOver.length )
				{
					var popOverClose= $(popOver).find('.popOver-headerClose');
					pan_popOverClose( popOverClose );
				}
				pan_ajaxPostUrlToPage( formUrl, postData, form);
			break;
			case 'replacecomponents' 	:
			default						:
				pan_addComponentsToPostData(postData);
				pan_ajaxPostForm( formUrl, postData, form );
			break;
		}
	}
	$(form).removeClass( "formDisabled" );
}

function pan_saveFormByCommand( form )
{
	var submit = $(form).find('input[type=submit]').first();
	if( submit.length == 0 )
		submit = $(form).find('button[type=submit]').first();
		
	if ( submit.length )
	{
		var postData = new FormData($(form)[0]); 
		pan_addButtonToPostData(submit,postData);
		formUrl = $(form).attr('action');
		pan_ajaxSendForm( formUrl, postData );
		$(form).removeClass('pan_formChanged');
	} 
}

function pan_addButtonToPostData( submit, postData )
{
	var submitName 	= $(submit).attr('name');
	var submitValue	= $(submit).attr('value');	
	postData.append( submitName, submitValue );

	var callBack	= $(submit).data('callback');
	if (typeof callBack !== "undefined")
		postData.append( 'callback', callBack ); 

}

function pan_addComponentsToPostData( postData )
{
	var components	= $( ".component" );
	var numComp 	= components.length;
	for( i = 0; i < numComp; i++ )
	{
		var comp 		= components[i];
		var baseName 	= "component[" + i +"]";
		var id			= $(comp).attr('id');
		var callBack 	= $(comp).data('callback');
		var dependsOn 	= $(comp).data('dependson');
		if ( typeof id !== 'undefined' && id.length > 0 )
		{
			if ( typeof callBack === 'undefined' ) callBack="";
			if ( typeof dependsOn === 'undefined' ) dependsOn="";
			postData.append( baseName+"[id]", id );
			postData.append( baseName+"[callback]", callBack );
			postData.append( baseName+"[dependson]", dependsOn );
			pan_console("component " + id + " found width callback " + callBack );
		}
	}

}


function pan_disableForm( form )
{
	$(form).find('input').attr('disabled','disabled');
	$(form).find('select').attr('disabled','disabled');
	$(form).find('textarea').attr('disabled','disabled');
}
function pan_enableForm( form )
{
	$(form).find('input').prop('disabled',false);
	$(form).find('select').prop('disabled',false);
	$(form).find('textarea').prop('disabled',false);
}


// TODO check form class autoSave 
function pan_initAutoSave()
{
	var forms = $('form:not(.pan_initAutoSaveDone)');
	for( var i = 0; i < forms.length; i++ )
	{
		var form = forms[i];
		$(form).find('input[type=text]').keyup(
			function()
			{
				$(this).closest('form').addClass('pan_formChanged');
			});
		$(form).find('input[type=text].date').change(
			function()
			{
				$(this).closest('form').addClass('pan_formChanged');
			});

		$(form).find('textarea').keyup(
			function()
			{
				$(this).closest('form').addClass('pan_formChanged');
			});
					
		$(form).find('input[type=radio]').change(
			function()
			{
				$(this).closest('form').addClass('pan_formChanged');
			});
		$(form).find('input[type=checkbox]').change(
			function()
			{
				$(this).closest('form').addClass('pan_formChanged');
			});
		$(form).find('select').change(
			function()
			{
				$(this).closest('form').addClass('pan_formChanged');
			});

		$(form).addClass('pan_initAutoSaveDone');
	}
}

/*

	CHARTS
*/

function pan_drawChart( chartType, data, jOptions, chartId )
{

	var gdata = google.visualization.arrayToDataTable(data);
	var chart = false;
	switch( chartType.toLowerCase() )
	{
/* package corechart */
		case 'piechart' 	: chart = new google.visualization.PieChart(document.getElementById(chartId)); 			break;
		case 'barchart' 	: chart = new google.visualization.BarChart(document.getElementById(chartId)); 			break;
		case 'columnchart' 	: chart = new google.visualization.ColumnChart(document.getElementById(chartId)); 		break;
		case 'combochart'	: chart = new google.visualization.ComboChart(document.getElementById(chartId)); 		break;
		case 'linechart'	: chart = new google.visualization.LineChart(document.getElementById(chartId)); 		break;


/* package Gauge */
		case 'gauge' 		: chart = new google.visualization.Gauge(document.getElementById(chartId)); 			break;


/* package OrgChart */
		case 'orgchart'		: chart = new google.visualization.OrgChart(document.getElementById(chartId)); 			break;



		default				:
			pan_console( "No shich chart type " + chartType );
	}
	if ( chart != false )
		chart.draw(gdata, jOptions);
}

function pan_initCharts()
{
	if ( typeof google != "undefined" ) 
	{
		var charts = $(".pan_chart:not(.pan_chartDone)");
		pan_console( charts.length + ' charts found' );
		for( i = 0; i < charts.length; i++ )
		{
			var chart = charts[i];
			var chartType=$(chart).data( 'charttype' );
			var jOptions= $(chart).data( 'chartoptions' );
			var jData 	= $(chart).data( 'chartdata' );
			var chartId = $(chart).attr( 'id' );
			
			if ( typeof chartType == 'undefined' )
				chartType = 'ColumnChart';
			
			if ( typeof jData != 'undefined' && typeof jOptions != 'undefined' )
			{
				pan_console('drawing chart ' + i + ' chartId = '+ chartId );
				pan_drawChart( chartType, jData.data, jOptions, chartId );
			}
			else
				pan_console('No data and/or options found for chart ' + i + ' chartId = '+ chartId );
			$(chart).addClass( 'pan_chartDone' );
		}
		$(window).resize(function(){pan_redrawCharts();});
	}
}

function pan_redrawCharts()
{
	if ( typeof google != "undefined" ) 
	{
		var charts = $(".pan_chart.pan_chartDone");
		for( i = 0; i < charts.length; i++ )
		{
			var chart = charts[i];
			var chartType=$(chart).data( 'charttype' );
			var jOptions= $(chart).data( 'chartoptions' );
			var jData 	= $(chart).data( 'chartdata' );
			var chartId = $(chart).attr( 'id' );
			
			if ( typeof chartType == 'undefined' )
				chartType = 'ColumnChart';
			
			if ( typeof jData != 'undefined' && typeof jOptions != 'undefined' )
			{
				pan_console('drawing chart ' + i + ' chartId = '+ chartId );
				pan_drawChart( chartType, jData.data, jOptions, chartId );
			}
			else
				pan_console('No data and/or options found for chart ' + i + ' chartId = '+ chartId );
		}
	}
}

function pan_autoSubmit(anchor)
{
	var form = $(anchor).closest('form');
	if( form.length )
	{

		var submit = $(form).find("input[type=submit]");
		if( submit.length )
			pan_submitForm( submit[0] );
	}
}

function pan_initSelectAutoSubmit()
{
	var select = $('select.autoSubmit:not(.pan_initAutoSubmitDone)');
	for( var i = 0; i < select.length; i++)
	{
		$(select[i]).on( 'change', function(event)
		{
			event.stopPropagation();
			pan_autoSubmit( this );
		});	
		$(select[i]).addClass('pan_initAutoSubmitDone');
	}
}

function pan_initInputAutoSubmit()
{
	var input = $('input.autoSubmit:not(.pan_initAutoSubmitDone)');
	for( var i = 0; i < input.length; i++)
	{
		$(input[i]).on( 'change', function(event)
		{
			event.stopPropagation();
			pan_autoSubmit( this );
		});	
		$(input[i]).addClass('pan_initAutoSubmitDone');
	}
}

function pan_initAutoSubmit()
{
	pan_initSelectAutoSubmit();
	pan_initInputAutoSubmit();
}

function pan_initNanoScroller()
{
	var d, t;
	d = new Date();
	t = d.getTime();
	if( typeof $.fn.nanoScroller != 'function') return;
	var list = $(".contentBox .nanoScrollBox:not(.pan_initNanoScrollerDone)");

	for( var i = 0; i < list.length; i++)
	{
		var box 			= list[i];
		var parent 			= $(box).closest('.contentBox');

		var parentClass 	= $(parent).attr('class') + ' ';
		var start 			= parentClass.indexOf('hr_');
		if( start < 0 ) continue;

		var bottom			= $(parent).css('marginBottom');
		$(parent).css('margin-bottom','0px');

		var offSet 			= $(box).offset();
		var top 			= offSet.top;

		var end				= parentClass.indexOf(' ',start+1);
		var nanoCls			= parentClass.substring(start,end);
		var vh 				= parseInt( nanoCls.substring(3) );

//		var cls 			= $(box).attr('class');
		
		if( nanoCls == 'hr_auto' )
		{
			var height		= $(box).outerHeight(true);
			var style		= 'style="height:'+height+'px; max-height:calc( 100vh - 50px - '+ top+'px);"';
		}
		else
		{
			var style 		= 'style="height:calc( '+vh+'vh - '+ top+'px - '+ bottom+' );"';
//			var style 		= 'style="height:calc( '+vh+'vh - '+ top+'px - 20px);"';
//			var height		= $(box).outerHeight(true);
//			pan_console(style + ' height = ' + height);
		}
		
		var id = 'nano' + t + i;
//		var nanoBox = '<div class="'+cls+'" '+ style +'><div class="nano" id="' + id + '"><div class="nano-content">'+$(box).html()+'</div></div></div>';
		var nanoBox = '<div class="nanoScrollBox"'+ style +'><div class="nano" id="' + id + '"><div class="nano-content">'+$(box).html()+'</div></div></div>';

		$(box).replaceWith(nanoBox);
	}
	list = $(".contentBox .nanoScrollBox:not(.pan_initNanoScrollerDone)");
	$(list).find('.nano').nanoScroller();
	$(list).addClass('pan_initNanoScrollerDone');

}

function pan_init()
{
// general initialization NOTE order is important
	pan_initWarnings();
	pan_initPopOver();
	pan_initTabBox();
	pan_initSwitchBox();
	pan_initToggleBox();

	pan_initCharts();
	pan_initNanoScroller();

	pan_initAutoSave();
	pan_initAutoSubmit();

	
	if ( typeof pan_UserInit != "undefined" )
		pan_UserInit();

}


function pan_setupEventHandlers()
{
	$(document).ajaxSuccess( function(event)
	{
		pan_init();
	});

	$(document).on("click", "input[type=submit]", function(event) 
	{ 
		event.preventDefault(); 
		event.stopPropagation();
		pan_submitForm( this );
	} );

	$(document).on("click", "button[type=submit]", function(event) 
	{ 
		event.preventDefault(); 
		event.stopPropagation();
		pan_submitForm( this );
	} );

	$(document).on("click", "input[type=image]", function(event) 
	{ 
		event.preventDefault(); 
		event.stopPropagation();
		pan_submitForm( this );
	} );


	$(document).on("click", ".tabLine-tab", function(event)
		{
			event.stopPropagation();
			pan_tabBoxSwitchTo( this );
		});

	$(document).on("click", ".switchButton", function(event)
		{
			event.stopPropagation();
			pan_switchBoxSwitchTo( this );
		});

	$(document).on("click", ".toggleButton", function(event)
		{
			event.stopPropagation();
			pan_toggleBoxToggle( this );
		});
		
	$(document).on("mousedown", ".popOver-open", function(event)
		{
			event.stopPropagation();
			pan_popOverOpen( this, event );
		});

	$(document).on("click", ".popOver-headerClose", function(event)
		{
			event.stopPropagation();
			pan_popOverClose( this );			
		});
	$(document).on("click", "a.navButton:not(.noLoadingSpinner)", function(event)
		{
			pan_setLoading();
		});
}



$(document).ready( function()
	{	
		pan_init();
		pan_setupEventHandlers();
	}
);


