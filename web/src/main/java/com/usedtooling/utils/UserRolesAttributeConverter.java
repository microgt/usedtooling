package com.usedtooling.utils;

import com.usedtooling.models.UserRoles;

public class UserRolesAttributeConverter implements jakarta.persistence.AttributeConverter<UserRoles, Integer> {
    @Override
    public Integer convertToDatabaseColumn(UserRoles userRoles) {
        if(userRoles == null) return null;
        switch (userRoles){
            case OWNER:
                return 0;
            case ADMIN:
                return 1;
            case EDITOR:
                return 2;
            case USER:
                return 3;
            default: throw new IllegalArgumentException(userRoles + " is not supported.");
        }
    }

    @Override
    public UserRoles convertToEntityAttribute(Integer integer) {
        if (integer == null) return null;
        switch (integer){
            case 0:
                return UserRoles.OWNER;
            case 1:
                return UserRoles.ADMIN;
            case 2:
                return UserRoles.EDITOR;
            case 3:
                return UserRoles.USER;
            default: throw new IllegalArgumentException(integer + " is not supported.");
        }
    }
}
