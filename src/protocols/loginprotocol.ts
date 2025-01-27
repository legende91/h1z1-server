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

const debug = require("debug")("LoginProtocol");
import DataSchema from "h1z1-dataschema";
import { Int64String } from "../utils/utils";

export class LoginProtocol {
  LoginPackets: any;
  protocolName: String;

  constructor(protocolName: String = "LoginUdp_9") {
    this.protocolName = protocolName;
    // Maybe will remove this switch later
    switch (this.protocolName) {
      case "LoginUdp_9":
        this.LoginPackets = require("../packets/LoginUdp/LoginUdp_9/loginpackets");
        break;
      case "LoginUdp_11":
        this.LoginPackets = require("../packets/LoginUdp/LoginUdp_11/loginpackets");
        break;
      default:
        debug(`Protocol ${this.protocolName} unsupported !`);
        process.exit();
    }
  }

  parse(data: any) {
    const packetType = data[0];
    let result;
    const packet = this.LoginPackets.Packets[packetType];
    if (packet) {
      if (packet.name === "TunnelAppPacketClientToServer") {
        return {
          serverId: data.readUInt32LE(1),
          unknown: data.readUInt32LE(5),
          packetLenght: data.readUInt32LE(9),
          name: packet.name,
          tunnelData: data.slice(13),
        };
      } else if (packet.schema) {
        debug(packet.name);
        result = DataSchema.parse(packet.schema, data, 1, undefined).result;
        debug("[DEBUG] Packet receive :");
        debug(result);

        return {
          type: packet.type,
          name: packet.name,
          result: result,
        };
      } else {
        debug("parse()", "No schema for packet ", packet.name);
        return false;
      }
    } else {
      debug(
        "parse() " + "Unknown or unhandled login packet type: " + packetType
      );
      return false;
    }
  }

  pack(packetName: string, object: any) {
    const packetType = this.LoginPackets.PacketTypes[packetName];
    const packet = this.LoginPackets.Packets[packetType];
    let payload;
    let data;
    if (packet) {
      if (packet.name === "TunnelAppPacketServerToClient") {
        data = new (Buffer as any).alloc(13 + object.tunnelData.length);
        data.writeUInt8(packetType, 0);
        data.writeUInt64String(Int64String(object.serverId), 1);
        data.writeUInt32LE(object.tunnelData.length, 9);
        object.tunnelData.copy(data, 13);
        debug("tunnelpacket send data :", object);
      } else if (packet.schema) {
        debug("Packing data for " + packet.name);
        payload = DataSchema.pack(
          packet.schema,
          object,
          undefined,
          undefined,
          undefined
        );
        if (payload) {
          data = new (Buffer.alloc as any)(1 + payload.length);
          data.writeUInt8(packetType, 0);
          payload.data.copy(data, 1);
        } else {
          debug("Could not pack data schema for " + packet.name);
        }
      } else {
        debug("pack()", "No schema for packet " + packet.name);
      }
    } else {
      debug("pack()", "Unknown or unhandled login packet type: " + packetType);
    }
    return data;
  }
}

exports.LoginProtocol = LoginProtocol;
