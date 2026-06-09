const accesskey = process.env.ADMIN_PASSWORD;

export const adminAuth = (req, res, next) => {
  const password = req.headers["x-admin-password"];
  if (password === accesskey) next();
  else {
    return res.status(401).json({
      message: "Unauthorized - Password not valid",
    });
  }
};
