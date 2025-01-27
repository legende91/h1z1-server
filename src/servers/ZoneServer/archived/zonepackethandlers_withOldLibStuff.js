// ======================================================================
//
//   GNU GENERAL PUBLIC LICENSE
//   Version 3, 29 June 2007
//   copyright (c) 2021 Quentin Gruber
//
//   https://github.com/QuentinGruber/h1z1-server
//   https://www.npmjs.com/package/h1z1-server
//
//   Based on https://github.com/psemu/soe-network
// ======================================================================

const Jenkins = require("hash-jenkins");
const fs = require("fs");
const _ = require("lodash");
const debug = require("debug")("zonepacketHandlers");
let weatherTemplates = require("../../../data/weather.json");
import { Int64String } from "../../utils/utils";

const packetHandlers = {
  ClientIsReady: function (server, client, packet) {
    /* Still disable but the packet schema seems to work well
        server.sendData(client, "ClientBeginZoning", {
          unknownByte1: 0,
          zoneName: "Z1",
          zoneType: 4,
          position: [1, 2, 3, 1],
          rotation: [4, 5, 6, 1],

          skyData: {
            unknownDword1: 0,
            name: "sky",
            unknownDword2: 0,
            unknownDword3: 0,
            fogDensity: 0,
            fogGradient: 0,
            fogFloor: 0,
            unknownDword7: 0,
            rain: 0,
            temp: 0,
            skyColor: 0,
            cloudWeight0: 0,
            cloudWeight1: 0,
            cloudWeight2: 0,
            cloudWeight3: 0,
            sunAxisX: 0,
            sunAxisY: 0,
            sunAxisZ: 0,
            unknownDword18: 0,
            unknownDword19: 0,
            unknownDword20: 0,
            wind: 0,
            unknownDword22: 0,
            unknownDword23: 0,
            unknownDword24: 0,
            unknownDword25: 0,
            unknownDword26: 0,
            unknownArray: _.fill(Array(50), {
              unknownDword1: 0,
              unknownDword2: 0,
              unknownDword3: 0,
              unknownDword4: 0,
              unknownDword5: 0,
              unknownDword6: 0,
              unknownDword7: 0,
            }),
          },
          unknownByte2: 0,
          zoneId1: 3168227224,
          zoneId2: 3168227224,
          nameId: 130,
          unknownDword10: 0,
          unknownBoolean1: true,
          unknownBoolean2: true,
        });*/

    server.sendData(client, "QuickChat.SendData", { commands: [] });

    server.sendData(client, "ClientUpdate.DoneSendingPreloadCharacters", {
      unknownBoolean1: 1,
    });

    server.sendData(client, "ClientUpdate.UpdateStat", { stats: [] });

    /*
        server.sendRawData(
          client,
          fs.readFileSync(`${__dirname}/data/zone/ActivityManagerProfileList.dat`)
        );
        */
    server.sendData(client, "Operation.ClientClearMissions", {});

    server.sendData(client, "ZoneSetting.Data", {
      settings: [
        {
          hash: Jenkins.oaat("zonesetting.deploy.on.login".toUpperCase()),
          value: 1,
          settingType: 2,
          unknown1: 0,
          unknown2: 0,
        },
        {
          hash: Jenkins.oaat("zonesetting.no.acquisition.timers".toUpperCase()),
          value: 1,
          settingType: 2,
          unknown1: 0,
          unknown2: 0,
        },
        {
          hash: Jenkins.oaat("zonesetting.XpMultiplier".toUpperCase()),
          value: 1,
          settingType: 1,
          unknown1: 0,
          unknown2: 0,
        },
        {
          hash: Jenkins.oaat("zonesetting.disabletrialitems".toUpperCase()),
          value: 1,
          settingType: 2,
          unknown1: 0,
          unknown2: 0,
        },
        {
          hash: Jenkins.oaat("zonesetting.isvrzone".toUpperCase()),
          value: 0,
          settingType: 2,
          unknown1: 0,
          unknown2: 0,
        },
        {
          hash: Jenkins.oaat("zonesetting.no.resource.costs".toUpperCase()),
          value: 1,
          settingType: 2,
          unknown1: 0,
          unknown2: 0,
        },
      ],
    });

    server.sendData(client, "PlayerUpdate.CharacterStateDelta", {
      guid1: client.character.guid,
      guid2: "0x0000000000000000",
      guid3: "0x0000000040000000",
      guid4: "0x0000000000000000",
      gameTime: (server.getServerTime() & 0xffffffff) >>> 0,
    });
    server.sendGameTimeSync(client);
    /*
        server.sendRawData(
          client,
          fs.readFileSync(
            `${__dirname}/data/zone/CommandEnableCompositeEffects.dat`
          )
        );
        server.sendRawData(
          client,
          fs.readFileSync(
            `${__dirname}/data/zone/ReferenceData.ItemClassDefinitions.dat`
          )
        );
        server.sendRawData(
          client,
          fs.readFileSync(
            `${__dirname}/data/zone/ReferenceData.ItemCategoryDefinitions.dat`
          )
        );
        server.sendRawData(
          client,
          fs.readFileSync(
            `${__dirname}/data/zone/ReferenceData.ClientProfileData.dat`
          )
        );
        server.sendRawData(
          client,
          fs.readFileSync(
            `${__dirname}/data/zone/ReferenceData.ProjectileDefinitions.dat`
          )
        );
        server.sendRawData(
          client,
          fs.readFileSync(`${__dirname}/data/zone/FacilityReferenceData.dat`)
        );
        server.sendRawData(
          client,
          fs.readFileSync(
            `${__dirname}/data/zone/ItemsLoadItemRentalDefinitionManager.dat`
          )
        );
        server.sendRawData(
          client,
          fs.readFileSync(`${__dirname}/data/zone/AbilityAddAbilityDefinition.dat`)
        );
        server.sendRawData(
          client,
          fs.readFileSync(
            `${__dirname}/data/zone/AbilitiesSetAbilityActivationManager.dat`
          )
        );
        */
    client.character.currentLoadoutId = 3;
    server.sendData(client, "Loadout.SetCurrentLoadout", {
      guid: client.character.guid,
      loadoutId: client.character.currentLoadoutId,
    });

    /*
        server.sendRawData(
          client,
          fs.readFileSync(
            `${__dirname}/data/zone/PointOfInterestDefinitionReply.dat`
          )
        );
        */
    server.sendData(client, "ZoneDoneSendingInitialData", {});

    const commands = [
      "hax",
      "ammo",
      "weaponstat",
      "loadout",
      "npc",
      "model",
      "stat",
      "location",
      "serverinfo",
      "spawninfo",
      "help",
    ];

    commands.forEach((command) => {
      server.sendData(client, "Command.AddWorldCommand", {
        command: command,
      });
    });

    /* temp workaround */
    server.sendData(client, "ClientUpdate.ModifyMovementSpeed", {
      speed: 11.0,
    });

    server.sendChatText(client, "Welcome to H1emu ! :D", true);
  },
  Security: function (server, client, packet) {
    debug(packet);
  },
  "Command.FreeInteractionNpc": function (server, client, packet) {
    debug("FreeInteractionNpc");
    server.sendData(client, "Command.FreeInteractionNpc", {});
  },
  "Collision.Damage": function (server, client, packet) {
    debug("Collision.Damage");
    debug(packet);
  },
  "LobbyGameDefinition.DefinitionsRequest": function (server, client, packet) {
    server.sendData(client, "LobbyGameDefinition.DefinitionsResponse", {
      definitionsData: { data: "" },
    });
  },
  "PlayerUpdate.EndCharacterAccess": function (server, client, packet) {
    debug("EndCharacterAccess");
    debug(packet);
    server.sendData(client, "PlayerUpdate.BeginCharacterAccess", {
      guid: client.character.guid,
    });
  },
  KeepAlive: function (server, client, packet) {
    server.sendData(client, "KeepAlive", {
      gameTime: packet.data.gameTime,
    });
  },
  "AdminCommand.RunSpeed": function (server, client, packet) {
    server.sendData(client, "AdminCommand.RunSpeed", {
      runSpeed: packet.data.runSpeed,
    });
  },
  ClientLog: function (server, client, packet) {
    debug(packet);
  },
  "WallOfData.UIEvent": function (server, client, packet) {
    debug("UIEvent");
  },
  SetLocale: function (server, client, packet) {
    debug("Do nothing");
  },
  GetContinentBattleInfo: function (server, client, packet) {
    server.sendData(client, "ContinentBattleInfo", {
      zones: [
        {
          id: 1,
          nameId: 1,
          descriptionId: 1,
          population: [],
          regionPercent: [],
          populationBuff: [],
          populationTargetPercent: [],
          name: "Z1", // could use this field to load a specific TileInfo
          hexSize: 100,
          isProductionZone: 1,
        },
      ],
    });
  },
  "Chat.Chat": function (server, client, packet) {
    const { channel, message } = packet.data;
    server.sendChat(client, message, channel);
  },
  "Loadout.SelectSlot": function (server, client, packet) {
    if (client.character.currentLoadout) {
      const loadout = client.character.currentLoadout,
        loadoutSlotId = packet.data.loadoutSlotId;
      client.character.currentLoadoutSlot = packet.data.loadoutSlotId;
      const loadoutSlots = loadout.loadoutSlots;
      for (let i = 0; i < loadoutSlots.length; i++) {
        if (loadoutSlots[i].loadoutSlotId == loadoutSlotId) {
          const itemLineId =
            loadoutSlots[i].loadoutSlotData.loadoutSlotItem.itemLineId;
          server
            .data("item_line_members")
            .findOne(
              { itemLineId: itemLineId, itemLineIndex: 0 },
              function (err, itemLineMember) {
                const itemId = itemLineMember.itemId;
                const inventoryItems = client.character.inventory.items;
                for (let j = 0; j < inventoryItems.length; j++) {
                  if (inventoryItems[j].itemData.baseItem.itemId == itemId) {
                    client.character.currentLoadoutSlotItem =
                      inventoryItems[j].itemData;
                    break;
                  }
                }
              }
            );
          break;
        }
      }
    }
  },
  ClientInitializationDetails: function (server, client, packet) {
    // just in case
    if (packet.data.unknownDword1) {
      debug("ClientInitializationDetails : ", packet.data.unknownDword1);
    }
  },
  ClientLogout: function (server, client, packet) {
    debug("ClientLogout");
    server._gatewayServer._soeServer.deleteClient(client);
  },
  GameTimeSync: function (server, client, packet) {
    server.sendData(client, "GameTimeSync", {
      time: Int64String(server.getGameTime()),
      cycleSpeed: 12,
      unknownBoolean1: false,
    });
  },
  Synchronization: function (server, client, packet) {
    server.sendData(client, "Synchronization", {
      time1: packet.data.time1,
      time2: packet.data.time2,
      clientTime: packet.data.clientTime,
      serverTime: Int64String(server.getServerTime()),
      serverTime2: Int64String(server.getServerTime()),
      time3: packet.data.clientTime + 2,
    });
  },
  "Command.ExecuteCommand": function (server, client, packet) {
    const args = packet.data.arguments.split(" ");

    switch (packet.data.commandHash) {
      case 2371122039: // /serverinfo
        if (args[0] === "mem") {
          const used = process.memoryUsage().heapUsed / 1024 / 1024;
          server.sendChatText(
            client,
            `Used memory ${Math.round(used * 100) / 100} MB`
          );
          break;
        } else {
          const {
            _clients: clients,
            _characters: characters,
            _npcs: npcs,
          } = server;
          const serverVersion = require("../../../package.json").version;
          server.sendChatText(client, `h1z1-server V${serverVersion}`, true);
          server.sendChatText(client, `Connected clients : ${_.size(clients)}`);
          server.sendChatText(client, `characters : ${_.size(characters)}`);
          server.sendChatText(client, `npcs : ${_.size(npcs)}`);
          break;
        }
      case 1757604914: // /spawninfo
        server.sendChatText(
          client,
          `You spawned at "${client.character.spawnLocation}"`,
          true
        );
        break;
      case Jenkins.oaat("HELP"):
      case 3575372649: // /help
        const haxCommandList = [
          "/hax run",
          "/hax sonic",
          "/hax observer",
          "/hax saveCurrentWeather",
          "/hax weather",
          "/hax randomWeather",
          "/hax forceDay",
          "/hax forceNight",
          "/hax realTime",
          "/hax spawnNpcModel",
        ];
        const commandList = [
          "/help",
          "/loc",
          "/spawninfo",
          "/serverinfo",
          "/player_air_control",
          "/player_fall_through_world_test",
        ];
        server.sendChatText(client, `Commands list:`);
        _.concat(commandList, haxCommandList).forEach((command) => {
          server.sendChatText(client, `${command}`);
        });
        break;
      case Jenkins.oaat("LOCATION"):
      case 3270589520: // /loc
        const { position, rotation } = client.character.state;
        server.sendChatText(
          client,
          `position: ${position[0]},${position[1]},${position[2]}`
        );
        server.sendChatText(
          client,
          `rotation: ${rotation[0]},${rotation[1]},${rotation[2]}`
        );
        break;
      case Jenkins.oaat("STAT"):
        if (args[0] && args[1]) {
          server
            .data("string_hash_to_value")
            .findOne({ string: "StatId." + args[0] }, function (err, statId) {
              if (err || !statId) {
                server.sendChatText(client, "No such stat string");
                return;
              }
              server
                .data("character_stats")
                .findOne({ id: statId.value }, function (err, stat) {
                  if (err || !statId) {
                    server.sendChatText(client, "No such stat");
                    return;
                  }
                  const value = parseFloat(args[1]);
                  server.sendChatText(
                    client,
                    "Setting StatId." + args[0] + " = " + value
                  );
                  server.sendData(client, "ClientUpdate.UpdateStat", {
                    stats: [
                      {
                        statId: statId.value,
                        statValue: {
                          type: 1,
                          value: {
                            baseValue: value,
                            modifierValue: 0,
                          },
                        },
                      },
                    ],
                  });
                });
            });
        }
        break;
      case Jenkins.oaat("AMMO"):
        if (args[0]) {
          const n = parseInt(args[0]);
          server.sendChatText(client, "Adding " + n + " ammo");
          var weaponItem = client.character.currentLoadoutSlotItem;
          server.sendWeaponPacket(client, "Weapon.AddAmmo", {
            guid: weaponItem.baseItem.unknownGuid1,
            unknownByte1: 0,
            unknownDword1: n,
            unknownBoolean1: false,
            unknownBoolean2: false,
          });
        }
        break;
      case Jenkins.oaat("NPC"):
        if (args[0]) {
          const npcId = parseInt(args[0]);
          const npc_data = require("../../../data/npcs.json");
          npc_data.findOne({ id: npcId }, function (err, npc) {
            server.sendChatText(client, "Spawning NPC " + npc.id);

            const guid = server.generateGuid(),
              transientId = server.getTransientId(client, guid);

            server.sendData(client, "PlayerUpdate.AddLightweightNpc", {
              guid: guid,
              transientId: transientId,
              unknownString0: "",
              nameId: npc.name_id > 0 ? npc.name_id : 0,
              unknownDword2: 242919,
              unknownDword3: 310060,
              unknownByte1: 1,
              modelId: npc.model_id || 0,
              scale: [1, 1, 1, 1],
              unknownString1: "",
              unknownString2: "",
              unknownDword5: 0,
              unknownDword6: 0,
              position: client.character.state.position,
              unknownVector1: [0, -0.7071066498756409, 0, 0.70710688829422],
              rotation: [-1.570796012878418, 0, 0, 0],
              unknownDword7: 0,
              unknownFloat1: 0,
              unknownString3: "",
              unknownString4: "",
              unknownString5: "",
              vehicleId: 0,
              unknownDword9: 0,
              npcDefinitionId: npc.id || 0,
              unknownByte2: 0,
              profileId: npc.profile_id || 0,
              unknownBoolean1: true,
              unknownData1: {
                unknownByte1: 16,
                unknownByte2: 10,
                unknownByte3: 0,
              },
              unknownByte6: 0,
              unknownDword11: 0,
              unknownGuid1: "0x0000000000000000",
              unknownData2: {
                unknownGuid1: "0x0000000000000000",
              },
              unknownDword12: 0,
              unknownDword13: 0,
              unknownDword14: 0,
              unknownByte7: 0,
              unknownArray1: [],
            });
          });
        }
        break;
      case Jenkins.oaat("MODEL"):
        if (args[0]) {
          const modelId = parseInt(args[0]);

          server.sendChatText(client, "Spawning model " + modelId);

          const guid = server.generateGuid(),
            transientId = server.getTransientId(client, guid);

          server.sendData(client, "PlayerUpdate.AddLightweightNpc", {
            guid: guid,
            transientId: transientId,
            unknownString0: "",
            nameId: 0,
            unknownDword2: 242919,
            unknownDword3: 310060,
            unknownByte1: 1,
            modelId: modelId,
            scale: [1, 1, 1, 1],
            unknownString1: "",
            unknownString2: "",
            unknownDword5: 0,
            unknownDword6: 0,
            position: client.character.state.position,
            unknownVector1: [0, -0.7071066498756409, 0, 0.70710688829422],
            rotation: [-1.570796012878418, 0, 0, 0],
            unknownDword7: 0,
            unknownFloat1: 0,
            unknownString3: "",
            unknownString4: "",
            unknownString5: "",
            vehicleId: 0,
            unknownDword9: 0,
            npcDefinitionId: 9999,
            unknownByte2: 0,
            profileId: 9,
            unknownBoolean1: true,
            unknownData1: {
              unknownByte1: 16,
              unknownByte2: 10,
              unknownByte3: 0,
            },
            unknownByte6: 0,
            unknownDword11: 0,
            unknownGuid1: "0x0000000000000000",
            unknownData2: {
              unknownGuid1: "0x0000000000000000",
            },
            unknownDword12: 0,
            unknownDword13: 0,
            unknownDword14: 0,
            unknownByte7: 0,
            unknownArray1: [],
          });
        }
        break;
      case Jenkins.oaat("WEAPONSTAT"):
        if (client.character.currentLoadoutSlotItem) {
          var weaponItem = client.character.currentLoadoutSlotItem;
          server
            .data("client_item_datasheet_data")
            .findOne(
              { itemId: weaponItem.baseItem.itemId },
              function (err, clientItem) {
                const weaponId = clientItem.weaponId;

                server
                  .data("weapon_definitions")
                  .findOne({ weaponId: weaponId }, function (err, weapon) {
                    server
                      .data("fire_groups")
                      .findOne(
                        { fireGroupId: weapon.fireGroups[0] },
                        function (err, fireGroup) {
                          const fireModes = fireGroup.fireModes;

                          switch (args[0]) {
                            case "FireMode.DefaultZoom":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.DefaultZoom = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  const weaponPacket = {
                                    statData: [
                                      {
                                        guid: weaponItem.baseItem.unknownGuid1,
                                        unknownBoolean1: false,
                                        statUpdates: [
                                          {
                                            statCategory: 3,
                                            statUpdateData: {
                                              statOwnerId: fireModes[i],
                                              statData: {
                                                statId: 3834666950,
                                                statValue: {
                                                  type: 1,
                                                  value: {
                                                    baseValue: parseFloat(
                                                      args[1]
                                                    ),
                                                    modifierValue: 0,
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    ],
                                  };
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    weaponPacket
                                  );
                                }
                              }
                              break;
                            case "PelletsPerShot":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting PelletsPerShot = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 61541959,
                                                  statValue: {
                                                    type: 0,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.RecoilMaxXModifier":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.RecoilMaxXModifier = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 834031893,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.RecoilMinXModifier":
                              server.sendChatText(
                                client,
                                "Setting FireMode.RecoilMinXModifier = " +
                                  parseFloat(args[1])
                              );
                              if (args[1]) {
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 3852947489,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.RecoilAngleMin":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.RecoilAngleMin = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 1282859301,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.RecoilAngleMax":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.RecoilAngleMax = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 1732279640,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.CofRecoil":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.CofRecoil = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 3679927309,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.CofMinScalar":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.CofMinScalar = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 2407137070,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.CofScalar":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.CofScalar = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 1567043769,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.RecoilMagnitudeModifier":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.RecoilMagnitudeModifier = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 2597357303,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.CofScalarMoving":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.CofScalarMoving = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 4118721662,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireGroup.ProjectileSpeedMultiplier":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireGroup.ProjectileSpeedMultiplier = " +
                                    parseFloat(args[1])
                                );
                                server.sendWeaponPacket(
                                  client,
                                  "Weapon.StatUpdate",
                                  {
                                    statData: [
                                      {
                                        guid: weaponItem.baseItem.unknownGuid1,
                                        unknownBoolean1: false,
                                        statUpdates: [
                                          {
                                            statCategory: 2,
                                            statUpdateData: {
                                              statOwnerId:
                                                fireGroup.fireGroupId,
                                              statData: {
                                                statId: 1673453061,
                                                statValue: {
                                                  type: 1,
                                                  value: {
                                                    baseValue: parseFloat(
                                                      args[1]
                                                    ),
                                                    modifierValue: 0,
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    ],
                                  }
                                );
                              }
                              break;
                            case "FireMode.ProjectileOverride":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.ProjectileOverride = " +
                                    parseInt(args[1], 10)
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 2846895694,
                                                  statValue: {
                                                    type: 0,
                                                    value: {
                                                      baseValue: parseInt(
                                                        args[1],
                                                        10
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.RecoilHorizontalTolerance":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.RecoilHorizontalTolerance = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 3881570778,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.RecoilHorizontalMin":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.RecoilHorizontalMin = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 3397642193,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireMode.RecoilHorizontalMax":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireMode.RecoilHorizontalMax = " +
                                    parseFloat(args[1])
                                );
                                for (var i = 0; i < fireModes.length; i++) {
                                  server.sendWeaponPacket(
                                    client,
                                    "Weapon.StatUpdate",
                                    {
                                      statData: [
                                        {
                                          guid: weaponItem.baseItem
                                            .unknownGuid1,
                                          unknownBoolean1: false,
                                          statUpdates: [
                                            {
                                              statCategory: 3,
                                              statUpdateData: {
                                                statOwnerId: fireModes[i],
                                                statData: {
                                                  statId: 2306315094,
                                                  statValue: {
                                                    type: 1,
                                                    value: {
                                                      baseValue: parseFloat(
                                                        args[1]
                                                      ),
                                                      modifierValue: 0,
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    }
                                  );
                                }
                              }
                              break;
                            case "FireGroup.ProjectileSpeedOverride":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting FireGroup.ProjectileSpeedOverride = " +
                                    parseFloat(args[1])
                                );
                                server.sendWeaponPacket(
                                  client,
                                  "Weapon.StatUpdate",
                                  {
                                    statData: [
                                      {
                                        guid: weaponItem.baseItem.unknownGuid1,
                                        unknownBoolean1: false,
                                        statUpdates: [
                                          {
                                            statCategory: 2,
                                            statUpdateData: {
                                              statOwnerId:
                                                fireGroup.fireGroupId,
                                              statData: {
                                                statId: 3301973150,
                                                statValue: {
                                                  type: 1,
                                                  value: {
                                                    baseValue: parseFloat(
                                                      args[1]
                                                    ),
                                                    modifierValue: 0,
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    ],
                                  }
                                );
                              }
                              break;
                            case "AmmoSlot.ClipSize":
                              if (args[1]) {
                                server.sendChatText(
                                  client,
                                  "Setting AmmoSlot.ClipSize = " +
                                    parseInt(args[1], 10)
                                );
                                server.sendWeaponPacket(
                                  client,
                                  "Weapon.StatUpdate",
                                  {
                                    statData: [
                                      {
                                        guid: weaponItem.baseItem.unknownGuid1,
                                        unknownBoolean1: false,
                                        statUpdates: [
                                          {
                                            statCategory: 4,
                                            statUpdateData: {
                                              statOwnerId: 0,
                                              statData: {
                                                statId: 3729010617,
                                                statValue: {
                                                  type: 0,
                                                  value: {
                                                    baseValue: parseInt(
                                                      args[1],
                                                      10
                                                    ),
                                                    modifierValue: 0,
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    ],
                                  }
                                );
                              }
                              break;
                          }
                        }
                      );
                  });
              }
            );
        }
        break;
      case Jenkins.oaat("LOADOUT"):
        const loadoutId = parseInt(args[0]),
          loadoutTab = parseInt(args[1]);

        if (!isNaN(loadoutId)) {
          server.setCharacterLoadout(client, loadoutId, loadoutTab);
        }
        break;
      case Jenkins.oaat("HAX"):
        switch (args[0]) {
          case "forceNight":
            server.forceTime(1615062252322);
            server.sendChatText(
              client,
              "Will force Night time on next sync...",
              true
            );
            break;
          case "forceDay":
            server.forceTime(971172000000);
            server.sendChatText(
              client,
              "Will force Day time on next sync...",
              true
            );
            break;
          case "realTime":
            server.removeForcedTime();
            server.sendChatText(
              client,
              "Game time is now based on real time",
              true
            );
            break;
          case "spawnNpcModel":
            server.sendChatText(
              client,
              "[info] this command is kinda broken try it multiple time",
              1
            );
            const guid = server.generateGuid();
            const transientId = server.getTransientId(client, guid);
            if (!args[1]) {
              server.sendChatText(
                client,
                "[ERROR] You need to specify a model id !"
              );
              return;
            }
            const choosenModelId = Number(args[1]);
            const characterId = server.generateGuid();
            const npc = {
              characterId: characterId,
              guid: guid,
              transientId: transientId,
              modelId: choosenModelId,
              position: client.character.state.position,
              characterFirstName: `Model ${choosenModelId}`,
            };
            server.sendData(client, "PlayerUpdate.AddLightweightPc", npc);
            server._npcs[characterId] = npc; // save npc
            break;
          case "sonic":
            server.sendData(client, "ClientGameSettings", {
              unknownQword1: "0x0000000000000000",
              unknownBoolean1: true,
              timescale: 3.0,
              unknownQword2: "0x0000000000000000",
              unknownFloat1: 0.0,
              unknownFloat2: 12.0,
              unknownFloat3: 110.0,
            });
            server.sendData(client, "Command.RunSpeed", {
              runSpeed: -100,
            });
            server.sendChatText(client, "Welcome MR.Hedgehog");
            break;
          case "observer":
            server.sendData(client, "PlayerUpdate.RemovePlayer", {
              characterId: client.character.characterId,
            });
            delete server._characters[client.character.characterId];
            debug(server._characters);
            server.sendChatText(client, "Delete player, back in observer mode");
            break;
          case "shutdown":
            server.sendData(client, "WorldShutdownNotice", {
              timeBeforeShutdown: "0x00000000000001",
              message: "where is this message displayed lmao ?",
            });
            break;
          case "weather":
            const weatherTemplate = weatherTemplates[args[1]];
            if (!args[1]) {
              server.sendChatText(
                client,
                "Please define a weather template to use (data/weather.json)"
              );
            } else if (weatherTemplate) {
              server.changeWeather(client, weatherTemplate);
              server.sendChatText(
                client,
                `Use "${args[1]}" as a weather template`
              );
            } else {
              server.sendChatText(
                client,
                `"${args[1]}" isn't a weather template`
              );
            }
            break;
          case "saveCurrentWeather":
            if (!args[1]) {
              server.sendChatText(
                client,
                "Please define a name for your weather template '/hax saveCurrentWeather {name}'"
              );
            } else if (weatherTemplates[args[1]]) {
              server.sendChatText(client, `"${args[1]}" already exist !`);
            } else {
              const {
                gameClient: { currentWeather },
              } = client;
              if (currentWeather) {
                weatherTemplates[args[1]] = currentWeather;
                fs.writeFileSync(
                  `${__dirname}/../../../data/weather.json`,
                  JSON.stringify(weatherTemplates)
                );
                delete require.cache[
                  require.resolve("../../../data/weather.json")
                ];
                weatherTemplates = require("../../../data/weather.json");
                server.sendChatText(client, `template "${args[1]}" saved !`);
              } else {
                server.sendChatText(client, `Saving current weather failed...`);
                server.sendChatText(client, `plz report this`);
              }
            }
            break;
          case "testpacket":
            const packetName = args[1];
            server.sendData(client, packetName, {});
            break;
          case "run":
            const speedValue = args[1];
            let speed;
            if (speedValue > 10) {
              server.sendChatText(
                client,
                "To avoid security issue speed > 10 is set to 15",
                true
              );
              speed = 15;
            } else {
              speed = speedValue;
            }
            server.sendChatText(client, "Setting run speed: " + speed, true);
            server.sendData(client, "Command.RunSpeed", {
              runSpeed: speed,
            });
            break;
          case "hell":
            server.sendChatText(
              client,
              "[DEPRECATED] use '/hax randomWeather' instead",
              true
            );
            break;
          case "randomWeather":
            debug("Randomized weather");
            server.sendChatText(client, `Randomized weather`);

            function rnd_number() {
              return Number((Math.random() * 100).toFixed(0));
            }

            const rnd_weather = {
              name: "sky",
              unknownDword1: rnd_number(),
              unknownDword2: rnd_number(),
              unknownDword3: rnd_number(),
              unknownDword4: rnd_number(),
              fogDensity: rnd_number(), // fog intensity
              fogGradient: rnd_number(),
              fogFloor: rnd_number(),
              unknownDword7: rnd_number(),
              rain: rnd_number(),
              temp: rnd_number(), // 0 : snow map , 40+ : spring map
              skyColor: rnd_number(),
              cloudWeight0: rnd_number(),
              cloudWeight1: rnd_number(),
              cloudWeight2: rnd_number(),
              cloudWeight3: rnd_number(),
              sunAxisX: rnd_number(),
              sunAxisY: rnd_number(),
              sunAxisZ: rnd_number(), // night when 100
              unknownDword18: rnd_number(),
              unknownDword19: rnd_number(),
              unknownDword20: rnd_number(),
              wind: rnd_number(),
              unknownDword22: rnd_number(),
              unknownDword23: rnd_number(),
              unknownDword24: rnd_number(),
              unknownArray: _.fill(Array(50), {
                unknownDword1: 0,
                unknownDword2: 0,
                unknownDword3: 0,
                unknownDword4: 0,
                unknownDword5: 0,
                unknownDword6: 0,
                unknownDword7: 0,
              }),
            };
            debug(JSON.stringify(rnd_weather));
            server.changeWeather(client, rnd_weather);
            break;
          case "reloadPackets":
            if (args[1]) {
              server.reloadPackets(client, args[1]);
            } else {
              server.reloadPackets(client);
            }
            break;
          case "variable":
            server.sendData(client, "DefinitionFilter.SetDefinitionVariable", {
              unknownDword1: 4280275237,
              unknownQword1: "0x000000007536c930",
              unknownData1: {
                unknownFloat1: 5,
                unknownFloat2: 0,
              },
            });
            break;
          case "vehicleterminal":
            const guid = server.server.generateGuid();
            var transientId = server.getTransientId(client, guid);
            server.sendData(client, "PlayerUpdate.AddLightweightNpc", {
              guid: guid,
              transientId: transientId,
              unknownString0: "",
              nameId: 557829,
              unknownDword2: 242919,
              unknownDword3: 310060,
              unknownByte1: 1,
              modelId: 217,
              scale: [1, 1, 1, 1],
              unknownString1: "",
              unknownString2: "",
              unknownDword5: 0,
              unknownDword6: 0,
              position: client.character.state.position,
              unknownVector1: [0, -0.7071066498756409, 0, 0.70710688829422],
              rotation: [-1.570796012878418, 0, 0, 0],
              unknownDword7: 0,
              unknownFloat1: 0,
              unknownString3: "",
              unknownString4: "",
              unknownString5: "",
              vehicleId: 0,
              unknownDword9: 0,
              npcDefinitionId: 6069,
              unknownByte2: 0,
              profileId: 46,
              unknownBoolean1: true,
              unknownData1: {
                unknownByte1: 16,
                unknownByte2: 10,
                unknownByte3: 0,
              },
              unknownByte6: 0,
              unknownDword11: 0,
              unknownGuid1: "0x0000000000000000",
              unknownData2: {
                unknownGuid1: "0x0000000000000000",
              },
              unknownDword12: 0,
              unknownDword13: 0,
              unknownDword14: 0,
              unknownByte7: 0,
              unknownArray1: [],
            });
            server.sendData(client, "PlayerUpdate.LightweightToFullNpc", {
              unknownUint1: 4121,
              unknownDword1: 16777215,
              unknownDword2: 13951728,
              unknownDword3: 1,
              unknownArray1: [],
              unknownString1: "",
              unknownString2: "",
              unknownDword4: 0,
              unknownFloat1: 0,
              unknownDword5: 0,
              unknownVector1: [0, 0, 0],
              unknownVector2: [0, -1, 0],
              unknownFloat2: 0,
              unknownDword6: 0,
              unknownDword7: 0,
              unknownDword8: 0,
              unknownArray2: [],
              unknownData1: {
                unknownDword1: 0,
                unknownString1: "",
                unknownString2: "",
                unknownDword2: 0,
                unknownString3: "",
              },
              unknownVector4: [0, 0, 0, 0],
              unknownDword9: 0,
              unknownDword10: 0,
              unknownDword11: 0,
              unknownQword1: "0x0000000000000000",
              unknownFloat3: 3,
              targetData: {
                targetType: 0,
              },
              unknownArray3: [],
              unknownDword12: 0,
              unknownFloat4: 0,
              unknownVector5: [0, 0, 0, 0],
              unknownDword13: 0,
              unknownFloat5: 0,
              unknownFloat6: 0,
              unknownData2: {
                unknownFloat1: 0,
              },
              unknownDword14: 0,
              unknownDword15: 0,
              unknownDword16: 6,
              unknownDword17: 894,
              unknownDword18: 0,
              unknownByte1: 0,
              unknownByte2: 2,
              unknownDword19: 0,
              unknownDword20: 0,
              unknownDword21: 4294967295,
              resources: [
                {
                  resourceData: {
                    resourceId: 107,
                    resourceType: 1,
                  },
                  unknownArray1: [],
                  unknownData2: {
                    maxValue: 900,
                    initialValue: 900,
                    unknownFloat1: 0,
                    unknownFloat2: 0,
                    unknownFloat3: 0,
                    unknownDword3: 0,
                    unknownDword4: 0,
                    unknownDword5: 0,
                  },
                  unknownByte1: 0,
                  unknownByte2: 0,
                  unknownTime1: "0x0000000000000000",
                  unknownTime2: "0x0000000000000000",
                  unknownTime3: "0x0000000000000000",
                },
              ],
              unknownGuid1: "0x0000000000000000",
              unknownData3: {
                unknownDword1: 0,
              },
              unknownDword22: 0,
              unknownBytes1: [0, 0, 0, 0],
              unknownBytes2: [0, 0, 0, 0, 0, 0, 0, 0],
            });
            break;
        }
        break;
      default:
        server.sendChatText(client, `Unknown command`);
        break;
    }
  },
  "Command.SetProfile": function (server, client, packet) {
    server.sendData(client, "Loadout.SetCurrentLoadout", {
      type: 2,
      unknown1: 0,
      loadoutId: 15,
      tabId: 256,
      unknown2: 1,
    });
  },
  "Command.InteractRequest": function (server, client, packet) {
    server.sendData(client, "Command.InteractionString", {
      guid: packet.data.guid,
      stringId: 5463,
      unknown4: 0,
    });
    server.sendData(client, "Command.InteractionList", {
      guid: packet.data.guid,
      unknownBoolean1: true,
      unknownArray1: [
        {
          unknownDword1: 11,
          unknownDword2: 0,
          unknownDword3: 5463,
          unknownDword4: 51,
          unknownDword5: 1,
          unknownDword6: 0,
          unknownDword7: 0,
        },
      ],
      unknownString1: "",
      unknownBoolean2: true,
      unknownArray2: [],
      unknownBoolean3: false,
    });
  },
  "Command.InteractionSelect": function (server, client, packet) {
    server.sendData(client, "Loadout.SetLoadouts", {
      type: 2,
      guid: packet.data.guid,
      unknownDword1: 1,
    });
  },
  "Vehicle.Spawn": function (server, client, packet) {
    server.sendData(client, "Vehicle.Expiration", {
      expireTime: 300000,
    });
    const guid = server.generateGuid();
    server.sendData(client, "Vehicle.Owner", {
      guid: guid,
      characterId: client.character.characterId,
      unknownDword1: 305,
      vehicleId: 1712,
      passengers: [
        {
          passengerData: {
            characterId: "0x0000000000000000",
            characterData: {
              unknownDword1: 0,
              unknownDword2: 0,
              unknownDword3: 0,
              characterName: "",
              unknownString1: "",
            },
            unknownDword1: 0,
            unknownString1: "",
          },
          unknownByte1: 0,
        },
        {
          passengerData: {
            characterId: "0x0000000000000000",
            characterData: {
              unknownDword1: 0,
              unknownDword2: 0,
              unknownDword3: 0,
              characterName: "",
              unknownString1: "",
            },
            unknownDword1: 0,
            unknownString1: "",
          },
          unknownByte1: 1,
        },
      ],
    });
    server.sendData(client, "Loadout.SetCurrentLoadout", {
      type: 2,
      unknown1: 1,
      loadoutId: 10,
      tabId: 256,
      unknown2: 1,
    });
    const position = [
      client.character.state.position[0],
      client.character.state.position[1] + 10,
      client.character.state.position[2],
    ];
    const rotation = [-1.570796012878418, 0, 0, 0];
    server.sendData(client, "PlayerUpdate.AddLightweightVehicle", {
      guid: guid,
      unknownUint1: 95,
      unknownString0: "",
      nameId: 310,
      unknownDword2: 0,
      unknownDword3: 0,
      unknownByte1: 1,
      unknownDword4: 20,
      scale: [1, 1, 1, 1],
      unknownString1: "",
      unknownString2: "",
      unknownDword5: 0,
      unknownDword6: 0,
      position: position,
      unknownVector1: [0, -0.7071066498756409, 0, 0.70710688829422],
      rotation: rotation,
      unknownDword7: 0,
      unknownFloat1: 3,
      unknownString3: "",
      unknownString4: "",
      unknownString5: "",
      unknownDword8: 4,
      unknownDword9: 0,
      unknownDword10: 305,
      unknownByte2: 2,
      profileId: 29,
      unknownBoolean1: false,
      unknownByte3: 16,
      unknownByte4: 9,
      unknownByte5: 0,
      unknownByte6: 0,
      unknownDword11: 0,
      unknownGuid1: "0x0000000000000000",
      unknownGuid2: "0x0000000000000000",
      unknownDword12: 2484,
      unknownDword13: 1528,
      unknownDword14: 0,
      unknownByte7: 0,
      unknownArray1: [],
      unknownGuid3: "0x0000000000000000",
      unknownDword15: 0,
      unknownDword16: 0,
      positionUpdate: server.createPositionUpdate(position, rotation),
      unknownString6: "",
    });
    server.sendData(client, "PlayerUpdate.SetFaction", {
      guid: guid,
      factionId: 1,
    });
    server.sendData(client, "Vehicle.SetAutoDrive", {
      guid: guid,
    });
  },
  "Vehicle.AutoMount": function (server, client, packet) {
    server.sendData(client, "Mount.MountResponse", {
      characterId: client.character.characterId,
      guid: packet.data.guid,
      unknownDword1: 0,
      unknownDword2: 1,
      unknownDword3: 1,
      unknownDword4: 0,
      characterData: {
        unknownDword1: 0,
        unknownDword2: 0,
        unknownDword3: 0,
        characterName: client.character.name,
        unknownString1: "",
      },
      tagString: "",
      unknownDword5: 19,
    });

    server.sendData(client, "PlayerUpdate.ManagedObject", {
      guid: packet.data.guid,
      guid2: "0x0000000000000000",
      characterId: client.character.characterId,
    });

    server.sendData(client, "Vehicle.Occupy", {
      guid: packet.data.guid,
      characterId: client.character.characterId,
      vehicleId: 4,
      unknownDword1: 0,
      unknownArray1: [
        {
          unknownDword1: 0,
          unknownBoolean1: true,
        },
        {
          unknownDword1: 1,
          unknownBoolean1: true,
        },
      ],
      passengers: [
        {
          passengerData: {
            characterId: client.character.characterId,
            characterData: {
              unknownDword1: 0,
              unknownDword2: 0,
              unknownDword3: 0,
              characterName: "LocalPlayer",
              unknownString1: "",
            },
            unknownDword1: 19,
            unknownString1: "SCNC",
          },
          unknownByte1: 0,
        },
        {
          passengerData: {
            characterId: "0x0000000000000000",
            characterData: {
              unknownDword1: 0,
              unknownDword2: 0,
              unknownDword3: 0,
              characterName: "",
              unknownString1: "",
            },
            unknownDword1: 0,
            unknownString1: "",
          },
          unknownByte1: 1,
        },
      ],
      unknownArray2: [
        {
          unknownQword1: "0x29e5d0ef80000003",
        },
        {
          unknownQword1: "0x29e5d0ef80000004",
        },
        {
          unknownQword1: "0x29e5d0ef80000005",
        },
        {
          unknownQword1: "0x29e5d0ef80000006",
        },
        {
          unknownQword1: "0x29e5d0ef80000007",
        },
      ],
      unknownData1: {
        unknownDword1: 10,
        unknownData1: {
          unknownDword1: 4,
          unknownByte1: 1,
        },
        unknownString1: "",
        unknownDword2: 256,
        unknownDword3: 76362,
        unknownDword4: 0,
        unknownDword5: 0,
        unknownArray3: [
          {
            unknownDword1: 1,
            unknownData1: {
              unknownDword1: 1,
              unknownData1: {
                unknownDword1: 1401,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 2,
            unknownData1: {
              unknownDword1: 2,
              unknownData1: {
                unknownDword1: 3404,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 3,
            unknownData1: {
              unknownDword1: 3,
              unknownData1: {
                unknownDword1: 0,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 4,
            unknownData1: {
              unknownDword1: 4,
              unknownData1: {
                unknownDword1: 3409,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 5,
            unknownData1: {
              unknownDword1: 5,
              unknownData1: {
                unknownDword1: 0,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 6,
            unknownData1: {
              unknownDword1: 6,
              unknownData1: {
                unknownDword1: 75436,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 7,
            unknownData1: {
              unknownDword1: 7,
              unknownData1: {
                unknownDword1: 0,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 8,
            unknownData1: {
              unknownDword1: 8,
              unknownData1: {
                unknownDword1: 0,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 9,
            unknownData1: {
              unknownDword1: 9,
              unknownData1: {
                unknownDword1: 5780,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 14,
            unknownData1: {
              unknownDword1: 14,
              unknownData1: {
                unknownDword1: 1406,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 15,
            unknownData1: {
              unknownDword1: 15,
              unknownData1: {
                unknownDword1: 0,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 16,
            unknownData1: {
              unknownDword1: 16,
              unknownData1: {
                unknownDword1: 1428,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
          {
            unknownDword1: 17,
            unknownData1: {
              unknownDword1: 17,
              unknownData1: {
                unknownDword1: 0,
                unknownByte1: 0,
                unknownArray1: [],
                unknownArray2: [],
              },
              unknownDword2: 0,
              unknownDword3: 0,
            },
          },
        ],
      },
      unknownBytes1: {
        itemData: {
          baseItem: {
            itemId: 3400,
            unknownDword2: 0,
            unknownGuid1: "0x29e5d0ef80000001",
            unknownDword3: 1,
            unknownDword4: 0,
            unknownDword5: 0,
            unknownDword6: 0,
            unknownDword7: 0,
            unknownDword8: 0,
            unknownByte1: 0,
            unknownData: {
              type: 0,
              value: {},
            },
          },
          detail: {
            unknownBoolean1: false,
            unknownArray1: [
              {
                unknownDword1: 1,
                unknownDword2: 24,
              },
            ],
            unknownArray2: [
              {
                unknownDword1: 300,
                unknownArray1: [
                  {
                    unknownByte1: 0,
                    unknownDword1: 0,
                    unknownDword2: 1410,
                    unknownDword3: 750,
                  },
                  {
                    unknownByte1: 0,
                    unknownDword1: 0,
                    unknownDword2: 1410,
                    unknownDword3: 750,
                  },
                ],
              },
            ],
            unknownByte1: 30,
            unknownByte2: 1,
            unknownDword1: 0,
            unknownByte3: 0,
            unknownFloat1: 0,
            unknownByte4: 0,
            unknownDword2: 0,
            unknownArray3: [],
            unknownArray4: [],
          },
        },
      },
    });
  },
  "AdminCommand.SpawnVehicle": function (server, client, packet) {
    const guid = server.generateGuid(),
      transientId = server.getTransientId(client, guid);

    server
      .data("vehicles")
      .findOne({ id: packet.data.vehicleId }, function (err, vehicle) {
        if (err || !vehicle) {
          server.sendChatText(client, "No such vehicle");
          return;
        }
        server
          .data("npc_vehicle_mappings")
          .findOne(
            { vehicle_id: packet.data.vehicleId },
            function (err, npcDefinitionMapping) {
              if (err || !npcDefinitionMapping) {
                server.sendChatText(client, "Vehicle has no NPC mapping");
                return;
              }
              server
                .data("npcs")
                .findOne(
                  { id: npcDefinitionMapping.npc_definition_id },
                  function (err, npc) {
                    if (err || !npc) {
                      server.sendChatText(
                        client,
                        "NPC definition " +
                          npcDefinitionMapping.npc_definition_id +
                          " not found"
                      );
                      return;
                    }
                    const nameId = vehicle.name_id > 0 ? vehicle.name_id : 0,
                      modelId = npc.model_id;
                    const vehicleData = {
                      npcData: {
                        guid: guid,
                        transientId: transientId,
                        unknownString0: "",
                        nameId: nameId,
                        unknownDword2: 0,
                        unknownDword3: 0,
                        unknownByte1: 1,
                        modelId: modelId,
                        scale: [1, 1, 1, 1],
                        unknownString1: "",
                        unknownString2: "",
                        unknownDword5: 0,
                        unknownDword6: 0,
                        position: packet.data.position,
                        unknownVector1: [
                          0, -0.7071066498756409, 0, 0.70710688829422,
                        ],
                        rotation: [packet.data.heading, 0, 0, 0],
                        unknownDword7: 0,
                        unknownFloat1: 3,
                        unknownString3: "",
                        unknownString4: "",
                        unknownString5: "",
                        vehicleId: packet.data.vehicleId,
                        unknownDword9: 0,
                        npcDefinitionId: npc.id,
                        unknownByte2: 2,
                        profileId: npc.profile_id,
                        unknownBoolean1: false,
                        unknownData1: {
                          unknownByte1: 16,
                          unknownByte2: 9,
                          unknownByte3: 0,
                        },
                        unknownByte6: 0,
                        unknownDword11: 0,
                        unknownGuid1: "0x0000000000000000",
                        unknownData2: {
                          unknownGuid1: "0x0000000000000000",
                        },
                        unknownDword12: 2484,
                        unknownDword13: 1528,
                        unknownDword14: 0,
                        unknownByte7: 0,
                        unknownArray1: [],
                      },
                      unknownGuid1: "0x0000000000000000",
                      unknownDword1: 0,
                      unknownDword2: 0,
                      positionUpdate: server.createPositionUpdate(
                        packet.data.position,
                        [packet.data.heading, 0, 0, 0]
                      ),
                      unknownString1: "",
                    };
                    console.log(JSON.stringify(vehicleData, null, 2));

                    server.sendData(
                      client,
                      "PlayerUpdate.AddLightweightVehicle",
                      vehicleData
                    );
                    server.sendData(client, "PlayerUpdate.SetFaction", {
                      guid: guid,
                      factionId:
                        packet.data.factionId || client.character.factionId,
                    });

                    server.sendData(client, "Vehicle.Owner", {
                      guid: guid,
                      characterId: client.character.characterId,
                      unknownDword1: 305,
                      vehicleId: packet.data.vehicleId,
                      passengers: [
                        {
                          passengerData: {
                            characterId: "0x0000000000000000",
                            characterData: {
                              unknownDword1: 0,
                              unknownDword2: 0,
                              unknownDword3: 0,
                              characterName: "",
                              unknownString1: "",
                            },
                            unknownDword1: 0,
                            unknownString1: "",
                          },
                          unknownByte1: 0,
                        },
                        {
                          passengerData: {
                            characterId: "0x0000000000000000",
                            characterData: {
                              unknownDword1: 0,
                              unknownDword2: 0,
                              unknownDword3: 0,
                              characterName: "",
                              unknownString1: "",
                            },
                            unknownDword1: 0,
                            unknownString1: "",
                          },
                          unknownByte1: 1,
                        },
                      ],
                    });

                    server.sendData(client, "Vehicle.SetAutoDrive", {
                      guid: guid,
                    });

                    server.sendData(client, "PlayerUpdate.ManagedObject", {
                      guid: guid,
                      guid2: "0x0000000000000000",
                      characterId: client.character.characterId,
                    });
                  }
                );
            }
          );
      });
  },
  "Command.InteractCancel": function (server, client, packet) {
    debug("Interaction Canceled");
  },
  "Command.StartLogoutRequest": function (server, client, packet) {
    server.sendData(client, "ClientUpdate.CompleteLogoutProcess", {});
  },
  CharacterSelectSessionRequest: function (server, client, packet) {
    server.sendData(client, "CharacterSelectSessionResponse", {
      status: 1,
      sessionId: "placeholder",
    });
  },
  "ProfileStats.GetPlayerProfileStats": function (server, client, packet) {
    server.sendData(
      client,
      "ProfileStats.PlayerProfileStats",
      require("../../../data/profilestats.json")
    );
  },
  Pickup: function (server, client, packet) {
    debug(packet);
    debug("PlayerUpdate.LootEvent isn't send since it crash the game rn.");
    return;
    const { data: packetData } = packet;
    server.sendData(client, "PlayerUpdate.LootEvent", {
      unknownQword1: Int64String(packetData.id),
      unknownQword2: Int64String(packetData.id),
      unknownDword2: packet.id,
    });
  },
  GetRewardBuffInfo: function (server, client, packet) {
    server.sendData(client, "RewardBuffInfo", {
      unknownFloat1: 1,
      unknownFloat2: 2,
      unknownFloat3: 3,
      unknownFloat4: 4,
      unknownFloat5: 5,
      unknownFloat6: 6,
      unknownFloat7: 7,
      unknownFloat8: 8,
      unknownFloat9: 9,
      unknownFloat10: 10,
      unknownFloat11: 11,
      unknownFloat12: 12,
    });
  },
  PlayerUpdateUpdatePositionClientToZone: function (server, client, packet) {
    if (packet.data.position) {
      client.character.state.position = [
        packet.data.position[0],
        packet.data.position[1],
        packet.data.position[2],
        0,
      ];
    }
  },
  "PlayerUpdate.FullCharacterDataRequest": function (server, client, packet) {
    debug(packet);
    server.sendData(client, "PlayerUpdate.LightweightToFullPc", {
      attachments: [],
      effectTags: [],
      characterVariables: [],
      resources: [],
      unknownVector1: [0, 200, 0],
      unknownVector2: [0, 200, 0],
      unknownVector4: [0, 200, 0, 1],
      unknownVector5: [0, 200, 0, 1],
      unknownData1: {
        unknownDword1: 0,
        unknownString1: "",
        unknownString2: "",
        unknownDword2: 0,
        unknownString3: "",
      },
      unknownData2: { unknownFloat1: 1.0 },
      unknownData3: { unknownDword1: 0 },
      targetData: { targetType: 1 },
    });
  },
};

export default packetHandlers;
