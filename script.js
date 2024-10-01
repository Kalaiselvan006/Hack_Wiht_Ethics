
// Cipher Functions

// Caesar Cipher
function caesarCipher(str, shift) {
    return str.replace(/[a-zA-Z]/g, function(c) {
        const code = c.charCodeAt();
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode((code - base + shift + 26) % 26 + base);
    });
}

function caesarDecrypt(str, shift) {
    return caesarCipher(str, 26 - (shift % 26)); // Use Caesar cipher with negative shift
}

// atbash Cipher
function atbashCipher(str) {
return str.split('').map(c => {
if (c >= 'A' && c <= 'Z') {
    // Uppercase letters
    return String.fromCharCode(90 - (c.charCodeAt() - 65));
} else if (c >= 'a' && c <= 'z') {
    // Lowercase letters
    return String.fromCharCode(122 - (c.charCodeAt() - 97));
}
return c; // Non-alphabetic characters remain unchanged
}).join('');
}

// Vigenère Cipher
function vigenereCipher(str, key) {
    let result = '';
    key = key.toUpperCase();
    for (let i = 0, j = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            result += String.fromCharCode((c - 65 + key.charCodeAt(j % key.length) - 65) % 26 + 65);
            j++;
        } else if (c >= 97 && c <= 122) {
            result += String.fromCharCode((c - 97 + key.charCodeAt(j % key.length) - 65) % 26 + 97);
            j++;
        } else {
            result += str[i];
        }
    }
    return result;
}

function vigenereDecrypt(str, key) {
    let result = '';
    key = key.toUpperCase();
    for (let i = 0, j = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            result += String.fromCharCode((c - 65 - (key.charCodeAt(j % key.length) - 65) + 26) % 26 + 65);
            j++;
        } else if (c >= 97 && c <= 122) {
            result += String.fromCharCode((c - 97 - (key.charCodeAt(j % key.length) - 65) + 26) % 26 + 97);
            j++;
        } else {
            result += str[i];
        }
    }
    return result;
}

// Rail Fence Cipher
function railFenceCipher(str, numRails) {
    const rail = Array.from({ length: numRails }, () => []);
    let dirDown = false;
    let row = 0;

    for (const char of str) {
        rail[row].push(char);
        if (row === 0 || row === numRails - 1) dirDown = !dirDown;
        row += dirDown ? 1 : -1;
    }
    return rail.flat().join('');
}

function railFenceDecrypt(str, numRails) {
    const rail = Array.from({ length: numRails }, () => []);
    let dirDown = false;
    let row = 0;

    for (let i = 0; i < str.length; i++) {
        rail[row].push('*');
        if (row === 0 || row === numRails - 1) dirDown = !dirDown;
        row += dirDown ? 1 : -1;
    }

    let index = 0;
    for (let i = 0; i < numRails; i++) {
        for (let j = 0; j < str.length; j++) {
            if (rail[i][j] === '*' && index < str.length) {
                rail[i][j] = str[index++];
            }
        }
    }

    let result = '';
    row = 0;
    dirDown = false;

    for (let i = 0; i < str.length; i++) {
        result += rail[row][i];
        if (row === 0 || row === numRails - 1) dirDown = !dirDown;
        row += dirDown ? 1 : -1;
    }

    return result;
}

// Columnar Transposition Cipher
function columnarCipher(str, key) {
    const keyLength = key.length;
    const columns = Math.ceil(str.length / keyLength);
    const matrix = Array.from({ length: columns }, () => Array(keyLength).fill(''));
    let index = 0;

    for (let j = 0; j < keyLength; j++) {
        for (let i = 0; i < columns; i++) {
            if (index < str.length) {
                matrix[i][j] = str[index++];
            }
        }
    }

    const sortedKey = [...key].map((k, i) => ({ index: i, char: k })).sort((a, b) => a.char.localeCompare(b.char));
    let result = '';

    for (const k of sortedKey) {
        for (let i = 0; i < columns; i++) {
            result += matrix[i][k.index];
        }
    }

    return result;
}

function columnarDecrypt(str, key) {
    const keyLength = key.length;
    const columns = Math.ceil(str.length / keyLength);
    const matrix = Array.from({ length: columns }, () => Array(keyLength).fill(''));
    const sortedKey = [...key].map((k, i) => ({ index: i, char: k })).sort((a, b) => a.char.localeCompare(b.char));

    let index = 0;
    for (const k of sortedKey) {
        for (let i = 0; i < columns; i++) {
            if (index < str.length) {
                matrix[i][k.index] = str[index++];
            }
        }
    }

    let result = '';
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < keyLength; j++) {
            result += matrix[i][j];
        }
    }

    return result.replace(/null/g, ''); // Clean up the output
}

// Playfair Cipher
function preparePlayfairKey(key) {
    const matrix = [];
    const uniqueChars = new Set();
    key = key.toUpperCase().replace(/J/g, 'I').split('');

    for (const char of key) {
        if (!uniqueChars.has(char) && char.match(/[A-Z]/)) {
            uniqueChars.add(char);
            matrix.push(char);
        }
    }

    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        if (!uniqueChars.has(char) && char !== 'J') {
            uniqueChars.add(char);
            matrix.push(char);
        }
    }
    return matrix;
}

