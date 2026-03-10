"use strict";

var CRAFT6_DATA = {
    ingredientsOrder: [
        "item_corrupting_blade",
        "item_glimmerdark_shield",
        "item_guardian_shell",
        "item_dredged_trident",
        "item_oblivions_locket",
        "item_ambient_sorcery",
        "item_wand_of_the_brine",
        "item_seal_0"
    ],

    tierRecipes: [
        {
            base: {
                "item_corrupting_blade": 10,
                "item_glimmerdark_shield": 10,
                "item_guardian_shell": 10,
                "item_dredged_trident": 10,
                "item_oblivions_locket": 10,
                "item_ambient_sorcery": 10,
                "item_wand_of_the_brine": 10,
                "item_seal_0": 1
            },
            upgradeItem: null,
            upgradeCount: 0,
            result: "item_seal_1"
        },
        {
            base: {
                "item_corrupting_blade": 20,
                "item_glimmerdark_shield": 20,
                "item_guardian_shell": 20,
                "item_dredged_trident": 20,
                "item_oblivions_locket": 20,
                "item_ambient_sorcery": 20,
                "item_wand_of_the_brine": 20,
                "item_seal_0": 10
            },
            upgradeItem: "item_seal_1",
            upgradeCount: 1,
            result: "item_seal_2"
        },
        {
            base: {
                "item_corrupting_blade": 30,
                "item_glimmerdark_shield": 30,
                "item_guardian_shell": 30,
                "item_dredged_trident": 30,
                "item_oblivions_locket": 30,
                "item_ambient_sorcery": 30,
                "item_wand_of_the_brine": 30,
                "item_seal_0": 15
            },
            upgradeItem: "item_seal_2",
            upgradeCount: 1,
            result: "item_seal_3"
        },
        {
            base: {
                "item_corrupting_blade": 40,
                "item_glimmerdark_shield": 40,
                "item_guardian_shell": 40,
                "item_dredged_trident": 40,
                "item_oblivions_locket": 40,
                "item_ambient_sorcery": 40,
                "item_wand_of_the_brine": 40,
                "item_seal_0": 20
            },
            upgradeItem: "item_seal_3",
            upgradeCount: 1,
            result: "item_seal_4"
        },
        {
            base: {
                "item_corrupting_blade": 50,
                "item_glimmerdark_shield": 50,
                "item_guardian_shell": 50,
                "item_dredged_trident": 50,
                "item_oblivions_locket": 50,
                "item_ambient_sorcery": 50,
                "item_wand_of_the_brine": 50,
                "item_seal_0": 25
            },
            upgradeItem: "item_seal_4",
            upgradeCount: 1,
            result: "item_seal_5"
        }
    ]
};

// ТЕСТОВЫЕ ДАННЫЕ
var TEST_INVENTORY = {
    "item_corrupting_blade": 55,
    "item_glimmerdark_shield": 55,
    "item_guardian_shell": 55,
    "item_dredged_trident": 55,
    "item_oblivions_locket": 55,
    "item_ambient_sorcery": 55,
    "item_wand_of_the_brine": 55,
    "item_seal_0": 55,

    "item_seal_1": 1,
    "item_seal_2": 1,
    "item_seal_3": 0,
    "item_seal_4": 0,
    "item_seal_5": 0
};

function ToggleCraft6Panel()
{
    var panel = $("#Craft6Window");
    if (!panel)
    {
        $.Msg("Craft6Window not found");
        return;
    }

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
    return TEST_INVENTORY;

    /*
    return CustomNetTables.GetTableValue("craft6_table", String(Players.GetLocalPlayer())) ||
           CustomNetTables.GetTableValue("craft6_table", Players.GetLocalPlayer()) ||
           {};
    */
}

function GetItemCount(inv, itemName)
{
    if (!inv) return 0;

    var value = inv[itemName];
    if (value == null)
    {
        value = inv[String(itemName)];
    }

    if (value == null) return 0;

    value = Number(value);
    return isNaN(value) ? 0 : value;
}

function GetTierRecipe(tierIndex)
{
    return CRAFT6_DATA.tierRecipes[tierIndex] || null;
}

function CanCraftTier(inv, tierIndex)
{
    var recipe = GetTierRecipe(tierIndex);
    if (!recipe) return false;

    for (var i = 0; i < CRAFT6_DATA.ingredientsOrder.length; i++)
    {
        var itemName = CRAFT6_DATA.ingredientsOrder[i];
        var need = recipe.base[itemName] || 0;

        if (GetItemCount(inv, itemName) < need)
        {
            return false;
        }
    }

    if (recipe.upgradeItem && GetItemCount(inv, recipe.upgradeItem) < recipe.upgradeCount)
    {
        return false;
    }

    return true;
}

