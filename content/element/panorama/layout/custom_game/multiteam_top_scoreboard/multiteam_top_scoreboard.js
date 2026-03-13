"use strict";

function intToARGB(i)
{
    return ("00" + (i & 0xFF).toString(16)).substr(-2) +
           ("00" + ((i >> 8) & 0xFF).toString(16)).substr(-2) +
           ("00" + ((i >> 16) & 0xFF).toString(16)).substr(-2) +
           ("00" + ((i >> 24) & 0xFF).toString(16)).substr(-2);
}

function UpdateTeam(teamId)
{
    const teamPlayers = Game.GetPlayerIDsOnTeam(teamId);

    for (let i = 0; i < teamPlayers.length; i++)
    {
        UpdatePlayer(teamPlayers[i]);
    }

    $.Schedule(0.1, function ()
    {
        UpdateTeam(teamId);
    });
}

function UpdatePlayer(playerId)
{
    const heroName = Players.GetPlayerSelectedHero(playerId);
    if (!heroName)
    {
        return;
    }

    const teamPanel = $("#player_list_1");
    const panelName = "player_" + playerId;
    let playerPanel = teamPanel.FindChildTraverse(panelName);

    if (playerPanel === null)
    {
        playerPanel = $.CreatePanel("Panel", teamPanel, panelName);
        playerPanel.BLoadLayout("file://{resources}/layout/custom_game/multiteam_top_scoreboard/multiteam_top_scoreboard_player.xml", false, false);
        playerPanel.PlayerID = playerId;
    }

    const playerInfo = Game.GetPlayerInfo(playerId);
    if (!playerInfo)
    {
        return;
    }

    playerPanel.SetHasClass("player_dead", playerInfo.player_respawn_seconds >= 0);

    const heroIcon = playerPanel.FindChildInLayoutFile("HeroIcon");
    if (heroIcon)
    {
        heroIcon.heroname = heroName;
    }

    if (!playerPanel._colorApplied)
    {
        let colorInt = Players.GetPlayerColor(playerId);
        if (!colorInt)
        {
            colorInt = 0xFFFFFFFF;
        }

        const colorString = "#" + intToARGB(colorInt);

        const button = playerPanel.FindChildInLayoutFile("TopHeroButton");
        const glow = playerPanel.FindChildInLayoutFile("TopHeroGlow");

        if (button)
        {
            button.style.border = "1px solid " + colorString;
            button.style.boxShadow = "0px 0px 6px -2px " + colorString;
        }

        if (glow)
        {
            glow.style.washColor = colorString;
        }

        playerPanel._colorApplied = true;
    }
}

UpdateTeam(2);