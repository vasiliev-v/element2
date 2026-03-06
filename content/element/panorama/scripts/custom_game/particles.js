
var names = new Array("DEVELOPER", "WINNER", "HELPER", "TOP", "DISCORD", "BUTTERFLIES", "DONATOR", "ALLHEROES", "NEW YEAR", "BIRTHDAY", "PATRON LVL 1", "PATRON LVL 2", "PATRON LVL 3", "PATRON LVL 4", "PATRON LVL 5", "HARD WINNER", "BIRTHDAY 2019", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39");
var needs = new Array(false, "#winner", "#helper", "#top", "#discord", false, "#donator", "#allheroes", "#newyear", "#birthday", "#patron1", "#patron2", "#patron3", "#patron4", "#patron5", "#hardwinner", false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false);
var poriadok = new Array(0, 3, 7, 6, 10, 11, 12, 13, 14, 15, 1, 2, 4, 8, 9, 16, 5, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39);//"#birthday2"
function UpdateTooltipPanel(parentPanel, myint, num)
{
    var tooltipPanel = $("#NewTooltip" + myint);
    if (tooltipPanel != null)
    {
        tooltipPanel.DeleteAsync(0);
    }

    var newTooltip = $.CreatePanel("Panel", parentPanel, "NewTooltip" + myint);
    newTooltip.AddClass("NewTooltip");
    newTooltip.SetPanelEvent("onmouseover", function()
    {
        $.DispatchEvent("UIShowCustomLayoutParametersTooltip", "ParticleTooltip" + myint, "file://{resources}/layout/custom_game/particles_tooltips.xml", "num=" + num);
    });
    newTooltip.SetPanelEvent("onmouseout", function()
    {
        $.DispatchEvent("UIHideCustomLayoutTooltip", "ParticleTooltip" + myint);
    });
}
function UpdateParticles( table_name, key, data )
{
    var ID = Players.GetLocalPlayer();
	//$.Msg( ID, ": ", "Table ", table_name, " changed: '", key, "' = ", data );
    var myint = 1;
    if (ID == key)
    {
        if (data != null)
        {
            for (var x = 1; x < names.length+1; x = x + 1)
            {
                if (data[poriadok[x-1]+1] != null)
                {
                    $("#NAPartButt"+x).visible = false;
                    if (data[poriadok[x-1]+1] != "nill")
                    {
                        if (data[poriadok[x-1]+1] != "normal")
                        {
                            $("#NewPartButt"+myint).visible = true;
                            $("#partname"+myint).text = names[poriadok[x-1]];
                            $("#partnote"+myint).text = data[poriadok[x-1]+1];
                            $("#NewPartNum"+myint).text = poriadok[x-1]+1;
                            UpdateTooltipPanel($("#NewPartButt"+myint), myint, poriadok[x-1]+1);
                            myint = myint + 1;
                        }
                        else
                        {
                            $("#NewPartButt"+myint).visible = true;
                            $("#partname"+myint).text = names[poriadok[x-1]];
                            $("#partnote"+myint).text = $.Localize(needs[poriadok[x-1]]);
                            $("#NewPartNum"+myint).text = poriadok[x-1]+1;
                            UpdateTooltipPanel($("#NewPartButt"+myint), myint, poriadok[x-1]+1);
                            myint = myint + 1;
                        }
                    }
                    else
                    {
                        if (needs[poriadok[x-1]] != false)
                        {
                            $("#NAPartButt"+myint).visible = true;
                            $("#napartname"+myint).text = names[poriadok[x-1]];
                            $("#napartnote"+myint).text = $.Localize(needs[poriadok[x-1]]);
                            UpdateTooltipPanel($("#NAPartButt"+myint), myint, poriadok[x-1]+1);
                            myint = myint + 1;
                        }
                    }
                }
                else
                {
                    if (needs[poriadok[x-1]] != false)
                    {
                        $("#NAPartButt"+myint).visible = true;
                        $("#napartname"+myint).text = names[poriadok[x-1]];
                        $("#napartnote"+myint).text = $.Localize(needs[poriadok[x-1]]);
                        UpdateTooltipPanel($("#NAPartButt"+myint), myint, poriadok[x-1]+1);
                        myint = myint + 1;
                    }
                }
            }
        }
        else
        {
            for (var x = 1; x < names.length+1; x = x + 1)
            {
                if (needs[poriadok[x-1]] != false)
                {
                    $("#NAPartButt"+myint).visible = true;
                    $("#napartname"+myint).text = names[poriadok[x-1]];
                    $("#napartnote"+myint).text = $.Localize(needs[poriadok[x-1]]);
                    UpdateTooltipPanel($("#NAPartButt"+myint), myint, poriadok[x-1]+1);
                    myint = myint + 1;
                }
            }
        }
    }
}
var selectedpart = null;
function SelectPart(num)
{
    if (selectedpart != num)
    {
        if (selectedpart != null)
        {
            $("#partapngb"+selectedpart).visible = false;
        }
        GameEvents.SendCustomGameEventToServer( "SelectPart", { id: Players.GetLocalPlayer(),part:$("#NewPartNum"+num).text, offp:false, name:$("#partname"+num).text } );
        $("#partapngb"+num).visible = true;
        selectedpart = num;
    }
    else
    {
        GameEvents.SendCustomGameEventToServer( "SelectPart", { id: Players.GetLocalPlayer(),part:$("#NewPartNum"+num).text, offp:true, name:$("#partname"+num).text } );
        $("#partapngb"+selectedpart).visible = false;
        selectedpart = null;
    }
    //$.Msg("SelectedPart = "+selectedpart);
}

function DefaultButtonReady()
{
    $("#DefaultButton").RemoveClass("DefaultButtondis");
    $("#DefaultButton").AddClass("DefaultButtonact");
}

function DefaultButton()
{
    if (selectedpart != null)
    {
        GameEvents.SendCustomGameEventToServer( "SetDefaultPart", { id: Players.GetLocalPlayer(),part:$("#NewPartNum"+selectedpart).text} );
        //$.Msg($("#NewPartNum"+selectedpart).text);
    }
    else
    {
        GameEvents.SendCustomGameEventToServer( "SetDefaultPart", { id: Players.GetLocalPlayer(),part:""} );
    }
    $("#DefaultButton").RemoveClass("DefaultButtonact");
    $("#DefaultButton").AddClass("DefaultButtondis");
}

function SetSelectedParticles(data)
{
    for (var x = 1; x < names.length+1; x = x + 1)
    {
        if ($("#NewPartNum"+x).text == data["3"])
            selectedpart = x.toString();
    }
    $("#partapngb"+selectedpart).visible = true;
}

(function()
{
    GameEvents.Subscribe( "DefaultButtonReady", DefaultButtonReady);
    GameEvents.Subscribe( "SetSelectedParticles", SetSelectedParticles);
    for (var x = 1; x < names.length+1; x = x + 1)
    {
        var stl = (100*(x-1)) + 20
        var newPartButt = $.CreatePanel("Button", $("#CustomUIContainer"), "NewPartButt"+x);
        newPartButt.AddClass("NewPartButt");
        newPartButt.style.marginTop = stl + "px";
        newPartButt.SetPanelEvent("onactivate", (function(index)
        {
            return function()
            {
                SelectPart(index);
            };
        })(x));

        var pereg = $.CreatePanel("Image", newPartButt, "pereg"+x);
        pereg.SetImage("file://{images}/custom_game/all/st.png");
        pereg.style.width = "5px";
        pereg.style.marginTop = "0px";
        pereg.style.marginLeft = "150px";

        var partapngb = $.CreatePanel("Image", newPartButt, "partapngb"+x);
        partapngb.SetImage("file://{images}/custom_game/all/activbutt.png");

        var newPartNum = $.CreatePanel("Label", newPartButt, "NewPartNum"+x);
        newPartNum.text = "0";

        var partname = $.CreatePanel("Label", newPartButt, "partname"+x);
        partname.text = "Название эффекта";
        partname.style.marginTop = "20px";
        partname.style.marginLeft = "10px";

        var partnote = $.CreatePanel("Label", newPartButt, "partnote"+x);
        partnote.text = "Описание/причина выдачи/примечание";
        partnote.style.marginTop = "5px";
        partnote.style.marginLeft = "180px";

        newPartButt.visible = false;
        newPartNum.visible = false;
        partapngb.visible = false;

        var naPartButt = $.CreatePanel("Button", $("#CustomUIContainer"), "NAPartButt"+x);
        naPartButt.AddClass("NAPartButt");
        naPartButt.style.marginTop = stl + "px";

        var napereg = $.CreatePanel("Image", naPartButt, "napereg"+x);
        napereg.SetImage("file://{images}/custom_game/all/st.png");
        napereg.style.width = "5px";
        napereg.style.marginTop = "0px";
        napereg.style.marginLeft = "150px";

        var napartname = $.CreatePanel("Label", naPartButt, "napartname"+x);
        napartname.text = "Название эффекта";
        napartname.style.marginTop = "20px";
        napartname.style.marginLeft = "10px";

        var napartnote = $.CreatePanel("Label", naPartButt, "napartnote"+x);
        napartnote.text = "Описание/причина выдачи/примечание";
        napartnote.style.marginTop = "5px";
        napartnote.style.marginLeft = "180px";

        naPartButt.visible = false;
    }
    CustomNetTables.SubscribeNetTableListener( "Particles_Tabel", UpdateParticles );
    UpdateParticles( "Particles_Tabel", Players.GetLocalPlayer(), CustomNetTables.GetTableValue( "Particles_Tabel", Players.GetLocalPlayer() ) );
})();
