let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("./index.js");

chai.should();
chai.use(chaiHttp);

let id;
describe("TickTech Task API", () => {
  describe("GET /api/users", () => {
    it("It should return empty array", (done) => {
      chai
        .request(server)
        .get("/api/users")
        .end((err, res) => {
          (err === null).should.be.true;
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eq(0);
          done();
        });
    });
  });
  describe("POST /api/users", () => {
    it("It should return created user", (done) => {
      const body = {
        username: "Test",
        age: "22",
        hobbies: ["Gaming", "Table Tennis"]
      };
      chai
        .request(server)
        .post("/api/users")
        .send(body)
        .end((err, res) => {
          (err === null).should.be.true;
          res.should.have.status(201);
          res.body.should.have.property("id");
          res.body.should.have.property("_id");
          res.body.should.have.property("age");
          res.body.should.have.property("hobbies");
          res.body.should.have.property("username");
          res.body.hobbies.length.should.be.eq(2);
          id = res.body.id;
          done();
        });
    });
  });
  describe("GET /api/users/:userId", () => {
    it("It should return a user", (done) => {
      chai
        .request(server)
        .get(`/api/users/${id}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.should.have.status(200);
          res.body.should.have.property("id");
          res.body.should.have.property("_id");
          res.body.should.have.property("age");
          res.body.should.have.property("hobbies");
          res.body.should.have.property("username");
          res.body.hobbies.length.should.be.eq(2);
          done();
        });
    });
  });
  describe("DELETE /api/users/:userId", () => {
    it("It should delete the user", (done) => {
      chai
        .request(server)
        .delete(`/api/users/${id}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.should.have.status(204);
          done();
        });
    });
  });
  describe("GET /api/users/:userId", () => {
    it("It should return user not found", (done) => {
      chai
        .request(server)
        .get(`/api/users/${id}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.should.have.status(404);
          res.body.should.have.property("error");
          res.body.error.should.be.eq("User not found");
          done();
        });
    });
  });
});
