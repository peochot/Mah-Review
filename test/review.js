process.env.NODE_ENV = 'test';
import User from '../backend/models/user';
import Post from '../backend/models/post';
import Review from '../backend/models/review';
import supertest from 'supertest';
import should from 'should';
var app=require('../index');

let server = supertest(app);


describe('Review controller', () => {
    var token,testPost,testUser;
    before((done) => {
        User.remove({}, (err) => {
           done();
        });
        let user = new User();
        user.name = "Test User";
        user.email = "test@gmail.com";
        user.setPassword("1234");
        user.save().then((user)=>{
          token=user.generateJwt();
          testUser=user;
          return Post.create({
            title:"Another test",
            description:"Another test description",
            reward:10,
            expire:3
          })
        }).then((post)=>{
          testPost=post;
          return Review.remove({});
        }).catch((err)=>{
          console.log(err);
          done(err);
        });
    });
    describe('/GET reviews', () => {
        it('Get reviews successfully', (done) => {
            server.get('/api/post/'+testPost._id)
                  .expect("Content-type",/json/)
                  .expect(200)
                  .end(function(err,res){
                    res.body.should.have.property("data");
                    done(err);
                  });
        });
    });
    describe('/POST new review', () => {
        it('Post new review with data and correct token header', (done) => {
            const data = {
              content: 'A new review'
              };
            server.post('/api/post/'+testPost._id+'/review')
                  .set('Authorization',token)
                  .send(data)
                  .expect("Content-type",/json/)
                  .expect(200)
                  .end(function(err,res){
                    //res.body.message.should.be.equal('Permissions denied');
                    //res.body.should.have.property("data");
                    done(err);
                  });
        });
        it('Post new review with data and wrong token header', (done) => {
            const data = {
              content: 'A new review'
              };
              server.post('/api/post/'+testPost._id+'/review')
                  .set('Authorization',"Chim to")
                  .send(data)
                  .expect("Content-type",/json/)
                  .expect(401)
                  .end(function(err,res){
                    res.body.message.should.be.equal('Invalid token');
                    //res.body.should.have.property("data");
                    done(err);
                  });
        });
        it('Post new review with data without token header', (done) => {
          const data = {
            content: 'A new review'
            };
            server.post('/api/post/'+testPost._id+'/review')
                  .send(data)
                  .expect(401)
                  .expect("Content-type",/json/)
                  .end(function(err,res){
                    res.body.message.should.be.equal('not authorized');
                    //res.body.should.have.property("data");
                    done(err);
                  });
        });
        it('Right token header but miss data', (done) => {
            const data = {
              };
              server.post('/api/post/'+testPost._id+'/review')
                  .set('Authorization',token)
                  .send(data)
                  .expect(403)
                  .expect("Content-type",/json/)
                  .end(function(err,res){
                    res.body.message.should.be.equal('All fields required');
                    //res.body.should.have.property("data");
                    done(err);
                  });
        });

    });
    describe('/PUT update a review', () => {
        var testReview;
        beforeEach(function() {
          return Review.create({
            content:"A test review",
            post:testPost._id
          }).then((review)=>{
            testReview=review;
            testPost.reviews.unshift(review);
            return testPost.save();
          })
          .catch((err)=>{
            done(err);
          });
        });
        it('Correct category id , token header, no permission', (done) => {
            const data = {
                content:"Another review content"
              };
            server.put('/api/review/'+testReview._id)
                  .set('Authorization',token)
                  .send(data)
                  .expect(400)
                  .expect("Content-type",/json/)
                  .end(function(err,res){
                    res.body.message.should.be.equal('Permission denied');
                    //res.body.should.have.property("data");
                    done(err);
                  });
        });
        it('Correct id , token header ,user has permission', (done) => {
            testUser.isAdmin=true;
            testUser.save();
            const data = {
                content:"Another review content"
              };
            server.put('/api/review/'+testReview._id)
                  .set('Authorization',token)
                  .send(data)
                  .expect(200)
                  .expect("Content-type",/json/)
                  .end(function(err,res){
                    res.body.data.content.should.be.equal("Another review content");
                    done(err);
                  });
        });
    });


});
