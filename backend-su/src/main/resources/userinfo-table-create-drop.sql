drop table userinfo cascade constraints;

create table userinfo (
    social number (1, 0) not null check (social in (0, 1)),
    email varchar2 (255 char) unique,
    name varchar2 (255 char),
    password varchar2 (255 char),
    userid varchar2 (255 char) not null,
    primary key (userid)
);