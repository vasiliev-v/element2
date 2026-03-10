if Craft6System == nil then
    Craft6System = class({})
end

Craft6System.REQUIRED_AMOUNTS = {10, 20, 30, 40, 50}

Craft6System.INGREDIENTS = {
    "item_ice",
    "item_fire",
    "item_water",
    "item_energy",
    "item_earth",
    "item_life",
    "item_craft_scroll",
}

Craft6System.RESULTS = {
    "item_artifact_tier_1",
    "item_artifact_tier_2",
    "item_artifact_tier_3",
    "item_artifact_tier_4",
    "item_artifact_tier_5",
}

function Craft6System:Init()
    CustomGameEventManager:RegisterListener("craft6_make_item", function(_, keys)
        self:OnCraftRequest(keys)
    end)
end

local function CountItemInInventory(hero, itemName)
    if not hero then return 0 end

    local count = 0
    for slot = 0, 8 do
        local item = hero:GetItemInSlot(slot)
        if item and item:GetAbilityName() == itemName then
            count = count + item:GetCurrentCharges()
        end
    end
    return count
end

local function RemoveChargesFromInventory(hero, itemName, amount)
    local left = amount

    for slot = 0, 8 do
        local item = hero:GetItemInSlot(slot)
        if item and item:GetAbilityName() == itemName then
            local charges = item:GetCurrentCharges()

            if charges > left then
                item:SetCurrentCharges(charges - left)
                return true
            else
                left = left - charges
                UTIL_Remove(item)
                if left <= 0 then
                    return true
                end
            end
        end
    end

    return left <= 0
end

function Craft6System:CanCraft(hero, tier)
    local need = self.REQUIRED_AMOUNTS[tier]
    if not need then return false end

    for _, itemName in pairs(self.INGREDIENTS) do
        if CountItemInInventory(hero, itemName) < need then
            return false
        end
    end

    return true
end

function Craft6System:OnCraftRequest(keys)
    local playerID = keys.PlayerID
    local tier = tonumber(keys.tier)

    if not playerID or playerID < 0 then return end
    if not tier or tier < 1 or tier > 5 then return end

    local hero = PlayerResource:GetSelectedHeroEntity(playerID)
    if not hero then return end

    if not self:CanCraft(hero, tier) then
        return
    end

    local need = self.REQUIRED_AMOUNTS[tier]
    for _, itemName in pairs(self.INGREDIENTS) do
        RemoveChargesFromInventory(hero, itemName, need)
    end

    hero:AddItemByName(self.RESULTS[tier])

    self:UpdateNetTable(playerID, hero)
end

function Craft6System:UpdateNetTable(playerID, hero)
    local data = {}

    for _, itemName in pairs(self.INGREDIENTS) do
        data[itemName] = CountItemInInventory(hero, itemName)
    end

    CustomNetTables:SetTableValue("craft6_table", tostring(playerID), data)
end