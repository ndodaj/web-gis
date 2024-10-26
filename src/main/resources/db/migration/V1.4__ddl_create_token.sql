CREATE TABLE token
(
    id                 SERIAL PRIMARY KEY,
    token              VARCHAR(255)                        NOT NULL UNIQUE,
    token_type         VARCHAR(255)                        NOT NULL,
    revoked            BOOLEAN                             NOT NULL,
    expired            BOOLEAN                             NOT NULL,
    user_id            INTEGER                             NOT NULL,
    created_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by         VARCHAR(50)                         NOT NULL,
    last_modified_by   VARCHAR(50)                         NOT NULL
);