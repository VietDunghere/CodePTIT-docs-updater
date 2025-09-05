import axios from 'axios';
import * as cheerio from 'cheerio';
import config from '../config/config.js';

class ProblemInfo {
    constructor(problemName, problemLink, problemID, problemStatus, problemTopic, problemDifficulty) {
        this.problemName = problemName;
        this.problemLink = problemLink;
        this.problemID = problemID;
        this.problemStatus = problemStatus;
        this.problemTopic = problemTopic;
        this.problemDifficulty = problemDifficulty;
    }
}

const GET = (endpoint, debug = false, page = 1, cookie) => {
    if (debug) console.log(`GET ${config.api.host}${config.api[endpoint]}?page=${page}`);
    return axios.get(`${config.api.host}${config.api[endpoint]}?page=${page}`, {
        headers: {
            Cookie: cookie,
            'User-Agent':
                'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
        },
    });
};

const getQuestionsInPage = async (page, cookie) => {
    const res = await GET('FETCH_QUESTION', false, page, cookie);
    const complete_question_list = [];
    const incomplete_question_list = [];
    const $ = cheerio.load(res.data);
    const questions_table = $('.status .ques__table__wrapper table.ques__table tbody');
    questions_table.find('tr').each((i, el) => {
        const element = $(el);
        let problemName = element.find('td:nth-child(4)').text();
        const problemLink = element.find('td:nth-child(4) a').attr('href');
        let problemID = element.find('td:nth-child(3)').text();
        problemID = problemID.replace(/^\s+|\s+$/g, '');
        const problemTopic = element.find('td:nth-child(6)').text();
        const problemDifficulty = element.find('td:nth-child(7)').text();

        problemName = problemName.replace(/^\s+|\s+$/g, '');
        if (element.hasClass('bg--10th')) {
            complete_question_list.push(
                new ProblemInfo(problemName, problemLink, problemID, 'Complete', problemTopic, problemDifficulty),
            );
        } else {
            incomplete_question_list.push(
                new ProblemInfo(problemName, problemLink, problemID, 'Incomplete', problemTopic, problemDifficulty),
            );
        }
    });
    return {
        complete_question_list,
        incomplete_question_list,
    };
};

export { GET, getQuestionsInPage };
