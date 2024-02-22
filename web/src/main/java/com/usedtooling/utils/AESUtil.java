package com.usedtooling.utils;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Arrays;
import java.util.Base64;


public class AESUtil {

    public static IvParameterSpec generateIv() {
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        return new IvParameterSpec(iv);
    }

    public static SecretKey getKeyFromPassword(String password, String salt) throws Exception {
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        KeySpec spec = new PBEKeySpec(password.toCharArray(), Base64.getDecoder().decode(salt), 65536, 256);
        SecretKey tmp = factory.generateSecret(spec);
        return new SecretKeySpec(tmp.getEncoded(), "AES");
    }

    public static String encryptPasswordBased(String plainText, SecretKey key, IvParameterSpec ivParameterSpec) throws Exception {
        // Implement encryption logic here using AES
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key, ivParameterSpec);
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes("UTF-8"));
        //return Base64.getEncoder().encodeToString(encryptedBytes);
        byte[] ivBytes = ivParameterSpec.getIV();
        byte[] combinedBytes = new byte[ivBytes.length + encryptedBytes.length];
        System.arraycopy(ivBytes, 0, combinedBytes, 0, ivBytes.length);
        System.arraycopy(encryptedBytes, 0, combinedBytes, ivBytes.length, encryptedBytes.length);
        return Base64.getEncoder().encodeToString(combinedBytes);
    }

    public static String decryptPasswordBased(String cipherText, SecretKey key) throws Exception {
        byte[] combinedBytes = Base64.getDecoder().decode(cipherText);
        byte[] ivBytes = Arrays.copyOfRange(combinedBytes, 0, 16);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);
        byte[] cipherTextBytes = Arrays.copyOfRange(combinedBytes, 16, combinedBytes.length);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

        cipher.init(Cipher.DECRYPT_MODE, key, ivParameterSpec);
        byte[] decodedBytes = cipher.doFinal(cipherTextBytes);

        return new String(decodedBytes, "UTF-8");
    }

}
