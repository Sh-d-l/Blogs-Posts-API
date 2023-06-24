export type TUsersWithHashEmailDb = {
    id: string,
    login: string,
    email: string,
    userHash: string,
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string,
        expirationTime: Date,
        isConfirmed: boolean,
    }
}
export type TUsersWithHashDb = {
    id: string,
    login: string,
    email: string,
    userHash: string,
    createdAt: string;
}

export type TBlogDb = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
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
export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: string,
}
export type CommentType = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}
export type CommentTypeWithPostId = {
    postId: string,
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}
export type TUsersDb = {
    id: string,
    login: string,
    email: string,
    createdAt: string;
}

export type TypeGetUsersWithCount = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: TUsersDb[]
}