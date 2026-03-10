var lll = false;
var inventory = null;
var slots = null;
var saves = null;
var filter = 0;
var filter2 = 0;
var nowselected = 0;
var purestones = [];
var upgradestone = "";
var color = 1;
function Yes()
{
    purestones = [];
    if (lll == true)
    {
        //$("#Profile").visible = false;
        //$("#Profile").SwitchClass("CreatePanelClass","OffPanelClass");
        $("#AllRelicPanel").RemoveClass("CreatePanelClass");
        $("#AllRelicPanel").AddClass("OffPanelClass");
        lll = false;
        //$.Msg("1");
    }
    else
    {
        if ($("#AllRelicPanel").visible == false)
        {
            $("#AllRelicPanel").visible = true;
        }
        $("#AllRelicPanel").RemoveClass("OffPanelClass");
        $("#AllRelicPanel").AddClass("CreatePanelClass");
        lll = true;
        GameEvents.SendCustomGameEventToServer( "Levels", { id: Players.GetLocalPlayer()} );
    }
}

function Close()
{
    
    $("#AllRelicPanel").RemoveClass("CreatePanelClass");
    $("#AllRelicPanel").AddClass("OffPanelClass");
    lll = false;
    purestones = [];
}

function Buy(id)
{
    //$.Msg( "Buy ", $("#myitem1").itemname);
    if (id == 0) 
    {
        GameEvents.SendCustomGameEventToServer( "Buy_Relic", { id: Players.GetLocalPlayer(),num:id} );
    }
    else
    {
        GameEvents.SendCustomGameEventToServer( "Buy_Relic", { item: $("#lvlmyitem"+id).itemname,id: Players.GetLocalPlayer(),num:id} );
    }
}

function ClickItemOnSlot(slotnum)
{
    GameEvents.SendCustomGameEventToServer( "SniatRS", { id: Players.GetLocalPlayer(),slotid:slotnum} );
}

function ClickItemOnInv(rsid)
{
    if (nowselected == 0)
    {
        GameEvents.SendCustomGameEventToServer( "EqipRS", { id: Players.GetLocalPlayer(),rsid:rsid.toString()} );
    }
    else if (nowselected == 1)
    {
        for (var i = 1; i <= 8; i++)
        {
            if (slots[i] == rsid)
            {
                return;
            }
        }
        var est = false;
        var ind = -1;
        for (var i = 0; i < purestones.length; i++)
        {
            if (purestones[i] == rsid.toString())
            {
                est = true;
                ind = i;
                break;
            }
        }
        if (est == true)
        {
            purestones.splice(ind, 1);
        }
        else
        {
            purestones.splice(purestones.Length, 0, rsid.toString());
        }
        RefreshInventory(false);
        UpdtPureDust();
    }
    else if (nowselected == 2)
    {
        for (var i = 1; i <= 8; i++)
        {
            if (slots[i] == rsid)
            {
                return;
            }
        }
        upgradestone = rsid.toString();
        UpdtUpgrade();
    }
}

function UpgradeButton()
{
    if ($("#UpgradeButton").BHasClass("PureButtonact"))
    {
        $("#forupgradepartpanel").RemoveAndDeleteChildren();
        if (upgradestone.charAt(7) != '5' && upgradestone.charAt(0) == '4')
        {
            var dust = 0;
            var qual = upgradestone.charAt(7);
            switch(qual) {
                case '0':
                dust = 40;
                break

                case '1':
                dust = 80;
                break
            
                case '2':
                dust = 160;
                break
            
                case '3':
                dust = 320;
                break
            
                case '4':
                dust = 640;
                break
            }

            if (Number($("#dustlabeltxt").text) >= dust)
            {
                GameEvents.SendCustomGameEventToServer( "UpgradeRS", { id: Players.GetLocalPlayer(),rs:upgradestone} );
                qual = Number(qual)+1;
                //$("#dustlabeltxt").text = Number($("#dustlabeltxt").text) - dust;
                upgradestone = upgradestone.substring(0,7) + qual.toString() + upgradestone.substring(8);
                UpdtUpgrade();
                $("#forupgradepartpanel").RemoveAndDeleteChildren();
                var upgradePartPanel = $.CreatePanel("DOTAScenePanel", $("#forupgradepartpanel"), "testtt");
                upgradePartPanel.hittest = false;
                upgradePartPanel.particleonly = "true";
                upgradePartPanel.style.marginTop = "0px";
                upgradePartPanel.style.marginLeft = "114px";
                upgradePartPanel.style.height = "350px";
                upgradePartPanel.style.width = "350px";
                upgradePartPanel.map = "cameras";
                upgradePartPanel.camera = "partcamera3";
            }
        }
    }
}

