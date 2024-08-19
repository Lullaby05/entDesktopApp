const fs = require('fs');
const path = require('path');
const http = require('http');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const name = 'enterprise';
const translationFile = path.join(__dirname, `/src/locale/zh-CN/${name}.ts`);

const APPID = '01cf0f34d8d21070';
const KEY = 't5kyvbW3ZBQcD3zLxvoMQUeuJVj97aSB';

const file = path.join(
  __dirname,
  `/src/views/enterpriseManage/organization/index.vue`
);

function sha256(data) {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

function truncate(q) {
  var len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

// 新增方法：获取中文并翻译成英文
const translateChineseToEnglish = async (text) => {
  const curtime = Math.round(new Date().getTime() / 1000);
  const q = text;
  const uuid = uuidv4();
  try {
    const response = await axios.post('https://openapi.youdao.com/api', null, {
      params: {
        appKey: APPID,
        curtime,
        salt: uuid,
        sign: sha256(APPID + truncate(q) + uuid + curtime + KEY),
        signType: 'v3',
        q,
        to: 'en',
        from: 'zh-CHS',
        domain: 'computers',
      },
    });
    const translation = response.data.translation[0];
    return translation;
  } catch (error) {
    console.error(text);
    return '';
  }
};

const translateFileToEnglish = async (file, name) => {
  try {
    const data = await fs.promises.readFile(file, 'utf8');
    const regex = /[\u4e00-\u9fa5，。！？]+/g;
    const matches = Array.from(new Set(data.match(regex)));
    if (matches) {
      const translations = {};

      for (const param of matches) {
        await new Promise((resolve) => setTimeout(resolve, 1001));
        const englishText = await translateChineseToEnglish(param);
        const camelCaseName = englishText
          .split(' ')
          .map((ele, index) => {
            if (index === 0) return ele.toLowerCase();
            else return ele.charAt(0).toUpperCase() + ele.slice(1);
          })
          .join('');
        const key = `${name}.${camelCaseName}`;
        translations[key] = param;
      }

      return translations;
    }

    return {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

const checkTagLocation = (file, match) => {
  try {
    const fileData = fs.readFileSync(file, 'utf8');
    const templateRegex = /<template>([\s\S]*?)<\/template>/;
    const scriptRegex = /<script lang="ts" setup>([\s\S]*?)<\/script>/;

    const templateMatch = fileData.match(templateRegex);
    const outerTemplate = templateMatch ? templateMatch[0] : '';

    if (outerTemplate.includes(match)) {
      return 'template';
    } else if (
      fileData.match(scriptRegex) &&
      fileData.match(scriptRegex)[1].includes(match)
    ) {
      return 'script';
    } else {
      return 'notFound';
    }
  } catch (error) {
    console.error(error);
  }
};

const replaceChineseWithTranslation = async (file, translationFile) => {
  try {
    let fileData = await fs.promises.readFile(file, 'utf8');
    const translations = require(translationFile);

    for (let key in translations) {
      const regex = new RegExp(translations[key], 'gi');
      const matches = fileData.match(regex);

      if (matches) {
        matches.forEach((match) => {
          const tag = checkTagLocation(file, match);
          if (tag === 'template') {
            fileData = fileData.replace(match, `$t('${key}')`);
          } else if (tag === 'script') {
            fileData = fileData.replace(match, translations[key]);
          }
        });
      }
    }

    await fs.promises.writeFile(file, fileData, 'utf8');
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  // const translations = await translateFileToEnglish(file, name);
  // console.log('@', translations);
  await replaceChineseWithTranslation(file, translationFile);
})();
