// Basic rate limiting example in Node.js
// Allows max 5 requests per 10 seconds per user (by IP)

const rateLimitMap = new Map();
const MAX_REQUESTS = 5;
const WINDOW_MS = 10 * 1000; // 10 seconds

function isAllowed(ip) {
	const now = Date.now();
	if (!rateLimitMap.has(ip)) {
		rateLimitMap.set(ip, []);
	}
	const timestamps = rateLimitMap.get(ip);
	// Remove timestamps outside the window
	while (timestamps.length && timestamps[0] <= now - WINDOW_MS) {
		timestamps.shift();
	}
	if (timestamps.length < MAX_REQUESTS) {
		timestamps.push(now);
		return true;
	}
	return false;
}

// Example usage:
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

console.log('Enter IP addresses to simulate requests (type "exit" to quit):');
rl.on('line', (input) => {
	if (input === 'exit') {
		rl.close();
		return;
	}
	const allowed = isAllowed(input);
	if (allowed) {
		console.log(`Request from ${input} allowed.`);
	} else {
		console.log(`Request from ${input} rate limited.`);
	}
});
