import jwt from "jsonwebtoken"

export const jwtService = {
    async createAccessToken(deviceId:string) {
        return jwt.sign({deviceId}, 'secret', {expiresIn: '10s'})
    },
    async createRefreshToken(deviceId:string) {
        return jwt.sign({deviceId}, 'secret', {expiresIn: '20s'} )
    },
    async getDeviceIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, 'secret') as {id: string}
            return result.id
        } catch (error) {
            console.log(error)
            return null
        }
    },
}