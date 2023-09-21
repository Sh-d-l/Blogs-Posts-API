import {runDB} from "./mongoDB/db"
import cookieParser from 'cookie-parser';

import {app} from "./settings";

process.on('unhandledRejection', function (reason, p) {
    console.error('ERROR')
    console.error(reason, p)
})

export const port = process.env.PORT || 5000

app.use(cookieParser())
app.set('trust proxy', true)

export const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};
startApp();