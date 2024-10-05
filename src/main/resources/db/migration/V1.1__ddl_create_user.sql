
CREATE TABLE `users`
(
    id                 SERIAL PRIMARY KEY,
    username           VARCHAR(45)                         NOT NULL UNIQUE,
    password           VARCHAR(255)                        NOT NULL,
    email              VARCHAR(45)                         NOT NULL,
    first_name         VARCHAR(255)                        NOT NULL,
    last_name          VARCHAR(255)                        NOT NULL,
    birthday     DATE         NOT NULL,
    mobile_phone VARCHAR(45)  NOT NULL,
    address      VARCHAR(100) NOT NULL,
    account_type       VARCHAR(20)                         NOT NULL,
    status       VARCHAR(45)  NOT NULL,
    created_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by         VARCHAR(50)                         NOT NULL,
    last_modified_by   VARCHAR(50)                         NOT NULL
);

