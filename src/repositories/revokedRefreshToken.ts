// import {RevokedRToken} from "../types/types";
//
// export const repoRefreshToken = {
//         async addBlackListRefreshTokens(token: RevokedRToken) {
//             return await blackListRefreshTokenCollection.insertOne({...token})
//         },
//         async blacklistedRefreshTokenSearch(refreshToken: RevokedRToken):Promise<boolean> {
//             const refreshTokenInBlackList = await blackListRefreshTokenCollection.findOne(refreshToken)
//             return !!refreshTokenInBlackList
//         }
//         }
