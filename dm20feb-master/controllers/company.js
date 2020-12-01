const Company = require('../models/company');

exports.getCompany = (req, res, next) => {
    let companyName = 'GiantT';

    const companies = new Company(companyName); 
    res.render(companyName, {
        pageTitle: companyName+' Page'

    });
}