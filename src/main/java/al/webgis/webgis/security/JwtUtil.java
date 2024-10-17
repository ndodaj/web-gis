package al.webgis.webgis.security;


import al.webgis.webgis.model.JwtDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class JwtUtil implements InitializingBean {

    private final String secret;

    private final long tokenValidity;

    private Key key;


    public JwtUtil(@Value("${jwt.base64-secret}") String base64Secret,
                   @Value("${jwt.token-validity}") long tokenValidityInSeconds) {
        this.secret = base64Secret;
        this.tokenValidity = tokenValidityInSeconds * 1000;
    }

    @Override
    public void afterPropertiesSet() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }


    private static final String AUTHORITIES_KEY = "auth";


    public JwtDTO generateToken(String username, List<String> authorities) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("auth", authorities);
        return createToken(claims, username);
    }

    private JwtDTO createToken(Map<String, Object> claims, String subject) {

        JwtDTO jwtDTO = new JwtDTO();
        jwtDTO.setToken(Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + tokenValidity))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact());
        return jwtDTO;
    }


    public Claims validateToken(String authToken) throws SignatureException, MalformedJwtException {

        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(key) // Set the signing key
                .build()
                .parseClaimsJws(authToken); // Parse the claims

        Claims claims = claimsJws.getBody();

        Date expiration = claims.getExpiration();
        if (expiration != null && expiration.before(new Date())) {
            throw new SignatureException("Expired or invalid token");
        }

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String issuer = claims.getSubject();
////        if (!authentication.getName().equals(issuer)) {
////            throw new SignatureException("Invalid issuer");
////        }
        return claims;
    }

    public Authentication getAuthentication(Claims claims) {
        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(claims.get(AUTHORITIES_KEY).toString().split(",")).map(SimpleGrantedAuthority::new)
                .toList();

        User principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, authorities);
    }
}
