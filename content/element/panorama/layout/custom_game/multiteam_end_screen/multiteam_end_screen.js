"use strict";

(function()
{
	if ( ScoreboardUpdater_InitializeScoreboard === null ) { $.Msg( "WARNING: This file requires shared_scoreboard_updater.js to be included." ); }

	var scoreboardConfig =
	{
		"teamXmlName" : "file://{resources}/layout/custom_game/multiteam_end_screen/multiteam_end_screen_team.xml",
		"playerXmlName" : "file://{resources}/layout/custom_game/multiteam_end_screen/multiteam_end_screen_player.xml",
	};

	var endScoreboardHandle = ScoreboardUpdater_InitializeScoreboard( scoreboardConfig, $( "#TeamsContainer" ) );
	$.GetContextPanel().SetHasClass( "endgame", 1 );

	function GetPlayerLastHits(playerId)
	{
		try
		{
			var info = Game.GetPlayerInfo(playerId);
			if (info && info.player_team_data && info.player_team_data.last_hits != null)
			{
				return info.player_team_data.last_hits;
			}
		}
		catch (e) {}

		return 0;
	}

	function CreateItemImage(parent, itemName, extraClass)
	{
		if (!itemName || itemName === "")
			return;

		var itemPanel = $.CreatePanel("DOTAItemImage", parent, "");
		itemPanel.itemname = itemName;

		if (extraClass)
		{
			itemPanel.AddClass(extraClass);
		}
	}

	function AddDivider(parent)
	{
		$.CreatePanel("Panel", parent, "").AddClass("EndScreenItemDivider");
	}

	function CreateGroup(parent, groupClass)
	{
		var panel = $.CreatePanel("Panel", parent, "");
		panel.AddClass("EndScreenItemsGroup");
		if (groupClass)
		{
			panel.AddClass(groupClass);
		}
		return panel;
	}

	function GetItemNameInSlot(heroEntIndex, slot)
	{
		var itemEntIndex = Entities.GetItemInSlot(heroEntIndex, slot);
		if (itemEntIndex == -1)
			return null;

		var itemName = Abilities.GetAbilityName(itemEntIndex);
		if (!itemName || itemName === "")
			return null;

		return itemName;
	}

	function UpdatePlayerItems(playerPanel, playerId)
	{
		var itemsContainer = playerPanel.FindChildInLayoutFile("PlayerItemsContainer");
		if (!itemsContainer)
			return;

		itemsContainer.RemoveAndDeleteChildren();

		var playerInfo = Game.GetPlayerInfo(playerId);
		if (!playerInfo || playerInfo.player_selected_hero_entity_index == null || playerInfo.player_selected_hero_entity_index === -1)
			return;

		var heroEntIndex = playerInfo.player_selected_hero_entity_index;

		var mainGroup = CreateGroup(itemsContainer, "EndScreenMainItem");
		var backpackGroup = CreateGroup(itemsContainer, "EndScreenBackpackItem");
		var neutralGroup = CreateGroup(itemsContainer, "EndScreenSpecialItem");
		var tpGroup = CreateGroup(itemsContainer, "EndScreenSpecialItem");

		var hasMain = false;
		var hasBackpack = false;
		var hasNeutral = false;
		var hasTP = false;

		var mainSlots = [0, 1, 2, 3, 4, 5];
		var backpackSlots = [6, 7, 8];

		for (var i = 0; i < mainSlots.length; i++)
		{
			var mainItem = GetItemNameInSlot(heroEntIndex, mainSlots[i]);
			if (mainItem)
			{
				CreateItemImage(mainGroup, mainItem, "");
				hasMain = true;
			}
		}

		for (var j = 0; j < backpackSlots.length; j++)
		{
			var backpackItem = GetItemNameInSlot(heroEntIndex, backpackSlots[j]);
			if (backpackItem)
			{
				CreateItemImage(backpackGroup, backpackItem, "");
				hasBackpack = true;
			}
		}

		var neutralItem = GetItemNameInSlot(heroEntIndex, 16);
		if (neutralItem)
		{
			CreateItemImage(neutralGroup, neutralItem, "");
			hasNeutral = true;
		}

		var tpItem = GetItemNameInSlot(heroEntIndex, 15);
		if (tpItem && tpItem != "item_tpscroll")
		{
			CreateItemImage(tpGroup, tpItem, "");
			hasTP = true;
		}

		if (!hasMain)
		{
			mainGroup.style.width = "0px";
		}

		if (hasMain && (hasBackpack || hasNeutral || hasTP))
		{
			AddDivider(itemsContainer);
		}

		if (!hasBackpack)
		{
			backpackGroup.style.width = "0px";
		}

		if (hasBackpack && (hasNeutral || hasTP))
		{
			AddDivider(itemsContainer);
		}
		else if (!hasBackpack)
		{
			backpackGroup.DeleteAsync(0);
		}

		if (!hasNeutral)
		{
			neutralGroup.style.width = "0px";
		}

		if (hasNeutral && hasTP)
		{
			AddDivider(itemsContainer);
		}
		else if (!hasNeutral)
		{
			neutralGroup.DeleteAsync(0);
		}

		if (!hasTP)
		{
			tpGroup.style.width = "0px";
		}
		else if (!hasTP)
		{
			tpGroup.DeleteAsync(0);
		}
	}

	function UpdateExtraPlayerStats(teamPanel, teamId)
	{
		var teamPlayers = Game.GetPlayerIDsOnTeam(teamId);
		var playersContainer = teamPanel.FindChildInLayoutFile("PlayersContainer");
		if (!playersContainer)
			return;

		for (var i = 0; i < teamPlayers.length; i++)
		{
			var playerId = teamPlayers[i];
			var playerPanel = playersContainer.FindChild("_dynamic_player_" + playerId);
			if (!playerPanel)
				continue;

			_ScoreboardUpdater_SetTextSafe(playerPanel, "LastHits", String(GetPlayerLastHits(playerId)));
			UpdatePlayerItems(playerPanel, playerId);
		}
	}

	var teamInfoList = ScoreboardUpdater_GetSortedTeamInfoList( endScoreboardHandle );
	var delay = 0.2;
	var delay_per_panel = 1 / teamInfoList.length;

	for ( var teamInfo of teamInfoList )
	{
		var teamId = teamInfo.team_id;
		var teamPanel = ScoreboardUpdater_GetTeamPanel( endScoreboardHandle, teamId );

		teamPanel.SetHasClass( "team_endgame", false );

		var callback = function( panel )
		{
			return function(){ panel.SetHasClass( "team_endgame", 1 ); };
		}( teamPanel );

		$.Schedule( delay, callback );
		delay += delay_per_panel;

		UpdateExtraPlayerStats(teamPanel, teamId);
	}

	var winningTeamId = Game.GetGameWinner();
	var endScreenVictory = $( "#EndScreenVictory" );

	if ( endScreenVictory )
	{
		if (Game.GetMapInfo().map_display_name == "clanwars")
		{
			endScreenVictory.SetDialogVariable( "winning_team_name", winningTeamId == DOTATeam_t.DOTA_TEAM_BADGUYS && "DIRE TEAM " || "RADIANT TEAM " );
		}
		else
		{
			endScreenVictory.SetDialogVariable( "winning_team_name", winningTeamId == DOTATeam_t.DOTA_TEAM_BADGUYS && "You lose" || "Victory!" );
		}

		if ( GameUI.CustomUIConfig().team_colors )
		{
			var teamColor = GameUI.CustomUIConfig().team_colors[ winningTeamId ];
			teamColor = teamColor.replace( ";", "" );
			endScreenVictory.style.color = teamColor + ";";
		}
	}

	var winningTeamLogo = $( "#WinningTeamLogo" );
	if ( winningTeamLogo )
	{
		var logo_xml = GameUI.CustomUIConfig().team_logo_large_xml;
		if ( logo_xml )
		{
			winningTeamLogo.SetAttributeInt( "team_id", winningTeamId );
			winningTeamLogo.BLoadLayout( logo_xml, false, false );
		}
	}
})();