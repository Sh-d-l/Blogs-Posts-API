import {runDB} from "./mongoDB/db"
import {app} from "./settings";

process.on('unhandledRejection', function (reason, p) {
    console.error('ERROR')
    console.error(reason, p)
})
const port = process.env.PORT || 5000

const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};
startApp();

