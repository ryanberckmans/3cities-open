import * as Ubjson from '@shelacek/ubjson';
import { encode, decode } from "@msgpack/msgpack";
import { gzipSync, gunzipSync } from 'fflate';
import { deepStrictEqual } from "assert";
import { modifiedBase64Decode, modifiedBase64Encode } from './base64';

// TODO use schema-based serialization. currently, serializing a basic test Checkout results in a final base64 value length of 288 characters. I suspect that a schema-based serialization, eg. using protocol buffers, would have a substantially smaller final base64 length. 

// TODO WARNING add a comment that anything serialized must use only supported types, eg. number/string/Date/etc. and not BigNumber? or is BigNumber serializable?

import { Checkout } from "./checkout";

const t: Checkout = {
  proposedAgreement: {
    receiverAddress: '0xac0d7753EA2816501b57fae9ad665739018384b3',
    logicalAssetTicker: 'USD',
    amountAsBigNumberHexString: '0xTODO',
    _isDonation: true,
  },
  strategyPreferences: {
    tokenTickerExclusions: ['USDT'],
    chainIdExclusions: [1],
  },
};

function serializeUbjson<T>(t: T): ArrayBuffer {
  return Ubjson.encode(t);
}

function serializeMsgpack<T>(t: T): Uint8Array {
  return encode(t);
}

console.log('serializeUbjson length', serializeUbjson(t).byteLength);
console.log('serializeMsgpack length', serializeMsgpack(t).byteLength);

console.log('serializeUbjson Uint8Array length', new Uint8Array(serializeUbjson(t)).byteLength);


console.log('serializeUbjson gzip length', gzipSync(new Uint8Array(serializeUbjson(t))).byteLength);
console.log('serializeMsgpack gzip length', gzipSync(serializeMsgpack(t)).byteLength);

console.log('serializeUbjson gzip base64 length', modifiedBase64Encode(gzipSync(new Uint8Array(serializeUbjson(t)))).length);
console.log('serializeMsgpack gzip base64 length', modifiedBase64Encode(gzipSync(serializeMsgpack(t))).length);

console.log("naive json length", JSON.stringify(t).length);
console.log("naive json base64 length", window.btoa(JSON.stringify(t)).length);

const s1 = modifiedBase64Encode(gzipSync(new Uint8Array(serializeUbjson(t))))
const s2 = modifiedBase64Encode(gzipSync(serializeMsgpack(t)));
console.log("ubjson final base64", s1);
console.log("msgpack final base64", s2);
const t1: Checkout = Ubjson.decode(gunzipSync((new Uint8Array(modifiedBase64Decode(s1)))));
console.log("t1", t1);
deepStrictEqual(t, t1);
const t2: Checkout = decode(gunzipSync((new Uint8Array(modifiedBase64Decode(s2))))) as Checkout;
console.log("t2", t2);
deepStrictEqual(t, t2);

export const loadThisModule = true;
