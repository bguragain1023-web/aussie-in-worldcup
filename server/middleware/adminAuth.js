const accesskey = process.env.ADMIN_PASSWORD;
const demoPassword = "worldcup2026";

export const adminAuth = (req, res, next) => {
  const password = req.headers["x-admin-password"];
  if (password === accesskey) {
    req.role = "admin";
    next();
  } else if (password === demoPassword) {
    req.role = "demo";
    next();
  } else {
    return res.status(401).json({
      message: "Unauthorized - Password not valid",
    });
  }
};
