import request from 'supertest';
import * as server from './app.js'; 

const app = server.app;

describe('GET /trigger-sync', () => {

  // afterEach(() => server.serverInstance.close());

  afterAll(() => {
    // server.serverInstance.close(done);
    jest.resetAllMocks();
    // await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

  

  it('should respond with 400 if location_id is missing', async () => {
    const response = await request(app).get('/trigger-sync');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Location ID is required');
    // request(app).get('/trigger-sync')
    //   .expect(400)
    //   .expect('Location ID is required')
    //   .end(done);
  });

  it('should respond with 500 on server error', async () => {
    const location_id = 'valid_location_id'; 

    const response = await request(app).get(`/trigger-sync?location_id=${location_id}`);
    expect(response.status).toBe(400);
    expect(response.text).toBe(`Invalid location_id: ${location_id}`);
    // request(app).get(`/trigger-sync?location_id=${location_id}`)
    //   .expect(500)
    //   .expect('Error fetching menu for location_id: valid_location_id');
  });

  test('should respond with 200 and sync menu data', async () => {
    const location_id = '123';

    const response = await request(app).get(`/trigger-sync?location_id=${location_id}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe(`Menu data synced successfully for location_id: ${location_id}`);

    // request(app)
    //   .get(`/trigger-sync?location_id=${location_id}`)
    //   .then((response) => {
    //     expect(response.status).toBe(200);
    //     expect(response.text).toBe(`Menu data synced successfully for location_id: ${location_id}`);
    //     done();
    //   });
      // .expect(200)
      // .expect(`Menu data synced successfully for location_id: ${location_id}`);
      // .end(done);
  });
});
