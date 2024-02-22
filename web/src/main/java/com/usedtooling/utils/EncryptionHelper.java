package com.usedtooling.utils;

import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

public class EncryptionHelper {

    private static final String password = "SecurityCard14466847#%%$#!";
    private static final String salt = "4466847";
    public static String Encrypt(String input){
        IvParameterSpec ivParameterSpec = AESUtil.generateIv();
        SecretKey key = null;
        try {
            key = AESUtil.getKeyFromPassword(password, salt);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        String cipherText = null;

        try {
            cipherText = AESUtil.encryptPasswordBased(input, key, ivParameterSpec);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return cipherText;
    }

    public static String Decrypt(String input){
        SecretKey key = null;
        try {
            key = AESUtil.getKeyFromPassword(password, salt);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        String cipherText = null;

        try {
            cipherText = AESUtil.decryptPasswordBased(input, key);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return cipherText;
    }
}
