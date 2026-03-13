"use strict";

function ToggleMute() {
    const playerId = $.GetContextPanel().GetAttributeInt("player_id", -1);
    if (playerId !== -1) {
        const newIsMuted = !Game.IsPlayerMuted(playerId);
        Game.SetPlayerMuted(playerId, newIsMuted);
        $.GetContextPanel().SetHasClass("player_muted", newIsMuted);
    }
}

function showHero() {
    const playerPanel = $.GetContextPanel();
    const target = playerPanel.GetAttributeInt("player_id", -1);
    if (target === -1) {
        return;
    }

    const targetHeroEntityId = Players.GetPlayerHeroEntityIndex(target);
    if (targetHeroEntityId && targetHeroEntityId !== -1) {
        GameUI.MoveCameraToEntity(targetHeroEntityId);
    }
}

function SetItem(panel, itemEntIndex) {
    if (!panel) {
        return;
    }

    if (!itemEntIndex || itemEntIndex === -1) {
        panel.visible = false;
        panel.itemname = "";
        return;
    }

    const itemName = Abilities.GetAbilityName(itemEntIndex);
    if (!itemName) {
        panel.visible = false;
        panel.itemname = "";
        return;
    }

    panel.visible = true;
    panel.itemname = itemName;
}

function UpdatePlayerRow() {
    const panel = $.GetContextPanel();
    const playerId = panel.GetAttributeInt("player_id", -1);

    if (playerId === -1) {
        $.Schedule(0.2, UpdatePlayerRow);
        return;
    }

    const localPlayer = Players.GetLocalPlayer();

    panel.SetHasClass("player_muted", Game.IsPlayerMuted(playerId));

    ApplyPlayerColor(panel, playerId);

    const muteButton = panel.FindChildTraverse("MuteButton");
    if (muteButton) {
        muteButton.visible = playerId !== localPlayer;
    }

    const goldLabel = panel.FindChildTraverse("Gold");
    if (goldLabel) {
        goldLabel.text = String(Players.GetGold(playerId));
    }

    const creepsLabel = panel.FindChildTraverse("Creeps");
    if (creepsLabel) {
        creepsLabel.text = String(Players.GetLastHits(playerId));
    }

    const heroEnt = Players.GetPlayerHeroEntityIndex(playerId);
    if (heroEnt && heroEnt !== -1) {
        for (let slot = 0; slot < 6; slot++) {
            const itemPanel = panel.FindChildTraverse("Item" + slot);
            const itemEnt = Entities.GetItemInSlot(heroEnt, slot);
            SetItem(itemPanel, itemEnt);
        }
    } else {
        for (let slot = 0; slot < 6; slot++) {
            const itemPanel = panel.FindChildTraverse("Item" + slot);
            if (itemPanel) {
                itemPanel.visible = false;
                itemPanel.itemname = "";
            }
        }
    }

    $.Schedule(0.2, UpdatePlayerRow);
}

function ToPlayerColor(colorInt) {
    const r = colorInt & 255;
    const g = (colorInt >> 8) & 255;
    const b = (colorInt >> 16) & 255;
    return "rgb(" + r + "," + g + "," + b + ")";
}

function ApplyPlayerColor(panel, playerId) {
    const colorPanel = panel.FindChildTraverse("TeamColor_GradentFromTransparentLeft");
    if (!colorPanel) {
        return;
    }

    let colorInt = Players.GetPlayerColor(playerId);
    if (colorInt == null) {
        return;
    }

    const color = ToPlayerColor(colorInt);
function ToPlayerColor(colorInt) {
    const r = colorInt & 255;
    const g = (colorInt >> 8) & 255;
    const b = (colorInt >> 16) & 255;
    return "rgb(" + r + "," + g + "," + b + ")";
}

function ApplyPlayerColor(panel, playerId) {
    const colorPanel = panel.FindChildTraverse("TeamColor_GradentFromTransparentLeft");
    if (!colorPanel) {
        return;
    }

    let colorInt = Players.GetPlayerColor(playerId);
    if (colorInt == null) {
        return;
    }

    const color = ToPlayerColor(colorInt);

    /* полностью убираем стиль команды */
    colorPanel.style.backgroundImage = "none";
    colorPanel.style.washColor = "white";
    colorPanel.style.opacity = "1";

    /* красим ту же самую линию в цвет игрока */
    colorPanel.style.backgroundColor = color;
    colorPanel.style.boxShadow = "none";
}
    /* полностью убираем стиль команды */
    colorPanel.style.backgroundImage = "none";
    colorPanel.style.washColor = "white";
    colorPanel.style.opacity = "1";

    /* красим ту же самую линию в цвет игрока */
    colorPanel.style.backgroundColor = color;
    colorPanel.style.boxShadow = "none";
}

(function () {
    const panel = $.GetContextPanel();
    const playerId = panel.GetAttributeInt("player_id", -1);
    const localPlayer = Players.GetLocalPlayer();

    panel.SetHasClass("player_muted", Game.IsPlayerMuted(playerId));
    ApplyPlayerColor(panel, playerId);

    const muteButton = panel.FindChildTraverse("MuteButton");
    if (muteButton && playerId === localPlayer) {
        muteButton.visible = false;
    }

    UpdatePlayerRow();
})();