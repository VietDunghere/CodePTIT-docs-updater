import axios from 'axios';
import * as cheerio from 'cheerio';
import config from '../config/config.js';

import 'dotenv/config';

const getCodePtitCookie = async () => {
    console.log('Login to', config.api.host);
    const api = config.api.host;
    const get_csrf = await axios.get(`${api}/login`, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
        },
    });
    const csrf_set_cookie = get_csrf.headers['set-cookie'] && get_csrf.headers['set-cookie'][1];
    const $ = cheerio.load(get_csrf.data);
    const csrf = $('input[name="_token"]').val();
    let csrf_str = csrf;
    if (Array.isArray(csrf)) csrf_str = csrf[0];
    if (!csrf_str) throw new Error('Get csrf token failed!');
    const result = await axios.post(
        `${api}/login`,
        {
            username: process.env.CODEPTIT_USERNAME,
            password: process.env.CODEPTIT_PASSWORD,
            _token: csrf_str.replace(' ', ''),
        },
        {
            headers: {
                Cookie: csrf_set_cookie,
            },
        },
    );
    if (!result.headers['set-cookie']) throw new Error('Login failed!');
    const cookie = result.headers['set-cookie'][1];
    await axios.get(`${config.api.host}${config.api.COOKIE}${process.env.COURSE_ID}`, {
        headers: {
            Cookie: cookie,
        },
    });
    return {
        cookie,
        csrf_str,
    };
};

export { getCodePtitCookie };
