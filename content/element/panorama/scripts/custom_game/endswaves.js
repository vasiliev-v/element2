function Ok()
{
	$("#endswaves").visible = false;
}

function open()
{
	$("#endswaves").visible = true;
}

(function()
{
    GameEvents.SubscribeProtected( "endswaves", open)
    
    $("#endswaves").visible = false;
})();