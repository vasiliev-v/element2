var list = [];
var skiponetick = false
function AddRSUI( data )
{
    $.Msg(data);
    list.push(data);
}

function IntTick()
{
    if (skiponetick == false)
    {
        if ($("#PanelForPart") != null)
        {
            //$("#immortalpart").visible = false;
            //$("#immortalpart").DeleteAsync(0);
            $("#PanelForPart").RemoveAndDeleteChildren();
            //$("#immortalpart").visible = true;
        }
        if (list[0] != null)
        {
            $("#Line1").visible = true;
            if ($("#item1") != null)
            {
                $("#item1").RemoveAndDeleteChildren();
            }
            if ($("#Line1").BHasClass("OffPanelClass"))
                $("#Line1").RemoveClass("OffPanelClass");
            if ($("#Line1").BHasClass("OffPanelClassImm"))
                $("#Line1").RemoveClass("OffPanelClassImm");

            switch(list[0]["rsid"].charAt(0)) {
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
                skiponetick = true;
                break
            }
            if (myclass == "immortal")
            {
                $("#PanelForPart").RemoveAndDeleteChildren();
                var immortalPart = $.CreatePanel("DOTAScenePanel", $("#PanelForPart"), "immortalpart");
                immortalPart.hittest = false;
                immortalPart.particleonly = "true";
                immortalPart.style.marginTop = "-135px";
                immortalPart.style.marginLeft = "-52px";
                immortalPart.style.height = "300px";
                immortalPart.style.width = "300px";
                immortalPart.map = "cameras";
                immortalPart.camera = "partcamera4";
            }
            if (myclass == "immortal")
            {
                $("#Line1").AddClass("OffPanelClassImm");
            }
            else
            {
                $("#Line1").AddClass("OffPanelClass");
            }
            switch(list[0]["rsid"].charAt(1)) {
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
            $("#hero1").heroname = list[0]["hero"];
            var item1 = $.CreatePanel("Panel", $("#Line1"), "item1");
            item1.hittest = false;
            item1.style.marginTop = "4px";
            item1.style.marginLeft = "82px";
            item1.SetPanelEvent("onmouseover", (function(rsid)
            {
                return function()
                {
                    $.DispatchEvent("UIShowCustomLayoutParametersTooltip", "RSTooltip", "file://{resources}/layout/custom_game/rs_tooltips.xml", "num=" + rsid);
                };
            })(list[0]["rsid"]));
            item1.SetPanelEvent("onmouseout", function()
            {
                $.DispatchEvent("UIHideCustomLayoutTooltip", "RSTooltip");
            });

            var itemImage = $.CreatePanel("Image", item1, "");
            itemImage.SetImage("file://{images}/custom_game/relic_items/"+rares+"/"+elem+"/"+list[0]["rsid"].charAt(2)+".png");
            itemImage.style.height = "36px";
            itemImage.style.width = "48px";

            var classPanel = $.CreatePanel("Panel", item1, "");
            classPanel.hittest = false;
            classPanel.AddClass(myclass);
            classPanel.style.height = "36px";
            classPanel.style.width = "3px";
            classPanel.style.marginLeft = "48px";
            list.shift();
            //$("#immortalpart").visible = true;
            //$.Msg(list);
        }
        else
        {
            $("#Line1").visible = false;
        }
    }
    else
    {
        skiponetick = false;
    }
    $.Schedule(4,IntTick);
}

(function()
{
    $("#Line1").visible = false;
    GameEvents.SubscribeProtected( "AddRSUI", AddRSUI);
    IntTick();
})();