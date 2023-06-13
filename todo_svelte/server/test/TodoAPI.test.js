process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
const Post = require("../models/Todo");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");

chai.use(chaiHttp);
chai.should();

beforeEach("test", () => {
  console.log("starting the test process");
});

describe("testing the get methods", function() {
  it("tests if all posts are fetched", function(done) {
    chai
      .request("http://localhost:3000/api")
      .get("/todos")
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        res.body.should.be.a("object"); // cehck if the return type is an object
        res.body.should.not.eql({}); // check if that object is not empty
        //the line below is applied in case we are working with pure Arrays
        //chai.expect(res.body).to.not.have.length(0); // this just in case I have already rows in the DB
        res.body.should.have.property("todos"); // check if the object has a todos property
        done();
      });
  });

  it("tests if a single todo is created", function(done) {
    // defining a hardcoded todo object for testing purposes

    let todo = {
      title: "this is a test post",
      description: "this is just a filler",
      complete: false
    };

    chai
      .request("http://localhost:3000/api")
      .post(`/todos`)
      .send(todo)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        res.body.should.be.a("object");
        res.body.should.not.eql({}); // we expect the object to not be empty
        res.body.should.have.property("todo");
        done();
      });
  });

  it("tests if a single todo is fetched", function(done) {
    const id = "5ceac784cf94351982feddf6";
    // here I hardcoded a mongoDB generated ID, it would be more accurate to use a dummy in memory DB
    // like a local array of objects

    chai
      .request("http://localhost:3000/api")
      .get(`/todos/${id}`)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        res.body.should.be.a("object");
        res.body.should.not.eql({}); // we expect the object to not be empty
        res.body.should.have.property("todo");
        done();
      });
  });

  it("tests if a single todo is deleted", function(done) {
    let id = "5ceac784cf94351982feddf6";

    chai
      .request("http://localhost:3000/api")
      .delete(`/todos/${id}`)
      .end((err, res) => {
        chai.expect(res).to.have.status(201);
        res.body.should.be.a("object");
        res.body.should.not.eql({}); // we expect the object to not be empty
        res.body.should.have.property("todo");
        done();
      });
  });

  // there should be a test for the update method here

});
