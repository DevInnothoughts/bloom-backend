const axios = require('axios');

const { openai: openaiConfig } = require('../lib/config');

async function getChatCompletions(model, messages = []) {
  const apiUrl = `${openaiConfig.apiUrl}/v1/chat/completions`;
  const resp = await axios.post(
    apiUrl,
    { model, messages },
    { headers: { Authorization: `Bearer ${openaiConfig.apiKey}` } }
  );
  return resp.data;
}

module.exports = {
  getChatCompletions,
};
