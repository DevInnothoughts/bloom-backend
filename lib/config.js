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
    userPromptPrefex:
      'When interpreting the survey responses, follow the instructions below:\n- Use a diverse range of vocabulary and sentence structures to reflect the rating in descriptive terms.\n- Emphasize the sentiment behind the important question in the survey and let it guide the tone of the review.\n- To write the review, randomly select one of following styles for the review (include only the review in the output, not the style): narrative style, bullet points to sentences, direct quote style from a first-person perspective.\n- Avoid repetition of adjectives used in previous responses as much as possible.\n- Each review should sound personal and distinct, as if coming from different individuals with unique voices and experiences.\n- Aim for brevity but completeness within 20 to 70 words.\n- DO NOT mention the numerical rating of the response in the review you write.\n- Keep the review simple to read and comprehend by ONLY using simple language. It should be readable by a 6th grade student.\n- DO NOT write the review in a overly flowery language. \n- Find the user response delimited in the <Response> tag below\n\n',
  },
  corsWhitelist: env.APP_URLS
    ? env.APP_URLS.split(',').map((appUrl) => appUrl.trim())
    : [],
  webServerSecret: process.env.WEB_SERVER_SECRET,
  userApiSecret: process.env.USER_API_SECRET,
};

module.exports = config;
