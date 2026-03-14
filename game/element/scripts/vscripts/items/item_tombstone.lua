if item_tombstone == nil then
	item_tombstone = class({})
end

local function IsValidEntityHandle(entity)
	return entity ~= nil and (not entity.IsNull or not entity:IsNull())
end

local function RemoveEntityByEntIndex(entindex, debugLabel)
	if entindex == nil then
		return false
	end

	local entity = EntIndexToHScript(entindex)
	if not IsValidEntityHandle(entity) then
		return false
	end

	UTIL_Remove(entity)
	print(debugLabel)
	return true
end

function item_tombstone:RemoveTombstoneArtifacts()
	if not IsServer() then
		return
	end

	local dropEntIndex = self.tombstone_drop_entindex
	local visualEntIndex = self.tombstone_visual_entindex
	local particleEnt = self.tombstone_particle
	local thinkerEnt = self.tombstone_thinker
	local dummyEnt = self.tombstone_dummy

	local container = nil
	if IsValidEntityHandle(self) and self.GetContainer then
		container = self:GetContainer()
	end

	local containerRemoved = false
	if IsValidEntityHandle(container) then
		UTIL_Remove(container)
		print("[TOMBSTONE] tombstone container removed")
		containerRemoved = true
	elseif RemoveEntityByEntIndex(dropEntIndex, "[TOMBSTONE] tombstone container removed") then
		containerRemoved = true
	end

	local visualRemoved = false
	if RemoveEntityByEntIndex(visualEntIndex, "[TOMBSTONE] tombstone visual removed") then
		visualRemoved = true
	elseif containerRemoved then
		-- Для текущей реализации visual = container (dota_item_tombstone_drop)
		print("[TOMBSTONE] tombstone visual removed")
		visualRemoved = true
	end

	if IsValidEntityHandle(particleEnt) then
		UTIL_Remove(particleEnt)
		print("[TOMBSTONE] tombstone particle removed")
	end

	if IsValidEntityHandle(thinkerEnt) then
		UTIL_Remove(thinkerEnt)
		print("[TOMBSTONE] tombstone thinker removed")
	end

	if IsValidEntityHandle(dummyEnt) then
		UTIL_Remove(dummyEnt)
		print("[TOMBSTONE] tombstone dummy removed")
	end

	local itemRemoved = false
	if IsValidEntityHandle(self) then
		UTIL_Remove(self)
		print("[TOMBSTONE] tombstone item removed")
		itemRemoved = true
	end

	if not itemRemoved then
		print("[TOMBSTONE] tombstone item remove skipped (invalid handle)")
	end

	if not containerRemoved then
		print("[TOMBSTONE] tombstone container remove skipped (not found)")
	end

	if not visualRemoved then
		print("[TOMBSTONE] tombstone visual remove skipped (not found)")
	end
end

function item_tombstone:OnSpellStart()
	if not IsServer() then
		return
	end

	local caster = self:GetCaster()
	if not IsValidEntityHandle(caster) then
		print("[TOMBSTONE] OnSpellStart: caster is nil")
		return
	end

	local heroEntIndex = self.tombstone_hero_entindex
	local deadPlayerID = self.tombstone_player_id
	local deadTeam = self.tombstone_team
	local deathPosition = self.tombstone_death_position

	print(string.format("[TOMBSTONE] OnSpellStart: caster=%s caster_pid=%s item=%s stored_hero_entindex=%s stored_pid=%s stored_team=%s", tostring(caster:GetUnitName()), tostring(caster:GetPlayerOwnerID()), tostring(self:entindex()), tostring(heroEntIndex), tostring(deadPlayerID), tostring(deadTeam)))

	if heroEntIndex == nil and deadPlayerID ~= nil and deadPlayerID >= 0 then
		local fallbackHero = PlayerResource:GetSelectedHeroEntity(deadPlayerID)
		if IsValidEntityHandle(fallbackHero) then
			heroEntIndex = fallbackHero:entindex()
			self.tombstone_hero_entindex = heroEntIndex
			print(string.format("[TOMBSTONE] Fallback hero resolved via PlayerResource: entindex=%s", tostring(heroEntIndex)))
		end
	end

	if heroEntIndex == nil then
		print("[TOMBSTONE] Abort: no stored hero entindex")
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	local deadHero = EntIndexToHScript(heroEntIndex)
	if not IsValidEntityHandle(deadHero) then
		print(string.format("[TOMBSTONE] Abort: deadHero handle invalid for entindex=%s", tostring(heroEntIndex)))
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	if deadTeam == nil then
		deadTeam = deadHero:GetTeamNumber()
		self.tombstone_team = deadTeam
	end

	if caster:GetTeamNumber() ~= deadTeam then
		print(string.format("[TOMBSTONE] Abort: ally check failed caster_team=%s dead_team=%s", tostring(caster:GetTeamNumber()), tostring(deadTeam)))
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	if deadHero:IsAlive() then
		print(string.format("[TOMBSTONE] Abort: target hero already alive hero=%s", tostring(deadHero:GetUnitName())))
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	local respawnPos = deathPosition
	if respawnPos == nil then
		respawnPos = deadHero:GetAbsOrigin()
	end

	print(string.format("[TOMBSTONE] Respawning hero=%s entindex=%s at position=(%.1f, %.1f, %.1f)", tostring(deadHero:GetUnitName()), tostring(heroEntIndex), respawnPos.x, respawnPos.y, respawnPos.z))

	deadHero:RespawnHero(false, false)
	FindClearSpaceForUnit(deadHero, respawnPos, true)
	deadHero:Stop()

	if deadHero:GetHealth() <= 1 then
		deadHero:SetHealth(math.max(1, deadHero:GetMaxHealth()))
	end

	if deadHero:GetMana() <= 0 then
		deadHero:SetMana(deadHero:GetMaxMana())
	end

	if deadHero:IsAlive() then
		print(string.format("[TOMBSTONE] Respawn success: hero=%s hp=%s mana=%s", tostring(deadHero:GetUnitName()), tostring(deadHero:GetHealth()), tostring(deadHero:GetMana())))
		self:RemoveTombstoneArtifacts()
	else
		print(string.format("[TOMBSTONE] Respawn failed: hero=%s", tostring(deadHero:GetUnitName())))
		print("[TOMBSTONE] respawn failed, tombstone preserved")
	end
end