function RequestCraftTier(tier)
{
    $.Msg("TEST upgrade tier pressed: " + tier);

    // потом сервер:
    // GameEvents.SendCustomGameEventToServer("craft6_make_item", { tier: tier });
}

function RefreshCraft6State()
{
    var inv = GetLocalInventoryTable();

    for (var i = 0; i < CRAFT6_DATA.tierRecipes.length; i++)
    {
        var recipe = GetTierRecipe(i);
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

        for (var j = 0; j < CRAFT6_DATA.ingredientsOrder.length; j++)
        {
            var itemName = CRAFT6_DATA.ingredientsOrder[j];
            var label = $("#CraftNeedText_" + (i + 1) + "_" + (j + 1));

            if (label)
            {
                var have = GetItemCount(inv, itemName);
                var need = recipe.base[itemName] || 0;
                label.text = have + "/" + need;
            }
        }

        var upgradeLabel = $("#CraftUpgradeNeedText_" + (i + 1));
        if (upgradeLabel)
        {
            if (recipe.upgradeItem)
            {
                var havePrev = GetItemCount(inv, recipe.upgradeItem);
                upgradeLabel.text = havePrev + "/" + recipe.upgradeCount;
            }
            else
            {
                upgradeLabel.text = "";
            }
        }
    }
}

function BuildCraftRows()
{
    var list = $("#Craft6RecipeList");
    if (!list)
    {
        $.Msg("Craft6RecipeList not found");
        return;
    }

    list.RemoveAndDeleteChildren();

    for (var tier = 1; tier <= CRAFT6_DATA.tierRecipes.length; tier++)
    {
        var recipe = GetTierRecipe(tier - 1);

        var row = $.CreatePanel("Panel", list, "CraftTierRow" + tier);
        row.AddClass("CraftTierRow");
        row.style.marginTop = (18 + (tier - 1) * 68) + "px";

        var title = $.CreatePanel("Label", row, "");
        title.AddClass("CraftTierLabel");
        title.text = "T" + tier;

        var needWrap = $.CreatePanel("Panel", row, "");
        needWrap.AddClass("CraftNeedWrap");

        var x = 0;

        if (recipe.upgradeItem)
        {
            var prevItem = $.CreatePanel("DOTAItemImage", needWrap, "");
            prevItem.AddClass("CraftResultSlot");
            prevItem.itemname = recipe.upgradeItem;
            prevItem.style.marginLeft = x + "px";

            var prevTxt = $.CreatePanel("Label", needWrap, "CraftUpgradeNeedText_" + tier);
            prevTxt.AddClass("CraftNeedText");
            prevTxt.style.marginLeft = x + "px";
            prevTxt.text = "0/" + recipe.upgradeCount;

            x += 48;

            var plusPrev = $.CreatePanel("Label", needWrap, "");
            plusPrev.AddClass("CraftPlus");
            plusPrev.text = "+";
            plusPrev.style.marginLeft = x + "px";
            x += 22;
        }

        for (var i = 0; i < CRAFT6_DATA.ingredientsOrder.length; i++)
        {
            var itemName = CRAFT6_DATA.ingredientsOrder[i];

            var slot = $.CreatePanel("DOTAItemImage", needWrap, "");
            slot.AddClass("CraftSlot");
            slot.itemname = itemName;
            slot.style.marginLeft = x + "px";

            var txt = $.CreatePanel("Label", needWrap, "CraftNeedText_" + tier + "_" + (i + 1));
            txt.AddClass("CraftNeedText");
            txt.style.marginLeft = x + "px";
            txt.text = "0/" + (recipe.base[itemName] || 0);

            x += 48;

            if (i < CRAFT6_DATA.ingredientsOrder.length - 1)
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
        result.itemname = recipe.result;
        result.style.marginLeft = x + "px";

        var btn = $.CreatePanel("Button", row, "CraftTierButton" + tier);
        btn.AddClass("CraftButton");
        btn.SetPanelEvent("onactivate", (function(level)
        {
            return function()
            {
                var button = $("#CraftTierButton" + level);
                if (button && !button.BHasClass("CraftButtonDisabled"))
                {
                    RequestCraftTier(level);
                }
            };
        })(tier));

        var btnLabel = $.CreatePanel("Label", btn, "");
        btnLabel.text = "УЛУЧШИТЬ";
    }
}

(function()
{
    BuildCraftRows();
    RefreshCraft6State();
})();