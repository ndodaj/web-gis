package al.webgis.webgis.config;

import al.webgis.webgis.model.Role;
import al.webgis.webgis.security.JwtRequestFilter;
import al.webgis.webgis.security.JwtUtil;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, JwtRequestFilter jwtRequestFilter) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/authenticate", "/swagger-ui/**", "/v3/api-docs/**", "/h2-console/**")
                        .permitAll()


                        .anyRequest().permitAll()
                );
//                .sessionManagement(sessionManagement -> sessionManagement
//                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                )
////                .formLogin(Customizer.withDefaults())
////                .oauth2Login(Customizer.withDefaults());
//
////                .formLogin(formLogin -> formLogin
////                        .loginPage("/login")
////                        .permitAll()
////                )
////                .oauth2Login(oauth2Login -> oauth2Login
////                        .loginPage("/oauth2/authorization/google")
////                )
//        ;
//
//        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
//        http.addFilterBefore(new JwtRequestFilter(new JwtUtil()), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }




    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    ApplicationListener<AuthenticationSuccessEvent> authSuccess() {
        return event -> {
            Authentication authentication = event.getAuthentication();
            LoggerFactory.getLogger(SecurityConfig.class).info("LOGIN SUCCESFUL [{}] - {}", authentication.getClass().getSimpleName(), authentication.getName());
        };
    }


}