function UpdtUpgrade()
{
    $("#forupitem").RemoveAndDeleteChildren();
    $("#upgradebuttontext").text = $.Localize("#noupgrade");
    $("#UpgradeButton").RemoveClass("PureButtonact");
    $("#UpgradeButton").AddClass("PureButtondis");
    if (upgradestone != "")
    {
        switch(upgradestone.charAt(0)) {
            case '1':
            rares = "shards";
            myclass = "common";
            break
        
            case '2':
            rares = "stones";
            myclass = "rare";
            break
        
            case '3':
            rares = "crystals";
            myclass = "mythical";
            break
        
            case '4':
            rares = "clusters";
            myclass = "immortal";
            break
        }
        switch(upgradestone.charAt(1)) {
            case '0':
            elem = "ice";
            break
        
            case '1':
            elem = "fire";
            break
        
            case '2':
            elem = "water";
            break
        
            case '3':
            elem = "energy";
            break
        
            case '4':
            elem = "earth";
            break
        
            case '5':
            elem = "life";
            break
        
            case '6':
            elem = "void";
            break
        
            case '7':
            elem = "air";
            break
        
            case '8':
            elem = "light";
            break
        
            case '9':
            elem = "shadow";
            break
        }
        var boolestlivslote = "0";
        var estlivslote = "itemborder";
        for (var i = 1; i <= 8;i++)
        {
            if (upgradestone == slots[i])
            {
                boolestlivslote = "t";
                estlivslote = "selecteditemborder";
                break;
            }
        }
        var upItemPanel = $.CreatePanel("Panel", $("#forupitem"), "upitem"+upgradestone);
        upItemPanel.hittest = false;
        upItemPanel.AddClass(estlivslote);
        upItemPanel.style.marginTop = "0px";
        upItemPanel.style.marginLeft = "0px";
        upItemPanel.SetPanelEvent("onmouseover", (function(rsid, inSlot)
        {
            return function()
            {
                $.DispatchEvent("UIShowCustomLayoutParametersTooltip", "RSTooltip", "file://{resources}/layout/custom_game/rs_tooltips.xml", "num=" + rsid + inSlot);
            };
        })(upgradestone, boolestlivslote));
        upItemPanel.SetPanelEvent("onmouseout", function()
        {
            $.DispatchEvent("UIHideCustomLayoutTooltip", "RSTooltip");
        });

        var upItemImage = $.CreatePanel("Image", upItemPanel, "");
        upItemImage.SetImage("file://{images}/custom_game/relic_items/"+rares+"/"+elem+"/"+upgradestone.charAt(2)+".png");
        upItemImage.style.height = "60px";
        upItemImage.style.width = "80px";
        upItemImage.SetPanelEvent("onactivate", (function(rsid)
        {
            return function()
            {
                ClickItemOnInv(rsid);
            };
        })(upgradestone));

        var upItemClassPanel = $.CreatePanel("Panel", upItemPanel, "");
        upItemClassPanel.hittest = false;
        upItemClassPanel.AddClass(myclass);
        upItemClassPanel.style.height = "60px";
        upItemClassPanel.style.width = "5px";
        upItemClassPanel.style.marginLeft = "80px";

        if (upgradestone.charAt(0) == '4')
        {
            if (upgradestone.charAt(7) != '5')
            {
                var dust = 0;
                switch(upgradestone.charAt(7)) {
                    case '0':
                    dust = 40;
                    break

                    case '1':
                    dust = 80;
                    break
                
                    case '2':
                    dust = 160;
                    break
                
                    case '3':
                    dust = 320;
                    break
                
                    case '4':
                    dust = 640;
                    break
                }
                $("#upgradebuttontext").text = $.Localize("#upgradeof") + dust;
                $("#UpgradeButton").RemoveClass("PureButtondis");
                $("#UpgradeButton").AddClass("PureButtonact");
            }
            else
            {
                $("#upgradebuttontext").text = $.Localize("#noupgrade");
                $("#UpgradeButton").RemoveClass("PureButtonact");
                $("#UpgradeButton").AddClass("PureButtondis");
            }
        }
        else
        {
            $("#upgradebuttontext").text = $.Localize("#noupgrade");
            $("#UpgradeButton").RemoveClass("PureButtonact");
            $("#UpgradeButton").AddClass("PureButtondis");
        }
    }
}

