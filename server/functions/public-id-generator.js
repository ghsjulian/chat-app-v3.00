
const getPublicId = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "user-avatar-id--" + randomNumber.toString();
};

module.exports = getPublicId