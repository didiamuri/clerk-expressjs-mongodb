import express from 'express';

const bodyParser = [
    express.json(),
    express.urlencoded({ extended: true }),
];

export default bodyParser;