var dbConfig = {
    user: "username",
    password: "password",
    server: "hostname",
    database: "dbname",
    options: {
        trustedconnection: true,
        enableArithAort: true,
        instancename: 'SQLEXPRESS'
    },
    port: 55892
};

module.exports = dbConfig;