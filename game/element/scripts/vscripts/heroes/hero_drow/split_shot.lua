
function OnToggleOn( keys )
	local caster = keys.caster
	local ability = keys.ability
	caster._attacking = false
	caster._active_split_shot = true
end

function OnToggleOff( keys )
	local caster = keys.caster
	local ability = keys.ability
	caster._attacking = false	
	if caster:IsAlive() then
		caster._active_split_shot = false
	end
end

function OnOwnerSpawned( keys )
	-- print('OnOwnerSpawned')
	print('active: '.. tostring( keys.caster._active_split_shot))
	local caster = keys.caster
	local ability = keys.ability
	if caster._active_split_shot then
		ability:ToggleAbility()
	end
end

function OnOwnerDied( keys )
	-- print('OnOwnerDied')
	local caster = keys.caster
	local ability = keys.ability
	-- caster._active_split_shot = ability:GetToggleState()
end

--[[
	Creates additional attack projectiles for units within the specified radius around the caster]]
function SplitShotLaunch( keys )
	local caster = keys.caster
	local caster_location = caster:GetAbsOrigin()
	local ability = keys.ability
	local ability_level = ability:GetLevel() - 1

	-- Targeting variables
	local target_type = ability:GetAbilityTargetType()
	local target_team = ability:GetAbilityTargetTeam()
	local target_flags = ability:GetAbilityTargetFlags()
	local attack_target = caster:GetAttackTarget()

	-- Ability variables
	local radius = ability:GetLevelSpecialValueFor("range", ability_level)
	radius_plus = radius + caster:GetAttackRangeBuffer()
	-- local max_targets = ability:GetLevelSpecialValueFor("arrow_count", ability_level)
	local max_targets = GetTalentSpecialValueFor(ability, "arrow_count")
	local projectile_speed = ability:GetLevelSpecialValueFor("projectile_speed", ability_level)
	local split_shot_projectile = keys.split_shot_projectile

	-- local split_shot_targets = FindUnitsInRadius(caster:GetTeam(), caster_location, nil, radius, target_team, target_type, target_flags, FIND_CLOSEST, false)
	local split_shot_targets = FindTargetEnemy(caster, caster_location, radius_plus)

	-- Create projectiles for units that are not the casters current attack target
	for _,v in pairs(split_shot_targets) do
		if v ~= attack_target then
			local projectile_info = 
			{
				EffectName = split_shot_projectile,
				Ability = ability,
				vSpawnOrigin = caster_location,
				Target = v,
				Source = caster,
				bHasFrontalCone = false,
				iMoveSpeed = projectile_speed,
				bReplaceExisting = false,
				bProvidesVision = false
			}
			ProjectileManager:CreateTrackingProjectile(projectile_info)
			max_targets = max_targets - 1
		end
		-- If we reached the maximum amount of targets then break the loop
		if max_targets == 0 then break end
	end
end

-- Apply the auto attack damage to the hit unit
function SplitShotDamage( keys )
	local caster = keys.caster
	local target = keys.target
	local ability = keys.ability

	local damage_amount = caster:GetAttackDamage()

	local dmg_table_target = {
		victim = target,
		attacker = caster,
		damage = damage_amount,
        damage_type = ability:GetAbilityDamageType(),
        damage_flags = DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY,
	    ability = ability,
	}
	ApplyDamage(dmg_table_target)
end

---------------------------------------------------------------------------------------------------------------

function HasTalent(unit, talentName)
    if unit:HasAbility(talentName) then
        if unit:FindAbilityByName(talentName):GetLevel() > 0 then return true end
    end
    return false
end

function GetTalentSpecialValueFor(ability, valueName)
    if not ability or ability:IsNull() then
        return 0
    end

    local caster = ability:GetCaster()
    local kv = ability:GetAbilityKeyValues() or {}
    local abilityValues = kv.AbilityValues or {}

    local function ToNumber(v)
        if v == nil then
            return nil
        end
        return tonumber(v)
    end

    local function GetAbilityLevelIndex(ab)
        local lvl = ab:GetLevel()
        if lvl == nil or lvl < 1 then
            return 1
        end
        return lvl
    end

    local function ParseValueByLevel(raw, level)
        if raw == nil then
            return nil
        end

        if type(raw) == "number" then
            return raw
        end

        if type(raw) ~= "string" then
            return nil
        end

        local parts = {}
        for token in string.gmatch(raw, "%S+") do
            table.insert(parts, token)
        end

        if #parts == 0 then
            return nil
        end

        if #parts == 1 then
            return tonumber(parts[1]) or parts[1]
        end

        local index = math.max(1, math.min(level, #parts))
        return tonumber(parts[index]) or parts[index]
    end

    local base = nil
    local talentName = nil
    local level = GetAbilityLevelIndex(ability)

    local entry = abilityValues[valueName]

    if type(entry) == "table" then
        -- случай:
        -- "shock_damage"
        -- {
        --     "value" "75 135 195 ..."
        --     "LinkedSpecialBonus" "special_bonus_xxx"
        -- }
        base = ParseValueByLevel(entry.value, level)
        talentName = entry.LinkedSpecialBonus
    elseif entry ~= nil then
        -- случай:
        -- "shock_speed" "900"
        base = ParseValueByLevel(entry, level)
    end

    -- fallback на стандартные AbilitySpecial / SpecialValues
    if base == nil then
        local ok, result = pcall(function()
            return ability:GetSpecialValueFor(valueName)
        end)
        if ok then
            base = result
        end
    end

    if base == nil then
        base = 0
    end

    if talentName and caster then
        local talent = caster:FindAbilityByName(talentName)
        if talent and talent:GetLevel() > 0 then
            local bonus = talent:GetSpecialValueFor("value")
            if bonus then
                base = base + bonus
            end
        end
    end

    return base
end

function FindTargetEnemy(unit, point, radius_plus)
    local iTeamNumber = unit:GetTeamNumber()
    local vPosition = point
    local hCacheUnit = nil
    local flRadius = radius_plus
    local iTeamFilter = DOTA_UNIT_TARGET_TEAM_ENEMY
	local iTypeFilter = DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_BASIC --DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_CREEP
    local iFlagFilter = DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE + DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAG_INVULNERABLE   
    local iOrder = FIND_CLOSEST
    local bCanGrowCache = false
    return FindUnitsInRadius( iTeamNumber, vPosition, hCacheUnit, 
        flRadius, iTeamFilter, iTypeFilter, iFlagFilter, iOrder, bCanGrowCache )
end
