import jwt from "jsonwebtoken"
import {TUsersDb} from "../src/users_API-repositories/usersRepositoriesQuery";

export const jwtService = {
    async createJwt(authUser: TUsersDb) {
        const token = jwt.sign({id: authUser.id, login: authUser.login}, 'secret', {expiresIn: '1h'})
        return token;
    }
}