import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as process from 'process';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let adminPassword: string;

  beforeEach(async () => {
    adminPassword = process.env.ADMIN_PASSWORD;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - Valid', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: adminPassword,
      })
      .expect(200);

    const token = res.body;
    expect(token).toBeDefined();

    //verify token is valid
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token.access_token}`)
      .expect(200);
  });

  it('/auth/login (POST) - invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'wrong',
      })
      .expect(401);
  });

  it('/auth/login (POST) - missing credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
      })
      .expect(400);
  });

  it('/auth/login (POST) - invalid username', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'wrong',
        password: adminPassword,
      })
      .expect(401);
  });

  it('/users (GET) - Unauthorized', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });

  it('/users (GET) - valid token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: adminPassword,
      })
      .expect(200);

    const token = res.body;
    expect(token).toBeDefined();

    const usersRes = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token.access_token}`)
      .expect(200);

    const users = usersRes.body;
    expect(users).toBeDefined();
    expect(users).toBeInstanceOf(Array);
  });

  it('/users (POST) - Unauthorized', () => {
    return request(app.getHttpServer()).post('/users').expect(401);
  });

  it('/users/id (GET) - Unauthorized', () => {
    return request(app.getHttpServer()).get('/users/id').expect(401);
  });

  it('/users/id (PUT) - Unauthorized', () => {
    return request(app.getHttpServer()).put('/users/id').expect(401);
  });

  it('/users (DELETE) - Unauthorized', () => {
    return request(app.getHttpServer()).delete('/users/id').expect(401);
  });

  describe('E2E - Creation, Read, Update and Deletion of a User', () => {
    let token = { access_token: '' };
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'admin',
          password: adminPassword,
        })
        .expect(200);

      token = res.body;
    });

    it('/users (POST) - valid token', async () => {
      const usersRes = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send({
          name: 'test',
          email: 'test@email.com',
          password: 'testtest',
        })
        .expect(201);

      const user = usersRes.body;
      expect(user).toBeDefined();
      expect(user.name).toBe('test');
    });

    it('/users/id (GET) - valid token', async () => {
      const allUsersRes = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token.access_token}`)
        .expect(200);

      const allUsers = allUsersRes.body;
      expect(allUsers).toBeDefined();

      const targetUser = allUsers.find((user) => user.name === 'test');

      const usersRes = await request(app.getHttpServer())
        .get('/users/' + targetUser.id)
        .set('Authorization', `Bearer ${token.access_token}`)
        .expect(200);

      const user = usersRes.body;
      expect(user).toBeDefined();
      expect(user.name).toBe('test');
    });

    it('/users/id (PUT) - valid token', async () => {
      const allUsersRes = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token.access_token}`)
        .expect(200);

      const allUsers = allUsersRes.body;
      expect(allUsers).toBeDefined();

      const targetUser = allUsers.find((user) => user.name === 'test');

      const updateRes = await request(app.getHttpServer())
        .put('/users/' + targetUser.id)
        .set('Authorization', `Bearer ${token.access_token}`)
        .send({
          name: 'test2',
          email: 'test@email.com',
          password: 'testtest2',
        })
        .expect(200);

      const updateResult = updateRes.body;
      expect(updateResult).toBeDefined();
      expect(updateResult.affected).toBe(1);
    });

    it('/users (DELETE) - valid token', async () => {
      const allUsersRes = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token.access_token}`)
        .expect(200);

      const allUsers = allUsersRes.body;
      expect(allUsers).toBeDefined();

      const targetUser = allUsers.find((user) => user.name === 'test2');

      const deleteRes = await request(app.getHttpServer())
        .delete('/users/' + targetUser.id)
        .set('Authorization', `Bearer ${token.access_token}`)
        .expect(200);

      const deleteResult = deleteRes.body;
      expect(deleteResult).toBeDefined();
      expect(deleteResult.affected).toBe(1);
    });
  });
});
