package com.bloom.signup.config;

import com.bloom.signup.feign.ChatgptClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Feign;
import feign.Logger;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.okhttp.OkHttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    @Bean
    public ChatgptClient getFeign(){
        return Feign.builder()
                .client(new OkHttpClient())
                .encoder(new JacksonEncoder(new ObjectMapper()))
                .decoder(new JacksonDecoder(new ObjectMapper()))
                .logger(new Logger.ErrorLogger())
                .logLevel(Logger.Level.FULL)
                .target(ChatgptClient.class,ChatgptClient.apiEP);
    }
}
