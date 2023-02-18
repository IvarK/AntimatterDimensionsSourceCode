/* eslint-disable no-param-reassign */

// Copyright (c) 2011, Daniel Guerrero
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

/**
 * Uses the new array typed in javascript to binary base64 encode/decode
 * at the moment just decodes a binary base64 encoded
 * into either an ArrayBuffer (decodeArrayBuffer)
 * or into an Uint8Array (decode)
 *
 * References:
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBuffer
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/Uint8Array
 */

const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/* Will return a Uint8Array type */
export function decodeArrayBuffer(input) {
  const bytes = (input.length / 4) * 3;
  const ab = new ArrayBuffer(bytes);
  decodeBase64Binary(input, ab);

  return ab;
}

function removePaddingChars(input) {
  const lkey = keyStr.indexOf(input.charAt(input.length - 1));
  if (lkey === 64) {
    return input.substring(0, input.length - 1);
  }
  return input;
}

export function decodeBase64Binary(input, arrayBuffer) {
  // Get last chars to see if are valid
  input = removePaddingChars(input);
  input = removePaddingChars(input);

  const bytes = parseInt((input.length / 4) * 3, 10);

  let array;
  let chr1, chr2, chr3;
  let enc1, enc2, enc3, enc4;
  let i = 0;
  let j = 0;

  if (arrayBuffer)
    array = new Uint8Array(arrayBuffer);
  else
    array = new Uint8Array(bytes);

  input = input.replace(/[^A-Za-z0-9+/=]/gu, "");

  for (i = 0; i < bytes; i += 3) {
    // Get the 3 octects in 4 ascii chars
    enc1 = keyStr.indexOf(input.charAt(j++));
    enc2 = keyStr.indexOf(input.charAt(j++));
    enc3 = keyStr.indexOf(input.charAt(j++));
    enc4 = keyStr.indexOf(input.charAt(j++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    array[i] = chr1;
    if (enc3 !== 64) array[i + 1] = chr2;
    if (enc4 !== 64) array[i + 2] = chr3;
  }

  return array;
}
