# imply
Reusable Promise chains

Imply is a small promise chain accumulator which allows the creation of reusable chains. It permits both chained and separate additions.

    var checkUser = Imply();
    
    // Build a set of actions
    checkUser.then(extractToken);
    checkUser.then(validateToken).then(authorizeUser);
    checkUser.then(logSuccess).catch(reportandPassError);
    
    // Apply the actions to multiple promises
    ee.on('login', function(user) { 
        checkUser.for(getUserCredentials(user)).then(launchShell, youDidntSayTheMagicWord);
    });
    
    ee.on('switchUser', function(user, newuser) { 
        var switchPromise = getSwitchCredential(user, newuser);
        checkUser.using(switchPromise).then(switchUser, showSwitchError);
    });
    
