import {RevokedRToken} from "../types/types";
import {revokedRTokenCollection} from "./db";

export const repoRefreshToken = {
    async revokedTokens (token: RevokedRToken){
         return await revokedRTokenCollection.insertOne({...token})
    }
}