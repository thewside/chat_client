const LOGIN_SYMBOL_LENGTH_MAX = 20;
const LOGIN_SYMBOL_LENGTH_MIN = 4;
const PASSWORD_SYMBOL_LENGTH_MAX = 20;
const PASSWORD_SYMBOL_LENGTH_MIN = 6;

export const validationForms = (formLogin, formPassword)=>{
    const login = formLogin.trim(),
          password = formPassword.trim();

    if(!password && !login) return {error: true, login: ERROR_TYPES.EMPTY, password: ERROR_TYPES.EMPTY}

    if(!login   ) return {error: true, login:    ERROR_TYPES.EMPTY}
    if(!password) return {error: true, password: ERROR_TYPES.EMPTY}

    if(login.length > LOGIN_SYMBOL_LENGTH_MAX) return {error: true, login: ERROR_TYPES.LENGTH_LOGIN};
    if(login.length < LOGIN_SYMBOL_LENGTH_MIN) return {error: true, login: ERROR_TYPES.SHORT_LOGIN};

    if(password.length > PASSWORD_SYMBOL_LENGTH_MAX) return {error: true, password: ERROR_TYPES.LENGTH_PASSWORD};
    if(password.length < PASSWORD_SYMBOL_LENGTH_MIN) return {error: true, password: ERROR_TYPES.SHORT_PASSWORD};

    if(!onValidUsername(login)) return {error: true, login: ERROR_TYPES.LOGIN_SYMBOL};

    return {error: false, login: login, password: password}
}

const onValidUsername = (val) => {
    const usernameRegex = /^[a-z0-9_.]+$/
   return usernameRegex.test(val);
};

const ERROR_TYPES = {
    LOGIN_SYMBOL: "В поле ввода должны быть латинские буквы и цифры от 0 до 9.",

    SHORT_LOGIN:  `Логин должен содержать как минимум ${LOGIN_SYMBOL_LENGTH_MIN} символа.`,
    LENGTH_LOGIN: `Логин должен превышать ${LOGIN_SYMBOL_LENGTH_MAX} символов.`,

    SHORT_PASSWORD:  `Пароль должен содержать как минимум ${PASSWORD_SYMBOL_LENGTH_MIN} символа.`,
    LENGTH_PASSWORD: `Пароль не должно превышать ${LOGIN_SYMBOL_LENGTH_MAX} символов.`,

    EMPTY: "Заполните это поле.",
};