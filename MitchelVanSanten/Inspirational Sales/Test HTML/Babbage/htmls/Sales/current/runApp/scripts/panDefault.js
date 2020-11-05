/* panDeafult-141004.js */



/*

	POP-OVER

*/


function pan_popOverGetLeftOffset( box )
{
	var horPos = false;
	

	var docWidth 		= $("body").width();
	var windowWidth 	= $(window).innerWidth();
	var leftDistScreenPage	= Math.max(0, (windowWidth-docWidth)/2.0 );

	var leftOffset = 0;

	var boxWidth	= $(box).outerWidth();
	leftOffset	= Math.max(0,(windowWidth-boxWidth)/2);
	
	// check if close button is visible and correct if not
	var boxWidth	= $(box).outerWidth();
	if ( leftDistScreenPage + leftOffset + boxWidth > windowWidth )
	{
		leftOffset = windowWidth - leftDistScreenPage - boxWidth;
	}
	
	return leftOffset;

}

function pan_popOverGetTopOffset( box )
{
	var verPos 	= false;

	var windowHeight	= $( window ).innerHeight();
	var topDistScreenPage	= Math.max(0, $(document).scrollTop() );

	var topOffset = 0;

	var margin 	= $(box).css('marginTop');
	margin		= parseInt( margin.replace( "px", "" ) );
	topOffset	= topDistScreenPage + margin;
	
	// check if close button is visible and correct if not
	var boxHeight	= $(box).outerHeight();
	if ( topOffset < topDistScreenPage )
	{
		topOffset = topDistScreenPage;
	}
	
	return topOffset;

}



function pan_popOverOpen( popOverOpen )
{
	var zIndexBase = $(popOverOpen).closest(".popOver");
	if ( zIndexBase.length == 1 )
	{
		zIndex = parseInt( $(zIndexBase).css("zIndex") ) + 1;
	}
	else
		zIndex = 1;

	var box = $(popOverOpen).siblings(".popOver").first();
	$(box).show();
	if ( zIndex ) $(box).css( "zIndex", zIndex );

	var haveOffset = false;
	var offset	= {};
	
	leftOffset	= pan_popOverGetLeftOffset( box );
	if ( leftOffset !== false )
	{ haveOffset = true; offset[ 'left' ] = leftOffset; }
	
	topOffset	= pan_popOverGetTopOffset( box );
	if ( topOffset !== false )
	{ haveOffset = true; offset[ 'top' ] = topOffset; }

	if ( haveOffset )
	$(box).offset( offset );
	
	target = $(box).children( ".ajaxTargetArea" );
	console.log( "popover open callAjax target " + target.length );

	if ( target.length == 1 )
		pan_ajaxLoad( target );
}

function pan_savePopOverOnClose( popOver )
{
	var form = $(popOver).find('form.pan_formChanged');
	if( form.length == 1 )
		pan_autoSaveForm( form );
}	


function pan_popOverClose( popOverClose )
{
	popOver = $(popOverClose).closest(".popOver");
	pan_savePopOverOnClose( popOver );
	$(popOver).hide();
}


function pan_initPopOvers()
{
	var popOvers = $(".popOver:not(.pan_initDone)");
	for( i = 0; i < popOvers.length; i++ )
	{
		$(popOvers[i]).prepend("<div class=\"popOver-header\"><div class=\"popOver-dragHandle\"></div><div class=\"popOver-close\">X</div></div>");
		$(popOvers[i]).draggable({ handle: ".popOver-dragHandle" });
		$(popOvers[i]).addClass("pan_initDone");
		$(popOvers[i]).hide();
	}

}

/* 

	TAB-BOX

*/
function pan_tabBoxSwitchTo( tab )
{
	var tabBox		= $(tab).closest( ".tabBox" ); 
	var newIndex	= $(tab).index();
	
	var openTab		= $(tabBox).children("ul.tabBoxTab").first().children("li.active");
	var index		= $(openTab).index();

	var contentBoxes = $(tabBox).children( ".tabBoxContent" );
	var closingContent= contentBoxes[ index ];

	var form = $(closingContent).find('form.pan_formChanged');
	if( form.length == 1 )
		pan_autoSaveForm( form );

	pan_tabBoxSetActive( tab );
}

