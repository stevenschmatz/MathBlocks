var alphabet = 'abcdefghijklmnopqrstuvwxyz';

var generateCsrfToken = function() {
	/* a super-secret scheme for generating a CSRF token */
	var buffer = '';
	firstLetterIndex = Math.round(Math.random()*14);
	buffer += alphabet[firstLetterIndex];
	buffer += alphabet[firstLetterIndex + (Math.round(Math.random()*3)*4)];
	buffer += alphabet[firstLetterIndex + (Math.round(Math.random()*3)*3)];
	return buffer;
}

var isValidCsrfToken = function(token) {
	return (alphabet.indexOf(token[1]) % 4 == alphabet.indexOf(token[0]) % 4) && (alphabet.indexOf(token[2]) % 3 == alphabet.indexOf(token[0]) % 3);
}

exports.isValidCsrfToken = isValidCsrfToken;
