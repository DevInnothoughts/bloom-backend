const { env } = process;

const config = {
  port: env.PORT,
  applicationName: env.APPLICATION_NAME,
  environment: env.ENVIRONMENT,
  db: {
    connection: {
      user: env.DB_USER,
      url: env.DB_URL,
      host: env.DB_HOST,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      port: env.DB_PORT,
      dialect: env.DB_DIALECT,
    },
  },
  openai: {
    apiUrl: env.OPENAI_API_URL,
    apiKey: env.OPENAI_API_KEY,
    defaultModel: 'gpt-4-1106-preview',
    defaultTemp: 1.2,
    availableTones: [],
    userPromptPrefix:
      'When interpreting the survey responses, follow the instructions below very strictly:\n- Write the review in either a first person perspective or a narrative style.\n- Use a diverse range of sentence structures to reflect the rating in descriptive terms.\n- Remember that most people who write reviews are not so fluent with English, you also have to write accordingly.\n- Use the answer for "Important Question" to understand how the survey user actually writes, and try to emulate the tone, the quality of sentences as much as possible.\n- Avoid repetition of adjectives. You can use emojis, but rarely.\n- Aim for brevity but completeness within 10 to 70 words.\n- Write the review in 1 or 2 paragraphs wherever necessary.\n- Each review should sound personal and authentic, so it DOES NOT get filtered in Google filters for spam content.\n- Do NOT use metaphors to describe every aspect of the review as it does not reflect genuinely of the experience.\n- DO NOT mention the numerical rating of the response in the review you write.\n- Keep the review simple to read and comprehend by ONLY using simple language.\n- Use different ways to communicate the length of customer engagement with the business. DO NOT just write "Been coming to", or "Been with" or "Been just shy of..."\n- STRICTLY DO NOT use ? or ! in the review to emphasise your point.\n- STRICTLY DO NOT use overly flowery or exaggerated language. Remember it reduces the trust on the review. \n- Find the user response delimited in the <Response> tag below\n\n',
  },
  corsWhitelist: env.APP_URLS
    ? env.APP_URLS.split(',').map((appUrl) => appUrl.trim())
    : [],
  webServerSecret: process.env.WEB_SERVER_SECRET,
  userApiSecret: process.env.USER_API_SECRET,
};

module.exports = config;
