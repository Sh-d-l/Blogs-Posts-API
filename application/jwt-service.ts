import jwt from "jsonwebtoken"
import {TUsersDb} from "../src/users_API-repositories/usersRepositoriesQuery";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJwt(authUser: TUsersDb) {
        debugger
        const token = jwt.sign({id: authUser.id}, 'secret', {expiresIn: '10h'})
        return token;
    },
    async getUserIdByToken(token:string) {
        try {
            const result = jwt.verify(token,'secret')
            console.log(result, "result")
            //console.log(result.id)
            return result.id
        }
        catch (error) {
            return null
        }
    },
}