import cors from "cors";

export const authorizedDomains = process.env['AUTHORIZED_DOMAINS']?.split(',');

export default cors({
    origin: authorizedDomains,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
})