function UpdtPureDust()
{
    var dust = 0;
    for (var i = 0; i < purestones.length; i++)
    {
        switch(purestones[i].charAt(0)) {
            case '1':
            dust += 1;
            break
          
            case '2':
            dust += 3;
            break
          
            case '3':
            dust += 15;
            break
          
            case '4':
            dust += 60;
            break
        }
    }
    $("#puredustlabel").text = dust;
}

function PureButton()
{
    if ($("#PureButton").BHasClass("PureButtonact"))
    {
        if (purestones.length != 0)
        {
            GameEvents.SendCustomGameEventToServer( "PureRS", { id: Players.GetLocalPlayer(),rs:purestones} );
            purestones = []
            UpdtPureDust()
            $("#PureButton").RemoveClass("PureButtonact");
            $("#PureButton").AddClass("PureButtondis");
        }
    }
}

function UpdtLvl(info)
{
    if (info[1] == Players.GetLocalPlayer())
    {
        var actsealt = true;
        var sealt = true;
        for (var i = 2; i <= 8;i++)
        {
            if (info[i] > 0)
            {
                $("#lvlmyitem"+(i-1)).RemoveClass("riimg");
                $("#lvlmyitem"+(i-1)).AddClass("riimg2");
                if (info[i] >= 20)
                {
                    $("#lvlmyitemtext"+(i-1)).text = 20;
                }
                else
                {
                    $("#lvlmyitemtext"+(i-1)).text = info[i];
                    actsealt = false;
                }
            }
            else
            {
                sealt = false;
            }
        }
        if (info[9] > 0)
        {
            $("#lvlmyitem8").RemoveClass("riimg");
            $("#lvlmyitem8").AddClass("riimg2");
        }
        else
        {
            actsealt = false;
            sealt = false;
        }
        if (actsealt == true)
        {
            $("#relicitem").itemname = "item_seal_act";
            $("#mysealcampart").visible = true;
            $("#locks1").visible = false;
            $("#locks2").visible = false;
        }
        else if (sealt == true)
        {
            $("#relicitem").itemname = "item_seal_1";
            $("#mysealcampart").visible = true;
            $("#locks1").visible = false;
        }
        inventory = info[10];
        $("#dustlabeltxt").text = info[11];
        slots = info[12];
        saves = info[13];
        RefreshInventory(true)
        SetColors(info[15],info[14]);
        UpdtPureDust();
    }
}

function SetColors(estcolors,newcolor)
{
    for (var i = 2; i <= 12;i++)
    {
        if ($("#ColorButton"+i).BHasClass("noselectedfilter"))
        $("#ColorButton"+i).RemoveClass("noselectedfilter");
        if ($("#ColorButton"+i).BHasClass("selectedfilter"))
        $("#ColorButton"+i).RemoveClass("selectedfilter");
        $("#ColorButton"+i).AddClass("nocolor");
        //$("#ColorButton"+i).visible = false;
    }
    for (var i = 2; i <= 12;i++)
    {
        for(var prop in estcolors)
        {
            if (estcolors[prop] == i)
            {
                $("#ColorButton"+i).RemoveClass("nocolor");
                $("#ColorButton"+i).AddClass("noselectedfilter");
                //$("#ColorButton"+i).visible = true;
                break;
            }
        }
    }
    if (color != newcolor)
    {
        if (!$("#ColorButton"+color).BHasClass("nocolor"))
        {
            if ($("#ColorButton"+color).BHasClass("selectedfilter"))
            $("#ColorButton"+color).RemoveClass("selectedfilter");
            $("#ColorButton"+color).AddClass("noselectedfilter");
        }
        color = newcolor;
        if ($("#ColorButton"+newcolor).BHasClass("noselectedfilter"))
        $("#ColorButton"+newcolor).RemoveClass("noselectedfilter");
        $("#ColorButton"+newcolor).AddClass("selectedfilter");
    }
    else
    {
        if ($("#ColorButton"+newcolor).BHasClass("noselectedfilter"))
        $("#ColorButton"+newcolor).RemoveClass("noselectedfilter");
        $("#ColorButton"+newcolor).AddClass("selectedfilter");
    }
    $.Msg(color);
}

