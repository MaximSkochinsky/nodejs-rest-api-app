import { APILogger } from '../logger/api.logger';
import { UserService } from '../service/user.service';

export class UserController {

    private userService: UserService;
    private logger: APILogger;

    constructor() {
        this.userService = new UserService();
        this.logger = new APILogger()
    }

    async getUsers() {
        return await this.userService.getUsers();
    }

    async getUser(email) {
        return await this.userService.getUser(email)
    }

    async createUser(user) {
        return await this.userService.createUser(user);
    }

    async updateUser(user) {
        return await this.userService.updateUser(user);
    }

    async deleteUser(userId) {
        return await this.userService.deleteUser(userId);
    }
}