	GameUI.CustomUIConfig().multiteam_top_scoreboard =
		{
			reorder_team_scores: true,
			LeftInjectXMLFile: "file://{resources}/layout/custom_game/overthrow_scoreboard_left.xml",
			TeamOverlayXMLFile: "file://{resources}/layout/custom_game/overthrow_scoreboard_team_overlay.xml"
		};

		GameUI.CustomUIConfig().team_logo_xml = "file://{resources}/layout/custom_game/overthrow_team_icon.xml";
		GameUI.CustomUIConfig().team_logo_large_xml = "file://{resources}/layout/custom_game/overthrow_team_icon_large.xml";
	
		GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_TIMEOFDAY, true );
		GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_HEROES, false );
		GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD, false );

		GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ENDGAME, false );

		GameUI.CustomUIConfig().team_colors = {}
		GameUI.CustomUIConfig().team_colors[DOTATeam_t.DOTA_TEAM_GOODGUYS] = "#00ff00;"; // { 61, 210, 150 }	--		Teal
		GameUI.CustomUIConfig().team_colors[DOTATeam_t.DOTA_TEAM_BADGUYS ] = "#ff0000;"; // { 243, 201, 9 }		--		Yellow

		GameUI.CustomUIConfig().team_icons = {}
		GameUI.CustomUIConfig().team_icons[DOTATeam_t.DOTA_TEAM_GOODGUYS] = "s2r://panorama/images/custom_game/team_icons/team_icon_tiger_01_png.vtex";
		GameUI.CustomUIConfig().team_icons[DOTATeam_t.DOTA_TEAM_BADGUYS ] = "s2r://panorama/images/custom_game/team_icons/team_icon_monkey_01_png.vtex";