function RefreshInventory(upslots)
{
    $("#rsinv").RemoveAndDeleteChildren();
    var numininv = 0;
    for(var prop in inventory)
    {
        if (inventory[prop] != "0")
        {
            if (filter == 0)
            {
                if (filter2 == 0)
                {
                    MiniFunc(prop,prop)
                }
                else
                {
                    if (inventory[prop].charAt(3) == filter2.toString() || inventory[prop].charAt(4) == filter2.toString())
                    {
                        numininv++;
                        MiniFunc(numininv,prop)
                    }
                }
            }
            else
            {
                if (filter2 == 0)
                {
                    if (inventory[prop].charAt(0) == filter.toString())
                    {
                        numininv++;
                        MiniFunc(numininv,prop)
                    }
                }
                else
                {
                    if (inventory[prop].charAt(0) == filter.toString())
                    {
                        if (inventory[prop].charAt(3) == filter2.toString() || inventory[prop].charAt(4) == filter2.toString())
                        {
                            numininv++;
                            MiniFunc(numininv,prop)
                        }
                    }
                }
            }
        }
    }
    if (saves != null)
    {
        $("#savespanelitems").RemoveAndDeleteChildren();
        for (var i = 1; i <= 8;i++)
        {
            if (saves[i.toString()] != "" && saves[i.toString()] != null)
            {
                var locarr = saves[i.toString()].split('|');
                for (var y = 0; y < 8;y++)
                {
                    if (locarr[y] != "")
                    {
                        var mtop = 30+90*(i-1)+35*Math.floor(y/4);
                        var mleft = 20+50*y-200*Math.floor(y/4);
                        switch(locarr[y].charAt(0)) {
                            case '1':
                            rares = "shards";
                            myclass = "common";
                            break
                        
                            case '2':
                            rares = "stones";
                            myclass = "rare";
                            break
                        
                            case '3':
                            rares = "crystals";
                            myclass = "mythical";
                            break
                        
                            case '4':
                            rares = "clusters";
                            myclass = "immortal";
                            break
                        }
                        switch(locarr[y].charAt(1)) {
                            case '0':
                            elem = "ice";
                            break
                        
                            case '1':
                            elem = "fire";
                            break
                        
                            case '2':
                            elem = "water";
                            break
                        
                            case '3':
                            elem = "energy";
                            break
                        
                            case '4':
                            elem = "earth";
                            break
                        
                            case '5':
                            elem = "life";
                            break
                        
                            case '6':
                            elem = "void";
                            break
                        
                            case '7':
                            elem = "air";
                            break
                        
                            case '8':
                            elem = "light";
                            break
                        
                            case '9':
                            elem = "shadow";
                            break
                        }
                        var boolestlivslote = "0";
                        var estlivslote = "itemborder";
                        //for (var i = 1; i <= 8;i++)
                        //{
                        //    if (locarr[y] == slots[i])
                        //    {
                        //        boolestlivslote = "1";
                        //        estlivslote = "selecteditemborder";
                        //        break;
                        //    }
                        //}
                        var estbool = false;
                        for(var prop in inventory)
                        {
                            if (inventory[prop] == locarr[y])
                            {
                                estbool = true;
                                break;
                            }
                        }
                        if (estbool == false)
                        {
                            estlivslote = "selectedfditemborder";
                        }
                        var saveItemPanel = $.CreatePanel("Panel", $("#savespanelitems"), "save"+i+"sitem"+locarr[y]);
                        saveItemPanel.hittest = false;
                        saveItemPanel.AddClass(estlivslote);
                        saveItemPanel.style.marginTop = mtop + "px";
                        saveItemPanel.style.marginLeft = mleft + "px";
                        saveItemPanel.SetPanelEvent("onmouseover", (function(rsid, inSlot)
                        {
                            return function()
                            {
                                $.DispatchEvent("UIShowCustomLayoutParametersTooltip", "RSTooltip", "file://{resources}/layout/custom_game/rs_tooltips.xml", "num=" + rsid + inSlot);
                            };
                        })(locarr[y], boolestlivslote));
                        saveItemPanel.SetPanelEvent("onmouseout", function()
                        {
                            $.DispatchEvent("UIHideCustomLayoutTooltip", "RSTooltip");
                        });

                        var saveItemImage = $.CreatePanel("Image", saveItemPanel, "");
                        saveItemImage.SetImage("file://{images}/custom_game/relic_items/"+rares+"/"+elem+"/"+locarr[y].charAt(2)+".png");
                        saveItemImage.style.height = "30px";
                        saveItemImage.style.width = "40px";

                        var saveItemClassPanel = $.CreatePanel("Panel", saveItemPanel, "");
                        saveItemClassPanel.hittest = false;
                        saveItemClassPanel.AddClass(myclass);
                        saveItemClassPanel.style.height = "30px";
                        saveItemClassPanel.style.width = "3px";
                        saveItemClassPanel.style.marginLeft = "40px";
                    }
                }
            }
        }
    }
    if (upslots == true)
    {
        $("#imgslots").RemoveAndDeleteChildren();
        for (var i = 1; i <= 8;i++)
        {
            $("#slot"+i+"anim1").visible = false;
            $("#slot"+i+"anim2").visible = false;
            var elems = new Array("ice","fire","water","energy","earth","life","void","air","light","shadow");
            for (var y = 0; y <= 9;y++)
            {
                if ($("#slot"+i+"anim1").BHasClass(elems[y]+"1"))
                    $("#slot"+i+"anim1").RemoveClass(elems[y]+"1");
                if ($("#slot"+i+"anim2").BHasClass(elems[y]+"2"))
                    $("#slot"+i+"anim2").RemoveClass(elems[y]+"2");
            }
        }
        for(var prop in slots)
        {
            //$.Msg(slots[prop]);
            if (slots[prop] != "0" && slots[prop] != "")
            {
                var coords = [];
                coords[1] = [35, 249];
                coords[2] = [234, 459];
                coords[3] = [432, 249];
                coords[4] = [234, 39];
                coords[5] = [83, 412];
                coords[6] = [384, 412];
                coords[7] = [384, 87];
                coords[8] = [83, 87];
                switch(slots[prop].charAt(0)) {
                    case '1':
                    rares = "shards";
                    break
                  
                    case '2':
                    rares = "stones";
                    break
                  
                    case '3':
                    rares = "crystals";
                    break
                  
                    case '4':
                    rares = "clusters";
                    break
                }
                switch(slots[prop].charAt(1)) {
                    case '0':
                    elem = "ice";
                    break
                  
                    case '1':
                    elem = "fire";
                    break
                  
                    case '2':
                    elem = "water";
                    break
                  
                    case '3':
                    elem = "energy";
                    break
                  
                    case '4':
                    elem = "earth";
                    break
                  
                    case '5':
                    elem = "life";
                    break
                  
                    case '6':
                    elem = "void";
                    break
                  
                    case '7':
                    elem = "air";
                    break
                  
                    case '8':
                    elem = "light";
                    break
                  
                    case '9':
                    elem = "shadow";
                    break
                }
                $("#slot"+prop+"anim1").visible = true;
                $("#slot"+prop+"anim2").visible = true;
                $("#slot"+prop+"anim1").AddClass(elem+"1");
                $("#slot"+prop+"anim2").AddClass(elem+"2");
                var imgSlot = $.CreatePanel("Image", $("#imgslots"), "imgslot"+prop);
                imgSlot.AddClass("inslotitem");
                imgSlot.SetImage("file://{images}/custom_game/relic_items/"+rares+"/"+elem+"/"+slots[prop].charAt(2)+".png");
                imgSlot.style.height = "39px";
                imgSlot.style.width = "52px";
                imgSlot.style.marginTop = coords[prop][0] + "px";
                imgSlot.style.marginLeft = coords[prop][1] + "px";
                imgSlot.SetPanelEvent("onmouseover", (function(rsid)
                {
                    return function()
                    {
                        $.DispatchEvent("UIShowCustomLayoutParametersTooltip", "RSTooltip", "file://{resources}/layout/custom_game/rs_tooltips.xml", "num=" + rsid);
                    };
                })(slots[prop]));
                imgSlot.SetPanelEvent("onmouseout", function()
                {
                    $.DispatchEvent("UIHideCustomLayoutTooltip", "RSTooltip");
                });
                imgSlot.SetPanelEvent("onactivate", (function(slotId)
                {
                    return function()
                    {
                        ClickItemOnSlot(slotId);
                    };
                })(prop));
            }
        }
    }
}

