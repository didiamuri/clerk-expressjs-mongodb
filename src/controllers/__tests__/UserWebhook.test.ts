let currentEvent: any;

jest.mock('@clerk/express/webhooks', () => ({
    verifyWebhook: jest.fn().mockResolvedValue(currentEvent),
}));

import app from "@src/app";
import request from 'supertest';
import {generateEventId} from "@src/utils";
import {WebhookLog} from "@src/models";
import {UserService} from "@src/services/User";
import * as MetadataService from "@src/utils/clerk/safeUpdateMetadata";

describe('WebhookController', () => {
    const baseEvent  = {
        type: 'user.created',
        timestamp: 1654012591835,
        data: {
            id: 'user_abc123',
            public_metadata: {},
            private_metadata: {},
            email_addresses: [],
        },
    };

    beforeEach(async () => {
        await WebhookLog.deleteMany({});
        currentEvent = { ...baseEvent };
    });

    it('should skip duplicate events', async () => {
        const eventId = generateEventId(currentEvent );
        // Step 1: simulate a logged event
        await WebhookLog.create({eventId, eventType: currentEvent.type});

        // Step 2: spy on UserService.store to check that it IS NOT called
        const storeSpy = jest.spyOn(UserService, 'store');

        // Step 3: Making the request
        const response = await request(app)
            .post('/api/v1/webhooks/clerk/user')
            .send(currentEvent)
            .set('Content-Type', 'application/json');

        // Step 4: Assertions
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('duplicate_skipped');
        expect(storeSpy).not.toHaveBeenCalled();

        storeSpy.mockRestore();
    });

    it('should process a new event and store the user', async () => {
        const mockUser = {_id: 'mongoId123'};

        // Mock UserService.store to leave the real DB untouched
        const storeSpy = jest.spyOn(UserService, 'store').mockResolvedValue(mockUser as any);

        const response = await request(app)
            .post('/api/v1/webhooks/clerk/user')
            .send({})
            .set('Content-Type', 'application/json');

        // Assert that the store function is called
        expect(storeSpy).toHaveBeenCalledWith(
            baseEvent.data,
            expect.any(String), // dynamically generated accountId
            'member' // default role
        );

        // Assert that the webhook is registered
        const eventId = generateEventId(currentEvent );
        const log = await WebhookLog.findOne({eventId});
        expect(log).not.toBeNull();
        expect(log?.eventType).toBe('user.created');

        // Correct answer
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');

        storeSpy.mockRestore();
    });
});

describe('WebhookController - user.updated', () => {
    const updateEvent = {
        type: 'user.updated',
        timestamp: Date.now(),
        data: {
            id: 'user_updated_001',
            public_metadata: {
                accountId: 'account123',
                role: 'admin',
            },
            private_metadata: {},
        },
    };

    beforeEach(async () => {
        await WebhookLog.deleteMany({});
        currentEvent = { ...updateEvent };
    });

    it('should update user and metadata for user.updated event', async () => {
        const mockUser = {_id: 'mongoId123'};

        const updateSpy = jest.spyOn(UserService, 'update').mockResolvedValue(mockUser as any);
        const metaSpy = jest.spyOn(MetadataService, 'safeUpdateMetadata').mockResolvedValue(undefined);

        const res = await request(app)
            .post('/api/v1/webhooks/clerk/user')
            .send({})
            .set('Content-Type', 'application/json');

        expect(updateSpy).toHaveBeenCalledWith(
            updateEvent.data,
            'account123',
            'admin'
        );

        expect(metaSpy).toHaveBeenCalledWith(
            'user_updated_001',
            {accountId: 'account123', role: 'admin'},
            {_id: 'mongoId123'}
        );

        const eventId = generateEventId(currentEvent);
        const log = await WebhookLog.findOne({eventId});
        expect(log).not.toBeNull();
        expect(log?.eventType).toBe('user.updated');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');

        updateSpy.mockRestore();
        metaSpy.mockRestore();
    });
});

describe('WebhookController - user.deleted', () => {
    const deleteEvent = {
        type: 'user.deleted',
        timestamp: Date.now(),
        data: {
            id: 'user_to_delete',
        },
    };

    beforeEach(async () => {
        await WebhookLog.deleteMany({});
        currentEvent = { ...deleteEvent };
    });



    it('should mark user as deleted and log the event', async () => {
        const deleteSpy = jest.spyOn(UserService, 'delete').mockResolvedValue({_id: 'mongoId456'} as any);

        const res = await request(app)
            .post('/api/v1/webhooks/clerk/user')
            .send({})
            .set('Content-Type', 'application/json');

        expect(deleteSpy).toHaveBeenCalledWith('user_to_delete');

        const eventId = generateEventId(currentEvent);
        const log = await WebhookLog.findOne({eventId});
        expect(log).not.toBeNull();
        expect(log?.eventType).toBe('user.deleted');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');

        deleteSpy.mockRestore();
    });
});

