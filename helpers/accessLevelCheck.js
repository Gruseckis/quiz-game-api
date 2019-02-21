function accessLevelCheck (userLevel, accessLevel){
    const levels = ['user', 'quizer', 'moderator', 'admin'];
    if (levels.indexOf(userLevel) >= levels.indexOf(accessLevel)){
        return true
    }else {
        return false
    }
}

export {accessLevelCheck}