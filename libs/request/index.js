const axios = require('axios');
const {templateOrigin, domainOrigin} = require('../config');

//添加拦截器
axios.interceptors.response.use(res => {
    return res.data;
})

async function getRepoList(configOwner) {
    let url = domainOrigin
    if (domainOrigin.indexOf('gitee') > -1) {
        url += '/api/v5'
    }else if(domainOrigin.indexOf('github') > -1) {
        const arr = url.split('://')
        arr.splice(1,0,'://','api.')
        url = arr.join('')
    }
    let result = axios.get(url + `/orgs/${configOwner ? configOwner : templateOrigin}/repos`);
    return result;
}

async function getRepoTags(repo) {
    let url = domainOrigin
    if (domainOrigin.indexOf('gitee') > -1) {
        url += '/api/v5'
    }else if(domainOrigin.indexOf('github') > -1) {
        const arr = url.split('://')
        arr.splice(1,0,'://','api.')
        url = arr.join('')
    }
    let result = axios.get(url + `/repos/${templateOrigin}/${repo.split('(')[0]}/tags`);
    return result;
}

module.exports = {
    getRepoList: getRepoList,
    getRepoTags: getRepoTags
}
