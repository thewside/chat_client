const showTooltipLogin = (func, value) => {
    func(prev=>({
        ...prev,
        login:{
            ...prev.login,
                value: value,
                visibility: "visible"
        }
    }))
};

const showTooltipPassword = (func, value) => {
    func(prev=>({
        ...prev,
        password:{
            ...prev.password,
                value: value,
                visibility: "visible"
        }
    }))
}

const hideTooltips = (func) => {
    func(prev=>({
        ...prev,
        login:{
            ...prev.login,
                value: "",
                visibility: "hidden"
        },
        password:{
            ...prev.password,
                value: "",
                visibility: "hidden"
        },
    }))
}

export {showTooltipLogin, showTooltipPassword, hideTooltips}