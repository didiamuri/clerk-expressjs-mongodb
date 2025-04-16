import request from "supertest";
import app from "../src/app";

describe('app', () => {
    test("should return a status 200 if server is running", async () => {
        const response = await request(app).get('/api/v1').send({}).set({ Accept: 'application/json' })
        expect(response.status).toBe(200);
    });
});