import jwt from "jsonwebtoken"

export const jwtService = {
    async createAccessToken(deviceId:string) {
        return jwt.sign({deviceId}, 'secret', {expiresIn: '10s'})
    },
    async createRefreshToken(deviceId:string, lastActiveDate: Date) {
        return jwt.sign({deviceId,lastActiveDate}, 'secret', {expiresIn: '20s'} )
    },
    async getPayloadRefreshToken(token: string): Promise<[string, Date] | null> {
        try {
            const result = jwt.verify(token, 'secret') as {deviceId: string, lastActiveDate: Date }
            return [result.deviceId, result.lastActiveDate]
        } catch (error) {
            console.log(error)
            return null
        }
    },
    async getUserIdByAccessToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, 'secret') as {id: string }
            return result.id
        } catch (error) {
            console.log(error)
            return null
        }
    },
}
/*---*/