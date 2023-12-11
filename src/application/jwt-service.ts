import jwt from "jsonwebtoken"

export const jwtService = {
    async createAccessToken(deviceId:string, userId:string) {
        return jwt.sign({deviceId, userId}, 'secret', {expiresIn: '10h'})
    },
    async createRefreshToken(deviceId:string, lastActiveDate: Date, userId:string) {
        return jwt.sign({deviceId,lastActiveDate,userId}, 'secret', {expiresIn: '10h'} )
    },
    async createRefreshTokenForTests(id: string | undefined) {
        return jwt.sign({id}, 'secret', {expiresIn: '0h'} )
    },
    async getPayloadRefreshToken(token: string): Promise<[string, Date, string] | null> {
        try {
            const result = jwt.verify(token, 'secret') as {deviceId: string, lastActiveDate: Date, userId:string }
            return [result.deviceId, result.lastActiveDate, result.userId]
        } catch (error) {
            console.log(error)
            return null
        }
    },
    async getUserIdByAccessToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, 'secret') as {userId:string, deviceId:string }
            return result.userId
        } catch (error) {
            console.log(error)
            return null
        }
    },
}
