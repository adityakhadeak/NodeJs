export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role_id === 27) { 
        return next(); 
    } else {
        return res.status(403).json({ message: 'Only Admin Have Access to this Access Denied' });
    }
};

export const isStudent = (req, res, next) => {
    if (req.user && req.user.role_id === 25) { 
        return next(); 
    } else {
        return res.status(403).json({ message: 'Access Denied' });
    }
};

// isTeacher middleware
export const isTeacher = (req, res, next) => {
    if (req.user && req.user.role_id === 26) { 
        return next(); 
    } else {
        return res.status(403).json({ message: 'Access Denied' });
    }
};

export const isAdminOrStudent = (req, res, next) => {
    if (req.user && (req.user.role_id === 27 || req.user.role_id === 25)) {
        return next();
    } else {
        return res.status(403).json({ message: 'Access Denied' });
    }
};

export const isAdminOrTeacher = (req, res, next) => {
    if (req.user && (req.user.role_id === 27 || req.user.role_id === 26)) {
        return next();
    } else {
        return res.status(403).json({  message: 'Access Denied' });
    }
};

export const isStudentAndTeacher = (req, res, next) => {
    if (req.user && req.user.role_id === 25 && req.user.role_id === 26) {
        return next();
    } else {
        return res.status(403).json({  message: 'Access Denied' });
    }
};