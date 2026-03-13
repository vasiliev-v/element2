"use strict";

(function ()
{
    if ( ScoreboardUpdater_InitializeScoreboard === null )
    {
        $.Msg( "WARNING: This file requires shared_scoreboard_updater.js to be included." );
        return;
    }

    var scoreboardConfig =
    {
        "teamXmlName" : "file://{resources}/layout/custom_game/multiteam_flyout_scoreboard_team.xml",
        "playerXmlName" : "file://{resources}/layout/custom_game/multiteam_flyout_scoreboard_player/multiteam_flyout_scoreboard_player.xml",
    };

    ScoreboardUpdater_InitializeScoreboard( scoreboardConfig, $( "#TeamsContainer" ) );
})();
