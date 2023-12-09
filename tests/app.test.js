const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assuming your app.js is in the root directory

// Configure chai with chai-http
chai.use(chaiHttp);
const { expect } = chai;

describe('Sample Test', () => {
  it('should return "Hello, World!"', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Hello, World!');
        done();
      });
  });
});
