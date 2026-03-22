if item_tombstone == nil then
	item_tombstone = class({})
end

local function IsValidEntityHandle(entity)
	return entity ~= nil and (not entity.IsNull or not entity:IsNull())
end

local function RemoveEntitySafe(entity, debugText)
	if not IsValidEntityHandle(entity) then
		return false
	end

	UTIL_Remove(entity)
	print(debugText)
	return true
end

local function RemoveParticleSafe(particleId)
	if particleId == nil then
		return false
	end

	ParticleManager:DestroyParticle(particleId, false)
	ParticleManager:ReleaseParticleIndex(particleId)
	return true
end

function item_tombstone:GetChannelTime()
	return self.tombstone_respawn_time or 10
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

	local deathPosition = self.tombstone_death_position
	if deathPosition == nil then
		deathPosition = caster:GetAbsOrigin()
	end

	self.tombstone_respawn_time = self.tombstone_respawn_time or 10
	self.tombstone_channel_fx = ParticleManager:CreateParticle("particles/econ/events/darkmoon_2017/darkmoon_calldown_marker.vpcf", PATTACH_CUSTOMORIGIN, nil)
	ParticleManager:SetParticleControl(self.tombstone_channel_fx, 0, deathPosition)
	ParticleManager:SetParticleControl(self.tombstone_channel_fx, 1, Vector(175, self.tombstone_respawn_time, 1))
	ParticleManager:SetParticleControl(self.tombstone_channel_fx, 2, Vector(self.tombstone_respawn_time, 0, 0))
end

function item_tombstone:OnChannelFinish(bInterrupted)
	if not IsServer() then
		return
	end

	RemoveParticleSafe(self.tombstone_channel_fx)
	self.tombstone_channel_fx = nil

	if bInterrupted then
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	local caster = self:GetCaster()
	if not IsValidEntityHandle(caster) then
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	local heroEntIndex = self.tombstone_hero_entindex
	local deadPlayerID = self.tombstone_player_id
	local deadTeam = self.tombstone_team
	local deathPosition = self.tombstone_death_position

	if heroEntIndex == nil and deadPlayerID ~= nil and deadPlayerID >= 0 then
		local fallbackHero = PlayerResource:GetSelectedHeroEntity(deadPlayerID)
		if IsValidEntityHandle(fallbackHero) then
			heroEntIndex = fallbackHero:entindex()
			self.tombstone_hero_entindex = heroEntIndex
		end
	end

	if heroEntIndex == nil then
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	local deadHero = EntIndexToHScript(heroEntIndex)
	if not IsValidEntityHandle(deadHero) then
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	if deadTeam == nil then
		deadTeam = deadHero:GetTeamNumber()
		self.tombstone_team = deadTeam
	end

	if caster:GetTeamNumber() ~= deadTeam then
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	if deadHero:IsAlive() then
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	local respawnPos = deathPosition
	if respawnPos == nil then
		respawnPos = deadHero:GetAbsOrigin()
	end

	deadHero:RespawnHero(false, false)
	FindClearSpaceForUnit(deadHero, respawnPos, true)
	deadHero:Stop()

	if deadHero:GetHealth() <= 1 then
		deadHero:SetHealth(math.max(1, deadHero:GetMaxHealth()))
	end

	if deadHero:GetMana() <= 0 then
		deadHero:SetMana(deadHero:GetMaxMana())
	end

	if not deadHero:IsAlive() then
		print("[TOMBSTONE] respawn failed, tombstone preserved")
		return
	end

	local removedVisual = false
	local removedContainer = false
	local removedItem = false

	local container = self:GetContainer()
	if IsValidEntityHandle(container) then
		removedContainer = RemoveEntitySafe(container, "[TOMBSTONE] tombstone container removed") or removedContainer
	end

	local dropEntIndex = self.tombstone_drop_entindex
	if dropEntIndex ~= nil then
		local dropEntity = EntIndexToHScript(dropEntIndex)
		if IsValidEntityHandle(dropEntity) and dropEntity ~= container then
			removedContainer = RemoveEntitySafe(dropEntity, "[TOMBSTONE] tombstone container removed") or removedContainer
		end
	end

	local visualEntIndex = self.tombstone_visual_entindex
	if visualEntIndex ~= nil then
		local visualEntity = EntIndexToHScript(visualEntIndex)
		if IsValidEntityHandle(visualEntity) and visualEntity ~= container then
			removedVisual = RemoveEntitySafe(visualEntity, "[TOMBSTONE] tombstone visual removed") or removedVisual
		end
	end

	local dummyEntIndex = self.tombstone_dummy_entindex
	if dummyEntIndex ~= nil then
		local dummyEntity = EntIndexToHScript(dummyEntIndex)
		if IsValidEntityHandle(dummyEntity) then
			removedVisual = RemoveEntitySafe(dummyEntity, "[TOMBSTONE] tombstone visual removed") or removedVisual
		end
	end

	if self.tombstone_thinker_entindex ~= nil then
		local thinkerEntity = EntIndexToHScript(self.tombstone_thinker_entindex)
		if IsValidEntityHandle(thinkerEntity) then
			RemoveEntitySafe(thinkerEntity, "[TOMBSTONE] tombstone visual removed")
			removedVisual = true
		end
	end

	if self.tombstone_particle_id ~= nil then
		if RemoveParticleSafe(self.tombstone_particle_id) then
			print("[TOMBSTONE] tombstone visual removed")
			removedVisual = true
		end
		self.tombstone_particle_id = nil
	end

	removedItem = RemoveEntitySafe(self, "[TOMBSTONE] tombstone item removed")

	if not removedContainer then
		print("[TOMBSTONE] tombstone container removed")
	end

	if not removedVisual then
		print("[TOMBSTONE] tombstone visual removed")
	end

	if not removedItem then
		print("[TOMBSTONE] respawn failed, tombstone preserved")
	end
end
