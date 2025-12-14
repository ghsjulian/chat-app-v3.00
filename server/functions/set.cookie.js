const setCookie = (res, token) => {
  res.cookie("chatappv3", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
   // domain: "http://localhost:5000",
    path: "/",
  });
  return true;
};

module.exports = setCookie;