function MiniFunc(numininv,prop)
{  
    var mtop = 5 + 70*Math.floor((numininv-1)/3);
    var mleft = 5 + 95*(numininv-1)-285*Math.floor((numininv-1)/3);
    switch(inventory[prop].charAt(0)) {
        case '1':
        rares = "shards";
        myclass = "common";
        break
    
        case '2':
        rares = "stones";
        myclass = "rare";
        break
    
        case '3':
        rares = "crystals";
        myclass = "mythical";
        break
    
        case '4':
        rares = "clusters";
        myclass = "immortal";
        break
    }
    switch(inventory[prop].charAt(1)) {
        case '0':
        elem = "ice";
        break
    
        case '1':
        elem = "fire";
        break
    
        case '2':
        elem = "water";
        break
    
        case '3':
        elem = "energy";
        break
    
        case '4':
        elem = "earth";
        break
    
        case '5':
        elem = "life";
        break
    
        case '6':
        elem = "void";
        break
    
        case '7':
        elem = "air";
        break
    
        case '8':
        elem = "light";
        break
    
        case '9':
        elem = "shadow";
        break
    }
    var boolestlivslote = "0";
    var estlivslote = "itemborder";
    for (var i = 1; i <= 8;i++)
    {
        if (inventory[prop] == slots[i])
        {
            boolestlivslote = "t";
            estlivslote = "selecteditemborder";
            break;
        }
    }
    for (var i = 0; i < purestones.length; i++)
    {
        if (purestones[i] == inventory[prop].toString())
        {
            estlivslote = "selectedfditemborder";
            break;
        }
    }
    var invItemPanel = $.CreatePanel("Panel", $("#rsinv"), "item"+inventory[prop]);
    invItemPanel.hittest = false;
    invItemPanel.AddClass(estlivslote);
    invItemPanel.style.marginTop = mtop + "px";
    invItemPanel.style.marginLeft = mleft + "px";
    invItemPanel.SetPanelEvent("onmouseover", (function(rsid, inSlot)
    {
        return function()
        {
            $.DispatchEvent("UIShowCustomLayoutParametersTooltip", "RSTooltip", "file://{resources}/layout/custom_game/rs_tooltips.xml", "num=" + rsid + inSlot);
        };
    })(inventory[prop], boolestlivslote));
    invItemPanel.SetPanelEvent("onmouseout", function()
    {
        $.DispatchEvent("UIHideCustomLayoutTooltip", "RSTooltip");
    });

    var invItemImage = $.CreatePanel("Image", invItemPanel, "");
    invItemImage.SetImage("file://{images}/custom_game/relic_items/"+rares+"/"+elem+"/"+inventory[prop].charAt(2)+".png");
    invItemImage.style.height = "60px";
    invItemImage.style.width = "80px";
    invItemImage.SetPanelEvent("onactivate", (function(rsid)
    {
        return function()
        {
            ClickItemOnInv(rsid);
        };
    })(inventory[prop]));

    var invItemClassPanel = $.CreatePanel("Panel", invItemPanel, "");
    invItemClassPanel.hittest = false;
    invItemClassPanel.AddClass(myclass);
    invItemClassPanel.style.height = "60px";
    invItemClassPanel.style.width = "5px";
    invItemClassPanel.style.marginLeft = "80px";
}

