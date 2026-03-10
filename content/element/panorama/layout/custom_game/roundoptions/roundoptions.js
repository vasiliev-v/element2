function HideButtons()
{
	$("#readytext").visible = false;
	$("#Vote_Yes").visible = false;
	$("#confirmation").visible = true;
}

function Yes()
{
	HideButtons();
	GameEvents.SendCustomGameEventToServer( "Vote_Round", {} );
}

function Toggle()
{
	GameEvents.SendCustomGameEventToServer( "ToggleAutoVote", { state: $("#Auto_Vote").checked} );
}

function UpdateVote(info)
{
    var id = info.id + 1;

    $("#hero" + id).heroname = Players.GetPlayerSelectedHero(info.id);
    $("#hero" + id).visible = true;

    $("#hero" + id + "_no").visible = false;
    $("#hero" + id + "_yes").visible = true;

    $("#hero_card" + id).RemoveClass("VoteHeroCardNotReady");
    $("#hero_card" + id).AddClass("VoteHeroCardReady");
}

function open(info)
{
    if ($("#RoundOptions").visible == false)
    {
        $("#RoundOptions").visible = true;
    }

    $("#RoundOptions").RemoveClass("OffPanelClass");
    $("#RoundOptions").AddClass("CreatePanelClass");

    $("#readytext").visible = true;
    $("#Vote_Yes").visible = true;
    $("#confirmation").visible = false;

    for (var i = 1; i <= 5; i++)
    {
        $("#hero" + i).visible = false;
        $("#hero" + i).heroname = "";

        $("#hero" + i + "_yes").visible = false;
        $("#hero" + i + "_no").visible = false;

        $("#hero_card" + i).RemoveClass("VoteHeroCardReady");
        $("#hero_card" + i).RemoveClass("VoteHeroCardNotReady");
    }

    var count = info.count;

    for (var i = 1; i <= count; i++)
    {
        $("#hero" + i).heroname = Players.GetPlayerSelectedHero(i - 1);
        $("#hero" + i).visible = true;

        $("#hero" + i + "_no").visible = false;
        $("#hero" + i + "_yes").visible = false;

        $("#hero_card" + i).AddClass("VoteHeroCardNotReady");
    }
}

function close()
{
    $("#RoundOptions").RemoveClass("CreatePanelClass");
    $("#RoundOptions").AddClass("OffPanelClass");
	//$("#RoundOptions").visible = false;
}

(function()
{
    GameEvents.SubscribeProtected( "Display_RoundVote", open)
    GameEvents.SubscribeProtected( "Close_RoundVote", close)
    GameEvents.SubscribeProtected( "Update_Vote", UpdateVote)
    
	GameEvents.SendCustomGameEventToServer( "OnLoadPlayerVote", { } );
    
    $("#RoundOptions").visible = false;
})();