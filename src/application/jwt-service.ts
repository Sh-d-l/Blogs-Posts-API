import jwt from "jsonwebtoken"
import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";

export const jwtService = {
    async createJwt(authUser: TUsersDb) {
        return jwt.sign({id: authUser.id}, 'secret', {expiresIn: '10h'})
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