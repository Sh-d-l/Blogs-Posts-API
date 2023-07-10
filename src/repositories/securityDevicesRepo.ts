import {refreshTokenMetaCollection} from "./db";
import {TypeRefreshTokenMeta} from "../types/types";

export const securityDevicesRepo = {
    async addRefreshTokenMeta(object: TypeRefreshTokenMeta) {
        await refreshTokenMetaCollection.insertOne(object)
    }

}
