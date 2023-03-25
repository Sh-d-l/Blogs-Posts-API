const posts:PostType[] = [];
type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}
export const posts_repositories = {
    getPost () {
        return posts;
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string,blogName:string) {
        const time = new Date ().toISOString();
        const newPost:PostType = {
            id: time,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName
        }
        posts.push(newPost)
        return posts;

    },
    getPost_ID (id:string) {
        return posts.find((elem) => elem.id === id )
    },
    updatePost(id:string,title:string, shortDescription:string, content:string,blogId: string,) {
        let findID = posts.find((elem) => elem.id === id );
        if(findID) {
            findID.title = title;
            findID.shortDescription = shortDescription;
            findID.content = content;
            findID.blogId = blogId
            return true;
        }
        else {
            return false;
        }
    },
    deleteID (id:string) {
        let found_blog_by_ID = posts.filter((elem) => elem.id === id );
        if(found_blog_by_ID.length > 0) {
            posts.splice(posts.indexOf(found_blog_by_ID[0]),1)
            return true;
        }
        else {
            return  false;
        }
    },
}