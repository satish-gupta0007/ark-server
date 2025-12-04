export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();
  const refreshToken = user.generateRefreshToken();
  const userData = user.toObject();
  delete userData.password;
  res
    .status(statusCode)
    .cookie("adminToken", token, {
       expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
      httpOnly: true,
    })
     .cookie("adminRefresh", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
        user: userData,
      message,
      // token,
    });
};

export const sendTokenForStudent = (user, statusCode, message, res) => {
  const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();

  const userData = user.toObject();
  delete userData.password;
  res
    .status(statusCode)
    .cookie("studentToken", token, {
      // expires: new Date(
      //   Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      // ),
       expires: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
      httpOnly: true,
    })
    .cookie("studentRefresh", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
       maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
        user: userData,
      message,
      // token,
    });
};
