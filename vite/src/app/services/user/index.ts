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

    async loginStepOne(userEmail: string, userPassword: string): Promise<LoginResponse> {
        try {
            const userPayload = {
                username: "",
                email: userEmail, 
                password: userPassword,
                verification_code: "",
            }
            console.log(import.meta.env.VITE_API_URL)
            const response = await api.post('/login', userPayload);
            console.log(response)
            return response.data;
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
            const userPayload = {
                username: "",
                email: userEmail, 
                password: "",
                verification_code: "",
            }
            const response = await api.post('/forgot-password-one', userPayload);
            return response;
          } catch (error) {
            throw error;
          }
    }

    async forgotPasswordStepTwo(userEmail: string, verificationCode: string) {
        try {
            const userPayload = {
                username: "",
                email: userEmail, 
                password: "",
                verification_code: verificationCode,
            }
            const response = await api.post('/forgot-password-two', userPayload);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async forgotPasswordStepThree(userEmail: string, newPassword: string) {
        try {
            const userPayload = {
                username: "",
                email: userEmail, 
                password: newPassword,
                verification_code: "",
            }
            const response = await api.post('/forgot-password-three', userPayload);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async signUp(userName: string, userEmail: string, password: string) {
        try {
            const userPayload = {
                username: userName,
                email: userEmail, 
                password: password,
                verification_code: "",
            }
            console.log("teste")
            const response = await api.post('/user', userPayload);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async validateUser(userEmail: string, verificationCode: string) {
        try {
            const userPayload = {
                username: "",
                email: userEmail, 
                password: "",
                verification_code: verificationCode,
            }
            const response = await api.post('/validate-user', userPayload);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

const userService = new UserService();
export default userService