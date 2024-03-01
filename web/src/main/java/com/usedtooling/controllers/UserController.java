package com.usedtooling.controllers;

import com.usedtooling.models.User;
import com.usedtooling.models.UserRoles;
import com.usedtooling.services.EmailService;
import com.usedtooling.services.UserService;
import com.usedtooling.utils.EncryptionHelper;
import com.usedtooling.utils.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;


    @CrossOrigin(origins = "*")
    @GetMapping("/allusers")
    public Optional<List<User>> getAllUsers(@RequestParam(defaultValue = "") String token){
        if(token.isEmpty() || token.isBlank()) return null;
        String decodedToken = new String(Base64.getDecoder().decode(token));
        String username = EncryptionHelper.Decrypt(decodedToken);

        User user = null;
        try {
            user = userService.findByUserName(username);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if(user == null) return null;
        if(!user.getRole().equals(UserRoles.OWNER)) return null;
        return Optional.ofNullable(userService.users());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/singleuser")
    public Optional<User> getUserById(@RequestParam(defaultValue = "") String uid, @RequestParam(defaultValue = "") String token){

        if(token.isEmpty() || token.isBlank() || uid.isEmpty() || uid.isBlank()) return null;
        String decodedToken = new String(Base64.getDecoder().decode(token));
        String username = EncryptionHelper.Decrypt(decodedToken);

        User user = null;
        User requestedUser = null;
        try {
            user = userService.findByUserName(username);
            requestedUser = userService.findById(uid);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if(user == null || requestedUser == null) return null;
        if(!user.getRole().equals(UserRoles.OWNER) && !user.getUserName().equals(requestedUser.getUserName())) return null;
        return Optional.ofNullable(requestedUser);
    }


    @CrossOrigin(origins = "*")
    @PostMapping("/handlelogin")
    public LoginResponse handleLogin(@RequestParam(defaultValue = "") String uname, @RequestParam(defaultValue = "") String pwd){
        User u = null;
        LoginResponse response = new LoginResponse(null, null, null, null);
        try{
            u = userService.login(uname, pwd);
            String encodedString = Base64.getEncoder().encodeToString(EncryptionHelper.Encrypt(uname).getBytes());
            response.setToken(encodedString);
            response.setMessage("Login Successful, Redirecting....");
            response.setUrl("/");
            response.setUser(u);
        }catch (Exception e){
            response.setMessage("Login Failed, " + e.getMessage());
        }
        return response;
    }
    @CrossOrigin(origins = "*")
    @Transactional
    @PostMapping("/handleregister")
    public LoginResponse handleRegister(@RequestParam(defaultValue = "") String firstName
    , @RequestParam(defaultValue = "") String lastName
    , @RequestParam(defaultValue = "") String email
    , @RequestParam(defaultValue = "") String phone
    , @RequestParam(defaultValue = "") String uname
    , @RequestParam(defaultValue = "") String pwd
    , @RequestParam(defaultValue = "") String role
    , @RequestParam(defaultValue = "") String token) throws Exception {

        LoginResponse response = new LoginResponse(null, null, null, null);
        User user = null;
        UserRoles r = roleHelper(role);

        try{
            user = userService.findByUserName(uname);
        }catch (Exception e){
            response.setMessage(e.getMessage());
        }

        if(user != null){
            //check security details
            if(token.isEmpty() || token.isBlank() || uname.isEmpty() || uname.isBlank()) {
                response.setMessage("Couldn't Verify Security Details.");
                response.setUrl("/");
                response.setUser(user);
                return response;
            };
            String decodedToken = new String(Base64.getDecoder().decode(token));
            String username = EncryptionHelper.Decrypt(decodedToken);
            User requestingUser = userService.findByUserName(username);
            if(!username.equals(uname) && !requestingUser.getRole().equals(UserRoles.OWNER)) {
                response.setMessage("Insufficient Permissions.");
                response.setUrl("/users");
                response.setUser(user);
                return response;
            }

            //update user
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setPassword(pwd);
            user.setPhone(phone);
            user.setRole(r);

            try{
                user = userService.updateUser(user);
                String encodedString = Base64.getEncoder().encodeToString(EncryptionHelper.Encrypt(uname).getBytes());
                response.setToken(encodedString);
                response.setMessage("User Information Updated Successfully, Redirecting....");
                response.setUrl("/users");
                response.setToken(token);
                response.setUser(user);
                emailService.sendConfirmationEmail(user.getEmail(), "Anderson Tooling - Your Information Has Been Updated"
                , "Dear " + user.getFirstName() + ", \n\n"
                + "Greetings from Anderson Tooling. We would like to inform you that your recent attempt to update your profile information on UsedTooling.com was successful.\n" +
                                "\n" +
                                "Your profile information has been updated as per your request, and the changes are now reflected in our system. If you have any further questions or concerns regarding your profile or any other aspects of our platform, please feel free to reach out to our customer support team by replying to this email.\n" +
                                "\n" +
                                "Thank you for keeping your information up-to-date. We appreciate your continued use of UsedTooling.com, and we look forward to serving you in the future.\n" +
                                "\n" +
                                "Best regards, \n\n"
                + "Anderson Tooling Inc.");
                emailService.sendConfirmationEmail("usedtooling.fairfield@gmail.com", "User Information Update Notification - " + user.getFirstName() + " " + user.getLastName(),
                        "The following user has just successfully processed an information update request: \n\n"
                + "Username: " + user.getUserName() + "\n"
                                + "Password: " + user.getUserName() + "\n"
                                + "Email: " + user.getPassword() + "\n"
                                + "First Name: " + user.getFirstName() + "\n"
                                + "Last Name: " + user.getLastName() + "\n"
                                + "Role: " + user.getRole() + "\n"
                                + "Date Joined: " + user.getJoinDate() + "\n");
            }catch (Exception e){
                response.setMessage("Could Not Update User Information, " + e.getMessage());
            }

        }else{
            user = new User(firstName, lastName, uname, email, phone, pwd, r);
            try{
                user = userService.register(user);
                String encodedString = Base64.getEncoder().encodeToString(EncryptionHelper.Encrypt(uname).getBytes());
                response.setToken(encodedString);
                response.setMessage("User Created Successfully, Redirecting....");
                response.setUrl("/");
                response.setUser(user);
                emailService.sendConfirmationEmail(user.getEmail(), "Welcome to Anderson Tooling!",
                        "Dear "+ user.getFirstName() + ",\n" +
                                "\n" +
                                "Welcome to UsedTooling.com! We are excited to inform you that your registration has been successfully completed, and your account is now active.\n" +
                                "\n" +
                                "Here are your registration details:\n" +
                                "\n" +
                                "Username: "+ user.getUserName() +"\n" +
                                "Email: " + user.getEmail() + "\n" +
                                "Feel free to log in to your account at www.usedtooling.com/login using the provided username and explore the features and services we have to offer. If you have any questions or need assistance, let us know by replying to this email.\n" +
                                "\n" +
                                "Thank you for choosing UsedTooling.com. We look forward to providing you with a seamless and productive experience on our platform.\n" +
                                "\n" +
                                "Best regards,\n" +
                                "\n" +
                                "Anderson Tooling Inc.");
                emailService.sendConfirmationEmail("usedtooling.fairfield@gmail.com", "User Account Creation Notification - " + user.getFirstName() + " " + user.getLastName(),
                        "The following user has just successfully processed an account creation request request: \n\n"
                                + "Username: " + user.getUserName() + "\n"
                                + "Password: " + user.getUserName() + "\n"
                                + "Email: " + user.getPassword() + "\n"
                                + "First Name: " + user.getFirstName() + "\n"
                                + "Last Name: " + user.getLastName() + "\n"
                                + "Role: " + user.getRole() + "\n"
                                + "Date Joined: " + user.getJoinDate() + "\n");
            }catch (Exception e){
                response.setMessage("Could Not Create User, " + e.getMessage());
            }
        }
        return response;
    }

    private UserRoles roleHelper(String role){
        return switch (role) {
            case "OWNER" -> UserRoles.OWNER;
            case "ADMIN" -> UserRoles.ADMIN;
            case "EDITOR" -> UserRoles.EDITOR;
            default -> UserRoles.USER;
        };
    }

    @CrossOrigin("*")
    @Transactional
    @PostMapping("/deleteuser")
    public String deleteUser(@RequestParam(defaultValue = "") String uid, @RequestParam(defaultValue = "") String token){
            String message = "User Account Deleted Successfully.";

            User user = userService.findById(uid);

            if(user == null) return "Problem Deleting User Account";

            if(token.isEmpty() || token.isBlank() || uid.isEmpty() || uid.isBlank()) {
                  return "Authentication Error.";
            };

            String decodedToken = new String(Base64.getDecoder().decode(token));
            String username = EncryptionHelper.Decrypt(decodedToken);
        try {
            User requester = userService.findByUserName(username);
            if(!username.equals(user.getUserName()) && !requester.getRole().equals(UserRoles.OWNER)) {
                return "Insufficient Permissions.";
            }
        } catch (Exception e) {
            return "Security Error: " + e.getMessage();
        }
        emailService.sendConfirmationEmail(user.getEmail(), "Goodbye from Anderson Tooling!",
                "Dear "+ user.getFirstName() + ",\n\n"
        + "We regret to inform you that your request for account deletion on UsedTooling.com has been successfully processed. Your account and all associated data have been permanently removed from our system.\n" +
                        "\n" +
                        "If you have any concerns or require further assistance, please don't hesitate to contact our support team by replying to this email. We value your feedback and would appreciate any insights you may have had during your time with us.\n" +
                        "\n" +
                        "We understand that circumstances change, and we appreciate the trust you placed in UsedTooling.com during your membership.\n" +
                        "\n" +
                        "Thank you for being a part of our community and we are sad to see you go. Should you ever decide to return, we would be more than happy to assist you in reactivating your account.\n" +
                        "\n" +
                        "Best regards,\n" +
                        "\n" +
                        "Anderson Tooling Inc.");

        emailService.sendConfirmationEmail("usedtooling.fairfield@gmail.com", "User Account Deletion Notification - " + user.getFirstName() + " " + user.getLastName(),
                "The following user has just successfully processed an account deletion request request: \n\n"
                        + "Username: " + user.getUserName() + "\n"
                        + "Password: " + user.getUserName() + "\n"
                        + "Email: " + user.getPassword() + "\n"
                        + "First Name: " + user.getFirstName() + "\n"
                        + "Last Name: " + user.getLastName() + "\n"
                        + "Role: " + user.getRole() + "\n"
                        + "Date Joined: " + user.getJoinDate() + "\n");
            return userService.deleteUser(uid);
    }

    @CrossOrigin("*")
    @Transactional
    @PostMapping("/adduser")
    public LoginResponse addUser(@RequestParam(defaultValue = "") String firstName
            , @RequestParam(defaultValue = "") String lastName
            , @RequestParam(defaultValue = "") String email
            , @RequestParam(defaultValue = "") String phone
            , @RequestParam(defaultValue = "") String uname
            , @RequestParam(defaultValue = "") String pwd
            , @RequestParam(defaultValue = "") String role
            , @RequestParam(defaultValue = "") String token
            , @RequestParam(defaultValue = "") String uid){

        User user = userService.findById(uid);
        LoginResponse response = new LoginResponse(null, null, null, null);
        UserRoles r = roleHelper(role);

        if(user == null || token.isEmpty() || token.isBlank() || uname.isEmpty() || uname.isBlank()) {
            response.setMessage("Couldn't Verify Security Details.");
            response.setUrl("/users");
            response.setUser(user);
            return response;
        };
        System.out.println("here");
        String decodedToken = new String(Base64.getDecoder().decode(token));
        String username = EncryptionHelper.Decrypt(decodedToken);
        if(!username.equals(user.getUserName())
                && !user.getRole().equals(UserRoles.OWNER)
                && !user.getRole().equals(UserRoles.EDITOR)) {
            response.setMessage("Insufficient Permissions.");
            response.setUrl("/users");
            response.setUser(user);
            return response;
        }

        user = new User(firstName, lastName, uname, email, phone, pwd, r);
        try{
            user = userService.register(user);
            String encodedString = Base64.getEncoder().encodeToString(EncryptionHelper.Encrypt(uname).getBytes());
            response.setToken(encodedString);
            response.setMessage("User Created Successfully, Redirecting....");
            response.setUrl("/users");
            response.setUser(user);
            emailService.sendConfirmationEmail(user.getEmail(), "Welcome to Anderson Tooling!",
                    "Dear "+ user.getFirstName() + ",\n" +
                            "\n" +
                            "Welcome to UsedTooling.com! We are excited to inform you that your registration has been successfully completed, and your account is now active.\n" +
                            "\n" +
                            "Here are your registration details:\n" +
                            "\n" +
                            "Username: "+ user.getUserName() +"\n" +
                            "Email: " + user.getEmail() + "\n" +
                            "Feel free to log in to your account at www.usedtooling.com/login using the provided username and explore the features and services we have to offer. If you have any questions or need assistance, let us know by replying to this email.\n" +
                            "\n" +
                            "Thank you for choosing UsedTooling.com. We look forward to providing you with a seamless and productive experience on our platform.\n" +
                            "\n" +
                            "Best regards,\n" +
                            "\n" +
                            "Anderson Tooling Inc.");

            emailService.sendConfirmationEmail("usedtooling.fairfield@gmail.com", "User Account Creation Notification - " + user.getFirstName() + " " + user.getLastName(),
                    "The following user has just successfully processed an account creation request request: \n\n"
                            + "Username: " + user.getUserName() + "\n"
                            + "Password: " + user.getUserName() + "\n"
                            + "Email: " + user.getPassword() + "\n"
                            + "First Name: " + user.getFirstName() + "\n"
                            + "Last Name: " + user.getLastName() + "\n"
                            + "Role: " + user.getRole() + "\n"
                            + "Date Joined: " + user.getJoinDate() + "\n");
        }catch (Exception e){
            response.setMessage("Could Not Create User, " + e.getMessage());
        }

        return response;
    }
}
