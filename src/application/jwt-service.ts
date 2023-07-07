import jwt from "jsonwebtoken"

export const jwtService = {
    async createAccessToken(id:string) {
        return jwt.sign({id:id}, 'secret', {expiresIn: '10s'})
    },
    async createRefreshToken(id:string) {
        return jwt.sign({id:id}, 'secret', {expiresIn: '20m'} )
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, 'secret') as {id: string}
            return result.id
        } catch (error) {
            console.log(error)
            return null
        }
    },
}