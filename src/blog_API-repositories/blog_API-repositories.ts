const blogs: BlogType[] = [];

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}
export const blogs_repositories = {
    getBlog() {
        return blogs;
    },
    createBlog(name: string, description: string, websiteUrl: string) {
        const time = new Date().toISOString();
        const newBlog: BlogType = {
            id: time,
            name: name,
            description: description,
            websiteUrl: websiteUrl,
        }
        blogs.push(newBlog)
        return blogs;

    },
    getBlog_ID(id: string) {
        const foundID = blogs.find((elem) => elem.id === id)
        return foundID;
    },
    updateBlog(id: string, name: string, description: string, websiteUrl: string,) {
        let findID = blogs.find((elem) => elem.id == id);
        if (findID) {
            findID.name = name;
            findID.description = description;
            findID.websiteUrl = websiteUrl;
            return true;
        } else {
            return false;
        }
    },
    deleteID(id: string) {
        for(let i = 0; i < blogs.length;i++) {
            if(blogs[i].id === id) {
                blogs.splice(i,1)
                return true;
            }
            else {
                return false;
            }
        }
        /*let found_blog_by_ID = blogs.filter((elem) => elem.id === id);
        if (found_blog_by_ID.length > 0) {
            blogs.splice(blogs.indexOf(found_blog_by_ID[0]), 1)
            console.log(found_blog_by_ID)
            return true;
        } else {
            return false;
        }*/
    },
    deleteAll() {
        blogs.splice(0, blogs.length)
        return true;
    }
}
