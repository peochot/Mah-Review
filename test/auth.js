process.env.NODE_ENV = 'test';
const User = require('../backend/models/user');
const supertest = require("supertest");
const should = require("should");


var app=require('../index');

let server = supertest(app);

describe('Authenthication', () => {
    before((done) => {
        User.remove({}).then(()=>{
          let user = new User();
          user.name = "Test User";
          user.email = "test@gmail.com";
          user.setPassword("1234");
          return user.save();
        }).then((user)=>{
          done();
        },done)
        .catch((err)=>{
          done(err);
        });
    });
  describe('/POST register new user', () => {
      it('should register successfully and get token', (done) => {
        let data = {
          name: 'Minh Cao',
          password: 'minhkunho',
          email: 'minhkunho@gmail.com'
          };
          server.post('/api/register')
                .send(data)
                .expect("Content-type",/json/)
                .expect(200)
                .end(function(err,res){
                  res.body.should.have.property("token");
                  done(err);
                });
      });
      it('should failed because duplicated email', (done) => {
        let data = {
          name: 'Minh Cao',
          password: 'minhkunho',
          email: 'test@gmail.com'
          };
          server.post('/api/register')
                .send(data)
                .expect("Content-type",/json/)
                .expect(404)
                .end(function(err,res){
                  res.body.should.have.property("errmsg");
                  done(err);
                });
      });
      it('should failed because missing fields', (done) => {
        let data = {
          name: 'Minh Cao'
          };
          server.post('/api/register')
                .send(data)
                .expect("Content-type",/json/)
                .expect(400)
                .end(function(err,res){
                  res.body.should.have.property("message");
                  done(err);
                });
      });
  });

  describe('/POST login', () => {
    it('should login successfully with right credencials', (done) => {
      let data = {
        password: '1234',
        email: 'test@gmail.com'
        };
        server.post('/api/login')
              .send(data)
              .expect("Content-type",/json/)
              .expect(200)
              .end(function(err,res){
                res.body.should.have.property("token");
                done(err);
              });
    });
    it('should login failed with wrong password', (done) => {
      let data = {
        password: 'Minhkunho',
        email: 'test@gmail.com'
        };
        server.post('/api/login')
              .send(data)
              .expect("Content-type",/json/)
              .expect(404)
              .end(function(err,res){
                res.body.should.have.property("message");
                done(err);
              });
    });

  });

});
