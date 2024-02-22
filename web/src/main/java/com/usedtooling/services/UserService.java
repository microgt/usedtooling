package com.usedtooling.services;

import com.usedtooling.models.User;
import com.usedtooling.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> users(){
        return (List<User>) userRepository.findAll();
    }
    public User findById(String id){
        return userRepository.findById(Long.parseLong(id)).get();
    }

    public User findByUserName(String username) throws Exception {
        return userRepository.findByUserName(username).orElseThrow(() -> new Exception("User Not Found"));
    }

    public User login(String uname, String pwd) throws Exception {
        User user = findByUserName(uname);

        if(pwd.equals(user.getPassword())) return user;

        throw new Exception("Invalid password");
    }

    public User register(User user) throws Exception {
        Optional<User> optionalUser = userRepository.findByUserName(user.getUserName());
        if(optionalUser.isPresent()) throw new Exception("User Already Exists");

        return userRepository.save(user);
    }

    public User updateUser(User user) throws Exception {
        return userRepository.save(user);
    }

    public String deleteUser(String id){
        String result = "User Account Deleted Successfully";
        try {
            userRepository.deleteById(Long.parseLong(id));
        }catch (Exception e){
            result = "Failed To Delete User Account: " + e.getMessage();
        }
        return  result;
    }
}
