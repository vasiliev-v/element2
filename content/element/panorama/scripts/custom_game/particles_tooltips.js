function setupTooltip(){
    var num = $.GetContextPanel().GetAttributeString( "num", "notfound" );
    if($("#cam")==null)
    {
        var camPanel = $.CreatePanel("DOTAScenePanel", $("#toolpanel"), "cam");//unit='npc_dota_custom_creep_1_1'
        camPanel.style.width = "400px";
        camPanel.style.height = "400px";
        camPanel.particleonly = "false";
        camPanel.map = "cameras";
        camPanel.camera = "camera" + num;
        //$.DispatchEvent("DOTAGlobalSceneFireEntityInput", "cam", "donkey", "RunScriptFile", "ptooltips");
    }
    //$.Msg(num);
}