function pan_tabBoxSetActive( tab )
{
	var index	= $(tab).index();
	var tabBox	= $(tab).closest( ".tabBox" ); 
	var tabs	= $(tabBox).children("ul.tabBoxTab").first().children("li");
	var contentBoxes = $(tabBox).children( ".tabBoxContent" );
	if ( index >= contentBoxes.length || index < 0 ) index = 0;

	$(contentBoxes).hide();
	$(contentBoxes[index]).show();
	$(tabs).removeClass("active");
	$(tabs[index]).addClass("active");

	target = $(contentBoxes[index]).children( ".ajaxTargetArea" );
	console.log( "tabBoxSetActive callAjax target " + target.length );
	if ( target.length == 1 )
		pan_ajaxLoad( target );
	
}


function pan_initTabBoxesHide()
{
	var tabBoxes = $(".tabBox:not(.pan_initDone)");
	for( i = 0; i < tabBoxes.length; i++ )
	{
		$(tabBoxes[i]).children(".tabBoxContent").hide();
	}
}

function pan_initTabBoxesShowActive()
{
	var tabBoxes	= $(".tabBox:not(.pan_initDone)");
	var activeTabs	= [];
	for( i = 0; i < tabBoxes.length; i++ )
	{
		var tabs = $(tabBoxes[i]).children("ul.tabBoxTab").first();
		var active = $(tabs).children("li.active").first();
		if ( active.length == 0 )
			active = $(tabs).children("li").first();
		activeTabs.push( active );
		$(tabBoxes[i]).addClass("pan_initDone");
	}
	
// open active tabs
	for( i = 0; i < activeTabs.length; i++ )
	{
		pan_tabBoxSetActive( activeTabs[i] );
	}
}

/*

		AJAX

*/
function pan_ajaxLoad( target )
{
// find button
	var button = $(target).siblings( ".button" ).children("input[name='ajaxURL']").first();

	var ajaxTotalURL = $(button).val();
	if ( !ajaxTotalURL ) return;

	
	$.ajax({
		url:ajaxTotalURL,
		type:"GET",
		success: function(data)
			{
				$(target).empty();
				var content = $(data).find( '.WebAppPage' );
				if ( content.length )
					$(target).append( content );
				else
				{
					content = $(data).filter( '.WebAppPage' );
					if ( content.length )
						$(target).append( content );
					else
						$(target).append( data );
				}
			},
		error: function()
			{
				$(target).append( "<p>Could not load requested URL "+ajaxTotalURL+"</p>" );
			}
		});


}



/*

	RELOAD FORM (ONLY) ON SUBMIT

*/

function pan_disableForm( form )
{

	$(form).find('input').attr('disabled','disabled');
	$(form).find('select').attr('disabled','disabled');
	$(form).find('textarea').attr('disabled','disabled');
}

function pan_autoSaveForm( form )
{
	submit = $(form).find('input[type=submit]');

	if (submit.length)
	{
		var formURL 	= $(form).attr("action");
		var postData 	= new FormData($(form)[0]);	

		var submitName = $(submit[0]).attr('name');
		var submitValue= $(submit[0]).attr('value')+"Only";		
		postData.append( submitName, submitValue );
		pan_disableForm( form );
		$.ajax({
			url:formURL,
			data:postData,
			type:"POST",
			cache: false,
			contentType: false,
			processData: false
			});
		console.log("pan_autoSaveForm" + submitName + " " + submitValue );
	}
	$(form).removeClass('pan_formChanged' );
}

function pan_saveOnlyOnSubmit( target )
{
	var box 		= $(target);
	var boxName 	= $(box).attr('name');
	var boxValue 	= $(box).attr('value');
	var oldForm 	= $(target).closest( "form" );
	var postData 	= new FormData($(oldForm)[0]);	

	postData.append( boxName, boxValue );
	pan_disableForm( form );
	var formURL 	= $(oldForm).attr("action");	
	if ( !$(oldForm).hasClass("pan_loading") )
	{
		pan_disableForm( form );
		$.ajax({
			url:formURL,
			data:postData,
			type:"POST",
			cache: false,
			contentType: false,
			processData: false
			});
			console.log("savedOnlyOnSubmit");
	}
	
}

