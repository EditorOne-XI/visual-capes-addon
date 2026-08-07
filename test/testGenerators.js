function animCape_json() {
  const namespaceTexture = "thunderstorm_cape_f";
  const frameCount = 14;
  const numStart = 1;
  for (let vi = 0; vi < frameCount; vi++) {
    let texture = true;
    
    let idNum = vi + numStart;
    if (texture) console.log(`            "Texture.${namespaceTexture}${idNum}",`);
    else console.log(`        "${namespaceTexture}${idNum}": "textures/capes/thunderstorm/texture${idNum}",`);
  }
}
animCape_json();


////// RANDOM PASSWORD GENERATOR (Src: Bro Code YT) //////
function generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols) {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=";
  let allowedChars = "";
  let password = "";
  allowedChars += includeLowercase ? lowercaseChars: "";
  allowedChars += includeUppercase ? uppercaseChars: "";
  allowedChars += includeNumbers ? numberChars: "";
  allowedChars += includeSymbols ? symbolChars: "";
  if (length <= 0) {
    return `(password length must be at least 1)`;
  };
  if (allowedChars.length === 0) {
    return `(At least 1 set of character needs to be selected)`;
  };
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    password += allowedChars[randomIndex];
  };
  return password;
};

/*
console.log(`Generated password:`, `0${generatePassword(
  15, // passwordLength
  true, // includeLowercase
  true, // includeUppercase
  false, // includeNumbers
  false // includeSymbols
)}`);
//*/

function sortByName(array) {
  return array.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
  });
}
/*
console.log(JSON.stringify(
  sortByName(null), null, 2)
);
//*/

function btoa(input) {
  let string = input;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let encoded = '';
  let i = 0;
  while (i < string.length) {
    const c1 = string.charCodeAt(i++);
    const c2 = i < string.length ? string.charCodeAt(i++) : NaN;
    const c3 = i < string.length ? string.charCodeAt(i++) : NaN;
    encoded += chars[c1 >> 2];
    encoded += chars[((c1 & 3) << 4) | (c2 >> 4)];
    if (isNaN(c2)) {
      encoded += '==';
    } else {
      encoded += chars[((c2 & 15) << 2) | (c3 >> 6)];
      encoded += isNaN(c3) ? '=' : chars[c3 & 63];
    };
  };
  return encoded;//.replace(/\+/g, '&').replace(/\//g, '?').replace(/=/g, '.');
};

function atob(input) {
  let encoded = input;//.replace(/&/g, '+').replace(/\?/g, '/').replace(/\./g, '=');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let str = '';
  let i = 0;
  encoded = encoded.replace(/=+$/, '');
  while (i < encoded.length) {
    const c1 = chars.indexOf(encoded.charAt(i++));
    const c2 = chars.indexOf(encoded.charAt(i++));
    const c3 = i < encoded.length ? chars.indexOf(encoded.charAt(i++)) : -1;
    const c4 = i < encoded.length ? chars.indexOf(encoded.charAt(i++)) : -1;
    str += String.fromCharCode((c1 << 2) | (c2 >> 4));
    if (c3 !== -1) {
      str += String.fromCharCode(((c2 & 15) << 4) | (c3 >> 2));
    };
    if (c4 !== -1) {
      str += String.fromCharCode(((c3 & 3) << 6) | c4);
    };
  };
  return str;
};

/*
Draft Cape Collector player property
let insertTxt = btoa("48v,6a,16c");

// vcaDevE1_XI
// The Void Resistance; originated from EditorOneXI's Coset Quantum firaha'yiah Void tein
console.log('Encrypted: ', insertTxt);
console.log('Decrypted: ', atob(insertTxt));
//*/

const exportByVars = `export {};
`;

function exportFormat(importThis, invert = false) {
  if (!exportByVars.startsWith("export {"))
  console.error("Not an export format.");
  let formatted = invert ?
    exportByVars
      .replace(/{\s/g, '{\n  ')
      .replace(/,\s/g, ',\n  ')
      .replace(/\s};/g, '\n};') :
    exportByVars.replace(/\\n|\s+/g, ' ');
  if (!importThis) console.log(formatted);
  else {
    let impFormat = formatted
      .replace("export ", "import ")
      .replace(";", ` from '${importThis}';`);
    console.log(impFormat);
  };
};

/*
 exportFormat("static.js");
/*/
//  exportFormat(null, true);
//*/
