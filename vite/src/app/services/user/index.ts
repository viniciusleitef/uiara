import api from '..'; 
import { LoginResponse } from "./types";

class UserService {
    async getAllUsers() {
        try {
            const response = await api.get("/users");
            return response
        } catch (error) {
            throw error;
        }
    }

    async getUser(userId: string) {
        try {
            const response = await api.get(`/user/${userId}`);
            return response
        } catch (error) {
            throw error;
        }
    }

    async loginStepOne(userEmail: string, userPassword: string) {
        try {
            const userPayload = {
                username: "",
                email: userEmail, 
                password: userPassword,
                login_verification_code: "",
            }
            const response = await api.post('/login-step-one', userPayload);
            return response
        } catch (error) {
            throw error;
        }
    }

    async loginStepTwo(userEmail: string, userPassword: string, verificationCode: string) {
        try {
            const userPayload = {
                username: "",
                email: userEmail, 
                password: userPassword,
                login_verification_code: verificationCode
            }
            const response = await api.post<LoginResponse>('/login-step-two', userPayload);
            return response.data
        } catch (error) {
            throw error;
        }
    }

    async verifyCaptcha(captchaToken: string) {
        try {
            const captchaPayload = {
                token: captchaToken
            }
            const response = await api.post('/verify-captcha', captchaPayload);
            return response;
          } catch (error) {
            throw error;
          }
    }

    async forgotPasswordStepOne(userEmail: string) {
        try {
            const payload = {
                user_email: userEmail
            }
            const response = await api.post('/forgot-password-one', payload);
            return response;
          } catch (error) {
            throw error;
          }
    }

    async forgotPasswordStepTwo(userEmail: string, verificationCode: string) {
        try {
            const payload = {
                user_email: userEmail,
                verification_code: verificationCode
            };
            const response = await api.post('/forgot-password-two', payload);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async forgotPasswordStepThree(userEmail: string, newPassword: string) {
        try {
            const payload = {
                user_email: userEmail,
                new_password: newPassword
            };
            const response = await api.post('/forgot-password-three', payload);
            return response;
        } catch (error) {
            throw error;
        }
        }
}

const userService = new UserService();
export default userService