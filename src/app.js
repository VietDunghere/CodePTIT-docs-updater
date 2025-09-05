import _ from 'lodash';
import path from 'path';
import check_env from './utils/check_env.js';

import { google } from 'googleapis';
import { fileURLToPath } from 'url';
import { getQuestionsInPage } from './api/index.js';
import { getCodePtitCookie } from './utils/get_codeptit_cookie.js';

import * as ggdocsController from './controllers/ggdocs.controller.js'

import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

check_env();

getCodePtitCookie()
    .then(({ cookie }) => {
        Promise.all([1, 2, 3, 4].map((page) => getQuestionsInPage(page, cookie)))
            .then(async (res) => {
                const problems = res.map((page) => [...page.incomplete_question_list, ...page.complete_question_list]);
                let problemArray = _.flatten(problems);
                problemArray = _.uniqBy(problemArray, (problem) => problem.problemID);
                const incomplete_question_list = problemArray.filter(
                    (problem) => problem.problemStatus === 'Incomplete',
                );
                const complete_question_list = problemArray.filter((problem) => problem.problemStatus === 'Complete');
                console.clear();
                console.log('\x1b[32m%s\x1b[0m', `Login success!`);
                console.log('> Total problems: ', problemArray.length);
                console.log('> Incomplete problems: ', incomplete_question_list.length);
                console.log('> Complete problems: ', complete_question_list.length);
                return complete_question_list;
            })
            .then(async (res) => {
                // Setup
                const auth = new google.auth.GoogleAuth({
                    keyFile: path.join(__dirname, 'resources', 'service-account.json'),
                    scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
                });
                const docs = google.docs({
                    version: 'v1',
                    auth,
                });
                const documentId = process.env.DOC_ID;
                // await ggdocsController.update_headers({ docs, documentId });
                await ggdocsController.addRow({
                    docs,
                    documentId,
                    row_num: res.length,
                });
                await ggdocsController.updateData({
                    docs,
                    documentId,
                    target_id: 1,
                    question_list: res,
                });
            })
            .catch((err) => {
                console.log('\x1b[31m%s\x1b[0m', `[Docs Failed] Error: ${err.message}`);
            });
    })
    .catch((err) => {
        console.log(
            '\x1b[31m%s\x1b[0m',
            `[Get Cookie Failed] Login failed! Check your cookie and .env file! Error: ${err.message}`,
        );
    });
