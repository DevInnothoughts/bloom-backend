const axios = require('axios');

const { openai: openaiConfig } = require('../lib/config');

// curl https://api.openai.com/v1/chat/completions \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer $OPENAI_API_KEY" \
//   -d '{
//   "model": "gpt-4-1106-preview",
//   "messages": [
//     {
//       "role": "system",
//       "content": "You are a creative writer tasked with crafting unique and varied Google reviews for a business called Shoffr. The company is running a survey. \n\nAbout the survey: \"A cab rental service that specializes in using EV vehicles.\""
//     },
//     {
//       "role": "user",
//       "content": "When interpreting the survey responses, follow the instructions below:\n\n- Use a diverse range of vocabulary and sentence structures to reflect the rating in descriptive terms.\n- Emphasize the sentiment behind the important question in the questionnaire, letting it guide the tone of the review.\n- To write the review, randomly select one of following styles for the review (include only the review in the output, not the style): narrative style, bullet points to sentences, direct quote style from a first-person perspective.\n- Avoid repetition of adjectives used in previous responses as much as possible.\n- Each review should sound personal and distinct, as if coming from different individuals with unique voices and experiences.\n- Aim for brevity but completeness within 20 to 70 words.\n- DO NOT mention the numerical rating of the response in the review you write.\n- Keep the review simple to read and comprehend by using simple language.\n- Mention the response of the important question as is in the review. (if present in the survey)\n- Find the user response delimited in the <Response> tag below\n\n<Response>\n{\"responses\":{\"overallRating\":{\"questionId\":\"overallRating\",\"questionTitle\":\"How was your overall experience?\",\"questionSubtitle\":\"We hope to deliver a 5-star experience\",\"questionType\":null,\"responses\":null,\"rating\":\"5\",\"isUserText\":null},\"rideReviewOptions\":null,\"driverReviewOptions\":{\"questionId\":\"driverReviewOptions\",\"questionTitle\":\"How did the driver behave?\",\"questionSubtitle\":\"Our Shoffrs are incentivised to take care of you. Let us know how they did.\",\"questionType\":null,\"responses\":[\"Helped with luggage\"],\"rating\":null,\"isUserText\":null},\"driverRating\":{\"questionId\":\"driverRating\",\"questionTitle\":\"How did the driver behave?\",\"questionSubtitle\":\"How would you rate your driver today?\",\"questionType\":null,\"responses\":null,\"rating\":\"5\",\"isUserText\":null},\"driverFeedback\":null,\"EVExperienceOptions\":{\"questionId\":\"EVExperienceOptions\",\"questionTitle\":\"Was this your first EV experience?\",\"questionSubtitle\":\"Thank you for choosing a greener ride with us\",\"questionType\":null,\"responses\":[\"No, I have had EV rides before\"],\"rating\":null,\"isUserText\":null}}\n</Response>"
//     },
//     {
//       "role": "assistant",
//       "content": "Experiencing Shoffr'\''s eco-friendly novelty didn'\''t disappoint—a seasoned electric vehicle enthusiast, but the charm renewed. The cherry on top, the driver, generous to assist with my hefty luggage, embodying the care Shoffr promises. They truly make every journey five-star worthy."
//     }
//   ],
//   "temperature": 0.05,
//   "max_tokens": 256,
//   "top_p": 1,
//   "frequency_penalty": 0,
//   "presence_penalty": 0
// }'
async function getChatCompletions(model, messages = []) {
  const apiUrl = `${openaiConfig.apiUrl}/v1/chat/completions`;
  const resp = await axios.post(
    apiUrl,
    { model, messages, temperature: openaiConfig.defaultTemp },
    { headers: { Authorization: `Bearer ${openaiConfig.apiKey}` } }
  );
  return resp.data;
}

module.exports = {
  getChatCompletions,
};
