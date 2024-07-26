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
    defaultModel: 'gpt-4o-mini', //'gpt-4-1106-preview',
    defaultTemp: 1.2,
    availableTones: [
      'professional and formal',
      'excited and enthusiastic',
      'warm and compassionate',
      'skeptical but convinced',
      'reflective and thoughtful',
      'direct and straightforward',
      'critical but fair',
      'casual and conversational',
    ],
    userPromptPrefix: `Follow the instructions very strictly:
    \n- Write the review in either a first person perspective or a narrative style.
    \n- Describe the rating value. Do NOT mention the numerical value in the review.
    \n- Keep the fluency in English like that of a 5th grader.
    \n- Understand the tone & quality of user's English based on the answers for "Important Question" if present
    \n- Try to emulate that tone & quality as much as possible in your review.
    \n- Ensure the review sounds authentic and expresses genuine expereince.
    \n- STRICTLY DO NOT use metaphors to describe every aspect of the user's response.
    \n- STRICTLY DO NOT use questions or exclamations to emphasise your point.
    \n- STRICTLY DO NOT use flowery / exaggerated language.
    \n- Include emojis sparingly & avoid repetition of adjectives.
    \n- Break the review in 1 or 2 paragraphs where necessary.
    \n- Keep the review length between 10 to 70 words.`,
  },
  corsWhitelist: env.APP_URLS
    ? env.APP_URLS.split(',').map((appUrl) => appUrl.trim())
    : [],
  webServerSecret: process.env.WEB_SERVER_SECRET,
  userApiSecret: process.env.USER_API_SECRET,
};

module.exports = config;
