ALTER TABLE users
    ADD CONSTRAINT user_username_unique UNIQUE (username);
ALTER TABLE roles
    ADD CONSTRAINT roles_name_unique UNIQUE (name);

ALTER TABLE user_roles
    ADD CONSTRAINT user_id_fk foreign key (user_id) references users (id);
ALTER TABLE user_roles
    ADD CONSTRAINT role_id_fk foreign key (role_id) references roles (id);

  
  
  