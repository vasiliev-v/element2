var crafts = [
    [2,5,9],
    [9,6,5],
    [8,5,10],
    [8,6,7],
    [2,8,6],
    [4,2,7],
    [4,10,3],
    [3,5,4],
    [2,5,3],
    [1,10,8],
    [4,7,1],
    [10,9,1],
    [3,6,10],
    [9,3,7],
    [7,1,5],
    [7,2,10],
    [4,9,8],
    [9,6,1],
    [4,6,2],
    [1,8,3],
    [7,8,3],
    [10,7,3],
    [9,10,4],
    [2,8,9],
    [1,2,3],
    [1,5,2],
    [5,8,4],
    [7,9,6],
    [5,10,6],
    [1,6,4]
];

var elems = [
    "item_ice","item_fire","item_water","item_energy","item_earth",
    "item_life","item_void","item_air","item_light","item_shadow"
];

var items = [
    "item_light_fire_earth","item_light_life_earth","item_air_earth_shadow",
    "item_air_life_void","item_air_fire_life","item_energy_fire_void",
    "item_energy_shadow_water","item_energy_earth_water","item_fire_earth_water",
    "item_ice_shadow_air","item_energy_void_ice","item_shadow_light_ice",
    "item_water_life_shadow","item_light_water_void","item_void_ice_earth",
    "item_void_fire_shadow","item_energy_light_air","item_light_life_ice",
    "item_energy_life_fire","item_ice_air_water","item_air_void_water",
    "item_void_shadow_water","item_shadow_energy_light","item_air_fire_light",
    "item_water_ice_fire","item_ice_fire_earth","item_air_earth_energy",
    "item_void_light_life","item_earth_shadow_life","item_ice_life_energy"
];

var x3mode = false;

function Open()
{
    if ($("#Shop").visible === true)
    {
        $("#Shop").visible = false;
        $("#ShopInfo").visible = false;
    }
    else
    {
        $("#Shop").visible = true;
        $("#ShopInfo").visible = true;

        if ($("#ShopInfo").BHasClass("ShopInfoAnim"))
        {
            $("#ShopInfo").RemoveClass("ShopInfoAnim");
            $("#ShopInfo").AddClass("ShopInfoAnim");
        }
    }

    $("#readytext").RemoveClass("ElementShopText");
}

function OffInfo()
{
    $("#ShopInfo").RemoveClass("ShopInfoAnim");
    $("#ShopInfo").AddClass("ShopInfoAnim2");
}

function OnInfo()
{
    if ($("#ShopInfo").BHasClass("ShopInfoAnim"))
    {
        $("#ShopInfo").RemoveClass("ShopInfoAnim");
        $("#ShopInfo").AddClass("ShopInfoAnim2");
    }
    else
    {
        $("#ShopInfo").RemoveClass("ShopInfoAnim2");
        $("#ShopInfo").AddClass("ShopInfoAnim");
    }
}

function ToggleX3mode()
{
    x3mode = !x3mode;
    $("#ToggleX3mode").SetHasClass("selectedfilter", x3mode);

    UpdateShop(
        "Elements_Tabel",
        Players.GetLocalPlayer(),
        CustomNetTables.GetTableValue("Elements_Tabel", String(Players.GetLocalPlayer()))
            || CustomNetTables.GetTableValue("Elements_Tabel", Players.GetLocalPlayer())
    );
}

function Buy(myint)
{
    GameEvents.SendCustomGameEventToServer("Buy_Element", { num: myint });
}

function BuyItem(myint)
{
    for (var i = 0; i < 3; i++)
    {
        GameEvents.SendCustomGameEventToServer("Buy_Element", { num: crafts[myint - 1][i] });
    }
}

function GetElementCount(data, index)
{
    if (!data) return 0;

    var value = data[index];
    if (value == null)
    {
        value = data[String(index)];
    }

    if (value == null) return 0;

    value = Number(value);
    return isNaN(value) ? 0 : value;
}

function UpdateShop(table_name, key, data)
{
    var localPlayerId = Players.GetLocalPlayer();

    if (String(localPlayerId) !== String(key))
    {
        return;
    }

    if (!data)
    {
        data = {};
    }

    for (var i = 1; i <= 10; i++)
    {
        var count = GetElementCount(data, i);
        var label = $("#lvlmyitemtext" + i);

        if (label)
        {
            label.text = "x " + count;
        }
    }

    for (var y = 1; y <= 30; y++)
    {
        var craftPanel = $("#craft" + y);
        if (!craftPanel) continue;

        var needOff = false;

        for (var j = 0; j < 3; j++)
        {
            var elemId = crafts[y - 1][j];
            var count = GetElementCount(data, elemId);

            if (x3mode)
            {
                if (count < 3)
                {
                    needOff = true;
                    break;
                }
            }
            else
            {
                if (count < 1)
                {
                    needOff = true;
                    break;
                }
            }
        }

        craftPanel.SetHasClass("offcraft", needOff);
    }
}

