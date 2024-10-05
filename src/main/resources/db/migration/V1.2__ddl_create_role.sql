CREATE TABLE roles
(
    id                 SERIAL PRIMARY KEY,
    name               VARCHAR(45)                         NOT NULL,
    description        VARCHAR(255),
    status             VARCHAR(45)                         NOT NULL,
    created_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by         VARCHAR(50)                         NOT NULL,
    last_modified_by   VARCHAR(50)                         NOT NULL
);
