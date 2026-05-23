export const API = {
    BASE_URL: {
        DEV_URL: "https://dev.sanatancloud.org/api",
    },
    AUTH_URL: {
        DEVOTEE_LOGIN: "/v1/devotee/login",
        DEVOTEE_LOGIN_WITHPASS: "/v1/devotee/app/login",
        DEVOTEE_SEND_OTP: "/v1/devotee/sendotp",
        DEVOTEE_REGISTER: "/v1/devotee/app/registration",
        MY_PROFILE: "/v1/user/profile"
    },
    DEVOTEE_INFO: {
        DEVOTEE_MYDONATION: "/v1/bo/donation/filter"
    },
    EVENT: {
        EVENT_LIST: "/v1/event/search"
    },
    DONATION: {
        DONATION_LIST: "/v1/seva/search",
        DONATION_PAYMENT: "/v1/devotee/registration",
        DONATION_VERIFY: "/v1/payment/razorpay/verify",
        DEVOTEE_DETAILS_UPDATE: "/v1/user/update",
        DONATION_INVOICE: (id: string) => `/v1/bo/donation/receipt/${id}`
    },
    UTILS: {
        COUNTRY: "/v1/country",
        STATE: "/v1/state",
        CITY: "/v1/city",
        LOG_OUT: "/v1/logout",
    }
}