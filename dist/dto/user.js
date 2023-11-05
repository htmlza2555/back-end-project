"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserDto = void 0;
const toUserDto = (user) => {
    const userDTO = Object.assign(Object.assign({}, user), { registeredAt: user.registeredAt.toISOString() });
    return userDTO;
};
exports.toUserDto = toUserDto;
