import jwt, {JwtPayload} from "jsonwebtoken"
import {TUsersDb} from "../types/types";

export const jwtService = {
    async createAccessToken(authUser: TUsersDb) {
        return jwt.sign({id: authUser.id}, 'secret', {expiresIn: '10s'})
    },
    async createRefreshToken(authUser:TUsersDb) {
        return jwt.sign({id:authUser.id}, 'secret', {expiresIn: '20s'} )
    },
    async verifyRefreshToken(refreshToken:string):Promise<string | null> {
        try {
            const verifyToken = jwt.verify(refreshToken,'secret')
            return verifyToken.
        }
        catch (error) {
            return null
        }
    },
    // async logout(refreshToken:string) {
    //
    // },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, 'secret') as {id: string}
            return result.id
        } catch (error) {
            return null
        }
    },
}