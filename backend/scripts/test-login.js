const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@example.com',
      password: 'test123'
    });

    console.log('\nLogin Response:');
    console.log('===============');
    console.log('Success:', response.data.success);
    console.log('\nUser Details:');
    console.log('Name:', response.data.user.name);
    console.log('Email:', response.data.user.email);
    console.log('Role:', response.data.user.role);
    console.log('\nJWT Token (save this for API requests):');
    console.log(response.data.token);

  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
  }
}

testLogin();
