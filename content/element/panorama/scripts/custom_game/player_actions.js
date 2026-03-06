function ToggleMute()
{
    var playerId = $.GetContextPanel().GetAttributeInt("player_id", -1);
    if (playerId !== -1)
    {
        var newIsMuted = !Game.IsPlayerMuted(playerId);
        Game.SetPlayerMuted(playerId, newIsMuted);
        $.GetContextPanel().SetHasClass("player_muted", newIsMuted);
    }
}

function ToggleDisableHelp()
{
    var playerId = $.GetContextPanel().GetAttributeInt("player_id", -1);
    if (playerId !== -1)
    {
        var disable = $("#DisableHelpButton").checked;
        GameEvents.SendCustomGameEventToServer("set_disable_help", { disable: disable, to: playerId });
    }
}

(function()
{
    var playerId = $.GetContextPanel().GetAttributeInt("player_id", -1);
    $.GetContextPanel().SetHasClass("player_muted", Game.IsPlayerMuted(playerId));

    var disableHelp = CustomNetTables.GetTableValue("disable_help", Players.GetLocalPlayer());
    if (disableHelp && disableHelp[playerId])
    {
        $("#DisableHelpButton").checked = true;
    }
})();
