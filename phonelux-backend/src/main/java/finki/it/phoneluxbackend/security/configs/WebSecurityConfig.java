package finki.it.phoneluxbackend.security.configs;

import finki.it.phoneluxbackend.security.CustomAuthenticationFilter;
import finki.it.phoneluxbackend.security.CustomAuthorizationFilter;
import finki.it.phoneluxbackend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    @Override
    protected void configure(HttpSecurity http) throws Exception {


        http.csrf().disable();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.authorizeRequests()
                .and()
                .authorizeRequests()
                .antMatchers("/user/**")
                .hasAnyAuthority("USER","ADMIN", "SUPERADMIN")
                .and()
                .authorizeRequests()
                .antMatchers("/management/**")
                .hasAnyAuthority("SUPERADMIN")
                .and()
                .authorizeRequests()
                .antMatchers("/admin/**")
                .hasAnyAuthority("ADMIN","SUPERADMIN")
                .and()
                .authorizeRequests()
                .antMatchers("/offerreport/**")
                .hasAnyAuthority("USER", "ADMIN", "SUPERADMIN")
                .and()
                .authorizeRequests()
                .antMatchers("/scrapperinfo/**")
                .hasAnyAuthority("SUPERADMIN")
                .and()
                .authorizeRequests()
                .anyRequest().permitAll();


        http.addFilter(new CustomAuthenticationFilter(authenticationManagerBean()));
        http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);

    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    public DaoAuthenticationProvider daoAuthenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        provider.setUserDetailsService(userService);
        return provider;
    }

}
