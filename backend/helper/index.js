import bcrypt from "bcryptjs";

export const confirmPassword = async(inputPassword, storedPassword) => {
    const isMatch =await bcrypt.compare(inputPassword, storedPassword);
    return isMatch
}