function NeedRefresh(info)
{
    $("#RButton").visible = true;
}

function SetFilter(filterid)
{
    if (filterid == filter)
    {
        filter = 0;
        $("#FilterButton"+filterid).RemoveClass("selectedfilter");
        $("#FilterButton"+filterid).AddClass("noselectedfilter");
    }
    else
    {
        if (filter != 0)
        {
            $("#FilterButton"+filter).RemoveClass("selectedfilter");
            $("#FilterButton"+filter).AddClass("noselectedfilter");
        }
        filter = filterid;
        $("#FilterButton"+filterid).RemoveClass("noselectedfilter");
        $("#FilterButton"+filterid).AddClass("selectedfilter");
        if (nowselected == 1)
        {
            if (GameUI.IsShiftDown())
            {
                $.Msg("test");
                purestones = [];
                for(var prop in inventory)
                {
                    if (inventory[prop] != "0")
                    {
                        if (inventory[prop].charAt(0) == filter.toString())
                        {
                            var moshno = true;
                            for (var i = 1; i <= 8; i++)
                            {
                                if (slots[i] == inventory[prop])
                                {
                                    moshno = false;
                                    break;
                                }
                            }
                            if (moshno)
                            {
                                purestones.splice(purestones.Length, 0, inventory[prop]);
                            }
                        }
                    }
                }
            }
        }
    }
    RefreshInventory(false);
    UpdtPureDust();
}