(function()
{
    CustomNetTables.SubscribeNetTableListener("Elements_Tabel", UpdateShop);

    for (var i = 1; i <= 30; i++)
    {
        var mtop = 52 + 38 * (i - 1) - 380 * Math.floor((i - 1) / 10);
        var mleft = 15 + 270 * Math.floor((i - 1) / 10);

        var craftPanel = $.CreatePanel("Panel", $("#ShopInfo"), "craft" + i);
        craftPanel.hittest = false;
        craftPanel.AddClass("CraftRowPanel");
        craftPanel.style.marginTop = mtop + "px";
        craftPanel.style.marginLeft = mleft + "px";

        var craftItem1 = $.CreatePanel("DOTAItemImage", craftPanel, "");
        craftItem1.itemname = elems[crafts[i - 1][0] - 1];
        craftItem1.AddClass("CraftSlot");
        craftItem1.style.marginLeft = "0px";
        craftItem1.SetPanelEvent("onactivate", (function(value)
        {
            return function() { Buy(value); };
        })(crafts[i - 1][0]));

        var plus1 = $.CreatePanel("Label", craftPanel, "");
        plus1.AddClass("CraftPlus");
        plus1.text = "+";
        plus1.style.marginLeft = "48px";
        plus1.style.marginTop = "7px";

        var craftItem2 = $.CreatePanel("DOTAItemImage", craftPanel, "");
        craftItem2.itemname = elems[crafts[i - 1][1] - 1];
        craftItem2.AddClass("CraftSlot");
        craftItem2.style.marginLeft = "68px";
        craftItem2.SetPanelEvent("onactivate", (function(value)
        {
            return function() { Buy(value); };
        })(crafts[i - 1][1]));

        var plus2 = $.CreatePanel("Label", craftPanel, "");
        plus2.AddClass("CraftPlus");
        plus2.text = "+";
        plus2.style.marginLeft = "116px";
        plus2.style.marginTop = "7px";

        var craftItem3 = $.CreatePanel("DOTAItemImage", craftPanel, "");
        craftItem3.itemname = elems[crafts[i - 1][2] - 1];
        craftItem3.AddClass("CraftSlot");
        craftItem3.style.marginLeft = "136px";
        craftItem3.SetPanelEvent("onactivate", (function(value)
        {
            return function() { Buy(value); };
        })(crafts[i - 1][2]));

        var arrow = $.CreatePanel("Label", craftPanel, "");
        arrow.AddClass("CraftArrow");
        arrow.text = "›";
        arrow.style.marginLeft = "187px";
        arrow.style.marginTop = "6px";

        var resultItem = $.CreatePanel("DOTAItemImage", craftPanel, "");
        resultItem.itemname = items[i - 1];
        resultItem.AddClass("ResultSlot");
        resultItem.style.marginLeft = "206px";
        resultItem.SetPanelEvent("onactivate", (function(value)
        {
            return function() { BuyItem(value); };
        })(i));

        var plus3 = $.CreatePanel("Label", craftPanel, "");
        plus3.AddClass("CraftPlus");
        plus3.text = "+";
        plus3.style.marginLeft = "254px";
        plus3.style.marginTop = "7px";

        // стандартный элемент для следующего крафта
        var nextElem = $.CreatePanel("DOTAItemImage", craftPanel, "");
        nextElem.itemname = elems[crafts[i - 1][0] - 1]; // можно любой из базовых
        nextElem.AddClass("NextCraftSlot");
        nextElem.style.marginLeft = "274px";
        nextElem.SetPanelEvent("onactivate", (function(value)
        {
            return function() { Buy(value); };
        })(crafts[i - 1][0]));
    }

    for (var i = 1; i <= 10; i++)
    {
        var top = 52 + (i - 1) * 38;

        var slot = $("#myitem" + i);
        var count = $("#lvlmyitemtext" + i);

        if (slot)
        {
            slot.style.marginTop = top + "px";
            slot.style.marginLeft = "20px";
        }

        if (count)
        {
            count.style.marginTop = (top + 6) + "px";
            count.style.marginLeft = "90px";
        }
    }

    var initialData =
        CustomNetTables.GetTableValue("Elements_Tabel", String(Players.GetLocalPlayer())) ||
        CustomNetTables.GetTableValue("Elements_Tabel", Players.GetLocalPlayer()) ||
        {};
    
    UpdateShop("Elements_Tabel", Players.GetLocalPlayer(), initialData);
})();