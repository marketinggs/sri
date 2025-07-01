const envCheck = () => {
  let env = process.env;
  let missingVars = [];

  ['MAILMODO_API_KEY'].forEach(function (varname) {
    if (!Object.prototype.hasOwnProperty.call(env, varname)) {
      missingVars.push(varname);
    }
  });

  /* Validate envs only required for production */
  if (env.NODE_ENV === 'production') {
    ['MAILMODO_API_KEY'].forEach(function (varname) {
      if (!Object.prototype.hasOwnProperty.call(env, varname)) {
        missingVars.push(varname);
      }
    });
  }

  if (missingVars.length > 0) {
    throw new Error(
      'Required env vars ' +
        missingVars.join(', ') +
        ' are not defined, but should be for this service to run'
    );
  }
};

export default envCheck;
