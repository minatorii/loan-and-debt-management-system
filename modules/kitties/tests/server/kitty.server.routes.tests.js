'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Kitty = mongoose.model('Kitty'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  kitty;

/**
 * Kitty routes tests
 */
describe('Kitty CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Kitty
    user.save(function () {
      kitty = {
        name: 'Kitty name'
      };

      done();
    });
  });

  it('should be able to save a Kitty if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Kitty
        agent.post('/api/kitties')
          .send(kitty)
          .expect(200)
          .end(function (kittySaveErr, kittySaveRes) {
            // Handle Kitty save error
            if (kittySaveErr) {
              return done(kittySaveErr);
            }

            // Get a list of Kitties
            agent.get('/api/kitties')
              .end(function (kittiesGetErr, kittiesGetRes) {
                // Handle Kitties save error
                if (kittiesGetErr) {
                  return done(kittiesGetErr);
                }

                // Get Kitties list
                var kitties = kittiesGetRes.body;

                // Set assertions
                (kitties[0].user._id).should.equal(userId);
                (kitties[0].name).should.match('Kitty name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Kitty if not logged in', function (done) {
    agent.post('/api/kitties')
      .send(kitty)
      .expect(403)
      .end(function (kittySaveErr, kittySaveRes) {
        // Call the assertion callback
        done(kittySaveErr);
      });
  });

  it('should not be able to save an Kitty if no name is provided', function (done) {
    // Invalidate name field
    kitty.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Kitty
        agent.post('/api/kitties')
          .send(kitty)
          .expect(400)
          .end(function (kittySaveErr, kittySaveRes) {
            // Set message assertion
            (kittySaveRes.body.message).should.match('Please fill Kitty name');

            // Handle Kitty save error
            done(kittySaveErr);
          });
      });
  });

  it('should be able to update an Kitty if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Kitty
        agent.post('/api/kitties')
          .send(kitty)
          .expect(200)
          .end(function (kittySaveErr, kittySaveRes) {
            // Handle Kitty save error
            if (kittySaveErr) {
              return done(kittySaveErr);
            }

            // Update Kitty name
            kitty.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Kitty
            agent.put('/api/kitties/' + kittySaveRes.body._id)
              .send(kitty)
              .expect(200)
              .end(function (kittyUpdateErr, kittyUpdateRes) {
                // Handle Kitty update error
                if (kittyUpdateErr) {
                  return done(kittyUpdateErr);
                }

                // Set assertions
                (kittyUpdateRes.body._id).should.equal(kittySaveRes.body._id);
                (kittyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Kitties if not signed in', function (done) {
    // Create new Kitty model instance
    var kittyObj = new Kitty(kitty);

    // Save the kitty
    kittyObj.save(function () {
      // Request Kitties
      request(app).get('/api/kitties')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Kitty if not signed in', function (done) {
    // Create new Kitty model instance
    var kittyObj = new Kitty(kitty);

    // Save the Kitty
    kittyObj.save(function () {
      request(app).get('/api/kitties/' + kittyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', kitty.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Kitty with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/kitties/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Kitty is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Kitty which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Kitty
    request(app).get('/api/kitties/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Kitty with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Kitty if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Kitty
        agent.post('/api/kitties')
          .send(kitty)
          .expect(200)
          .end(function (kittySaveErr, kittySaveRes) {
            // Handle Kitty save error
            if (kittySaveErr) {
              return done(kittySaveErr);
            }

            // Delete an existing Kitty
            agent.delete('/api/kitties/' + kittySaveRes.body._id)
              .send(kitty)
              .expect(200)
              .end(function (kittyDeleteErr, kittyDeleteRes) {
                // Handle kitty error error
                if (kittyDeleteErr) {
                  return done(kittyDeleteErr);
                }

                // Set assertions
                (kittyDeleteRes.body._id).should.equal(kittySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Kitty if not signed in', function (done) {
    // Set Kitty user
    kitty.user = user;

    // Create new Kitty model instance
    var kittyObj = new Kitty(kitty);

    // Save the Kitty
    kittyObj.save(function () {
      // Try deleting Kitty
      request(app).delete('/api/kitties/' + kittyObj._id)
        .expect(403)
        .end(function (kittyDeleteErr, kittyDeleteRes) {
          // Set message assertion
          (kittyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Kitty error error
          done(kittyDeleteErr);
        });

    });
  });

  it('should be able to get a single Kitty that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Kitty
          agent.post('/api/kitties')
            .send(kitty)
            .expect(200)
            .end(function (kittySaveErr, kittySaveRes) {
              // Handle Kitty save error
              if (kittySaveErr) {
                return done(kittySaveErr);
              }

              // Set assertions on new Kitty
              (kittySaveRes.body.name).should.equal(kitty.name);
              should.exist(kittySaveRes.body.user);
              should.equal(kittySaveRes.body.user._id, orphanId);

              // force the Kitty to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Kitty
                    agent.get('/api/kitties/' + kittySaveRes.body._id)
                      .expect(200)
                      .end(function (kittyInfoErr, kittyInfoRes) {
                        // Handle Kitty error
                        if (kittyInfoErr) {
                          return done(kittyInfoErr);
                        }

                        // Set assertions
                        (kittyInfoRes.body._id).should.equal(kittySaveRes.body._id);
                        (kittyInfoRes.body.name).should.equal(kitty.name);
                        should.equal(kittyInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Kitty.remove().exec(done);
    });
  });
});
