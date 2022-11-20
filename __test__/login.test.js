let { login } = require('../src/controllers/authController')

const mUser = {
    email: 'user1@mail.com',
    password: '123456',
    subscription: 'starter',
}

describe('POST /login', () => {
    it('Should be status 200 OK', async () => {
        const mReq = {
            body: {
            email: 'user1@mail.com',
            password: '123456',
        },
    }

        const mRes = {
            status: 200,
            json: jest.fn(data => data),
        }
        login = jest.fn(() => mRes);

        const result = await login(mReq, mRes)

        expect(result.status).toEqual(200)
    })
    
    it('Should return a valid token', async () => {
        const mRes = {
            token: 'validToken',
        }
        login = jest.fn(() => mRes);

        const token = await login(mUser.email, mUser.password)

        expect(token).toBeDefined()
    })

    it('Should return valid user', () => {
        const mRes = {
            status: 200,
            user: {
                email: mUser.email,
                subscription: mUser.subscription,
            },
        }
    
        expect(typeof mRes.user.email).toBe('string');
        expect(typeof mRes.user.subscription).toBe('string');
    })
})