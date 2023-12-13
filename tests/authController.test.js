const express = require('express');
const authController = require('../controllers/authController');
const app = express();

app.use(express.json());
app.use('/auth', authController);

describe('Auth Controller Tests', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should login an existing user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body.authenticated).toBe(true);
  });
});
