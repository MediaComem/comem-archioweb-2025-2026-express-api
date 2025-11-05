import mongoose from "mongoose"
import supertest from "supertest"

import app from "../app.js"
import { cleanUpDatabase, generateValidJwt } from "./utils.js";
import User from "../models/user.js"

beforeEach(cleanUpDatabase);

afterAll(async () => {
  await mongoose.disconnect();
});

describe('POST /users', function() {
  test('should create a user', async function() {
    const res = await supertest(app)
      .post('/users')
      .send({
        name: 'John Doe',
        password: '1234'
      })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeObject();
    expect(res.body._id).toBeString();
    expect(res.body.name).toEqual('John Doe');
    expect(res.body).toContainAllKeys(['_id', 'name'])
  });
});

describe('GET /users', function() {
  let johnDoe;
  let janeDoe;
  beforeEach(async function() {
    // Create 2 users before retrieving the list.
    [ johnDoe, janeDoe ] = await Promise.all([
      User.create({ name: 'John Doe' }),
      User.create({ name: 'Jane Doe' })
    ]);
  });

  test('should retrieve the list of users', async function() {
    const token = await generateValidJwt(johnDoe);
    const res = await supertest(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeArray();

    expect(res.body[0]).toBeObject();
    expect(res.body[0].name).toEqual('Jane Doe');
    expect(res.body[0]._id).toEqual(janeDoe.id);
    expect(res.body[0]).toContainAllKeys(['_id', 'name']);

    expect(res.body[1]).toBeObject();
    expect(res.body[1].name).toEqual('John Doe');
    expect(res.body[1]._id).toEqual(johnDoe.id);
    expect(res.body[1]).toContainAllKeys(['_id', 'name']);

    expect(res.body).toHaveLength(2);
  });
});

describe('PUT /users/:id', function() {
  let johnDoe;
  beforeEach(async function() {
    johnDoe = await User.create({ name: 'John Doe' });
  });

  test('update a user', async function() {
    const res = await supertest(app)
      .put(`/users/${johnDoe.id}`)
      .send({
        name: 'New name 2'
      })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeObject();
    expect(res.body._id).toEqual(johnDoe.id);
    expect(res.body.name).toEqual('New name 2');
    expect(res.body).toContainAllKeys(['_id', 'name'])
  });
});