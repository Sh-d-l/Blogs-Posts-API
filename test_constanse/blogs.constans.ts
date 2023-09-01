import request from "supertest";
import {app} from "../settings";

export const postTitle = "string";
export  const postShortDescription = "string";
export const postContent = "string"

export const foundBlogById = async () => {
    const blogs = await request(app)
        .get(urlBlogs).expect(200);
    return blogs.body.items[0].id;
}
export const foundPostById = async () => {
    const posts = await request(app)
        .get(urlPosts).expect(200);
    return posts.body.items[0].id;
}
export const blogName = "new name";
export const blogDescription = "new description";
export const blogWebsiteUrl = "https://google.com"

export const loginOrEmail = "ZZZ"
export const password = "87654321"

export const urlBlogs = "/blogs/"
export const urlPosts = "/posts/"




export const incorrectBlogName = 123
export const incorrectBlogDescription = null
export const incorrectBlogWebsiteUrl = 123

export const incorrectBlogNameLength = "1233333333333333333333333333333333333";
export const incorrectBlogDescriptionLength  = "Lorem ipsum dolor sit amet," +
    " consectetuer adipiscing elit. Aenean commodo ligula eget dolor." +
    " Aenean massa. Cum sociis natoque penatibus et magnis dis parturient " +
    "montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, " +
    "pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim" +
    " Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu." +
    " In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo." +
    " Nullam dictum felis eu pede mollis pretium. Integer tincidunt." +
    " Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate " +
    "eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae," +
    " eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, " +
    "feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet." +
    " Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue." +
    " Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus." +
    " Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper " +
    "libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, " +
    "blandit " +"vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec " +
    "odio et ante " + "tincidunt tempus." + " Donec vitae sapien ut libero " +
    "venenatis faucibus. Nullam quis ante. Etiam sit" +
    " amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris " +
    "sit" + " amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget" +
    " bibendum sodales, augue velit cursus nunc, quis gravida magna mi a" +
    " libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, " +
    "scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem " +
    "in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum " +
    "ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia " +
    "Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. " +
    "Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis," +
    " ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, c" +
    "onsectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamc" +
    "orper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium li" +
    "bero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla" +
    " eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectu" +
    "s. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque " +
    "facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo " +
    "dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapi" +
    "en, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesu" +
    "ada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec" +
    " posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum an" +
    "te ipsum primis in faucibus orci luctus et ultrices posuere cubilia Cur" +
    "ae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac" +
    " placerat dolor lectus quis orci. Phasellus consectetuer vestibulum eli" +
    "t. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fri" +
    "ngilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean pos" +
    "uere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna " +
    "dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non," +
    " turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, " +
    "sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum an" +
    "te ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; " +
    "Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas " +
    "vestibulum mollis diam.";
export const incorrectBlogWebsiteUrlLength = "https://gfthththkggggggggggggggggggggggggggggggggggg" +
    "jgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg"

export const incorrectTitlePost = 123
export const incorrectShortDescriptionPost = 123
export const incorrectContentPost = null

export const incorrectTitlePostLength = "4444444444444444444444444444444444444444444444444444444444444";
export const incorrectShortDescriptionPostLength = "Lorem ipsum dolor sit amet," +
    " consectetuer adipiscing elit. Aenean commodo ligula eget dolor." +
    " Aenean massa. Cum sociis natoque penatibus et magnis dis parturient " +
    "montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, " +
    "pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim" +
    " Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu." +
    " In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo." +
    " Nullam dictum felis eu pede mollis pretium. Integer tincidunt." +
    " Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate " +
    "eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae," +
    " eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, " +
    "feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet." +
    " Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue." +
    " Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus." +
    " Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper " +
    "libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, " +
    "blandit " +"vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec " +
    "odio et ante " + "tincidunt tempus." + " Donec vitae sapien ut libero " +
    "venenatis faucibus. Nullam quis ante. Etiam sit" +
    " amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris " +
    "sit" + " amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget" +
    " bibendum sodales, augue velit cursus nunc, quis gravida magna mi a" +
    " libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, " +
    "scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem " +
    "in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ";
export const incorrectContentPostLength = "Lorem ipsum dolor sit amet," +
    " consectetuer adipiscing elit. Aenean commodo ligula eget dolor." +
    " Aenean massa. Cum sociis natoque penatibus et magnis dis parturient " +
    "montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, " +
    "pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim" +
    " Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu." +
    " In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo." +
    " Nullam dictum felis eu pede mollis pretium. Integer tincidunt." +
    " Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate " +
    "eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae," +
    " eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, " +
    "feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet." +
    " Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue." +
    " Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus." +
    " Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper " +
    "libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, " +
    "blandit " +"vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec " +
    "odio et ante " + "tincidunt tempus." + " Donec vitae sapien ut libero " +
    "venenatis faucibus. Nullam quis ante. Etiam sit" +
    " amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris " +
    "sit" + " amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget" +
    " bibendum sodales, augue velit cursus nunc, quis gravida magna mi a" +
    " libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, " +
    "scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem " +
    "in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum " +
    "ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia " +
    "Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. " +
    "Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis," +
    " ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, c" +
    "onsectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamc" +
    "orper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium li" +
    "bero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla" +
    " eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectu" +
    "s. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque " +
    "facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo " +
    "dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapi" +
    "en, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesu" +
    "ada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec" +
    " posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum an" +
    "te ipsum primis in faucibus orci luctus et ultrices posuere cubilia Cur" +
    "ae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac" +
    " placerat dolor lectus quis orci. Phasellus consectetuer vestibulum eli" +
    "t. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fri" +
    "ngilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean pos" +
    "uere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna " +
    "dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non," +
    " turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, " +
    "sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum an" +
    "te ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; " +
    "Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas " +
    "vestibulum mollis diam." + "Lorem ipsum dolor sit amet," +
    " consectetuer adipiscing elit. Aenean commodo ligula eget dolor." +
    " Aenean massa. Cum sociis natoque penatibus et magnis dis parturient " +
    "montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, " +
    "pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim" +
    " Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu." +
    " In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo." +
    " Nullam dictum felis eu pede mollis pretium. Integer tincidunt." +
    " Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate " +
    "eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae," +
    " eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, " +
    "feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet." +
    " Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue." +
    " Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus." +
    " Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper " +
    "libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, " +
    "blandit " +"vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec " +
    "odio et ante " + "tincidunt tempus." + " Donec vitae sapien ut libero " +
    "venenatis faucibus. Nullam quis ante. Etiam sit" +
    " amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris " +
    "sit" + " amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget" +
    " bibendum sodales, augue velit cursus nunc, quis gravida magna mi a" +
    " libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, " +
    "scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem " +
    "in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum " +
    "ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia " +
    "Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. " +
    "Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis," +
    " ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, c" +
    "onsectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamc" +
    "orper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium li" +
    "bero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla" +
    " eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectu" +
    "s. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque " +
    "facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo " +
    "dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapi" +
    "en, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesu" +
    "ada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec" +
    " posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum an" +
    "te ipsum primis in faucibus orci luctus et ultrices posuere cubilia Cur" +
    "ae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac" +
    " placerat dolor lectus quis orci. Phasellus consectetuer vestibulum eli" +
    "t. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fri" +
    "ngilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean pos" +
    "uere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna " +
    "dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non," +
    " turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, " +
    "sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum an" +
    "te ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; " +
    "Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas " +
    "vestibulum mollis diam.";






