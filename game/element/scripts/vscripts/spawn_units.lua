if spawn_units == nil then
	spawn_units = class({})
end

ability_spawn_units = spawn_units



local function SpawnUnitsForAbility(keys, caster)
	local ability = keys.ability
	if not ability or not caster then
		return
	end
	DeepPrintTable(keys)
	local unitName = keys.UnitName
	local unitCount = ability:GetSpecialValueFor("unit_count")
	local spawnRadius = ability:GetSpecialValueFor("spawn_radius")
print("print(unitName)")
	print(unitName .. " " .. unitCount )
	if not unitName or unitName == "" then
		return
	end
	
	local origin = caster:GetAbsOrigin()
	for _ = 1, unitCount do
		local spawnPos = origin + RandomVector(RandomInt(0, spawnRadius))
		local unit = CreateUnitByName(unitName, spawnPos, true, caster, caster, caster:GetTeamNumber())
		if unit then
			unit:SetOwner(caster)
		end
	end
end

function spawn_units:OnSpellStart()
	SpawnUnitsForAbility(self, self:GetCaster())
end

function SpawnUnitsFromEvent(keys)
	if not keys or not keys.ability or not keys.caster then
		return
	end

	SpawnUnitsForAbility(keys, keys.caster)
end
