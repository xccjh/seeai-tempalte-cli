const package = require('../package.json')
const config = {
    templateOrigin: package.templateOrigin,
    templateDefault: package.templateDefault,
    domainOrigin: package.domainOrigin,
    domainDefault: package.domainDefault,
}
module.exports = config;
