"use strict";

(function ()
{
    if ( typeof ScoreboardUpdater_InitializeScoreboard !== "function" )
    {
        $.Msg( "WARNING: This file requires shared_scoreboard_updater.js to be included." );
        return;
    }

    var scoreboardConfig =
    {
        "teamXmlName" : "file://{resources}/layout/custom_game/multiteam_flyout_scoreboard_team.xml",
        "playerXmlName" : "file://{resources}/layout/custom_game/multiteam_flyout_scoreboard_player/multiteam_flyout_scoreboard_player.xml"
    };

    var scoreboardHandle = ScoreboardUpdater_InitializeScoreboard( scoreboardConfig, $( "#TeamsContainer" ) );

    var refreshScoreboard = function()
    {
        ScoreboardUpdater_SetScoreboardActive( scoreboardHandle, true );
    };

    GameEvents.Subscribe( "dota_player_update_hero_selection", refreshScoreboard );
    GameEvents.Subscribe( "dota_player_update_selected_unit", refreshScoreboard );
    GameEvents.Subscribe( "dota_player_update_query_unit", refreshScoreboard );
    GameEvents.Subscribe( "dota_player_update_killcam_unit", refreshScoreboard );
    GameEvents.Subscribe( "dota_team_kill_credit", refreshScoreboard );
    GameEvents.Subscribe( "player_connect_full", refreshScoreboard );
    GameEvents.Subscribe( "player_disconnect", refreshScoreboard );

    CustomNetTables.SubscribeNetTableListener( "hero_stats", refreshScoreboard );
})();
