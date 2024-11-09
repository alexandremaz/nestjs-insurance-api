import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

describe('Insurance API (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let testPartnerName: string;
  let jwtService: JwtService;
  let validTokenForTests: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
          target: true,
          value: true,
        },
      }),
    );

    await app.init();

    dataSource = moduleFixture.get(DataSource);

    await dataSource.query(`
      TRUNCATE TABLE "customer", "claim", "partner" RESTART IDENTITY CASCADE;
    `);

    testPartnerName = 'Test Partner';

    validTokenForTests = jwtService.sign({
      sub: 1,
      name: testPartnerName,
    });
  });

  afterAll(async () => {
    await app.close();
  }, 10000);

  describe('/auth (login, create-partner)', () => {
    it('should return 401 when no API key is provided', () => {
      return request(app.getHttpServer()).get('/auth/login').expect(401);
    });

    it('should return 401 when invalid API key is provided', () => {
      return request(app.getHttpServer())
        .get('/auth/login')
        .set('X-API-Key', 'invalid-key')
        .expect(401);
    });

    it('should return 200 and partner data when valid API key is provided', async () => {
      const testPartnerResult = await request(app.getHttpServer())
        .post('/auth/create-partner')
        .set('x-admin-api-key', 'my_admin_api_key')
        .send({
          partnerName: testPartnerName,
        });

      return request(app.getHttpServer())
        .get('/auth/login')
        .set('X-API-Key', testPartnerResult.body.apiKey)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          const decodedToken = jwtService.verify(res.body.access_token);
          expect(decodedToken).toHaveProperty('sub', 1);
          expect(decodedToken).toHaveProperty('name', testPartnerName);
        });
    });

    it('should handle malformed API key header', () => {
      return request(app.getHttpServer())
        .get('/auth/login')
        .set('X-API-Key', '')
        .expect(401);
    });
  });

  describe('/ (GET)', () => {
    let validToken: string;
    beforeAll(async () => {
      const testPartnerResult = await request(app.getHttpServer())
        .post('/auth/create-partner')
        .set('x-admin-api-key', 'my_admin_api_key')
        .send({
          partnerName: testPartnerName,
        });

      const validApiKey = testPartnerResult.body.apiKey;

      const response = await request(app.getHttpServer())
        .get('/auth/login')
        .set('X-API-Key', validApiKey);

      validToken = response.body['access_token'];
    });

    it('should reject requests without token', () => {
      return request(app.getHttpServer()).get('/').expect(401);
    });

    it('should reject requests with invalid token', () => {
      return request(app.getHttpServer())
        .get('/')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should accept requests with valid token', () => {
      return request(app.getHttpServer())
        .get('/')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
    });
  });

  describe('/customers (POST)', () => {
    it('should create a new customer', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({ email: 'test@example.com', name: 'Test User' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.name).toBe('Test User');
    });

    it('should fail with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({ email: 'invalid-email', name: '' })
        .expect(400);
    });
  });

  describe('/customers/:id (GET)', () => {
    it('should retrieve customer with no claims', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({ email: 'noclaims@example.com', name: 'No Claims User' });

      const response = await request(app.getHttpServer())
        .get(`/customers/${body.id}`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .expect(200);

      expect(response.body).toEqual({
        id: body.id,
        email: 'noclaims@example.com',
        name: 'No Claims User',
        totalPoints: 0,
      });
    });

    it('should return 404 for non-existing customer', async () => {
      await request(app.getHttpServer())
        .get('/customers/99999')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .expect(404);
    });

    it('should return the correct total points for a customer with many claims', async () => {
      const { body: customer } = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({ email: 'claimuser@example.com', name: 'Claim User' });

      await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          title: 'Claim 1',
          description: 'Description of claim 1',
          pointValue: 100,
        });

      await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          title: 'Claim 2',
          description: 'Description of claim 2',
          pointValue: 58,
        });

      await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          title: 'Claim 3',
          description: 'Description of claim 2',
          pointValue: 19,
        });

      await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims/batch`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          claims: [
            {
              title: 'Batch Claim 1',
              description: 'Batch Description 1',
              pointValue: 50,
            },
            {
              title: 'Batch Claim 2',
              description: 'Batch Description 2',
              pointValue: 30,
            },
          ],
        });

      const response = await request(app.getHttpServer())
        .get(`/customers/${customer.id}`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .expect(200);

      expect(response.body.totalPoints).toBe(30 + 50 + 19 + 58 + 100);
    });
  });

  describe('/customers/:id/claims (POST)', () => {
    it('should create a new claim for a customer', async () => {
      const { body: customer } = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({ email: 'claimuser@example.com', name: 'Claim User' });

      const response = await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          title: 'Claim 1',
          description: 'Description of claim 1',
          pointValue: 100,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Claim 1');
      expect(response.body.pointValue).toBe(100);
    });

    it('should fail to create a claim with invalid data', async () => {
      const { body: customer } = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          email: 'invalidclaim@example.com',
          name: 'Invalid Claim User',
        });

      await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          title: '',
          description: 'Invalid description',
          pointValue: -10,
        })
        .expect(400);
    });
  });

  describe('/customers/:id/claims/batch (POST)', () => {
    it('should batch create claims for a customer', async () => {
      const { body: customer } = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({ email: 'batchclaim@example.com', name: 'Batch Claim User' });

      const response = await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims/batch`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          claims: [
            {
              title: 'Batch Claim 1',
              description: 'Batch Description 1',
              pointValue: 50,
            },
            {
              title: 'Batch Claim 2',
              description: 'Batch Description 2',
              pointValue: 30,
            },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Batch Claim 1');
      expect(response.body[1].title).toBe('Batch Claim 2');
    });
  });
});
