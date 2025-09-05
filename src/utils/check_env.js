const check_env = () => {
    if (!process.env.CODEPTIT_USERNAME || !process.env.CODEPTIT_PASSWORD) {
        console.log('\x1b[31m%s\x1b[0m', 'Please provide CODEPTIT_USERNAME and CODEPTIT_PASSWORD in .env file');
        process.exit(1);
    }
};

export default check_env;