function pan_reloadFormOnSubmit( target )
{
	var box 		= $(target);
	var boxName 	= $(box).attr('name');
	var boxValue 	= $(box).attr('value');
	var oldForm 	= $(target).closest( "form" );
	var postData 	= new FormData($(oldForm)[0]);	

	postData.append( boxName, boxValue );

	var formURL 	= $(oldForm).attr("action");	
	if ( !$(oldForm).hasClass("pan_loading") )
	{
		$(oldForm).addClass("pan_loading");
		pan_disableForm( oldForm );
	
		$.ajax({
			url:formURL,
			data:postData,
			type:"POST",
			cache: false,
			contentType: false,
			processData: false,
			success: function(data)
				{
//					$(oldForm).empty();
					var newForm = $(data).filter( 'form' );
					if ( newForm.length == 0 )
						newForm = $(data).find( 'form' );

					if ( newForm.length )
						$(oldForm).replaceWith( newForm );

					var replaceList = $(data).find(".replaceMe:not(.pan_replaceDone)");
					console.log( "replace list found " + replaceList.length );
					for( var i = 0; i < replaceList.length; i++ )
						pan_replaceMe(replaceList[ i ]);
/*
					else
					{
						$(oldForm).replaceWith( data );
*/
				},
			error: function()
				{
					$(oldForm).append( "<p>Could not load requested URL "+formURL+"</p>" );
				}

			});

	}
	else console.log( "Canot reload form while laoding" );
	
}

function pan_replace()
{
	var replaceList = $(".replaceMe:not(.pan_replaceDone)");
	for( var i = 0; i < replaceList.length; i++ )
		pan_replaceMe(replaceList[ i ]);
}

function pan_replaceMe(replace)
{
	var replaceValue = $(replace).html();
	var classNames = $(replace).attr("class").split(' ');
	var cls	= false;
	for( var j = 0; j<classNames.length; j++ )
	{
		if( classNames[j].substr(0, 8) === "replace-")
		{
			cls = "." + classNames[j].substr(8);
			console.log("replaceing " + cls );
			$(cls).html( replaceValue );
		}
	}
	$(replace).addClass( "pan_replaceDone" );
	
}

function pan_initAutoSave()
{
	var forms = $('form:not(.pan_initAutoSaveDone)');
	for( var i = 0; i < forms.length; i++ )
	{
		var form = forms[i];
		$(form).find('input[type=text]').keyup(
			function()
			{
				$(form).addClass('pan_formChanged');
			});
		$(form).find('textarea').keyup(
			function()
			{
				$(form).addClass('pan_formChanged');
			});
		$(form).find('input[type=radio]').change(
			function()
			{
				$(form).addClass('pan_formChanged');
			});
		$(form).find('input[type=checkbox]').change(
			function()
			{
				$(form).addClass('pan_formChanged');
			});
		$(form).find('select').change(
			function()
			{
				$(form).addClass('pan_formChanged');
			});

		$(form).addClass('pan_initAutoSaveDone');
	}
}

function pan_init()
{
// general initialization NOTE order is important
	pan_initPopOvers();
	pan_initTabBoxesHide();
	pan_initTabBoxesShowActive();
	pan_replace();
	pan_initAutoSave();
	if ( typeof pan_UserInit != "undefined" )
	{
		pan_UserInit();
	}

}


function pan_setupEventHandlers()
{
	$(document).on("click", ".reloadFormOnSubmit", function(event) 
		{ 
			pan_reloadFormOnSubmit( this );
			event.preventDefault(); 
			event.stopPropagation();
		} );

	$(document).on("click", ".saveOnlyOnSubmit", function(event) 
		{ 
			pan_saveOnlyOnSubmit( this );
			event.preventDefault(); 
			event.stopPropagation();
		} );


	$(document).on("click", "ul.tabBoxTab li", function(event)
		{
			event.stopPropagation();
			pan_tabBoxSwitchTo( this );
		});
		
	$(document).on("click", ".popOver-open", function(event)
		{
			event.stopPropagation();
			pan_popOverOpen( this );
		});

	$(document).on("click", ".popOver-close", function(event)
		{
			event.stopPropagation();
			pan_popOverClose( this );			
		});

	$(document).ajaxSuccess( function(event)
		{
			pan_init();
		});
}



$(document).ready( function()
	{	
		pan_init();
		pan_setupEventHandlers();
	}
);


