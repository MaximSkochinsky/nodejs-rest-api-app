import { UserRepository } from '../repository/user.repository';

export class UserService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getUser(email) {
        return await this.userRepository.getUser(email)
    }

    async getUsers() {
        return await this.userRepository.getUsers();
    }

    async createUser(user) {
        return await this.userRepository.createUser(user);
    }

    async updateUser(user) {
        return await this.userRepository.updateUser(user);
    }



    async deleteUser(userId) {
        return await this.userRepository.deleteUser(userId);
    }

}