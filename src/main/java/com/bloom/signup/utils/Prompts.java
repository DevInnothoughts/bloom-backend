package com.bloom.signup.utils;

import com.bloom.signup.dto.QuestionResponseDto;
import com.bloom.signup.dto.ResponseDto;
import lombok.extern.slf4j.Slf4j;
import lombok.val;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class Prompts {

    public static final String systemShoff = "You are an assistant who helps writing google reviews based on a questionnaire on behalf of customers for a business called Shoffr. " +
            "This is a cab rental service which uses EV vehicles. Some questions will be of type where a rating between 1 & 5 is asked of the user. You don't need to include the numerical value of the rating in " +
            "your review, rather describe the experience. There will be an important question in some of the questionnaires, give more weightage to the answers of those in the review. The following is a set " +
            "of questions and answers from the questionnaire, generate a review of minimum 20 words and maximum 70 words without repeating same adjectives ";

    public static final String systemActHeals = "You are an assistant who helps writing google reviews based on a questionnaire on behalf of customers for a physio therapy rehab centre for strength and conditioning called Activity Heals. " +
            "Some questions will be of type where a rating between 1 & 5 is asked of the user. You don't need to include the numerical value of the rating in " +
            "your review, rather describe the experience. There will be an important question in some of the questionnaires, give more weightage to the answers of those in the review. The following is a set " +
            "of questions and answers from the questionnaire, generate a review of minimum 20 words and maximum 70 words without repeating same adjectives ";

    public static final String systemCrazyHead = "You are an assistant who helps writing google reviews based on a questionnaire on behalf of customers for a salon that offers haircuts, body massages, tattoos, skincare and bridal hair care" +
            "called Crazy Head Salon. " +
            "Some questions will be of type where a rating between 1 & 5 is asked of the user. You don't need to include the numerical value of the rating in " +
            "your review, rather describe the experience. There will be an important question in some of the questionnaires, give more weightage to the answers of those in the review. The following is a set " +
            "of questions and answers from the questionnaire, generate a review of minimum 20 words and maximum 70 words without repeating same adjectives ";
    public static final Map<String,String> companyPrompts = new HashMap<>(){{
        put("activityheals",systemActHeals);
        put("shoffr",systemShoff);
        put("crazyheadsalon",systemCrazyHead);
    }};


    public static String convertToPrompt(ResponseDto responseDto){
        log.info("got dto: {}",responseDto);
        val questionAnswers = new StringBuilder();
        for(String key:responseDto.getResponses().keySet()){
            if(key.equalsIgnoreCase("queryParams")){
                continue;
            }
            val questionResponseDto = responseDto.getResponses().get(key);
            if(questionResponseDto==null){
                log.info("Got null for: {}",key);
                continue;
            }

            if(questionResponseDto.getIsUserText()!=null && questionResponseDto.getIsUserText()){
                questionAnswers.append(" Important Question: ").append(questionResponseDto.getQuestionTitle()).append("\n").append("Answer: ");

            }
            else {
                questionAnswers.append(" Question: ").append(questionResponseDto.getQuestionTitle()).append("\n").append("Answer: ");
            }
            if(questionResponseDto.getRating()!=null){
                questionAnswers.append(questionResponseDto.getRating()).append(" (1 being the lowest and 5 being the highest.) ");
            }
            else{
                for(String resp:questionResponseDto.getResponses()){
                    questionAnswers.append(resp).append(", ");
                }
            }
        }
        return questionAnswers.toString();
    }
}
