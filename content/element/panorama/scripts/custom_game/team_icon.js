(function()
{
    var teamId = $.GetContextPanel().GetAttributeInt("team_id", -1);
    var customConfig = GameUI.CustomUIConfig();

    if (customConfig.team_colors)
    {
        var teamColor = customConfig.team_colors[teamId];
        if (teamColor && $("#ShieldColor"))
        {
            $("#ShieldColor").style.washColor = teamColor;
        }
    }

    if (customConfig.team_icons)
    {
        var teamIcon = customConfig.team_icons[teamId];
        if (teamIcon && $("#TeamIcon"))
        {
            $("#TeamIcon").SetImage(teamIcon);
        }
    }
})();
