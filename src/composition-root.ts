import {CreateUserService} from "./service/userService";
import {UsersRepoDb} from "./repositories/users_API-repositories-db";
import {SecurityDevicesRepo} from "./repositories/securityDevicesRepo";
import {AuthController} from "./routers/authRouter";
import {SuperAdminUserController} from "./routers/users_API-router";
import {UsersQueryRepo} from "./repositories/usersRepositoriesQuery";
import {SuperAdminUserService} from "./service/superAdminUserService";
import {BlogsService} from "./service/blog_API-service";
import {BlogsRepoQuery} from "./repositories/blogRepositoriesQuery";
import {BlogsRepo} from "./repositories/blog_API-repositories-db";
import {PostsRepo} from "./repositories/post_API-repositories-db";
import {CommentsService} from "./service/comments_API-service";
import {CommentsRepo} from "./repositories/comments_API-repositories";
import {PostService} from "./service/post_API-service";
import {PostsRepoQuery} from "./repositories/postRepositoriesQuery";
import {BlogsController} from "./routers/blog_API-router";
import {CommentsController} from "./routers/comments_API-router";
import {PostsController} from "./routers/post_API-router";
import {SecurityDevicesController} from "./routers/securityDevicesRouter";
import {SecurityDevicesService} from "./service/securityDevicesService";
import {LikeStatusRepo} from "./repositories/likeStatusRepo";
import {Container} from "inversify";
//import {CheckUserIdMiddleware} from "./middlewares/checkUserIdMiddleware";

export const container = new Container()
container.bind(AuthController).to(AuthController)
container.bind(BlogsController).to(BlogsController)
container.bind(CommentsController).to(CommentsController)
container.bind(PostsController).to(PostsController)
container.bind(SecurityDevicesController).to(SecurityDevicesController)
container.bind(BlogsService).to(BlogsService)
container.bind(CreateUserService).to(CreateUserService)
container.bind(CommentsService).to(CommentsService)
container.bind(SecurityDevicesService).to(SecurityDevicesService)
container.bind(PostService).to(PostService)
container.bind(SuperAdminUserService).to(SuperAdminUserService)
container.bind(CommentsRepo).to(CommentsRepo)
container.bind(BlogsRepo).to(BlogsRepo)
container.bind(UsersRepoDb).to(UsersRepoDb)
container.bind(LikeStatusRepo).to(LikeStatusRepo)
container.bind(SecurityDevicesRepo).to(SecurityDevicesRepo)
container.bind(PostsRepo).to(PostsRepo)
container.bind(BlogsRepoQuery).to(BlogsRepoQuery)
container.bind(PostsRepoQuery).to(PostsRepoQuery)
container.bind(UsersQueryRepo).to(UsersQueryRepo)

// export const usersRepo = new UsersRepoDb()
// export const securityDevicesRepo = new SecurityDevicesRepo()
// export const userService = new CreateUserService(usersRepo,securityDevicesRepo)
// export const authController = new AuthController(userService)
// export const superAdminUserService = new SuperAdminUserService(usersRepo)
// export const usersQueryRepo = new UsersQueryRepo();
// export const superAdminUserController = new SuperAdminUserController(superAdminUserService,usersQueryRepo)
// export const blogsRepo = new BlogsRepo();
// export const postsRepo = new PostsRepo();
// export const likeStatusRepo = new LikeStatusRepo()
// export const blogsRepoQuery = new BlogsRepoQuery();
// export const commentsRepo = new CommentsRepo();
// export const blogsService = new BlogsService(blogsRepo,postsRepo);
// export const blogsController = new BlogsController(blogsService, blogsRepoQuery)
// export const commentsService = new CommentsService(commentsRepo,likeStatusRepo);
// export const commentsController = new CommentsController(commentsService)
// export const postService = new  PostService(blogsRepo, postsRepo);
// export const postsRepoQuery = new PostsRepoQuery();
// export const postsController = new PostsController(postService, postsRepoQuery)
// export const securityDevicesService = new SecurityDevicesService(securityDevicesRepo)
// export const securityDevicesController = new SecurityDevicesController(securityDevicesService)
// //export const checkUserIdMiddleware = new CheckUserIdMiddleware(commentsService)
