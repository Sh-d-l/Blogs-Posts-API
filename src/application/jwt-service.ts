import jwt from "jsonwebtoken"
import {TUsersDb} from "../types/types";

export const jwtService = {
    async createAccessToken(authUser: TUsersDb) {
        return jwt.sign({id: authUser.id}, 'secret', {expiresIn: '10s'})
    },
    async createRefreshToken(authUser:TUsersDb) {
        return jwt.sign({id:authUser.id}, 'secret', {expiresIn: '20s'} )
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, 'secret') as {id: string}
            return result.id
        } catch (error) {
            return null
        }
    },
}