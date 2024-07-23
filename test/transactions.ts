
import { beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { it } from 'node:test'

describe('Transactions routes', () => {
    beforeAll(async() => {
        await app.ready()
    })
    
    afterAll(async()=> {
        await app.close()
    }) 
    
    it('User can create a new transaction', async() => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)
    })
})
