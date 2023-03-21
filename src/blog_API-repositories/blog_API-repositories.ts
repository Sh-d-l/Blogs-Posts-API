import {addDays} from "date-fns";

const blogs:BlogType[] = [];
    type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}
export const blogs_repositories = {
    getBlog () {
        return blogs;
    },
    createBlog (name:string,description:string,websiteUrl:string) {
        const time = new Date ().toISOString();
        const newBlog:BlogType = {
            id: time,
            name: name,
            description: description,
            websiteUrl:websiteUrl,
        }
        blogs.push(newBlog)
        return blogs;
    },
    getBlog_ID (id:string) {

    }



}