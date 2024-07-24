import { beforeAll, afterAll, it, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it('should be able to create a new transaction', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)
    })

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        // Ensure cookies is a string by joining the array, if it is an array
        const cookieHeader = cookies ? cookies.join('; ') : ''

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookieHeader)
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New Transaction',
                amount: 5000,
            })
        ])
    })
})