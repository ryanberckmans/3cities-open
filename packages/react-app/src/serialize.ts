import { decode, encode } from "@msgpack/msgpack";
import { gunzipSync, gzipSync } from 'fflate';
import { modifiedBase64Decode, modifiedBase64Encode } from './base64';

/*
TODO in the future, we need to switch to the expensive task of writing and maintaining a schema-based serializer. A schema-based serializer offers two benefits: 1) schema change management, so that values serialized with older versions of a type can successfully be serialized into a newer version of the type, and 2) dramatically improved efficiency in terms of the final base64 value length

Here are some future serialization libraries to try
    1. https://github.com/zandaqo/structurae#binary-protocol
    2. flatbuffers https://google.github.io/flatbuffers/flatbuffers_guide_tutorial.html
    3. protocol buffers
        https://github.com/protobufjs/protobuf.js/
        https://github.com/mafintosh/protocol-buffers
    4. also see this paper (I already went through this, but including it here for reference) https://www.researchgate.net/publication/357647399_A_Survey_of_JSON-compatible_Binary_Serialization_Specifications
    what do I think?
        at first glance, Structurae may be more promising than flatbuffers or protocol buffers because Structurae was designed specifically for typescript. But, I haven't yet studied how schema change management works with Structurae
*/

// serializeToModifiedBase64 serializes the passed value of type T
// into a modified base64 representation that doesn't need to be URL
// encoded to be used in an URL. The result will only be
// deserializable if all types used in T are supported by
// https://github.com/msgpack/msgpack-javascript (does not support
// BigNumber)
export function serializeToModifiedBase64<T>(t: T): string {
  return modifiedBase64Encode(gzipSync(encode(t)));
}

// deserializeFromModifiedBase64 deserializes the passed string into a
// value of type T. Precondition: the passed string was serialized
// using serializeToModifiedBase64 from a value of type T, the type T
// has not changed since serialization, and any types in T are
// supported by serializeToModifiedBase64.
export function deserializeFromModifiedBase64<T>(s: string): T {
  return decode(gunzipSync((new Uint8Array(modifiedBase64Decode(s))))) as T;
}
