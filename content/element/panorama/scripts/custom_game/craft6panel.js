"use strict";

var CRAFT6_DATA = {
    ingredients: [
        "item_ice",
        "item_fire",
        "item_water",
        "item_energy",
        "item_earth",
        "item_life",
        "item_craft_scroll"
    ],
    resultItems: [
        "item_artifact_tier_1",
        "item_artifact_tier_2",
        "item_artifact_tier_3",
        "item_artifact_tier_4",
        "item_artifact_tier_5"
    ],
    requiredAmounts: [10, 20, 30, 40, 50]
};

function ToggleCraft6Panel()
{
    var panel = $("#Craft6Window");
    if (panel.BHasClass("Craft6WindowVisible"))
    {
        panel.RemoveClass("Craft6WindowVisible");
        panel.AddClass("Craft6WindowHidden");
    }
    else
    {
        panel.RemoveClass("Craft6WindowHidden");
        panel.AddClass("Craft6WindowVisible");
        RefreshCraft6State();
    }
}

function GetLocalInventoryTable()
{
    return CustomNetTables.GetTableValue("craft6_table", String(Players.GetLocalPlayer())) ||
           CustomNetTables.GetTableValue("craft6_table", Players.GetLocalPlayer()) ||
           {};
}

function GetItemCount(inv, itemName)
{
    if (!inv) return 0;

    var value = inv[itemName];
    if (value == null) value = inv[String(itemName)];
    if (value == null) return 0;

    value = Number(value);
    return isNaN(value) ? 0 : value;
}

function CanCraftTier(inv, tierIndex)
{
    var required = CRAFT6_DATA.requiredAmounts[tierIndex];

    for (var i = 0; i < CRAFT6_DATA.ingredients.length; i++)
    {
        if (GetItemCount(inv, CRAFT6_DATA.ingredients[i]) < required)
        {
            return false;
        }
    }

    return true;
}

function RequestCraftTier(tier)
{
    GameEvents.SendCustomGameEventToServer("craft6_make_item", { tier: tier });
}

function RefreshCraft6State()
{
    var inv = GetLocalInventoryTable();

    for (var i = 0; i < 5; i++)
    {
        var row = $("#CraftTierRow" + (i + 1));
        var btn = $("#CraftTierButton" + (i + 1));
        var canCraft = CanCraftTier(inv, i);

        if (row)
        {
            row.SetHasClass("CraftTierRowReady", canCraft);
            row.SetHasClass("CraftTierRowNotReady", !canCraft);
        }

        if (btn)
        {
            btn.SetHasClass("CraftButtonDisabled", !canCraft);
        }

        var need = CRAFT6_DATA.requiredAmounts[i];
        for (var j = 0; j < CRAFT6_DATA.ingredients.length; j++)
        {
            var label = $("#CraftNeedText_" + (i + 1) + "_" + (j + 1));
            if (label)
            {
                var have = GetItemCount(inv, CRAFT6_DATA.ingredients[j]);
                label.text = have + "/" + need;
            }
        }
    }
}

function BuildCraftRows()
{
    var list = $("#Craft6RecipeList");
    list.RemoveAndDeleteChildren();

    for (var tier = 1; tier <= 5; tier++)
    {
        var row = $.CreatePanel("Panel", list, "CraftTierRow" + tier);
        row.AddClass("CraftTierRow");

        var title = $.CreatePanel("Label", row, "");
        title.AddClass("CraftTierLabel");
        title.text = "T" + tier;

        var needWrap = $.CreatePanel("Panel", row, "");
        needWrap.AddClass("CraftNeedWrap");

        var x = 0;
        var need = CRAFT6_DATA.requiredAmounts[tier - 1];

        for (var i = 0; i < CRAFT6_DATA.ingredients.length; i++)
        {
            var slot = $.CreatePanel("DOTAItemImage", needWrap, "");
            slot.AddClass("CraftSlot");
            slot.itemname = CRAFT6_DATA.ingredients[i];
            slot.style.marginLeft = x + "px";

            var txt = $.CreatePanel("Label", needWrap, "CraftNeedText_" + tier + "_" + (i + 1));
            txt.AddClass("CraftNeedText");
            txt.style.marginLeft = x + "px";
            txt.text = "0/" + need;

            x += 48;

            if (i < CRAFT6_DATA.ingredients.length - 1)
            {
                var plus = $.CreatePanel("Label", needWrap, "");
                plus.AddClass("CraftPlus");
                plus.text = "+";
                plus.style.marginLeft = x + "px";
                x += 22;
            }
        }

        var arrow = $.CreatePanel("Label", needWrap, "");
        arrow.AddClass("CraftArrow");
        arrow.text = "›";
        arrow.style.marginLeft = x + "px";
        x += 28;

        var result = $.CreatePanel("DOTAItemImage", needWrap, "");
        result.AddClass("CraftResultSlot");
        result.itemname = CRAFT6_DATA.resultItems[tier - 1];
        result.style.marginLeft = x + "px";

        var btn = $.CreatePanel("Button", row, "CraftTierButton" + tier);
        btn.AddClass("CraftButton");
        btn.SetPanelEvent("onactivate", (function(level)
        {
            return function()
            {
                if (!$("#CraftTierButton" + level).BHasClass("CraftButtonDisabled"))
                {
                    RequestCraftTier(level);
                }
            };
        })(tier));

        var btnLabel = $.CreatePanel("Label", btn, "");
        btnLabel.text = "СОЗДАТЬ";
    }
}

(function()
{
    BuildCraftRows();
    CustomNetTables.SubscribeNetTableListener("craft6_table", function(table, key, data)
    {
        if (String(key) === String(Players.GetLocalPlayer()))
        {
            RefreshCraft6State();
        }
    });
})();