function playfairCipher(str, key) {
    const matrix = preparePlayfairKey(key);
    const result = [];
    str = str.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

    for (let i = 0; i < str.length; i += 2) {
        let a = str[i];
        let b = str[i + 1] || 'X'; // Default to 'X' if there's an odd char
        if (a === b) {
            b = 'X';
            i--; // Repeat the current character
        }
        const aIndex = matrix.indexOf(a);
        const bIndex = matrix.indexOf(b);
        const aRow = Math.floor(aIndex / 5);
        const aCol = aIndex % 5;
        const bRow = Math.floor(bIndex / 5);
        const bCol = bIndex % 5;

        if (aRow === bRow) {
            result.push(matrix[aRow * 5 + (aCol + 1) % 5]);
            result.push(matrix[bRow * 5 + (bCol + 1) % 5]);
        } else if (aCol === bCol) {
            result.push(matrix[((aRow + 1) % 5) * 5 + aCol]);
            result.push(matrix[((bRow + 1) % 5) * 5 + bCol]);
        } else {
            result.push(matrix[aRow * 5 + bCol]);
            result.push(matrix[bRow * 5 + aCol]);
        }
    }

    return result.join('');
}

function playfairCipher(str, key) {
const matrix = preparePlayfairKey(key);
const result = [];
str = str.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

// Playfair logic continues

    for (let i = 0; i < str.length; i += 2) {
        let a = str[i];
        let b = str[i + 1] || 'X'; // Default to 'X' if there's an odd char
        const aIndex = matrix.indexOf(a);
        const bIndex = matrix.indexOf(b);
        const aRow = Math.floor(aIndex / 5);
        const aCol = aIndex % 5;
        const bRow = Math.floor(bIndex / 5);
        const bCol = bIndex % 5;

        if (aRow === bRow) {
            result.push(matrix[aRow * 5 + (aCol + 4) % 5]);
            result.push(matrix[bRow * 5 + (bCol + 4) % 5]);
        } else if (aCol === bCol) {
            result.push(matrix[((aRow + 4) % 5) * 5 + aCol]);
            result.push(matrix[((bRow + 4) % 5) * 5 + bCol]);
        } else {
            result.push(matrix[aRow * 5 + bCol]);
            result.push(matrix[bRow * 5 + aCol]);
        }
    }

    return result.join('');
}

// Affine Cipher
function affineCipher(str, a, b) {
    return str.replace(/[a-zA-Z]/g, function(c) {
        const code = c.charCodeAt();
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode((a * (code - base) + b) % 26 + base);
    });
}

function affineDecrypt(str, a, b) {
    // Find modular inverse of a mod 26
    let a_inv = 0;
    for (let i = 1; i < 26; i++) {
        if ((a * i) % 26 === 1) {
            a_inv = i;
            break;
        }
    }
    return str.replace(/[a-zA-Z]/g, function(c) {
        const code = c.charCodeAt();
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode((a_inv * (code - base - b + 26)) % 26 + base);
    });
}

// Encrypt and Decrypt Function
function encrypt() {
const inputText = document.getElementById("inputText").value;
if (!inputText) {
alert("Please enter text to encrypt!");
return;
}

const caesarShift = parseInt(document.getElementById("caesarShift").value);
const vigenereKey = document.getElementById("vigenereKey").value;
const railFenceRails = parseInt(document.getElementById("railFenceRails").value);
const columnarKey = document.getElementById("columnarKey").value;
const playfairKey = document.getElementById("playfairKey").value;
const affineA = parseInt(document.getElementById("affineA").value);
const affineB = parseInt(document.getElementById("affineB").value);

// Encryption output here


    let result = `
        <strong>Caesar Cipher:</strong> ${caesarCipher(inputText, caesarShift)}<br>
        <strong>Atbash Cipher:</strong> ${atbashCipher(inputText)}<br>
        <strong>Vigenère Cipher:</strong> ${vigenereCipher(inputText, vigenereKey)}<br>
        <strong>Rail Fence Cipher:</strong> ${railFenceCipher(inputText, railFenceRails)}<br>
        <strong>Columnar Transposition Cipher:</strong> ${columnarCipher(inputText, columnarKey)}<br>
        <strong>Playfair Cipher:</strong> ${playfairCipher(inputText, playfairKey)}<br>
        <strong>Affine Cipher:</strong> ${affineCipher(inputText, affineA, affineB)}<br>
    `;
    document.getElementById("results").innerHTML = result;
}

function decrypt() {
    const inputText = document.getElementById("inputText").value;
    const caesarShift = parseInt(document.getElementById("caesarShift").value);
    const vigenereKey = document.getElementById("vigenereKey").value;
    const railFenceRails = parseInt(document.getElementById("railFenceRails").value);
    const columnarKey = document.getElementById("columnarKey").value;
    const playfairKey = document.getElementById("playfairKey").value;
    const affineA = parseInt(document.getElementById("affineA").value);
    const affineB = parseInt(document.getElementById("affineB").value);

    let result = `
        <strong>Caesar Cipher:</strong> ${caesarDecrypt(inputText, caesarShift)}<br>
        <strong>Atbash Cipher:</strong> ${atbashCipher(inputText)}<br>
        <strong>Vigenère Cipher:</strong> ${vigenereDecrypt(inputText, vigenereKey)}<br>
        <strong>Rail Fence Cipher:</strong> ${railFenceDecrypt(inputText, railFenceRails)}<br>
        <strong>Columnar Transposition Cipher:</strong> ${columnarDecrypt(inputText, columnarKey)}<br>
        <strong>Playfair Cipher:</strong> ${playfairDecrypt(inputText, playfairKey)}<br>
        <strong>Affine Cipher:</strong> ${affineDecrypt(inputText, affineA, affineB)}<br>
    `;
    document.getElementById("results").innerHTML = result;
}

function clearFields() {
    document.getElementById("inputText").value = '';
    document.getElementById("caesarShift").value = '';
    document.getElementById("vigenereKey").value = '';
    document.getElementById("railFenceRails").value = '';
    document.getElementById("columnarKey").value = '';
    document.getElementById("playfairKey").value = '';
    document.getElementById("affineA").value = '';
    document.getElementById("affineB").value = '';
    document.getElementById("results").innerHTML = '';
}