function SetFilter2(filter2id)
{
    if (filter2id == filter2)
    {
        filter2 = 0;
        $("#FilterButton2"+filter2id).RemoveClass("selectedfilter");
        $("#FilterButton2"+filter2id).AddClass("noselectedfilter");
    }
    else
    {
        if (filter2 != 0)
        {
            $("#FilterButton2"+filter2).RemoveClass("selectedfilter");
            $("#FilterButton2"+filter2).AddClass("noselectedfilter");
        }
        filter2 = filter2id;
        $("#FilterButton2"+filter2id).RemoveClass("noselectedfilter");
        $("#FilterButton2"+filter2id).AddClass("selectedfilter");
    }
    RefreshInventory(false)
}

function RefreshR()
{
	//$.Msg( "test" );
    $("#RButton").visible = false;
    GameEvents.SendCustomGameEventToServer( "RefreshRelics", { id: Players.GetLocalPlayer()} );
}

function SelectPl(num)
{
    purestones = [];
    upgradestone = "";
    UpdtUpgrade();
    UpdtPureDust();
    RefreshInventory(false);
    nowselected = num;
    UpdateSelection();
}

function UpdateSelection()
{
	$("#spba0").visible = false;
    $("#spba1").visible = false;
    $("#spba2").visible = false;
    $("#spba"+nowselected).visible = true;
    if (nowselected == 0)
    {
        $("#rsfilter").visible = true;
        $("#rsinv").visible = true;
        $("#osnova").visible = true;
        $("#puredust").visible = false;
        $("#dustlabel").visible = false;
        $("#saves").visible = true;
        $("#upgradepanel").visible = false;
        if ($("#saves").BHasClass("savesact"))
        {
            $("#saves").RemoveClass("savesact");
            $("#saves").AddClass("savesdis");
            //$("#rsfilter").visible = true;
            //$("#rsinv").visible = true;
        }
        $("#SavesButtonimg").AddClass("imgoff");
    }
    else if (nowselected == 1)
    {
        $("#osnova").visible = false;
        $("#rsfilter").visible = true;
        $("#rsinv").visible = true;
        $("#puredust").visible = true;
        $("#dustlabel").visible = true;
        $("#saves").visible = false;
        $("#upgradepanel").visible = false;
        if ($("#saves").BHasClass("savesact"))
        {
            $("#saves").RemoveClass("savesact");
            $("#saves").AddClass("savesdis");
            //$("#rsfilter").visible = true;
            //$("#rsinv").visible = true;
        }
        $("#SavesButtonimg").AddClass("imgoff");
    }
    else if (nowselected == 2)
    {
        $("#osnova").visible = false;
        $("#rsfilter").visible = true;
        $("#rsinv").visible = true;
        $("#puredust").visible = false;
        $("#dustlabel").visible = true;
        $("#saves").visible = false;
        $("#upgradepanel").visible = true;
        if ($("#saves").BHasClass("savesact"))
        {
            $("#saves").RemoveClass("savesact");
            $("#saves").AddClass("savesdis");
            //$("#rsfilter").visible = true;
            //$("#rsinv").visible = true;
        }
        $("#SavesButtonimg").AddClass("imgoff");
    }
}

function PureButtonReady()
{
    $("#PureButton").RemoveClass("PureButtondis");
    $("#PureButton").AddClass("PureButtonact");
}

