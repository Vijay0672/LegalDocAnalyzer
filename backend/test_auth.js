const http = require('http');

const postRequest = (path, data, cookies = []) => {
    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length,
                'Cookie': cookies.join('; ')
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: JSON.parse(body || '{}')
                });
            });
        });

        req.on('error', (e) => reject(e));
        req.write(dataString);
        req.end();
    });
};

const runTest = async () => {
    try {
        const email = `test_${Date.now()}@example.com`;
        const password = 'password123';

        console.log(`Testing with email: ${email}`);

        // 1. Signup
        console.log('--- Signup ---');
        const signupRes = await postRequest('/api/auth/signup', { email, password });
        console.log('Status:', signupRes.statusCode);
        console.log('Body:', signupRes.body);
        const setCookie = signupRes.headers['set-cookie'];
        console.log('Cookie received:', setCookie ? 'Yes' : 'No');

        if (signupRes.statusCode !== 201) return;

        // 2. Login
        console.log('\n--- Login ---');
        const loginRes = await postRequest('/api/auth/login', { email, password });
        console.log('Status:', loginRes.statusCode);
        console.log('Body:', loginRes.body);
        const cookies = loginRes.headers['set-cookie'];

        if (loginRes.statusCode === 200) {
            console.log('\n--- Get Contracts ---');
            // Helper for GET
            const getRequest = (path, cookies) => {
                return new Promise((resolve, reject) => {
                    const options = {
                        hostname: 'localhost',
                        port: 5000,
                        path: path,
                        method: 'GET',
                        headers: {
                            'Cookie': cookies.join('; ')
                        }
                    };
                    const req = http.request(options, (res) => {
                        let body = '';
                        res.on('data', (chunk) => body += chunk);
                        res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
                    });
                    req.on('error', reject);
                    req.end();
                });
            };

            const contractsRes = await getRequest('/api/contracts', cookies);
            console.log('Contracts Status:', contractsRes.statusCode);
            console.log('Contracts Body:', contractsRes.body);
        }

    } catch (err) {
        console.error('Test failed:', err);
    }
};

runTest();
