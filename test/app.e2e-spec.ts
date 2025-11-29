import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { type App } from 'supertest/types';

describe('Insurance API (E2E)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let testPartnerName: string;
  let jwtService: JwtService;
  let validTokenForTests: string;
  let customerCreationResponse: { body: { id: string } };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();

    dataSource = moduleFixture.get(DataSource);

    await dataSource.runMigrations();

    testPartnerName = 'Test Partner';

    validTokenForTests = jwtService.sign({
      name: testPartnerName,
      sub: 1,
    });
  });

  afterAll(async () => {
    await dataSource.query(`
      TRUNCATE TABLE "customer", "claim", "partner", "customer_partner_period" RESTART IDENTITY CASCADE;
    `);
    await dataSource.undoLastMigration();
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
      const testPartnerResult: {
        body: { apiKey: string };
      } = await request(app.getHttpServer())
        .post('/auth/create-partner')
        .set('x-admin-api-key', 'my_admin_api_key')
        .send({
          partnerName: testPartnerName,
        });

      return request(app.getHttpServer())
        .get('/auth/login')
        .set('X-API-Key', testPartnerResult.body.apiKey)
        .expect(200)
        .expect((res: { body: { access_token: string } }) => {
          expect(res.body).toHaveProperty('access_token');
          const decodedToken = jwtService.verify<Record<string, unknown>>(
            res.body.access_token,
          );
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
      const testPartnerResult: { body: { apiKey: string } } = await request(
        app.getHttpServer(),
      )
        .post('/auth/create-partner')
        .set('x-admin-api-key', 'my_admin_api_key')
        .send({
          partnerName: testPartnerName,
        });

      const validApiKey = testPartnerResult.body.apiKey;

      const response: { body: { access_token: string } } = await request(
        app.getHttpServer(),
      )
        .get('/auth/login')
        .set('X-API-Key', validApiKey);

      validToken = response.body.access_token;
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
      const response: {
        status: number;
        body: { email: string; name: string };
      } = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          email: 'test@example.com',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
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
      customerCreationResponse = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          email: 'noclaims@example.com',
          name: 'No Claims User',
        });

      const response = await request(app.getHttpServer())
        .get(`/customers/${customerCreationResponse.body.id}`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .expect(200);

      expect(response.body).toEqual({
        email: 'noclaims@example.com',
        id: customerCreationResponse.body.id,
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
      customerCreationResponse = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          email: 'claimuser@example.com',
          name: 'Claim User',
        });

      const customer = customerCreationResponse.body;

      await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          description: 'Description of claim 1',
          pointValue: 100,
          title: 'Claim 1',
        });

      await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          description: 'Description of claim 2',
          pointValue: 58,
          title: 'Claim 2',
        });

      await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          description: 'Description of claim 2',
          pointValue: 19,
          title: 'Claim 3',
        });

      await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims/batch`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          claims: [
            {
              description: 'Batch Description 1',
              pointValue: 50,
              title: 'Batch Claim 1',
            },
            {
              description: 'Batch Description 2',
              pointValue: 30,
              title: 'Batch Claim 2',
            },
          ],
        });

      const response: { body: { totalPoints: number } } = await request(
        app.getHttpServer(),
      )
        .get(`/customers/${customer.id}`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .expect(200);

      expect(response.body.totalPoints).toBe(30 + 50 + 19 + 58 + 100);
    });
  });

  describe('/customers/:id/claims (POST)', () => {
    it('should create a new claim for a customer', async () => {
      customerCreationResponse = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          email: 'claimuser@example.com',
          name: 'Claim User',
        });

      const customer = customerCreationResponse.body;
      const response: { body: { title: 'string'; pointValue: number } } =
        await request(app.getHttpServer())
          .post(`/customers/${customer.id}/claims`)
          .set('Authorization', `Bearer ${validTokenForTests}`)
          .send({
            description: 'Description of claim 1',
            pointValue: 100,
            title: 'Claim 1',
          })
          .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Claim 1');
      expect(response.body.pointValue).toBe(100);
    });

    it('should fail to create a claim with invalid data', async () => {
      customerCreationResponse = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          email: 'invalidclaim@example.com',
          name: 'Invalid Claim User',
        });

      const customer = customerCreationResponse.body;

      await request(app.getHttpServer())
        .post(`/customers/${customer.id}/claims`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          description: 'Invalid description',
          pointValue: -10,
          title: '',
        })
        .expect(400);
    });
  });

  describe('/customers/:id/claims/batch (POST)', () => {
    it('should batch create claims for a customer', async () => {
      customerCreationResponse = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          email: 'batchclaim@example.com',
          name: 'Batch Claim User',
        });

      const customer = customerCreationResponse.body;

      const response: { body: { title: string }[]; status: number } =
        await request(app.getHttpServer())
          .post(`/customers/${customer.id}/claims/batch`)
          .set('Authorization', `Bearer ${validTokenForTests}`)
          .send({
            claims: [
              {
                description: 'Batch Description 1',
                pointValue: 50,
                title: 'Batch Claim 1',
              },
              {
                description: 'Batch Description 2',
                pointValue: 30,
                title: 'Batch Claim 2',
              },
            ],
          });

      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Batch Claim 1');
      expect(response.body[1].title).toBe('Batch Claim 2');
    });
  });

  describe('/customers/:id/contracts (POST)', () => {
    it('should fail when creating overlapping contracts for same customer and partner', async () => {
      // Create a customer first
      customerCreationResponse = await request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          email: 'overlap@example.com',
          name: 'Overlap Test User',
        });

      const customer = customerCreationResponse.body;

      // Create first contract
      const response = await request(app.getHttpServer())
        .post(`/customers/${customer.id}/contracts`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          endDate: new Date('2024-12-31'),
          startDate: new Date('2024-01-01'),
        });

      expect(response.status).toBe(201);

      // Try to create overlapping contract
      const response2 = await request(app.getHttpServer())
        .post(`/customers/${customer.id}/contracts`)
        .set('Authorization', `Bearer ${validTokenForTests}`)
        .send({
          endDate: new Date('2025-05-31'),
          startDate: new Date('2024-06-01'),
        });

      expect(response2.status).toBe(500);
    });
  });

  describe('/michelin-search (GET)', () => {
    it('should retrieve seafood restaurants in NY', async () => {
      const getRestaurantsResponse = await request(app.getHttpServer())
        .get('/michelin-search')
        .query({
          cuisine: 'Seafood',
          city: 'New York',
        })
        .send();

      expect(getRestaurantsResponse.status).toBe(200);
      expect(getRestaurantsResponse.body).toEqual([
        {
          name: "ZZ's Clam Bar",
          year: '2019',
          pin: {
            location: {
              lat: '40.727646',
              lon: '-74.00046',
            },
          },
          city: 'New York',
          region: 'New York City',
          zipCode: '10012',
          cuisine: 'Seafood',
          price: '$$$$',
          url: 'https://guide.michelin.com/us/en/new-york-state/new-york/restaurant/zz-s-clam-bar',
          star: '1',
        },
        {
          name: 'Marea',
          year: '2019',
          pin: {
            location: {
              lat: '40.76749',
              lon: '-73.98114',
            },
          },
          city: 'New York',
          region: 'New York City',
          zipCode: '10019',
          cuisine: 'Seafood',
          price: '$$$$',
          url: 'https://guide.michelin.com/us/en/new-york-state/new-york/restaurant/marea',
          star: '2',
        },
        {
          name: 'Le Bernardin',
          year: '2019',
          pin: {
            location: {
              lat: '40.76177',
              lon: '-73.98223',
            },
          },
          city: 'New York',
          region: 'New York City',
          zipCode: '10019',
          cuisine: 'Seafood',
          price: '$$$$',
          url: 'https://guide.michelin.com/us/en/new-york-state/new-york/restaurant/le-bernardin',
          star: '3',
        },
      ]);
    });
  });
});