function SavesButton()
{
    if ($("#saves").BHasClass("savesdis"))
    {
        $("#saves").RemoveClass("savesdis");
        $("#saves").AddClass("savesact");
        $("#rsfilter").visible = false;
        $("#rsinv").visible = false;
        $("#SavesButtonimg").RemoveClass("imgoff");
    }
    else
    {
        $("#saves").RemoveClass("savesact");
        $("#saves").AddClass("savesdis");
        $("#rsfilter").visible = true;
        $("#rsinv").visible = true;
        $("#SavesButtonimg").AddClass("imgoff");
    }
}

function SaveSet(num)
{
    if ($("#saves").BHasClass("savesact"))
    {
        $("#SaveButton1").RemoveClass("SaveButtons");
        $("#SaveButton2").RemoveClass("SaveButtons");
        $("#SaveButton3").RemoveClass("SaveButtons");
        $("#SaveButton4").RemoveClass("SaveButtons");
        $("#SaveButton5").RemoveClass("SaveButtons");
        $("#SaveButton6").RemoveClass("SaveButtons");
        $("#SaveButton7").RemoveClass("SaveButtons");
        $("#SaveButton8").RemoveClass("SaveButtons");
        $("#SaveButton1").AddClass("SaveButtonsdis");
        $("#SaveButton2").AddClass("SaveButtonsdis");
        $("#SaveButton3").AddClass("SaveButtonsdis");
        $("#SaveButton4").AddClass("SaveButtonsdis");
        $("#SaveButton5").AddClass("SaveButtonsdis");
        $("#SaveButton6").AddClass("SaveButtonsdis");
        $("#SaveButton7").AddClass("SaveButtonsdis");
        $("#SaveButton8").AddClass("SaveButtonsdis");
        GameEvents.SendCustomGameEventToServer( "SaveSet", { id: Players.GetLocalPlayer(), num:num} );
    }
}

function LoadSet(num)
{
    if ($("#saves").BHasClass("savesact"))
    {
        GameEvents.SendCustomGameEventToServer( "LoadSet", { id: Players.GetLocalPlayer(), num:num} );
    }
}

function ReadySetButton()
{
    $("#SaveButton1").RemoveClass("SaveButtonsdis");
    $("#SaveButton2").RemoveClass("SaveButtonsdis");
    $("#SaveButton3").RemoveClass("SaveButtonsdis");
    $("#SaveButton4").RemoveClass("SaveButtonsdis");
    $("#SaveButton5").RemoveClass("SaveButtonsdis");
    $("#SaveButton6").RemoveClass("SaveButtonsdis");
    $("#SaveButton7").RemoveClass("SaveButtonsdis");
    $("#SaveButton8").RemoveClass("SaveButtonsdis");
    $("#SaveButton1").AddClass("SaveButtons");
    $("#SaveButton2").AddClass("SaveButtons");
    $("#SaveButton3").AddClass("SaveButtons");
    $("#SaveButton4").AddClass("SaveButtons");
    $("#SaveButton5").AddClass("SaveButtons");
    $("#SaveButton6").AddClass("SaveButtons");
    $("#SaveButton7").AddClass("SaveButtons");
    $("#SaveButton8").AddClass("SaveButtons");
}

function SetColor(colorid)
{
    if (!$("#ColorButton"+colorid).BHasClass("nocolor"))
    if (colorid != color)
    {
        $("#ColorButton"+color).RemoveClass("selectedfilter");
        $("#ColorButton"+color).AddClass("noselectedfilter");
        color = colorid;
        $("#ColorButton"+colorid).RemoveClass("noselectedfilter");
        $("#ColorButton"+colorid).AddClass("selectedfilter");
        GameEvents.SendCustomGameEventToServer( "SetColor", { id: Players.GetLocalPlayer(), colorid:colorid} );
    }
}

(function()
{
    GameEvents.SubscribeProtected( "My_lvl", UpdtLvl);
    GameEvents.SubscribeProtected( "NeedRefresh", NeedRefresh);
    GameEvents.SubscribeProtected( "PureButtonReady", PureButtonReady);
    GameEvents.SubscribeProtected( "ReadySetButton", ReadySetButton);
    $("#AllRelicPanel").visible = false;
	$("#RButton").visible = false;
	$("#spba0").visible = false;
    $("#spba1").visible = false;
    $("#mysealcampart").visible = false;
    UpdateSelection()
})();
