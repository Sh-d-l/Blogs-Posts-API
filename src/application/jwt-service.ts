import jwt from "jsonwebtoken"

export const jwtService = {
    async createAccessToken(deviceId:string) {
        return jwt.sign({deviceId}, 'secret', {expiresIn: '10h'})
    },
    async createRefreshToken(deviceId:string, lastActiveDate: Date, title:string | undefined) {
        return jwt.sign({deviceId,lastActiveDate,title}, 'secret', {expiresIn: '20h'} )
    },
    async getPayloadRefreshToken(token: string): Promise<[string, Date, string | undefined] | null> {
        try {
            const result = jwt.verify(token, 'secret') as {deviceId: string, lastActiveDate: Date, title:string }
            return [result.deviceId, result.lastActiveDate, result.title]
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