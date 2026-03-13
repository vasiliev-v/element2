	function InitCustomUI()
{
	//GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_TIMEOFDAY, false );      //Time of day (clock).
	GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_HEROES, false);     //Heroes and team score at the top of the HUD.
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD, false);      //Lefthand flyout scoreboard.
    //GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false );     //Hero actions UI.
    GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, false );     //Minimap.
    //GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_PANEL, false );      //Entire Inventory UI
    //GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, false);     //Shop portion of the Inventory.
    //GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_ITEMS, false );      //Player items.
    //GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_QUICKBUY, false);     //Quickbuy.
    //GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_COURIER, false);      //Courier controls.
    //GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_PROTECT, false);      //Glyph.
    //GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_GOLD, false);     //Gold display.
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_SHOP_SUGGESTEDITEMS, false);      //Suggested items shop panel.
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS, false);     //Hero selection Radiant and Dire player lists.
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME, false);     //Hero selection game mode name display.
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK, false);     //Hero selection clock.
    //GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_MENU_BUTTONS, false );     //Top-left menu buttons in the HUD.
	GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ENDGAME, false);      //Endgame scoreboard.
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_BACKGROUND, false);     //Top-left menu buttons in the HUD.
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FIGHT_RECAP, false);     //

		GameUI.CustomUIConfig().team_logo_xml = "file://{resources}/layout/custom_game/overthrow_team_icon/overthrow_team_icon.xml";
		GameUI.CustomUIConfig().team_logo_large_xml = "file://{resources}/layout/custom_game/overthrow_team_icon_large/overthrow_team_icon_large.xml";

		GameUI.CustomUIConfig().team_colors = {}
		GameUI.CustomUIConfig().team_colors[DOTATeam_t.DOTA_TEAM_GOODGUYS] = "#00ff00;"; // { 61, 210, 150 }	--		Teal
		GameUI.CustomUIConfig().team_colors[DOTATeam_t.DOTA_TEAM_BADGUYS ] = "#ff0000;"; // { 243, 201, 9 }		--		Yellow

		GameUI.CustomUIConfig().team_icons = {}
		GameUI.CustomUIConfig().team_icons[DOTATeam_t.DOTA_TEAM_GOODGUYS] = "s2r://panorama/images/custom_game/team_icons/team_icon_tiger_01.png";
		GameUI.CustomUIConfig().team_icons[DOTATeam_t.DOTA_TEAM_BADGUYS ] = "s2r://panorama/images/custom_game/team_icons/team_icon_monkey_01.png";

		 var tooltipManager = $.GetContextPanel().GetParent().GetParent().FindChildTraverse("Tooltips");
    	tooltipManager.AddClass("CustomTooltipStyle");

    	var newUI = $.GetContextPanel().GetParent().GetParent().FindChildTraverse("HUDElements");
    	var centerBlock = newUI.FindChildTraverse("center_block");

		let minimap_container = FindDotaHudElement("minimap_container")  
		 
		let TormentorTimerContainer = FindDotaHudElement("TormentorTimerContainer")
    	if (TormentorTimerContainer)
   		{
        	TormentorTimerContainer.style.visibility = "collapse"
    	}
		
		//FindDotaHudElement("GameInfoButton").style.visibility = "collapse";
		FindDotaHudElement("PreMinimapContainer").style.visibility = "collapse";
		FindDotaHudElement("FriendsAndFoes").style.visibility = "collapse";
		FindDotaHudElement("BattlePassContainer").style.visibility = "collapse";
		FindDotaHudElement("PlusChallengeContainer").style.visibility = "collapse";
		FindDotaHudElement("StrategyTabTopRow").style.visibility = "collapse";
		//FindDotaHudElement("courier").style.visibility = "collapse";
		//FindDotaHudElement("CommonItems").style.visibility = "collapse";
		//FindDotaHudElement("QuickBuySlot8").style.visibility = "collapse";
		FindDotaHudElement("GlyphScanContainer").style.visibility = "collapse";
		newUI.FindChildTraverse("inventory_neutral_craft_holder").style.visibility = "collapse";  

		var shopManager = $.GetContextPanel().GetParent().GetParent().FindChildTraverse("shop");
		shopManager.FindChildTraverse("GridNeutralsTab").style.visibility = "collapse";
		shopManager.FindChildTraverse("RequestSuggestion").style.visibility = "collapse"; 
		shopManager.FindChildTraverse("PopularItems").style.visibility = "collapse"; 
		shopManager.FindChildTraverse("BuybackProtection").style.visibility = "collapse"; 

		centerBlock.FindChildTraverse("ContentsContainer").GetParent().style.visibility = "collapse";
		centerBlock.FindChildTraverse("StatBranch").style.visibility = "collapse";
		centerBlock.FindChildTraverse("StatBranch").SetPanelEvent("onmouseover", function () {
		});
		centerBlock.FindChildTraverse("StatBranch").SetPanelEvent("onactivate", function () {
		});

		// Remove xp circle
	// centerBlock.FindChildTraverse("xp").style.visibility = "collapse";
	// centerBlock.FindChildTraverse("stragiint").style.visibility = "collapse";
		//Fuck that levelup button
		centerBlock.FindChildTraverse("level_stats_frame").style.visibility = "collapse";
		// Hide tp slot
		centerBlock.FindChildTraverse("inventory_tpscroll_container").style.visibility = "collapse";

		centerBlock.FindChildTraverse("inventory_tpscroll_HotkeyContainer").style.visibility = "collapse";

		}
		
InitCustomUI();

function FindDotaHudElement(sId)
{
	return GetDotaHud().FindChildTraverse(sId);
}

function GetDotaHud()
{
	let hPanel = $.GetContextPanel();

	while ( hPanel && hPanel.id !== 'Hud')
	{
        hPanel = hPanel.GetParent();
	}

	if (!hPanel)
	{
        throw new Error('Could not find Hud root from panel with id: ' + $.GetContextPanel().id);
	}

	return hPanel;
}
