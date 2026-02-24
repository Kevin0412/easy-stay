const jwt = require('jsonwebtoken');

/**
 * 验证 JWT token
 */
function authenticate(req, res, next) {
  const auth_header = req.headers.authorization;

  if (!auth_header || !auth_header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'authentication_required'
    });
  }

  const token = auth_header.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'invalid_token'
    });
  }
}

/**
 * 验证管理员权限
 */
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'admin_access_required'
    });
  }
  next();
}

/**
 * 验证商户权限
 */
function requireMerchant(req, res, next) {
  if (req.user.role !== 'merchant' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'merchant_access_required'
    });
  }
  next();
}

/**
 * 可选验证 JWT token（有token就解析，没有就跳过）
 */
function optionalAuth(req, res, next) {
  const auth_header = req.headers.authorization;
  if (auth_header && auth_header.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(auth_header.substring(7), process.env.JWT_SECRET);
    } catch (error) {
      // token无效，忽略
    }
  }
  next();
}

module.exports = {
  authenticate,
  optionalAuth,
  requireAdmin,
  requireMerchant
};
