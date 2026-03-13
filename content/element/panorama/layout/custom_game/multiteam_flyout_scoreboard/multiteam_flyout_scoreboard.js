"use strict";

const scoreboardConfig = {
    teamXmlName: "file://{resources}/layout/custom_game/multiteam_flyout_scoreboard/multiteam_flyout_scoreboard_team.xml",
    playerXmlName: "file://{resources}/layout/custom_game/multiteam_flyout_scoreboard/multiteam_flyout_scoreboard_player.xml",
};

function setSecondInterval(func, seconds) {
    let enabled = true;

    function repeat() {
        $.Schedule(seconds, function () {
            if (enabled) {
                func();
                repeat();
            }
        });
    }

    repeat();

    return function () {
        enabled = false;
    };
}

(function () {
    let g_ScoreboardHandle = null;
    let disable = null;

    const teamsContainer = $("#TeamsContainer");

    if (!ScoreboardUpdater_InitializeScoreboard) {
        return;
    }

    g_ScoreboardHandle = ScoreboardUpdater_InitializeScoreboard(scoreboardConfig, teamsContainer);

    function setScoreboardVisibility(visible) {
        $.GetContextPanel().SetHasClass("flyout_scoreboard_visible", visible);
        ScoreboardUpdater_SetScoreboardActive(g_ScoreboardHandle, visible);
    }

    setScoreboardVisibility(false);

    $.RegisterEventHandler("DOTACustomUI_SetFlyoutScoreboardVisible", $.GetContextPanel(), function (bVisible) {
        if (!bVisible && disable) {
            disable();
            disable = null;
        }

        if (!disable && bVisible) {
            disable = setSecondInterval(function () {
                g_ScoreboardHandle = ScoreboardUpdater_InitializeScoreboard(scoreboardConfig, teamsContainer);
            }, 1.0);
        }

        setScoreboardVisibility(bVisible);
    });
})();