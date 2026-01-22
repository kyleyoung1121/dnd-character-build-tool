const text = '• <strong>Music Box:</strong> When opened';
console.log('Original:', text);

// Test 1: .*?
const result1 = text.replace(/<strong>(.*?)<\/strong>/gi, '<<BOLD:$1>>');
console.log('Test 1 (.*?):', result1);

// Test 2: [^<]+
const result2 = text.replace(/<strong>([^<]+)<\/strong>/gi, '<<BOLD:$1>>');
console.log('Test 2 ([^<]+):', result2);

// Test 3: (.+?)
const result3 = text.replace(/<strong>(.+?)<\/strong>/gi, '<<BOLD:$1>>');
console.log('Test 3 (.+?):', result3);
