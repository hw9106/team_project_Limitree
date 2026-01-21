drop table category cascade constraints;

drop SEQUENCE CATEGORY_SEQ;

create table category (
    CATEGORY_ID number (10, 0) not null,
    NAME_KEY varchar2 (255 char) not null,
    PARENT_ID number (10, 0),
    SORT_ORDER number (10, 0),
    USE_YN CHAR (1),
    
    CONSTRAINT pk_category primary KEY (CATEGORY_ID),
    CONSTRAINT fk_category_parent
        FOREIGN KEY (PARENT_ID)
        REFERENCES category (CATEGORY_ID)
);

CREATE SEQUENCE CATEGORY_SEQ
START WITH 1
INCREMENT BY 1
NOCACHE;