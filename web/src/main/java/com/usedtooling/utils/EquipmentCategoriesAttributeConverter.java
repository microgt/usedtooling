package com.usedtooling.utils;

import com.usedtooling.models.EquipmentCategories;

public class EquipmentCategoriesAttributeConverter implements jakarta.persistence.AttributeConverter<EquipmentCategories, Integer> {
    @Override
    public Integer convertToDatabaseColumn(EquipmentCategories equipmentCategories) {
        if(equipmentCategories == null) return null;
        switch (equipmentCategories){
            case VERTICAL_LATHES:
                return 0;
            case VERTICAL_BORING_MILLS:
                return 1;
            case SURFACE_GRINDERS:
                return 2;
            case RADIAL_DRILLS:
                return 3;
            case PRESS:
                return 4;
            case POST_DRILL_PRESSES:
                return 5;
            case CNC_LATHES:
                return 6;
            case CARBIDE_MILLING_INSERT:
                return 7;
            case BORING_MACHINES:
                return 8;
            case CNC_MACHINING_CENTERS:
                return 9;
            case HORIZONTAL_BORING_MILLS:
                return 10;
            case MISCELLANEOUS_EQUIPMENT_AND_MACHINES:
                return 11;
            case MANUAL_MILLING_MACHINES:
                return 12;
            case KNEE_MILLS:
                return 13;
            case BAND_SAWS:
                return 14;
            case ENGINE_LATHES:
                return 15;
            default: throw new IllegalArgumentException(equipmentCategories + " is not supported.");
        }
    }

    @Override
    public EquipmentCategories convertToEntityAttribute(Integer integer) {
        if (integer == null) return null;
        switch (integer){
            case 0:
                return EquipmentCategories.VERTICAL_LATHES;
            case 1:
                return EquipmentCategories.VERTICAL_BORING_MILLS;
            case 2:
                return EquipmentCategories.SURFACE_GRINDERS;
            case 3:
                return EquipmentCategories.RADIAL_DRILLS;
            case 4:
                return EquipmentCategories.PRESS;
            case 5:
                return EquipmentCategories.POST_DRILL_PRESSES;
            case 6:
                return EquipmentCategories.CNC_LATHES;
            case 7:
                return EquipmentCategories.CARBIDE_MILLING_INSERT;
            case 8:
                return EquipmentCategories.BORING_MACHINES;
            case 9:
                return EquipmentCategories.CNC_MACHINING_CENTERS;
            case 10:
                return EquipmentCategories.HORIZONTAL_BORING_MILLS;
            case 11:
                return EquipmentCategories.MISCELLANEOUS_EQUIPMENT_AND_MACHINES;
            case 12:
                return EquipmentCategories.MANUAL_MILLING_MACHINES;
            case 13:
                return EquipmentCategories.KNEE_MILLS;
            case 14:
                return EquipmentCategories.BAND_SAWS;
            case 15:
                return EquipmentCategories.ENGINE_LATHES;
            default: throw new IllegalArgumentException(integer + " is not supported.");
        }
    }
}
