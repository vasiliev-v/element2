"use strict";

function ToggleMute()
{
    const panel = $.GetContextPanel();
    const playerId = panel.GetAttributeInt("player_id", -1);

    if (playerId === -1)
        return;

    const newIsMuted = !Game.IsPlayerMuted(playerId);
    Game.SetPlayerMuted(playerId, newIsMuted);
    panel.SetHasClass("player_muted", newIsMuted);
}

function showHero()
{
    const panel = $.GetContextPanel();
    const target = panel.GetAttributeInt("player_id", -1);

    if (target === -1)
        return;

    const heroEnt = Players.GetPlayerHeroEntityIndex(target);

    if (heroEnt && heroEnt !== -1)
    {
        GameUI.MoveCameraToEntity(heroEnt);
    }
}

function UpdatePlayerRow()
{
    const panel = $.GetContextPanel();
    const playerId = panel.GetAttributeInt("player_id", -1);

    if (playerId === -1)
    {
        $.Schedule(0.2, UpdatePlayerRow);
        return;
    }

    const localPlayer = Players.GetLocalPlayer();

    panel.SetHasClass("player_muted", Game.IsPlayerMuted(playerId));

    const muteButton = panel.FindChildTraverse("MuteButton");
    if (muteButton)
    {
        muteButton.visible = playerId !== localPlayer;
    }

    const goldLabel = panel.FindChildTraverse("Gold");
    if (goldLabel)
    {
        goldLabel.text = String(Players.GetGold(playerId));
    }

    const creepsLabel = panel.FindChildTraverse("Creeps");
    if (creepsLabel)
    {
        creepsLabel.text = String(Players.GetLastHits(playerId));
    }

    const heroEnt = Players.GetPlayerHeroEntityIndex(playerId);

    if (heroEnt && heroEnt !== -1)
    {
        for (let slot = 0; slot < 6; slot++)
        {
            const itemPanel = panel.FindChildTraverse("Item" + slot);
            const itemEnt = Entities.GetItemInSlot(heroEnt, slot);

            if (itemPanel)
            {
                if (itemEnt !== -1)
                {
                    itemPanel.visible = true;
                    itemPanel.itemname = Abilities.GetAbilityName(itemEnt);
                }
                else
                {
                    itemPanel.visible = false;
                    itemPanel.itemname = "";
                }
            }
        }
    }
    else
    {
        for (let slot = 0; slot < 6; slot++)
        {
            const itemPanel = panel.FindChildTraverse("Item" + slot);
            if (itemPanel)
            {
                itemPanel.visible = false;
                itemPanel.itemname = "";
            }
        }
    }

    $.Schedule(0.2, UpdatePlayerRow);
}

(function ()
{
    UpdatePlayerRow();
})();