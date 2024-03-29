"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incorrectContentPostLength = exports.incorrectShortDescriptionPostLength = exports.incorrectTitlePostLength = exports.incorrectContentPost = exports.incorrectShortDescriptionPost = exports.incorrectTitlePost = exports.incorrectBlogWebsiteUrlLength = exports.incorrectBlogDescriptionLength = exports.incorrectBlogNameLength = exports.incorrectBlogWebsiteUrl = exports.incorrectBlogDescription = exports.incorrectBlogName = exports.urlPosts = exports.urlBlogs = exports.blogWebsiteUrl = exports.blogDescription = exports.blogName = exports.foundBlogById = exports.postContent = exports.postShortDescription = exports.postTitle = void 0;
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../src");
exports.postTitle = "string";
exports.postShortDescription = "string";
exports.postContent = "string";
const foundBlogById = () => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield (0, supertest_1.default)(src_1.app)
        .get(exports.urlBlogs).expect(200);
    return blogs.body.items[0].id;
});
exports.foundBlogById = foundBlogById;
exports.blogName = "new name";
exports.blogDescription = "new description";
exports.blogWebsiteUrl = "https://google.com";
exports.urlBlogs = "/blogs/";
exports.urlPosts = "/posts/";
exports.incorrectBlogName = 123;
exports.incorrectBlogDescription = null;
exports.incorrectBlogWebsiteUrl = 123;
exports.incorrectBlogNameLength = "1233333333333333333333333333333333333";
exports.incorrectBlogDescriptionLength = "Lorem ipsum dolor sit amet," +
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
    "blandit " + "vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec " +
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
exports.incorrectBlogWebsiteUrlLength = "https://gfthththkggggggggggggggggggggggggggggggggggg" +
    "jgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg";
exports.incorrectTitlePost = 123;
exports.incorrectShortDescriptionPost = 123;
exports.incorrectContentPost = null;
exports.incorrectTitlePostLength = "4444444444444444444444444444444444444444444444444444444444444";
exports.incorrectShortDescriptionPostLength = "Lorem ipsum dolor sit amet," +
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
    "blandit " + "vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec " +
    "odio et ante " + "tincidunt tempus." + " Donec vitae sapien ut libero " +
    "venenatis faucibus. Nullam quis ante. Etiam sit" +
    " amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris " +
    "sit" + " amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget" +
    " bibendum sodales, augue velit cursus nunc, quis gravida magna mi a" +
    " libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, " +
    "scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem " +
    "in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ";
exports.incorrectContentPostLength = "Lorem ipsum dolor sit amet," +
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
    "blandit " + "vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec " +
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
    "blandit " + "vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec " +
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
//# sourceMappingURL=blogs.constans.js.map