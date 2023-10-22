export class TypeCustomRateLimit{
    constructor(public IP:string,
                public URL:string,
                public date:Date) {
    }
}
// export type TypeCustomRateLimit = {
//     IP:string,
//     URL:string,
//     date:Date
// }

export class CreateObjectOfUserForClient{
    constructor( public id: string,
                 public login: string,
                 public email: string,
                 public createdAt: string) {
    }
}
// export type TUsersDb = {
//     id: string,
//     login: string,
//     email: string,
//     createdAt: string;
// }


export class CreateUsersWithConfirmationCode {
    constructor(  public  id: string,
                  public login: string,
                  public email: string,
                  public createdAt: string,
                  public userHash: string,
                  public emailConfirmation: {
                        confirmationCode: string,
                        expirationTime: Date,
                        isConfirmed: boolean,
                      }){}
}
// export type TUsersWithHashEmailDb = {
//     id: string,
//     login: string,
//     email: string,
//     userHash: string,
//     createdAt: string;
//     emailConfirmation: {
//         confirmationCode: string,
//         expirationTime: Date,
//         isConfirmed: boolean,
//     }
// }
export class TypeRefreshTokenMeta {
    constructor(public userId:string,
                public deviceId: string,
                public ip:string,
                public lastActiveDate: Date,
                public title:string | undefined,) {
    }
}
// export type  TypeRefreshTokenMeta= {
//     userId:string,
//     deviceId: string,
//     ip:string,
//     lastActiveDate: Date,
//     title:string | undefined,
// }
export class TypeRecoveryCode{
    constructor(public userId:string,
                public recoveryCode:string,
                public expirationTime:Date,) {
    }
}
// export type TypeRecoveryCode = {
//     userId:string,
//     recoveryCode:string,
//     expirationTime:Date,
// }
export class TBlogDb{
    constructor(public id: string,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string,
                public isMembership: boolean) {
    }
}
// export type TBlogDb = {
//     id: string,
//     name: string,
//     description: string,
//     websiteUrl: string,
//     createdAt: string,
//     isMembership: boolean
// }

export class PostType {
    constructor(public id: string,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string) {
    }
}
// export type PostType = {
//     id: string,
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//     blogName: string
//     createdAt: string,
// }
export class CommentType{
    constructor(public id: string,
                public content: string,
                public commentatorInfo: {
                    userId: string,
                    userLogin: string
                },
                public createdAt: string,
                public likesInfo:{
                    likesCount: number,
                    dislikesCount: number,
                    myStatus: string,
                }
    ) {}
}
// export type CommentType = {
//     id: string,
//     content: string,
//     commentatorInfo: {
//         userId: string,
//         userLogin: string
//     },
//     createdAt: string
// }
export class CommentTypeWithPostId{
    constructor(public postId: string,
                public id: string,
                public content: string,
                public commentatorInfo: {
                    userId: string,
                    userLogin: string
                },
                public createdAt: string,
                public likesInfo:{
                    likesCount: number,
                    dislikesCount: number,
                    myStatus: string,
                }
                ) {
    }
}
// export type CommentTypeWithPostId = {
//     postId: string,
//     id: string,
//     content: string,
//     commentatorInfo: {
//         userId: string,
//         userLogin: string
//     },
//     createdAt: string
// }



export interface IPagination {
    searchLoginTerm: string,
    searchEmailTerm: string,
    searchNameTerm: string,
    sortBy: any,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
    skip: number
}
export type RevokedRToken = {
    refreshToken: string
}
export type TypeGetUsersWithCount = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CreateObjectOfUserForClient[]
}
export type TypeGetBlogsWithCount = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: TBlogDb[]
}

export type TypeGetPostsByBlogId = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostType[]
}
export type TypeGetCommentsByPostId = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentType[]
}





