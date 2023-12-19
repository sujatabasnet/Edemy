//we hash the users password before saving in the database
// we compare the password(after hashing) with the one in the database (which is also hashed)
// bcrypt is a nodejs library



import bcrypt from 'bcrypt'

export const hashPassword = (password) =>{
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if(err) {
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};

export const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}
