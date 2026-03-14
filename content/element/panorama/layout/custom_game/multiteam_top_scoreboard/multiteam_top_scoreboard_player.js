"use strict";

function showHero()
{
    const panel = $.GetContextPanel();
    const playerId = panel.GetAttributeInt("player_id", -1);

    if (playerId === -1)
        return;

    const heroEnt = Players.GetPlayerHeroEntityIndex(playerId);
    if (heroEnt && heroEnt !== -1)
    {
        GameUI.MoveCameraToEntity(heroEnt);
    }
}

function Clamp(value, min, max)
{
    return Math.max(min, Math.min(max, value));
}

function UpdatePlayerRow()
{
    const panel = $.GetContextPanel();
    const playerId = panel.GetAttributeInt("player_id", -1);

    if (playerId === -1)
    {
        $.Schedule(0.1, UpdatePlayerRow);
        return;
    }

    const localPlayer = Players.GetLocalPlayer();
    const playerInfo = Game.GetPlayerInfo(playerId);
    const heroEnt = Players.GetPlayerHeroEntityIndex(playerId);

    panel.SetHasClass("is_local_player_topbar", playerId === localPlayer);

    if (playerInfo)
    {
        panel.SetHasClass("player_dead", playerInfo.player_respawn_seconds >= 0);
    }
    else
    {
        panel.SetHasClass("player_dead", false);
    }

    const hpFill = panel.FindChildTraverse("TopHeroHPFill");
    const manaFill = panel.FindChildTraverse("TopHeroManaFill");
    const deadIcon = panel.FindChildTraverse("TopHeroDeadIcon");

    if (heroEnt && heroEnt !== -1)
    {
        const health = Entities.GetHealth(heroEnt);
        const maxHealth = Entities.GetMaxHealth(heroEnt);
        const mana = Entities.GetMana(heroEnt);
        const maxMana = Entities.GetMaxMana(heroEnt);

        const hpPct = maxHealth > 0 ? Clamp((health / maxHealth) * 100, 0, 100) : 0;
        const manaPct = maxMana > 0 ? Clamp((mana / maxMana) * 100, 0, 100) : 0;

        if (hpFill)
        {
            hpFill.style.width = hpPct + "%";
        }

        if (manaFill)
        {
            manaFill.style.width = manaPct + "%";
        }

        if (deadIcon)
        {
            deadIcon.visible = Entities.IsAlive(heroEnt) === false;
        }
    }
    else
    {
        if (hpFill)
        {
            hpFill.style.width = "0%";
        }

        if (manaFill)
        { 
            manaFill.style.width = "0%";
        }

        if (deadIcon)
        {
            deadIcon.visible = false;
        }
    }

    $.Schedule(0.1, UpdatePlayerRow);
}

(function ()
{
    UpdatePlayerRow();
})();